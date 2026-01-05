// ===================================
// Renan Macêdo - Portfolio JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
  initProjectCarousels();
  initHeroCarousel();
});

// --- Navbar Scroll Effect ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    updateActiveNavLink();
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// --- Mobile Navigation ---
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// --- Update Active Nav Link ---
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (!fadeElements.length) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(el => observer.observe(el));
}

// --- Smooth Scroll ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (!target) return;
      
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// --- Typing Effect (optional enhancement) ---
function initTypingEffect() {
  const element = document.querySelector('.typing-text');
  if (!element) return;
  
  const texts = JSON.parse(element.dataset.texts || '[]');
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  if (texts.length) type();
}

// --- Project Carousels ---
function initProjectCarousels() {
  const carousels = document.querySelectorAll('.project-carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const interval = parseInt(carousel.dataset.interval) || 4000;
    
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');
      
      currentIndex = index;
      
      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
      
      // Reset timer when manually navigating
      resetAutoplay();
    }
    
    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }
    
    function startAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        if (!isPaused) nextSlide();
      }, interval);
    }
    
    function resetAutoplay() {
      startAutoplay();
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    
    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
    });
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay when not visible (performance optimization)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoplay();
        } else {
          if (autoplayTimer) clearInterval(autoplayTimer);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(carousel);
  });
}

// --- Hero Background Carousel ---
function initHeroCarousel() {
  const heroBackground = document.querySelector('.hero-background');
  if (!heroBackground) return;

  const slides = heroBackground.querySelectorAll('.hero-bg-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  const interval = 5000; // 5 seconds per slide (slower for background)

  function nextSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }

  // Preload next image to avoid flicker (optional, but good practice)
  // Browser caching usually handles this after first loop

  setInterval(nextSlide, interval);
}

