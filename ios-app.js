(function () {
  'use strict';
  var doc = document.documentElement;
  var standalone = window.navigator.standalone === true ||
    (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  if (standalone) doc.classList.add('is-standalone');

  var ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    products: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    account: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
    contact: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.7 7.1L3 21l1.9-6.3A8 8 0 1 1 21 12z"/></svg>'
  };
  var TABS = [
    { id: 'home',     label: 'الرئيسية', href: 'index.html' },
    { id: 'products', label: 'المنتجات', href: 'index.html#products' },
    { id: 'account',  label: 'حسابي',    href: 'account.html' },
    { id: 'contact',  label: 'تواصل',    href: 'index.html#contact' }
  ];

  var PRODUCT_PAGES = /(netflix|chatgpt|canva|capcut|shahid|claude|gemini|snapchat|xbox-pc|primevideo|youtube|starzplay|crunchyroll|office2021|office2024|microsoft365|windows|disney|spotify|kaspersky|iptv)\.html$/;

  function currentTab() {
    var path = location.pathname.split('/').pop() || 'index.html';
    if (path === 'account.html') return 'account';
    if (PRODUCT_PAGES.test(path)) return 'products';
    if (path === 'index.html' || path === '') {
      if (location.hash === '#contact') return 'contact';
      if (location.hash === '#products') return 'products';
      return 'home';
    }
    return null;
  }

  function build() {
    if (document.querySelector('.petya-tabbar')) return;
    var nav = document.createElement('nav');
    nav.className = 'petya-tabbar';
    nav.setAttribute('aria-label', 'التنقل الرئيسي');
    nav.innerHTML = TABS.map(function (t) {
      return '<a class="petya-tab" data-tab="' + t.id + '" href="' + t.href + '">' +
             ICONS[t.id] + '<span>' + t.label + '</span></a>';
    }).join('');
    document.body.appendChild(nav);
    mark(currentTab());
  }

  function mark(id) {
    var tabs = document.querySelectorAll('.petya-tab');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-tab') === id;
      tabs[i].classList.toggle('active', on);
      if (on) tabs[i].setAttribute('aria-current', 'page'); else tabs[i].removeAttribute('aria-current');
    }
  }

  // On the home page, follow the section the visitor is looking at
  function spy() {
    var path = location.pathname.split('/').pop() || 'index.html';
    if (path !== 'index.html' || !('IntersectionObserver' in window)) return;
    var products = document.getElementById('products');
    var contact = document.getElementById('contact');
    var state = { products: false, contact: false };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { state[en.target.id] = en.isIntersecting; });
      mark(state.contact ? 'contact' : state.products ? 'products' : 'home');
    }, { rootMargin: '-35% 0px -45% 0px' });
    if (products) io.observe(products);
    if (contact) io.observe(contact);
  }

  // "Add to Home Screen" hint: only iPhone/iPad Safari, only if not installed
  function installHint() {
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!isIOS || standalone) return;
    try { if (localStorage.getItem('petya-install-hint') === '1') return; } catch (e) {}
    var box = document.createElement('div');
    box.className = 'petya-install';
    box.innerHTML = '<img src="icons/icon-192.png" alt="">' +
      '<span>لتثبيت التطبيق: اضغط على زر <b>المشاركة</b> ثم <b>إضافة إلى الشاشة الرئيسية</b></span>' +
      '<button type="button" aria-label="إغلاق">✕</button>';
    box.querySelector('button').addEventListener('click', function () {
      box.remove();
      try { localStorage.setItem('petya-install-hint', '1'); } catch (e) {}
    });
    document.body.appendChild(box);
  }

  function init() { build(); spy(); installHint(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('hashchange', function () { mark(currentTab()); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
