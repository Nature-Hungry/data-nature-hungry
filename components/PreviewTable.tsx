"use client";

import { useEffect, useState } from "react";
import type { Preview } from "@/lib/preview";

export function PreviewTable({ datasetId }: { datasetId: string }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/datasets/${datasetId}/preview`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load preview");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPreview(data.preview);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [datasetId]);

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading preview…</p>;
  }
  if (error) {
    return <p className="text-sm text-primary">{error}</p>;
  }
  if (!preview) return null;

  if (preview.kind === "too-large") {
    return (
      <p className="text-sm text-ink-muted">
        This file is too large to preview in the browser. Use the download
        button to get the full file.
      </p>
    );
  }

  if (preview.kind === "table") {
    return (
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-navy text-white">
            <tr>
              {preview.columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-3 py-2 text-left font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {preview.rows.map((row, i) => (
              <tr key={i} className="even:bg-surface">
                {preview.columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-3 py-2 text-ink">
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Shapefile preview
  return (
    <div className="space-y-3 rounded-lg border border-line p-4 text-sm">
      <p className="text-ink">
        <span className="font-semibold">{preview.featureCount}</span> features ·{" "}
        geometry types: {preview.geometryTypes.join(", ") || "unknown"}
      </p>
      {preview.sampleProperties.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-navy text-white">
              <tr>
                {Object.keys(preview.sampleProperties[0]).map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-3 py-2 text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {preview.sampleProperties.map((row, i) => (
                <tr key={i} className="even:bg-surface">
                  {Object.keys(preview.sampleProperties[0]).map((col) => (
                    <td key={col} className="whitespace-nowrap px-3 py-2 text-ink">
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
