/**
 * Site contact form: POSTs to Discord through a server-side webhook env var only.
 */

const { guard, looksAutomated, isEmail, plain } = require('./_guard');

module.exports = async function handler(req, res) {
  if (!(await guard(req, res, { name: 'contact', limit: 5, windowSeconds: 600 }))) return;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  // Bots get the same answer as people, so they learn nothing, but nothing is sent.
  if (looksAutomated(body)) {
    return res.status(200).json({ ok: true });
  }

  const name = plain(body.name, 120);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = plain(body.message, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '**Site contact form**\n**From:** ' + name + ' (' + plain(email, 200) + ')\n**Message:** ' + message,
        allowed_mentions: { parse: [] },
      }),
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true });
};
