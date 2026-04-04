import React, { useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   TILT HOOK
───────────────────────────────────────────── */
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
  const onMouseLeave = useCallback(() => { rotateX.set(0); rotateY.set(0); }, [rotateX, rotateY]);
  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

/* ─────────────────────────────────────────────
   VARIANTS  — plain objects, ease as tuple
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const vFadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const vStagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13 } },
};

const vScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotateX: -55 },
  show:   { opacity: 1, scale: 1,   rotateX: 0, transition: { duration: 0.95, ease: EASE } },
};

const vSlideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

const vSlideRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PRODUCTS = [
  { name: 'Corporate Wellness Saver Combo',  sub: 'Starting at $125.00', tag: 'Eco-friendly',  img: 'https://thepalmera.in/cdn/shop/files/Corporate_Wellness_Kit_-_Energize_Nourish_and_Revitalize.png?v=1745705586' },
  { name: 'Artisanal Tea Press', sub: 'Starting at $85.00',  tag: 'Customizable', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCZGTksYV5OHO-8JWNTChyqMaKrByVQ48yMzIkZ4uIG9hYs9Z9WpvWY09hVb9N9nmDYF_RSr_DhhUbI8mmPdJUNOzU56hVUulBAazqNnj_B4jIeDndfDglvKPF7czuemGm03h0awjoE4cONwV6vXAqMHvLAdet8brA_5z5EfbGIbZWlwAGVHtHaZQ0qKluRGQSqJU2fxcJXvnvdbMwL-ViAA50iZQLsX43i45UnvpkZMqAza6hv-se8fyCisqfyWjtZtFNcjLJRQu' },
  { name: 'Recycled Yoga Mat',   sub: 'Starting at $110.00', tag: 'Eco-friendly',  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQKxR1F1t6R7FX-AvB9VSlXP8vqRywdnAHL2xINsrLbudl8d4xxatKX1U77c2KZO1Xr6JH_8k7ew7tOP94ZUEkvKoVi8NPavnVxRh1UB95gRQ-sL7ITh3AHTkQGephydPIVsgc-G2K-k8NhlFEA357jPvaCpeNTR_4qtN1JPVURA5dSGr5PMCGTn-TZLIDAeZ5S43IXXzXUjiRAhDJ_425eoEGyJ0eh-iUGnI3T7lfQydj2fL-f6fu829Syvra5BiSDN2sbaJJ9239' },
];

const CATEGORIES = [
  { name: 'Mindful Workspace', desc: 'Eco-journals, desk plants, and ergonomic tools to create a sanctuary at work.', accent: '#2d4337', tag: 'Focus',    img: 'https://i.pinimg.com/736x/f6/ca/1c/f6ca1cc3464f72c165b9524a37827f0b.jpg' },
  { name: 'Rest & Recovery',   desc: 'Plush robes, silk eye masks, and artisanal teas for ultimate restoration.',      accent: '#8a7db5', tag: 'Restore', img: 'https://i.pinimg.com/736x/05/a9/41/05a94145c536490427f7a433cefb3679.jpg' },
  { name: 'Digital Detox',     desc: 'Curated physical books, analog timers, and intricate puzzle sets to unplug.',    accent: '#b5a26a', tag: 'Unplug',  img: 'https://i.pinimg.com/736x/6a/6b/85/6a6b8538f5da6555c220f63b176226d9.jpg' },
];

const CUSTOM_ITEMS = [
  { icon: '◈', title: 'Logo Branding',              desc: 'Subtle, high-end placement of your corporate identity.' },
  { icon: '✏', title: 'Personalized Affirmations',  desc: 'Handwritten notes or custom printed mindfulness prompts.' },
  { icon: '📦', title: 'Eco-Packaging Styles',       desc: 'Select from a range of recycled and biodegradable boxing.' },
  { icon: '🎨', title: 'Thematic Curation',          desc: 'Colors and products matched to your event theme.' },
];

const WHY = [
  { icon: '🏆', title: 'Premium Quality',    desc: 'Luxury materials sourced from ethical partners.' },
  { icon: '◈',  title: 'Bulk Ordering',      desc: 'Streamlined logistics for 10 to 10,000 sets.' },
  { icon: '◎',  title: 'Fast Delivery',      desc: 'Global fulfillment with white-glove service.' },
  { icon: '✦',  title: 'Custom Branding',    desc: 'Seamless integration of your brand identity.' },
  { icon: '◐',  title: 'Wellness Concierge', desc: 'Dedicated expert to design your program.' },
];

const CLIENT_LOGOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8KCT9dlqgFJX-Ee3jdYqSbFEUbXuyN7yXPSEgBDe-flJ76G6oUVtV3XjxuLjdFESJBEwFJ2SVSVCuF0vCnxf93nyMZEHegrkrnznUi-lRVA-l4j0DgjLWXYM9Rj6Fwsn3iVPsh1nQ9qEyFuQO-H8z48RzKf7nQDaRaO24-xor7_a8-DzKHhP9VF69KlJRqd1_vEyvoYc1EPieLY5_bb4nlugenWU1bkKOMrgM-V1N9Rlh0ggs_tM3rJ6smV_5TVxMpMzHFT04fQW',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXlx7hI7Sy7s9KAycqMkgqGlTx54R0WbSPxNDnzO6T8OQoqSAlLQUAvry77l4DPV0imlMDFWSwrfYyFSLFyPRp0ok3FNiZFoSlj1cPUkbJbhQkduD36YaZv3qWEYTI3_K2DTwVCh3I4a8BTXla9BKktmVEBwNJatu0kIR0vavB7jAYw61JeBBqdlKM1oBYsENMfFV0kB1hJOqmYy_krqxz7HSzHBDKMOvUWkF7_W1UWOo1BsnxsdvPpxYaJurceTL4yFbZwHVL--iv',
];

/* ─────────────────────────────────────────────
   CATEGORY CARD — 3-D flip-in + tilt
───────────────────────────────────────────── */
function CategoryCard({ item, index }: { item: typeof CATEGORIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt(12);

  return (
    <motion.div
      variants={vScaleIn}
      style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      className="cursor-pointer"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: springX, rotateY: springY,
          transformStyle: 'preserve-3d', willChange: 'transform',
          boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s',
          borderRadius: 16, overflow: 'hidden', background: 'white',
        }}
      >
        <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
          <motion.img
            src={item.img} alt={item.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ willChange: 'transform' }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: item.accent }}
            animate={{ opacity: hovered ? 0.16 : 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            animate={{ y: hovered ? 0 : -24, opacity: hovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
            style={{ backgroundColor: item.accent }}
          >
            {item.tag}
          </motion.span>
        </div>

        <div className="p-7 relative overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{ backgroundColor: item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }}
            transition={{ duration: 0.45, ease: EASE }}
          />
          <h3 className="font-serif text-2xl mb-2" style={{ color: '#2d4337' }}>{item.name}</h3>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color: '#73736e' }}>{item.desc}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#2d4337' }}>
            <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              View Collection
            </motion.span>
            <motion.span
              animate={{ rotate: hovered ? 45 : 0, x: hovered ? 2 : 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              style={{ display: 'inline-flex' }}
            >
              <ArrowRight size={11} />
            </motion.span>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', borderRadius: 16 }} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ item, index }: { item: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex-shrink-0 cursor-pointer"
      style={{ minWidth: 380, scrollSnapAlign: 'start' }}
    >
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '1', borderRadius: 16 }}>
        <div className="relative overflow-hidden mb-1 h-[360px] rounded-2xl">
          <motion.img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.65, ease: EASE }}
          />
        </div>
        {/* badge */}
        <span
          className="absolute top-4 left-4 text-[10px] font-bold uppercase text-white px-4 py-1 rounded-full"
          style={{ background: 'rgba(45,67,55,0.82)', backdropFilter: 'blur(6px)', letterSpacing: 2 }}
        >
          {item.tag}
        </span>
      </div>
      <h4 className="font-serif text-xl mb-1" style={{ color: '#121b16' }}>{item.name}</h4>
      {/* <p className="text-sm" style={{ color: '#73736e' }}>{item.sub}</p> */}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   WHY CARD
───────────────────────────────────────────── */
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
      className="text-center p-6 cursor-pointer"
    >
      <motion.div
        className="flex items-center justify-center mx-auto mb-5 rounded-full text-3xl"
        style={{ width: 64, height: 64 }}
        animate={{
          background: hovered ? '#2d4337' : '#f1f1ef',
          color: hovered ? 'white' : '#2d4337',
        }}
        transition={{ duration: 0.3 }}
      >
        {item.icon}
      </motion.div>
      <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ letterSpacing: 1.5 }}>{item.title}</h4>
      <p className="text-xs font-light leading-relaxed" style={{ color: '#73736e' }}>{item.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE  — no <nav>, no <footer>
───────────────────────────────────────────── */
export default function EmployeeWellness() {
  /* parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY        = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const textY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springImg   = useSpring(imgY,  { stiffness: 60, damping: 22 });
  const springTxt   = useSpring(textY, { stiffness: 80, damping: 25 });

  /* about image tilt */
  const { ref: aRef, springX: aX, springY: aY, onMouseMove: aMM, onMouseLeave: aML } = useTilt(6);

  /* section refs */
  const aboutRef  = useRef<HTMLElement>(null);
  const catRef    = useRef<HTMLElement>(null);
  const custRef   = useRef<HTMLElement>(null);
  const ctaRef    = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 });
  const catInView   = useInView(catRef,   { once: false, amount: 0.15 });
  const custInView  = useInView(custRef,  { once: false, amount: 0.15 });
  const ctaInView   = useInView(ctaRef,   { once: false, amount: 0.3 });

  return (
    <div className="overflow-x-hidden" style={{ background: '#f8f8f7', fontFamily: 'inherit' }}>

      {/* ── HERO ───────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100vh', perspective: '1400px' }}
      >
        <motion.div style={{ y: springImg, willChange: 'transform' }} className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnryaTcE-24irJ3uM2OwD5CVoLn4qDOM5qxKA3hgtr59FgaiIMmEsi-vouzKAWrD-a57M8hQyFCtYkm9KUXodktktJq10Ksqq8De71c_FImFhSzigvHMTRJGSJ8v5C4j1T53AHS91-jqeh_mW3MPLUi-oQW7yFEuyQv3y1bx34vgug6s0isMtaRQCRaEALT6xYPBmH6BkxUWVo-hKloByrt1iEx1hyfmEvJ6zftgdyWUfPcx5ea8s2d5wcJgTBrT8l078ziJx5OExM"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ minHeight: '120%', filter: 'brightness(0.55)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.50) 0%,rgba(0,0,0,0.20) 55%,rgba(0,0,0,0.05) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: 'linear-gradient(to top,rgba(45,67,55,0.15) 0%,transparent 100%)' }} />
        </motion.div>

        {/* hero text — bottom-left anchored, same as Home */}
        <motion.div
          style={{ y: springTxt, opacity: heroOpacity, willChange: 'transform' }}
          className="absolute bottom-20 left-8 md:left-20 z-10 max-w-3xl px-4"
        >
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
            {['Employee', 'Wellness'].map((word, i) => (
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
            Nurture your team's well-being with mindful, sustainable gifts designed to inspire balance and restoration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(45,67,55,0.45)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 rounded-full"
              style={{ background: '#2d4337', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 30px rgba(45,67,55,0.4)' }}
            >
              Explore Wellness Kits
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2, background: 'white', color: '#1e2d25' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/contact'}
              className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 rounded-full"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Request Quote
            </motion.button>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
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

      {/* ── ABOUT ──────────────────────────────── */}
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f8f8f7' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* copy */}
          <motion.div variants={vStagger} initial="hidden" animate={aboutInView ? 'show' : 'hidden'}>
            <motion.div variants={vFadeUp}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ originX: 0, height: 3, width: 80, background: '#2d4337', marginBottom: 24 }}
              />
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: '#2d4337' }}>
                Our Philosophy
              </p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-8" style={{ color: '#121b16' }}>
              The Art of<br />Mindful Appreciation
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-5" style={{ color: '#73736e' }}>
              In today's fast-paced corporate landscape, the greatest luxury is peace of mind. Employee wellness gifting is more than a gesture — it's a strategic investment in your organization's most valuable asset.
            </motion.p>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-10" style={{ color: '#73736e' }}>
              We curate experiences that encourage your team to pause, breathe, and reconnect. By prioritizing their well-being, you foster a culture of loyalty, productivity, and genuine human connection.
            </motion.p>
            <motion.div
              variants={vFadeUp}
              className="flex items-center gap-4 pt-8"
              style={{ borderTop: '1px solid #e2e2de' }}
            >
              <div className="flex items-center justify-center rounded-full text-2xl flex-shrink-0"
                style={{ width: 48, height: 48, background: '#dae5de' }}>🌿</div>
              <p className="font-semibold text-sm" style={{ color: '#2d4337' }}>100% Sustainably Sourced Materials</p>
            </motion.div>
          </motion.div>

          {/* tilt image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ perspective: '1200px' }}
          >
            <motion.div
              ref={aRef}
              onMouseMove={aMM}
              onMouseLeave={aML}
              style={{ rotateX: aX, rotateY: aY, transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <img
                src="https://cdn.dribbble.com/userupload/47107366/file/803086a23e1f0beb00b837c8b9901ee3.webp?resize=400x0"
                alt="Wellness"
                className="w-full rounded-2xl shadow-2xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f1f1ef' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl font-serif mb-4" style={{ color: '#121b16' }}>Curated Wellness Experiences</h2>
            <p className="font-light text-sm max-w-lg mx-auto" style={{ color: '#73736e' }}>
              Explore our themed collections designed to address the unique needs of the modern professional.
            </p>
          </motion.div>

          <motion.div
            variants={vStagger}
            initial="hidden"
            animate={catInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ perspective: '1600px' }}
          >
            {CATEGORIES.map((item, i) => (
              <CategoryCard key={item.name} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f8f8f7' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-5xl font-serif mb-2" style={{ color: '#121b16' }}>Featured Wellness Products</h2>
              <p className="font-light" style={{ color: '#73736e' }}>The most-loved additions to our corporate wellness programs.</p>
            </div>
            <motion.a
              whileHover={{ y: -1 }}
              className="font-bold text-xs uppercase tracking-widest border-b-2 pb-1 cursor-pointer"
              style={{ borderColor: '#2d4337', color: '#121b16' }}
            >
              View All
            </motion.a>
          </motion.div>

          <div
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {PRODUCTS.map((p, i) => <ProductCard key={p.name} item={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION ──────────────────────── */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#121b16' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* copy */}
          <motion.div variants={vSlideLeft} initial="hidden" animate={custInView ? 'show' : 'hidden'}>
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-white/60 mb-4">Personalization</p>
            <h2 className="text-5xl font-serif text-white leading-tight mb-6">
              Tailored to Your<br />
              <span style={{ color: '#86efac', fontStyle: 'italic', fontWeight: 400 }}>Wellness Goals</span>
            </h2>
            <p className="text-lg font-light leading-relaxed mb-12" style={{ color: 'rgba(212,212,212,0.7)' }}>
              Every organization is unique. We provide a bespoke customization service to ensure your brand's voice and wellness mission are perfectly articulated.
            </p>

            <motion.div
              variants={vStagger}
              initial="hidden"
              animate={custInView ? 'show' : 'hidden'}
              className="grid grid-cols-2 gap-8"
            >
              {CUSTOM_ITEMS.map((item) => (
                <motion.div key={item.title} variants={vFadeUp} className="flex gap-4">
                  <div
                    className="flex-shrink-0 flex items-center justify-center text-lg rounded-lg"
                    style={{ width: 40, height: 40, border: '1px solid #3d5a4a', color: '#86efac' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm mb-1">{item.title}</h5>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(212,212,212,0.6)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* decorative image card */}
          <motion.div
            variants={vSlideRight}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
            style={{ position: 'relative' }}
          >
            <div className="absolute inset-0 rounded-3xl opacity-50"
              style={{ background: '#2d4337', transform: 'rotate(3deg) scale(0.95)' }} />
            <div className="relative rounded-3xl overflow-hidden p-6" style={{ background: '#f1f1ef' }}>
              <img
                src="https://brownliving.in/cdn/shop/files/sustainable-delight-essentials-kit-daily-self-care-must-haves-by-namaskar-lifestyle-at-brownliving-500926.png?v=1739965301"
                alt="Packaging"
                className="w-full rounded-2xl shadow-xl"
                style={{ aspectRatio: '1', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE ─────────────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif" style={{ color: '#121b16' }}>Why Choose Ecotwist</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────── */}
      <section className="py-14 px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold mb-10"
            style={{ color: '#a6a6a1' }}
          >
            Trusted by Visionary Brands
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-16 grayscale"
          >
            {CLIENT_LOGOS.map((src, i) => (
              <img key={i} src={src} alt="Client logo" style={{ height: 24, objectFit: 'contain' }} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section ref={ctaRef} className="py-32 px-8 text-center" style={{ background: '#f1f1ef' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-serif text-5xl md:text-6xl leading-tight mb-6"
            style={{ color: '#121b16' }}
          >
            Ready to create the perfect<br />
            <span className="italic font-normal">Employee Wellness</span><br />
            experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl font-light leading-relaxed mb-12"
            style={{ color: '#73736e' }}
          >
            Let's work together to nurture your team's vitality and success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -3, boxShadow: '0 18px 40px rgba(45,67,55,0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.href = '/configurator'}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-[0.2em] text-xs px-14 py-6 rounded-full shadow-xl"
              style={{ background: '#2d4337', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Get Started
            </motion.button> 
            <motion.button
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => window.location.href = '/contact'}
              className="font-bold uppercase tracking-[0.2em] text-xs pb-1 transition-colors"
              style={{ background: 'transparent', border: 'none', borderBottom: '2px solid rgba(38,38,36,0.2)', cursor: 'pointer', fontFamily: 'inherit', color: '#262624' }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#2d4337')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'rgba(38,38,36,0.2)')}
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}