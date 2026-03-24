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
   COMMERCIAL FORM — Multi-step + Conditional Logic
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const comForm = document.getElementById('commercialBookingForm');
  if (!comForm) return;

  const comSteps    = comForm.querySelectorAll('.form-step');
  const comProgress = document.getElementById('comProgressFill');
  const comCurrent  = document.getElementById('comCurrentStep');
  const comTotal    = document.getElementById('comTotalSteps');
  let comStep       = 1;
  const comTotalNum = comSteps.length;
  if (comTotal) comTotal.textContent = comTotalNum;

  function comUpdateProgress() {
    if (comProgress) comProgress.style.width = `${(comStep / comTotalNum) * 100}%`;
    if (comCurrent)  comCurrent.textContent  = `Step ${comStep}`;
  }

  function comShowStep(n) {
    comSteps.forEach((s, i) => s.classList.toggle('active', i + 1 === n));
    comStep = n;
    comUpdateProgress();
    comForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function comValidate(n) {
    const step   = comSteps[n - 1];
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let ok = true;
    inputs.forEach(inp => {
      if (inp.offsetParent !== null) {
        if (!inp.value.trim()) { ok = false; inp.style.borderColor = '#e74c3c'; }
        else inp.style.borderColor = '';
      }
    });
    const terms = document.getElementById('com-terms');
    if (terms && n === comTotalNum && !terms.checked) {
      ok = false;
      alert('Please agree to the service terms to proceed.');
    }
    return ok;
  }

  comForm.querySelectorAll('.com-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (comValidate(comStep)) {
        if (comStep < comTotalNum) comShowStep(comStep + 1);
      } else {
        alert('Please fill in all required fields before continuing.');
      }
    });
  });

  comForm.querySelectorAll('.com-prev-step').forEach(btn => {
    btn.addEventListener('click', () => { if (comStep > 1) comShowStep(comStep - 1); });
  });

  // --- Service conditional logic ---
  const comService      = document.getElementById('com-service');
  const comPropertyType = document.getElementById('com-property-type');

  const comInfoIds = [
    'com-office-regular-info', 'com-deep-info', 'com-construction-info',
    'com-window-info', 'com-industrial-info', 'com-carpet-info', 'com-pest-info'
  ];

  function hideAllComInfo() {
    comInfoIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const freq = document.getElementById('com-frequency-field');
    if (freq) freq.style.display = 'none';
  }

  if (comService) {
    comService.addEventListener('change', () => {
      hideAllComInfo();
      const val = comService.value;
      const map = {
        'office-regular':    'com-office-regular-info',
        'office-deep':       'com-deep-info',
        'construction':      'com-construction-info',
        'window':            'com-window-info',
        'industrial':        'com-industrial-info',
        'carpet-commercial': 'com-carpet-info',
        'pest-commercial':   'com-pest-info',
      };
      if (map[val]) {
        const el = document.getElementById(map[val]);
        if (el) { el.style.display = 'block'; el.style.animation = 'fadeInUp 0.4s ease'; }
      }
      // Frequency field only for recurring services
      const freqField = document.getElementById('com-frequency-field');
      if (freqField) freqField.style.display = val === 'office-regular' ? 'block' : 'none';
    });
  }

  // Show service days when recurring frequency chosen
  const comFrequency = document.getElementById('com-frequency');
  if (comFrequency) {
    comFrequency.addEventListener('change', () => {
      const days = document.getElementById('com-service-days');
      if (days) {
        days.style.display = ['daily', 'weekly', 'bi-weekly'].includes(comFrequency.value) ? 'block' : 'none';
      }
    });
  }

  // Show construction site condition when property type = construction
  if (comPropertyType) {
    comPropertyType.addEventListener('change', () => {
      const cd = document.getElementById('com-construction-details');
      if (cd) cd.style.display = comPropertyType.value === 'construction' ? 'block' : 'none';
    });
  }

  // Clear validation borders
  comForm.querySelectorAll('input, select, textarea').forEach(inp => {
    inp.addEventListener('input', () => { inp.style.borderColor = ''; });
  });

  // Submission
  comForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!comValidate(comTotalNum)) return;
    const data = {};
    for (let [k, v] of new FormData(comForm).entries()) {
      data[k] = data[k] ? [].concat(data[k], v) : v;
    }
    console.log('Commercial Booking:', data);
    alert('Thank you for your quote request!\n\nOur commercial team will review your details and contact you within 24 hours with a customised quote.\n\nYou will receive a confirmation via WhatsApp and email shortly.');
    comForm.reset();
    hideAllComInfo();
    comShowStep(1);
  });

  comShowStep(1);
});

/* ============================================================
   CONTACT PAGE — Conditional maid service fields
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const serviceSelect = document.getElementById('service');
  if (!serviceSelect) return;

  const recurringServices = [
    'maid-once-week', 'maid-twice-week', 'maid-thrice-week', 'maid-fulltime'
  ];
  const allMaidServices = [
    'maid-once-off', 'maid-biweekly',
    'maid-once-week', 'maid-twice-week', 'maid-thrice-week', 'maid-fulltime'
  ];

  const transportNotice = document.getElementById('transport-notice');
  const transportField  = document.getElementById('transport-field');
  const serviceDaysField = document.getElementById('service-days-field');
  const startDateField  = document.getElementById('start-date-field');

  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  serviceSelect.addEventListener('change', () => {
    const val = serviceSelect.value;
    const isMaid = allMaidServices.includes(val);
    const isRecurring = recurringServices.includes(val);

    if (isMaid) {
      show(transportNotice);
      show(transportField);
      show(startDateField);
    } else {
      hide(transportNotice);
      hide(transportField);
      hide(startDateField);
    }

    if (isRecurring) {
      show(serviceDaysField);
    } else {
      hide(serviceDaysField);
    }
  });
});

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

      // Maid service info boxes
      const onceoffInfo   = document.getElementById('maid-onceoff-info');
      const recurringInfo = document.getElementById('maid-recurring-info');
      const transportNotice = document.getElementById('maid-transport-notice');
      const transportField  = document.getElementById('maid-transport-field');
      const serviceDays     = document.getElementById('maid-service-days');

      const onceoffServices  = ['maid-once-off', 'maid-biweekly'];
      const recurringServices = ['maid-weekly', 'maid-twice'];
      const allMaidServices  = [...onceoffServices, ...recurringServices, 'full-time'];
      const val = serviceSelect.value;

      if (onceoffInfo)    onceoffInfo.style.display   = onceoffServices.includes(val)  ? 'block' : 'none';
      if (recurringInfo)  recurringInfo.style.display  = recurringServices.includes(val) ? 'block' : 'none';
      if (transportNotice) transportNotice.style.display = allMaidServices.includes(val) ? 'flex'  : 'none';
      if (transportField)  transportField.style.display  = allMaidServices.includes(val) ? 'block' : 'none';
      if (serviceDays)     serviceDays.style.display     = recurringServices.includes(val) ? 'block' : 'none';

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

/* ====================================================
   REWARDS PAGE — FAQ Accordion + Referral Form
   ==================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        faqItems.forEach(other => {
          const ob = other.querySelector('.faq-question');
          const oa = other.querySelector('.faq-answer');
          if (ob && oa) {
            ob.setAttribute('aria-expanded', 'false');
            oa.style.display = 'none';
          }
        });

        // Toggle clicked
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.display = 'block';
          answer.style.animation = 'fadeInUp 0.3s ease';
        }
      });
    });
  }

  // ---- Referral Form ----
  const referralForm = document.getElementById('referralForm');
  if (!referralForm) return;

  referralForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const yourName    = referralForm.querySelector('#ref-your-name').value.trim();
    const yourPhone   = referralForm.querySelector('#ref-your-phone').value.trim();
    const friendName  = referralForm.querySelector('#ref-friend-name').value.trim();
    const friendPhone = referralForm.querySelector('#ref-friend-phone').value.trim();
    const consent     = referralForm.querySelector('#ref-consent').checked;

    if (!yourName || !yourPhone || !friendName || !friendPhone) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    if (!consent) {
      alert('Please confirm that your friend is happy for you to share their details.');
      return;
    }

    const friendArea    = referralForm.querySelector('#ref-friend-area').value.trim();
    const serviceInterest = referralForm.querySelector('#ref-service').value;
    const message       = referralForm.querySelector('#ref-message').value.trim();

    const serviceLabels = {
      'maid-regular':  'Regular Maid / Domestic Worker',
      'maid-onceoff':  'Once-Off / Deep Cleaning',
      'carpet':        'Carpet & Upholstery Cleaning',
      'pest':          'Pest Control',
      'commercial':    'Commercial / Office Cleaning',
      'hair-braiding': 'Hair Braiding (Sethakga HAIR)',
      'not-sure':      'Not sure yet',
      '':              'Not specified'
    };

    const waText = encodeURIComponent(
      `Hi Sethakga! I'd like to refer a friend 🌟\n\n` +
      `MY DETAILS\nName: ${yourName}\nPhone: ${yourPhone}\n\n` +
      `FRIEND'S DETAILS\nName: ${friendName}\nPhone: ${friendPhone}` +
      (friendArea ? `\nArea: ${friendArea}` : '') +
      (serviceInterest ? `\nInterested in: ${serviceLabels[serviceInterest] || serviceInterest}` : '') +
      (message ? `\n\nExtra info: ${message}` : '') +
      `\n\nPlease apply my referral reward to my next booking. Thank you!`
    );

    const waUrl = `https://wa.me/27729249068?text=${waText}`;

    // Provide confirmation and open WhatsApp
    alert(`Thank you, ${yourName}! We'll reach out to ${friendName} and apply your reward once they complete their first booking. Opening WhatsApp now...`);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    referralForm.reset();
  });

});
