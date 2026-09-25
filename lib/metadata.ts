import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getBucketName, isR2Configured } from "@/lib/r2";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { DatasetRecord } from "@/types/dataset";

const CATALOG_KEY = "catalog.json";

/** Reads the dataset catalog index stored as a single JSON object in R2. */
export async function getCatalog(): Promise<DatasetRecord[]> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const bucket = (env as Record<string, unknown>).DATA_BUCKET as
      | { get(key: string): Promise<{ text(): Promise<string> } | null> }
      | undefined;
    if (bucket) {
      const object = await bucket.get(CATALOG_KEY);
      return object ? (JSON.parse(await object.text()) as DatasetRecord[]) : [];
    }
  } catch {
    // Fall back to S3 for local development.
  }

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
    console.error("Unable to read dataset catalog from R2", err);
    return [];
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
