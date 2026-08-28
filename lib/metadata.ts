import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getBucketName, isR2Configured } from "@/lib/r2";
import type { DatasetRecord } from "@/types/dataset";

const CATALOG_KEY = "catalog.json";

/** Reads the dataset catalog index stored as a single JSON object in R2. */
export async function getCatalog(): Promise<DatasetRecord[]> {
  // Lets pages render locally before R2 credentials are configured.
  if (!isR2Configured()) return [];

  const client = getR2Client();
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: CATALOG_KEY })
    );
    const stream = res.Body as NodeJS.ReadableStream;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const text = Buffer.concat(chunks).toString("utf-8");
    return JSON.parse(text) as DatasetRecord[];
  } catch (err: any) {
    if (err?.name === "NoSuchKey" || err?.$metadata?.httpStatusCode === 404) {
      return [];
    }
    throw err;
  }
}

export async function saveCatalog(records: DatasetRecord[]): Promise<void> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: CATALOG_KEY,
      Body: JSON.stringify(records, null, 2),
      ContentType: "application/json",
    })
  );
}

export async function getDataset(id: string): Promise<DatasetRecord | null> {
  const catalog = await getCatalog();
  return catalog.find((d) => d.id === id) ?? null;
}
