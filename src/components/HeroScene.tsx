'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '@/lib/client';

/**
 * Hero visual: an "exploded view" of an interface. Five layers (base, glass, accent frame, glass,
 * and a card carrying the profile photo) float apart on load and spread further as the hero
 * scrolls away. Three.js is loaded lazily, so the poster <img> is what paints first (LCP) and
 * stays as the fallback when WebGL is unavailable.
 */
export function HeroScene({ photo, alt }: { photo: string; alt: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      } catch {
        return; // No WebGL: the poster image stays.
      }

      const reduced = prefersReduced();
      const rtl = document.documentElement.dir === 'rtl';
      const side = rtl ? -1 : 1;
      const disposables: { dispose: () => void }[] = [];
      const track = <D extends { dispose: () => void }>(d: D) => { disposables.push(d); return d; };

      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.className = 'scene-canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = track(new THREE.PMREMGenerator(renderer));
      const env = track(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
      scene.environment = env;

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(4 * side, 6, 8);
      scene.add(key);

      // ---- Materials (colours come from CSS tokens so both themes match the page) ----
      const surface = track(new THREE.MeshPhysicalMaterial({ roughness: 0.55, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.3 }));
      const glass = track(new THREE.MeshPhysicalMaterial({
        transmission: 0.94, thickness: 0.9, roughness: 0.2, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.08, attenuationDistance: 3,
      }));
      const accent = track(new THREE.MeshPhysicalMaterial({ roughness: 0.32, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.12 }));
      const photoMat = track(new THREE.MeshBasicMaterial({ toneMapped: false, color: 0x888888 }));
      const shadowMat = track(new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }));

      const applyTheme = () => {
        const cs = getComputedStyle(document.documentElement);
        const tok = (n: string) => new THREE.Color(cs.getPropertyValue(n).trim() || '#888');
        scene.background = tok('--scene-bg');
        surface.color = tok('--scene-surface');
        accent.color = tok('--scene-accent');
        glass.attenuationColor = tok('--scene-glass');
        shadowMat.color = tok('--scene-shadow');
        shadowMat.opacity = Number(cs.getPropertyValue('--scene-shadow-alpha')) || 0.5;
      };
      applyTheme();

      // ---- Geometry ----
      const W = 2.9, H = 3.5, R = 0.2;
      const rounded = (w: number, h: number, r: number) => {
        const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
        return s;
      };

      const stack = new THREE.Group();
      const root = new THREE.Group();
      root.add(stack);
      scene.add(root);

      const slab = (depth: number, mat: InstanceType<typeof THREE.Material>) =>
        new THREE.Mesh(track(new RoundedBoxGeometry(W, H, depth, 5, 0.12)), mat);

      // Accent frame: a rounded ring, extruded.
      const ring = rounded(W, H, R);
      ring.holes.push(rounded(W - 0.36, H - 0.36, R * 0.6));
      const frameGeo = track(new THREE.ExtrudeGeometry(ring, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 10 }));
      frameGeo.translate(0, 0, -0.04);

      // Photo card: a slab with a rounded photo plane on its face.
      const card = new THREE.Group();
      card.add(slab(0.1, surface));
      const inset = 0.12;
      const photoGeo = track(new THREE.ShapeGeometry(rounded(W - inset, H - inset, R * 0.8), 12));
      const pos = photoGeo.attributes.position, uv = photoGeo.attributes.uv;
      for (let k = 0; k < pos.count; k++) uv.setXY(k, (pos.getX(k) + (W - inset) / 2) / (W - inset), (pos.getY(k) + (H - inset) / 2) / (H - inset));
      const photoPlane = new THREE.Mesh(photoGeo, photoMat);
      photoPlane.position.z = 0.056;
      card.add(photoPlane);

      const layers = [slab(0.16, surface), slab(0.1, glass), new THREE.Mesh(frameGeo, accent), slab(0.1, glass), card];
      layers.forEach((m) => stack.add(m));

      // Two small "components" orbiting the stack.
      const orb = new THREE.Mesh(track(new THREE.SphereGeometry(0.26, 48, 48)), accent);
      const cube = new THREE.Mesh(track(new RoundedBoxGeometry(0.62, 0.62, 0.62, 4, 0.12)), glass);
      root.add(orb, cube);

      // Soft contact shadow.
      const sc = document.createElement('canvas');
      sc.width = sc.height = 128;
      const g = sc.getContext('2d')!;
      // alphaMap reads the green channel, so paint greyscale on opaque black.
      g.fillStyle = '#000';
      g.fillRect(0, 0, 128, 128);
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, '#e6e6e6');
      grad.addColorStop(0.45, '#5a5a5a');
      grad.addColorStop(1, '#000');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      shadowMat.alphaMap = track(new THREE.CanvasTexture(sc));
      const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(6, 2.6)), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -2.9;
      scene.add(shadow);

      // ---- Photo texture (cover-cropped to the card's portrait ratio) ----
      new THREE.TextureLoader().load(photo, (tex) => {
        if (disposed) { tex.dispose(); return; }
        track(tex);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const img = tex.image as { width: number; height: number };
        const imgRatio = img.width / img.height, cardRatio = (W - inset) / (H - inset);
        if (imgRatio > cardRatio) { tex.repeat.set(cardRatio / imgRatio, 1); tex.offset.set((1 - tex.repeat.x) / 2, 0); }
        else { tex.repeat.set(1, imgRatio / cardRatio); tex.offset.set(0, (1 - tex.repeat.y) / 2); }
        photoMat.map = tex;
        photoMat.color.set(0xffffff);
        photoMat.needsUpdate = true;
        render();
        requestAnimationFrame(() => { if (!disposed) setReady(true); });
      });

      // ---- Sizing ----
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.set(0, 1.1, 14 * Math.max(1, 0.92 / camera.aspect));
        camera.lookAt(0, -0.1, 0);
        camera.updateProjectionMatrix();
        render();
      };

      // ---- Motion ----
      const pointer = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
        pointer.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      };

      let last = performance.now();
      const born = performance.now();
      let t = 0, intro = reduced ? 1 : 0, raf = 0, running = false;
      const ease = (x: number) => 1 - Math.pow(1 - x, 4);

      function pose() {
        const r = el!.getBoundingClientRect();
        const leave = reduced ? 0 : Math.max(0, Math.min(1, -r.top / r.height));
        const gap = 0.06 + ease(intro) * 0.86 + leave * 0.8;
        layers.forEach((m, k) => {
          const c = k - (layers.length - 1) / 2;
          m.position.set(c * 0.16 * side * ease(intro), -c * 0.1 * ease(intro), c * gap);
        });
        tilt.x += (pointer.x - tilt.x) * 0.05;
        tilt.y += (pointer.y - tilt.y) * 0.05;
        const idle = reduced ? 0 : Math.sin(t * 0.45) * 0.05;
        stack.rotation.set(0.14 + tilt.y * 0.18, -0.68 * side + tilt.x * 0.3 + idle, 0.03 * side);
        root.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.05;
        orb.position.set((2.15 + Math.sin(t * 0.7) * 0.08) * side, 1.75 + Math.sin(t * 0.9) * 0.14, 1.1);
        cube.position.set(-2.05 * side, -1.55 + Math.cos(t * 0.75) * 0.12, 0.8);
        cube.rotation.set(t * 0.25 + 0.4, t * 0.35 + 0.6, 0);
      }
      function render() { pose(); renderer.render(scene, camera); }
      function loop() {
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        if (intro < 1) intro = Math.min(1, (now - born) / 1800);
        render();
        raf = requestAnimationFrame(loop);
      }
      const start = () => { if (running || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
      const stop = () => { running = false; cancelAnimationFrame(raf); };

      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
      io.observe(el);
      const mo = new MutationObserver(() => { applyTheme(); render(); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (!reduced && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', onPointer, { passive: true });
      resize();

      cleanup = () => {
        stop();
        ro.disconnect(); io.disconnect(); mo.disconnect();
        removeEventListener('pointermove', onPointer);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    })();

    return () => { disposed = true; cleanup(); };
  }, [photo]);

  return (
    <div className="hero-visual" ref={host} data-ready={ready || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="scene-poster" src={photo} alt={alt} width={900} height={900} fetchPriority="high" />
    </div>
  );
}
