import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/lib/metadata";
import { getObjectBuffer } from "@/lib/r2";
import { buildPreview, MAX_PREVIEW_FILE_SIZE_BYTES } from "@/lib/preview";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataset = await getDataset(id);
  if (!dataset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Avoid buffering huge files into memory just to render a preview.
  if (dataset.sizeBytes > MAX_PREVIEW_FILE_SIZE_BYTES) {
    return NextResponse.json({ preview: { kind: "too-large" } });
  }

  try {
    const buffer = await getObjectBuffer(dataset.key);
    const preview = await buildPreview(
      dataset.format,
      buffer,
      request.nextUrl.searchParams.get("sheet") ?? undefined
    );
    return NextResponse.json({ preview });
  } catch (err) {
    console.error("Failed to build preview", err);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
