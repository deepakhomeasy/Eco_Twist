import React, { useRef, useState, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring, useMotionValue, useInView,
} from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';

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
    rotateY.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    rotateX.set(-((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  }, [strength, rotateX, rotateY]);
  const onMouseLeave = useCallback(() => { rotateX.set(0); rotateY.set(0); }, [rotateX, rotateY]);
  return { ref, springX, springY, onMouseMove, onMouseLeave };
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const vFadeUp: Variants = { hidden: { opacity: 0, y: 44 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } };
const vStagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };
const vScaleIn: Variants = { hidden: { opacity: 0, scale: 0.6, rotateX: -55 }, show: { opacity: 1, scale: 1, rotateX: 0, transition: { duration: 0.95, ease: EASE } } };
const vSlideLeft: Variants = { hidden: { opacity: 0, x: -48 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };
const vSlideRight: Variants = { hidden: { opacity: 0, x: 48 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };

const ACCENT = '#5b8fa8';
const ACCENT_DARK = '#0a1520';

const PRODUCTS = [
  { name: 'Launch Day Hamper',      sub: 'Starting at ₹1,999',  tag: 'Premium',      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
  { name: 'Branded Tech Essentials', sub: 'Starting at ₹2,999',  tag: 'Customizable', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80' },
  { name: 'Press Kit Box',           sub: 'Starting at ₹3,499',  tag: 'Media',        img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80' },
];

const CATEGORIES = [
  { name: 'VIP Launch Kits',       desc: 'Exclusive hampers for key stakeholders, investors, and media guests at your product debut.', accent: ACCENT, tag: 'VIP', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { name: 'Branded Merchandise',   desc: 'Premium custom merch — apparel, bags, and stationery that puts your new product top of mind.', accent: '#3a6b82', tag: 'Brand', img: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80' },
  { name: 'Media & Press Boxes',   desc: 'Curated unboxing experiences designed to make your launch go viral on social media.', accent: '#2e5571', tag: 'Media', img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80' },
];

const CUSTOM_ITEMS = [
  { icon: '🚀', title: 'Product Integration',   desc: 'Incorporate your actual product sample into the launch gift experience.' },
  { icon: '◈',  title: 'Brand Story Inserts',   desc: 'Beautifully designed inserts that tell your product\'s origin story.' },
  { icon: '📦', title: 'Unboxing Experience',   desc: 'Magnetic closures, custom tissue, and layered reveal packaging.' },
  { icon: '🎥', title: 'QR Code Integration',   desc: 'Scannable codes linking to launch videos, demos, or microsites.' },
];

const WHY = [
  { icon: '🚀', title: 'Launch Impact',       desc: 'Gifts engineered to amplify buzz around your product debut.' },
  { icon: '◈',  title: 'Bulk Ordering',       desc: 'Seamless production for 50 to 5,000+ launch kits.' },
  { icon: '◎',  title: 'Rapid Turnaround',    desc: 'Express timelines available for tight launch windows.' },
  { icon: '✦',  title: 'Brand Storytelling',  desc: 'Every element designed to communicate your brand narrative.' },
  { icon: '◐',  title: 'Launch Consultant',   desc: 'Dedicated expert for your entire gifting journey.' },
];

function CategoryCard({ item, index }: { item: typeof CATEGORIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, springX, springY, onMouseMove, onMouseLeave } = useTilt(12);
  return (
    <motion.div variants={vScaleIn} style={{ perspective: '1400px', transformStyle: 'preserve-3d' }} className="cursor-pointer">
      <motion.div ref={ref} onMouseMove={onMouseMove} onMouseLeave={() => { onMouseLeave(); setHovered(false); }} onMouseEnter={() => setHovered(true)}
        style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', willChange: 'transform',
          boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
        <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
          <motion.img src={item.img} alt={item.name} className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }} transition={{ duration: 0.75, ease: EASE }} style={{ willChange: 'transform' }} />
          <motion.div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: item.accent }}
            animate={{ opacity: hovered ? 0.18 : 0 }} transition={{ duration: 0.4 }} />
          <motion.span animate={{ y: hovered ? 0 : -24, opacity: hovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.18em] font-bold text-white px-3 py-1 rounded-sm"
            style={{ backgroundColor: item.accent }}>{item.tag}</motion.span>
        </div>
        <div className="p-7 relative overflow-hidden">
          <motion.div className="absolute bottom-0 left-0 h-[3px]" style={{ backgroundColor: item.accent }}
            animate={{ width: hovered ? '100%' : '0%' }} transition={{ duration: 0.45, ease: EASE }} />
          <h3 className="font-serif text-2xl mb-2" style={{ color: ACCENT_DARK }}>{item.name}</h3>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color: '#73736e' }}>{item.desc}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT_DARK }}>
            <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>View Collection</motion.span>
            <motion.span animate={{ rotate: hovered ? 45 : 0, x: hovered ? 2 : 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }} style={{ display: 'inline-flex' }}><ArrowRight size={11} /></motion.span>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', borderRadius: 16 }} />
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ item, index }: { item: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 44 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="cursor-pointer" style={{ minWidth: 360, scrollSnapAlign: 'start' }}>
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '1', borderRadius: 16 }}>
        <motion.img src={item.img} alt={item.name} className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.65, ease: EASE }} style={{ willChange: 'transform' }} />
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase text-white px-4 py-1 rounded-full"
          style={{ background: 'rgba(58,107,130,0.88)', backdropFilter: 'blur(6px)', letterSpacing: 2 }}>{item.tag}</span>
      </div>
      <h4 className="font-serif text-xl mb-1" style={{ color: ACCENT_DARK }}>{item.name}</h4>
      {/* <p className="text-sm" style={{ color: '#73736e' }}>{item.sub}</p> */}
    </motion.div>
  );
}

function WhyCard({ item, index }: { item: typeof WHY[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} className="text-center p-6 cursor-pointer">
      <motion.div className="flex items-center justify-center mx-auto mb-5 rounded-full text-3xl" style={{ width: 64, height: 64 }}
        animate={{ background: hovered ? ACCENT : '#e8f0f5', color: hovered ? 'white' : ACCENT_DARK }} transition={{ duration: 0.3 }}>
        {item.icon}
      </motion.div>
      <h4 className="font-bold text-xs uppercase tracking-widest mb-2">{item.title}</h4>
      <p className="text-xs font-light leading-relaxed" style={{ color: '#73736e' }}>{item.desc}</p>
    </motion.div>
  );
}

export default function ProductLaunch() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const springImg = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '32%']), { stiffness: 60, damping: 22 });
  const springTxt = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '18%']), { stiffness: 80, damping: 25 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const { ref: aRef, springX: aX, springY: aY, onMouseMove: aMM, onMouseLeave: aML } = useTilt(6);
  const aboutRef = useRef<HTMLElement>(null);
  const catRef = useRef<HTMLElement>(null);
  const custRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.2 });
  const catInView = useInView(catRef, { once: false, amount: 0.15 });
  const custInView = useInView(custRef, { once: false, amount: 0.15 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  return (
    <div className="overflow-x-hidden" style={{ background: '#f2f6f9', fontFamily: 'inherit' }}>

      {/* HERO */}
      <section ref={heroRef} className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh', perspective: '1400px' }}>
        <motion.div style={{ y: springImg, willChange: 'transform' }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80" alt="Product Launch Hero"
            className="w-full h-full object-cover" style={{ minHeight: '120%', filter: 'brightness(0.48)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,rgba(0,0,0,0.60) 0%,rgba(0,0,0,0.24) 55%,rgba(0,0,0,0.06) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: 'linear-gradient(to top,rgba(91,143,168,0.12) 0%,transparent 100%)' }} />
        </motion.div>

        <motion.div style={{ y: springTxt, opacity: heroOpacity, willChange: 'transform' }}
          className="absolute bottom-20 left-8 md:left-20 z-10 max-w-3xl px-4">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.32em] font-bold text-white/60 mb-5 flex items-center gap-3">
            <span className="w-10 h-px inline-block" style={{ background: '#b5a26a' }} />Corporate Solutions
          </motion.p>
          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1.08 }}>
            {['Product', 'Launch'].map((word, i) => (
              <motion.span key={word} initial={{ rotateX: -90, opacity: 0, y: 40 }} animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15, ease: EASE }}
                style={{ display: 'block', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}>{word}</motion.span>
            ))}
            <motion.span initial={{ rotateX: -90, opacity: 0, y: 40 }} animate={{ rotateX: 0, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              style={{ display: 'block', fontStyle: 'italic', fontWeight: 400, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}>
              Gifting Solutions.
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.8 }}
            className="text-white/80 mt-6 max-w-md text-lg font-light leading-relaxed">
            Make your product launch unforgettable with curated gift experiences that amplify buzz, delight media, and create a lasting brand impression.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 1.05 }}
            className="flex gap-4 mt-10 flex-wrap">
            <motion.button whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 32px rgba(91,143,168,0.45)' }}
              whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 rounded-full"
              style={{ background: ACCENT, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 30px rgba(91,143,168,0.4)' }}>
              Explore Launch Kits
            </motion.button>
             <motion.button
                          whileHover={{ scale: 1.04, y: -2, background: 'white', color: ACCENT_DARK }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                          onClick={() => window.location.href = '/contact'}
                          className="text-white font-bold uppercase tracking-widest text-xs px-9 py-4 rounded-full"
                          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Request Quote
                        </motion.button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 28, background: 'linear-gradient(to bottom,rgba(91,143,168,0.85),transparent)' }} />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section ref={aboutRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f2f6f9' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={vStagger} initial="hidden" animate={aboutInView ? 'show' : 'hidden'}>
            <motion.div variants={vFadeUp}>
              <motion.div initial={{ scaleX: 0 }} animate={aboutInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE }} style={{ originX: 0, height: 3, width: 80, background: ACCENT, marginBottom: 24 }} />
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-4" style={{ color: ACCENT }}>Our Approach</p>
            </motion.div>
            <motion.h2 variants={vFadeUp} className="text-5xl font-serif leading-tight mb-8" style={{ color: ACCENT_DARK }}>
              Launch Experiences<br />That Create Legends
            </motion.h2>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-5" style={{ color: '#73736e' }}>
              A product launch is your brand's defining moment. The gifts you give at launch don't just delight recipients — they become part of your product's story, shared across social feeds, boardrooms, and press rooms.
            </motion.p>
            <motion.p variants={vFadeUp} className="text-lg font-light leading-relaxed mb-10" style={{ color: '#73736e' }}>
              We design launch gifting experiences that are as innovative as the products they celebrate — sustainable, beautifully crafted, and engineered for maximum brand impact.
            </motion.p>
            <motion.div variants={vFadeUp} className="flex items-center gap-4 pt-8" style={{ borderTop: '1px solid #c8dce6' }}>
              <div className="flex items-center justify-center rounded-full text-2xl flex-shrink-0" style={{ width: 48, height: 48, background: '#d9eaf2' }}>🚀</div>
              <p className="font-semibold text-sm" style={{ color: ACCENT }}>Rapid 7-Day Turnaround Available</p>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.85, ease: EASE }} style={{ perspective: '1200px' }}>
            <motion.div ref={aRef} onMouseMove={aMM} onMouseLeave={aML}
              style={{ rotateX: aX, rotateY: aY, transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=80" alt="Product Launch Gifting"
                className="w-full rounded-2xl shadow-2xl" style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section ref={catRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#e4eef4' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={catInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-5xl font-serif mb-4" style={{ color: ACCENT_DARK }}>Launch Gift Collections</h2>
            <p className="font-light text-sm max-w-lg mx-auto" style={{ color: '#73736e' }}>
              Tailored gifting for every stakeholder in your product launch ecosystem.
            </p>
          </motion.div>
          <motion.div variants={vStagger} initial="hidden" animate={catInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1600px' }}>
            {CATEGORIES.map((item, i) => <CategoryCard key={item.name} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: '#f2f6f9' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-serif mb-2" style={{ color: ACCENT_DARK }}>Featured Launch Products</h2>
              <p className="font-light" style={{ color: '#73736e' }}>The most-loved items in our product launch gifting range.</p>
            </div>
            <motion.a whileHover={{ y: -1 }} className="font-bold text-xs uppercase tracking-widest border-b-2 pb-1 cursor-pointer"
              style={{ borderColor: ACCENT, color: ACCENT_DARK }}>View All</motion.a>
          </motion.div>
          <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {PRODUCTS.map((p, i) => <ProductCard key={p.name} item={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* CUSTOMIZATION */}
      <section ref={custRef} className="py-32 px-8 md:px-20 lg:px-32 overflow-hidden" style={{ background: ACCENT_DARK }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={vSlideLeft} initial="hidden" animate={custInView ? 'show' : 'hidden'}>
            <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-white/60 mb-4">Bespoke Experiences</p>
            <h2 className="text-5xl font-serif text-white leading-tight mb-6">
              Engineered for<br /><span style={{ color: '#93c5d8', fontStyle: 'italic', fontWeight: 400 }}>Maximum Impact</span>
            </h2>
            <p className="text-lg font-light leading-relaxed mb-12" style={{ color: 'rgba(212,212,212,0.7)' }}>
              Every element of your launch gift is an extension of your product story. We obsess over the details so your gift becomes a talking point long after launch day.
            </p>
            <motion.div variants={vStagger} initial="hidden" animate={custInView ? 'show' : 'hidden'} className="grid grid-cols-2 gap-8">
              {CUSTOM_ITEMS.map((item) => (
                <motion.div key={item.title} variants={vFadeUp} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center text-lg rounded-lg"
                    style={{ width: 40, height: 40, border: '1px solid rgba(147,197,216,0.3)', color: '#93c5d8' }}>{item.icon}</div>
                  <div>
                    <h5 className="font-semibold text-white text-sm mb-1">{item.title}</h5>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(212,212,212,0.6)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div variants={vSlideRight} initial="hidden" animate={custInView ? 'show' : 'hidden'} style={{ position: 'relative' }}>
            <div className="absolute inset-0 rounded-3xl opacity-40" style={{ background: ACCENT, transform: 'rotate(3deg) scale(0.95)' }} />
            <div className="relative rounded-3xl overflow-hidden p-6" style={{ background: '#e4eef4' }}>
              <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80" alt="Launch Gift Box"
                className="w-full rounded-2xl shadow-xl" style={{ aspectRatio: '1', objectFit: 'cover' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-32 px-8 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-5xl font-serif" style={{ color: ACCENT_DARK }}>Why Choose Ecotwist</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-14 px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.5 }}
            className="text-center text-[9px] uppercase tracking-[0.3em] font-bold mb-10" style={{ color: '#a6a6a1' }}>
            Trusted by Visionary Brands
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }} className="flex flex-wrap justify-center gap-16">
            {['Aether', 'Solace', 'Lumina', 'Vantage', 'Noir'].map(b => (
              <span key={b} className="font-serif text-xl font-bold" style={{ color: '#4d4941', letterSpacing: -0.5 }}>{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-32 px-8 text-center" style={{ background: '#e4eef4' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            animate={ctaInView ? { opacity: 1, letterSpacing: '-0.01em', y: 0 } : { opacity: 0, letterSpacing: '-0.05em', y: 20 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-serif text-5xl md:text-6xl leading-tight mb-6" style={{ color: ACCENT_DARK }}>
            Ready to launch with<br /><span className="italic font-normal">maximum impact?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15 }} className="text-xl font-light leading-relaxed mb-12" style={{ color: '#73736e' }}>
            Let's craft a launch gifting experience that turns heads, creates buzz, and makes your product the talk of the town.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.28 }} className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.button whileHover={{ scale: 1.06, y: -3, boxShadow: '0 18px 40px rgba(91,143,168,0.35)' }}
              whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={() => window.location.href = '/configurator'}
              className="text-white font-bold uppercase tracking-[0.2em] text-xs px-14 py-6 rounded-full shadow-xl"
              style={{ background: ACCENT, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Get Started
            </motion.button>
            <motion.button whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="font-bold uppercase tracking-[0.2em] text-xs pb-1"
              onClick={() => window.location.href = '/contact'}
              style={{ background: 'transparent', border: 'none', borderBottom: '2px solid rgba(91,143,168,0.3)', cursor: 'pointer', fontFamily: 'inherit', color: ACCENT_DARK }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'rgba(91,143,168,0.3)')}>
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}