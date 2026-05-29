import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  blogEn,
  blogCommonEn,
  blogPostCtrEn,
  blogPostTrafficEn,
  blogPostCwvEn,
  blogPostIndexingEn,
} from './blog-overlay-data.mjs';

const dir = dirname(fileURLToPath(import.meta.url));
writeFileSync(
  join(dir, 'overlay-packs/en.json'),
  JSON.stringify(
    {
      navBlog: 'Blog',
      blog: blogEn,
      blogCommon: blogCommonEn,
      blogPostCtr: blogPostCtrEn,
      blogPostTraffic: blogPostTrafficEn,
      blogPostCwv: blogPostCwvEn,
      blogPostIndexing: blogPostIndexingEn,
    },
    null,
    2
  ) + '\n',
  'utf8'
);
