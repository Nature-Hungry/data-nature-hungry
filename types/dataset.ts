export type DatasetFormat = "csv" | "xlsx" | "shapefile" | "geojson";

export interface DatasetRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  format: DatasetFormat;
  fileName: string;
  /** Object key inside the R2 bucket. */
  key: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export const CATEGORIES = [
  "Biodiversity",
  "Climate",
  "Marine",
  "Terrestrial",
  "Water Resources",
  "Geospatial",
  "Conservation",
  "Other",
] as const;

export const FORMAT_EXTENSIONS: Record<DatasetFormat, string[]> = {
  csv: [".csv"],
  xlsx: [".xlsx", ".xls"],
  shapefile: [".zip"],
  geojson: [".geojson", ".json"],
};

export function detectFormat(fileName: string): DatasetFormat | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "xlsx";
  if (lower.endsWith(".zip")) return "shapefile";
  if (lower.endsWith(".geojson") || lower.endsWith(".json")) return "geojson";
  return null;
}
