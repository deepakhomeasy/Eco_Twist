import React, { useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   TILT HOOK  (matches Home.tsx exactly)
───────────────────────────────────────────── */
function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const cfg = { stiffness: 200, damping: 22, mass: 0.6 };
  const springX = useSpring(rotateX, cfg);
  const springY = useSpring(rotateY, cfg);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      rotateY.set(dx * strength);
      rotateX.set(-dy * strength);
    },
    [strength, rotateX, rotateY]
  );
  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

/* ─────────────────────────────────────────────
   SHARED VARIANTS
   custom prop = stagger delay (number, default 0)
───────────────────────────────────────────── */
import type { Variants } from 'motion/react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] as any },
  },
};

// per-child delay is handled by stagger.show's staggerChildren
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  {
    name: 'Welcome Kits',
    desc: 'Essential items to kickstart their journey with style and functionality.',
    tag: 'Day One',
    accent: '#b5a26a',
    img: 'https://www.ugaoo.com/cdn/shop/files/3_dcbb5176-f98e-4295-b398-07109556f8b4.jpg?v=1684586261',
  },
  {
    name: 'Premium Hampers',
    desc: 'Elevated selections featuring artisan snacks and luxury lifestyle goods.',
    tag: 'Luxury',
    accent: '#8a7db5',
    img: 'https://myhealthytreat.in/cdn/shop/files/festivities_2_9a13a481-b68c-4926-ab5d-547c15b1f69f_5000x.jpg?v=1727003867',
  },
  {
    name: 'Custom Tech Essentials',
    desc: 'Modern gadgets designed for the contemporary workspace experience.',
    tag: 'Tech',
    accent: '#5a8a6e',
    img: 'https://thegiftingmarketplace.in/cdn/shop/files/JKSR181-Personalized-6in1-Gift-Set.png?v=1742564934',
  },
];

const PRODUCTS = [
  {
    name: 'Eco-leather Notebook',
    sub: 'Sustainable Craftsmanship',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB4x2s20AO7tMiRWDPKQARVbgyS12OsGuAAkQR-iOBoTYPdP94sX1Gh6q2hpwaPJo3-WAL4nCMMjjVuaa2walojmO_feJhhwPc76gNYYpYCeFp4eb8ZbZ_POHTz8XBGw96klGFRyCZFgfaViWAxCq6_gRAJhjbeZnTfsj5Vep9Uf9bJxbblz42MX94NMjw9UcYCL5I2aWCY-OdCW5wEUomehgyAeXwBQ6Ut056XFHL41LGpQgQbgxyZ7bstt90DQn_eg0S3o1pdG61',
  },
  {
    name: 'Recycled Glass Bottle',
    sub: 'Mindful Hydration',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPuJm55DIUZR17cCt1ML2BbAzMfIBS3cmqac33GDUJFMb8urIgb4PTeUpatnzBf0-N7bsFNCChGcyvPgtdCDWyBUFFADQSu4oGc_irRo3Er0TNwPGOtN4o-H8j2eZe7Y9wnRh7bCpMAPEvOjkLAFAVVudNoc2vC06fjD6aKmLhKp5YERQqNCVAUNlQ8xHITC0hb7N7uEG659woF21VFXgvar7JI3V4hnSWdNvajHFJTai61s5ROHEd5Ly4wzLj8Sq_box686J4PW9B',
  },
  {
    name: 'Sustainable Tote',
    sub: 'Daily Versatility',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCw732tbJ6qkJC4AHuCJ41muB5d6qR2Ht24GaHDVwz91Eb5KruhMzSo5g9IUqLGqdXTg9JhCADtNduzkg7wieuPIfDd0vH5x6PcPBnSIRCIPwudJ4dzGTDNX0tRG70zET2TOCVLVCpLmftNxrcRgYLLSBt2LyKcllQQK4sK9-P-RwHe6mRuPBC5skJi9Zbepk_M2fxvN4DYDxIzTh9HxPay0MYwSatMXW46-IprNyAHqIGYMUTJMXVNGdzkNN-83WU7L8890uddRKN',
  },
  {
    name: 'Artisan Ceramic Mug',
    sub: 'Morning Rituals',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_kWC8Nt5nrobZexBZc1RoAhT__0dTNHRCg0sIDJIavaCx3OBHtGd6ewgJnrKETxeEg4KqBPJ4UZUNwJw9vn3t-lahITo1ILrFssnvSoQjNhGi_dej5vkvRXcNhSU26nl4YLyl4HGdnoZSx9ga3ou8bWNC95ls6iivr1ey7ssRPYDjQqfjvlPUWsLPT5Aqq25LmyE_8reX1CnCzStV3sItMz-UcYb0nTUe9p_GU1krW1OetDDXdgjTQSV0y1nMSxEB_XGqdK1E_W6F',
  },
];

const WHY = [
  { icon: '✦', title: 'Premium Quality',   desc: 'Meticulously sourced materials and artisan finishes for every single component.' },
  { icon: '◈', title: 'Bulk Ordering',     desc: 'Scalable solutions for companies of all sizes, from startups to global enterprises.' },
  { icon: '◎', title: 'Fast Delivery',     desc: 'Efficient logistics ensuring your kits arrive exactly when your new hires do.' },
  { icon: '◐', title: 'Dedicated Support', desc: 'A personal account manager to guide you through curation and delivery.' },
];

const CUSTOM_ITEMS = [
  { icon: '✦', title: 'Logo Branding',      desc: 'Subtle, sophisticated branding using premium engraving and printing techniques.' },
  { icon: '✏', title: 'Personal Messages',  desc: 'Handwritten-style notes or custom digital inserts for a truly personal touch.' },
  { icon: '◈', title: 'Custom Packaging',   desc: 'Branded boxes and eco-friendly wrapping that create an unforgettable unboxing.' },
];

/* ─────────────────────────────────────────────
   CATEGORY CARD  — same 3-D flip as OccasionCard
───────────────────────────────────────────── */
function CategoryCard({ item, index }: { item: typeof CATEGORIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt(12);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotateX: -55, rotateY: index % 2 === 0 ? -24 : 24, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.95, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      className="cursor-pointer"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          boxShadow: hovered
            ? '0 24px 56px rgba(0,0,0,0.16)'
            : '0 4px 16px rgba(0,0,0,0.07)',
          transition: 'box-shadow 0.4s',
        }}
        className="bg-white rounded-sm overflow-hidden border border-gray-100"
      >
        {/* Image */}
        <div className="overflow-hidden h-100 w-full" style={{ aspectRatio: '3/4' }}>
          <motion.img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            style={{ willChange: 'transform' }}
          />
          {/* accent wash */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: item.accent }}
            animate={{ opacity: hovered ? 0.16 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {/* tag */}
          <motion.span
            animate={{ y: hovered ? 0 : -24, opacity: hovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
            style={{ backgroundColor: item.accent }}
          >
            {item.tag}
          </motion.span>
        </div>

        {/* Footer */}
        <div className="p-5 relative overflow-hidden">
          {/* sliding accent bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{ backgroundColor: item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          />
          <h4 className="font-bold text-base mb-1 font-serif leading-snug">{item.name}</h4>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">{item.desc}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-olive">
            <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              Explore
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

        {/* inset border */}
        <div className="absolute inset-0 rounded-sm pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ item, index }: { item: typeof PRODUCTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="cursor-pointer flex-shrink-0"
      style={{ minWidth: 300 }}
    >
      <div className="overflow-hidden rounded-sm mb-4 h-100" style={{ aspectRatio: '1', background: '#f5f5f4' }}>
        <motion.img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1 : 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{ willChange: 'transform' }}
        />
      </div>
      <h4 className="font-serif font-bold text-lg text-gray-900">{item.name}</h4>
      {/* <p className="text-gray-500 text-sm mt-1">{item.sub}</p> */}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   WHY ROW ITEM
───────────────────────────────────────────── */
function WhyItem({ item, index }: { item: typeof WHY[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      style={{
        background: '#fff',
        border: '1px solid rgba(181,162,106,0.18)',
        borderRadius: 4,
        padding: '36px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        position: 'relative',
      }}
    >
      {/* top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.55, delay: index * 0.12 + 0.28, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: '#b5a26a',
          borderRadius: '4px 4px 0 0', transformOrigin: 'left',
        }}
      />
      <span style={{ fontSize: 28, color: '#b5a26a', display: 'block', marginBottom: 16 }}>{item.icon}</span>
      <h5 className="font-serif font-bold text-lg text-gray-900 mb-2">{item.title}</h5>
      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function EmployeeOnboarding() {
  /* parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity   = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springImg = useSpring(imgY,  { stiffness: 60, damping: 22 });
  const springTxt = useSpring(textY, { stiffness: 80, damping: 25 });

  /* tilt for about image */
  const { ref: aboutTiltRef, springX: atX, springY: atY, onMouseMove: atMM, onMouseLeave: atML } = useTilt(6);

  /* section in-view refs */
  const aboutRef  = useRef<HTMLElement>(null);
  const catRef    = useRef<HTMLElement>(null);
  const prodRef   = useRef<HTMLElement>(null);
  const custRef   = useRef<HTMLElement>(null);
  const ctaRef    = useRef<HTMLElement>(null);

  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 });
  const catInView   = useInView(catRef,   { once: false, amount: 0.15 });
  const prodInView  = useInView(prodRef,  { once: false, amount: 0.15 });
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
        {/* parallax background */}
        <motion.div
          style={{ y: springImg, willChange: 'transform' }}
          className="absolute inset-0"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv587IPQUwOmbBxvOooPii6SHfCauO832DoGvj99YWs6oInTYGIt2SH3Wuk-edj9oRSi1-iHtUvfbSY-9oUbia25sxgMSf-sVdK4sqm4f8SxEvW4Lx52WXFSuYKCjIuUIRmvK94ExXGX7dXQS0l8hwRBS6fX6mG6DOSMKi6_ALW6iani8fCFlaQCXh_RGhDkzub5apHvN9qpkmLcr_fWg-3AOgcLWtTVLQznl13GK0jHgbe-WwgIOo4sqfcaY1w84Al-p9AdTtplcR"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ minHeight: '120%', filter: 'brightness(0.48)' }}
          />
          {/* gradient – left darker for legibility */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.22) 55%,rgba(0,0,0,0.06) 100%)' }}
          />
          {/* olive tint at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top,rgba(181,162,106,0.14) 0%,transparent 100%)' }} />
        </motion.div>

        {/* hero text — bottom-left anchored, same as Home */}
        <motion.div
          style={{ y: springTxt, opacity, willChange: 'transform' }}
          className="absolute bottom-20 left-8 md:left-20 z-10 max-w-3xl px-4"
        >
          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.32em] font-bold text-white/60 mb-5 flex items-center gap-3"
          >
            <span className="w-10 h-px bg-brand-olive inline-block" />
            Corporate Solutions
          </motion.p>

          {/* headline — word-by-word flip, same as Home */}
          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.08 }}>
            {['Employee', 'Onboarding'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ rotateX: -90, opacity: 0, y: 40 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                style={{ display: 'block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ rotateX: -90, opacity: 0, y: 40 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{ display: 'block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d', fontStyle: 'italic', fontWeight: 400 }}
            >
              Gifting.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
            className="text-white/80 mt-6 max-w-md text-lg font-light leading-relaxed"
          >
            Make every new beginning memorable with consciously curated gifts that reflect your brand's values from day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.22)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="bg-brand-dark-olive text-white px-9 py-4 rounded-sm font-bold uppercase tracking-widest text-xs"
            >
              Explore Collections
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/contact'}
              className="border border-white/40 text-white px-9 py-4 rounded-sm font-bold uppercase tracking-widest text-xs backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              Request Quote
            </motion.button>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
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

      {/* ── PHILOSOPHY ─────────────────────────── */}
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* image with tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            style={{ perspective: '1200px' }}
          >
            <motion.div
              ref={aboutTiltRef}
              onMouseMove={atMM}
              onMouseLeave={atML}
              style={{ rotateX: atX, rotateY: atY, transformStyle: 'preserve-3d', willChange: 'transform' }}
              className="relative"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlJGvWXIQotMLNkOrlg1A3YQUC-T_fiSWbx1OAMxv5PSrMk3RcFO-K-8qsycz_eVXHMJAEeyVbMpAgC_JKjM3nXAUuvGetaaTZ1v6svLo_eWLyd_3LPT6nEJ40fMfR6Nq_XwcxyedwXeP6QHW0XzOp5-hmwm0ssYqJpIdueNJ7Tm_fcTFcVfbhswkZ8hzpO5wz91FXQywZrYmugzYJ_wqc3LXrfoGexoFyplmMtufxlfU65fB7Ey8ie-aCP42idApzxtCjusNThD7M"
                alt="Philosophy"
                className="w-full rounded-sm shadow-2xl"
                style={{ aspectRatio: '4/5', objectFit: 'cover' }}
              />
              {/* floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.65, delay: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.14)' }}
                className="absolute -bottom-8 -right-6 bg-white p-7 shadow-xl max-w-[220px]"
                style={{ willChange: 'transform' }}
              >
                <p className="italic font-serif text-sm text-brand-dark-olive leading-snug mb-3">
                  "A thoughtful first impression builds loyalty that lasts."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-brand-olive" />
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Ecotwist</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* copy */}
          <div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{ originX: 0 }}
              className="w-20 h-1 bg-brand-olive mb-7"
            />
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.28em] font-bold text-brand-olive mb-4"
            >
              The Philosophy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="text-5xl font-serif leading-tight mb-7"
            >
              The Art of the<br />First Impression
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-gray-600 text-lg leading-relaxed mb-5"
            >
              A new hire's first day sets the tone for their entire journey. In an era of remote and hybrid work, the physical touchpoint of a thoughtfully curated gift bridges the gap between digital onboarding and tangible belonging.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="text-gray-600 text-lg leading-relaxed mb-10"
            >
              At Ecotwist, we believe gifting should be an extension of your company culture — designed to inspire, comfort, and empower your newest team members from the very first unboxing.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.48 }}
              whileHover={{ x: 5, transition: { type: 'spring', stiffness: 340, damping: 22 } }}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border-b-2 border-brand-charcoal/20 hover:border-brand-olive pb-1 transition-colors"
            >
              Learn about our values <ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 bg-brand-beige overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={catInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                style={{ originX: 0 }}
                className="w-20 h-1 bg-brand-olive mb-5"
              />
              <h2 className="text-5xl font-serif leading-tight">Curated Collections</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-olive/70 flex items-center gap-2">
              <span className="w-8 h-px bg-brand-olive/40 inline-block" />
              {CATEGORIES.length} Categories
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7" style={{ perspective: '1600px' }}>
            {CATEGORIES.map((item, i) => (
              <CategoryCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE PRODUCTS ─────────────────── */}
      <section ref={prodRef} className="py-32 px-8 md:px-20 lg:px-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={prodInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-14"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-brand-olive mb-3">The Essentials</p>
              <h2 className="text-5xl font-serif">Signature Pieces</h2>
            </div>
            <motion.a
              whileHover={{ y: -1 }}
              className="font-bold text-xs uppercase tracking-widest border-b-2 border-brand-olive pb-1 cursor-pointer"
            >
              View All
            </motion.a>
          </motion.div>

          {/* horizontal scroll strip */}
          <div className="flex gap-8 overflow-x-auto pb-6" style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {PRODUCTS.map((item, i) => (
              <ProductCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOMIZATION ──────────────────────── */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#2f3528' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={custInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] uppercase tracking-[0.28em] font-bold text-brand-olive/70 mb-4"
            >
              Personalization
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={custInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="text-5xl font-serif text-white leading-tight mb-14"
            >
              Make It<br />
              <span className="italic font-normal" style={{ color: '#b5a26a' }}>Unmistakably Yours.</span>
            </motion.h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate={custInView ? 'show' : 'hidden'}
              className="space-y-10"
            >
              {CUSTOM_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="flex gap-6"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid rgba(181,162,106,0.3)', background: 'rgba(181,162,106,0.07)', color: '#b5a26a', fontSize: 20 }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-white mb-2">{item.title}</h4>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* image */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -20 }}
            animate={custInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 60, rotateY: -20 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            style={{ perspective: '1000px', position: 'relative' }}
          >
            <img
              src="https://i.etsystatic.com/14175065/r/il/aabb82/3677422829/il_570xN.3677422829_quff.jpg"
              alt="Custom branding"
              className="w-full shadow-2xl rounded-sm"
              style={{ aspectRatio: '1', objectFit: 'cover' }}
            />
            {/* floating testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={custInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="absolute -bottom-8 -left-8 bg-white p-7 shadow-2xl"
              style={{ maxWidth: 240 }}
            >
              <p className="italic font-serif text-sm text-brand-dark-olive leading-snug mb-3">
                "The level of customization exceeded our expectations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-5 h-px bg-brand-olive" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Creative Director, Richa Sinha</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY ECOTWIST ───────────────────────── */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-brand-beige">
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
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{ originX: 0 }}
              className="w-20 h-1 bg-brand-olive mb-5"
            />
            <h2 className="text-5xl font-serif">Why Ecotwist</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((item, i) => <WhyItem key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────── */}
      <section className="py-10 px-8 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-9"
          >
            Trusted by forward-thinking companies
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-14 grayscale"
          >
            {['LUMIERE', 'AETHER', 'KINETIC', 'NOIR', 'SOLACE'].map((b) => (
              <span key={b} className="font-serif text-xl text-gray-800 tracking-widest font-bold">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section ref={ctaRef} className="py-10 px-8 text-center bg-brand-off-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="font-serif text-5xl md:text-7xl mb-8 leading-tight"
          >
            Ready to create
            the perfect <span className="italic font-normal">Onboarding</span>
            gift experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join over 50+ forward-thinking companies choosing sustainable onboarding gifting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -3, boxShadow: '0 18px 40px rgba(0,0,0,0.18)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.href = '/configurator'}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="bg-brand-dark-olive text-white px-14 py-6 rounded-sm uppercase tracking-[0.2em] text-xs font-bold shadow-xl"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => window.location.href = '/contact'}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-brand-charcoal uppercase tracking-[0.2em] text-xs font-bold border-b-2 border-brand-charcoal/20 hover:border-brand-olive transition-colors pb-1"
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}