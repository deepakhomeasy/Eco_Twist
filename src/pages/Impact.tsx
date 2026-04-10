import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

/* ─── MAGNETIC CURSOR ────────────────────────────────────────── */
const MagneticCursor: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      style={{ left: sx, top: sy }}
      // className="fixed z-[9999] w-5 h-5 rounded-full border border-[#C9A96E] pointer-events-none mix-blend-difference hidden md:block"
    />
  );
};

/* ─── FLOATING PARTICLE ─────────────────────────────────────── */
interface ParticleProps {
  style: React.CSSProperties;
}

const Particle: React.FC<ParticleProps> = ({ style }) => (
  <motion.div
    className="absolute rounded-full bg-[#C9A96E]/20"
    style={style}
    animate={{
      y: [0, -40, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.4, 1],
    }}
    transition={{
      duration: Math.random() * 4 + 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: Math.random() * 2,
    }}
  />
);

/* ─── GLITCH TEXT (unused but kept) ──────────────────────────── */
// const GlitchText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
//   <span className={`relative inline-block ${className}`}>
//     <span className="relative z-10">{children}</span>
//   </span>
// );

/* ─── CINEMATIC IMAGE CARD ──────────────────────────────────── */
interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  originX?: number;
  originZ?: number;
  rotateY?: number;
  rotateX?: number;
  style?: React.CSSProperties;
}

const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  alt,
  className = '',
  delay = 0,
  originX = 0,
  originZ = -1200,
  rotateY = 0,
  rotateX = 0,
  style = {},
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: '1200px', ...style }}
      initial={{
        opacity: 0,
        x: originX,
        z: originZ,
        rotateY: rotateY,
        rotateX: rotateX,
        scale: 0.4,
        filter: 'blur(30px) brightness(0)',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        z: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
      }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 1.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
        filter: { duration: 1.2 },
      }}
      whileHover={{ scale: 1.04, rotateY: 3, transition: { duration: 0.5 } }}
    >
      {/* Landing flash */}
      <motion.div
        className="absolute inset-0 bg-[#C9A96E] z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.5, 0] }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: delay + 1.2 }}
      />

      {/* Scan line on land */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent z-30 pointer-events-none"
        initial={{ top: '0%', opacity: 1 }}
        whileInView={{ top: '110%', opacity: [1, 1, 0] }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, delay: delay + 1.0, ease: 'linear' }}
      />

      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <div
          key={c}
          className={`absolute w-6 h-6 pointer-events-none
            ${c.includes('t') ? 'top-3' : 'bottom-3'}
            ${c.includes('l') ? 'left-3' : 'right-3'}
            border-[#C9A96E]/60
            ${c === 'tl' ? 'border-t border-l' : ''}
            ${c === 'tr' ? 'border-t border-r' : ''}
            ${c === 'bl' ? 'border-b border-l' : ''}
            ${c === 'br' ? 'border-b border-r' : ''}
          `}
        />
      ))}
    </motion.div>
  );
};

/* ─── METRIC CARD ────────────────────────────────────────────── */
interface MetricCardProps {
  value: string;
  label: string;
  desc: string;
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, desc, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const numericVal = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(false);
          setTimeout(() => setStarted(true), 50);
        } else {
          setStarted(false);
          setCount(0);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = numericVal / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, numericVal);
      setCount(current);
      if (current >= numericVal) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, numericVal]);

  const displayVal = numericVal >= 100 ? Math.round(count) : count.toFixed(0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 30, scale: 0.85, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 1.1, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -16, scale: 1.04, rotateY: 4 }}
      className="relative border-t border-[#1a1a0e]/10 pt-10 group cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* glow */}
      <div className="absolute -inset-4 bg-[#C9A96E]/0 group-hover:bg-[#C9A96E]/5 rounded-xl transition-all duration-500 blur-xl" />

      <span className="block font-serif text-[5.5rem] md:text-[7rem] leading-none mb-3 bg-gradient-to-br from-[#1a1a0e] via-[#3d3d1f] to-[#1a1a0e] bg-clip-text text-transparent">
        {displayVal}
        {suffix}
      </span>
      <p className="uppercase tracking-[0.3em] text-[9px] font-bold text-[#1a1a0e]/50">{label}</p>
      <p className="mt-4 text-sm font-light leading-relaxed text-[#555]/80 max-w-xs">{desc}</p>

      {/* bottom line reveal */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#C9A96E] to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: '60%' }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, delay: index * 0.18 + 0.6 }}
      />
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════
   GIFTING HERO CANVAS HOOK
════════════════════════════════════════════════════════════════ */
const useGiftingCanvas = (sectionRef: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number, animId: number;

    const GOLD = [
      '#FFD700', '#FFA500', '#FF6B9D', '#FF4D6D',
      '#FFB347', '#FF8C69', '#FFD1DC', '#C9A96E',
      '#E8C882', '#F4A460',
    ];

    function resize() {
      W = canvas.width = hero!.offsetWidth;
      H = canvas.height = hero!.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let mx = -9999,
      my = -9999;
    const onMove = (e: MouseEvent) => {
      const r = hero!.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    const REPULSE_RADIUS = 180;
    const REPULSE_FORCE = 1.8;

    class CanvasParticle {
      x: number = 0;
      y: number = 0;
      driftX: number = 0;
      driftY: number = 0;
      vx: number = 0;
      vy: number = 0;
      r: number = 0;
      color: string = '';
      pulse: number = 0;
      shape: string = '';
      rot: number = 0;
      rotspd: number = 0;

      constructor() {
        this.reset(true);
      }
      reset(initial: boolean) {
        this.x = Math.random() * (W || 800);
        this.y = initial ? Math.random() * (H || 600) : (H || 600) + 20;
        const a = Math.random() * Math.PI * 2;
        const s = 0.3 + Math.random() * 0.5;
        this.driftX = Math.cos(a) * s;
        this.driftY = -(0.2 + Math.random() * 0.4);
        this.vx = this.driftX;
        this.vy = this.driftY;
        this.r = 1.5 + Math.random() * 2;
        this.color = GOLD[Math.floor(Math.random() * GOLD.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.shape = Math.random() < 0.3 ? 'star' : 'circle';
        this.rot = Math.random() * Math.PI * 2;
        this.rotspd = (Math.random() - 0.5) * 0.04;
      }
      update() {
        this.pulse += 0.04;
        this.rot += this.rotspd;
        if (mx > -999) {
          const dx = this.x - mx,
            dy = this.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSE_RADIUS && dist > 0) {
            const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS;
            this.vx += (dx / dist) * force * REPULSE_FORCE;
            this.vy += (dy / dist) * force * REPULSE_FORCE;
          }
        }
        this.vx += (this.driftX - this.vx) * 0.04;
        this.vy += (this.driftY - this.vy) * 0.04;
        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (spd > 5) {
          this.vx = (this.vx / spd) * 5;
          this.vy = (this.vy / spd) * 5;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -20) {
          this.y = H + 20;
          this.x = Math.random() * W;
        }
        if (this.y > H + 20) this.y = -20;
      }
      draw() {
        const pr = this.r + Math.sin(this.pulse) * 0.5;
        const near =
          mx > -999 && Math.sqrt((this.x - mx) ** 2 + (this.y - my) ** 2) < REPULSE_RADIUS;

        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rot);

        if (this.shape === 'star') {
          ctx!.beginPath();
          for (let i = 0; i < 5; i++) {
            const ao = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const bo = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
            const outerR = near ? pr * 3 : pr * 2.5;
            const innerR = near ? pr * 1.2 : pr;
            if (i === 0) ctx!.moveTo(Math.cos(ao) * outerR, Math.sin(ao) * outerR);
            else ctx!.lineTo(Math.cos(ao) * outerR, Math.sin(ao) * outerR);
            ctx!.lineTo(Math.cos(bo) * innerR, Math.sin(bo) * innerR);
          }
          ctx!.closePath();
          ctx!.fillStyle = near ? '#fff' : this.color;
          ctx!.globalAlpha = near ? 1 : 0.85;
          ctx!.fill();
        } else {
          if (near) {
            ctx!.beginPath();
            ctx!.arc(0, 0, pr * 4, 0, Math.PI * 2);
            ctx!.fillStyle = this.color;
            ctx!.globalAlpha = 0.08;
            ctx!.fill();
          }
          ctx!.beginPath();
          ctx!.arc(0, 0, near ? pr * 1.6 : pr, 0, Math.PI * 2);
          ctx!.fillStyle = near ? '#fff' : this.color;
          ctx!.globalAlpha = near ? 1 : 0.8;
          ctx!.fill();
        }
        ctx!.restore();
      }
    }

    const PARTICLES = Array.from({ length: 220 }, () => new CanvasParticle());

    function drawLinks() {
      const MAX_LINK = 110;
      for (let i = 0; i < PARTICLES.length; i++) {
        for (let j = i + 1; j < PARTICLES.length; j++) {
          const a = PARTICLES[i],
            b = PARTICLES[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_LINK) {
            const op = (1 - d / MAX_LINK) * 0.35;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(255,200,80,${op})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }
    }

    /* ── FLOATING GIFT BOXES ── */
    const GIFTS = Array.from({ length: 7 }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.15 + Math.random() * 0.3),
      size: 16 + Math.random() * 22,
      color: GOLD[Math.floor(Math.random() * GOLD.length)],
      bow: GOLD[Math.floor(Math.random() * GOLD.length)],
      rot: Math.random() * Math.PI * 2,
      rotspd: (Math.random() - 0.5) * 0.008,
    }));

    function drawGift(g: (typeof GIFTS)[0]) {
      ctx!.save();
      ctx!.translate(g.x, g.y);
      ctx!.rotate(g.rot);
      const s = g.size;
      ctx!.globalAlpha = 0.55;
      ctx!.fillStyle = g.color;
      ctx!.fillRect(-s / 2, -s / 2, s, s);
      ctx!.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx!.lineWidth = 0.8;
      ctx!.strokeRect(-s / 2, -s / 2, s, s);
      ctx!.strokeStyle = g.bow;
      ctx!.lineWidth = 1.5;
      ctx!.globalAlpha = 0.85;
      ctx!.beginPath();
      ctx!.moveTo(0, -s / 2);
      ctx!.lineTo(0, s / 2);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(-s / 2, 0);
      ctx!.lineTo(s / 2, 0);
      ctx!.stroke();
      ctx!.lineWidth = 1.2;
      ctx!.globalAlpha = 0.9;
      ctx!.beginPath();
      ctx!.moveTo(-7, -s / 2);
      ctx!.quadraticCurveTo(-13, -s / 2 - 13, 0, -s / 2 - 3);
      ctx!.quadraticCurveTo(13, -s / 2 - 13, 7, -s / 2);
      ctx!.stroke();
      ctx!.restore();
    }

    /* ── FLOATING HEARTS ── */
    const HEARTS = Array.from({ length: 10 }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.2 + Math.random() * 0.35),
      size: 5 + Math.random() * 9,
      color: ['#FF4D6D', '#FF6B9D', '#FFD1DC', '#FF8C69'][Math.floor(Math.random() * 4)],
      rot: Math.random() * Math.PI * 2,
      rotspd: (Math.random() - 0.5) * 0.025,
      opacity: 0.35 + Math.random() * 0.45,
    }));

    function drawHeart(h: (typeof HEARTS)[0]) {
      ctx!.save();
      ctx!.translate(h.x, h.y);
      ctx!.rotate(h.rot);
      ctx!.globalAlpha = h.opacity;
      ctx!.fillStyle = h.color;
      const s = h.size;
      ctx!.beginPath();
      ctx!.moveTo(0, s * 0.35);
      ctx!.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 1.0, s * 0.25, 0, s);
      ctx!.bezierCurveTo(s * 1.0, s * 0.25, s * 0.5, -s * 0.1, 0, s * 0.35);
      ctx!.closePath();
      ctx!.fill();
      ctx!.restore();
    }

    /* ── WAVY RIBBONS ── */
    const RIBBONS = Array.from({ length: 9 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * (H || 600),
      len: 40 + Math.random() * 80,
      spd: 0.6 + Math.random() * 1.2,
      amp: 12 + Math.random() * 28,
      freq: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      color: GOLD[Math.floor(Math.random() * GOLD.length)],
      width: 1 + Math.random() * 2,
    }));

    /* ── SPARKLES ── */
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }
    const SPARKS: Spark[] = [];
    let sparkTimer = 0;
    function spawnSparks(sx: number, sy: number) {
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 3.5;
        SPARKS.push({
          x: sx,
          y: sy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
        });
      }
    }

    /* ── MAIN LOOP ── */
    let frame = 0;
    function loop() {
      frame++;
      ctx!.clearRect(0, 0, W, H);

      const bg = ctx!.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0d0008');
      bg.addColorStop(0.4, '#1c0520');
      bg.addColorStop(0.75, '#120a00');
      bg.addColorStop(1, '#0a0010');
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      const glow = ctx!.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55);
      glow.addColorStop(0, 'rgba(210,100,60,0.10)');
      glow.addColorStop(0.5, 'rgba(180,50,120,0.06)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      /* ribbons */
      ctx!.save();
      RIBBONS.forEach((r) => {
        r.phase += 0.018;
        r.x -= r.spd;
        if (r.x < -r.len) r.x = W + r.len;
        ctx!.beginPath();
        for (let i = 0; i <= r.len; i += 3) {
          const px = r.x + i;
          const py = r.y + Math.sin(r.phase + i * r.freq) * r.amp;
          i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
        }
        ctx!.strokeStyle = r.color;
        ctx!.lineWidth = r.width;
        ctx!.globalAlpha = 0.28;
        ctx!.stroke();
      });
      ctx!.restore();

      /* hearts */
      HEARTS.forEach((h) => {
        h.x += h.vx;
        h.y += h.vy;
        h.rot += h.rotspd;
        if (h.y < -30) {
          h.y = H + 20;
          h.x = Math.random() * W;
        }
        if (h.x < -20) h.x = W + 20;
        if (h.x > W + 20) h.x = -20;
        drawHeart(h);
      });

      /* gift boxes */
      GIFTS.forEach((g) => {
        g.x += g.vx;
        g.y += g.vy;
        g.rot += g.rotspd;
        if (g.y < -50) {
          g.y = H + 50;
          g.x = Math.random() * W;
        }
        if (g.x < -50) g.x = W + 50;
        if (g.x > W + 50) g.x = -50;
        drawGift(g);
      });

      /* links + particles */
      drawLinks();
      PARTICLES.forEach((p) => {
        p.update();
        p.draw();
      });

      /* auto sparkle bursts */
      sparkTimer++;
      if (sparkTimer > 70 + Math.floor(Math.random() * 40)) {
        sparkTimer = 0;
        spawnSparks(Math.random() * W, Math.random() * H);
      }
      /* cursor sparkles */
      if (mx > -999 && frame % 10 === 0) spawnSparks(mx, my);

      /* draw sparks */
      ctx!.save();
      for (let i = SPARKS.length - 1; i >= 0; i--) {
        const s = SPARKS[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.06;
        s.life -= 0.08;
        if (s.life <= 0) {
          SPARKS.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
        ctx!.fillStyle = s.color;
        ctx!.globalAlpha = s.life;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.moveTo(s.x - 5 * s.life, s.y);
        ctx!.lineTo(s.x + 5 * s.life, s.y);
        ctx!.moveTo(s.x, s.y - 5 * s.life);
        ctx!.lineTo(s.x, s.y + 5 * s.life);
        ctx!.strokeStyle = s.color;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = s.life * 0.7;
        ctx!.stroke();
      }
      ctx!.restore();

      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      canvas.remove();
    };
  }, [sectionRef]);
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const Impact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroParallaxY = useTransform(scrollYProgress, [0, 0.25], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.12]);

  useGiftingCanvas(heroRef);

  const particles = Array.from({ length: 12 }, () => ({
    width: Math.random() * 6 + 2,
    height: Math.random() * 6 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div
      ref={containerRef}
      className="bg-[#f7f4ef] min-h-screen overflow-x-hidden font-sans"
      style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
    >
      <MagneticCursor />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0d0008]"
      >
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}

        {/* BG parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroParallaxY, scale: heroScale }}>
          <motion.div
            initial={{ scale: 1.6, filter: 'blur(30px)', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.35 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          />
        </motion.div>

        {/* Diagonal gold lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent w-full"
            style={{ top: `${20 + i * 15}%`, transform: `rotate(${-15 + i * 2}deg)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.4 + i * 0.1 }}
          />
        ))}

        {/* Vignette — replaced bg-gradient-radial with inline style */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, transparent 0%, rgba(17,17,8,0.3) 50%, rgba(17,17,8,0.8) 100%)',
          }}
        />

        {/* HERO TEXT */}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <motion.span
            className="text-[#C9A96E] uppercase tracking-[0.5em] text-[11px] font-bold mb-6 block"
            initial={{ opacity: 0, y: -30, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.5em' }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            A Legacy of Responsibility
          </motion.span>

          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-serif text-[clamp(3.5rem,10vw,9rem)] text-[#f0ead6] leading-[0.95] tracking-tight"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Sustainable
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-serif italic text-[clamp(3.5rem,10vw,9rem)] text-[#C9A96E] leading-[0.95] font-light"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Luxury Defined.
            </motion.h1>
          </div>

          <motion.p
            className="text-[#f0ead6]/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            At Ecotwist, we believe true luxury is found in the harmony between exquisite design
            and ecological integrity.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            className="mt-14 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <span className="text-[#C9A96E]/50 text-[9px] uppercase tracking-[0.4em]">Scroll</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-[#C9A96E]/60 to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ─────────────────────────────────────────── */}
      <section className="py-36 px-8 bg-white relative overflow-hidden">
        {/* decorative bg number */}
        <motion.div
          className="absolute -right-8 top-1/2 -translate-y-1/2 font-serif text-[20rem] leading-none text-[#f0ead6] select-none pointer-events-none"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.4 }}
        >
          ∞
        </motion.div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            <span className="uppercase tracking-[0.4em] text-[9px] font-bold text-[#C9A96E]">
              Impact Numbers
            </span>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 text-[#1a1a0e]">
              Measured in <span className="italic text-[#C9A96E]">meaning.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                value: '1000+',
                label: 'Kilograms CO2 Offset',
                desc: 'Through regenerative forestry and localized production cycles that prioritize the planet.',
              },
              {
                value: '100+',
                label: 'Master Artisans',
                desc: 'Empowering heritage communities across four continents with fair living wages and healthcare.',
              },
              {
                value: '100%',
                label: 'Traceable Materials',
                desc: 'Every fiber has a story. Our blockchain-verified supply chain ensures absolute transparency.',
              },
            ].map((m, i) => (
              <MetricCard key={m.label} {...m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTISAN STORIES — CINEMATIC LAND ─────────────────── */}
      <section className="py-14 bg-[#f0ead6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Label */}
          <motion.div
            className="mb-16 flex items-center gap-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9 }}
          >
            <div className="h-px flex-1 bg-[#1a1a0e]/20" />
            <span className="uppercase tracking-[0.4em] text-[9px] font-bold text-[#1a1a0e]/50">
              Artisan Stories
            </span>
            <div className="h-px w-12 bg-[#C9A96E]" />
          </motion.div>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <CinematicImage
                src="https://s3.eu-west-2.amazonaws.com/files.sewport.com/blog/essentials-of-pattern-making-and-why-it%27s-important-to-get-it-right/pattern-making.jpeg"
                alt="Artisan at work"
                className="aspect-[4/3] rounded-sm"
                delay={0}
                originX={-300}
                originZ={-1400}
                rotateY={45}
                rotateX={-20}
              />

              {/* caption */}
              <motion.div
                className="mt-5 flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <span className="w-8 h-px bg-[#C9A96E]" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#1a1a0e]/50 font-bold">
                  Master Weaver — Oaxaca, Mexico
                </p>
              </motion.div>
            </div>

            <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
              <CinematicImage
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                alt="Artisan hands close-up"
                className="aspect-[3/2] rounded-sm"
                delay={0.3}
                originX={400}
                originZ={-1600}
                rotateY={-55}
                rotateX={25}
              />

              {/* Pull quote */}
              <motion.blockquote
                className="pl-6 border-l-2 border-[#C9A96E]"
                initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <p className="font-serif text-xl md:text-2xl italic text-[#1a1a0e] leading-snug">
                  "Every knot is a prayer. Every thread, a promise to the earth."
                </p>
                <cite className="mt-3 block text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-bold not-italic">
                  — Amara Diallo, Artisan Partner
                </cite>
              </motion.blockquote>

              <CinematicImage
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1925&auto=format&fit=crop"
                alt="Sustainable textile detail"
                className="aspect-[3/2] rounded-sm"
                delay={0.6}
                originX={350}
                originZ={-1800}
                rotateY={-60}
                rotateX={-30}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ETHICAL BLUEPRINT ─────────────────────────────────── */}
      <section className="pt-10 pb-10 bg-[#111108] text-[#f0ead6] relative overflow-hidden">
        {/* animated grid bg */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#C9A96E 1px, transparent 1px), linear-gradient(90deg, #C9A96E 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* large watermark */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-[22vw] leading-none text-white/[0.02] select-none pointer-events-none whitespace-nowrap"
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          ECOTWIST
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            <span className="uppercase tracking-[0.5em] text-[9px] font-bold text-[#C9A96E]/60 block">
              Confidential / Internal Methodology
            </span>
            <h2 className="font-serif text-4xl md:text-6xl">
              The Ethical <span className="italic text-[#C9A96E]">Blueprint</span>
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y divide-[#f0ead6]/10">
            {[
              {
                id: '01.',
                title: 'The Requirement',
                desc: 'Sourcing raw materials that demand nothing from the earth but time.',
                items: ['Wild Organic Silk', 'Post-Consumer Gold', 'Regen Wool'],
                img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop',
              },
              {
                id: '02.',
                title: 'The Design',
                desc: 'Architecture for the body. Every seam serves a functional and aesthetic purpose.',
                items: ['Draft No. 42A', 'Zero-Waste Patterning'],
                img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop',
              },
              {
                id: '03.',
                title: 'The Delivery',
                desc: 'Carbon-neutral transit to your door in plastic-free, archival packaging.',
                items: ['Modern Heirloom', 'Lifetime Integrity'],
                img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop',
              },
            ].map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative grid grid-cols-12 gap-8 py-6 items-center cursor-default"
              >
                {/* hover bg reveal */}
                <motion.div className="absolute inset-0 bg-[#C9A96E]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="col-span-1 hidden md:block">
                  <span className="font-serif text-2xl text-[#C9A96E]/40">{step.id}</span>
                </div>

                <div className="col-span-12 md:col-span-5">
                  <h4 className="uppercase tracking-[0.4em] font-bold text-[9px] mb-4 text-[#C9A96E]/60">
                    {step.title}
                  </h4>
                  <p className="font-serif text-2xl md:text-3xl leading-snug">{step.desc}</p>
                </div>

                <div className="col-span-12 md:col-span-3 flex flex-wrap gap-x-6 gap-y-2">
                  {step.items.map((item) => (
                    <span
                      key={item}
                      className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#f0ead6]/40"
                    >
                      — {item}
                    </span>
                  ))}
                </div>

                {/* thumbnail */}
                <motion.div
                  className="col-span-12 md:col-span-3 overflow-hidden rounded-sm aspect-video opacity-100"
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ rotateY: -4, scale: 1.05 }}
                >
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* progress line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-[#C9A96E]"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.4, delay: i * 0.15 + 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER MARK ─────────────────────────────────────── */}
      <motion.section
        className="py-10 bg-[#111108] text-center border-t border-[#f0ead6]/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        <motion.p
          className="font-serif italic text-[#C9A96E] text-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Crafted with intention. Worn with purpose.
        </motion.p>
      </motion.section>
    </div>
  );
};

export default Impact;
