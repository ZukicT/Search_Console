const GIF_BOTS = /Twitterbot|Discordbot|TelegramBot/i;
const WEBP_AVOID_BOTS = /facebookexternalhit|Facebot|WhatsApp|Pinterest|Googlebot/i;

module.exports = function handler(request, response) {
  const userAgent = request.headers['user-agent'] || '';
  const accept = request.headers['accept'] || '';
  const assetBase = '/og/social-card';

  if (GIF_BOTS.test(userAgent)) {
    response.setHeader('Cache-Control', 'public, max-age=86400');
    response.redirect(307, assetBase + '.gif');
    return;
  }

  if (accept.includes('image/webp') && !WEBP_AVOID_BOTS.test(userAgent)) {
    response.setHeader('Cache-Control', 'public, max-age=86400');
    response.redirect(307, assetBase + '.webp');
    return;
  }

  response.setHeader('Cache-Control', 'public, max-age=86400');
  response.redirect(307, assetBase + '.jpg');
};
