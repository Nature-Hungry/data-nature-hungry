import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/lib/metadata";
import { getPresignedDownloadUrl } from "@/lib/r2";

// Public download endpoint — intentionally requires no authentication.
// Redirects to a short-lived signed R2 URL so files of any size are served
// directly by R2 instead of being buffered through this app's server.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dataset = await getDataset(params.id);
  if (!dataset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = await getPresignedDownloadUrl(dataset.key, dataset.fileName);
  return NextResponse.redirect(url, { status: 302 });
}

