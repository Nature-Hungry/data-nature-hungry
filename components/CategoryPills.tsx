"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/types/dataset";

export function CategoryPills() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/datasets"
        className={`rounded-lg border px-4 py-1.5 text-sm font-semibold ${
          !active
            ? "border-primary bg-surface text-primary"
            : "border-line text-ink-muted hover:bg-surface"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/datasets?category=${encodeURIComponent(category)}`}
          className={`rounded-lg border px-4 py-1.5 text-sm font-semibold ${
            active === category
              ? "border-primary bg-surface text-primary"
              : "border-line text-ink-muted hover:bg-surface"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
