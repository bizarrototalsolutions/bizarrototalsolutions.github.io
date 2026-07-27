/* ============================================================
   BTS – Hero Particle Background (Three.js)
   Campo de partículas subtil, com paralaxe ao mover o rato.
   Só corre se existir o contentor #hero-particles e a lib THREE.
   ============================================================ */

'use strict';

(function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container || typeof THREE === 'undefined') return;

  // Respeita utilizadores que preferem menos movimento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width  = container.clientWidth  || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Cores da marca: dourado e azul
  const COLORS = [0xF5A800, 0x4A97F0, 0xFFD166];

  function buildParticleField(count, radius, colorHex, size) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 9;
      const r = radius * (0.6 + Math.random() * 0.4);
      positions.push(Math.cos(angle) * r, y, Math.sin(angle) * r);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: colorHex,
      size: size,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    return new THREE.Points(geometry, material);
  }

  const group = new THREE.Group();
  group.add(buildParticleField(1100, 4.2, COLORS[0], 0.045));
  group.add(buildParticleField(900,  6.0, COLORS[1], 0.035));
  group.add(buildParticleField(500,  3.0, COLORS[2], 0.03));
  scene.add(group);

  let targetRotX = 0;
  let targetRotZ = 0;
  let spin = prefersReducedMotion ? 0 : 0.0016;

  function onPointerMove(e) {
    const cx = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : width / 2);
    const cy = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : height / 2);
    targetRotX = (cy / window.innerHeight - 0.5) * 0.3;
    targetRotZ = (cx / window.innerWidth - 0.5) * 0.3;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function onResize() {
    width  = container.clientWidth  || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  // Pausa a animação quando a secção não está visível (poupa recursos)
  let isVisible = true;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { isVisible = entry.isIntersecting; });
  }, { threshold: 0 });
  io.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    group.rotation.y += spin;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
    group.rotation.z += (targetRotZ - group.rotation.z) * 0.04;
    renderer.render(scene, camera);
  }
  animate();
})();
