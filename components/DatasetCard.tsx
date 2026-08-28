import Link from "next/link";
import type { DatasetRecord } from "@/types/dataset";

const FORMAT_LABELS: Record<DatasetRecord["format"], string> = {
  csv: "CSV",
  xlsx: "Excel",
  shapefile: "Shapefile",
  geojson: "GeoJSON",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DatasetCard({ dataset }: { dataset: DatasetRecord }) {
  return (
    <Link
      href={`/datasets/${dataset.id}`}
      className="flex flex-col rounded-lg border border-line bg-white p-5 transition hover:border-rose hover:shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-surface px-2 py-0.5 text-xs font-semibold uppercase text-primary">
          {FORMAT_LABELS[dataset.format]}
        </span>
        <span className="text-xs text-ink-muted">{dataset.category}</span>
      </div>
      <h3 className="mb-1 font-heading font-bold text-ink">{dataset.title}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-ink-muted">
        {dataset.description || "No description provided."}
      </p>
      <div className="mt-auto flex items-center justify-between text-xs text-ink-muted">
        <span>{formatSize(dataset.sizeBytes)}</span>
        <span>{new Date(dataset.uploadedAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
