/**
 * Download click ping – POSTs to Discord when a user clicks a Download/App Store link.
 * Webhook URL via DISCORD_DOWNLOAD_WEBHOOK_URL. Optional counter via Upstash Redis.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const REDIS_KEY = 'search-console:download-clicks';

async function incrementDownloadCount() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(['INCR', REDIS_KEY]),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.result === 'number' ? data.result : null;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.keys(CORS_HEADERS).forEach(function (k) {
      res.setHeader(k, CORS_HEADERS[k]);
    });
    return res.status(204).end();
  }
  Object.keys(CORS_HEADERS).forEach(function (k) {
    res.setHeader(k, CORS_HEADERS[k]);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_DOWNLOAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  let count = null;
  try {
    count = await incrementDownloadCount();
  } catch (_) {}

  const source = (req.body && req.body.source) || (req.query && req.query.source) || 'website';
  const country = (req.headers && (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'])) || null;
  const city = (req.headers && req.headers['x-vercel-ip-city']) || null;
  const region = (req.headers && req.headers['x-vercel-ip-country-region']) || null;

  const countryStr = country ? String(country).toUpperCase() : '—';
  const cityOrRegion = (city && String(city).trim()) ? String(city).slice(0, 100) : (region && String(region).trim()) ? String(region).slice(0, 100) : '—';

  let title = 'Download button clicked';
  if (count !== null) title += ' #' + String(count);

  const fields = [
    { name: 'Source', value: String(source).slice(0, 256), inline: true },
    { name: 'Country', value: countryStr, inline: true },
    { name: 'City / Region', value: cityOrRegion, inline: true },
  ];

  const embed = {
    title: title,
    color: 0x22c55e,
    fields: fields,
    timestamp: new Date().toISOString(),
  };
  if (count !== null) {
    embed.footer = { text: 'Total download pings: ' + String(count) };
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true, count: count });
};
