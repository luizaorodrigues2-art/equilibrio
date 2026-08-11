/**
 * EQUILÍBRIO INTEGRAL — Premium Interactions
 * Vanilla JavaScript — No dependencies
 */

(function () {
  'use strict';

  /* --- DOM References --- */
  const DOM = {
    loader: document.getElementById('loader'),
    header: document.getElementById('header'),
    menuToggle: document.getElementById('menu-toggle'),
    mainNav: document.getElementById('main-nav'),
    themeToggle: document.getElementById('theme-toggle'),
    backToTop: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    cursor: document.querySelector('.cursor'),
    cursorFollower: document.querySelector('.cursor-follower'),
    heroBg: document.querySelector('.hero__bg'),
    timelineProgress: document.querySelector('.timeline__progress'),
    timelineItems: document.querySelectorAll('.timeline__item'),
    infobookPanels: document.querySelectorAll('.infobook-panel'),
    reveals: document.querySelectorAll('.reveal'),
    navLinks: document.querySelectorAll('.header__link'),
    magneticBtns: document.querySelectorAll('.btn--magnetic'),
    sections: document.querySelectorAll('section[id]')
  };

  /* --- Loading Screen --- */
  function initLoader() {
    document.body.classList.add('loading');

    const hideLoader = () => {
      DOM.loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initReveals();
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 2000);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 2000));
    }
  }

  /* --- Theme Toggle --- */
  function initTheme() {
    const saved = localStorage.getItem('ei-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    DOM.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ei-theme', next);
    });
  }

  /* --- Mobile Menu --- */
  function initMobileMenu() {
    DOM.menuToggle.addEventListener('click', () => {
      const isOpen = DOM.mainNav.classList.toggle('open');
      DOM.menuToggle.classList.toggle('active');
      DOM.menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    DOM.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        DOM.mainNav.classList.remove('open');
        DOM.menuToggle.classList.remove('active');
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Header Scroll --- */
  function initHeaderScroll() {
    let lastScroll = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;
      DOM.header.classList.toggle('scrolled', scrollY > 50);
      lastScroll = scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Active Nav Link --- */
  function initActiveNav() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            DOM.navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    DOM.sections.forEach(section => observer.observe(section));
  }

  /* --- Scroll Reveal --- */
  function initReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      DOM.reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    DOM.reveals.forEach(el => observer.observe(el));
  }

  /* --- Parallax Hero --- */
  function initParallax() {
    if (!DOM.heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;

          if (scrollY < heroHeight) {
            const translate = scrollY * 0.35;
            const scale = 1.1 + scrollY * 0.0001;
            DOM.heroBg.style.transform = `translateY(${translate}px) scale(${scale})`;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Custom Cursor --- */
  function initCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (!DOM.cursor || !DOM.cursorFollower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      DOM.cursor.style.left = mouseX + 'px';
      DOM.cursor.style.top = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      DOM.cursorFollower.style.left = followerX + 'px';
      DOM.cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    const interactiveElements = document.querySelectorAll('a, button, .infobook-panel, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        DOM.cursor.classList.add('hover');
        DOM.cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        DOM.cursor.classList.remove('hover');
        DOM.cursorFollower.classList.remove('hover');
      });
    });
  }

  /* --- Magnetic Buttons --- */
  function initMagnetic() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    DOM.magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --- Infobooks Panels --- */
  function initInfobooks() {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;

    DOM.infobookPanels.forEach(panel => {
      if (isMobile) {
        panel.addEventListener('click', () => {
          const isActive = panel.classList.contains('active');
          DOM.infobookPanels.forEach(p => p.classList.remove('active'));
          if (!isActive) panel.classList.add('active');
        });
      }

      panel.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          panel.querySelector('.infobook-panel__btn')?.click();
        }
      });

      panel.querySelector('.infobook-panel__btn')?.addEventListener('click', e => {
        e.stopPropagation();
        const title = panel.querySelector('.infobook-panel__title')?.textContent;
        showNotification(`Abrindo: ${title}`);
      });
    });
  }

  /* --- Timeline Scroll Animation --- */
  function initTimeline() {
    if (!DOM.timelineProgress || !DOM.timelineItems.length) return;

    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineTop = rect.top;
      const timelineHeight = rect.height;

      const progress = Math.min(
        Math.max((windowHeight * 0.6 - timelineTop) / timelineHeight, 0),
        1
      );

      DOM.timelineProgress.style.height = `${progress * 100}%`;

      DOM.timelineItems.forEach((item, index) => {
        const itemProgress = (index + 1) / DOM.timelineItems.length;
        if (progress >= itemProgress - 0.1) {
          item.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  /* --- Back to Top --- */
  function initBackToTop() {
    window.addEventListener('scroll', () => {
      DOM.backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Contact Form --- */
  function initContactForm() {
    if (!DOM.contactForm) return;

    DOM.contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const fields = DOM.contactForm.querySelectorAll('input, textarea');
      fields.forEach(field => {
        const errorEl = field.parentElement.querySelector('.form-error');
        field.classList.remove('error');
        errorEl.textContent = '';

        if (!field.value.trim()) {
          field.classList.add('error');
          errorEl.textContent = 'Este campo é obrigatório.';
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('error');
          errorEl.textContent = 'E-mail inválido.';
          valid = false;
        }
      });

      if (valid) {
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        DOM.contactForm.reset();
      }
    });
  }

  /* --- Newsletter Form --- */
  function initNewsletter() {
    const form = document.querySelector('.sidebar-widget__form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        showNotification('Inscrição realizada com sucesso!');
        input.value = '';
      }
    });
  }

  /* --- Notification Toast --- */
  function showNotification(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      padding: '16px 32px',
      background: '#0A2540',
      color: '#DDEEFF',
      borderRadius: '999px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '100000',
      boxShadow: '0 8px 32px rgba(10,37,64,0.3)',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      border: '1px solid rgba(111,168,220,0.2)'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* --- Smooth Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Initialize All --- */
  function init() {
    initLoader();
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initActiveNav();
    initParallax();
    initCursor();
    initMagnetic();
    initInfobooks();
    initTimeline();
    initBackToTop();
    initContactForm();
    initNewsletter();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
