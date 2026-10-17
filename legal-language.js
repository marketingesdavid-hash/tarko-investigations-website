(() => {
  const routes = {
    privacy: {en: '/privacy-policy.html', hu: '/hu/adatvedelmi-tajekoztato.html'},
    cookies: {en: '/cookie-policy.html', hu: '/hu/cookie-tajekoztato.html'},
    terms: {en: '/terms-and-conditions.html', hu: '/hu/felhasznalasi-feltetelek.html'}
  };
  const readPreference = () => {
    try { return localStorage.getItem('eil_language'); } catch { return null; }
  };
  const savePreference = lang => {
    try { localStorage.setItem('eil_language', lang); } catch {}
  };
  const updateLinks = () => {
    const lang = document.documentElement.lang === 'hu' ? 'hu' : 'en';
    document.querySelectorAll('a[href]').forEach(a => {
      if (a.hasAttribute('data-legal-language')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      for (const pair of Object.values(routes)) {
        const aliases = [pair.en, pair.hu, pair.en.replace(/\.html$/, ''), pair.hu.replace(/\.html$/, '')];
        if (aliases.includes(url.pathname)) {
          a.href = pair[lang] + '?lang=' + lang + url.hash;
          break;
        }
      }
    });
  };
  const key = document.body.dataset.legalPage;
  if (routes[key]) {
    const query = new URLSearchParams(location.search).get('lang');
    const lang = ['hu', 'en'].includes(query) ? query :
      ['hu', 'en'].includes(readPreference()) ? readPreference() : document.documentElement.lang;
    if (lang !== document.documentElement.lang) {
      location.replace(routes[key][lang] + '?lang=' + lang + location.hash);
      return;
    }
    savePreference(lang);
    document.querySelectorAll('[data-legal-language]').forEach(a => {
      a.href = routes[key][a.dataset.legalLanguage] + '?lang=' + a.dataset.legalLanguage;
      if (a.dataset.legalLanguage === lang) a.setAttribute('aria-current', 'page');
      a.addEventListener('click', () => savePreference(a.dataset.legalLanguage));
    });
  }
  updateLinks();
  // The main site's language selector changes html[lang]. Its translations
  // can also replace consent links, so update those links after every switch.
  new MutationObserver(updateLinks).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
})();
