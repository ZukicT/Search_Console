const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1466648872771260508/bU5B75iRvvLYRysZGZXSizfGgQm09IuBeGC-6eiw9DPnNLZcjjWhra9rFRGEmqTsR4Wp';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.keys(CORS_HEADERS).forEach(function (k) { res.setHeader(k, CORS_HEADERS[k]); });
    return res.status(204).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = (req.body && req.body.email) || (req.query && req.query.email);
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!DISCORD_WEBHOOK) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New waitlist signup: **${trimmed}**`,
      }),
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save' });
  }

  return res.status(200).json({ success: true });
}
