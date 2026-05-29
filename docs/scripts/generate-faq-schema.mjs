#!/usr/bin/env node
/**
 * Regenerate FAQPage JSON-LD in index.html from locales/en.json faq.* keys.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, '..', 'locales', 'en.json');
const indexPath = path.join(__dirname, '..', 'index.html');
const START = '  <script type="application/ld+json" id="faq-schema">\n';
const END = '  </script>\n  <script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "HowTo"';

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const faq = en.faq;
const mainEntity = [];

for (let i = 1; i <= 17; i += 1) {
  const question = faq[`q${i}`];
  const answer = faq[`a${i}`];
  if (typeof question !== 'string' || typeof answer !== 'string') continue;
  mainEntity.push({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripHtml(answer),
    },
  });
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['#faq .faq-question', '#faq .faq-answer-inner'],
  },
  mainEntity,
};

const block = `${START}${JSON.stringify(schema, null, 2)}\n  </script>\n  <script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "HowTo"`;

const html = fs.readFileSync(indexPath, 'utf8');
const pattern = /  <script type="application\/ld\+json"(?: id="faq-schema")?>\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?  <\/script>\s*  <script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "HowTo"/;

if (!pattern.test(html)) {
  console.error('Could not find FAQPage JSON-LD block in index.html');
  process.exit(1);
}

const updated = html.replace(pattern, block);
fs.writeFileSync(indexPath, updated, 'utf8');
console.log(`Updated FAQ schema with ${mainEntity.length} questions.`);
