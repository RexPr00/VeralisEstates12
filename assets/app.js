(() => {
  const body = document.body;

  const setupDropdowns = () => {
    document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
      const toggle = switcher.querySelector('[data-lang-toggle]');
      if (!toggle) return;
      toggle.addEventListener('click', () => {
        switcher.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(switcher.classList.contains('open')));
      });
      document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
          switcher.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  const getFocusable = (container) => {
    return [...container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  };

  const trapFocus = (container, event) => {
    const focusable = getFocusable(container);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const setupDrawer = () => {
    const drawer = document.querySelector('[data-drawer]');
    const openBtn = document.querySelector('[data-burger]');
    if (!drawer || !openBtn) return;

    const panel = drawer.querySelector('[data-drawer-panel]');
    const closeBtn = drawer.querySelector('[data-drawer-close]');
    const overlay = drawer.querySelector('[data-drawer-overlay]');

    const openDrawer = () => {
      drawer.classList.add('active');
      body.classList.add('nav-open');
      openBtn.setAttribute('aria-expanded', 'true');
      const focusable = getFocusable(panel);
      if (focusable[0]) focusable[0].focus();
    };

    const closeDrawer = () => {
      drawer.classList.remove('active');
      body.classList.remove('nav-open');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    };

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) closeDrawer();
      if (e.key === 'Tab' && drawer.classList.contains('active')) trapFocus(panel, e);
    });
  };

  const setupFaq = () => {
    document.querySelectorAll('[data-faq]').forEach((faq) => {
      const items = faq.querySelectorAll('.faq-item');
      items.forEach((item) => {
        const btn = item.querySelector('.faq-btn');
        btn.addEventListener('click', () => {
          items.forEach((other) => {
            if (other !== item) other.classList.remove('active');
          });
          item.classList.toggle('active');
        });
      });
    });
  };

  const setupModal = () => {
    const modal = document.querySelector('[data-modal]');
    if (!modal) return;
    const dialog = modal.querySelector('[data-modal-dialog]');

    const openModal = () => {
      modal.classList.add('active');
      body.classList.add('modal-open');
      const focusable = getFocusable(dialog);
      if (focusable[0]) focusable[0].focus();
    };
    const closeModal = () => {
      modal.classList.remove('active');
      body.classList.remove('modal-open');
    };

    document.querySelectorAll('[data-open-privacy]').forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));
    modal.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', closeModal));
    modal.querySelector('[data-modal-overlay]').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
      if (e.key === 'Tab' && modal.classList.contains('active')) trapFocus(dialog, e);
    });
  };

  const setupReveal = () => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    nodes.forEach((node) => io.observe(node));
  };

  setupDropdowns();
  setupDrawer();
  setupFaq();
  setupModal();
  setupReveal();
})();
