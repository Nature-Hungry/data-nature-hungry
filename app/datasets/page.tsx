import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { DatasetCard } from "@/components/DatasetCard";
import { getCatalog } from "@/lib/metadata";

export const revalidate = 0;

export default async function DatasetsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const catalog = await getCatalog();
  const q = searchParams.q?.toLowerCase().trim();
  const category = searchParams.category;

  let results = catalog;
  if (category) results = results.filter((d) => d.category === category);
  if (q) {
    // split into words so word order/spacing doesn't matter, and match any field
    const terms = q.split(/\s+/).filter(Boolean);
    results = results.filter((d) => {
      const haystack =
        `${d.title} ${d.description} ${d.category}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-heading text-2xl font-bold text-primary">Browse datasets</h1>
      <div className="mb-4">
        <SearchBar />
      </div>
      <div className="mb-8">
        <CategoryPills />
      </div>
      <p className="mb-4 text-sm text-ink-muted">
        {results.length} dataset{results.length === 1 ? "" : "s"} found
      </p>
      {results.length === 0 ? (
        <p className="text-ink-muted">No datasets match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  );
}
