/* ============================================================
   Woods Aerial Monitoring — main.js
   Handles: scroll nav, mobile menu, fade-in animations,
            form validation, smooth scroll
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behavior ── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile menu toggle ── */
  const toggleBtn = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      toggleBtn.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active nav link ── */
  (function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ── Fade-in on scroll ── */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Contact form validation ── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const successMsg = document.getElementById('formSuccess');

    function validateField(input) {
      const errorEl = document.getElementById(input.id + 'Error');
      let valid = true;
      let message = '';

      if (input.required && !input.value.trim()) {
        valid = false;
        message = 'This field is required.';
      } else if (input.type === 'email' && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          valid = false;
          message = 'Please enter a valid email address.';
        }
      } else if (input.type === 'tel' && input.value.trim()) {
        const telPattern = /^[\d\s\-\(\)\+\.]{7,}$/;
        if (!telPattern.test(input.value.trim())) {
          valid = false;
          message = 'Please enter a valid phone number.';
        }
      }

      if (errorEl) {
        errorEl.textContent = message;
        if (!valid) {
          errorEl.classList.add('visible');
          input.style.borderColor = '#c0392b';
        } else {
          errorEl.classList.remove('visible');
          input.style.borderColor = '';
        }
      }

      return valid;
    }

    // Live validation on blur
    contactForm.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.style.borderColor === 'rgb(192, 57, 43)') {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields = contactForm.querySelectorAll('input[required], textarea[required]');
      let allValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
        }
      });

      if (allValid) {
        // Show success message
        contactForm.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  /* ── Placeholder SVG injection ── */
  // Injects a consistent drone/aerial icon into placeholder areas
  (function injectPlaceholderIcons() {
    const droneIconSVG = `
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="20" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
        <line x1="24" y1="20" x2="24" y2="14" stroke="currentColor" stroke-width="1.5"/>
        <line x1="18" y1="24" x2="8" y2="24" stroke="currentColor" stroke-width="1.5"/>
        <line x1="30" y1="24" x2="40" y2="24" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="8" cy="24" r="3" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="40" cy="24" r="3" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="24" cy="14" r="3" stroke="currentColor" stroke-width="1.5"/>
        <line x1="18" y1="28" x2="14" y2="34" stroke="currentColor" stroke-width="1.2"/>
        <line x1="30" y1="28" x2="34" y2="34" stroke="currentColor" stroke-width="1.2"/>
      </svg>`;

    document.querySelectorAll('.ph-icon').forEach(function (el) {
      el.innerHTML = droneIconSVG;
    });
  })();

})();
