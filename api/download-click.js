/**
 * Download click ping – POSTs to Discord when a user clicks a Download/App Store link.
 * Webhook URL must be set via DISCORD_DOWNLOAD_WEBHOOK_URL (never in code).
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

  const source = (req.body && req.body.source) || (req.query && req.query.source) || 'website';
  const country = (req.headers && (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'])) || null;
  const city = (req.headers && req.headers['x-vercel-ip-city']) || null;
  const region = (req.headers && req.headers['x-vercel-ip-country-region']) || null;

  let location = '';
  if (country) {
    location = ' — Country: ' + String(country).toUpperCase();
    if (city) location += ', City: ' + String(city).slice(0, 60);
    if (region && !city) location += ', Region: ' + String(region).slice(0, 40);
  } else {
    location = ' — Country: unknown';
  }

  const message = 'Download button clicked (source: ' + String(source).slice(0, 80) + location + ')';

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true });
};
