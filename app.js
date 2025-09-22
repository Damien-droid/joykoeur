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

  /* ------------- PWA Service Worker Registration ----- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, ask user to refresh
                if (confirm('Une nouvelle version est disponible. Voulez-vous actualiser ?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error);
        });
    });
  }

  /* ------------- PWA Install Prompt ------------------- */
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt fired');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button/banner
    showInstallPromotion();
  });

  function showInstallPromotion() {
    // Create install promotion banner
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div style="background: var(--color-primary); color: white; padding: 12px; position: fixed; top: 60px; left: 0; right: 0; z-index: 1000; text-align: center; box-shadow: var(--shadow-md);">
        <span>📱 Installez "Mon Univers" pour une meilleure expérience !</span>
        <button id="pwa-install-btn" style="margin-left: 12px; background: white; color: var(--color-primary); border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Installer</button>
        <button id="pwa-dismiss-btn" style="margin-left: 8px; background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Plus tard</button>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Handle install button click
    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
          } else {
            console.log('[PWA] User dismissed the install prompt');
          }
          deferredPrompt = null;
          document.getElementById('pwa-install-banner').remove();
        });
      }
    });
    
    // Handle dismiss button click
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      document.getElementById('pwa-install-banner').remove();
    });
  }

  window.addEventListener('appinstalled', (evt) => {
    console.log('[PWA] App was installed.');
    // Remove the install banner if it's still showing
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  });

  /* ------------- Init Message ------------------------ */
  console.log('Mon Univers – site initialisé');
});