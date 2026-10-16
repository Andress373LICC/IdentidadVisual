(() => {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Saludo según la hora de quien visita */
  const h = new Date().getHours();
  const momento = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  document.getElementById('saludo').textContent = momento + ', soy';

  /* Nombre letra por letra (una sola entrada al cargar) */
  const nombre = document.getElementById('nombre');
  const texto = nombre.textContent;
  nombre.setAttribute('aria-label', texto);
  nombre.textContent = '';
  [...texto].forEach((l, i) => {
    const s = document.createElement('span');
    s.textContent = l;
    s.style.setProperty('--i', i);
    s.setAttribute('aria-hidden', 'true');
    nombre.appendChild(s);
  });

  /* El sol recorre el cielo mientras bajas por la página */
  const sol = document.querySelector('.sol');
  let meta = 0, actual = 0;
  const leer = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    meta = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
  };
  const pintar = () => {
    actual += (meta - actual) * (reducir ? 1 : 0.07);
    const s = sol.offsetWidth;
    const x = (innerWidth - s) * (0.04 + 0.86 * actual);
    const y = innerHeight * 0.66 - Math.sin(Math.PI * actual) * innerHeight * 0.5;
    sol.style.transform = `translate3d(${x}px,${y}px,0)`;
    requestAnimationFrame(pintar);
  };
  addEventListener('scroll', leer, { passive: true });
  addEventListener('resize', leer);
  leer(); actual = meta; pintar();

  /* Al llegar al final, atardece */
  new IntersectionObserver(([e]) => {
    document.body.classList.toggle('noche', e.isIntersecting);
  }, { threshold: 0.4 }).observe(document.getElementById('cierre'));

  /* Intereses */
  const chips = document.querySelectorAll('.chip');
  const respuesta = document.getElementById('respuesta');
  chips.forEach(c => c.addEventListener('click', () => {
    const activo = c.getAttribute('aria-pressed') === 'true';
    chips.forEach(o => o.setAttribute('aria-pressed', 'false'));
    respuesta.classList.remove('cambia');
    if (activo) { respuesta.textContent = ''; return; }
    c.setAttribute('aria-pressed', 'true');
    void respuesta.offsetWidth;
    respuesta.textContent = c.dataset.texto;
    respuesta.classList.add('cambia');
  }));

  /* Valores: se abre uno a la vez */
  const detalles = document.querySelectorAll('details');
  detalles.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) detalles.forEach(o => { if (o !== d) o.open = false; });
  }));
})();
