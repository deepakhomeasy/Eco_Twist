import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

/* ═════════════════════════════════════════════════════════
   BRAND TOKENS — Events & Conferences Theme
═════════════════════════════════════════════════════════ */
const BRAND = {
  deepOlive: '#444f36',
  sage: '#708156',
  sageLight: '#b3bea0',
  gold: '#b5a26a',
  warmBeige: '#f8f7f5',
  taupe: '#3d3a34',
} as const;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═════════════════════════════════════════════════════════
   EVENTS CANVAS HOOK — Interactive celebration theme
   • Luxe networking mesh with glowing nodes
   • Floating gold/sage particles with sparkles
   • Vertical stage light beams
   • Click creates celebratory bloom + expanding ripples
   • Mouse proximity effects
═════════════════════════════════════════════════════════ */
function useEventsCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0, animId: number;
    let mx = -9999, my = -9999;
    let frame = 0, time = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* Collections */
    interface Node { x: number; y: number; vx: number; vy: number; ox: number; oy: number; hue: number; r: number; excited: number; }
    interface Pulse { from: number; to: number; t: number; hue: number; }
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number; life: number; spark: boolean; }
    interface Ripple { x: number; y: number; r: number; maxR: number; life: number; hue: number; delay: number; }
    interface Bloom { x: number; y: number; life: number; hue: number; scale: number; rot: number; }
    interface LightBeam { y: number; speed: number; phase: number; }

    const NODES: Node[] = [];
    const PULSES: Pulse[] = [];
    const PARTICLES: Particle[] = [];
    const RIPPLES: Ripple[] = [];
    const BLOOMS: Bloom[] = [];
    const LIGHT_BEAMS: LightBeam[] = [
      { y: 0.2, speed: 0.0004, phase: 0 },
      { y: 0.5, speed: 0.0007, phase: 2 },
      { y: 0.8, speed: 0.0005, phase: 4 },
    ];

    /* Resize with DPR */
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = container.offsetWidth;
      H = container.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (NODES.length === 0) initNodes();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* Mouse tracking */
    const getPos = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    container.addEventListener('mousemove', (e) => {
      const p = getPos(e);
      mx = p.x;
      my = p.y;
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      mx = -9999;
      my = -9999;
    }, { passive: true });

    /* Click handler — celebratory burst */
    container.addEventListener('click', (e) => {
      const { x: cx, y: cy } = getPos(e);
      const hue = Math.random() > 0.5 ? 42 : 78; // gold or sage

      // Expanding ripples
      for (let i = 0; i < 6; i++) {
        RIPPLES.push({
          x: cx, y: cy,
          r: i * 18,
          maxR: 180 + i * 45,
          life: 1,
          hue,
          delay: i * 3,
        });
      }

      // Celebration bloom
      BLOOMS.push({
        x: cx, y: cy,
        life: 1,
        hue,
        scale: 0,
        rot: Math.random() * Math.PI * 2,
      });

      // Excite nearby nodes
      NODES.forEach(n => {
        const d = Math.hypot(n.x - cx, n.y - cy);
        if (d < 250) {
          n.excited = Math.min(1, n.excited + (1 - d / 250) * 0.95);
        }
      });

      // Particle burst
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 1.5 + Math.random() * 3.5;
        PARTICLES.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel - 2.2,
          r: 2.0 + Math.random() * 3.8,
          hue: hue === 42 ? 40 : 80,
          alpha: 1,
          life: 1,
          spark: Math.random() > 0.65,
        });
      }
    }, { passive: true });

    /* ══════════════════════════════════════════
       NETWORKING MESH
    ══════════════════════════════════════════ */
    function initNodes() {
      NODES.length = 0;
      const count = Math.floor((W * H) / 15000) + 40;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H * 0.75;
        NODES.push({
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          hue: Math.random() > 0.55 ? 42 : 78,
          r: 1.5 + Math.random() * 1.6,
          excited: 0,
        });
      }
    }

    function spawnPulse(fromIdx: number) {
      let best = -1, bestD = 9999;
      for (let j = 0; j < NODES.length; j++) {
        if (j === fromIdx) continue;
        const d = Math.hypot(NODES[fromIdx].x - NODES[j].x, NODES[fromIdx].y - NODES[j].y);
        if (d < 165 && d < bestD) {
          best = j;
          bestD = d;
        }
      }
      if (best === -1) return;
      PULSES.push({
        from: fromIdx,
        to: best,
        t: 0,
        hue: NODES[fromIdx].hue,
      });
    }

    let pulseTimer = 0;

    function updateNetwork() {
      const LINK_DIST = 145;

      // Update nodes
      NODES.forEach(n => {
        n.excited = Math.max(0, n.excited - 0.016);

        // Home force
        n.vx += (n.ox - n.x) * 0.0004;
        n.vy += (n.oy - n.y) * 0.0004;

        // Mouse repulsion
        if (mx > -9999) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const d = Math.hypot(dx, dy);
          if (d < 170 && d > 0) {
            const f = (170 - d) / 170;
            n.vx += (dx / d) * f * f * 0.85;
            n.vy += (dy / d) * f * f * 0.85;
          }
        }

        n.vx *= 0.91;
        n.vy *= 0.91;
        n.x += n.vx;
        n.y += n.vy;

        // Bounds
        if (n.x < 0) { n.x = 0; n.vx *= -0.5; }
        if (n.x > W) { n.x = W; n.vx *= -0.5; }
        if (n.y < 0) { n.y = 0; n.vy *= -0.5; }
        if (n.y > H) { n.y = H; n.vy *= -0.5; }
      });

      // Draw connections
      ctx.save();
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const a = NODES[i], b = NODES[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;

          const d = Math.sqrt(d2);
          const t = 1 - d / LINK_DIST;
          const exc = (a.excited + b.excited) * 0.5;
          const alpha = t * 0.18 + exc * 0.28;

          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `hsla(${a.hue}, 60%, 75%, ${alpha})`);
          grad.addColorStop(1, `hsla(${b.hue}, 60%, 75%, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7 + exc * 1.0;
          ctx.stroke();
        }
      }
      ctx.restore();

      // Pulses
      for (let i = PULSES.length - 1; i >= 0; i--) {
        const p = PULSES[i];
        p.t += 0.016;
        if (p.t >= 1) {
          NODES[p.to].excited = Math.min(1, NODES[p.to].excited + 0.85);
          PULSES.splice(i, 1);
          continue;
        }

        const a = NODES[p.from], b = NODES[p.to];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        // Glow
        const gr = ctx.createRadialGradient(x, y, 0, x, y, 5);
        gr.addColorStop(0, `hsla(${p.hue}, 85%, 90%, 0.95)`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsl(${p.hue}, 90%, 95%)`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      NODES.forEach(n => {
        const size = n.r + n.excited * 3.2;
        const brightness = 72 + n.excited * 22;

        // Glow
        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 3);
        gr.addColorStop(0, `hsla(${n.hue}, 70%, ${brightness}%, ${0.3 + n.excited * 0.6})`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsl(${n.hue}, 65%, ${brightness}%)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      pulseTimer++;
      if (pulseTimer > 13) {
        pulseTimer = 0;
        if (NODES.length) spawnPulse(Math.floor(Math.random() * NODES.length));
      }
    }

    /* ══════════════════════════════════════════
       FLOATING PARTICLES & SPARKLES
    ══════════════════════════════════════════ */
    function spawnParticle(x?: number, y?: number, burst = false) {
      PARTICLES.push({
        x: x ?? Math.random() * W,
        y: y ?? H + 10,
        vx: burst ? (Math.random() - 0.5) * 5.5 : (Math.random() - 0.5) * 0.7,
        vy: burst ? (Math.random() - 0.75) * 4.5 : -0.7 - Math.random() * 1.4,
        r: burst ? 2.2 + Math.random() * 4.2 : 1.3 + Math.random() * 2.0,
        hue: Math.random() > 0.5 ? 42 : 78,
        alpha: burst ? 1 : 0.65,
        life: burst ? 1 : 0.85,
        spark: Math.random() > 0.7,
      });
    }

    function updateParticles() {
      for (let i = PARTICLES.length - 1; i >= 0; i--) {
        const p = PARTICLES[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.015;
        p.life -= 0.011;
        p.alpha = Math.max(0, p.life);

        if (p.life <= 0 || p.y < -30) {
          PARTICLES.splice(i, 1);
          continue;
        }

        // Boundary wrap
        if (p.x < -15) p.x = W + 15;
        if (p.x > W + 15) p.x = -15;

        // Glow
        const glowSize = p.r * (1.9 + Math.sin(time * 0.2 + i) * 0.7);
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        gr.addColorStop(0, `hsla(${p.hue}, 88%, 92%, ${p.alpha * 0.9})`);
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle core
        if (p.spark) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /* ══════════════════════════════════════════
       STAGE LIGHT BEAMS
    ══════════════════════════════════════════ */
    function drawLightBeams() {
      LIGHT_BEAMS.forEach(beam => {
        beam.phase += beam.speed;
        const yPos = H * (beam.y + Math.sin(beam.phase) * 0.08);
        const grad = ctx.createLinearGradient(0, yPos - 200, 0, yPos + 240);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.38, `hsla(48, 62%, 88%, 0.06)`);
        grad.addColorStop(0.5, `hsla(48, 68%, 92%, 0.13)`);
        grad.addColorStop(0.62, `hsla(48, 62%, 88%, 0.06)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, yPos - 200, W, 440);
      });
    }

    /* ══════════════════════════════════════════
       CLICK EFFECTS
    ══════════════════════════════════════════ */
    function drawRipplesAndBlooms() {
      // Ripples
      for (let i = RIPPLES.length - 1; i >= 0; i--) {
        const r = RIPPLES[i];
        if (r.delay > 0) {
          r.delay--;
          continue;
        }

        r.r += (r.maxR - r.r) * 0.068;
        r.life -= 0.017;

        if (r.life <= 0) {
          RIPPLES.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `hsla(${r.hue}, 68%, 85%, ${r.life * 0.55})`;
        ctx.lineWidth = 2.6 * r.life;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        // Inner rotated diamond ripple
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(Math.PI / 4 + r.life * 0.6);
        const dr = r.r * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -dr);
        ctx.lineTo(dr, 0);
        ctx.lineTo(0, dr);
        ctx.lineTo(-dr, 0);
        ctx.closePath();
        ctx.strokeStyle = `hsla(${r.hue}, 75%, 88%, ${r.life * 0.28})`;
        ctx.lineWidth = 1.0 * r.life;
        ctx.stroke();
        ctx.restore();
      }

      // Blooms
      for (let i = BLOOMS.length - 1; i >= 0; i--) {
        const b = BLOOMS[i];
        b.life -= 0.020;
        b.scale += (2.0 - b.scale) * 0.14;
        b.rot += 0.012;

        if (b.life <= 0) {
          BLOOMS.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = b.life * 0.8;

        // Radial petals
        for (let p = 0; p < 8; p++) {
          ctx.rotate(Math.PI / 4);
          const grad = ctx.createRadialGradient(0, -b.scale * 20, 5, 0, -b.scale * 42, 3);
          grad.addColorStop(0, `hsla(${b.hue}, 90%, 95%, 0.95)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(-7, -b.scale * 42, 14, b.scale * 46);
        }

        // Centre glow
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
        cg.addColorStop(0, `hsla(${b.hue + 6}, 95%, 98%, 1)`);
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    /* ══════════════════════════════════════════
       AMBIENT ORNAMENTATION
    ══════════════════════════════════════════ */
    function drawAmbientOrnaments() {
      const pulse = 0.5 + Math.sin(time * 0.01) * 0.5;

      // Corner accents
      const corners = [
        [30, 30, 0],
        [W - 30, 30, Math.PI / 2],
        [W - 30, H - 30, Math.PI],
        [30, H - 30, Math.PI * 1.5],
      ] as [number, number, number][];

      corners.forEach(([x, y, rot]) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = 0.12 + pulse * 0.08;
        ctx.strokeStyle = `hsla(42, 65%, 76%, 1)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(0, 0);
        ctx.lineTo(32, 0);
        ctx.stroke();

        // Diamond at corner
        const ds = 4;
        ctx.beginPath();
        ctx.moveTo(0, -ds);
        ctx.lineTo(ds, 0);
        ctx.lineTo(0, ds);
        ctx.lineTo(-ds, 0);
        ctx.closePath();
        ctx.fillStyle = `hsla(42, 75%, 82%, ${0.5 + pulse * 0.4})`;
        ctx.fill();
        ctx.restore();
      });
    }

    /* ══════════════════════════════════════════
       MAIN LOOP
    ══════════════════════════════════════════ */
    let sparkleTimer = 0;

    function loop() {
      frame++;
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      drawLightBeams();
      updateNetwork();
      updateParticles();
      drawRipplesAndBlooms();
      drawAmbientOrnaments();

      // Ambient particles
      if (frame % 8 === 0) spawnParticle();

      // Mouse proximity sparkles
      if (mx > -9999) {
        sparkleTimer++;
        if (sparkleTimer > 20) {
          sparkleTimer = 0;
          spawnParticle(
            mx + (Math.random() - 0.5) * 70,
            my + (Math.random() - 0.5) * 70
          );
        }
      }

      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);
}

/* ═════════════════════════════════════════════════════════
   TILT HOOK
═════════════════════════════════════════════════════════ */
function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const cfg = { stiffness: 200, damping: 22, mass: 0.6 };
  const springX = useSpring(rotateX, cfg);
  const springY = useSpring(rotateY, cfg);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    rotateY.set(dx * strength);
    rotateX.set(-dy * strength);
  }, [strength, rotateX, rotateY]);
  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);
  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

/* ═════════════════════════════════════════════════════════
   VARIANTS
═════════════════════════════════════════════════════════ */
const vFadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const vStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

const vSlideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

const vSlideRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ═════════════════════════════════════════════════════════
   DATA
═════════════════════════════════════════════════════════ */
const PRODUCTS = [
  { name: 'Boreal Glass Carafe', sub: 'Borosilicate & Bamboo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmRuIOmg1NAdBCr5X_fi6akCrZ8VpiStdKmzebS8wdjCEVq7-0dSqnqCxXAEe5BkCIhXOJVbtnu1lRQvgQWJjBcQgipqT5c7GQeclbaoSOaPvnE_-9zIbuc0fMkM-F9HYUyvzgVCv_Fy11ON1gcg8Op2ZpoaECFCLuoj4qfRq3wBkWRwi5bxRkK-XCQHl1uMhpDw3Dh7ng89Z-tENfHVPbTtnd546NzkuhINa7Xp7iH5XILl1S9Cu5AXx3YRxLOr9CjXiHza1odKSB' },
  { name: 'Zenith Bamboo Journal', sub: 'Sustainable FSC Paper', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj6HNMW9cmGK1G0J3PJZrN932c2OgPmuTUl-BoilZ5w6sURvJYMmooZ9x-NKKpVHCL-qFLCdL5i897AUU_DbuXD382DvX_7m2WoL_5Mx9h0q9R8xduaT9ap4-FNjLp86npcGrKeW2-0vE93TSzcqb-ejeB81bxjujhHcUgURVewew7AgQsmfOPMKQzjun5yigGDwt_jHK1akKIsowmEhG3zMwl4NL8zMEzagGIr1K1R1m_oD-ztH8gcccNS267Or-3LLZJO3YFZAHZ' },
  { name: 'Terra Ceramic Tumbler', sub: 'Artisan Crafted', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR0Ne1Ni-LHMWrUypo_eCLOsciQK1qUTMhwWAlJvdn0xAzW1A5wSuENc3xO5IZ1VzrAkzdetk0ToeDkn1PaoY1i30MT2XR-4HHOKDJL7EaFhOLFoHnVQT7-JjtYD7B5SOvlSqS3aO7w4J3mCmW0qjgwgmj9Zatb8fJbZ5atx8arUZhcygjZAn3T7a1nTrjHUrMzLXTxj2Z-c7wNgej8i-aBFhjI-gH_ABDE6AcK-iRpwQaVsqk_cZev1_hgMZKEi4tE-r9xVIuZMAA' },
  { name: 'Heritage Canvas Tote', sub: 'GOTS Certified Cotton', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2o7hZqtmfVnGpB6o5WnLDWPJf9TNRrav1Bep1UsWehN2F1mrqZriCxVk9c9T6FqsvgvXSmosjqz7iCisJKV5qlwlpRpSF54TesGbGKaXdEIkwookM4kMCRAivNDR7F6G_1yuddl1gqa6TF8427ecgwAnkoLBV0hh3i99VC9icoAhvky48rDGD2RirvQfz1layl2y-j5C28ElzP_DElod-sBcfm-u1nz7pehDvqpQwTYrC6fdB8QSSuvMCyW1RP9MJ4OAiKOylaa4t' },
];

const BENTO_CARDS = [
  {
    key: 'vip', label: 'VIP Hampers',
    desc: 'Exquisite luxury for your most esteemed keynote speakers and executive guests.',
    col: 'span 2', row: 'span 2', large: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_pxMEijWLJ3gStNHPjYGjbSFF03MhRH7-fIxvnpaanC1yP5DPs98Wi34KIfGwell-oZz-x-VrqVtO74zemZiA9O2t4CdJn-XlFVvR-45lL57mCxoW7YlNM-p1OwwAs9ZTdTq5qW1c6b4FTKjDcR15sSTcjIpUNWGmvIFMzcu5Uyt9V_tVatNfvgh6pLWn2lY4fp7G9r1mJ537Js9WMWCf15v_lzO_7tdJWuIXoKQfFwjGxHnpnEVDv9swwa9NH9n1KEtkKiSeeGDM',
  },
  {
    key: 'swag', label: 'Sustainable Swag', col: 'span 2', row: 'span 1', large: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb5SOY7PKxWkCY72QX3CAXNVK1HKrMo7zb_-2AVBJNhJJiQxT-M3SZ0ppkcTH2sGFRB56DKV6X5QKqtsmdRq_5qcFu05kTkTTW62XtRaWfvH1-wIwOlUxwaMpfjhCqAsVLQdOjSud3OOh8e0UjV-ZGdT3_GaG70Q1y8VOIiJEdY9A2UdYqXFpiaRMu_4Dd2McjkV9NAKQz-pr3s02OjOMpKALISYv_KfQplDOQQYlmhwh5W-s87KcRcmkhJ4iEoQuA_-eZaa4LWj0P',
  },
  {
    key: 'speaker', label: 'Speaker Gifts', col: 'span 1', row: 'span 1', large: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGkZiyfOqdcbe4ffuadP0QyHQZtMXKQQfFnDDORTrsrSn81CirBa8xTdlUSNck-dRrXbBp3MDoArfFTaVdYo1iWQfxQaDH2oje-Vb3ruvavKjZ2R2QVdUWuJDZ6MCUZTUPC-qSAoW9ueFFKxk5n_m0gKzxxdyxFTcxmu8NOm1rqobNHRKMMlPfY3jHXF1bcjNK5QM0B4eDYqQHlczqy1Wn7GgunsCQltti4ook9_fvnWHIjsYeXQQoPwSkuAPb2bLH-iTLX9lW809-',
  },
  {
    key: 'team', label: 'Team Kits', col: 'span 1', row: 'span 1', large: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_yWOOkb77VJJwNC_RvjtKGriZSDZhZuQ4Sjl_-WFhukqNmKMyLRUwD53YVx1QWbAYKGeQ-1xABJbVEbKNxZQ0NmyEEZ6E669vtyPwN_dyOpum3_kcZNvSUz05BSAkiYRbZIpevtht1jBLCLfrgHWc8E3pxyTerKoi1h-ux2zMIL9bXerQzZuG60TYWe9krJL7q8xqwwqt2Ynipr7lsLIm7C-ShxWyNp3WPYIxnozab-LYYSoYJcurK-dHYKmKIOz5ExGUFB3LhcXd',
  },
];

const CUSTOM_ITEMS = [
  { icon: '◈', title: 'Logo Branding', desc: 'Laser engraving, embossing, or precision screen printing tailored to your identity.' },
  { icon: '📜', title: 'Personal Messages', desc: 'Individually addressed handwritten notes or custom printed inserts for every guest.' },
  { icon: '🎁', title: 'Packaging Styles', desc: 'Choose from minimalist recycled kraft or premium rigid boxes with fabric lining.' },
  { icon: '🎨', title: 'Theme Curation', desc: 'Aligning gift palettes with your conference colors and design aesthetics.' },
];

const WHY = [
  { icon: '✦', title: 'Premium Quality', desc: 'Meticulously sourced materials and artisan craftsmanship.' },
  { icon: '◈', title: 'Bulk Ordering', desc: 'Seamless fulfillment for events of 50 to 500+ attendees.' },
  { icon: '◎', title: 'Fast Delivery', desc: 'Pan-India logistics ensuring on-time arrival for your event.' },
  { icon: '◐', title: 'Custom Branding', desc: 'End-to-end personalization from product to packaging.' },
  { icon: '◑', title: 'Dedicated Support', desc: 'A personal consultant to guide your gifting strategy.' },
];

/* ═════════════════════════════════════════════════════════
   COMPONENT DEFINITIONS (BentoCard, ProductCard, WhyCard)
═════════════════════════════════════════════════════════ */
function BentoCard({ card, index }: { card: typeof BENTO_CARDS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 32 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden cursor-pointer rounded-lg"
      style={{ gridColumn: card.col, gridRow: card.row }}
    >
      <motion.img
        src={card.img} alt={card.label}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ willChange: 'transform' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)', opacity: card.large ? 0.85 : 0.6 }} />

      {!card.large && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: 'rgba(61,58,52,0.55)' }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <h3 className="font-serif text-2xl text-white mb-4">{card.label}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-white text-gray-800 text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer"
          >
            View Collection
          </motion.button>
        </motion.div>
      )}

      <div className="absolute bottom-0 left-0 p-6 md:p-9">
        {card.large ? (
          <>
            <h3 className="font-serif text-3xl text-white mb-2">{card.label}</h3>
            <p className="text-white/70 text-sm font-light leading-relaxed mb-5 max-w-sm">{card.desc}</p>
            <button className="text-white text-[10px] font-bold uppercase tracking-widest border-b border-white pb-0.5 bg-transparent cursor-pointer">
              View Collection
            </button>
          </>
        ) : (
          <motion.h3
            className="font-serif text-lg text-white"
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            {card.label}
          </motion.h3>
        )}
      </div>
    </motion.div>
  );
}

function ProductCard({ item, index }: { item: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="cursor-pointer group"
    >
      <div className="relative overflow-hidden mb-4 rounded-lg" style={{ aspectRatio: '3/4', background: '#f1f0ed' }}>
        <motion.img
          src={item.img} alt={item.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ willChange: 'transform' }}
        />
        <motion.button
          animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute bottom-4 left-4 right-4 py-3 text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer rounded"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#3d3a34' }}
        >
          Quick Inquiry
        </motion.button>
      </div>
      <h4 className="font-medium text-gray-800 mb-1">{item.name}</h4>
    </motion.div>
  );
}

function WhyCard({ item, index }: { item: typeof WHY[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="text-center px-4"
    >
      <motion.div
        className="flex items-center justify-center mx-auto mb-4 text-2xl rounded-full"
        style={{ width: 64, height: 64, color: '#645e53' }}
        animate={{ background: hovered ? '#d3d9c5' : '#f1f0ed' }}
        transition={{ duration: 0.3 }}
      >
        {item.icon}
      </motion.div>
      <h5 className="font-serif text-lg mb-2" style={{ color: '#3d3a34' }}>{item.title}</h5>
      <p className="text-xs font-light leading-relaxed" style={{ color: '#968f80' }}>{item.desc}</p>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════════════════ */
export default function EventsConferences() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springImg = useSpring(imgY, { stiffness: 60, damping: 22 });
  const springTxt = useSpring(textY, { stiffness: 80, damping: 25 });

  useEventsCanvas(canvasRef, heroRef);

  const { ref: aRef, springX: aX, springY: aY, onMouseMove: aMM, onMouseLeave: aML } = useTilt(6);

  const aboutRef = useRef<HTMLElement>(null);
  const catRef = useRef<HTMLElement>(null);
  const prodRef = useRef<HTMLElement>(null);
  const custRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 });
  const catInView = useInView(catRef, { once: false, amount: 0.15 });
  const prodInView = useInView(prodRef, { once: false, amount: 0.15 });
  const custInView = useInView(custRef, { once: false, amount: 0.15 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  return (
    <div className="overflow-x-hidden" style={{ background: '#f8f7f5', fontFamily: 'inherit' }}>

      {/* ══ HERO with CANVAS ══ */}
      <section ref={heroRef} className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh', perspective: '1400px' }}>
        <motion.div style={{ y: springImg, willChange: 'transform' }} className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBovXd8GTgExtTT-ykDXV6oujbJeZgvTJ0kpuanb6pJbg57kZmrovGQIdCPXy_eHVspOeoJHLTwCXkvXqEvlJ0DByvsEmmOR0r6HlPU50zZLrh3XJosz1uh2adkawmLgYrZt7G2zcGo9Q6vm3GvtH-psOTCrzCceh6HgkqEz3Ry2QJ_JyEksF75ZlXh70IVhiafb2G1XCPDtdLlhjpAtbbS0Ix2ap-R5yA3IsyZprV-2H8YcQWLnJBAXtiZ9KTm5A51EsdJtQlWlc5X"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ minHeight: '120%', filter: 'brightness(0.5)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.22) 55%,rgba(0,0,0,0.06) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top,rgba(68,79,54,0.15) 0%,transparent 100%)' }} />
        </motion.div>

        {/* Canvas overlay */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'all' }} />

        <motion.div style={{ y: springTxt, opacity: heroOpacity, willChange: 'transform' }} className="absolute bottom-20 left-8 md:left-20 z-10 max-w-3xl px-4">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.32em] font-bold text-white/60 mb-5 flex items-center gap-3"
          >
            <span className="w-10 h-px inline-block" style={{ background: '#b5a26a' }} />
            Corporate Solutions
          </motion.p>

          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.08 }}>
            {['Events &', 'Conferences'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ rotateX: -90, opacity: 0, y: 40 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15, ease: EASE }}
                style={{ display: 'block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ rotateX: -90, opacity: 0, y: 40 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              style={{ display: 'block', fontStyle: 'italic', fontWeight: 400, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
            >
              Gifting Solutions.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
            className="text-white/80 mt-6 max-w-md text-lg font-light leading-relaxed"
          >
            Make every moment memorable with curated corporate gifts that embody sophistication and environmental consciousness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(68,79,54,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 rounded-lg"
              style={{ background: '#444f36', border: 'none', cursor: 'pointer' }}
            >
              Explore Gifts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/contact'}
              className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 backdrop-blur-sm rounded-lg"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
            >
              Request Quote
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 28, background: 'linear-gradient(to bottom,rgba(181,162,106,0.85),transparent)' }}
          />
        </motion.div>
      </section>

      {/* ══ REST OF SECTIONS (About, Bento, Products, Customization, Why, Trust, CTA) ══ */}
      {/* ... (same as your original code) ... */}

      {/* ABOUT */}
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={vStagger} initial="hidden" animate={aboutInView ? 'show' : 'hidden'}>
            <motion.div variants={vFadeUp}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ originX: 0, height: 3, width: 80, background: '#708156', marginBottom: 24 }}
              />
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: '#708156' }}>
                Our Philosophy
              </p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-7" style={{ color: '#3d3a34' }}>
              Elevating Engagement<br />Through Thoughtful Curation
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-10" style={{ color: '#7b7466' }}>
              At Ecotwist, we believe that an event's impact extends far beyond the final session. Our gifting solutions bridge the gap between corporate professionalism and genuine human connection — by selecting materials that respect the earth and designs that inspire the mind.
            </motion.p>
            <motion.div variants={vFadeUp} style={{ width: 80, height: 1, background: '#d1cdc5' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ perspective: '1200px', position: 'relative' }}
          >
            <motion.div
              ref={aRef}
              onMouseMove={aMM}
              onMouseLeave={aML}
              style={{ rotateX: aX, rotateY: aY, transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative' }}
            >
              <motion.div
                className="absolute -inset-1 border border-gray-300"
                style={{ transform: 'translate(16px,16px)', zIndex: 0, transition: 'transform 0.5s ease' }}
                whileHover={{ x: 8, y: 8 } as any}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwIX5PTxZmL6ljd-KY1zM19-KhVOJdkK5p3kGRVOixP-r2FluyVfNmy0NVcJB2D422BIgUtiRYm-fbeurjmXrufEFGNf91h3dlo-19MCBaPxocg3mhlzXr90I9qBaacwvVPBWiCnALbbq_8sDdol5XhsSUnaxCVFuH1JJpdRby_MPyR6dk7vBuJ2gPArqgsnBO4-vaCR_EUN-za8jXx2ZhP_xef0ZkOZ-xgVSopwlE2utcRGbA8O-XggqwAym3-wo24VSkiWFS_6Wz"
                alt="About"
                className="relative w-full shadow-2xl rounded-lg"
                style={{ aspectRatio: '4/5', objectFit: 'cover', zIndex: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f1f0ed' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-serif mb-4" style={{ color: '#3d3a34' }}>Explore Our Collections</h2>
            <p className="font-light max-w-lg mx-auto text-sm" style={{ color: '#968f80' }}>
              Tailored solutions for every touchpoint of your corporate event journey.
            </p>
          </motion.div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '350px 350px' }}
          >
            {BENTO_CARDS.map((card, i) => (
              <BentoCard key={card.key} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section ref={prodRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={prodInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-3" style={{ color: '#708156' }}>Curated Essentials</p>
              <h2 className="text-4xl font-serif" style={{ color: '#3d3a34' }}>Signature Pieces</h2>
            </div>
            <motion.a
              whileHover={{ y: -1 }}
              className="font-bold text-xs uppercase tracking-widest border-b-2 pb-1 cursor-pointer"
              style={{ borderColor: '#708156', color: '#3d3a34' }}
            >
              View All
            </motion.a>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((p, i) => <ProductCard key={p.name} item={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* CUSTOMIZATION */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#444f36' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            variants={vSlideLeft}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
            style={{ position: 'relative' }}
          >
            <div className="absolute -top-12 -left-12 rounded-full opacity-50"
              style={{ width: 256, height: 256, background: '#363f2c', filter: 'blur(60px)' }} />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL9f7Y6XLRFeopFMwhI2tAMelALv1jZuTG36dazTJuVpLudPbfPRZBdE0pLTcZG_59Wu3myrZny8Xnp984MvD4R88UkxaO0RdZXHR1wCxkcOyJNw6QxDQXcFYKSBCRf9HM3an79iK36J4dHrP4mvveNfiiBlp_USqIMazabNkUO4cCWcmCGWvYtQo9tM6ZERF-joXJLqUhSsXF3TUxP26Kw6TstvrHP8hO6LQi3Cr6JCYqiKWWTsUhZXPS4S0e0L2wphGNKURzeA4c"
              alt="Custom"
              className="relative w-full rounded-lg shadow-2xl"
              style={{ zIndex: 1 }}
            />
          </motion.div>

          <motion.div
            variants={vSlideRight}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-white/60 mb-4">Bespoke Details</p>
            <h2 className="text-5xl font-serif text-white leading-tight mb-12">
              Personalized for<br />
              <span style={{ color: '#b3bea0', fontStyle: 'italic', fontWeight: 400 }}>Your Brand</span>
            </h2>

            <motion.div variants={vStagger} initial="hidden" animate={custInView ? 'show' : 'hidden'}
              className="grid grid-cols-2 gap-8"
            >
              {CUSTOM_ITEMS.map((item) => (
                <motion.div key={item.title} variants={vFadeUp}>
                  <span className="text-3xl block mb-3" style={{ color: '#b3bea0' }}>{item.icon}</span>
                  <h4 className="font-serif text-xl text-white mb-2">{item.title}</h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(227,233,214,0.7)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY ECOTWIST */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-serif mb-4" style={{ color: '#3d3a34' }}>The Ecotwist Difference</h2>
            <div className="mx-auto" style={{ width: 64, height: 3, background: '#708156' }} />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {WHY.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-12 px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold mb-10"
            style={{ color: '#b4aea1' }}
          >
            Trusted by Industry Leaders
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            whileHover={{ opacity: 1, filter: 'grayscale(0)' } as any}
            className="flex flex-wrap justify-center gap-16 grayscale cursor-pointer"
            style={{ transition: 'opacity 0.5s, filter 0.5s' }}
          >
            {['Aether', 'Solace', 'Noir', 'Lumina', 'Vantage'].map(b => (
              <span key={b} className="font-serif text-xl font-bold" style={{ color: '#4d4941', letterSpacing: -0.5 }}>{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section ref={ctaRef} className="py-10 px-8 text-center" style={{ background: '#f1f0ed' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-serif text-5xl md:text-6xl leading-tight mb-6"
            style={{ color: '#3d3a34' }}
          >
            Ready to create the perfect
            <span className="italic font-normal"> Events & Conferences</span>
            gift experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg font-light leading-relaxed mb-12"
            style={{ color: '#7b7466' }}
          >
            Our team is ready to help you curate a selection that resonates with your brand values and delights your guests.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -3, boxShadow: '0 18px 40px rgba(68,79,54,0.3)' }}
              onClick={() => window.location.href = '/configurator'}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-[0.2em] text-xs px-14 py-6 shadow-xl rounded-lg"
              style={{ background: '#444f36', border: 'none', cursor: 'pointer' }}
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => window.location.href = '/contact'}
              className="font-bold uppercase tracking-[0.2em] text-xs pb-1 border-b-2 transition-colors"
              style={{ background: 'transparent', border: 'none', borderBottom: '2px solid rgba(61,58,52,0.2)', cursor: 'pointer', color: '#3d3a34' }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#708156')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'rgba(61,58,52,0.2)')}
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}