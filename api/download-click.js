/**
 * Download click ping – POSTs to Discord when a user clicks a Download/App Store link.
 * Webhook URL via DISCORD_DOWNLOAD_WEBHOOK_URL. Optional counter via Upstash Redis.
 */

const { guard, plain } = require('./_guard');

const REDIS_KEY = 'search-console:download-clicks';
const MSG_ID_PAD = 6;

function decodeLocation(value) {
  if (!value || typeof value !== 'string') return '';
  const s = String(value).trim().slice(0, 100);
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch (_) {
    return s;
  }
}

function formatMsgId(n) {
  return String(n).padStart(MSG_ID_PAD, '0');
}

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
  if (!(await guard(req, res, { name: 'download', limit: 20, windowSeconds: 60 }))) return;

  const webhookUrl = process.env.DISCORD_DOWNLOAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  let count = null;
  try {
    count = await incrementDownloadCount();
  } catch (_) {}

  const source = plain(req.body && req.body.source, 120) || 'website';
  const country = (req.headers && (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'])) || null;
  const city = (req.headers && req.headers['x-vercel-ip-city']) || null;
  const region = (req.headers && req.headers['x-vercel-ip-country-region']) || null;

  const countryStr = country ? String(country).toUpperCase() : 'n/a';
  const cityDecoded = decodeLocation(city);
  const regionDecoded = decodeLocation(region);
  const cityOrRegion = cityDecoded || regionDecoded || 'n/a';

  const msgId = count !== null ? formatMsgId(count) : null;
  let title = 'Download button clicked';
  if (msgId !== null) title += ' #' + msgId;

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
  if (msgId !== null) {
    embed.footer = { text: 'Message ID: ' + msgId + ' (total pings)' };
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed], allowed_mentions: { parse: [] } }),
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true, count: count });
};
