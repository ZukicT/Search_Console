(function () {
  function translate(key, fallback) {
    if (window.SC_I18N && typeof SC_I18N.t === 'function') {
      var value = SC_I18N.t(key);
      if (value) return value;
    }
    return fallback || '';
  }

  function initContactForm() {
    var meta = document.querySelector('meta[name="download-ping-api"]');
    var apiBase = meta && meta.getAttribute('content') ? meta.getAttribute('content').trim() : '';
    var contactForm = document.getElementById('contact-form');
    var contactNote = document.getElementById('contact-note');
    if (!contactForm || !contactNote || !apiBase) return;

    var contactUrl = apiBase.replace(/\/$/, '') + '/api/contact';
    var submitButton = contactForm.querySelector('button[type="submit"], button:not([type])');

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = contactForm.querySelector('input[name="name"]').value.trim();
      var email = contactForm.querySelector('input[name="email"]').value.trim();
      var message = contactForm.querySelector('textarea[name="message"]').value.trim();
      if (!name || !email || !message || !submitButton) return;

      submitButton.disabled = true;
      submitButton.textContent = translate('footer.sending', 'Sending...');

      fetch(contactUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message })
      })
        .then(function (res) {
          if (res.ok) {
            contactNote.textContent = translate('footer.messageSent', 'Message sent! I\'ll get back to you soon.');
            contactNote.className = 'contact-note success';
            contactForm.reset();
          } else {
            contactNote.textContent = translate('footer.messageError', 'Something went wrong. Try again later.');
            contactNote.className = 'contact-note error';
          }
        })
        .catch(function () {
          contactNote.textContent = translate('footer.messageErrorConnect', 'Could not connect. Try again later.');
          contactNote.className = 'contact-note error';
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = translate('footer.sendMessage', 'Send message');
        });
    });

    document.addEventListener('locale:applied', function () {
      if (submitButton && !submitButton.disabled) {
        submitButton.textContent = translate('footer.sendMessage', 'Send message');
      }
    });
  }

  function initShareButton() {
    var socialShareBtn = document.getElementById('social-share-btn');
    if (!socialShareBtn) return;

    function sharePayload() {
      return {
        title: translate('share.title', 'Search Console for iOS'),
        text: translate('share.text', 'Native iOS app for Google Search Console - track your search rankings from your iPhone.'),
        url: 'https://search-console.org'
      };
    }

    socialShareBtn.addEventListener('click', function () {
      var shareData = sharePayload();
      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
        return;
      }
      navigator.clipboard.writeText(shareData.url).then(function () {
        socialShareBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(function () {
          socialShareBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
        }, 2000);
      });
    });
  }

  function init() {
    initContactForm();
    initShareButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
