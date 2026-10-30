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
  const mm = gsap.matchMedia();
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
  const heroOwl = document.querySelector('.hero__owl');
  const heroReveal = document.querySelectorAll('.hero .reveal');
  gsap.set(heroWords, { yPercent: 110 });
  gsap.set(heroReveal, { y: 24, opacity: 0 });
  gsap.set(heroOwl, { scale: 0.6, rotation: -12, opacity: 0 });

  loader.style.animation = 'none';
  document.body.style.overflow = 'hidden';

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from(lOwl.querySelectorAll('.om-leaf-l, .om-leaf-r'), { y: 80, opacity: 0, duration: 0.8, stagger: 0.1 })
    .from(lOwl.querySelectorAll('.om-head path:not(.om-horn-l):not(.om-horn-r)'), { y: -40, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.45')
    .from(lOwl.querySelector('.om-horn-l'), { rotation: -28, x: -24, opacity: 0, transformOrigin: '100% 100%', duration: 0.7, ease: 'back.out(2.2)' }, '-=0.3')
    .from(lOwl.querySelector('.om-horn-r'), { rotation: 28, x: 24, opacity: 0, transformOrigin: '0% 100%', duration: 0.7, ease: 'back.out(2.2)' }, '<')
    .from(lOwl.querySelector('.om-gold'), { scale: 0, transformOrigin: '100% 0%', duration: 0.6, ease: 'back.out(2.4)' }, '-=0.35')
    .from('.loader__word span', { yPercent: 120, opacity: 0, duration: 0.55, stagger: 0.05 }, '-=0.35')
    .from('.loader__tag', { y: 12, opacity: 0, duration: 0.5 }, '-=0.2')
    .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut', delay: 0.45 })
    .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, '-=0.45')
    .to(heroOwl, { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.8)' }, '-=0.9')
    .to(heroReveal, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.8')
    .add(() => {
      loader.remove();
      document.body.style.overflow = '';
      ScrollTrigger.refresh();
    });

  loader.querySelector('.loader__skip').addEventListener('click', () => intro.progress(1));

  // Quien ya vio la intro en esta visita la ve más rápido.
  try {
    if (sessionStorage.getItem('cu-intro')) intro.timeScale(2.6);
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
  // En escritorio la escena se queda fija y las notas caen una por una dentro de la pantalla.
  mm.add('(min-width: 900px)', () => {
    const drop = gsap.timeline({
      scrollTrigger: {
        trigger: '.problem__stage',
        start: 'top top',
        end: () => '+=' + innerHeight * 1.4,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });
    gsap.utils.toArray('.note').forEach((note, i) => {
      drop
        .from(note, { opacity: 0, duration: 0.12 }, i * 0.55)
        .from(note, { y: () => -innerHeight * 0.8, rotation: i % 2 ? 28 : -24, duration: 1, ease: 'power2.out' }, i * 0.55);
    });
    drop.to({}, { duration: 0.4 });
    // Al cambiar el tamaño de la ventana esta escena se vuelve a crear: reordenar.
    ScrollTrigger.sort(byPageOrder);
  });
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.note').forEach((note, i) => {
      gsap.from(note, {
        x: i % 2 ? 80 : -80, rotation: i % 2 ? 14 : -14, opacity: 0, duration: 0.9, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: note, start: 'top 90%' },
      });
    });
  });

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
      .to(prev.querySelectorAll('.panel__body, .mock, .areas, .compare'), { y: -90, opacity: 0.15, duration: 1, ease: 'none' }, '<')
      .from(panel.querySelector('.panel__num'), { yPercent: 45, duration: 1, ease: 'none' }, '<')
      .from(panel.querySelectorAll('.panel__body, .areas li, .compare p'), { y: 70, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'none' }, '<0.3')
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
