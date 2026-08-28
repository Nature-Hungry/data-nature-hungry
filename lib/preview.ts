import Papa from "papaparse";
import * as XLSX from "xlsx";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shp = require("shpjs");
import type { DatasetFormat } from "@/types/dataset";

export interface TablePreview {
  kind: "table";
  columns: string[];
  rows: Record<string, unknown>[];
  totalRowsInPreview: number;
}

export interface ShapefilePreview {
  kind: "shapefile";
  featureCount: number;
  geometryTypes: string[];
  sampleProperties: Record<string, unknown>[];
  bbox?: number[];
}

export interface TooLargePreview {
  kind: "too-large";
}

export type Preview = TablePreview | ShapefilePreview | TooLargePreview;

const MAX_PREVIEW_ROWS = 50;
export const MAX_PREVIEW_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export async function buildPreview(
  format: DatasetFormat,
  buffer: Buffer
): Promise<Preview> {
  if (format === "csv") {
    const text = buffer.toString("utf-8");
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      preview: MAX_PREVIEW_ROWS,
    });
    const columns = parsed.meta.fields ?? [];
    return {
      kind: "table",
      columns,
      rows: parsed.data,
      totalRowsInPreview: parsed.data.length,
    };
  }

  if (format === "xlsx") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    }).slice(0, MAX_PREVIEW_ROWS);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return {
      kind: "table",
      columns,
      rows,
      totalRowsInPreview: rows.length,
    };
  }

  // Shapefile: expects a .zip containing .shp/.dbf/.shx/.prj
  if (format === "shapefile") {
    const geojson = await shp(buffer);
    return summarizeGeojson(geojson);
  }

  // GeoJSON: already-parsed feature collection.
  const geojson = JSON.parse(buffer.toString("utf-8"));
  return summarizeGeojson(geojson);
}

function summarizeGeojson(geojson: any): ShapefilePreview {
  const collection = Array.isArray(geojson) ? geojson[0] : geojson;
  const features = collection?.features ?? [];
  const geometryTypes = Array.from(
    new Set(features.map((f: any) => f?.geometry?.type).filter(Boolean))
  ) as string[];
  const sampleProperties = features
    .slice(0, MAX_PREVIEW_ROWS)
    .map((f: any) => f.properties ?? {});

  return {
    kind: "shapefile",
    featureCount: features.length,
    geometryTypes,
    sampleProperties,
  };
}
