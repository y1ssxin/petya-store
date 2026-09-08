(function () {
  function makeLogoHomeLink() {
    var logo = document.querySelector('header .logo');
    if (!logo || logo.dataset.homeLinkReady === '1') return;

    logo.dataset.homeLinkReady = '1';
    if (logo.tagName === 'A') {
      logo.href = 'index.html';
      return;
    }
    logo.setAttribute('role', 'link');
    logo.setAttribute('tabindex', '0');
    logo.setAttribute('aria-label', 'العودة إلى الصفحة الرئيسية');

    function goHome() {
    window.location.href = 'index.html';
    }

    logo.addEventListener('click', goHome);
    logo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goHome();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeLogoHomeLink);
  } else {
    makeLogoHomeLink();
  }
})();