(function () {
  function syncHeader() {
    var header = document.querySelector('header');
    var logo = header && header.querySelector('.logo');
    var nav = header && header.querySelector('#navLinks');
    var cta = header && header.querySelector('.nav-cta');
    if (!logo || !nav || !cta) return;

    var logoText = logo.children[1];
    if (logoText) {
      logoText.className = 'logo-text';
      logoText.innerHTML = '<span class="logo-name">Petya Digital Store</span>';
    }

    var cart = header.querySelector('#cartToggleBtn');
    if (cart && cart.parentElement !== nav) {
      cart.className = 'nav-cart-link';
      cart.setAttribute('type', 'button');
      cart.innerHTML = '🛒 السلة <span class="cart-badge" id="cartBadge">0</span>';
      var item = document.createElement('li');
      item.appendChild(cart);
      nav.appendChild(item);
    }

    cta.querySelectorAll(':scope > .btn').forEach(function (button) {
      button.remove();
    });

    var auth = header.querySelector('#authOpenBtn');
    if (auth) auth.textContent = 'تسجيل الدخول';

    nav.classList.remove('open');
    nav.hidden = true;

    var menu = header.querySelector('#menuToggle');
    if (menu && !menu.dataset.headerSync) {
      menu.dataset.headerSync = '1';
      function setMenu(open) {
        nav.classList.toggle('open', open);
        nav.hidden = !open;
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
      }
      setMenu(false);
      menu.addEventListener('click', function () {
        setMenu(nav.hidden);
      });
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setMenu(false); });
      });
      document.addEventListener('click', function (event) {
        if (!header.contains(event.target)) setMenu(false);
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setMenu(false);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncHeader);
  } else {
    syncHeader();
  }
})();