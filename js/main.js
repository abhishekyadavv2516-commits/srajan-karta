/* =============================================
   SRAJAN KARTA — Main Application
   Navbar · Smooth Scroll · Scroll Reveal · Mobile Menu
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initMobileMenu();
  initActiveNavLink();
});

/* ================================================
   NAVBAR SCROLL BEHAVIOR
   ================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ================================================
   SMOOTH SCROLL TO SECTIONS
   ================================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Close mobile menu if open
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 80;

      const targetPosition = targetElement.getBoundingClientRect().top
        + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ================================================
   SCROLL REVEAL ANIMATIONS
   ================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-stagger'
  );

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ================================================
   MOBILE MENU TOGGLE
   ================================================ */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ================================================
   ACTIVE NAV LINK ON SCROLL
   ================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
