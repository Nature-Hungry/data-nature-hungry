import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/lib/metadata";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dataset = await getDataset(params.id);
  if (!dataset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ dataset });
}
