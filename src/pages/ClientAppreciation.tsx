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
   VARIANTS  — plain objects, ease cast as tuple
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
const PRODUCTS = [
  { name: 'The Wellness Suite',   sub: 'Organic Linen & Essential Oils',       price: '$145.00', img: 'https://m.media-amazon.com/images/I/71B4GyjXnnL.jpg' },
  { name: 'Morning Ritual',       sub: 'Artisanal Coffee & Copper Press',      price: '$120.00', img: 'https://i.pinimg.com/474x/41/73/e4/4173e4efbdaf93fbf17adc1d32dc0111.jpg' },
  { name: 'The Catalyst',         sub: 'Recycled Leather & Brass Stylus',      price: '$95.00',  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBau4mGYfK9psoJHrysrWzFISlXvSoIgdJfNhBE-Lwje8S9oRaNfww3rxMYocMBBpb-iljnd_TbC6unC6t4VbHlr3UZIItnZoGPH1yh6xdiUUqScpIYYN_3DoEZY_6oRv1ROOEgGX7a5dYM9NkLfz_qL85CBV8YobDxLuuusn6jo6HHQ8gbSdu9s4LUy3Sb2wegRl2rlEBtsv_L319l_Z6OIKhTuKd-COgQm4e6kU_OWb-lZgbpN7y7vK0f7a-r3nNkaspjhm1fzjVe' },
  { name: 'Grand Celebration',    sub: 'Vintage Cuvee & Cocoa Nib Truffles',  price: '$210.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQfeCVI8WU7s7LtxYKupXcSYIRY0xeLJkgpRe7qA5RRQ5pojovxPqXIzLWc_mZct8uNlQswJBt6NudLFxW-xJpb11i1odnNd9orlMpR3powbBS4q0MqgUzvoxreJU5KRWzaF5ws6FX62XyRGesJCr8KaPyUogu04LCe7yAxZG9_EmDDYShJBVwSbLC4ui1_r8_S2qxS2LIJ2IMcwVzTfsTAYVgANrKFyqt2OXOmVkc3ZSohD_SvGMuC8fN2Y-eYS1X1V1Oq5CSiecX' },
];

const CATEGORIES = [
  { name: 'Executive Boxes',      desc: 'Sophisticated essentials for the modern C-suite leader.',        accent: '#b5a26a', tag: 'Executive', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZLh_df9ZWaGxUlYq9Fki4MeyWoD9bxHssh215J96Vp2aek9_VSHIl0Cz-WMI8u_ejEH0RMTrW64ZH32jFWqaVuBB9s3fXJfbBTQBFDbCTBoOyS1gwYOYSXOEUXmS8jScDQ1fvsMuum24mwye8NqEjW_Zh-9S1QlFsu-mYTEZJ05TzTAKlWrL8ZSFVaRZQBcO0BcKx0W3vSsESoY_X6IRReoAzt1Tb56NiylMkjV0OrkYsnHTpCQqSmEWpQdJl_q-uGX6u3Ls9UBnl' },
  { name: 'Artisanal Curations',  desc: 'Handmade ceramics and small-batch treats from local makers.',   accent: '#c4735d', tag: 'Artisan',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr2V88w8yJO5M61sDG7tH_NyFGrLWpk_-dGYclkMOCh_z0ewpa2DAsBR2rYPWXKPjEUDvvvsNIZZx7BvD_-8OEZQB10USZtffkIxkMHuZgBX2xb0rXJn7hq9YdRxcQn_9mAWGt0GZho6xdt3EiaQ9x0Ikf6bLLgnNflbkJk5conNC8pxc4A0Hg5roUbsukUjahaqi7_fGhGjrGhSvMVwHLYJwGwK74GlPkOqIHpEaqf-raEP9TC_DiQmrtLKp6OBXfNLjKsJJ-4Td5' },
  { name: 'Custom Tech',          desc: 'Seamlessly integrated technology in eco-conscious housing.',     accent: '#5a8a6e', tag: 'Tech',      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg7eWQVoOh92uMj3uFCQdxzCQTevaIAtbeuyW-rXeg6MIGQkEQpEi_flaLf06XiUz4rA0DUboUnBdgNTUEH_1GpRy7uA8n6Ka9B1qOi40xZr8DqpdWaG0dTqRLiN5SMiMwS-_Bvn1dtz0oNtth7f9mn7QjyNPQh9uCwUc3zkcOzeEZvJWz_tho6yWbGBbyajSj2OZCdq0sDoo4yIgoaJvOtafIOS10uU_10lCk1psdXzy5SZzaET2byRGt_Y2_45ZRFUu7GvdsWvx9' },
];

const FEATURES = [
  { icon: '🌿', title: '100% Plastic Free',   desc: 'Fully compostable materials' },
  { icon: '🤝', title: 'Artisan Direct',       desc: 'Supporting small makers' },
  { icon: '🚚', title: 'Carbon Neutral',       desc: 'Global tracked delivery' },
  { icon: '✦',  title: 'B-Corp Certified',    desc: 'Socially responsible' },
  { icon: '◐',  title: 'Dedicated Concierge', desc: 'Personalized support' },
];

const CUSTOM_ITEMS = [
  { icon: '◈', title: 'Logo Branding',         desc: 'Subtle engraving or foil-stamping on products and packaging.' },
  { icon: '✏', title: 'Personalized Messages', desc: 'Hand-calligraphed notes included with every gift shipment.' },
  { icon: '📦', title: 'Packaging Styles',      desc: 'Choose from wooden crates, recycled boxes, or canvas wraps.' },
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
          boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s',
        }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      >
        {/* image */}
        <div className="overflow-hidden" style={{ height: 280 }}>
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

        {/* footer */}
        <div className="p-8 relative overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{ backgroundColor: item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }}
            transition={{ duration: 0.45, ease: EASE }}
          />
          <h3 className="font-serif text-2xl text-gray-800 mb-2">{item.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-olive">
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
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex-shrink-0 bg-white rounded-xl border border-gray-100 p-4 cursor-pointer"
      style={{
        minWidth: 360,
        boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div className="overflow-hidden rounded-lg mb-5 h-80 b-100" style={{ aspectRatio: '1' }}>
        <motion.img
          src={item.img} alt={item.name}
          className="w-full h-full object-cover rounded-lg"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ willChange: 'transform' }}
        />
      </div>
      <div className="px-2">
        <h4 className="font-serif text-xl text-gray-800 mb-1">{item.name}</h4>
        {/* <p className="text-gray-500 text-sm mb-4">{item.sub}</p> */}
        <div className="flex justify-between items-center">
          {/* item.price */}
          <span className="font-semibold text-base" style={{ color: '#064e3b' }}>{ }</span>
          <motion.button
            // whileHover={{ scale: 1.25, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="text-2xl leading-none"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#064e3b' }}
          >
            Order Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE ITEM
───────────────────────────────────────────── */
function FeatureItem({ item, index }: { item: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      className="text-center"
    >
      <span className="text-4xl block mb-3" style={{ color: '#065f46' }}>{item.icon}</span>
      <h5 className="font-semibold text-sm text-gray-800 mb-1">{item.title}</h5>
      <p className="text-gray-500 text-xs">{item.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE  — no <nav>, no <footer>
───────────────────────────────────────────── */
export default function ClientAppreciation() {
  /* parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY       = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springImg  = useSpring(imgY,  { stiffness: 60, damping: 22 });
  const springTxt  = useSpring(textY, { stiffness: 80, damping: 25 });

  /* tilt for about image */
  const { ref: aboutTiltRef, springX: atX, springY: atY, onMouseMove: atMM, onMouseLeave: atML } = useTilt(6);

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
            src="https://runa.io/hs-fs/hubfs/employee%20appreciation%20gifts.png?width=1296&height=710&name=employee%20appreciation%20gifts.png"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ minHeight: '120%', filter: 'brightness(0.82)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.50) 0%,rgba(0,0,0,0.20) 55%,rgba(0,0,0,0.05) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top,rgba(6,78,59,0.12) 0%,transparent 100%)' }} />
        </motion.div>

        {/* hero content — bottom-left anchored, same rhythm as Home */}
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
            <span className="w-10 h-px bg-brand-olive inline-block" />
            Corporate Solutions
          </motion.p>

          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.08 }}>
            {['Client', 'Appreciation'].map((word, i) => (
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
              Gifting Solutions.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
            className="text-white/80 mt-6 max-w-xl text-lg font-light leading-relaxed"
          >
            Strengthen partnerships with artisanal, earth-conscious luxury. Curated experiences that reflect your brand's commitment to quality and sustainability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(6,78,59,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="bg-brand-dark-olive text-white px-9 py-4 rounded-lg font-bold uppercase tracking-widest text-xs"
              style={{ boxShadow: '0 8px 30px rgba(6,78,59,0.3)' }}
            >
              Explore Gifts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/contact'}
              className="border border-white/40 text-white px-9 py-4 rounded-lg font-bold uppercase tracking-widest text-xs backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.1)' }}
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

          {/* tilt image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ perspective: '1200px' }}
          >
            <motion.div
              ref={aboutTiltRef}
              onMouseMove={atMM}
              onMouseLeave={atML}
              style={{ rotateX: atX, rotateY: atY, transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <img
                src="https://m.media-amazon.com/images/I/81hz1wn55mL.jpg"
                alt="About"
                className="w-full rounded-2xl shadow-2xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
            </motion.div>
          </motion.div>

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
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: '#065f46' }}>
                Our Philosophy
              </p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-7">
              Elevated Intentions<br />for Lasting Impressions
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-gray-600 text-lg leading-relaxed mb-10">
              We believe that a gift is more than just an object; it's a conversation. Our client appreciation collection is designed for those who value authenticity. We source exclusively from independent artisans and carbon-neutral suppliers to ensure your gratitude leaves a mark on the heart, not the planet.
            </motion.p>
            <motion.a
              variants={vFadeUp}
              whileHover={{ x: 4, transition: { type: 'spring', stiffness: 340, damping: 22 } }}
              className="inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest border-b-2 border-brand-charcoal/20 hover:border-brand-olive pb-1 transition-colors cursor-pointer"
            >
              Learn about our impact <ArrowRight size={13} />
            </motion.a>
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
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-gray-900 mb-4">Curated Collections</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">Discover the perfect alignment for your brand's aesthetic and values.</p>
          </motion.div>

          <motion.div
            variants={vStagger}
            initial="hidden"
            animate={catInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{ perspective: '1600px' }}
          >
            {CATEGORIES.map((item, i) => (
              <CategoryCard key={item.name} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCTS SCROLL ────────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-3" style={{ color: '#065f46' }}>New Arrivals</p>
              <h2 className="text-5xl font-serif">Seasonal Favorites</h2>
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
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.name} item={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION ──────────────────────── */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#1c1917' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* copy */}
          <motion.div
            variants={vSlideLeft}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-brand-olive/70 mb-4">Personalization</p>
            <h2 className="text-5xl font-serif text-white leading-tight mb-14">
              Tailored to Your<br />
              <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 400 }}>Brand Identity</em>
            </h2>

            <motion.div variants={vStagger} initial="hidden" animate={custInView ? 'show' : 'hidden'} className="space-y-10">
              {CUSTOM_ITEMS.map((item) => (
                <motion.div key={item.title} variants={vFadeUp} className="flex gap-6">
                  <div
                    className="flex-shrink-0 flex items-center justify-center text-xl"
                    style={{ width: 48, height: 48, borderRadius: '50%', background: '#292524', color: '#4ade80' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* image */}
          <motion.div
            variants={vSlideRight}
            initial="hidden"
            animate={custInView ? 'show' : 'hidden'}
            style={{ position: 'relative' }}
          >
            <div className="absolute -inset-4 rounded-2xl" style={{ background: 'rgba(6,78,59,0.2)', filter: 'blur(40px)' }} />
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq14aVTHnFOap7-eQaO1Wp0-cYnBpRqmJeaUpYnrV39WqUDHJ_ZrPbGq3Wfr0Y0C3YSOldvoJR3gpqvN7L_ZQ0q4haEdh7-Xun9QKPZw8DiYM5qfxaSm9akDI6tvj21l5Dx-0O0vXTReRmmMi-GIlfm9Gw0iWvFbNICdWTR7Xbr14vEwiBTEVfFcxE2Qv5KziCQEJVS79LZA2gcAuddIT8k1Qzg-lNEAijMPsblQmlu-8nQjKH7FclDGKY_9FGuYWUiNkatymFWI5Q"
                alt="Custom"
                className="w-full rounded-2xl"
                style={{ filter: 'grayscale(0.55)', transition: 'filter 1s' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(0.55)')}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES / WHY US ──────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          {FEATURES.map((f, i) => <FeatureItem key={f.title} item={f} index={i} />)}
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────── */}
      <section className="py-14 px-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-10"
          >
            Trusted by visionary brands
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-16 grayscale"
          >
            {['Lumina Tech','Veridia','Oasis Global','NorthStar','Equinox'].map(b => (
              <span key={b} className="font-serif text-xl font-bold text-gray-800">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section ref={ctaRef} className="py-24 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="rounded-3xl text-center relative overflow-hidden px-12 py-20"
            style={{ background: '#ecfdf5' }}
          >
            {/* decorative blob */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'rgba(187,247,208,0.35)', filter: 'blur(40px)' }} />

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
                animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="font-serif text-4xl md:text-5xl leading-tight mb-5"
                style={{ color: '#022c22' }}
              >
                Ready to create the perfect<br />
                <span className="italic font-normal">Client Appreciation</span> gift experience?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-gray-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
              >
                Speak with one of our gifting consultants today and receive a digital mood board for your next campaign.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="flex flex-col sm:flex-row justify-center gap-5"
              >
                <motion.button
                  whileHover={{ scale: 1.06, y: -3, boxShadow: '0 16px 48px rgba(6,78,59,0.35)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="bg-brand-dark-olive text-white px-12 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Start Your Project
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="border-b-2 border-brand-charcoal/20 hover:border-brand-olive text-sm font-bold uppercase tracking-[0.2em] pb-1 transition-colors"
                >
                  Schedule a Consultation
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}