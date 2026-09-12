/**
 * Prince Yadav - Portfolio Navigation Bar & Hero Section Interactions
 * Vanilla JavaScript implementation for scrollspy, backdrop blur states,
 * hamburger menu toggle, accessibility controls, smooth scrolling, and entrance animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. DOM Element References
  // -------------------------------------------------------------------------
  const navbarHeader = document.getElementById('navbar-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  // -------------------------------------------------------------------------
  // 2. Mobile Hamburger Menu Functions (Untouched)
  // -------------------------------------------------------------------------
  
  /**
   * Opens or closes the mobile navigation menu drawer
   * @param {boolean} [forceState] - Optional explicit state boolean
   */
  const toggleMobileMenu = (forceState) => {
    const isCurrentlyActive = navToggle.classList.contains('active');
    const shouldOpen = forceState !== undefined ? forceState : !isCurrentlyActive;

    if (shouldOpen) {
      navToggle.classList.add('active');
      navMenuWrapper.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      
      // Prevent background scrolling on mobile when menu is active
      if (window.innerWidth <= 992) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      navToggle.classList.remove('active');
      navMenuWrapper.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  // Toggle button click listener
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close mobile menu when clicking outside header container
  document.addEventListener('click', (event) => {
    if (navMenuWrapper && navMenuWrapper.classList.contains('active')) {
      const isClickInsideHeader = navbarHeader.contains(event.target);
      if (!isClickInsideHeader) {
        toggleMobileMenu(false);
      }
    }
  });

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenuWrapper.classList.contains('active')) {
      toggleMobileMenu(false);
      navToggle.focus(); // Return focus to toggle button for accessibility
    }
  });

  // Reset overflow if window resizes past desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navMenuWrapper.classList.contains('active')) {
      toggleMobileMenu(false);
    }
  });

  // -------------------------------------------------------------------------
  // 3. Navbar Background Scroll Effect (Untouched)
  // -------------------------------------------------------------------------
  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbarHeader.classList.add('scrolled');
    } else {
      navbarHeader.classList.remove('scrolled');
    }
  };

  // Listen to scroll events with passive optimization
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check on load

  // -------------------------------------------------------------------------
  // 4. Scrollspy (IntersectionObserver Active Section Highlighter)
  // -------------------------------------------------------------------------
  
  /**
   * Updates the active class on navigation links based on current active section ID
   * @param {string} currentId - ID of the section currently in view
   */
  const setActiveNavLink = (currentId) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Configure IntersectionObserver options
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies upper half of viewport
    threshold: 0
  };

  const sectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          setActiveNavLink(id);
        }
      }
    });
  };

  const observer = new IntersectionObserver(sectionObserverCallback, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Scroll to top override for hero/home when at top of page
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      setActiveNavLink('home');
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 5. Smooth Scroll Fallback & Offset Handling
  // -------------------------------------------------------------------------
  const smoothScrollAnchors = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = navbarHeader ? navbarHeader.offsetHeight : 76;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Hero Section Subtle Entrance Animation
  // -------------------------------------------------------------------------
  const heroElements = document.querySelectorAll('.hero-content-left > *, .hero-image-frame');
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    
    // Trigger animation frame
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
    });
  });

  // -------------------------------------------------------------------------
  // 7. Scroll Reveal Entrance Observer (.fade-in-element)
  // -------------------------------------------------------------------------
  document.body.classList.add('js-reveal');
  const revealElements = document.querySelectorAll('.fade-in-element');
  
  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
      // Fallback check for elements already inside or near viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. Certificate Lightbox Modal Functionality
  // -------------------------------------------------------------------------
  const certModal = document.getElementById('cert-modal');
  const certModalBackdrop = document.getElementById('cert-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCertImg = document.getElementById('modal-cert-img');
  const modalCertTitle = document.getElementById('modal-cert-title');
  const modalCertIssuer = document.getElementById('modal-cert-issuer');
  const modalCertDate = document.getElementById('modal-cert-date');
  const modalCertCategory = document.getElementById('modal-cert-category');
  let lastActiveElement = null;

  const openCertModal = (dataset, triggerElement) => {
    if (!certModal || !modalCertImg) return;
    
    lastActiveElement = triggerElement || document.activeElement;

    modalCertImg.src = dataset.certImg || '';
    modalCertTitle.textContent = dataset.certTitle || 'Certificate';
    modalCertIssuer.textContent = dataset.certIssuer || '';
    modalCertDate.textContent = dataset.certDate || '';
    modalCertCategory.textContent = dataset.certCategory || 'Certification';

    certModal.classList.add('is-open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  };

  const closeCertModal = () => {
    if (!certModal) return;

    certModal.classList.remove('is-open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    setTimeout(() => {
      if (modalCertImg) modalCertImg.src = '';
    }, 350);

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Attach click & keyboard listeners to all certificate view buttons & image wrappers
  const certTriggers = document.querySelectorAll('.btn-view-cert, .cert-image-wrapper');
  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCertModal(trigger.dataset, trigger);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal(trigger.dataset, trigger);
      }
    });
  });

  // Modal Close Events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCertModal);
  }

  if (certModalBackdrop) {
    certModalBackdrop.addEventListener('click', closeCertModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-open')) {
      closeCertModal();
    }
  });
});


