const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

const { guard, looksAutomated, isEmail } = require('./_guard');

module.exports = async function handler(req, res) {
  if (!(await guard(req, res, { name: 'waitlist', limit: 5, windowSeconds: 600 }))) return;

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (looksAutomated(body)) {
    return res.status(200).json({ ok: true });
  }

  const email = body.email;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  const trimmed = email.trim().toLowerCase();
  if (!isEmail(trimmed)) {
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
