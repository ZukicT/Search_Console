/**
 * Generates locales/blog-i18n-overlays.json from English blog source.
 * Run: node locales/_generate-blog-overlays.mjs
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import {
  blogEn,
  blogCommonEn,
  blogPostCtrEn,
  blogPostTrafficEn,
  blogPostCwvEn,
  blogPostIndexingEn,
  locales,
} from './blog-overlay-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function countKeys(obj) {
  return Object.keys(obj).length;
}

function localeBlock(navBlog, blog, blogCommon, blogPostCtr, blogPostTraffic, blogPostCwv, blogPostIndexing) {
  return {
    nav: { blog: navBlog },
    blog,
    blogCommon,
    blogPostCtr,
    blogPostTraffic,
    blogPostCwv,
    blogPostIndexing,
  };
}

function pack(L) {
  return localeBlock(
    L.navBlog,
    { ...blogEn, ...L.blog },
    { ...blogCommonEn, ...L.blogCommon },
    { ...blogPostCtrEn, ...L.blogPostCtr },
    { ...blogPostTrafficEn, ...L.blogPostTraffic },
    { ...blogPostCwvEn, ...L.blogPostCwv },
    { ...blogPostIndexingEn, ...L.blogPostIndexing }
  );
}

let out = { de: pack(locales.de) };
try {
  const extra = await import('./blog-overlay-locales.mjs');
  out = {
    de: pack(locales.de),
    ...Object.fromEntries(
      Object.entries(extra.OVERLAY_LOCALES).map(([code, L]) => [code, pack(L)])
    ),
  };
} catch (e) {
  if (e.code !== 'ERR_MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}

function countLocale(loc) {
  return (
    countKeys(loc.nav) +
    countKeys(loc.blog) +
    countKeys(loc.blogCommon) +
    countKeys(loc.blogPostCtr) +
    countKeys(loc.blogPostTraffic) +
    countKeys(loc.blogPostCwv) +
    countKeys(loc.blogPostIndexing)
  );
}

export { locales, pack, blogEn, blogCommonEn, blogPostCtrEn, blogPostTrafficEn, blogPostCwvEn, blogPostIndexingEn };

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  const outPath = join(__dirname, 'blog-i18n-overlays.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log('Wrote', outPath);
  for (const code of Object.keys(out)) {
    console.log(code + ':', countLocale(out[code]), 'keys');
  }
}
