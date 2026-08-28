import { notFound } from "next/navigation";
import { getDataset } from "@/lib/metadata";
import { PreviewTable } from "@/components/PreviewTable";

export const revalidate = 0;

const FORMAT_LABELS: Record<string, string> = {
  csv: "CSV",
  xlsx: "Excel",
  shapefile: "ESRI Shapefile",
  geojson: "GeoJSON",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DatasetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dataset = await getDataset(params.id);
  if (!dataset) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 rounded-lg border border-line bg-white p-5 lg:sticky lg:top-24 lg:z-10">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-surface px-2 py-0.5 text-xs font-semibold uppercase text-primary">
                {FORMAT_LABELS[dataset.format]}
              </span>
              <span className="text-xs text-ink-muted">{dataset.category}</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary">{dataset.title}</h1>
          </div>

          <p className="mb-8 text-ink-muted">
            {dataset.description || "No description provided."}
          </p>

          <h2 className="mb-3 font-heading text-lg font-bold text-ink">Preview</h2>
          <PreviewTable datasetId={dataset.id} />
        </div>

        <aside className="h-fit rounded-lg border border-line border-t-4 border-t-rose bg-white p-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Dataset details
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-ink-muted">File name</dt>
              <dd className="break-all font-medium text-ink">{dataset.fileName}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Size</dt>
              <dd className="font-medium text-ink">{formatSize(dataset.sizeBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Uploaded by</dt>
              <dd className="font-medium text-ink">{dataset.uploadedBy}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Uploaded on</dt>
              <dd className="font-medium text-ink">
                {new Date(dataset.uploadedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
          <a
            href={`/api/datasets/${dataset.id}/download`}
            className="mt-6 block w-full rounded-xl bg-accent px-4 py-2 text-center font-semibold text-white hover:bg-accent-hover"
          >
            Download dataset
          </a>
        </aside>
      </div>
    </div>
  );
}
