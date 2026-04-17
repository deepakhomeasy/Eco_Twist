import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════
interface Vec2      { x: number; y: number }
interface Ripple    { x:number; y:number; r:number; maxR:number; life:number; hue:number; delay:number }
interface Bloom     { x:number; y:number; petals:number; r:number; maxR:number; life:number; hue:number; rot:number }
interface Well      { x:number; y:number; life:number; hue:number; strength:number }
interface Shockwave { x:number; y:number; r:number; life:number; hue:number }

interface BNode {
  x:number; y:number; vx:number; vy:number;
  ox:number; oy:number;
  hue:number; r:number;
  pulse:number; pulseSpd:number;
  excited:number; breathPhase:number;
}
interface BPulse {
  fromIdx:number; toIdx:number; t:number; spd:number;
  hue:number; size:number; trail:Vec2[];
}
interface BParticle {
  x:number; y:number; vx:number; vy:number; r:number; hue:number;
  alpha:number; pulse:number; pulseSpd:number;
  wobble:number; wobbleSpd:number; fromClick:boolean; trail:Vec2[];
}
interface BGeo {
  x:number; y:number; vx:number; vy:number;
  size:number; rot:number; rotSpd:number;
  type:'star'|'diamond'|'heart'|'circle';
  hue:number; alpha:number;
  pulse:number; pulseSpd:number;
  wobble:number; wobbleSpd:number;
}
interface BConfetti {
  x:number; y:number; vx:number; vy:number;
  size:number; hue:number; rotation:number; rotSpd:number;
  isCircle:boolean; opacity:number; wobble:number; wobbleSpd:number;
}
interface BBalloon {
  x:number; baseY:number; rx:number; ry:number;
  hue:number; phase:number; speed:number;
  swayAmp:number; swaySpeed:number; stringLen:number; excited:number;
}
interface BScanLine { y:number; spd:number; alpha:number; hue:number }

// ═══════════════════════════════════════════════════════
//  BIRTHDAY CANVAS HOOK
// ═══════════════════════════════════════════════════════
function useBirthdayCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const maybeCtx  = canvas.getContext('2d', { alpha: true });
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    let W = 0, H = 0, animId: number;
    let mx = -9999, my = -9999;
    let time = 0;
    let dpr  = Math.min(window.devicePixelRatio || 1, 2);

    const HUES = [14, 18, 22, 38, 42, 46, 8, 12, 30];
    const randH = () => HUES[Math.floor(Math.random() * HUES.length)];

    const NODES:     BNode[]     = [];
    const PULSES:    BPulse[]    = [];
    const PARTICLES: BParticle[] = [];
    const GEOS:      BGeo[]      = [];
    const CONFETTI:  BConfetti[] = [];
    const BALLOONS:  BBalloon[]  = [];
    const RIPPLES:   Ripple[]    = [];
    const BLOOMS:    Bloom[]     = [];
    const WELLS:     Well[]      = [];
    const SHOCKWAVES:Shockwave[] = [];

    const SCAN: BScanLine[] = [
      { y:0.15, spd:0.00038, alpha:0.045, hue:14 },
      { y:0.45, spd:0.00052, alpha:0.035, hue:42 },
      { y:0.72, spd:0.00042, alpha:0.035, hue:18 },
      { y:0.30, spd:0.00068, alpha:0.025, hue:38 },
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W   = container.offsetWidth;
      H   = container.offsetHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (NODES.length    === 0) initNodes();
      if (GEOS.length     === 0) initGeos();
      if (CONFETTI.length === 0) initConfetti();
      if (BALLOONS.length === 0) initBalloons();
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const toLocal = (e: MouseEvent): Vec2 => {
      const r = container.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseMove  = (e: MouseEvent) => { const p = toLocal(e); mx = p.x; my = p.y; };
    const onMouseLeave = () => { mx = -9999; my = -9999; };
    container.addEventListener('mousemove',  onMouseMove,  { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });

    const onClick = (e: MouseEvent) => {
      const { x: cx, y: cy } = toLocal(e);
      const hue = randH();

      for (let i = 0; i < 5; i++)
        RIPPLES.push({ x:cx, y:cy, r:i*18, maxR:160+i*55, life:1, hue, delay:i*3 });

      BLOOMS.push({ x:cx, y:cy, petals:7+Math.floor(Math.random()*5),
        r:0, maxR:65+Math.random()*35, life:1, hue, rot:Math.PI/4 });

      SHOCKWAVES.push({ x:cx, y:cy, r:0, life:1, hue });
      WELLS.push({ x:cx, y:cy, life:1, hue, strength:3 });

      NODES.forEach((n, idx) => {
        const d = Math.hypot(n.x-cx, n.y-cy);
        if (d < 220) {
          n.excited = Math.min(1, n.excited + (1 - d/220) * 0.9);
          if (Math.random() > 0.4) spawnPulse(idx);
        }
      });

      BALLOONS.forEach(b => {
        const bx = b.x * W, by = b.baseY * H;
        const d  = Math.hypot(bx-cx, by-cy);
        if (d < 200) b.excited = Math.min(1, b.excited + (1-d/200)*0.85);
      });

      for (let i = 0; i < 22; i++) spawnParticle(cx, cy, true);
      for (let i = 0; i < 14; i++) burstConfetti(cx, cy);
    };
    container.addEventListener('click', onClick, { passive: true });

    function initNodes() {
      NODES.length = 0;
      const count  = Math.min(65, Math.floor((W * H) / 13000));
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        NODES.push({
          x, y, ox:x, oy:y,
          vx:(Math.random()-0.5)*0.22,
          vy:(Math.random()-0.5)*0.22,
          hue:randH(), r:1.4+Math.random()*1.8,
          pulse:Math.random()*Math.PI*2,
          pulseSpd:0.014+Math.random()*0.018,
          excited:0,
          breathPhase:Math.random()*Math.PI*2,
        });
      }
    }

    function initGeos() {
      GEOS.length = 0;
      for (let i = 0; i < 20; i++) GEOS.push(makeGeo(true));
    }

    function makeGeo(initial: boolean): BGeo {
      const types: BGeo['type'][] = ['star','diamond','heart','circle'];
      return {
        x:    Math.random() * (W || 800),
        y:    initial ? Math.random()*(H||600) : (H||600)+20,
        vx:   (Math.random()-0.5)*0.20,
        vy:   -(0.12+Math.random()*0.34),
        size: 4+Math.random()*11,
        rot:  Math.random()*Math.PI*2,
        rotSpd:(Math.random()-0.5)*0.013,
        type: types[Math.floor(Math.random()*4)],
        hue:  randH(),
        alpha:0.08+Math.random()*0.18,
        pulse:Math.random()*Math.PI*2,
        pulseSpd:0.016+Math.random()*0.024,
        wobble:Math.random()*Math.PI*2,
        wobbleSpd:0.018+Math.random()*0.026,
      };
    }

    function initConfetti() {
      CONFETTI.length = 0;
      for (let i = 0; i < 55; i++) {
        CONFETTI.push({
          x: Math.random()*W, y: Math.random()*-600,
          vx:(Math.random()-0.5)*0.8, vy:0.5+Math.random()*1.1,
          size:4+Math.random()*7, hue:randH(),
          rotation:Math.random()*Math.PI*2,
          rotSpd:(Math.random()-0.5)*0.08,
          isCircle:Math.random()>0.5,
          opacity:0.3+Math.random()*0.4,
          wobble:Math.random()*Math.PI*2,
          wobbleSpd:0.02+Math.random()*0.03,
        });
      }
    }

    function burstConfetti(cx: number, cy: number) {
      const angle = Math.random()*Math.PI*2;
      const spd   = 2+Math.random()*4;
      CONFETTI.push({
        x:cx, y:cy,
        vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd-2,
        size:4+Math.random()*8, hue:randH(),
        rotation:Math.random()*Math.PI*2,
        rotSpd:(Math.random()-0.5)*0.15,
        isCircle:Math.random()>0.5,
        opacity:0.7+Math.random()*0.3,
        wobble:Math.random()*Math.PI*2,
        wobbleSpd:0.03+Math.random()*0.04,
      });
    }

    function initBalloons() {
      BALLOONS.length = 0;
      const configs = [
        { x:0.72, baseY:0.18, rx:38, ry:48, hue:14 },
        { x:0.82, baseY:0.10, rx:32, ry:42, hue:42 },
        { x:0.90, baseY:0.24, rx:28, ry:36, hue:8  },
        { x:0.78, baseY:0.32, rx:22, ry:28, hue:18 },
        { x:0.65, baseY:0.14, rx:26, ry:34, hue:38 },
      ];
      configs.forEach((c, i) => {
        BALLOONS.push({
          x:c.x, baseY:c.baseY, rx:c.rx, ry:c.ry, hue:c.hue,
          phase:i*1.2, speed:0.018+Math.random()*0.008,
          swayAmp:6+Math.random()*8, swaySpeed:0.010+Math.random()*0.008,
          stringLen:45+Math.random()*30, excited:0,
        });
      });
    }

    function spawnPulse(fromIdx?: number) {
      const fi = fromIdx ?? Math.floor(Math.random()*NODES.length);
      if (NODES.length < 2) return;
      let best = -1, bestD = 99999;
      for (let j = 0; j < NODES.length; j++) {
        if (j === fi) continue;
        const d = Math.hypot(NODES[fi].x-NODES[j].x, NODES[fi].y-NODES[j].y);
        if (d < 155 && d < bestD && Math.random() > 0.28) { best = j; bestD = d; }
      }
      if (best === -1) return;
      PULSES.push({
        fromIdx:fi, toIdx:best,
        t:0, spd:0.008+Math.random()*0.012,
        hue:NODES[fi].hue,
        size:1.6+Math.random()*1.6,
        trail:[],
      });
    }

    function spawnParticle(ex?: number, ey?: number, click = false) {
      const isClick = click && ex !== undefined;
      const angle   = isClick ? Math.random()*Math.PI*2 : -Math.PI/2+(Math.random()-0.5)*1.1;
      const spd     = isClick ? 1.4+Math.random()*2.5   : 0.28+Math.random()*0.65;
      PARTICLES.push({
        x:ex??Math.random()*W, y:ey??H+8,
        vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd,
        r:isClick ? 1.8+Math.random()*3.8 : 1.2+Math.random()*2.8,
        hue:randH(),
        alpha:0.38+Math.random()*0.48,
        pulse:Math.random()*Math.PI*2, pulseSpd:0.02+Math.random()*0.03,
        wobble:Math.random()*Math.PI*2, wobbleSpd:0.025+Math.random()*0.035,
        fromClick:isClick, trail:[],
      });
    }

    function drawAurora() {
      SCAN.forEach(b => {
        const yc = H*(b.y + Math.sin(time*b.spd + b.y*6)*0.055);
        const h  = 100;
        const g  = ctx.createLinearGradient(0, yc-h, 0, yc+h);
        g.addColorStop(0,    `hsla(${b.hue},65%,65%,0)`);
        g.addColorStop(0.38, `hsla(${b.hue},70%,68%,${b.alpha*0.55})`);
        g.addColorStop(0.5,  `hsla(${b.hue},72%,72%,${b.alpha})`);
        g.addColorStop(0.62, `hsla(${b.hue},70%,68%,${b.alpha*0.55})`);
        g.addColorStop(1,    `hsla(${b.hue},65%,65%,0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, yc-h, W, h*2);
      });
    }

    let pulseTimer = 0;
    function updateDrawNetwork() {
      const LINK_DIST = 130;
      ctx.save();

      NODES.forEach(n => {
        n.pulse       += n.pulseSpd;
        n.breathPhase += 0.006;
        n.excited      = Math.max(0, n.excited-0.012);

        n.vx += (n.ox-n.x)*0.00030;
        n.vy += (n.oy-n.y)*0.00030;

        if (mx > -999) {
          const dx = n.x-mx, dy = n.y-my, d = Math.hypot(dx, dy);
          if (d < 140 && d > 0) {
            const f = (140-d)/140;
            n.vx += (dx/d)*f*f*0.9;
            n.vy += (dy/d)*f*f*0.9;
          }
        }

        WELLS.forEach(w => {
          const dx = w.x-n.x, dy = w.y-n.y, d = Math.hypot(dx, dy);
          if (d < 200 && d > 0) {
            const f = (1-d/200)*w.strength*w.life;
            n.vx += (dx/d)*f*0.4;
            n.vy += (dy/d)*f*0.4;
          }
        });

        n.vx *= 0.93; n.vy *= 0.93;
        n.x  += n.vx;  n.y  += n.vy;
        if (n.x < 0) { n.x = 0; n.vx *= -0.5; }
        if (n.x > W) { n.x = W; n.vx *= -0.5; }
        if (n.y < 0) { n.y = 0; n.vy *= -0.5; }
        if (n.y > H) { n.y = H; n.vy *= -0.5; }
      });

      for (let i = 0; i < NODES.length; i++) {
        for (let j = i+1; j < NODES.length; j++) {
          const a = NODES[i], b = NODES[j];
          const dx = a.x-b.x, dy = a.y-b.y, d2 = dx*dx+dy*dy;
          if (d2 > LINK_DIST*LINK_DIST) continue;
          const d   = Math.sqrt(d2);
          const t   = 1-d/LINK_DIST;
          const exc = (a.excited+b.excited)*0.5;
          const alpha = t*0.18 + exc*0.22;
          const grad  = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          grad.addColorStop(0, `hsla(${a.hue},58%,72%,${alpha})`);
          grad.addColorStop(1, `hsla(${b.hue},58%,72%,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.6+exc*0.9;
          ctx.stroke();
        }
      }

      for (let i = PULSES.length-1; i >= 0; i--) {
        const p  = PULSES[i];
        p.t     += p.spd;
        if (p.t >= 1) {
          NODES[p.toIdx].excited = Math.min(1, NODES[p.toIdx].excited+0.8);
          if (Math.random() > 0.30) spawnPulse(p.toIdx);
          PULSES.splice(i, 1);
          continue;
        }
        const na = NODES[p.fromIdx], nb = NODES[p.toIdx];
        const px = na.x+(nb.x-na.x)*p.t;
        const py = na.y+(nb.y-na.y)*p.t;
        p.trail.push({ x:px, y:py });
        if (p.trail.length > 8) p.trail.shift();

        for (let t = 0; t < p.trail.length-1; t++) {
          const prog = t/p.trail.length;
          ctx.beginPath();
          ctx.moveTo(p.trail[t].x, p.trail[t].y);
          ctx.lineTo(p.trail[t+1].x, p.trail[t+1].y);
          ctx.strokeStyle = `hsla(${p.hue},78%,82%,${prog*0.55})`;
          ctx.lineWidth   = p.size*prog*0.7;
          ctx.stroke();
        }

        const gr = ctx.createRadialGradient(px,py,0,px,py,p.size*5);
        gr.addColorStop(0, `hsla(${p.hue},85%,92%,0.72)`);
        gr.addColorStop(1, `hsla(${p.hue},65%,65%,0)`);
        ctx.beginPath(); ctx.arc(px,py,p.size*5,0,Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();

        ctx.beginPath(); ctx.arc(px,py,p.size,0,Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},92%,95%,0.95)`; ctx.fill();
      }

      NODES.forEach(n => {
        const breath = 1+Math.sin(n.breathPhase)*0.28;
        const pr     = n.r*breath + n.excited*2.2;
        const base   = 0.10+n.excited*0.52+Math.sin(n.pulse)*0.05;

        const gr = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,pr*5.5);
        gr.addColorStop(0,   `hsla(${n.hue},72%,84%,${base+0.24})`);
        gr.addColorStop(0.4, `hsla(${n.hue},62%,64%,${base*0.30})`);
        gr.addColorStop(1,   `hsla(${n.hue},50%,50%,0)`);
        ctx.beginPath(); ctx.arc(n.x,n.y,pr*5.5,0,Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();

        ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,Math.PI*2);
        ctx.fillStyle = `hsl(${n.hue},68%,${76+n.excited*16}%)`;
        ctx.fill();
      });

      pulseTimer++;
      if (pulseTimer > 10) { pulseTimer = 0; spawnPulse(); }
      ctx.restore();
    }

    let particleTimer = 0;
    function updateDrawParticles() {
      for (let i = PARTICLES.length-1; i >= 0; i--) {
        const p  = PARTICLES[i];
        p.pulse  += p.pulseSpd;
        p.wobble += p.wobbleSpd;
        p.x      += p.vx + Math.sin(p.wobble)*0.40;
        p.y      += p.vy;
        p.vy     -= 0.009;
        p.alpha  -= p.fromClick ? 0.009 : 0.0028;

        WELLS.forEach(w => {
          const dx = w.x-p.x, dy = w.y-p.y, d = Math.hypot(dx,dy);
          if (d < 170 && d > 0) { p.x += (dx/d)*w.life; p.y += (dy/d)*w.life; }
        });

        if (p.alpha <= 0 || p.y < -20) { PARTICLES.splice(i,1); continue; }
        if (p.x < -10)   p.x = W+10;
        if (p.x > W+10)  p.x = -10;

        p.trail.push({ x:p.x, y:p.y });
        if (p.trail.length > 7) p.trail.shift();

        for (let t = 0; t < p.trail.length-1; t++) {
          const prog = t/p.trail.length;
          ctx.beginPath();
          ctx.moveTo(p.trail[t].x, p.trail[t].y);
          ctx.lineTo(p.trail[t+1].x, p.trail[t+1].y);
          ctx.strokeStyle = `hsla(${p.hue},72%,76%,${prog*p.alpha*0.32})`;
          ctx.lineWidth   = p.r*prog*0.45;
          ctx.stroke();
        }

        const glowR = p.r*(2.6+Math.sin(p.pulse)*0.85);
        const gr    = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,glowR);
        gr.addColorStop(0, `hsla(${p.hue},82%,90%,${p.alpha*0.72})`);
        gr.addColorStop(1, `hsla(${p.hue},65%,65%,0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,glowR,0,Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},78%,90%,${p.alpha})`; ctx.fill();
      }

      particleTimer++;
      if (particleTimer > 13) { particleTimer = 0; spawnParticle(); }
    }

    function updateDrawConfetti() {
      for (let i = CONFETTI.length-1; i >= 0; i--) {
        const c  = CONFETTI[i];
        c.wobble += c.wobbleSpd;
        c.x      += c.vx + Math.sin(c.wobble)*0.5;
        c.y      += c.vy;
        c.vy     += 0.018;
        c.vx     *= 0.99;
        c.rotation += c.rotSpd;
        c.opacity  -= 0.0008;

        if (c.opacity <= 0 || c.y > H+20) {
          c.x       = Math.random()*W;
          c.y       = -20;
          c.vx      = (Math.random()-0.5)*0.8;
          c.vy      = 0.5+Math.random()*1.1;
          c.opacity = 0.3+Math.random()*0.4;
          c.hue     = randH();
        }

        ctx.save();
        ctx.globalAlpha = c.opacity;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = `hsl(${c.hue},70%,68%)`;
        if (c.isCircle) {
          ctx.beginPath(); ctx.arc(0,0,c.size/2,0,Math.PI*2); ctx.fill();
        } else {
          ctx.fillRect(-c.size*0.7,-c.size*0.35,c.size*1.4,c.size*0.7);
        }
        ctx.restore();
      }
    }

    function updateDrawBalloons() {
      const t = time * 0.016;
      BALLOONS.forEach(b => {
        b.excited = Math.max(0, b.excited-0.008);
        const floatY = Math.sin(t*b.speed*Math.PI*2+b.phase)*(18+b.excited*14);
        const sway   = Math.sin(t*b.swaySpeed*Math.PI*2+b.phase)*(b.swayAmp+b.excited*8);
        const cx     = b.x*W + sway;
        const cy     = b.baseY*H + floatY;
        const es     = 1+b.excited*0.14;

        if (mx > -999) {
          const d = Math.hypot(cx-mx, cy-my);
          if (d < 120) b.excited = Math.min(1, b.excited+(120-d)/120*0.03);
        }

        ctx.beginPath();
        ctx.moveTo(cx, cy+b.ry*es);
        ctx.quadraticCurveTo(
          cx+6+Math.sin(t*0.5+b.phase)*4,
          cy+b.ry*es+b.stringLen*0.5,
          cx, cy+b.ry*es+b.stringLen
        );
        ctx.strokeStyle = `hsla(${b.hue},55%,55%,0.4)`;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.save();
        const glowR = (b.rx+b.ry)*0.65*es;
        const glow  = ctx.createRadialGradient(cx,cy,0,cx,cy,glowR*1.5);
        glow.addColorStop(0, `hsla(${b.hue},75%,80%,${0.06+b.excited*0.18})`);
        glow.addColorStop(1, `hsla(${b.hue},65%,65%,0)`);
        ctx.beginPath(); ctx.arc(cx,cy,glowR*1.5,0,Math.PI*2);
        ctx.fillStyle = glow; ctx.fill();

        ctx.globalAlpha = 0.85+b.excited*0.15;
        ctx.beginPath(); ctx.ellipse(cx,cy,b.rx*es,b.ry*es,0,0,Math.PI*2);
        ctx.fillStyle = `hsl(${b.hue},65%,60%)`; ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx-b.rx*0.28,cy-b.ry*0.28,b.rx*0.28*es,b.ry*0.22*es,-0.4,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.26+b.excited*0.14})`; ctx.fill();

        ctx.beginPath(); ctx.ellipse(cx,cy+b.ry*es,5,4,0,0,Math.PI*2);
        ctx.fillStyle = `hsl(${b.hue},60%,46%)`; ctx.fill();

        ctx.restore();
      });
    }

    function pathGeo(g: BGeo, scale = 1) {
      const s = g.size*scale;
      ctx.beginPath();
      if (g.type === 'diamond') {
        ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0); ctx.closePath();
      } else if (g.type === 'star') {
        for (let i = 0; i < 10; i++) {
          const ang = (i*Math.PI)/5 - Math.PI/2;
          const r   = i%2===0 ? s : s*0.45;
          if (i===0) ctx.moveTo(Math.cos(ang)*r, Math.sin(ang)*r);
          else       ctx.lineTo(Math.cos(ang)*r, Math.sin(ang)*r);
        }
        ctx.closePath();
      } else if (g.type === 'heart') {
        ctx.moveTo(0, s*0.4);
        ctx.bezierCurveTo(-s,-s*0.3,-s*0.5,-s,0,-s*0.4);
        ctx.bezierCurveTo( s*0.5,-s, s,-s*0.3,0, s*0.4);
        ctx.closePath();
      } else {
        ctx.arc(0,0,s,0,Math.PI*2);
      }
    }

    function updateDrawGeos() {
      GEOS.forEach((g, idx) => {
        g.pulse   += g.pulseSpd;
        g.wobble  += g.wobbleSpd;
        g.rot     += g.rotSpd;
        g.x       += g.vx + Math.sin(g.wobble)*0.24;
        g.y       += g.vy;

        WELLS.forEach(w => {
          const dx = w.x-g.x, dy = w.y-g.y, d = Math.hypot(dx,dy);
          if (d < 160 && d > 0) { g.x += (dx/d)*w.life*0.9; g.y += (dy/d)*w.life*0.9; }
        });

        if (g.y < -35) GEOS[idx] = makeGeo(false);
        if (g.x < -25) g.x = W+25;
        if (g.x > W+25) g.x = -25;

        const a = g.alpha*(0.78+Math.sin(g.pulse)*0.22);
        ctx.save();
        ctx.translate(g.x, g.y); ctx.rotate(g.rot);

        const gr = ctx.createRadialGradient(0,0,0,0,0,g.size*3.5);
        gr.addColorStop(0, `hsla(${g.hue},72%,82%,${a*0.55})`);
        gr.addColorStop(1, `hsla(${g.hue},55%,60%,0)`);
        pathGeo(g, 1.6); ctx.fillStyle = gr; ctx.fill();

        pathGeo(g, 1);
        ctx.strokeStyle = `hsla(${g.hue},66%,80%,${a})`;
        ctx.lineWidth   = 0.85; ctx.stroke();

        ctx.restore();
      });
    }

    function drawCakeMandala() {
      const cx   = W*0.72, cy = H*0.47;
      const maxR = Math.min(W,H)*0.22;
      const rot  = time*0.00018;

      ctx.save(); ctx.translate(cx, cy);

      const rings = [
        { r:maxR*0.10, pts:5,  hue:42, a:0.10 },
        { r:maxR*0.22, pts:8,  hue:14, a:0.08 },
        { r:maxR*0.36, pts:12, hue:38, a:0.06 },
        { r:maxR*0.52, pts:16, hue:18, a:0.04 },
        { r:maxR*0.68, pts:20, hue:8,  a:0.025 },
      ];

      rings.forEach((ring, ri) => {
        ctx.save();
        ctx.rotate(rot*(ri%2===0 ? 1 : -1.3)*(ri+1));
        for (let p = 0; p < ring.pts; p++) {
          const angle = (p/ring.pts)*Math.PI*2;
          const px    = Math.cos(angle)*ring.r;
          const py    = Math.sin(angle)*ring.r;

          ctx.save(); ctx.translate(px,py); ctx.rotate(angle+Math.PI/4);
          const s  = 3+ri*0.55;
          const gr = ctx.createRadialGradient(0,0,0,0,0,s*2.8);
          gr.addColorStop(0, `hsla(${ring.hue},74%,84%,${ring.a*2.4})`);
          gr.addColorStop(1, `hsla(${ring.hue},60%,60%,0)`);
          ctx.beginPath();
          ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0);
          ctx.closePath(); ctx.fillStyle = gr; ctx.fill();
          ctx.restore();

          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(px,py);
          ctx.strokeStyle = `hsla(${ring.hue},55%,70%,${ring.a*0.40})`;
          ctx.lineWidth   = 0.4; ctx.stroke();
        }
        ctx.restore();
      });

      const flicker = Math.sin(time*0.08)*0.12;
      const cg      = ctx.createRadialGradient(0,0,0,0,0,maxR*0.065);
      cg.addColorStop(0,   `hsla(42,92%,${90+flicker*8}%,0.82)`);
      cg.addColorStop(0.5, `hsla(35,80%,74%,0.36)`);
      cg.addColorStop(1,   `hsla(30,65%,56%,0)`);
      ctx.beginPath(); ctx.arc(0,0,maxR*0.065,0,Math.PI*2);
      ctx.fillStyle = cg; ctx.fill();

      ctx.restore();
    }

    function updateDrawRipples() {
      for (let i = RIPPLES.length-1; i >= 0; i--) {
        const rp = RIPPLES[i];
        if (rp.delay > 0) { rp.delay--; continue; }
        rp.r    += (rp.maxR-rp.r)*0.06+1.2;
        rp.life -= 0.015;
        if (rp.life <= 0) { RIPPLES.splice(i,1); continue; }

        ctx.beginPath(); ctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);
        ctx.strokeStyle = `hsla(${rp.hue},66%,74%,${rp.life*0.44})`;
        ctx.lineWidth   = 1.8*rp.life; ctx.stroke();

        const dr = rp.r*0.68;
        ctx.save(); ctx.translate(rp.x,rp.y); ctx.rotate(Math.PI/4+rp.life*0.5);
        ctx.beginPath();
        ctx.moveTo(0,-dr); ctx.lineTo(dr,0); ctx.lineTo(0,dr); ctx.lineTo(-dr,0);
        ctx.closePath();
        ctx.strokeStyle = `hsla(${rp.hue},72%,82%,${rp.life*0.22})`;
        ctx.lineWidth   = 0.9*rp.life; ctx.stroke();
        ctx.restore();
      }
    }

    function updateDrawBlooms() {
      for (let i = BLOOMS.length-1; i >= 0; i--) {
        const bl = BLOOMS[i];
        bl.r    += (bl.maxR-bl.r)*0.068;
        bl.life -= 0.009;
        bl.rot  += 0.010;
        if (bl.life <= 0) { BLOOMS.splice(i,1); continue; }

        ctx.save(); ctx.translate(bl.x,bl.y);
        ctx.globalAlpha = bl.life*0.58;

        for (let p = 0; p < bl.petals; p++) {
          const angle = (p/bl.petals)*Math.PI*2+bl.rot;
          const px    = Math.cos(angle)*bl.r, py = Math.sin(angle)*bl.r;
          ctx.save(); ctx.translate(px,py); ctx.rotate(angle+Math.PI/4);
          const ps = 8+bl.r*0.16;
          const gr = ctx.createRadialGradient(0,0,0,0,0,ps*1.6);
          gr.addColorStop(0, `hsla(${bl.hue},82%,90%,0.90)`);
          gr.addColorStop(1, `hsla(${bl.hue},65%,66%,0)`);
          ctx.beginPath();
          ctx.moveTo(0,-ps); ctx.lineTo(ps*0.72,0);
          ctx.lineTo(0,ps);  ctx.lineTo(-ps*0.72,0);
          ctx.closePath(); ctx.fillStyle = gr; ctx.fill();
          ctx.restore();
        }

        const cg = ctx.createRadialGradient(0,0,0,0,0,10);
        cg.addColorStop(0, `hsla(${bl.hue+8},92%,96%,0.96)`);
        cg.addColorStop(1, `hsla(${bl.hue},70%,70%,0)`);
        ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2);
        ctx.fillStyle = cg; ctx.fill();
        ctx.restore();
      }
    }

    function updateDrawShockwaves() {
      for (let i = SHOCKWAVES.length-1; i >= 0; i--) {
        const sw = SHOCKWAVES[i];
        sw.r    += 17; sw.life -= 0.034;
        if (sw.life <= 0) { SHOCKWAVES.splice(i,1); continue; }
        const gr = ctx.createRadialGradient(sw.x,sw.y,sw.r-10,sw.x,sw.y,sw.r+10);
        gr.addColorStop(0,   `hsla(${sw.hue},72%,80%,0)`);
        gr.addColorStop(0.5, `hsla(${sw.hue},78%,77%,${sw.life*0.36})`);
        gr.addColorStop(1,   `hsla(${sw.hue},72%,80%,0)`);
        ctx.beginPath(); ctx.arc(sw.x,sw.y,sw.r,0,Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();
      }
    }

    function updateDrawWells() {
      for (let i = WELLS.length-1; i >= 0; i--) {
        const w = WELLS[i];
        w.life -= 0.005;
        if (w.life <= 0) { WELLS.splice(i,1); continue; }
        const gr = ctx.createRadialGradient(w.x,w.y,0,w.x,w.y,80*w.life);
        gr.addColorStop(0, `hsla(${w.hue},70%,82%,${w.life*0.10})`);
        gr.addColorStop(1, `hsla(${w.hue},55%,66%,0)`);
        ctx.beginPath(); ctx.arc(w.x,w.y,80*w.life,0,Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();
      }
    }

    function drawCornerOrnaments() {
      const s    = 34, pad = 22;
      const wave = 0.5+Math.sin(time*0.012)*0.5;
      const corners: [number,number,number][] = [
        [pad,     pad,     0],
        [W-pad,   pad,     Math.PI/2],
        [W-pad,   H-pad,   Math.PI],
        [pad,     H-pad,   Math.PI*1.5],
      ];
      corners.forEach(([cx,cy,rot]) => {
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(rot);
        ctx.globalAlpha = 0.14+wave*0.10;
        ctx.strokeStyle = `hsla(14,60%,65%,1)`;
        ctx.lineWidth   = 0.85;
        ctx.beginPath(); ctx.moveTo(0,s); ctx.lineTo(0,0); ctx.lineTo(s,0); ctx.stroke();
        [s*0.35, s*0.65].forEach(p => {
          ctx.beginPath(); ctx.moveTo(0,p); ctx.lineTo(3,p); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p,0); ctx.lineTo(p,3); ctx.stroke();
        });
        const ds = 4.5;
        ctx.beginPath();
        ctx.moveTo(0,-ds); ctx.lineTo(ds,0); ctx.lineTo(0,ds); ctx.lineTo(-ds,0);
        ctx.closePath();
        ctx.fillStyle = `hsla(42,74%,72%,${0.52+wave*0.44})`; ctx.fill();
        ctx.restore();
      });
    }

    let sparkTimer = 0;
    function updateMouseSparkle() {
      sparkTimer++;
      if (mx > -999 && sparkTimer > 28) {
        sparkTimer = 0;
        spawnParticle(mx+(Math.random()-0.5)*36, my+(Math.random()-0.5)*36, false);
      }
    }

    function loop() {
      time++;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W*0.6, H);
      bg.addColorStop(0,    '#1f1410');
      bg.addColorStop(0.45, '#3a1f14');
      bg.addColorStop(1,    '#2d1209');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const radGlow = ctx.createRadialGradient(W*0.72,H*0.45,0,W*0.72,H*0.45,W*0.45);
      radGlow.addColorStop(0,   'rgba(212,133,106,0.20)');
      radGlow.addColorStop(0.5, 'rgba(180,100,80,0.10)');
      radGlow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = radGlow; ctx.fillRect(0,0,W,H);

      const goldGlow = ctx.createRadialGradient(W*0.72,H*0.38,0,W*0.72,H*0.38,W*0.22);
      goldGlow.addColorStop(0, 'rgba(240,200,120,0.22)');
      goldGlow.addColorStop(1, 'rgba(240,200,120,0)');
      ctx.fillStyle = goldGlow; ctx.fillRect(0,0,W,H);

      drawAurora();
      updateDrawNetwork();
      drawCakeMandala();
      updateDrawGeos();
      updateDrawBalloons();
      updateMouseSparkle();
      updateDrawParticles();
      updateDrawConfetti();
      updateDrawWells();
      updateDrawShockwaves();
      updateDrawBlooms();
      updateDrawRipples();
      drawCornerOrnaments();

      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener('mousemove',  onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click',      onClick);
    };
  }, []);
}

// ─── Tilt Hook ───────────────────────────────────────────────────────────────
function useTilt(strength = 10) {
  const ref      = useRef<HTMLDivElement>(null);
  const rotateX  = useMotionValue(0);
  const rotateY  = useMotionValue(0);
  const cfg      = { stiffness: 200, damping: 22, mass: 0.6 };
  const springX  = useSpring(rotateX, cfg);
  const springY  = useSpring(rotateY, cfg);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    const dx = (e.clientX-(r.left+r.width/2))  / (r.width/2);
    const dy = (e.clientY-(r.top +r.height/2)) / (r.height/2);
    rotateY.set(dx*strength);
    rotateX.set(-dy*strength);
  }, [strength, rotateX, rotateY]);

  const onMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

// ─── Constants ───────────────────────────────────────────────────────────────
const EASE        = [0.22, 1, 0.36, 1] as [number, number, number, number];
const ACCENT      = '#d4856a';
const ACCENT_DARK = '#1f1410';
const ACCENT_BG   = '#fdf6f3';

const vFadeUp: Variants = {
  hidden: { opacity:0, y:44 },
  show:   { opacity:1, y:0, transition:{ duration:0.75, ease:EASE } },
};
const vStagger: Variants = {
  hidden: {},
  show:   { transition:{ staggerChildren:0.13 } },
};
const vScaleIn: Variants = {
  hidden: { opacity:0, scale:0.6, rotateX:-55 },
  show:   { opacity:1, scale:1,   rotateX:0, transition:{ duration:0.95, ease:EASE } },
};
const vSlideLeft: Variants = {
  hidden: { opacity:0, x:-48 },
  show:   { opacity:1, x:0,  transition:{ duration:0.8, ease:EASE } },
};
const vSlideRight: Variants = {
  hidden: { opacity:0, x:48 },
  show:   { opacity:1, x:0, transition:{ duration:0.8, ease:EASE } },
};

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { name:'Celebration Hamper',   sub:'Starting at ₹1,499', tag:'Bestseller',   img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
  { name:'Sweet Indulgence Box', sub:'Starting at ₹999',   tag:'Customizable', img:'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80' },
  { name:'Luxury Candle Set',    sub:'Starting at ₹1,199', tag:'Eco-friendly',  img:'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80' },
];

const CATEGORIES = [
  { name:'Personalised Keepsakes',   desc:'Engraved photo frames, custom journals, and memory boxes that turn milestones into treasures.', accent:ACCENT,     tag:'Personal', img:'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80' },
  { name:'Gourmet Celebration Kits', desc:'Artisan chocolates, premium teas, and handcrafted sweets curated for joyful indulgence.',       accent:'#c4735d',  tag:'Gourmet',  img:'https://khoyamithai.com/cdn/shop/files/47_14e6fbe7-2b44-400b-ac85-dfea01b2291a.jpg?v=1758631902&width=3003' },
  { name:'Pampering Wellness Sets',  desc:'Luxurious bath salts, aromatherapy candles, and skin-care treats for a day of self-love.',      accent:'#a0617a',  tag:'Wellness', img:'https://m.media-amazon.com/images/I/810qdrjodjL._AC_UF350%2C350_QL80_.jpg' },
];

const CUSTOM_ITEMS = [
  { icon:'🎂', title:'Name & Date Engraving',  desc:'Personalised messages laser-etched on premium products.' },
  { icon:'🎀', title:'Signature Gift Wrapping', desc:'Bespoke ribbons, tissue paper, and branded gift tags.' },
  { icon:'📸', title:'Photo Personalisation',   desc:'Custom photo prints incorporated into hamper packaging.' },
  { icon:'🎨', title:'Theme Curation',          desc:'Color palettes and products aligned to birthday themes.' },
];

const WHY = [
  { icon:'🎁', title:'Joyful Curation',    desc:'Every item handpicked to spark delight and celebration.' },
  { icon:'◈',  title:'Bulk Ordering',      desc:'Efficient fulfillment for 10 to 10,000 birthday gifts.' },
  { icon:'◎',  title:'Pan-India Delivery', desc:'On-time delivery to every corner of India.' },
  { icon:'✦',  title:'Custom Branding',    desc:'Seamless integration of your brand on every gift.' },
  { icon:'◐',  title:'Dedicated Support',  desc:'Expert gift consultants available at every step.' },
];

// ─── Navigation ──────────────────────────────────────────────────────────────
function useNavigateTo() {
  return useCallback((path: string) => { window.location.href = path; }, []);
}

// ─── Animated Stat ────────────────────────────────────────────────────────────
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className="flex flex-col"
    >
      <span className="font-serif text-white" style={{ fontSize: 'clamp(1.4rem,2.2vw,2rem)', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {value}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, marginTop: 4 }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ item }: { item: typeof CATEGORIES[0] }) {
  const [hovered, setHovered] = useState(false);
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt(12);
  return (
    <motion.div variants={vScaleIn}
      style={{ perspective:'1400px', transformStyle:'preserve-3d' }}
      className="cursor-pointer">
      <motion.div ref={ref} onMouseMove={onMouseMove}
        onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX:springX, rotateY:springY,
          transformStyle:'preserve-3d', willChange:'transform',
          boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
          transition:'box-shadow 0.4s', borderRadius:16, overflow:'hidden', background:'white',
        }}>
        <div style={{ height:280, overflow:'hidden', position:'relative' }}>
          <motion.img src={item.img} alt={item.name} className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration:0.75, ease:EASE }} style={{ willChange:'transform' }} />
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor:item.accent }}
            animate={{ opacity: hovered ? 0.16 : 0 }} transition={{ duration:0.4 }} />
          <motion.span
            animate={{ y: hovered ? 0 : -24, opacity: hovered ? 1 : 0 }}
            transition={{ type:'spring', stiffness:320, damping:22 }}
            className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
            style={{ backgroundColor:item.accent }}>
            {item.tag}
          </motion.span>
        </div>
        <div className="p-7 relative overflow-hidden">
          <motion.div className="absolute bottom-0 left-0 h-[3px]"
            style={{ backgroundColor:item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }}
            transition={{ duration:0.45, ease:EASE }} />
          <h3 className="font-serif text-2xl mb-2" style={{ color:ACCENT_DARK }}>{item.name}</h3>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color:'#73736e' }}>{item.desc}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color:ACCENT_DARK }}>
            <motion.span animate={{ x: hovered ? 3 : 0 }}
              transition={{ type:'spring', stiffness:400, damping:20 }}>View Collection</motion.span>
            <motion.span animate={{ rotate: hovered ? 45 : 0, x: hovered ? 2 : 0 }}
              transition={{ type:'spring', stiffness:380, damping:18 }} style={{ display:'inline-flex' }}>
              <ArrowRight size={11} />
            </motion.span>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.06)', borderRadius:16 }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ item, index }: { item: typeof PRODUCTS[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:false, amount:0.2 });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:44 }}
      animate={inView ? { opacity:1, y:0 } : { opacity:0, y:44 }}
      transition={{ duration:0.7, delay:index*0.12, ease:EASE }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="cursor-pointer" style={{ minWidth:360, scrollSnapAlign:'start' }}>
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio:'1', borderRadius:16 }}>
        <motion.img src={item.img} alt={item.name} className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration:0.65, ease:EASE }} style={{ willChange:'transform' }} />
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase text-white px-4 py-1 rounded-full"
          style={{ background:'rgba(212,133,106,0.85)', backdropFilter:'blur(6px)', letterSpacing:2 }}>
          {item.tag}
        </span>
      </div>
      <h4 className="font-serif text-xl mb-1" style={{ color:ACCENT_DARK }}>{item.name}</h4>
      <p className="text-sm font-light" style={{ color:ACCENT }}>{item.sub}</p>
    </motion.div>
  );
}

// ─── Why Card ─────────────────────────────────────────────────────────────────
function WhyCard({ item, index }: { item: typeof WHY[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:false, amount:0.3 });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:36 }}
      animate={inView ? { opacity:1, y:0 } : { opacity:0, y:36 }}
      transition={{ duration:0.7, delay:index*0.1, ease:EASE }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="text-center p-6 cursor-pointer">
      <motion.div className="flex items-center justify-center mx-auto mb-5 rounded-full text-3xl"
        style={{ width:64, height:64 }}
        animate={{ background: hovered ? ACCENT : '#f3ede9', color: hovered ? 'white' : ACCENT_DARK }}
        transition={{ duration:0.3 }}>
        {item.icon}
      </motion.div>
      <h4 className="font-bold text-xs uppercase tracking-widest mb-2">{item.title}</h4>
      <p className="text-xs font-light leading-relaxed" style={{ color:'#73736e' }}>{item.desc}</p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function BirthdayGifting() {
  const navigateTo = useNavigateTo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const textY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springTxt   = useSpring(textY, { stiffness: 80, damping: 25 });

  useBirthdayCanvas(canvasRef, heroRef);

  const { ref: aRef, springX: aX, springY: aY, onMouseMove: aMM, onMouseLeave: aML } = useTilt(6);

  const aboutRef = useRef<HTMLElement>(null);
  const catRef   = useRef<HTMLElement>(null);
  const custRef  = useRef<HTMLElement>(null);
  const ctaRef   = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 });
  const catInView   = useInView(catRef,   { once: false, amount: 0.15 });
  const custInView  = useInView(custRef,  { once: false, amount: 0.15 });
  const ctaInView   = useInView(ctaRef,   { once: false, amount: 0.3 });

  const [ctaHovered, setCtaHovered] = useState(false);

  // Cycling words
  const words = ['Celebrate', 'Cherish', 'Delight', 'Surprise'];
  const [wIdx, setWIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWIdx(p => (p + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ background: ACCENT_BG, fontFamily: 'inherit' }}>

      {/* ══ HERO ══ */}
{/* ══ HERO ══ */}
<section
  ref={heroRef}
  className="relative flex items-center overflow-hidden"
  style={{ minHeight: '100vh' }}
>
  {/* Canvas */}
  <canvas ref={canvasRef} style={{
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    display: 'block', zIndex: 1,
    pointerEvents: 'all',
  }} />

  {/* Left vignette */}
  <div className="absolute inset-0 pointer-events-none" style={{
    background: 'linear-gradient(100deg,rgba(15,8,4,0.78) 0%,rgba(15,8,4,0.48) 38%,rgba(15,8,4,0.10) 62%,transparent 100%)',
    zIndex: 2,
  }} />

  {/* Bottom fade */}
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
    height: 160,
    background: 'linear-gradient(to top,rgba(31,20,16,0.60) 0%,transparent 100%)',
    zIndex: 2,
  }} />

  {/* Top-right click hint */}
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    transition={{ delay: 2.6, duration: 1.2 }}
    className="absolute top-7 right-10 pointer-events-none flex items-center gap-2"
    style={{ zIndex: 10 }}
  >
    <motion.span
      animate={{ scale: [1, 1.4, 1], opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontSize: '0.9rem' }}
    >🎂</motion.span>
    <span style={{
      color: 'rgba(255,255,255,0.25)', fontSize: 8,
      textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 700,
    }}>Click anywhere to celebrate</span>
  </motion.div>

  {/* ── TEXT PANEL ── */}
  <motion.div
    style={{ y: springTxt, opacity: heroOpacity, willChange: 'transform', zIndex: 10 }}
    className="relative w-full pointer-events-none"
  >
    {/* 
      ✅ FIX: pt-24 md:pt-28 — navbar height ke barabar padding-top diya
      Agar navbar fixed hai aur height ~64-72px hai toh pt-20 ya pt-24 use karo
      Agar navbar 80px hai toh pt-24 ya pt-28 use karo — apne navbar height ke hisaab se adjust karo
    */}
    <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pt-24 md:pt-28 pb-16 md:min-h-screen flex flex-col justify-center">
      <div className="max-w-xl lg:max-w-2xl">

        {/* ── Eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          className="flex items-center gap-3 mb-7"
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(212,133,106,0.15)',
            border: '1px solid rgba(212,133,106,0.35)',
            borderRadius: 100,
            padding: '5px 14px 5px 10px',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.span
              animate={{ rotate: [0, 12, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '0.78rem' }}
            >🎂</motion.span>
            <span style={{
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.28em',
              fontWeight: 700, color: 'rgba(255,255,255,0.60)',
            }}>Corporate Birthday Solutions</span>
          </span>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
            style={{ height: 1, flex: 1, maxWidth: 48, background: 'linear-gradient(to right,#b5a26a,transparent)', originX: 0 }}
          />
        </motion.div>

        {/* ── Cycling micro-label ── */}
        <div style={{ height: 22, overflow: 'hidden', marginBottom: 12 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={wIdx}
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -22, opacity: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              style={{
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.44em',
                fontWeight: 800, color: ACCENT,
              }}
            >— {words[wIdx]} Every Moment —</motion.p>
          </AnimatePresence>
        </div>

        {/* ── Main Heading ── */}
        <h1
          className="font-serif text-white"
          style={{ fontSize: 'clamp(2.8rem,5.5vw,5rem)', lineHeight: 1.06, marginBottom: 0 }}
        >
          <motion.span
            style={{ display: 'block' }}
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.042, delayChildren: 0.28 } } }}
          >
            {'Birthday'.split('').map((ch, i) => (
              <motion.span key={i}
                variants={{
                  hidden: { opacity: 0, y: 36, rotateX: -55 },
                  show:   { opacity: 1, y: 0,  rotateX: 0, transition: { duration: 0.52, ease: EASE } },
                }}
                style={{ display: 'inline-block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
              >{ch}</motion.span>
            ))}
          </motion.span>

          <motion.span
            style={{ display: 'block' }}
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.048, delayChildren: 0.55 } } }}
          >
            {'Gifting'.split('').map((ch, i) => (
              <motion.span key={i}
                variants={{
                  hidden: { opacity: 0, y: 36, rotateX: -55 },
                  show:   { opacity: 1, y: 0,  rotateX: 0, transition: { duration: 0.52, ease: EASE } },
                }}
                style={{ display: 'inline-block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
              >{ch}</motion.span>
            ))}
          </motion.span>

          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
            style={{ display: 'block', fontStyle: 'italic', fontWeight: 400, color: ACCENT }}
          >Solutions.</motion.span>
        </h1>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 1.25, ease: EASE }}
          style={{
            height: 1.5, width: 100,
            background: `linear-gradient(to right,${ACCENT},transparent)`,
            originX: 0, marginTop: 22, marginBottom: 18,
          }}
        />

        {/* ── Subheading ── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 1.35, ease: EASE }}
          className="font-light leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.95rem,1.4vw,1.15rem)', maxWidth: 420 }}
        >
          Make every birthday feel extraordinary with personalised, sustainable gifts
          your team and clients will cherish for years.
        </motion.p>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 1.55, ease: EASE }}
          className="flex items-stretch gap-8 mt-9 mb-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}
        >
          <AnimatedStat value="10K+"      label="Happy Clients"     delay={1.65} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)', alignSelf: 'stretch' }} />
          <AnimatedStat value="50+"       label="Gift Collections"  delay={1.78} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.10)', alignSelf: 'stretch' }} />
          <AnimatedStat value="Pan-India" label="Delivery"          delay={1.90} />
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.80, ease: EASE }}
          className="flex gap-4 flex-wrap"
          style={{ pointerEvents: 'all' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: `0 16px 38px rgba(212,133,106,0.52)` }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="flex items-center gap-2 font-bold uppercase tracking-widest text-white"
            style={{
              fontSize: 10, padding: '14px 30px',
              background: ACCENT, border: 'none', borderRadius: 100,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: `0 8px 28px rgba(212,133,106,0.38)`,
              letterSpacing: '0.16em',
            }}
          >
            <motion.span
              animate={{ rotate: [0, 14, -7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '0.9rem' }}
            >🎁</motion.span>
            Explore Birthday Gifts
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -2, background: 'rgba(255,255,255,0.07)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigateTo('/contact')}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="font-bold uppercase tracking-widest text-white"
            style={{
              fontSize: 10, padding: '14px 28px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '0.16em',
            }}
          >Request Quote</motion.button>
        </motion.div>

      </div>
    </div>
  </motion.div>

  {/* ── Scroll indicator ── */}
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    transition={{ delay: 2.3, duration: 0.9 }}
    className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
    style={{ zIndex: 10 }}
  >
    <motion.span
      animate={{ opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 2.2, repeat: Infinity }}
      style={{ fontSize: 7, textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}
    >Scroll</motion.span>
    <motion.div
      animate={{ y: [0, 9, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 1, height: 30, background: `linear-gradient(to bottom,${ACCENT},transparent)` }}
    />
  </motion.div>
</section>

      {/* ══ ABOUT ══ */}
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden"
        style={{ background: ACCENT_BG }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={vStagger} initial="hidden" animate={aboutInView ? 'show' : 'hidden'}>
            <motion.div variants={vFadeUp}>
              <motion.div initial={{ scaleX: 0 }} animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ originX: 0, height: 3, width: 80, background: ACCENT, marginBottom: 24 }} />
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: ACCENT }}>
                Our Philosophy
              </p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-8" style={{ color: ACCENT_DARK }}>
              The Joy of Making<br />Someone Feel Special
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-5" style={{ color: '#73736e' }}>
              Birthdays are not just dates on a calendar — they are an opportunity to pause,
              celebrate, and show your team members and clients how much they mean to you.
            </motion.p>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-10" style={{ color: '#73736e' }}>
              We take the guesswork out of corporate birthday gifting with sustainably curated
              hampers, personalised keepsakes, and gourmet indulgences.
            </motion.p>
            <motion.div variants={vFadeUp} className="flex items-center gap-4 pt-8"
              style={{ borderTop: '1px solid #f0d8cf' }}>
              <div className="flex items-center justify-center rounded-full text-2xl flex-shrink-0"
                style={{ width: 48, height: 48, background: '#f5ddd5' }}>🎂</div>
              <p className="font-semibold text-sm" style={{ color: ACCENT }}>
                100% Personalised — No Two Gifts Alike
              </p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.85 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.85, ease: EASE }} style={{ perspective: '1200px' }}>
            <motion.div ref={aRef} onMouseMove={aMM} onMouseLeave={aML}
              style={{ rotateX: aX, rotateY: aY, transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&q=80"
                alt="Birthday Gifting" className="w-full rounded-2xl shadow-2xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden"
        style={{ background: '#f5ede9' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }}
            animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-5xl font-serif mb-4" style={{ color: ACCENT_DARK }}>
              Curated Birthday Collections
            </h2>
            <p className="font-light text-sm max-w-lg mx-auto" style={{ color: '#73736e' }}>
              Explore our themed collections designed to make every birthday celebration truly memorable.
            </p>
          </motion.div>
          <motion.div variants={vStagger} initial="hidden" animate={catInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1600px' }}>
            {CATEGORIES.map(item => <CategoryCard key={item.name} item={item} />)}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: ACCENT_BG }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-serif mb-2" style={{ color: ACCENT_DARK }}>Featured Birthday Products</h2>
              <p className="font-light" style={{ color: '#73736e' }}>
                The most-loved additions to our corporate birthday programs.
              </p>
            </div>
            <motion.a whileHover={{ y: -1 }}
              className="font-bold text-xs uppercase tracking-widest border-b-2 pb-1 cursor-pointer"
              style={{ borderColor: ACCENT, color: ACCENT_DARK }}>View All</motion.a>
          </motion.div>
          <div className="flex gap-6 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {PRODUCTS.map((p, i) => <ProductCard key={p.name} item={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ CUSTOMIZATION ══ */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden"
        style={{ background: '#1f1410' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={vSlideLeft} initial="hidden" animate={custInView ? 'show' : 'hidden'}>
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-white/60 mb-4">Personalisation</p>
            <h2 className="text-5xl font-serif text-white leading-tight mb-6">
              Tailored to Every<br />
              <span style={{ color: '#f0a891', fontStyle: 'italic', fontWeight: 400 }}>Birthday Personality</span>
            </h2>
            <p className="text-lg font-light leading-relaxed mb-12" style={{ color: 'rgba(212,212,212,0.7)' }}>
              From the minimalist who appreciates subtle elegance to the one who loves a grand
              celebration — we craft birthday gifts that mirror their personality perfectly.
            </p>
            <motion.div variants={vStagger} initial="hidden" animate={custInView ? 'show' : 'hidden'}
              className="grid grid-cols-2 gap-8">
              {CUSTOM_ITEMS.map(item => (
                <motion.div key={item.title} variants={vFadeUp} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center text-lg rounded-lg"
                    style={{ width: 40, height: 40, border: '1px solid rgba(240,168,145,0.3)', color: '#f0a891' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm mb-1">{item.title}</h5>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(212,212,212,0.6)' }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={vSlideRight} initial="hidden" animate={custInView ? 'show' : 'hidden'}
            style={{ position: 'relative' }}>
            <div className="absolute inset-0 rounded-3xl opacity-50"
              style={{ background: ACCENT, transform: 'rotate(3deg) scale(0.95)' }} />
            <div className="relative rounded-3xl overflow-hidden p-6" style={{ background: '#f5ede9' }}>
              <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80"
                alt="Custom Birthday Gift" className="w-full rounded-2xl shadow-xl"
                style={{ aspectRatio: '1', objectFit: 'cover' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ WHY ══ */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-5xl font-serif" style={{ color: ACCENT_DARK }}>Why Choose Ecotwist</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ TRUST ══ */}
      <section className="py-14 px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold mb-10"
            style={{ color: '#a6a6a1' }}>
            Trusted by Visionary Brands
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }}
            viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-16">
            {['Aether', 'Solace', 'Lumina', 'Vantage', 'Noir'].map(b => (
              <span key={b} className="font-serif text-xl font-bold"
                style={{ color: '#4d4941', letterSpacing: -0.5 }}>{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section ref={ctaRef} className="py-32 px-8 text-center" style={{ background: '#f5ede9' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ color: ACCENT_DARK }}>
            Ready to make every<br />
            <span className="italic font-normal">birthday unforgettable?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl font-light leading-relaxed mb-12" style={{ color: '#73736e' }}>
            Let's create personalised birthday experiences your team will talk about all year long.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.06, y: -3, boxShadow: `0 18px 40px rgba(212,133,106,0.35)` }}
              onClick={() => navigateTo('/configurator')} whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-[0.2em] text-xs px-14 py-6 rounded-full shadow-xl"
              style={{ background: ACCENT, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Get Started
            </motion.button>
            <motion.button whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => navigateTo('/contact')}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="font-bold uppercase tracking-[0.2em] text-xs pb-1"
              style={{
                background: 'transparent', border: 'none',
                borderBottom: `2px solid ${ctaHovered ? ACCENT : 'rgba(212,133,106,0.3)'}`,
                cursor: 'pointer', fontFamily: 'inherit', color: ACCENT_DARK,
                transition: 'border-bottom-color 0.25s',
              }}>
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}