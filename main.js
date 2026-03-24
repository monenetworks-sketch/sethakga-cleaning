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

/* ============================================================
   MULTI-STEP FORM LOGIC (Smart Booking Form)
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const smartForm = document.querySelector('.smart-form');
  if (!smartForm) return; // Only run if smart form exists

  const formSteps = smartForm.querySelectorAll('.form-step');
  const progressFill = document.getElementById('progressFill');
  const currentStepText = document.getElementById('currentStep');
  const totalStepsText = document.getElementById('totalSteps');
  
  let currentStep = 1;
  const totalSteps = formSteps.length;

  // Update total steps text
  if (totalStepsText) totalStepsText.textContent = totalSteps;

  // Update progress bar and step indicator
  function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (currentStepText) currentStepText.textContent = `Step ${currentStep}`;
  }

  // Show specific step
  function showStep(stepNumber) {
    formSteps.forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    currentStep = stepNumber;
    updateProgress();

    // Scroll to form top
    smartForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Validate current step
  function validateStep(stepNumber) {
    const step = formSteps[stepNumber - 1];
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      // Check if input is visible and required
      if (input.offsetParent !== null && input.hasAttribute('required')) {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
        } else {
          input.style.borderColor = '';
        }
      }
    });

    // Special validation for checkboxes (pest control types)
    const pestControlSelect = document.getElementById('res-pest-control');
    if (pestControlSelect && pestControlSelect.offsetParent !== null && pestControlSelect.value === 'yes') {
      const pestCheckboxes = step.querySelectorAll('input[name="pest-types"]:checked');
      if (pestCheckboxes.length === 0 && stepNumber === 4) {
        isValid = false;
        alert('Please select at least one pest type if you require pest control services.');
      }
    }

    // Special validation for Full-Time Fairy placement type (Step 3)
    const serviceSelect = document.getElementById('res-service');
    const fullTimePlacement = document.getElementById('full-time-placement-choice');
    if (serviceSelect && serviceSelect.value === 'full-time' && stepNumber === 3) {
      const placementTypeSelected = document.querySelector('input[name="placement-type"]:checked');
      if (!placementTypeSelected) {
        isValid = false;
        alert('Please select a placement type (Company-Managed or Client-Managed) for Full-Time Fairy service.');
      }
      // If company-managed, check package selection
      if (placementTypeSelected && placementTypeSelected.value === 'company-managed') {
        const packageSelected = document.querySelector('input[name="maid-package"]:checked');
        if (!packageSelected) {
          isValid = false;
          alert('Please select a maid services package.');
        }
      }
    }

    // Validate terms checkbox on last step
    const termsCheckbox = document.getElementById('res-terms');
    if (termsCheckbox && stepNumber === totalSteps && !termsCheckbox.checked) {
      isValid = false;
      alert('Please agree to the service terms to proceed.');
    }

    return isValid;
  }

  // Next button handlers
  smartForm.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          showStep(currentStep + 1);
        }
      } else {
        alert('Please fill in all required fields before continuing.');
      }
    });
  });

  // Previous button handlers
  smartForm.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  });

  // Conditional Logic: Deep Cleaning Info Box
  const serviceSelect = document.getElementById('res-service');
  const deepCleaningInfo = document.getElementById('deep-cleaning-info');
  const fullTimePlacementChoice = document.getElementById('full-time-placement-choice');
  const regularCleaningStep4 = document.getElementById('regular-cleaning-step4');
  const fulltimeFairyStep4 = document.getElementById('fulltime-fairy-step4');
  
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      // Deep Cleaning Info Box
      if (deepCleaningInfo) {
        if (serviceSelect.value === 'deep-cleaning') {
          deepCleaningInfo.style.display = 'block';
          deepCleaningInfo.style.animation = 'fadeInUp 0.5s ease';
        } else {
          deepCleaningInfo.style.display = 'none';
        }
      }

      // Full-Time Fairy Placement Choice
      if (fullTimePlacementChoice) {
        if (serviceSelect.value === 'full-time') {
          fullTimePlacementChoice.style.display = 'block';
          fullTimePlacementChoice.style.animation = 'fadeInUp 0.5s ease';
        } else {
          fullTimePlacementChoice.style.display = 'none';
        }
      }

      // Toggle Step 4 content based on service type
      if (regularCleaningStep4 && fulltimeFairyStep4) {
        if (serviceSelect.value === 'full-time') {
          regularCleaningStep4.style.display = 'none';
          fulltimeFairyStep4.style.display = 'block';
          // Remove required from regular cleaning fields
          document.querySelectorAll('#regular-cleaning-step4 input[required], #regular-cleaning-step4 select[required]').forEach(field => {
            field.removeAttribute('required');
          });
          // Add required to full-time fairy fields
          document.querySelectorAll('#fulltime-fairy-step4 textarea, #fulltime-fairy-step4 input').forEach(field => {
            field.setAttribute('required', 'required');
          });
        } else {
          regularCleaningStep4.style.display = 'block';
          fulltimeFairyStep4.style.display = 'none';
          // Add required back to regular cleaning fields
          const resCondition = document.getElementById('res-condition');
          const resPestControl = document.getElementById('res-pest-control');
          if (resCondition) resCondition.setAttribute('required', 'required');
          if (resPestControl) resPestControl.setAttribute('required', 'required');
          // Remove required from full-time fairy fields
          document.querySelectorAll('#fulltime-fairy-step4 textarea, #fulltime-fairy-step4 input').forEach(field => {
            field.removeAttribute('required');
          });
        }
      }
    });
  }

  // Conditional Logic: Full-Time Fairy Placement Type
  const placementTypeRadios = document.querySelectorAll('input[name="placement-type"]');
  const companyManagedSection = document.getElementById('company-managed-section');
  const clientManagedSection = document.getElementById('client-managed-section');
  
  placementTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (companyManagedSection && clientManagedSection) {
        if (radio.value === 'company-managed' && radio.checked) {
          companyManagedSection.style.display = 'block';
          clientManagedSection.style.display = 'none';
          companyManagedSection.style.animation = 'fadeInUp 0.5s ease';
          // Make package selection required
          document.querySelectorAll('input[name="maid-package"]').forEach(pkg => {
            pkg.setAttribute('required', 'required');
          });
        } else if (radio.value === 'client-managed' && radio.checked) {
          companyManagedSection.style.display = 'none';
          clientManagedSection.style.display = 'block';
          clientManagedSection.style.animation = 'fadeInUp 0.5s ease';
          // Remove package requirement
          document.querySelectorAll('input[name="maid-package"]').forEach(pkg => {
            pkg.removeAttribute('required');
          });
        }
      }
    });
  });

  // Conditional Logic: Pest Control Types
  const pestControlSelect = document.getElementById('res-pest-control');
  const pestTypesSection = document.getElementById('pest-types-section');
  
  if (pestControlSelect && pestTypesSection) {
    pestControlSelect.addEventListener('change', () => {
      if (pestControlSelect.value === 'yes') {
        pestTypesSection.style.display = 'block';
        pestTypesSection.style.animation = 'fadeInUp 0.5s ease';
        
        // Make pest type checkboxes required
        pestTypesSection.querySelectorAll('input[name="pest-types"]').forEach(cb => {
          cb.setAttribute('data-required-group', 'pest-types');
        });
      } else {
        pestTypesSection.style.display = 'none';
        
        // Remove required and uncheck all
        pestTypesSection.querySelectorAll('input[name="pest-types"]').forEach(cb => {
          cb.checked = false;
          cb.removeAttribute('data-required-group');
        });
      }
    });
  }

  // Clear border color on input
  smartForm.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });

  // Form submission
  smartForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate last step
    if (!validateStep(totalSteps)) {
      alert('Please complete all required fields and agree to the terms.');
      return;
    }

    // Collect all form data
    const formData = new FormData(smartForm);
    const data = {};

    // Convert to object, handling multiple checkboxes
    for (let [key, value] of formData.entries()) {
      if (key === 'pest-types') {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }

    console.log('Smart Booking Form Data:', data);

    // Show success message
    alert('🎉 Thank you for your detailed booking request!\n\nOur Sethakga team will review your information and contact you within 24 hours to confirm your appointment and provide your quotation.\n\nYou will receive a confirmation via WhatsApp and email shortly.');

    // Reset form and go back to step 1
    smartForm.reset();
    showStep(1);

    // In production: Send to backend
    // fetch('/api/bookings/smart', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(response => response.json()).then(result => {
    //   console.log('Success:', result);
    // });
  });

  // Initialize
  showStep(1);
});
