"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar({ large = false }: { large?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.push(`/datasets?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search our datasets (e.g. Reclamation)
        className={`w-full rounded-lg border border-line bg-white px-4 ${
          large ? "py-3 text-base" : "py-2 text-sm"
        } focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
      />
      <button
        type="submit"
        className="rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-hover"
      >
        Search
      </button>
    </form>
  );
}
