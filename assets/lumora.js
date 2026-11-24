(() => {
  'use strict';
  const key = 'lumora:favorites:v1';
  let favorites = [];
  let toastTimer;
  const safeURL = (value, local = false) => {
    try {
      const url = new URL(value, location.origin);
      return ['http:', 'https:'].includes(url.protocol) && (!local || url.origin === location.origin) ? url.href : '';
    } catch { return ''; }
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) favorites = saved.filter(item => item && typeof item.handle === 'string' && typeof item.title === 'string' && safeURL(item.url, true)).slice(0, 50);
  } catch { favorites = []; }
  function announce(message) {
    const toast = document.querySelector('[data-lm-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3300);
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(favorites)); } catch { /* Favorites still work for this visit. */ }
    syncFavorites();
  }
  function syncFavorites() {
    document.querySelectorAll('[data-lm-wishlist-count]').forEach(count => {
      count.textContent = String(favorites.length);
      count.hidden = favorites.length === 0;
    });
    document.querySelectorAll('[data-lm-favorite]').forEach(button => {
      const saved = favorites.some(item => item.handle === button.dataset.handle);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', (saved ? 'Remover ' : 'Salvar ') + button.dataset.title + (saved ? ' dos favoritos' : ' nos favoritos'));
    });
    renderFavorites();
  }
  function renderFavorites() {
    const list = document.querySelector('[data-lm-wishlist-list]');
    const empty = document.querySelector('[data-lm-wishlist-empty]');
    if (!list) return;
    list.replaceChildren();
    if (empty) empty.hidden = favorites.length > 0;
    favorites.forEach(item => {
      const row = document.createElement('article');
      row.className = 'lm-wishlist-item';
      const photoLink = document.createElement('a');
      photoLink.href = safeURL(item.url, true);
      photoLink.setAttribute('aria-label', item.title);
      const image = document.createElement('img');
      if (item.image && safeURL(item.image)) image.src = safeURL(item.image);
      image.alt = item.title;
      image.loading = 'lazy';
      photoLink.append(image);
      const info = document.createElement('div');
      const link = document.createElement('a');
      link.href = safeURL(item.url, true);
      link.textContent = item.title;
      const price = document.createElement('p');
      price.textContent = typeof item.price === 'string' ? item.price : '';
      const view = document.createElement('a');
      view.href = safeURL(item.url, true);
      view.textContent = 'Ver peça e disponibilidade →';
      view.className = 'lm-text-link';
      info.append(link, price, view);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', 'Remover ' + item.title + ' dos favoritos');
      remove.addEventListener('click', () => {
        const index = favorites.findIndex(entry => entry.handle === item.handle);
        favorites = favorites.filter(entry => entry.handle !== item.handle);
        persist();
        const remaining = list.querySelectorAll('button');
        if (remaining.length) remaining[Math.min(index, remaining.length - 1)].focus();
        else document.querySelector('#lm-wishlist [data-lm-close]')?.focus();
        announce('Peça removida dos favoritos.');
      });
      row.append(photoLink, info, remove);
      list.append(row);
    });
  }
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!(dialog instanceof HTMLDialogElement)) return;
    document.querySelectorAll('dialog.lm-dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('lm-modal-open');
    document.querySelectorAll('.lm-mobile-menu[open], .lm-search-popover[open]').forEach(details => { details.open = false; });
  }
  function init(root = document) {
    root.querySelectorAll('[data-lm-js]').forEach(item => { item.hidden = false; });
    syncFavorites();
    root.querySelectorAll('dialog.lm-dialog').forEach(dialog => {
      if (dialog.dataset.lmBound) return;
      dialog.dataset.lmBound = 'true';
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog.lm-dialog[open]')) document.body.classList.remove('lm-modal-open');
      });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
      });
    });
    root.querySelectorAll('.lm-products-grid').forEach(grid => {
      if (grid.dataset.lmBound) return;
      grid.dataset.lmBound = 'true';
      const refresh = () => {
        const buttons = [...document.querySelectorAll('[data-lm-scroll]')].filter(button => button.dataset.target === grid.id);
        const end = grid.scrollWidth - grid.clientWidth;
        buttons.forEach(button => { button.disabled = Number(button.dataset.lmScroll) < 0 ? grid.scrollLeft <= 2 : grid.scrollLeft >= end - 2; });
      };
      grid.addEventListener('scroll', refresh, { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(grid);
      refresh();
    });
  }
  document.addEventListener('click', event => {
    const element = event.target instanceof Element ? event.target : null;
    if (!element) return;
    const opener = element.closest('[data-lm-open]');
    if (opener) { event.preventDefault(); openDialog(opener.dataset.lmOpen); return; }
    const closer = element.closest('[data-lm-close]');
    if (closer) { closer.closest('dialog')?.close(); return; }
    const favorite = element.closest('[data-lm-favorite]');
    if (favorite) {
      const handle = favorite.dataset.handle;
      if (!handle || !safeURL(favorite.dataset.url, true)) return;
      const exists = favorites.some(item => item.handle === handle);
      if (exists) favorites = favorites.filter(item => item.handle !== handle);
      else {
        if (favorites.length >= 50) { announce('Você já salvou 50 peças. Remova uma para salvar outra.'); return; }
        favorites.push({ handle, title: favorite.dataset.title || '', url: favorite.dataset.url, image: favorite.dataset.image || '', price: favorite.dataset.price || '' });
      }
      persist();
      announce(exists ? 'Peça removida dos favoritos.' : 'Peça salva nos seus favoritos.');
      return;
    }
    const scroll = element.closest('[data-lm-scroll]');
    if (scroll) {
      const grid = document.getElementById(scroll.dataset.target);
      if (grid) grid.scrollBy({ left: Number(scroll.dataset.lmScroll) * grid.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    const menuLink = element.closest('.lm-mobile-links a');
    if (menuLink) menuLink.closest('details').open = false;
    document.querySelectorAll('.lm-search-popover[open], .lm-nav-dropdown[open], .lm-mobile-menu[open]').forEach(details => { if (!details.contains(element)) details.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.lm-search-popover[open], .lm-nav-dropdown[open], .lm-mobile-menu[open]').forEach(details => { details.open = false; details.querySelector('summary')?.focus(); });
  });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    try {
      const saved = JSON.parse(event.newValue || '[]');
      if (Array.isArray(saved)) favorites = saved.filter(item => item && typeof item.handle === 'string' && typeof item.title === 'string' && safeURL(item.url, true)).slice(0, 50);
    } catch { favorites = []; }
    syncFavorites();
  });
  document.addEventListener('shopify:section:load', event => init(event.target));
  document.addEventListener('shopify:section:unload', () => document.body.classList.remove('lm-modal-open'));
  init();
  if (document.querySelector('#lm-contact [data-lm-form-status]')) openDialog('lm-contact');
  const formMessage = document.querySelector('.lm-newsletter .lm-form-message');
  if (formMessage) { formMessage.scrollIntoView({ block: 'center' }); formMessage.focus(); }
})();
