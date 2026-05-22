/* ============================================================
   NEXTOTEM — Landing page
   ============================================================ */

/* ┌────────────────────────────────────────────────────────┐
   │  >>> CONFIGURAÇÃO DE CONTATO — EDITE AQUI <<<           │
   │                                                        │
   │  Troque os valores abaixo pelos dados reais antes de    │
   │  publicar no FTP. Só este bloco precisa ser alterado.   │
   └────────────────────────────────────────────────────────┘ */
const CONTACT = {
  // WhatsApp: apenas dígitos, no formato DDI + DDD + número.
  // Ex.: Brasil, (11) 99999-9999  ->  '5511999999999'
  whatsapp: '5512981803259',

  // Mensagem que já vem preenchida ao abrir o WhatsApp.
  whatsappMessage: 'Olá! Vim pelo site do NEXTOTEM e quero saber mais sobre as experiências.',

  // E-mail de contato.
  email: 'mgsstudiodeveloper@gmail.com',

  // Assunto do e-mail.
  emailSubject: 'Contato via site — NEXTOTEM',
};
/* ──────────────── fim da configuração ──────────────────── */


(function () {
  'use strict';

  /* ---------- Links de contato ---------- */
  const waUrl =
    'https://wa.me/' + CONTACT.whatsapp +
    '?text=' + encodeURIComponent(CONTACT.whatsappMessage);

  const mailUrl =
    'mailto:' + CONTACT.email +
    '?subject=' + encodeURIComponent(CONTACT.emailSubject);

  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-email]').forEach(function (el) {
    el.setAttribute('href', mailUrl);
  });

  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    el.textContent = CONTACT.email;
  });

  if (CONTACT.whatsapp === '5599999999999') {
    console.warn(
      '[NEXTOTEM] Configure o WhatsApp e o e-mail reais no bloco CONTACT, ' +
      'no topo de script.js, antes de publicar.'
    );
  }

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Estado da navegação ao rolar ---------- */
  const nav = document.getElementById('nav');
  const fab = document.querySelector('.fab');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  function setMenu(open) {
    toggle.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('is-open'));
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- Revelação ao rolar (com escalonamento) ---------- */
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach(function (el) {
    let delay;
    if (el.hasAttribute('data-delay')) {
      // Escalonamento explícito (usado no hero).
      delay = parseInt(el.getAttribute('data-delay'), 10) * 90;
    } else {
      // Escalonamento automático entre irmãos .reveal do mesmo bloco.
      const siblings = Array.prototype.filter.call(
        el.parentElement.children,
        function (c) { return c.classList.contains('reveal'); }
      );
      delay = Math.min(siblings.indexOf(el), 6) * 80;
    }
    el.style.transitionDelay = delay + 'ms';
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Sem suporte: mostra tudo.
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
