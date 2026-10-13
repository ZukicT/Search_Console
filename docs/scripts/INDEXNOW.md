# IndexNow

The root key file proves ownership and is intentionally public. The deployment build writes `indexnow-deploy.txt` containing the deployed commit SHA. The GitHub workflow waits up to 20 minutes for that exact commit and key file before submitting the live sitemap to IndexNow. A missing deployment, invalid sitemap, wrong host, or missing key fails without submitting URLs.

Only sitemap page URLs are submitted; image entries are excluded. HTTP 200 means received; HTTP 202 means key validation is pending. Neither response guarantees indexing. Existing privacy and crawler exclusions remain in effect.

Run `node scripts/indexnow.mjs --dry-run --sitemap public/sitemap.xml` to validate without contacting IndexNow. Run `node scripts/indexnow.mjs --wait` after a deployment to submit manually. For the Search Console website, use `docs/scripts/indexnow.mjs` and `docs/sitemap.xml`. For Nuvio use `sitemap.xml`. VectisERP generates its sitemap during the Next.js build.

Run `node --test scripts/indexnow.test.mjs` (or the `docs/scripts` path) for validation tests. To roll back, revert the IndexNow setup commit and redeploy.
