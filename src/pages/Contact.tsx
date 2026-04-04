import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useAnimationFrame, useInView, useTransform, animate } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* ── HOOKS (identical to Home) ── */
function useTilt(strength = 12) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rotateY.set(dx * strength); rotateX.set(-dy * strength);
    glareX.set(50 + dx * 30); glareY.set(50 + dy * 30);
  }, [strength, rotateX, rotateY, glareX, glareY]);
  const onMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0); glareX.set(50); glareY.set(50);
  }, [rotateX, rotateY, glareX, glareY]);
  return { ref, springX, springY, glareX, glareY, onMouseMove, onMouseLeave };
}

function useFloat(amplitude = 10, speed = 0.0008) {
  const y = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  useAnimationFrame((t) => {
    y.set(Math.sin(t * speed) * amplitude);
    rotateZ.set(Math.sin(t * speed * 0.6) * 0.4);
  });
  return { y, rotateZ };
}

function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 28 });
  const springY = useSpring(y, { stiffness: 350, damping: 28 });
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }, [strength, x, y]);
  const onMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

/* ── PARTICLE TRAIL (identical to Home) ── */
function ParticleTrail() {
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);
  const handleMouseMove = useCallback((e) => {
    const id = idRef.current++;
    setParticles(prev => [...prev.slice(-18), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 700);
  }, []);
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id}
          initial={{ x: p.x - 4, y: p.y - 4, scale: 1, opacity: 0.55 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ position: 'fixed', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#b5a26a', top: 0, left: 0 }}
        />
      ))}
    </div>
  );
}

/* ── ANIMATED COUNTER (identical to Home) ── */
function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [displayed, setDisplayed] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const prefix = value.match(/^[^0-9]*/)[0];
  const postfix = value.match(/[^0-9]*$/)[0];
  useEffect(() => {
    if (!isInView) { setDisplayed(0); return; }
    const controls = animate(0, numericValue, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: v => setDisplayed(Math.floor(v)) });
    return controls.stop;
  }, [isInView, numericValue]);
  return <span ref={ref}>{prefix}{displayed.toLocaleString()}{postfix}</span>;
}

/* ── CRASH-LAND IMAGE CARD (BundleCard warp system from Home) ── */
function LandingImageCard({ src, label, tag, accent, fromLeft = true }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.25 });
  const [phase, setPhase] = useState('hidden');
  const [shockwave, setShockwave] = useState(false);
  const [scanLine, setScanLine] = useState(false);
  const { ref: tiltRef, springX, springY, onMouseMove, onMouseLeave } = useTilt(6);

  useEffect(() => {
    if (isInView && phase === 'hidden') {
      setPhase('warping');
      const t1 = setTimeout(() => { setShockwave(true); setScanLine(true); setPhase('landed'); }, 820);
      const t2 = setTimeout(() => setShockwave(false), 1220);
      const t3 = setTimeout(() => { setScanLine(false); setPhase('settled'); }, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (!isInView) { setPhase('hidden'); setShockwave(false); setScanLine(false); }
  }, [isInView]);

  const isVisible = phase !== 'hidden';

  return (
    <div ref={cardRef} style={{ perspective: '1400px', position: 'relative' }}>
      {shockwave && (<>
        <motion.div initial={{ scale: 0.8, opacity: 0.8 }} animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, borderRadius: 4, zIndex: 40, pointerEvents: 'none', border: '2.5px solid rgba(181,162,106,0.7)' }} />
        <motion.div initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, borderRadius: 4, zIndex: 39, pointerEvents: 'none', border: '1.5px solid rgba(181,162,106,0.5)' }} />
      </>)}
      {phase === 'warping' && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0.7, scaleX: 0.3 }} animate={{ opacity: 0, scaleX: 4 }}
              transition={{ duration: 0.5, delay: i * 0.035, ease: 'easeIn' }}
              style={{ position: 'absolute', top: `${8 + i * 11}%`, left: fromLeft ? '10%' : '50%', width: '40%', height: 1.5, background: `rgba(181,162,106,${0.7 - i * 0.07})`, transformOrigin: fromLeft ? 'left center' : 'right center' }} />
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -200 : 200, y: -120, rotateX: 55, rotateY: fromLeft ? -45 : 45, rotateZ: fromLeft ? -12 : 12, scale: 0.35, filter: 'blur(14px) brightness(2)' }}
        animate={isVisible
          ? { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, filter: 'blur(0px) brightness(1)' }
          : { opacity: 0, x: fromLeft ? -200 : 200, y: -120, rotateX: 55, rotateY: fromLeft ? -45 : 45, rotateZ: fromLeft ? -12 : 12, scale: 0.35, filter: 'blur(14px) brightness(2)' }}
        transition={{ duration: 0.85, ease: [0.12, 0.88, 0.26, 1.05], opacity: { duration: 0.38 }, filter: { duration: 0.5 } }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform, filter' }}
      >
        <motion.div
          animate={(phase === 'landed' || phase === 'settled') ? { y: [0, -10, 4, -2, 0], rotateZ: [0, fromLeft ? 1.2 : -1.2, fromLeft ? -0.5 : 0.5, 0] } : {}}
          transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}>
          <motion.div initial={{ opacity: 0 }} animate={isVisible ? { opacity: [0, 0.6, 0] } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ position: 'absolute', inset: -24, borderRadius: 8, zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, rgba(181,162,106,0.45) 0%, transparent 70%)' }} />
          <motion.div ref={tiltRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
            style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', willChange: 'transform' }}
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 200, damping: 22 } }}
            className="relative overflow-hidden rounded-sm shadow-lg bg-white border border-gray-100 group cursor-pointer"
          >
            <motion.div className="absolute inset-0 pointer-events-none z-10"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 50%)' }}
              whileHover={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            <div className="aspect-[4/3] overflow-hidden relative">
              <motion.div className="absolute inset-0 pointer-events-none z-10"
                style={{ boxShadow: 'inset 0 0 40px rgba(181,162,106,0.15)' }}
                whileHover={{ boxShadow: 'inset 0 0 60px rgba(181,162,106,0.32)' }} transition={{ duration: 0.4 }} />
              <motion.img src={src} alt={label} className="w-full h-full object-cover"
                whileHover={{ scale: 1.07 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ willChange: 'transform' }} />
              {scanLine && (
                <motion.div initial={{ y: '-100%' }} animate={{ y: '200%' }} transition={{ duration: 0.45, ease: 'linear' }}
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom,transparent 0%,rgba(181,162,106,0.35) 50%,transparent 100%)' }} />
              )}
              <motion.span animate={{ y: phase === 'settled' ? 0 : -28, opacity: phase === 'settled' ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
                style={{ backgroundColor: accent }}>{tag}</motion.span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            </div>
            <motion.div className="p-5 relative overflow-hidden">
              <motion.div className="absolute bottom-0 left-0 h-[3px]" style={{ backgroundColor: accent }}
                animate={{ width: phase === 'settled' ? '100%' : '0%' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div initial={{ scaleX: 0 }} animate={phase === 'settled' ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.5 }} style={{ position: 'absolute', top: 0, left: 0, width: '28%', height: 2, background: accent, transformOrigin: 'left' }} />
              <motion.p initial={{ opacity: 0, x: fromLeft ? -18 : 18 }} animate={phase === 'settled' ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.12 }} className="font-bold text-base leading-snug mb-2">{label}</motion.p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-olive flex items-center gap-1.5">
                <motion.span whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>View Gallery</motion.span>
                <motion.span whileHover={{ rotate: 45, x: 2 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }} style={{ display: 'inline-flex' }}><ArrowRight size={11} /></motion.span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── FORM FIELD — floating label + animated underline ── */
/** @param {{ label: string, id: string, type?: string, placeholder?: string, children?: any, rows?: number }} props */
function FormField({ label, id, type = 'text', placeholder = '', children = null, rows = null }) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const inputRef = useRef(null);
  const active = focused || filled;

  const base = {
    ref: inputRef,
    id,
    onFocus: () => setFocused(true),
    onBlur: (e) => { setFocused(false); setFilled(!!e.target.value); },
    className: 'w-full bg-transparent pt-7 pb-3 px-4 text-base focus:outline-none resize-none appearance-none',
    style: { fontFamily: 'inherit' },
  };

  return (
    <div className="relative" style={{ paddingTop: 20 }}>
      <motion.label
        htmlFor={id}
        onClick={() => inputRef.current?.focus()}
        animate={{
          y: active ? 4 : 30,
          scale: active ? 1 : 1.15,
          color: focused ? '#5c7a3e' : '#999',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 12,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          cursor: 'text',
          transformOrigin: 'left',
          zIndex: 2,
          userSelect: 'none',
          pointerEvents: active ? 'none' : 'all',
        }}
      >{label}</motion.label>

      <motion.div
        animate={{
          borderColor: focused ? '#5c7a3e' : filled ? 'rgba(92,122,62,0.4)' : 'rgba(0,0,0,0.15)',
          boxShadow: focused ? '0 0 0 3px rgba(92,122,62,0.12)' : '0 0 0 0px rgba(92,122,62,0)',
        }}
        transition={{ duration: 0.25 }}
        style={{ borderWidth: 1, borderStyle: 'solid', borderRadius: 6, overflow: 'hidden', backgroundColor: focused ? 'rgba(92,122,62,0.02)' : 'transparent' }}
      >
        {children
          ? <select {...base}>{children}</select>
          : rows
            ? <textarea {...base} rows={rows} placeholder={active ? placeholder : ''} />
            : <input {...base} type={type} placeholder={active ? placeholder : ''} />
        }
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CONTACT — MAIN
════════════════════════════════════════════ */
export const Contact = () => {
  const { ref: magnetRef, springX: magX, springY: magY, onMouseMove: magMove, onMouseLeave: magLeave } = useMagnetic(0.28);
  const { ref: tiltRef, springX, springY, glareX, glareY, onMouseMove, onMouseLeave } = useTilt(5);
  const [submitted, setSubmitted] = useState(false);
  const { y: floatY, rotateZ: floatRotZ } = useFloat(6, 0.0007);
  const glareStyle = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(ellipse 60% 50% at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 70%)`);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <div className="bg-brand-off-white overflow-x-hidden">
      <ParticleTrail />

      <section className="py-32 px-8 md:px-20 lg:px-15" style={{ perspective: '1400px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ════ LEFT COLUMN ════ */}
          <div className="lg:col-span-5 z-10">

            {/* Label — "Concierge Service" style */}
            <motion.span
              initial={{ opacity: 0, x: -30, letterSpacing: '0.05em' }}
              animate={{ opacity: 1, x: 0, letterSpacing: '0.3em' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-brand-olive font-medium tracking-[0.3em] uppercase text-xs mb-6 block"
            >Get In Touch</motion.span>

            {/* 3D word-flip title — same as Hero h1 */}
            <h2 className="text-6xl md:text-7xl leading-[1.1] mb-8 font-serif">
              <div className="flex flex-wrap gap-x-4">
                {['Start', 'the'].map((word, i) => (
                  <motion.span key={word}
                    initial={{ rotateX: -90, opacity: 0, y: 40 }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
                  >{word}</motion.span>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 italic font-normal">
                <motion.span
                  initial={{ rotateX: -90, opacity: 0, y: 40 }}
                  animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
                >Conversation.</motion.span>
              </div>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="max-w-md text-lg text-gray-600 leading-relaxed mb-12"
            >Partner with our design experts to create meaningful, sustainable brand experiences that leave a lasting impression.</motion.p>

            {/* Contact info — staggered x-slide */}
            <div className="space-y-8 mb-14">
              {[
                { tag: 'Email Us', value: 'hello@ecotwist.in', href: 'mailto:hello@ecotwist.in', icon: '✉' },
                { tag: 'Direct Inquiry', value: '+91 WhatsApp Contact', href: '#', icon: '◎' },
                { tag: 'The Studio', value: 'Studio 22, Sector 18, Noida UP', href: '#', icon: '◈' },
              ].map((item, i) => (
                <motion.a key={item.tag} href={item.href}
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 6 }} className="flex items-start gap-5 group cursor-pointer"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 mt-1"
                    style={{ backgroundColor: '#5c7a3e' }}
                    whileHover={{ boxShadow: '0 12px 32px rgba(92,122,62,0.35)', scale: 1.1 }}
                    whileInView={{ boxShadow: ['0 4px 16px rgba(92,122,62,0.4)', '0 4px 8px rgba(0,0,0,0.05)'] }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: i * 0.14 + 0.4 }}
                  >{item.icon}</motion.div>
                  <div>
                    <motion.span
                      initial={{ opacity: 0, letterSpacing: '0.1em' }}
                      animate={{ opacity: 1, letterSpacing: '0.22em' }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.14 }}
                      className="text-[9px] uppercase font-bold text-brand-olive mb-1 block"
                    >{item.tag}</motion.span>
                    <p className="font-serif text-xl font-light group-hover:italic transition-all">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Stats — same spring scale-in as Home Impact Stats */}
            <div className="py-8 border-y border-gray-200 grid grid-cols-3 gap-4 mb-14">
              {[
                { label: 'Happy Clients', value: '500+' },
                { label: 'Gifts Delivered', value: '5K+' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: i * 0.12 }}
                  whileHover={{ scale: 1.07, y: -3 }} style={{ willChange: 'transform' }}
                >
                  <h4 className="text-2xl font-bold font-serif text-brand-olive"><AnimatedCounter value={stat.value} /></h4>
                  <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Crash-land images — BundleCard warp+shockwave system */}
            <div className="grid grid-cols-2 gap-5" style={{ perspective: '1600px' }}>
              <LandingImageCard
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"
                label="Sustainable Gifting" tag="Eco" accent="#5a8a6e" fromLeft={true}
              />
              <LandingImageCard
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800"
                label="Eco Luxury Craft" tag="Artisan" accent="#b5a26a" fromLeft={false}
              />
            </div>

            {/* Quote — same as Home testimonial */}
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }} transition={{ delay: 0.3, duration: 1 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="italic font-serif text-lg text-brand-dark-olive mb-4">"Sustainability is the ultimate sophistication."</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-brand-olive" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">EcoTwist Studio</p>
              </div>
            </motion.div>
          </div>

          {/* ════ RIGHT COLUMN — Form ════ */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotateY: 25 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative mt-12 lg:mt-0"
            style={{ perspective: '1400px' }}
          >
            {/* Float — same as Hero image */}
            <motion.div style={{ y: floatY, rotateZ: floatRotZ, rotateX: 1, transformStyle: 'preserve-3d', willChange: 'transform' }}>

              {/* Sweep-reveal mask — identical to Hero image */}
              <motion.div
                initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                style={{ position: 'absolute', inset: 0, backgroundColor: '#b5a26a', transformOrigin: 'right', zIndex: 30, borderRadius: 2 }}
              />

              {/* 3D tilt + live glare */}
              <motion.div ref={tiltRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
                style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', willChange: 'transform' }}
                className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden relative"
              >
                <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ background: glareStyle }} />

                {/* Corner accent lines — BundleCard settled */}
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '28%', height: 3, background: '#b5a26a', transformOrigin: 'left', zIndex: 20 }} />
                <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '18%', background: '#b5a26a', transformOrigin: 'top', zIndex: 20 }} />

                <div className="p-10 md:p-14">
                  <motion.span
                    initial={{ opacity: 0, y: 12, letterSpacing: '0.1em' }}
                    animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-olive mb-3 block"
                  >Consultation Request</motion.span>

                  <motion.h3
                    initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl font-serif mb-10"
                  >Tell Us Your Vision</motion.h3>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField label="Full Name" id="name" placeholder="Jane Doe" />
                      <FormField label="Company Name" id="company" placeholder="Your Brand" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.28 }}>
                      <FormField label="Work Email" id="email" type="email" placeholder="jane@company.com" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }}>
                      <FormField label="Area of Interest" id="interest">
                        <option value="">Select an area...</option>
                        <option value="corporate">Corporate Gifting (Bulk)</option>
                        <option value="event">Special Event / Launch</option>
                        <option value="custom">Bespoke Design Consultancy</option>
                        <option value="other">General Inquiry</option>
                      </FormField>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.42 }}>
                      <FormField label="Project Overview" id="message" rows={4} placeholder="Tell us about your gifting goals..." />
                    </motion.div>

                    {/* Magnetic CTA — same as Hero */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 1.5 }}
                      className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    >
                      <motion.div ref={magnetRef} style={{ x: magX, y: magY }} onMouseMove={magMove} onMouseLeave={magLeave}>
                        <motion.button type="submit"
                          whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(0,0,0,0.18)', y: -2 }}
                          whileTap={{ scale: 0.95, y: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                          style={{ willChange: 'transform' }}
                          className="bg-brand-dark-olive text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-brand-olive transition-all"
                        >
                          {submitted
                            ? <motion.span key="sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>✓ Message Sent!</motion.span>
                            : <motion.span key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Request Consultation</motion.span>}
                        </motion.button>
                      </motion.div>
                      <motion.span whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="text-brand-charcoal uppercase tracking-[0.2em] text-xs font-bold border-b-2 border-brand-charcoal/20 hover:border-brand-olive transition-all pb-1 cursor-pointer"
                      >Schedule a Call</motion.span>
                    </motion.div>
                  </form>
                </div>

                {/* Floating badge — same as Hero image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.4, rotate: 15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 6 }}
                  transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ rotate: 0, scale: 1.06 }}
                  style={{ position: 'absolute', bottom: -16, right: 16, background: '#fff', border: '1px solid rgba(181,162,106,0.3)', borderRadius: 4, padding: '10px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 25 }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b5a26a', margin: 0 }}>Response Time</p>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 0', color: '#333' }}>Within 24 hours</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Watermark — same as Hero "Studio Edition" */}
            <div className="absolute -bottom-8 -left-4 hidden lg:block pointer-events-none">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5, duration: 0.8 }}
                className="font-serif italic text-6xl text-brand-accent opacity-50">Contact Us</motion.p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;