'use client';

import { useEffect, useRef, useState } from 'react';
import { emit, prefersReduced } from '@/lib/client';
import {
  EDITOR_PX, SUGGEST_PX, TERM_PX, TREE_PX, drawEditor, drawSuggest, drawTerminal, drawTree, monoFamily, suggestRowAt, totalChars, treeRowAt,
  type CodeLines,
} from './editorArt';

/** Explorer rows: each file opens the section it stands for. */
const TREE: [file: string, section: string][] = [
  ['amin.tsx', 'hero'], ['about.md', 'about'], ['skills.json', 'skills'], ['experience.ts', 'experience'],
  ['projects.ts', 'work'], ['playground.ts', 'playground'], ['contact.sh', 'contact'],
];
const SUGGESTIONS: [string, string][] = [['React', 'library'], ['Next.js', 'framework'], ['TypeScript', 'language'], ['Three.js', '3d']];
const TYPE_SPEED = 44; // characters per second

/** True when WebGL is missing or software-rendered; checked before three.js is even downloaded. */
function softwareOnlyGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
    if (!gl) return true;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu);
  } catch {
    return true;
  }
}

/** Resolves once the page has loaded and the main thread is idle, so 3D never competes with first paint. */
const afterLoadIdle = () => new Promise<void>((done) => {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(() => done(), { timeout: 2500 }) : setTimeout(done, 300));
  if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
});

const canvasOf = ({ w, h }: { w: number; h: number }) => Object.assign(document.createElement('canvas'), { width: w, height: h });

/**
 * Hero visual: an exploded 3D view of a code editor. The backplate, file explorer, a glass
 * sheet, an accent frame, the editor (which types out amin.tsx), an autocomplete popup and a
 * terminal float apart on load, follow the pointer and spread further as the hero scrolls away.
 * Three.js loads lazily; until then (and without WebGL) a flat 2D render of the editor shows.
 */
export function HeroScene({ code, label }: { code: CodeLines; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Flat fallback, painted as soon as the mono font is available.
  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      const ctx = poster.current?.getContext('2d');
      if (live && ctx) drawEditor(ctx, code, totalChars(code), false, monoFamily());
    });
    return () => { live = false; };
  }, [code]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // No GPU or data saver: keep the flat editor and never download three.js.
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      if (saveData || softwareOnlyGL()) return;
      await afterLoadIdle();
      if (disposed) return;
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      await document.fonts.ready;
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        // Software-only WebGL would stall the whole page, so treat it like no WebGL.
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true });
      } catch {
        return; // No (fast) WebGL: the flat editor stays.
      }
      const gl = renderer.getContext();
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) { renderer.dispose(); return; }

      const reduced = prefersReduced();
      const side = document.documentElement.dir === 'rtl' ? -1 : 1;
      const mono = monoFamily();
      const total = totalChars(code);
      const disposables: { dispose: () => void }[] = [];
      const track = <D extends { dispose: () => void }>(d: D) => { disposables.push(d); return d; };

      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.className = 'scene-canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = track(new THREE.PMREMGenerator(renderer));
      scene.environment = track(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(4 * side, 6, 8);
      scene.add(key);

      // ---- Materials (page-coloured parts read the CSS theme tokens) ----
      const surface = track(new THREE.MeshPhysicalMaterial({ roughness: 0.55, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.3 }));
      const panelBody = track(new THREE.MeshPhysicalMaterial({ color: 0x0c0d10, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
      const glass = track(new THREE.MeshPhysicalMaterial({
        transmission: 0.94, thickness: 0.9, roughness: 0.2, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.08, attenuationDistance: 3,
      }));
      const accent = track(new THREE.MeshPhysicalMaterial({ roughness: 0.32, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.12 }));
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

      // ---- Geometry helpers ----
      const rounded = (w: number, h: number, r: number) => {
        const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
        return s;
      };
      const slab = (w: number, h: number, depth: number, mat: InstanceType<typeof THREE.Material>) =>
        new THREE.Mesh(track(new RoundedBoxGeometry(w, h, depth, 5, Math.min(0.1, depth / 2.2))), mat);

      /** A thin dark slab with a canvas painted on its front face. */
      const panel = (w: number, h: number, canvas: HTMLCanvasElement) => {
        const tex = track(new THREE.CanvasTexture(canvas));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const g = new THREE.Group();
        g.add(slab(w, h, 0.08, panelBody));
        const inset = 0.05, r = 0.1;
        const geo = track(new THREE.ShapeGeometry(rounded(w - inset, h - inset, r), 10));
        const pos = geo.attributes.position, uv = geo.attributes.uv;
        for (let k = 0; k < pos.count; k++) uv.setXY(k, (pos.getX(k) + (w - inset) / 2) / (w - inset), (pos.getY(k) + (h - inset) / 2) / (h - inset));
        const face = new THREE.Mesh(geo, track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
        face.position.z = 0.045;
        g.add(face);
        return { group: g, tex, face };
      };

      // ---- Panels ----
      const editorCv = canvasOf(EDITOR_PX), treeCv = canvasOf(TREE_PX), suggestCv = canvasOf(SUGGEST_PX), termCv = canvasOf(TERM_PX);
      const eCtx = editorCv.getContext('2d')!, tCtx = termCv.getContext('2d')!;
      const trCtx = treeCv.getContext('2d')!, sgCtx = suggestCv.getContext('2d')!;
      const files = TREE.map(([f]) => f);
      drawTree(trCtx, files, mono);
      drawSuggest(sgCtx, SUGGESTIONS, 0, mono);

      let shown = reduced ? total : 0, caretOn = !reduced, built = reduced;
      const paintEditor = () => drawEditor(eCtx, code, shown, caretOn, mono);
      paintEditor();
      drawTerminal(tCtx, built, mono);

      const EW = 3.5, EH = 2.5;
      const editor = panel(EW, EH, editorCv);
      const tree = panel(1.12, 1.12 * (TREE_PX.h / TREE_PX.w), treeCv);
      const suggest = panel(1.5, 1.5 * (SUGGEST_PX.h / SUGGEST_PX.w), suggestCv);
      const term = panel(2.3, 2.3 * (TERM_PX.h / TERM_PX.w), termCv);

      const ring = rounded(EW + 0.3, EH + 0.3, 0.2);
      ring.holes.push(rounded(EW + 0.02, EH + 0.02, 0.12));
      const frameGeo = track(new THREE.ExtrudeGeometry(ring, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3, curveSegments: 10 }));
      frameGeo.translate(0, 0, -0.03);

      // Back to front, with each layer's resting offset in the editor's plane.
      const layers: { obj: InstanceType<typeof THREE.Object3D>; x: number; y: number }[] = [
        { obj: slab(EW + 1.1, EH + 0.9, 0.14, surface), x: -0.2, y: 0.1 },
        { obj: tree.group, x: -2.7, y: 0.1 },
        { obj: slab(EW - 0.3, EH - 0.2, 0.08, glass), x: 0.25, y: 0.2 },
        { obj: new THREE.Mesh(frameGeo, accent), x: 0, y: 0 },
        { obj: editor.group, x: 0, y: 0 },
        { obj: suggest.group, x: 1.6, y: -0.4 },
        { obj: term.group, x: -0.9, y: -1.55 },
      ];
      const stack = new THREE.Group(), root = new THREE.Group();
      layers.forEach((l) => stack.add(l.obj));
      root.add(stack);
      scene.add(root);

      const orb = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 48, 48)), accent);
      const cube = new THREE.Mesh(track(new RoundedBoxGeometry(0.5, 0.5, 0.5, 4, 0.1)), glass);
      root.add(orb, cube);

      // Soft contact shadow. alphaMap reads the green channel, so paint greyscale on black.
      const sc = canvasOf({ w: 128, h: 128 }), g = sc.getContext('2d')!;
      g.fillStyle = '#000';
      g.fillRect(0, 0, 128, 128);
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, '#e6e6e6');
      grad.addColorStop(0.45, '#5a5a5a');
      grad.addColorStop(1, '#000');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      shadowMat.alphaMap = track(new THREE.CanvasTexture(sc));
      const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(6.4, 2.4)), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -2.45;
      scene.add(shadow);

      // ---- Sizing ----
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.set(0, 0.8, 12.2 * Math.max(1, 1.12 / camera.aspect));
        camera.lookAt(0, -0.15, 0);
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

      // ---- Interaction: the panels are real controls ----
      // Explorer files jump to their section, autocomplete items trace that technology in the
      // dependency graph, the editor opens the playground and the terminal panel opens the terminal.
      const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
      const targets = [
        { mesh: tree.face, kind: 'tree' }, { mesh: suggest.face, kind: 'suggest' },
        { mesh: editor.face, kind: 'editor' }, { mesh: term.face, kind: 'term' },
      ] as const;
      type Hit = { kind: (typeof targets)[number]['kind']; row: number } | null;
      let hover: Hit = null;
      const hitAt = (e: MouseEvent): Hit => {
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const first = ray.intersectObjects(targets.map((x) => x.mesh), false)[0];
        if (!first?.uv) return null;
        const kind = targets.find((x) => x.mesh === first.object)!.kind;
        const y = 1 - first.uv.y;
        if (kind === 'tree') { const row = treeRowAt(y * TREE_PX.h, TREE.length); return row < 0 ? null : { kind, row }; }
        if (kind === 'suggest') { const row = suggestRowAt(y * SUGGEST_PX.h, SUGGESTIONS.length); return row < 0 ? null : { kind, row }; }
        return { kind, row: 0 };
      };
      const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      const onHover = (e: PointerEvent) => {
        const h = hitAt(e);
        if (h?.kind === hover?.kind && h?.row === hover?.row) return;
        hover = h;
        renderer.domElement.style.cursor = h ? 'pointer' : '';
        drawTree(trCtx, files, mono, h?.kind === 'tree' ? h.row : -1);
        tree.tex.needsUpdate = true;
        drawSuggest(sgCtx, SUGGESTIONS, h?.kind === 'suggest' ? h.row : 0, mono);
        suggest.tex.needsUpdate = true;
        if (!running) render();
      };
      const onClick = (e: MouseEvent) => {
        const h = hitAt(e);
        if (!h) return;
        if (h.kind === 'tree') go(TREE[h.row][1]);
        else if (h.kind === 'suggest') emit('focus-skill', SUGGESTIONS[h.row][0]);
        else if (h.kind === 'editor') go('playground');
        else emit('terminal');
      };
      renderer.domElement.addEventListener('click', onClick);
      if (matchMedia('(pointer: fine)').matches) renderer.domElement.addEventListener('pointermove', onHover, { passive: true });

      const born = performance.now();
      let last = born, t = 0, intro = reduced ? 1 : 0, raf = 0, running = false;
      let frames = 0, slowTime = 0, lowRes = false;
      let still = reduced; // true once the scene is a single static frame
      const ease = (x: number) => 1 - Math.pow(1 - x, 4);

      function pose() {
        const r = el!.getBoundingClientRect();
        const leave = reduced ? 0 : Math.max(0, Math.min(1, -r.top / r.height));
        const e = ease(intro);
        const gap = 0.05 + e * 0.5 + leave * 0.6;
        layers.forEach(({ obj, x, y }, k) => {
          const c = k - 4; // the editor (index 4) stays at the centre plane
          obj.position.set(x * (0.55 + 0.45 * e) * side, y * (0.55 + 0.45 * e), c * gap);
        });
        tilt.x += (pointer.x - tilt.x) * 0.05;
        tilt.y += (pointer.y - tilt.y) * 0.05;
        const idle = reduced ? 0 : Math.sin(t * 0.45) * 0.05;
        stack.rotation.set(0.14 + tilt.y * 0.16, -0.4 * side + tilt.x * 0.28 + idle, 0.02 * side);
        root.position.set(0.35 * side, reduced ? 0 : Math.sin(t * 0.8) * 0.05, 0);
        orb.position.set((2.35 + Math.sin(t * 0.7) * 0.08) * side, 1.75 + Math.sin(t * 0.9) * 0.14, 1.4);
        cube.position.set(-3.1 * side, -1.2 + Math.cos(t * 0.75) * 0.12, 0.9);
        cube.rotation.set(t * 0.25 + 0.4, t * 0.35 + 0.6, 0);
      }

      /** Types the code once, then blinks the caret; the terminal "builds" when typing ends. */
      function typeStep(now: number) {
        const next = Math.min(total, Math.max(0, Math.floor(((now - born) / 1000 - 0.9) * TYPE_SPEED)));
        const blink = next >= total ? Math.floor(now / 530) % 2 === 0 : true;
        if (next !== shown || blink !== caretOn) {
          shown = next;
          caretOn = blink;
          paintEditor();
          editor.tex.needsUpdate = true;
        }
        if (!built && shown >= total) {
          built = true;
          drawTerminal(tCtx, true, mono);
          term.tex.needsUpdate = true;
        }
      }

      function render() { pose(); renderer.render(scene, camera); }
      function loop() {
        const now = performance.now();
        const dt = (now - last) / 1000;
        t += Math.min(dt, 0.05);
        last = now;
        // Slow GPU: drop to 1x resolution; if it is still slow, settle on a still frame.
        if (frames < 90) {
          frames++;
          slowTime += dt;
          if (frames === 90 && slowTime / frames > 0.034) {
            if (!lowRes) { lowRes = true; frames = 0; slowTime = 0; renderer.setPixelRatio(1); resize(); }
            else { still = true; intro = 1; shown = total; caretOn = false; built = true; paintEditor(); editor.tex.needsUpdate = true; drawTerminal(tCtx, true, mono); term.tex.needsUpdate = true; stop(); render(); return; }
          }
        }
        if (intro < 1) intro = Math.min(1, (now - born) / 1800);
        typeStep(now);
        render();
        raf = requestAnimationFrame(loop);
      }
      const start = () => { if (running || still) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
      const stop = () => { running = false; cancelAnimationFrame(raf); };

      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()));
      io.observe(el);
      const mo = new MutationObserver(() => { applyTheme(); render(); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (!reduced && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', onPointer, { passive: true });
      resize();
      requestAnimationFrame(() => { if (!disposed) setReady(true); });

      cleanup = () => {
        stop();
        ro.disconnect(); io.disconnect(); mo.disconnect();
        removeEventListener('pointermove', onPointer);
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('pointermove', onHover);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [code]);

  return (
    <div className="hero-visual" ref={host} data-ready={ready || undefined} role="img" aria-label={label}>
      <canvas ref={poster} className="scene-poster" width={EDITOR_PX.w} height={EDITOR_PX.h} aria-hidden="true" />
    </div>
  );
}
