# nature-hungry-data

An open data portal for scientific datasets (CSV, Excel, and ESRI Shapefiles),
inspired by [data.gov.sg](https://data.gov.sg). Anyone can browse, preview,
and download published datasets — no account required. There is no login on
the site itself: datasets and the catalog index are managed directly in the
Cloudflare R2 bucket by whoever has bucket access.

## Stack

- **Frontend/API**: Next.js 14 (App Router), deployed on Netlify via
  `@netlify/plugin-nextjs`.
- **Storage**: Cloudflare R2 bucket `nature-hungry-data`, accessed read-only
  through its S3-compatible API (`@aws-sdk/client-s3`). Dataset metadata is
  read from a `catalog.json` index object in the same bucket.
- **Previews**: CSV (`papaparse`), Excel (`xlsx`), and ESRI Shapefile ZIP
  bundles (`shpjs`) are parsed server-side to render an in-browser preview
  without requiring a download.

## Managing datasets

Since there's no upload UI, add/update/remove datasets by working directly
in the R2 bucket:

1. Upload the dataset file (e.g. via `rclone`, `aws s3 cp` against the R2
   S3-compatible endpoint, or the Cloudflare dashboard) under a key like
   `datasets/{id}/{filename}`.
2. Add a matching entry to `catalog.json` at the bucket root — an array of
   objects with `id`, `title`, `description`, `category`, `format`
   (`csv` | `xlsx` | `shapefile`), `fileName`, `key`, `sizeBytes`,
   `uploadedBy`, `uploadedAt`. See [types/dataset.ts](types/dataset.ts) for
   the exact shape.
3. To remove a dataset, delete its entry from `catalog.json` and (optionally)
   the underlying object(s).

The site only ever reads `catalog.json` and the dataset objects — it never
writes to the bucket.

## Local development

1. Copy `.env.example` to `.env.local` and fill in the Cloudflare R2
   credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_BUCKET_NAME`).
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## Deploying

- **Domain**: production site is served at **https://data.naturehungry.sg**.
  Add a CNAME record for `data.naturehungry.sg` pointing at your Netlify
  site, then add it as a custom domain in Netlify site settings.
- **GitHub**: push this repository to GitHub.
- **Netlify**: connect the GitHub repo to a new Netlify site. `netlify.toml`
  is already configured to build with `@netlify/plugin-nextjs`. Set the R2
  environment variables from `.env.example` in the Netlify site settings.
- **Cloudflare R2**: create the `nature-hungry-data` bucket and an R2 API
  token (S3 credentials, read-only is sufficient) scoped to that bucket for
  the app to use.

## Data model

Dataset metadata is stored as a single `catalog.json` object in the R2
bucket, containing an array of dataset records (title, description,
category, format, object key, size, uploader, timestamp). Files themselves
are stored under `datasets/{id}/{filename}`.
