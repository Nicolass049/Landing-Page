document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initCarousel();
  initScrollAnimations();
  initBackToTop();
  initOrderForm();
});


function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 
}


function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('nav-overlay');

  if (!hamburger || !navLinks) return;

  
  const openMenu = () => {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');

    if (overlay) {
      overlay.classList.add('active');
      overlay.removeAttribute('aria-hidden');
    }

    
    document.body.style.overflow = 'hidden';

    
    const firstLink = navLinks.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  };

  
  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');

    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    document.body.style.overflow = '';
  };

 
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

 
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      hamburger.focus(); 
    }
  });

  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
}


function initCarousel() {
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (!track || !prevBtn || !nextBtn) return;

  const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
  const dots     = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];

  let current     = 0;
  let autoTimer   = null;
  let touchStartX = 0;
  let isDragging  = false;
  let dragStartX  = 0;

  
  const getVisible = () => {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;   
    if (w <= 1200) return 2;  
    return 3;                 
  };

  
  const getMax = () => Math.max(0, slides.length - getVisible());

  
  const getSlideWidth = () => {
    if (!slides[0]) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return slides[0].getBoundingClientRect().width + gap;
  };

  
  const goTo = (index) => {
    const max = getMax();
    current   = Math.max(0, Math.min(index, max));

    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;

    
    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

    
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === max;
  };

  
  const goNext = () => goTo(current >= getMax() ? 0 : current + 1);
  const goPrev = () => goTo(current <= 0 ? getMax() : current - 1);

  
  const startAuto = () => {
    autoTimer = setInterval(goNext, 4500);
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
  };

  const resetAuto = () => {
    stopAuto();
    startAuto();
  };

  
  nextBtn.addEventListener('click', () => { resetAuto(); goNext(); });
  prevBtn.addEventListener('click', () => { resetAuto(); goPrev(); });

  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { resetAuto(); goTo(i); });
  });

  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      resetAuto();
      delta > 0 ? goNext() : goPrev();
    }
  });

 
  track.addEventListener('mousedown', (e) => {
    isDragging  = true;
    dragStartX  = e.clientX;
    track.style.cursor = 'grabbing';
    stopAuto();
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';

    const delta = dragStartX - e.clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev();
    }
    startAuto();
  });

  
  track.addEventListener('dragstart', (e) => e.preventDefault());

 
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(current), 150);
  });

  
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { resetAuto(); goNext(); }
    if (e.key === 'ArrowLeft')  { resetAuto(); goPrev(); }
  });

  
  goTo(0);
  startAuto();
}


function initScrollAnimations() {
  
  const elements = document.querySelectorAll('.scroll-reveal');

  
  const heroElements = new Set(
    document.querySelectorAll('.hero .scroll-reveal')
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.12,              
      rootMargin: '0px 0px -50px 0px', 
    }
  );

  elements.forEach((el) => {
    
    if (heroElements.has(el)) return;
    observer.observe(el);
  });
}


function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const THRESHOLD = window.innerHeight * 0.6;

  
  const toggleBtn = () => {
    btn.classList.toggle('visible', window.scrollY > THRESHOLD);
  };

  window.addEventListener('scroll', toggleBtn, { passive: true });

  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  toggleBtn(); 
}


function initOrderForm() {
  const form        = document.getElementById('pedido-form');
  const submitBtn   = document.getElementById('submit-btn');
  const successBox  = document.getElementById('form-success');
  const errorBox    = document.getElementById('form-error');
  const newOrderBtn = document.getElementById('new-order-btn');

  if (!form) return;

  
  const API_URL = 'http://localhost:3000/api/pedidos';

  

  
  const errorMessages = {
    nombre:    'El nombre es obligatorio.',
    email:     'Introduce un correo electrónico válido.',
    cantidad:  'La cantidad debe ser entre 1 y 99.',
    producto:  'Selecciona un producto.',
    direccion: 'La dirección de envío es obligatoria.',
  };

  
  const validateField = (field) => {
    const errorEl = field.closest('.form-group')?.querySelector('.field-error');
    let   message = '';
    let   isValid = true;

    if (field.required && !field.value.trim()) {
      isValid = false;
      message = errorMessages[field.name] || 'Este campo es obligatorio.';
    } else if (field.type === 'email' && field.value) {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(field.value)) {
        isValid = false;
        message = errorMessages.email;
      }
    } else if (field.type === 'number' && field.value) {
      const val = parseInt(field.value, 10);
      if (isNaN(val) || val < 1 || val > 99) {
        isValid = false;
        message = errorMessages.cantidad;
      }
    }

    field.classList.toggle('invalid', !isValid);
    if (errorEl) errorEl.textContent = message;

    return isValid;
  };

  
  const validateAll = () => {
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });
    return allValid;
  };

  
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    
    if (!validateAll()) {
      
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    
    const payload = {
      nombre:    form.nombre.value.trim(),
      email:     form.email.value.trim(),
      telefono:  form.telefono?.value.trim() || '',
      producto:  form.producto.value,
      cantidad:  parseInt(form.cantidad.value, 10),
      direccion: form.direccion.value.trim(),
    };

    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    errorBox.hidden    = true;

    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Pedido guardado correctamente:', result.pedido);

      
      form.hidden          = true;
      successBox.hidden    = false;
      errorBox.hidden      = true;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      console.error('❌ Error al enviar el pedido:', err.message);

      
      errorBox.hidden    = false;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  
  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', () => {
      
      form.reset();
      form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      
      form.hidden          = false;
      successBox.hidden    = true;
      errorBox.hidden      = true;
      submitBtn.classList.remove('loading');
      submitBtn.disabled   = false;

      
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}