/* ============================================================
   SETHAKGA GROUP - Main JavaScript
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Navbar scroll ---- */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-top');

  if (navbar && backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        backTop.classList.add('visible');
      } else {
        navbar.classList.remove('scrolled');
        backTop.classList.remove('visible');
      }
    });

    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Intersection Observer for fade-up ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});

/* ============================================================
   CLEANING PAGE - Property Type Selector
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const residentialCard = document.querySelector('[data-property="residential"]');
  const commercialCard = document.querySelector('[data-property="commercial"]');
  const residentialSection = document.getElementById('residential-services');
  const commercialSection = document.getElementById('commercial-services');

  // Only run if we're on the cleaning page
  if (!residentialCard || !commercialCard) return;

  // Handle Residential selection
  residentialCard.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active from commercial
    commercialCard.classList.remove('active');
    commercialSection.classList.remove('active');
    
    // Add active to residential
    residentialCard.classList.add('active');
    residentialSection.classList.add('active');
    
    // Smooth scroll to section
    setTimeout(() => {
      residentialSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  // Handle Commercial selection
  commercialCard.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active from residential
    residentialCard.classList.remove('active');
    residentialSection.classList.remove('active');
    
    // Add active to commercial
    commercialCard.classList.add('active');
    commercialSection.classList.add('active');
    
    // Smooth scroll to section
    setTimeout(() => {
      commercialSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  // Smooth scroll for form buttons
  document.querySelectorAll('.scroll-to-form').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href');
      const targetForm = document.querySelector(targetId);
      if (targetForm) {
        setTimeout(() => {
          targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  });

  // Handle form submissions
  const residentialForm = document.getElementById('residentialBookingForm');
  const commercialForm = document.getElementById('commercialBookingForm');

  if (residentialForm) {
    residentialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(residentialForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log('Residential Booking:', data);
      
      // Show success message
      alert('Thank you for your booking request! We will contact you within 24 hours to confirm your appointment.');
      
      // Reset form
      residentialForm.reset();
      
      // In production, send to backend or email service
      // Example: fetch('/api/bookings/residential', { method: 'POST', body: JSON.stringify(data) })
    });
  }

  if (commercialForm) {
    commercialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(commercialForm);
      const data = Object.fromEntries(formData.entries());
      
      console.log('Commercial Booking:', data);
      
      // Show success message
      alert('Thank you for your quote request! Our commercial team will contact you within 24 hours with a customized quote.');
      
      // Reset form
      commercialForm.reset();
      
      // In production, send to backend or email service
      // Example: fetch('/api/bookings/commercial', { method: 'POST', body: JSON.stringify(data) })
    });
  }
});
