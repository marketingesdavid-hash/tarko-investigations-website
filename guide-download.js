(() => {
  const files = {
    hu: '/10-dolog-amit-minden-europai-nyomozonak-tudnia-kell.pdf',
    en: '/10-things-every-european-investigator-must-know.pdf'
  };
  document.querySelectorAll('[data-guide-form]').forEach(form => {
    let busy = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      const lang = document.documentElement.lang === 'hu' ? 'hu' : 'en';
      const hu = lang === 'hu';
      const button = form.querySelector('[type=submit]');
      const status = form.querySelector('[data-guide-status]');
      const result = form.querySelector('[data-guide-result]');
      busy = true;
      button.disabled = true;
      result.hidden = true;
      status.textContent = hu ? 'Az igénylés elküldése…' : 'Submitting your request…';
      const data = new FormData(form);
      data.set('language', lang);
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: new URLSearchParams(data).toString()
        });
        if (!response.ok) throw new Error('Submission failed');
        status.textContent = hu ? 'Köszönjük! A magyar útmutató letöltésre kész.' : 'Thank you! Your English guide is ready to download.';
        const link = document.createElement('a');
        link.href = files[lang];
        link.download = files[lang].split('/').pop();
        link.className = 'button btn btn-primary';
        link.textContent = hu ? 'Magyar PDF letöltése →' : 'Download English PDF →';
        result.replaceChildren(link);
        result.hidden = false;
        link.focus();
      } catch (error) {
        status.textContent = hu ? 'Az igénylést nem sikerült elküldeni. Kérjük, próbálja újra.' : 'Your request could not be submitted. Please try again.';
      } finally {
        busy = false;
        button.disabled = false;
      }
    });
  });
})();
