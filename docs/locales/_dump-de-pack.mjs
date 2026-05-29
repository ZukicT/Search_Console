import { writeFileSync } from 'fs';
import { locales } from './blog-overlay-data.mjs';

writeFileSync(
  new URL('./overlay-packs/de.json', import.meta.url),
  JSON.stringify(locales.de, null, 2) + '\n',
  'utf8'
);
