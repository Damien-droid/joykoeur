// Mon Univers – Landing Page Scripts
// -----------------------------------

// Wait for DOM to be fully loaded before running scripts
window.addEventListener('DOMContentLoaded', () => {
  /* ------------------ DOM Elements ------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroBtn = document.querySelector('.hero-btn');
  const emailInput = document.querySelector('.email-input');
  const newsletterBtn = document.querySelector('.newsletter-btn');
  const navbar = document.querySelector('.navbar');

  /* ---------------- Mobile Navigation ---------------- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
      const isClickInside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });

    // Close mobile menu on window resize (desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  /* ------------- Smooth Scrolling Utility ------------ */
  function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ------------- Navigation Links Scroll ------------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      smoothScrollTo(href);
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  /* ------------- Hero Button Scroll ------------------ */
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = heroBtn.getAttribute('href');
      smoothScrollTo(href);
    });
  }

  /* ------------- Newsletter Form --------------------- */
  if (newsletterBtn && emailInput) {
    newsletterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        alert('Veuillez entrer votre adresse e-mail.');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Veuillez entrer une adresse e-mail valide.');
        return;
      }

      alert('Merci pour votre inscription ! Vous recevrez bientôt nos mises à jour.');
      emailInput.value = '';
    });

    // Submit form on Enter key
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        newsletterBtn.click();
      }
    });
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /* ------------- Navbar Shadow on Scroll ------------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  });

  /* ----------- Section Reveal on Scroll -------------- */
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      section.classList.add('reveal');
      revealObserver.observe(section);
    });
  }

  /* ------------- Simple Parallax Effect -------------- */
  const placeholderImages = document.querySelectorAll('.placeholder-image');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    placeholderImages.forEach((img) => {
      img.style.transform = `translateY(${scrollY * -0.05}px)`;
    });
  });

  /* ------------- Init Message ------------------------ */
  console.log('Mon Univers – site initialisé');
});