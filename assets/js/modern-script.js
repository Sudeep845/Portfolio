'use strict';

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
}

// Toggle theme function
function toggleTheme() {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update icon
  themeToggle.innerHTML = newTheme === 'dark' 
    ? '<ion-icon name="sunny-outline"></ion-icon>' 
    : '<ion-icon name="moon-outline"></ion-icon>';
}

// Add event listener to theme toggle button
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  
  // Set initial icon based on current theme
  const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
  themeToggle.innerHTML = currentTheme === 'dark' 
    ? '<ion-icon name="sunny-outline"></ion-icon>' 
    : '<ion-icon name="moon-outline"></ion-icon>';
}

// Mobile Menu
const menuToggle = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    navList.classList.toggle('show');
    menuToggle.innerHTML = navList.classList.contains('show') 
      ? '<ion-icon name="close-outline"></ion-icon>' 
      : '<ion-icon name="menu-outline"></ion-icon>';
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navList && navList.classList.contains('show') && !e.target.closest('.navbar') && !e.target.closest('#menu-toggle')) {
    navList.classList.remove('show');
    if (menuToggle) {
      menuToggle.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
    }
  }
});

// Sticky Header
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Close mobile menu if open
      if (navList && navList.classList.contains('show')) {
        navList.classList.remove('show');
        if (menuToggle) {
          menuToggle.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
        }
      }
      
      // Scroll to target
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
};

// Portfolio/Gallery Modal
const setupGallery = () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.querySelector('.modal-close');
  const modalPrev = document.querySelector('.modal-prev');
  const modalNext = document.querySelector('.modal-next');
  let currentIndex = 0;
  
  if (!galleryItems.length || !modal || !modalImage) return;
  
  // Open modal with clicked image
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      const imgSrc = item.querySelector('img').getAttribute('src');
      modalImage.setAttribute('src', imgSrc);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Navigate previous
  if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('src');
      modalImage.setAttribute('src', imgSrc);
    });
  }
  
  // Navigate next
  if (modalNext) {
    modalNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('src');
      modalImage.setAttribute('src', imgSrc);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowLeft' && modalPrev) {
        modalPrev.click();
      } else if (e.key === 'ArrowRight' && modalNext) {
        modalNext.click();
      }
    }
  });
};

// Project Filter
const setupProjectFilter = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  
  if (!filterButtons.length || !projectItems.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter projects
      projectItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
};

// Preloader
const preloader = document.querySelector('.preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      
      // Start animations after preloader is hidden
      document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
        el.style.animationDelay = `${0.2 * index}s`;
      });
    }, 500);
  });
}

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  setupGallery();
  setupProjectFilter();
  
  // Custom cursor (optional)
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-active');
    });
    
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-active');
    });
  }
  
  // Initialize AOS if it exists
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  
  // Typing effect for hero text if Typed.js exists
  const typedElement = document.getElementById('typed-text');
  if (typeof Typed !== 'undefined' && typedElement) {
    new Typed(typedElement, {
      strings: ['UI Designer', 'Web Developer', '.NET Developer', 'Graphic Designer'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true
    });
  }
    // Initialize form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Basic validation
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          e.preventDefault();
        } else {
          input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            isValid = false;
            input.classList.add('error');
            e.preventDefault();
          }
        }
      });
      
      if (isValid) {
        // Allow the form to submit naturally to the web3forms API
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
        
        // Re-enable button after 3 seconds (in case of network issues)
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        }, 3000);
      } else {
        e.preventDefault(); // Prevent form submission if validation fails
      }    });
    
    // Remove error class on input
    const allInputs = contactForm.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }
});

// Preserve existing functionality from the old script
document.addEventListener('DOMContentLoaded', function() {
  let modal = document.getElementById('myModal');
  let modalImg = document.getElementById('img01');
  let captionText = document.getElementById('caption');
  let images = document.querySelectorAll('.pholder-item img');
  let currentIndex;

  images.forEach((img, index) => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
      currentIndex = index;
    });
  });

  let span = document.getElementsByClassName('close')[0];
  span.onclick = function() {
    modal.style.display = 'none';
  };

  document.querySelector('.next').addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
    captionText.innerHTML = images[currentIndex].alt;
  });

  document.querySelector('.prev').addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    captionText.innerHTML = images[currentIndex].alt;
  });
});
