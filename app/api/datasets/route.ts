import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/metadata";

export async function GET(request: NextRequest) {
  const catalog = await getCatalog();
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  const category = request.nextUrl.searchParams.get("category");

  let results = catalog;
  if (category) {
    results = results.filter((d) => d.category === category);
  }
  if (q) {
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ datasets: results });
}
