import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { CategoryPills } from "@/components/CategoryPills";
import { DatasetCard } from "@/components/DatasetCard";
import { getCatalog } from "@/lib/metadata";
import { CATEGORIES } from "@/types/dataset";

export const revalidate = 0;

export default async function HomePage() {
  const catalog = await getCatalog();
  const featured = catalog.slice(0, 6);
  const formats = new Set(catalog.map((d) => d.format));

  return (
    <div>
      <section className="border-b border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-3 font-heading text-4xl font-bold text-primary">
            Explore scientific datasets, freely
          </h1>
          <p className="mb-8 text-lg text-ink-muted">
            Browse and download open environmental and
            scientific datasets about Singapore's local biodiversity.
          </p>
          <div className="flex justify-center">
            <SearchBar large />
          </div>
          <div className="mt-6 flex justify-center">
            <CategoryPills />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-8 px-4 py-8 text-center">
          <div className="flex-1">
            <p className="font-heading text-3xl font-bold text-primary">{catalog.length}</p>
            <p className="text-sm text-ink-muted">datasets published</p>
          </div>
          <div className="flex-1">
            <p className="font-heading text-3xl font-bold text-primary">{formats.size}</p>
            <p className="text-sm text-ink-muted">supported formats</p>
          </div>
          <div className="flex-1">
            <p className="font-heading text-3xl font-bold text-primary">{CATEGORIES.length}</p>
            <p className="text-sm text-ink-muted">categories</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-light text-ink">Recently added datasets</h2>
          <Link href="/datasets" className="text-sm font-semibold text-primary hover:underline">
            View all datasets →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-ink-muted">
            No datasets published yet. Sign in and upload the first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
