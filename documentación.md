Para iniciar el proyecto inicialmente clonaremos el repositorio con:
https://github.com/Nicolass049/Landing-Page

A continuación en la terminal escribimos:
npm install

Y seguidamente:

node server.js

Deberías ver en la terminal:


🧱  LEGO Star Wars Backend iniciado
🌐  URL:          http://localhost:3000
📁  Base datos:   .../data/pedidos.json

En el navegador ve a:
http://localhost:3000

Para parar el servidor:
Ctrl+C


Enumeración de las 5 funcionalidades principales:
1. Menú hamburguesa.
2. Carrusel de ediciones.
3. Animaciones al hacer scroll.
4. Botón volver arriba.
5. Formulario con backend.

Funcionalidad 1 — Menú hamburguesa

El menú hamburguesa es un botón de navegación que aparece únicamente en dispositivos móviles (pantallas menores de 768px). Al pulsarlo, despliega un panel lateral desde la derecha con todos los enlaces de navegación. El botón muestra una animación de tres líneas que se transforman en una X al abrirse. Al pulsar cualquier enlace, el overlay oscuro o la tecla `Escape`, el menú se cierra automáticamente.
El botón hamburguesa está oculto en escritorio mediante CSS (`display: none`) y se activa en móvil con una media query. Cuando el usuario pulsa el botón, JavaScript añade y elimina clases CSS que controlan la visibilidad del panel y la animación del icono. Un overlay semitransparente se superpone al contenido de fondo bloqueando la interacción. Durante la apertura, el scroll del `body` se bloquea para evitar desplazamientos accidentales.

<button
  class="hamburger"
  id="hamburger"
  aria-label="Abrir menú de navegación"
  aria-expanded="false"
  aria-controls="nav-links"
>
  <span class="ham-line" aria-hidden="true"></span>
  <span class="ham-line" aria-hidden="true"></span>
  <span class="ham-line" aria-hidden="true"></span>
</button>

.hamburger.active .ham-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
  background: var(--yellow);
}
.hamburger.active .ham-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger.active .ham-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
  background: var(--yellow);
}

const openMenu = () => {
  hamburger.classList.add('active');
  navLinks.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  const firstLink = navLinks.querySelector('.nav-link');
  if (firstLink) firstLink.focus();
};

const closeMenu = () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};


Funcionalidad 2 — Carrusel de ediciones

El carrusel muestra las 5 ediciones del juego en tarjetas deslizables. El usuario puede navegar mediante flechas anterior/siguiente, haciendo clic en los puntos indicadores (dots), deslizando con el dedo en pantallas táctiles o arrastrando con el ratón. El carrusel avanza automáticamente cada 4,5 segundos y se pausa cuando el ratón está encima. El número de tarjetas visibles se adapta al tamaño de pantalla: 3 en escritorio, 2 en tablet y 1 en móvil.
El carrusel usa un contenedor `track` con `display: flex` que contiene todos los slides. El desplazamiento se consigue aplicando `transform: translateX()` al track con el valor calculado en función del índice actual y el ancho de cada slide. Los dots y botones sincronizan su estado visual con el slide activo. Los eventos `touchstart`/`touchend` y `mousedown`/`mouseup` detectan gestos de swipe y drag respectivamente.


<div class="carousel-wrapper">
  <div class="carousel-track" id="carousel-track">
    <article class="carousel-slide">...</article>
    <article class="carousel-slide">...</article>
    <!-- 5 slides en total -->
  </div>
  <button class="carousel-btn carousel-prev" id="carousel-prev">&#8592;</button>
  <button class="carousel-btn carousel-next" id="carousel-next">&#8594;</button>
  <div class="carousel-dots" id="carousel-dots">
    <button class="dot active" data-index="0"></button>
    <!-- 5 dots en total -->
  </div>
</div>

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


Funcionalidad 3 — Animaciones al hacer scroll

Los elementos de la página (títulos, tarjetas, estadísticas, formulario) aparecen con una animación de fundido y desplazamiento vertical cuando el usuario hace scroll y el elemento entra en el área visible del navegador. Cada elemento se anima una sola vez y de forma independiente. Los elementos del hero se animan automáticamente al cargar la página mediante CSS puro, sin necesitar scroll.
Se usa la API `IntersectionObserver` de JavaScript, que observa de forma eficiente si un elemento está visible en el viewport sin necesidad de escuchar el evento `scroll` continuamente. Cuando un elemento cruza el umbral de visibilidad definido, se le añade la clase `in-view` que activa su transición CSS. Una vez animado, el observer deja de observarlo para optimizar el rendimiento.

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}


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


Funcionalidad 4 — Botón volver arriba

Un botón circular con una flecha hacia arriba aparece en la esquina inferior derecha de la pantalla cuando el usuario ha hecho scroll más allá del 60% de la altura de la ventana. Al pulsarlo, la página vuelve suavemente al inicio. El botón aparece y desaparece con una transición animada y cambia de color al pasar el ratón por encima.
El botón está siempre presente en el DOM pero invisible gracias a `opacity: 0` y `pointer-events: none`. Un listener del evento `scroll` evalúa continuamente la posición de desplazamiento y añade o elimina la clase `visible` que activa las transiciones CSS de aparición. Al hacer clic, se llama a `window.scrollTo` con `behavior: 'smooth'` para un desplazamiento animado.

<button id="back-to-top" class="back-to-top" aria-label="Volver al inicio de la página">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
</button>

.back-to-top {
  position: fixed;
  bottom: 2rem; right: 2rem;
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top.visible {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
}

.back-to-top:hover {
  background: var(--yellow);
  color: var(--bg);
  transform: translateY(-3px);
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const THRESHOLD = window.innerHeight * 0.6;

  const toggleBtn = () => {
    btn.classList.toggle('visible', window.scrollY > THRESHOLD);
  };

  window.addEventListener('scroll', toggleBtn, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleBtn();
}


Funcionalidad 5 — Formulario con backend

La sección Tienda contiene un formulario con los campos nombre, email, teléfono, cantidad, producto y dirección. Al enviarlo, los datos se validan en el cliente mostrando mensajes de error específicos por campo. Si la validación es correcta, se envía una petición al servidor y el pedido se guarda en `data/pedidos.json`. El formulario muestra un mensaje de éxito animado o un mensaje de error si el servidor no está disponible.
El frontend recoge los datos del formulario y los envía mediante la API `fetch` con método POST y cabecera `Content-Type: application/json` al endpoint `/api/pedidos` del servidor Express. El servidor valida los datos recibidos, construye un objeto pedido con un ID único (timestamp) y la fecha actual, lo añade al array del archivo JSON y lo guarda en disco. Devuelve una respuesta JSON con el resultado de la operación.

<form id="pedido-form" class="pedido-form" novalidate>
  <div class="form-group">
    <label for="nombre">Nombre completo <span>*</span></label>
    <input type="text" id="nombre" name="nombre"
           placeholder="Han Solo" required />
    <span class="field-error" aria-live="polite"></span>
  </div>
  <div class="form-group">
    <label for="producto">Producto <span>*</span></label>
    <select id="producto" name="producto" required>
      <option value="" disabled selected>Selecciona una edición</option>
      <option value="edicion-estandar">Edición Estándar — 29,99 €</option>
    </select>
  </div>
  <button type="submit" id="submit-btn">
    <span class="btn-text">Confirmar Pedido 🧱</span>
    <span class="btn-loading">Enviando...</span>
  </button>
</form>

const validateField = (field) => {
  const errorEl = field.closest('.form-group')?.querySelector('.field-error');
  let message = '';
  let isValid = true;

  if (field.required && !field.value.trim()) {
    isValid = false;
    message = errorMessages[field.name] || 'Este campo es obligatorio.';
  } else if (field.type === 'email' && field.value) {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(field.value)) {
      isValid = false;
      message = errorMessages.email;
    }
  }

  field.classList.toggle('invalid', !isValid);
  if (errorEl) errorEl.textContent = message;
  return isValid;
};


app.post('/api/pedidos', (req, res) => {
  const { nombre, email, producto, cantidad, direccion } = req.body;

  const nuevoPedido = {
    id:        Date.now(),
    fecha:     new Date().toISOString(),
    nombre:    nombre.trim(),
    email:     email.trim().toLowerCase(),
    producto:  producto.trim(),
    cantidad:  parseInt(cantidad, 10),
    direccion: direccion.trim(),
    estado:    'pendiente',
  };

  const pedidos = readDB();
  pedidos.push(nuevoPedido);
  writeDB(pedidos);

  res.status(201).json({ success: true, pedido: nuevoPedido });
});



Responsividad

La landing page se adapta correctamente a cinco tipos de dispositivos: escritorio (>1200px), tablet en horizontal (769px–1200px), tablet en vertical (601px–768px), móvil en horizontal (481px–600px) y móvil en vertical (≤480px). Los layouts cambian de múltiples columnas a una sola columna, los tamaños de fuente se escalan con `clamp()`, el menú hamburguesa sustituye a la navegación horizontal en móvil y el carrusel adapta el número de slides visibles.
La responsividad se consigue mediante una combinación de CSS Grid, Flexbox, unidades relativas (`clamp`, `vw`, `dvh`) y media queries para cada breakpoint. Se sigue un enfoque de diseño adaptativo donde cada breakpoint redefine el layout, tipografía y componentes específicos. El JavaScript del carrusel también responde al cambio de tamaño de ventana recalculando el número de slides visibles con `window.addEventListener('resize')`.

.hero-title-lego {
  font-size: clamp(4rem, 10vw, 8rem);
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
}

@media (max-width: 1200px) and (min-width: 769px) {
  .chars-grid    { grid-template-columns: repeat(2, 1fr); }
  .carousel-slide{ flex: 0 0 calc(50% - 0.75rem); }
  .tienda-grid   { gap: 2.5rem; }
}

@media (max-width: 768px) {
  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 0; right: -100%;
    width: min(280px, 78vw);
    height: 100dvh;
    flex-direction: column;
    justify-content: center;
    border-left: 2px solid var(--border-yellow);
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-links.open { right: 0; }

  .hero           { flex-direction: column; text-align: center; }
  .hero-figure    { display: none; }
  .saga-grid      { grid-template-columns: 1fr; }
  .tienda-grid    { grid-template-columns: 1fr; }
  .footer-grid    { grid-template-columns: 1fr; }
}

const getVisible = () => {
  const w = window.innerWidth;
  if (w <= 480) return 1;
  if (w <= 768) return 2;
  if (w <= 1200) return 2;
  return 3;
};

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => goTo(current), 150);
});