/**
 * Shared request guard for the site's API routes.
 *
 * - CORS limited to the site's own origins (and Vercel previews, and localhost for development)
 * - Per-IP rate limiting: Upstash Redis when configured, otherwise a per-instance memory window
 * - Body size and content-type checks
 * - A honeypot and a minimum fill time to turn away form bots
 *
 * Files starting with an underscore are not exposed as routes.
 */

const ALLOWED_ORIGINS = [
  'https://www.search-console.org',
  'https://search-console.org',
];

const MAX_BODY_BYTES = 8 * 1024;
const memoryWindows = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const first = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '';
  return first || req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

async function overLimitRedis(key, limit, windowSeconds) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const response = await fetch(url.replace(/\/$/, '') + '/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify([['INCR', key], ['EXPIRE', key, String(windowSeconds), 'NX']]),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const count = data && data[0] && typeof data[0].result === 'number' ? data[0].result : null;
    return count === null ? null : count > limit;
  } catch (_) {
    return null;
  }
}

function overLimitMemory(key, limit, windowSeconds) {
  const now = Date.now();
  const entry = memoryWindows.get(key);
  if (!entry || now > entry.resetAt) {
    memoryWindows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    // Keep the map from growing without bound on a long-lived instance.
    if (memoryWindows.size > 5000) {
      memoryWindows.forEach(function (value, k) { if (now > value.resetAt) memoryWindows.delete(k); });
    }
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

/**
 * Runs the common checks. Returns true when the request may continue; otherwise the response
 * has already been sent.
 */
async function guard(req, res, options) {
  const name = options.name;
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }

  // Browsers always send Origin on a cross-site POST; a request from another site is refused.
  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  const length = parseInt(req.headers['content-length'] || '0', 10);
  if (length > MAX_BODY_BYTES) {
    res.status(413).json({ error: 'Payload too large' });
    return false;
  }
  const contentType = String(req.headers['content-type'] || '');
  if (length > 0 && contentType.indexOf('application/json') === -1) {
    res.status(415).json({ error: 'Unsupported content type' });
    return false;
  }

  const key = 'search-console:rl:' + name + ':' + clientIp(req);
  let limited = await overLimitRedis(key, options.limit, options.windowSeconds);
  if (limited === null) limited = overLimitMemory(key, options.limit, options.windowSeconds);
  if (limited) {
    res.setHeader('Retry-After', String(options.windowSeconds));
    res.status(429).json({ error: 'Too many requests' });
    return false;
  }
  return true;
}

/** True when a form submission looks automated: the hidden field is filled, or it arrived too fast. */
function looksAutomated(body) {
  if (!body || typeof body !== 'object') return false;
  if (typeof body.website === 'string' && body.website.trim() !== '') return true;
  if (typeof body.elapsed === 'number' && body.elapsed >= 0 && body.elapsed < 1500) return true;
  return false;
}

function isEmail(value) {
  return typeof value === 'string' && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Stops user text from pinging people or forming links and formatting in Discord. */
function plain(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000b-\u001f]/g, '').replace(/@/g, '@​').replace(/`/g, "'").trim().slice(0, maxLen);
}

module.exports = { guard: guard, looksAutomated: looksAutomated, isEmail: isEmail, plain: plain };
