/* ==========================================================
   CÓDIGO U · Página de presentación
   WhatsApp, búhos, menú, acordeón y animaciones (GSAP)
   ========================================================== */
(() => {
  const root = document.documentElement;

  // Si GSAP no cargó (sin internet, bloqueado), la página se muestra quieta.
  if (!(window.gsap && window.ScrollTrigger)) root.classList.remove('anim');
  const animate = root.classList.contains('anim');

  /* ---------- WhatsApp ---------- */
  // Número con indicativo de país, sin "+" ni espacios. Ej.: '573001234567'.
  const WHATSAPP_NUMBER = '573203741821';
  const WA_MESSAGES = {
    general: 'Hola, CÓDIGO U 👋 Quiero información sobre el plan Pre-ICFES de $99.900.',
    a: 'Hola, CÓDIGO U 👋 Quiero el plan Calendario A (Agosto – Septiembre) de $99.900.',
    b: 'Hola, CÓDIGO U 👋 Quiero el plan Calendario B (Marzo – Abril) de $99.900.',
  };
  const waLink = (plan) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGES[plan] || WA_MESSAGES.general)}`;
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

  /* ---------- Plan destacado: la temporada que viene ---------- */
  // De mayo a septiembre se prepara el Calendario A; el resto del año, el Calendario B.
  const month = new Date().getMonth(); // 0 = enero
  const nextSeason = month >= 4 && month <= 8 ? 'a' : 'b';
  document.querySelector(`.plan[data-season="${nextSeason}"]`)?.classList.add('is-next');

  /* ---------- Búhos ---------- */
  const owlTpl = document.getElementById('owl-tpl');
  document.querySelectorAll('[data-owl]').forEach((el) => el.replaceChildren(owlTpl.content.cloneNode(true)));

  /* ---------- Búho que reacciona al tocarlo: cuenta datos de Código U, en orden ---------- */
  const OWL_FACTS = [
    'Código U nació de estudiantes, para estudiantes.',
    'Somos de tres ciudades: Bogotá, Bucaramanga y Piedecuesta.',
    'Tenemos casi 3.000 preguntas para que practiques.',
    'Te esperan 3 simulacros tipo Saber 11.',
    'Entrenas las 5 áreas: lectura crítica, matemáticas, sociales, ciencias e inglés.',
    'Cada pregunta trae su explicación paso a paso.',
    'La plataforma está abierta 24/7, también desde tu celular.',
    'Hay clases en vivo con profes y material descargable.',
    '¿Te perdiste una clase? Tienes talleres para ponerte al día.',
    'En la zona VIP llevas una racha diaria, como en Duolingo.',
    'Pagas por WhatsApp, con Nequi o tarjeta.',
    'Ángel Parra creó Código U. Ángel Castro y Steven Fonseca programan la plataforma.',
  ];
  let fact = 0;
  // Tiempo para leer la burbuja: más largo si el dato es largo
  const readTime = (text) => Math.max(2.4, text.length * 0.06);
  document.querySelectorAll('[data-poke]').forEach((wrap) => {
    const isMascot = wrap.hasAttribute('data-mascot');
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', isMascot ? 'Búho de Código U: tócalo para ver un dato o arrástralo' : 'Búho de Código U, tócalo');
    const bubble = document.createElement('span');
    bubble.className = 'owl-bubble';
    bubble.setAttribute('aria-live', 'polite');
    wrap.appendChild(bubble);
    if (isMascot) {
      const hint = document.createElement('span');
      hint.className = 'owl-hint';
      hint.textContent = 'Tócame · Muéveme';
      wrap.appendChild(hint);
    }

    // La burbuja se acomoda según dónde esté la mascota (arriba/abajo, izquierda/derecha)
    const placeBubble = () => {
      if (!isMascot) return;
      const r = wrap.getBoundingClientRect();
      bubble.classList.toggle('to-left', r.left + r.width / 2 < innerWidth / 2);
      bubble.classList.toggle('below', r.top < 200);
    };

    const poke = () => {
      if (wrap.dragged) return; // fue un arrastre, no un toque
      wrap.querySelector('.owl-hint')?.remove();
      const text = OWL_FACTS[fact++ % OWL_FACTS.length];
      bubble.textContent = text;
      placeBubble();

      if (!animate) {
        bubble.classList.add('is-on');
        clearTimeout(bubble.hideTimer);
        bubble.hideTimer = setTimeout(() => bubble.classList.remove('is-on'), readTime(text) * 1000);
        return;
      }
      const svg = wrap.querySelector('.owl');
      const horns = [svg.querySelector('.om-horn-l'), svg.querySelector('.om-horn-r')];
      const wing = svg.querySelector('.om-gold');
      gsap.killTweensOf([svg, ...horns, wing, bubble]);

      // Salto con aplastado y estirado, un giro corto y aterriza rebotando
      gsap.timeline()
        .to(svg, { scaleX: 1.12, scaleY: 0.86, y: 8, rotation: 0, transformOrigin: '50% 100%', duration: 0.12, ease: 'power2.in' })
        .to(svg, { scaleX: 0.94, scaleY: 1.08, y: -34, rotation: gsap.utils.random([-10, 10]), duration: 0.28, ease: 'power2.out' })
        .to(svg, { scaleX: 1, scaleY: 1, y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' });
      // Orejas que se agitan y ala dorada que aletea
      horns.forEach((horn, i) => gsap.fromTo(horn, { rotation: 0 }, {
        rotation: i ? 16 : -16, transformOrigin: i ? '0% 100%' : '100% 100%',
        duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut',
      }));
      gsap.fromTo(wing, { rotation: 0 }, { rotation: -22, transformOrigin: '100% 0%', duration: 0.14, yoyo: true, repeat: 5, ease: 'sine.inOut' });
      // Burbuja con el dato
      const below = bubble.classList.contains('below');
      gsap.timeline()
        .fromTo(bubble, { scale: 0, opacity: 0, y: below ? -10 : 10 }, { scale: 1, opacity: 1, y: 0, transformOrigin: below ? '50% 0%' : '50% 100%', duration: 0.4, ease: 'back.out(2.5)' })
        .to(bubble, { opacity: 0, y: below ? 8 : -8, duration: 0.3 }, `+=${readTime(text)}`);
    };
    wrap.addEventListener('click', poke);
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); }
    });
    if (isMascot) makeDraggable(wrap, bubble);
  });

  /* ---------- Mascota: se arrastra a cualquier parte de la pantalla ---------- */
  function makeDraggable(el, bubble) {
    const KEY = 'cu-mascota';
    const clamp = (x, y) => {
      const r = el.getBoundingClientRect();
      return [Math.min(Math.max(8, x), innerWidth - r.width - 8), Math.min(Math.max(8, y), innerHeight - r.height - 8)];
    };
    const place = (x, y) => {
      [x, y] = clamp(x, y);
      Object.assign(el.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto' });
      // El aviso "Tócame" se pone del lado con más espacio
      el.querySelector('.owl-hint')?.classList.toggle('to-right', x < innerWidth / 2);
    };
    // Recordar dónde la dejó la persona (en proporción a la pantalla)
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) place(saved[0] * innerWidth, saved[1] * innerHeight);
    } catch (e) { /* sin almacenamiento: queda en su esquina */ }

    let drag = null;
    el.addEventListener('pointerdown', (e) => {
      const r = el.getBoundingClientRect();
      drag = { px: e.clientX, py: e.clientY, x: r.left, y: r.top, moved: false, id: e.pointerId };
    });
    el.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.px;
      const dy = e.clientY - drag.py;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 6) return; // un toque pequeño no cuenta como arrastre
        drag.moved = true;
        try { el.setPointerCapture(drag.id); } catch (err) { /* algunos navegadores no lo permiten */ }
        el.classList.add('is-dragging');
        bubble.classList.remove('is-on');
        if (window.gsap) gsap.to(bubble, { opacity: 0, duration: 0.15 });
      }
      place(drag.x + dx, drag.y + dy);
    });
    const end = () => {
      if (!drag) return;
      if (drag.moved) {
        el.classList.remove('is-dragging');
        el.dragged = true; // evita que el clic de soltar cuente como toque
        setTimeout(() => { el.dragged = false; }, 60);
        const r = el.getBoundingClientRect();
        try { localStorage.setItem(KEY, JSON.stringify([r.left / innerWidth, r.top / innerHeight])); } catch (e) { /* nada */ }
      }
      drag = null;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    // Si cambia el tamaño de la pantalla, que no quede por fuera
    addEventListener('resize', () => {
      if (!el.style.left) return;
      const r = el.getBoundingClientRect();
      place(r.left, r.top);
    });
  }

  /* ---------- Reloj: marcas de las horas ---------- */
  const ticks = document.querySelector('.clock__ticks');
  if (ticks) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const [r1, r2] = i % 3 === 0 ? [70, 84] : [76, 84];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 100 + Math.sin(a) * r1);
      line.setAttribute('y1', 100 - Math.cos(a) * r1);
      line.setAttribute('x2', 100 + Math.sin(a) * r2);
      line.setAttribute('y2', 100 - Math.cos(a) * r2);
      ticks.appendChild(line);
    }
  }

  /* ---------- Menú: fondo al bajar, se esconde al bajar rápido ---------- */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    nav.classList.toggle('is-hidden', y > 600 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ---------- Partir texto en palabras (conserva <em>, <strong>) ---------- */
  function splitWords(el) {
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return splitWords(node);
      if (node.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
        const w = document.createElement('span');
        w.className = 'w';
        const wi = document.createElement('span');
        wi.className = 'wi';
        wi.textContent = part;
        w.appendChild(wi);
        frag.appendChild(w);
      });
      node.replaceWith(frag);
    });
    return el.querySelectorAll('.wi');
  }

  /* ---------- Preguntas frecuentes ---------- */
  document.querySelectorAll('.faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    const body = d.querySelector('p');
    summary.addEventListener('click', (e) => {
      if (!animate) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, {
          height: 0, paddingBottom: 0, opacity: 0, overflow: 'hidden', duration: 0.35, ease: 'power2.inOut',
          onComplete: () => { d.open = false; gsap.set(body, { clearProps: 'all' }); },
        });
      } else {
        d.open = true;
        gsap.from(body, { height: 0, paddingBottom: 0, opacity: 0, overflow: 'hidden', duration: 0.5, ease: 'power3.out', clearProps: 'all' });
      }
    });
  });

  if (!animate) return;

  /* ==========================================================
     Animaciones
     ========================================================== */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const finePointer = matchMedia('(pointer: fine)').matches;

  // Los disparadores se calculan en el orden de la página: así cada sección fija
  // (notas, paneles) suma su espacio a todo lo que viene después.
  const byPageOrder = (a, b) => {
    if (a.trigger === b.trigger) return 0;
    return a.trigger.compareDocumentPosition(b.trigger) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  };

  /* ---------- 1. Intro del búho ---------- */
  const loader = document.querySelector('.loader');
  const lOwl = loader.querySelector('.owl');
  const heroWords = splitWords(document.querySelector('.hero__title'));
  const heroOwl = document.querySelector('.mascot__owl');
  const heroReveal = document.querySelectorAll('.hero .reveal');
  gsap.set(heroWords, { yPercent: 110 });
  gsap.set(heroReveal, { y: 24, opacity: 0 });
  gsap.set(heroOwl, { scale: 0.6, rotation: -12, opacity: 0 });

  loader.style.animation = 'none';
  document.body.style.overflow = 'hidden';

  // Al final, el búho grande vuela y se encoge hasta el búho del menú (zoom invertido)
  const lOwlBox = loader.querySelector('.loader__owl');
  const navOwl = document.querySelector('.nav__brand img');
  nav.classList.remove('is-hidden');
  gsap.set(navOwl, { opacity: 0 });
  let flyTo = null;
  const fly = (key) => {
    if (!flyTo) {
      const a = lOwlBox.getBoundingClientRect();
      const b = navOwl.getBoundingClientRect();
      flyTo = {
        x: b.left + b.width / 2 - (a.left + a.width / 2),
        y: b.top + b.height / 2 - (a.top + a.height / 2),
        s: b.width / a.width,
      };
    }
    return flyTo[key];
  };

  const FLY = 1.9; // segundos que dura el vuelo del búho hasta el menú
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from(lOwl.querySelectorAll('.om-leaf-l, .om-leaf-r'), { y: 80, opacity: 0, duration: 0.8, stagger: 0.1 })
    .from(lOwl.querySelectorAll('.om-head path:not(.om-horn-l):not(.om-horn-r)'), { y: -40, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.45')
    .from(lOwl.querySelector('.om-horn-l'), { rotation: -28, x: -24, opacity: 0, transformOrigin: '100% 100%', duration: 0.7, ease: 'back.out(2.2)' }, '-=0.3')
    .from(lOwl.querySelector('.om-horn-r'), { rotation: 28, x: 24, opacity: 0, transformOrigin: '0% 100%', duration: 0.7, ease: 'back.out(2.2)' }, '<')
    .from(lOwl.querySelector('.om-gold'), { scale: 0, transformOrigin: '100% 0%', duration: 0.6, ease: 'back.out(2.4)' }, '-=0.35')
    .from('.loader__word span', { yPercent: 120, opacity: 0, duration: 0.55, stagger: 0.05 }, '-=0.35')
    .from('.loader__tag', { y: 12, opacity: 0, duration: 0.5 }, '-=0.2')
    // Se van las letras y el búho toma impulso
    .to(['.loader__word', '.loader__tag', '.loader__skip'], { y: 20, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.5')
    .to(lOwl, { scale: 1.15, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.out' }, '<0.1')
    // Vuela a la esquina mientras se descubre la página (lento, para que se disfrute)
    .addLabel('fly', '+=0.1')
    .to(lOwlBox, { x: () => fly('x'), y: () => fly('y'), scale: () => fly('s'), duration: FLY, ease: 'power3.inOut' }, 'fly')
    .to(lOwl, { scale: 1, duration: FLY, ease: 'power3.inOut' }, 'fly')
    .to(loader, { backgroundColor: 'rgba(244, 234, 211, 0)', duration: 1.3, ease: 'power2.inOut' }, 'fly+=0.35')
    .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, 'fly+=0.9')
    .to(heroReveal, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 'fly+=1.3')
    // Aterriza: el búho del menú toma su lugar con un pequeño rebote
    .set(lOwlBox, { opacity: 0 }, `fly+=${FLY}`)
    .set(navOwl, { opacity: 1 }, `fly+=${FLY}`)
    .fromTo(navOwl, { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, `fly+=${FLY}`)
    // Y aparece la mascota en su esquina
    .to(heroOwl, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }, `fly+=${FLY - 0.2}`)
    .add(() => {
      loader.remove();
      document.body.style.overflow = '';
      ScrollTrigger.refresh();
    });

  loader.querySelector('.loader__skip').addEventListener('click', () => intro.progress(1));

  // Quien ya vio la intro en esta visita la ve un poco más rápido (sin perder el vuelo).
  try {
    if (sessionStorage.getItem('cu-intro')) intro.timeScale(1.3);
    sessionStorage.setItem('cu-intro', '1');
  } catch (e) { /* sin almacenamiento: no pasa nada */ }

  /* ---------- Búhos: flotan y miran hacia el cursor ---------- */
  gsap.to(heroOwl, { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (finePointer) {
    const heads = [...document.querySelectorAll('[data-follow] .om-head')].map((h) =>
      gsap.quickTo(h, 'rotation', { duration: 0.8, ease: 'power3.out' }));
    addEventListener('mousemove', (e) => {
      const dx = (e.clientX / innerWidth - 0.5) * 2;
      heads.forEach((to) => to(dx * 9));
    }, { passive: true });
  }

  /* ---------- Titulares que suben palabra por palabra ---------- */
  document.querySelectorAll('[data-split]:not(.hero__title):not([data-split="fade"])').forEach((el) => {
    gsap.from(splitWords(el), {
      yPercent: 110, duration: 1, stagger: 0.045, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* ---------- 3. Notas que caen ---------- */
  // La escena se queda fija y las notas caen una por una dentro de la pantalla.
  // En computador quedan regadas; en celular se apilan (lo decide el CSS).
  const drop = gsap.timeline({
    scrollTrigger: {
      trigger: '.problem__stage',
      start: 'top top',
      end: () => '+=' + innerHeight * 1.4,
      pin: true,
      scrub: 0.6,
    },
  });
  gsap.utils.toArray('.note').forEach((note, i) => {
    drop
      .from(note, { opacity: 0, duration: 0.12 }, i * 0.55)
      .from(note, { y: () => -innerHeight * 0.8, rotation: i % 2 ? 28 : -24, duration: 1, ease: 'power2.out' }, i * 0.55);
  });
  drop.to({}, { duration: 0.4 });

  /* ---------- 4. Mapa de las tres ciudades ---------- */
  const routes = document.querySelectorAll('.cities__map .route');
  routes.forEach((r) => {
    const len = r.getTotalLength();
    gsap.set(r, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.timeline({ scrollTrigger: { trigger: '.cities__map', start: 'top 75%' } })
    .from('.cities__map .city', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.2, ease: 'back.out(2.5)' })
    .to(routes, { strokeDashoffset: 0, duration: 0.9, stagger: 0.35, ease: 'power2.inOut' }, '-=0.2');

  // clearProps devuelve el transform al CSS para que funcione el efecto al pasar el mouse.
  gsap.from('.member', {
    y: 70, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.team', start: 'top 82%' },
  });

  /* ---------- 5. Paneles apilados (sección fija) ---------- */
  const panels = gsap.utils.toArray('.what .panel');
  // Entrada del primer panel (sin tocar y/opacity del cuerpo y el mockup, que usa la pila)
  gsap.timeline({ scrollTrigger: { trigger: '.what', start: 'top 65%' } })
    .from(panels[0].querySelectorAll('.panel__body > *'), { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })
    .from(panels[0].querySelector('.mock'), { scale: 0.75, rotation: -14, duration: 1.2, ease: 'back.out(1.6)' }, 0.15);
  const stack = gsap.timeline({
    scrollTrigger: {
      trigger: '.what',
      start: 'top top',
      end: () => '+=' + innerHeight * 1.7 * (panels.length - 1),
      pin: true,
      scrub: 1,
    },
  });
  // Cada panel se queda quieto un rato antes de que llegue el siguiente.
  stack.to({}, { duration: 0.6 });
  panels.slice(1).forEach((panel, i) => {
    const prev = panels[i];
    stack
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'none' })
      .to(prev.querySelectorAll('.panel__body, .mock, .areas, .climb'), { y: -90, opacity: 0.15, duration: 1, ease: 'none' }, '<')
      .from(panel.querySelector('.panel__num'), { yPercent: 45, duration: 1, ease: 'none' }, '<')
      .from(panel.querySelectorAll('.panel__body, .areas li, .climb__label, .climb__bar, .climb__deal p'), { y: 70, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'none' }, '<0.3');
    // En el panel 03 la barra del puntaje sube hasta "Tu carrera"
    const climbBar = panel.querySelector('.climb__bar i');
    if (climbBar) stack.fromTo(climbBar, { scaleX: 0.35 }, { scaleX: 1, duration: 0.5, ease: 'none' }, '<0.3');
    stack
      .to({}, { duration: 0.6 });
  });

  /* ---------- 6. Reloj que gira con el scroll ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '.how', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    .fromTo('.clock__m', { rotation: 0 }, { rotation: 1080, svgOrigin: '100 100', ease: 'none' }, 0)
    .fromTo('.clock__h', { rotation: 0 }, { rotation: 90, svgOrigin: '100 100', ease: 'none' }, 0);
  gsap.from('.devices span', {
    y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.devices', start: 'top 92%' },
  });

  /* ---------- 7. Frase gigante que se enciende ---------- */
  const statement = document.querySelector('[data-split="fade"]');
  gsap.fromTo(splitWords(statement), { opacity: 0.12 }, {
    opacity: 1, stagger: 0.12, ease: 'none',
    scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 1 },
  });

  /* ---------- 8. Precio que cuenta ---------- */
  const priceEl = document.querySelector('.price__num');
  const count = { v: 0 };
  gsap.to(count, {
    v: Number(priceEl.dataset.count), duration: 2, ease: 'power3.out',
    onUpdate: () => { priceEl.textContent = Math.round(count.v).toLocaleString('es-CO'); },
    scrollTrigger: { trigger: '.price', start: 'top 85%' },
  });
  gsap.from('.plan', {
    y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.plan-grid', start: 'top 85%' },
  });

  /* ---------- 9 y 10. Preguntas y cierre ---------- */
  gsap.from('.faq details', {
    y: 24, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.faq__list', start: 'top 85%' },
  });
  gsap.from('.closing__owl', {
    scale: 0.4, rotation: -18, opacity: 0, duration: 1.2, ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.closing', start: 'top 70%' },
  });

  /* ---------- Botones magnéticos ---------- */
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3);
        y((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener('mouseleave', () => { x(0); y(0); });
    });
  }

  ScrollTrigger.sort(byPageOrder);
  ScrollTrigger.refresh();

  // Las fuentes cambian las medidas: recalcular cuando terminen de cargar.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
