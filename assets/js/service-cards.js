(() => {
  'use strict';

  const dialogs = [...document.querySelectorAll('.service-dialog')];
  if (!dialogs.length || typeof dialogs[0].showModal !== 'function') return;

  const openers = [...document.querySelectorAll('[data-service-dialog]')];
  let lastOpener = null;

  const synchronizeScroll = () => {
    document.body.classList.toggle('service-dialog-open', dialogs.some(dialog => dialog.open));
  };

  openers.forEach(opener => {
    const dialog = document.getElementById(opener.dataset.serviceDialog);
    if (!dialog || !dialog.classList.contains('service-dialog')) return;

    opener.hidden = false;
    opener.addEventListener('click', () => {
      if (dialog.open) return;
      lastOpener = opener;
      dialog.showModal();
      synchronizeScroll();
      dialog.querySelector('[data-service-close]')?.focus({ preventScroll: true });
    });
  });

  dialogs.forEach(dialog => {
    dialog.querySelector('[data-service-close]')?.addEventListener('click', () => dialog.close());

    // Native Escape handling closes the dialog; retain focus and page scroll state.
    dialog.addEventListener('close', () => {
      synchronizeScroll();
      const returnTarget = lastOpener;
      lastOpener = null;
      returnTarget?.focus({ preventScroll: true });
    });

    // Close on a click outside the panel, without treating inside padding as outside.
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) {
        dialog.close();
      }
    });
  });
})();

