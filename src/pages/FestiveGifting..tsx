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
   VARIANTS  — plain objects only, no functions
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const vFadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const vStagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.14 } },
};

const vScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotateX: -55 },
  show:   { opacity: 1, scale: 1,   rotateX: 0,  transition: { duration: 0.95, ease: EASE } },
};

const vSlideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: EASE } },
};

const vSlideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: EASE } },
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  {
    name: 'Welcome Kits',
    desc: 'Perfect for new arrivals and festive onboarding experiences.',
    tag: 'Onboarding', accent: '#b5a26a',
    img: 'https://bytheleaf.in/cdn/shop/files/5AA4CCC4-821C-4A12-8C11-98F3567BB161.png?v=1758727628',
  },
  {
    name: 'Premium Festive Hampers',
    desc: 'A celebration of artisanal flavors and eco-luxury craftsmanship.',
    tag: 'Seasonal', accent: '#c4735d',
    img: 'https://radgifts.in/storage/01J8AWKRJ1CXVNZNT1FWD38WZ1.jpg',
  },
  {
    name: 'Custom Merchandise',
    desc: 'Bespoke branding on sustainably sourced lifestyle products.',
    tag: 'Branded', accent: '#5a8a6e',
    img: 'https://www.wraparts.in/cdn/shop/files/WEBSITEPRODUCTLISTING_19_b35fc3cb-ca31-4344-84e1-bf5c17b7b46a.png?v=1764670529',
  },
];

const FEATURED = [
  { name: 'The Heritage Box',   sub: 'Traditional meets Sustainable', img: 'https://m.media-amazon.com/images/I/71iqyqJH-sL.jpg' },
  { name: 'The Wellness Kit',   sub: 'Mindful Restoration',           img: 'https://oggnhome.com/cdn/shop/articles/Gemini_Generated_Image_719kn7719kn7719k.png?v=1771223802&width=533' },
  { name: 'Gourmet Collection', sub: 'Culinary Excellence',           img: 'https://advaitliving.com/cdn/shop/products/9.jpg?v=1664035436' },
  { name: 'Executive Signature',sub: 'Modern Sophistication',        img: 'https://www.boxupgifting.com/cdn/shop/products/Scrumptiousmunchbox1.jpg?v=1729161012&width=500' },
];

const WHY = [
  { icon: '✦', title: 'Premium Quality', desc: 'Sustainably sourced, luxury finishes, and curated selections.' },
  { icon: '◈', title: 'Bulk Ordering',   desc: 'Seamless logistics for large-scale corporate requirements.' },
  { icon: '◎', title: 'Fast Delivery',   desc: 'Reliable worldwide shipping with real-time tracking.' },
  { icon: '◐', title: 'Dedicated Support', desc: 'One-on-one concierge for your gifting strategy.' },
];

const CUSTOM_ITEMS = [
  { icon: '🏆', title: 'Logo Branding',         desc: 'Subtle, high-end laser engraving or eco-foil stamping for your brand identity.' },
  { icon: '✉',  title: 'Personalized Messages', desc: 'Hand-written notes on recycled seed-paper for a truly personal touch.' },
  { icon: '🌿', title: 'Eco-Packaging Styles',  desc: 'Modular, plastic-free packaging that doubles as stylish home storage.' },
];

/* ─────────────────────────────────────────────
   CATEGORY CARD  — 3-D flip-in + tilt
───────────────────────────────────────────── */
function CategoryCard({ item, index }: { item: typeof CATEGORIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt(12);

  return (
    <motion.div
      variants={vScaleIn}
      style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      className="cursor-pointer"
      custom={index}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: springX, rotateY: springY,
          transformStyle: 'preserve-3d', willChange: 'transform',
          boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.4s',
        }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      >
        {/* image */}
        <div className="overflow-hidden rounded-xl m-4" style={{ aspectRatio: '1' }}>
          <motion.img
            src={item.img} alt={item.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ willChange: 'transform' }}
          />
          {/* accent wash */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{ backgroundColor: item.accent }}
            animate={{ opacity: hovered ? 0.16 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {/* tag badge */}
          <motion.span
            animate={{ y: hovered ? 0 : -24, opacity: hovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
            style={{ backgroundColor: item.accent }}
          >
            {item.tag}
          </motion.span>
        </div>

        {/* footer */}
        <div className="px-5 pb-5 relative overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{ backgroundColor: item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }}
            transition={{ duration: 0.45, ease: EASE }}
          />
          <h3 className="font-serif text-2xl mb-2">{item.name}</h3>
          <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
          <button
            className="w-full py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 border border-gray-200 text-gray-700 transition-colors"
            style={{ fontFamily: 'inherit' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#14532d'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.color = '#44403c'; }}
          >
            View Collection <ArrowRight size={13} />
          </button>
        </div>
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   WHY CARD
───────────────────────────────────────────── */
function WhyCard({ item, index }: { item: typeof WHY[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="relative p-8 rounded-2xl bg-white border border-gray-200"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* top accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.25, ease: EASE }}
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-emerald-700"
        style={{ transformOrigin: 'left' }}
      />
      <span className="text-3xl block mb-4" style={{ color: '#166534' }}>{item.icon}</span>
      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE  — no <nav>, no <footer>
───────────────────────────────────────────── */
export default function FestiveGifting() {
  /* hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springImg = useSpring(imgY,  { stiffness: 60, damping: 22 });
  const springTxt = useSpring(textY, { stiffness: 80, damping: 25 });

  /* tilt for about image */
  const { ref: aboutTiltRef, springX: atX, springY: atY, onMouseMove: atMM, onMouseLeave: atML } = useTilt(6);

  /* section refs */
  const aboutRef  = useRef<HTMLElement>(null);
  const catRef    = useRef<HTMLElement>(null);
  const prodRef   = useRef<HTMLElement>(null);
  const custRef   = useRef<HTMLElement>(null);
  const trustRef  = useRef<HTMLElement>(null);
  const ctaRef    = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef,  { once: false, amount: 0.2 });
  const catInView   = useInView(catRef,    { once: false, amount: 0.15 });
  const prodInView  = useInView(prodRef,   { once: false, amount: 0.15 });
  const custInView  = useInView(custRef,   { once: false, amount: 0.15 });
  const trustInView = useInView(trustRef,  { once: false, amount: 0.2 });
  const ctaInView   = useInView(ctaRef,    { once: false, amount: 0.3 });

  return (
    <div className="overflow-x-hidden bg-brand-beige" style={{ fontFamily: 'inherit' }}>

      {/* ── HERO ───────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100vh', perspective: '1400px' }}
      >
        {/* parallax bg */}
        <motion.div style={{ y: springImg, willChange: 'transform' }} className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYZBt1CEZz9YvMLsR2pNIPx7x_ryCE5gLt0yEr162z8WzGrrkHeSHzhkg_COzedZY6g5bIAKDk20NB8Z09HRezOaon-7_HyaQmLv1zOnz_Fg03Gn_R9Ot_VpjFRWj1S8d7E4Dkb-OLTZCtMzZmuNCiG0Yod6q0M8jkWvjjKUv8L06PNQHkDftz6s73dLZnN6zXysmZYbzennprhX7NsdcSarSPObDptbXmIFEQsjJvccOXUp5pR7kkTyOROimot6w7O9Yn9TZi35r"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ minHeight: '120%', filter: 'brightness(0.5)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.22) 55%,rgba(0,0,0,0.06) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top,rgba(181,162,106,0.14) 0%,transparent 100%)' }} />
        </motion.div>

        {/* glass hero card — bottom-left, same as Home */}
        <motion.div
          style={{ y: springTxt, opacity: heroOpacity, willChange: 'transform' }}
          className="absolute bottom-20 left-8 md:left-20 z-10 max-w-2xl px-4"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.32em] font-bold text-white/60 mb-5 flex items-center gap-3"
          >
            <span className="w-10 h-px bg-brand-olive inline-block" />
            Corporate Solutions
          </motion.p>

          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.08 }}>
            {['Festive', 'Gifting'].map((word, i) => (
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
              style={{ display: 'block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d', fontStyle: 'italic', fontWeight: 400 }}
            >
              Solutions.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
            className="text-white/80 mt-6 max-w-md text-lg font-light leading-relaxed"
          >
            Celebrate milestones with curated sustainable luxury. Designed for teams who value elegance and the environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(20,83,45,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="bg-emerald-900 text-white px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            >
              Explore Gifts <ArrowRight size={13} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/contact'}
              className="border border-white/40 text-white px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.08)' }}
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
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* copy */}
          <motion.div
            variants={vStagger}
            initial="hidden"
            animate={aboutInView ? 'show' : 'hidden'}
          >
            <motion.div variants={vFadeUp}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ originX: 0 }}
                className="w-20 h-1 bg-brand-olive mb-6"
              />
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-emerald-800 mb-4">
                The Art of Gratitude
              </p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-7">
              Honoring Seasons<br />of Success
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-gray-600 text-lg leading-relaxed mb-6">
              Festive seasons are more than just dates on a calendar; they are opportunities to pause and acknowledge the collective effort that drives your organization forward.
            </motion.p>
            <motion.blockquote
              variants={vFadeUp}
              className="font-serif text-lg text-gray-600 italic leading-relaxed border-l-2 border-emerald-700 pl-6 py-2"
            >
              "At Ecotwist, we transform corporate gratitude into a tangible experience of luxury that respects our planet."
            </motion.blockquote>
          </motion.div>

          {/* tilt image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ perspective: '1200px', position: 'relative' }}
          >
            <motion.div
              ref={aboutTiltRef}
              onMouseMove={atMM}
              onMouseLeave={atML}
              style={{ rotateX: atX, rotateY: atY, transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative' }}
            >
              {/* rotating bg slab */}
              <motion.div
                className="absolute rounded-2xl"
                style={{ inset: -16, background: '#dcfce7', transform: 'rotate(-2deg)', zIndex: 0, transition: 'transform 0.5s ease' }}
                whileHover={{ rotate: 0 } as any}
              />
              <div className="overflow-hidden rounded-2xl relative z-10">
                <img
                  src="https://previews.123rf.com/images/espies/espies2011/espies201100222/158560385-indian-family-lighting-or-arranging-oil-lamp-or-diya-around-flower-rangoli-on-diwali-festival-night.jpg"
                  alt="About"
                  className="w-full shadow-2xl"
                  style={{ aspectRatio: '4/3', objectFit: 'cover', borderRadius: 16 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f5f5f4' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl font-serif mb-5">Curated Collections</h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={catInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
              className="h-[2px] w-20 bg-emerald-700 mx-auto"
              style={{ originX: 0.5 }}
            />
          </motion.div>

          <motion.div
            variants={vStagger}
            initial="hidden"
            animate={catInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-7"
            style={{ perspective: '1600px' }}
          >
            {CATEGORIES.map((item, i) => (
              <CategoryCard key={item.name} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────── */}
      <section ref={prodRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={prodInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-5xl font-serif mb-2">Featured Pieces</h2>
              <p className="text-gray-500">Selected seasonal favorites from our design studio</p>
            </div>
            <motion.a
              whileHover={{ y: -1 }}
              className="font-bold text-xs uppercase tracking-widest border-b-2 border-brand-olive pb-1 cursor-pointer"
            >
              View All
            </motion.a>
          </motion.div>

          <div
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {FEATURED.map((p, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: false, amount: 0.2 });
              const [hovered, setHovered] = useState(false);
              return (
                <motion.div
                  key={p.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 48 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  onHoverStart={() => setHovered(true)}
                  onHoverEnd={() => setHovered(false)}
                  className="cursor-pointer flex-shrink-0"
                  style={{ minWidth: 300, scrollSnapAlign: 'start' }}
                >
                  <div
                      className="overflow-hidden rounded-2xl mb-4"
                      style={{ width: "250px", aspectRatio: "4/5" }}
                    >
                      <motion.img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  <h4 className="font-medium text-lg mb-1">{p.name}</h4>
                  <p className="text-gray-500 text-sm">{p.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION ──────────────────────── */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32" style={{ background: '#052e16' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={custInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-brand-olive/80 mb-4">Bespoke Details</p>
            <h2 className="text-5xl font-serif text-white">Personalized for Your Brand</h2>
          </motion.div>

          <motion.div
            variants={vStagger}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {CUSTOM_ITEMS.map((item) => (
              <motion.div key={item.title} variants={vFadeUp}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl border"
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ originX: 0 }}
              className="w-20 h-1 bg-brand-olive mb-5"
            />
            <h2 className="text-5xl font-serif">Why Ecotwist</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TRUST ──────────────────────────────── */}
      <section ref={trustRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f5f5f4' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* logos + heading */}
          <motion.div
            variants={vSlideLeft}
            initial="hidden"
            animate={trustInView ? 'show' : 'hidden'}
          >
            <h2 className="text-4xl font-serif mb-10">Trusted by Global Visionaries</h2>
            <div className="flex flex-wrap gap-6 opacity-50">
              {['LUXE','AVENUE','GREENER','SOLARIS','MINT','ETHEREAL','NEXUS','ORBIT'].map(b => (
                <span key={b} className="font-bold text-base text-gray-800 tracking-widest">{b}</span>
              ))}
            </div>
          </motion.div>

          {/* testimonial card */}
          <motion.div
            variants={vSlideRight}
            initial="hidden"
            animate={trustInView ? 'show' : 'hidden'}
            whileHover={{ y: -4, boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}
            className="bg-white p-8 rounded-2xl shadow-xl"
            style={{ borderTop: '4px solid #166534', willChange: 'transform' }}
          >
            <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
            <p className="font-serif text-gray-600 italic leading-relaxed mb-6 text-[15px]">
              "Ecotwist redefined our festive gifting. The feedback from our partners was overwhelming. The focus on sustainability really aligned with our corporate values."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">👤</div>
              <div>
                <p className="font-bold text-sm">Sarah Jenkins</p>
                <p className="text-gray-400 text-xs">Chief Marketing Officer, Solaris Group</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section ref={ctaRef} className="py-32 px-8 relative overflow-hidden text-center">
        {/* bg */}
        <div className="absolute inset-0" style={{ background: '#14532d' }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTDu2C6JVU1kN_CJOxH-M9qtT3_4-hDQ9O-Jx8wwUGnvZU5171_SLbgHwqTurPqM9KGhTOOSiKkmF5LAnW3-KrmXPsF4cYUiXT6e1nYyY85ilBnATyHwW7hTWsdZJlb5kftQegQhQj5stokL-zc8Z3JuIXWSA4mheDO38BGTbSoVo5ZNXs7mhU0bK77VDCB6nCUhWlp6hA7Tgwtl-yZM-V1r8wYvlqVuepcWmJ5HzM9dKhv5a82Wwi_N0BTHjXauY-ZD0u0mOta-n_"
            alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.18, mixBlendMode: 'overlay' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-serif text-5xl md:text-7xl mb-8 leading-tight"
          >
            Ready to create the<br />
            perfect <span className="italic font-normal">Festive Gifting</span><br />
            experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-emerald-100 text-xl mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Let us help you curate a selection that reflects your brand's commitment to quality and the planet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -3, boxShadow: '0 18px 40px rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="bg-white text-emerald-950 px-14 py-6 rounded-full font-bold text-lg shadow-xl"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="border-b-2 border-white/30 hover:border-white text-white text-sm font-bold uppercase tracking-[0.2em] pb-1 transition-colors"
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}