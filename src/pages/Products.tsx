import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  category: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  badge?: string;
  image: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

// ── Product Data ───────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: 1, category: "Journals", name: "Hand-Pressed Recycled Journal",
    subtitle: "Deckle Edge · Linen Bound", price: 68, originalPrice: 85,
    description: "Individually pressed from 100% post-consumer recycled pulp with deckle edges and 220 unlined cream pages.",
    details: ["220 cream recycled pages","Linen spine handbound","Lay-flat Smyth-sewn","Ribbon bookmark included","Kraft gift sleeve"],
    badge: "Best Seller", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80", rating: 4.9, reviews: 312,
  },
  {
    id: 2, category: "Journals", name: "Leather Executive Notebook",
    subtitle: "Full-Grain Leather · A5 Format", price: 95,
    description: "Full-grain vegetable-tanned leather cover that develops a rich patina over time.",
    details: ["Full-grain leather cover","180 gsm ruled ivory paper","Pen loop & card pocket","Gold foil page edges","Personalisation available"],
    badge: "Premium", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80", rating: 4.8, reviews: 198,
  },
  {
    id: 3, category: "Journals", name: "Botanical Print Journal Set",
    subtitle: "Set of 3 · Floral Press", price: 54, originalPrice: 72,
    description: "A trio of soft-cover journals featuring unique hand-drawn botanical illustrations.",
    details: ["Set of 3 A6 journals","Cotton-press floral covers","100 dotted pages each","Elastic closure band","Vegan materials"],
    image: "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=600&q=80", rating: 4.7, reviews: 145,
  },
  {
    id: 4, category: "Journals", name: "Stone Paper Sketchbook",
    subtitle: "Waterproof · Tear-Resistant", price: 48,
    description: "Made from calcium carbonate stone — no trees, no water used in production.",
    details: ["160 stone-paper pages","Waterproof & tear-resistant","Smooth for all media","Recycled polypropylene cover","Zero water in production"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80", rating: 4.6, reviews: 89,
  },
  {
    id: 5, category: "Organic Teas", name: "Single-Origin Tea Flight",
    subtitle: "6 Varieties · Matte Tins", price: 54,
    description: "Six rare organic teas sourced directly from family estates.",
    details: ["6 × 30g loose-leaf tins","Magnetic matte-black lids","Origin cards included","Certified organic & fair-trade","Caffeine-free option"],
    badge: "New Arrival", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80", rating: 4.9, reviews: 276,
  },
  {
    id: 6, category: "Organic Teas", name: "Ceremony Matcha Set",
    subtitle: "Ceremonial Grade · Hand-Whisked", price: 78,
    description: "Stone-ground shade-grown matcha from Uji, Japan.",
    details: ["30g ceremonial matcha tin","Handmade bamboo chasen whisk","Authentic ceramic chawan","Bamboo chashaku scoop","Whisk holder & guide"],
    badge: "Staff Pick", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80", rating: 5.0, reviews: 204,
  },
  {
    id: 7, category: "Organic Teas", name: "Wellness Herbal Blend Collection",
    subtitle: "Caffeine-Free · 8 Blends", price: 62, originalPrice: 76,
    description: "Eight hand-blended herbal infusions crafted by an in-house herbalist.",
    details: ["8 × 20g pyramid sachets","Zero caffeine all blends","Adaptogen & floral range","Printed recipe booklet","Reusable tin canister"],
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=600&q=80", rating: 4.7, reviews: 132,
  },
  {
    id: 8, category: "Organic Teas", name: "Rare Oolong Collector's Set",
    subtitle: "Taiwan High Mountain · Limited", price: 110,
    description: "High-mountain oolong from 1,500m elevation farms in Alishan, Taiwan.",
    details: ["3 × 25g vacuum-sealed","Alishan & Li Shan cultivars","Tasting notes & brew chart","Wooden presentation box","Limited annual harvest"],
    badge: "Limited", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", rating: 4.9, reviews: 67,
  },
  {
    id: 9, category: "Ceramics", name: "Artisanal Mug & Bowl Set",
    subtitle: "Wheel-Thrown · Ash Glaze", price: 124,
    description: "Each piece wheel-thrown, bisque-fired, and dipped in signature ash glaze. No two alike.",
    details: ["2 mugs + 1 matcha bowl","High-fire stoneware","Food-safe ash glaze","Dishwasher & microwave safe","Kraft gift boxed"],
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80", rating: 4.8, reviews: 189,
  },
  {
    id: 10, category: "Ceramics", name: "Minimalist Bud Vase Trio",
    subtitle: "Hand-Pinched · Matte Finish", price: 88,
    description: "Three hand-pinched bud vases in graduating heights in dusty sage matte glaze.",
    details: ["3 vases: 8cm, 12cm, 16cm","Hand-pinched stoneware","Sage matte glaze","Watertight interior","Linen-wrapped gift set"],
    badge: "New", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", rating: 4.7, reviews: 94,
  },
  {
    id: 11, category: "Ceramics", name: "Executive Desk Planter",
    subtitle: "Slab-Built · Drainage Hole", price: 72, originalPrice: 90,
    description: "Slab-built stoneware planter with a matte charcoal exterior and creamy interior.",
    details: ["15cm diameter planter","Slab-built stoneware","Drainage hole + cork saucer","Charcoal matte exterior","Includes care card"],
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80", rating: 4.6, reviews: 78,
  },
  {
    id: 12, category: "Ceramics", name: "Wabi-Sabi Serving Platter",
    subtitle: "Large Format · Raku Fired", price: 145,
    description: "Raku-fired with a crackle glaze that captures flame and smoke in each unique piece.",
    details: ["35cm oval serving platter","Traditional raku firing","Crackle smoke-effect glaze","Food & oven safe","Signed by the ceramicist"],
    badge: "Artisan", image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80", rating: 4.9, reviews: 52,
  },
  {
    id: 13, category: "Gift Boxes", name: "The Complete Executive Box",
    subtitle: "Journal + Tea + Ceramics", price: 229, originalPrice: 246,
    description: "The full Atelier experience curated into a rigid keepsake box wrapped in botanical tissue.",
    details: ["All 3 signature collections","Rigid foil-stamped lift-off box","Botanical tissue & wax seal","Personalised note card","Complimentary ribbon dressing"],
    badge: "Most Popular", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", rating: 5.0, reviews: 423,
  },
  {
    id: 14, category: "Gift Boxes", name: "Wellness & Calm Gift Set",
    subtitle: "Tea + Ceramics + Candle", price: 148,
    description: "A thoughtfully paired wellness collection — herbal teas, ceramic mug, and soy candle.",
    details: ["Herbal tea blend set","Ceramic mug (wheel-thrown)","Hand-poured soy candle","Linen-wrapped box","Care & ritual guide"],
    badge: "Gift Ready", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80", rating: 4.9, reviews: 317,
  },
  {
    id: 15, category: "Gift Boxes", name: "The Writer's Studio Box",
    subtitle: "Journal + Pen + Wax Seal Kit", price: 118, originalPrice: 138,
    description: "Everything the thoughtful writer needs — journal, brass pen, and personalised wax seal set.",
    details: ["Hand-pressed recycled journal","Solid brass rollerball pen","Custom wax seal + 3 waxes","Ink blotter & writing guide","Embossed presentation box"],
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&q=80", rating: 4.8, reviews: 201,
  },
  {
    id: 16, category: "Gift Boxes", name: "Desk Sanctuary Collection",
    subtitle: "Planter + Vase + Candle", price: 165,
    description: "Transform any workspace into a sanctuary — planter, bud vase, and room candle.",
    details: ["Ceramic desk planter","Bud vase (sage glaze)","Room candle (250ml)","Pressed flower seed paper","Rigid gift box, foil-stamped"],
    badge: "New", image: "https://images.unsplash.com/photo-1600181957619-1a6b1e23f5a9?w=600&q=80", rating: 4.7, reviews: 88,
  },
  {
    id: 17, category: "Extras", name: "Hand-Poured Soy Candle",
    subtitle: "Cedarwood & Bergamot", price: 42,
    description: "250ml glass vessel with 100% natural soy wax, pure cotton wick, cedarwood & bergamot.",
    details: ["250ml natural soy wax","Pure cotton wick","40+ hour burn time","Cedarwood & bergamot","Reusable glass vessel"],
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80", rating: 4.8, reviews: 256,
  },
  {
    id: 18, category: "Extras", name: "Brass Rollerball Pen",
    subtitle: "Solid Brass · German Refill", price: 55,
    description: "Machined from solid brass with a satin-brushed finish that ages beautifully.",
    details: ["Solid brass barrel","Satin-brushed finish","German rollerball refill","Magnetic cap closure","Velvet pen pouch"],
    badge: "Luxury", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80", rating: 4.9, reviews: 143,
  },
  {
    id: 19, category: "Extras", name: "Wax Seal Monogram Kit",
    subtitle: "Custom Initial · 4 Wax Colours", price: 38, originalPrice: 48,
    description: "Personalised monogram stamp in solid brass with rosewood handle and four sealing wax sticks.",
    details: ["Custom brass monogram stamp","Rosewood grip handle","4 wax stick colours","Melting spoon included","Velvet-lined gift tin"],
    image: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=600&q=80", rating: 4.7, reviews: 97,
  },
  {
    id: 20, category: "Extras", name: "Linen Desk Tray Set",
    subtitle: "Handwoven · Natural Fibre", price: 58,
    description: "Handwoven natural linen trays in two sizes for organising any executive desk.",
    details: ["Set of 2 (A4 + A6 size)","Natural handwoven linen","Leather tab handles","Non-slip base pad","Folds flat for gifting"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80", rating: 4.6, reviews: 74,
  },
];

const categories = ["All", "Journals", "Organic Teas", "Ceramics", "Gift Boxes", "Extras"];

const testimonials = [
  { quote: "Sent these to our top 20 clients after Q4. Three wrote back the same day. That never happens.", author: "Priya S.", role: "VP Partnerships, Meridian Group", avatar: "PS" },
  { quote: "The ceramics set arrived wrapped like a museum piece. Every detail said we actually thought about this.", author: "James K.", role: "Chief of Staff, Lune Capital", avatar: "JK" },
  { quote: "The journals are on every exec's desk now. Organic, intentional, beautiful.", author: "Mara T.", role: "Head of Culture, Verdant Co.", avatar: "MT" },
  { quote: "Our clients keep asking where the teas came from. That's the best compliment a gift can get.", author: "Arjun R.", role: "Director, Apex Consulting", avatar: "AR" },
];

// ── Scroll-Reveal Hook ─────────────────────────────────────────────────────
function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Animated Counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal<HTMLSpanElement>();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Stars ─────────────────────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="11" height="11" viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? "#c8a96e" : "none"} stroke="#c8a96e" strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ))}
  </div>
);

// ── Magnetic Button ───────────────────────────────────────────────────────
function MagneticBtn({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  }, []);
  return (
    <button ref={btnRef} className={className} onClick={onClick}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s, color 0.3s, border-color 0.3s" }}>
      {children}
    </button>
  );
}

// ── Custom Cursor ─────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const lerp = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(lerp);
    };
    const onEnter = () => {
      if (ringRef.current) { ringRef.current.style.width = "56px"; ringRef.current.style.height = "56px"; ringRef.current.style.opacity = "0.6"; }
    };
    const onLeave = () => {
      if (ringRef.current) { ringRef.current.style.width = "36px"; ringRef.current.style.height = "36px"; ringRef.current.style.opacity = "0.35"; }
    };
    document.querySelectorAll("a, button, [data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(lerp);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: "6px", height: "6px",
        background: "#c8a96e", borderRadius: "50%", pointerEvents: "none",
        zIndex: 9999, marginLeft: "-3px", marginTop: "-3px", mixBlendMode: "multiply",
        transition: "width 0.2s, height 0.2s",
      }} /> */}
      {/* <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: "36px", height: "36px",
        border: "1.5px solid #c8a96e", borderRadius: "50%", pointerEvents: "none",
        zIndex: 9998, marginLeft: "-18px", marginTop: "-18px", opacity: 0.35,
        transition: "width 0.35s cubic-bezier(0.25,0.46,0.45,0.94), height 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s",
      }} /> */}
    </>
  );
}

// ── Particle Canvas ───────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string; };
    const colors = ["#c8a96e","#7a9e7e","#e8e4dd","#b87355"];
    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let frame: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5 || p.x > W + 5) p.vx *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    tick();

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}

// ── Parallax Image ────────────────────────────────────────────────────────
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = center * 0.12;
      const img = el.querySelector("img") as HTMLImageElement;
      if (img) img.style.transform = `scale(1.12) translateY(${shift}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" style={{ transition: "transform 0.1s linear" }} />
    </div>
  );
}

// ── Splitting Text Reveal ─────────────────────────────────────────────────
function SplitTextReveal({ text, className, visible, baseDelay = 0, stagger = 30 }: {
  text: string; className?: string; visible: boolean; baseDelay?: number; stagger?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} aria-hidden="true" style={{
          display: "inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(30px) rotateX(-60deg)",
          transition: `opacity 0.5s ease ${baseDelay + i * stagger}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * stagger}ms`,
          transformStyle: "preserve-3d",
          whiteSpace: char === " " ? "pre" : "normal",
        }}>{char}</span>
      ))}
    </span>
  );
}

// ── Tilt Card ─────────────────────────────────────────────────────────────
const TiltCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}>(function TiltCard({ children, className, style, onMouseEnter: extEnter, onMouseLeave: extLeave }, forwardedRef) {
  const innerRef = useRef<HTMLDivElement>(null);
  // Support both the forwarded ref and the internal one
  const setRef = (el: HTMLDivElement | null) => {
    (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(4px)`;
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (innerRef.current) innerRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    extLeave?.(e);
  };
  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => { extEnter?.(e); };
  return (
    <div ref={setRef} className={className} style={{ ...style, transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease" }}
      onMouseMove={handleMove} onMouseLeave={handleLeave} onMouseEnter={handleEnter}>
      {children}
    </div>
  );
});

// ── Ripple Button ─────────────────────────────────────────────────────────
function RippleBtn({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current; if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.25);left:${x - size/2}px;top:${y - size/2}px;transform:scale(0);animation:rippleAnim 0.6s ease-out forwards;pointer-events:none;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.();
  };
  return (
    <button ref={btnRef} className={className} onClick={handleClick}
      style={{ position: "relative", overflow: "hidden", transition: "background 0.3s, color 0.3s, transform 0.2s, box-shadow 0.3s" }}>
      {children}
    </button>
  );
}

// ── Glitch Text ───────────────────────────────────────────────────────────
function GlitchBadge({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="relative inline-block" style={{ animation: glitching ? "glitchAnim 0.3s steps(2) both" : "none" }}>
      {text}
    </span>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product, index, onQuickView, onWishlist, onAddToCart, wishlisted }: {
  product: Product; index: number;
  onQuickView: (p: Product) => void;
  onWishlist: (id: number) => void;
  onAddToCart: (p: Product) => void;
  wishlisted: boolean;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(0.1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const delay = (index % 8) * 80;

  return (
    <TiltCard
      ref={ref}
      className="bg-white border border-[#e8e4dd] rounded-sm overflow-hidden group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        boxShadow: hovered ? "0 24px 48px rgba(28,43,30,0.14), 0 8px 16px rgba(28,43,30,0.08)" : "0 2px 8px rgba(28,43,30,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f5f0e8] h-56">
        <img src={product.image} alt={product.name} loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
            opacity: imgLoaded ? 1 : 0,
          }} />

        {/* Shimmer loader */}
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(28,43,30,0.1) 0%, transparent 60%)" }} />

        {product.badge && (
          <span className="absolute top-3 left-3 font-body text-[9px] tracking-widest uppercase bg-[#1c2b1e] text-white px-2.5 py-1"
            style={{ animation: visible ? "badgePop 0.4s ease both" : "none", animationDelay: `${delay + 200}ms` }}>
            <GlitchBadge text={product.badge} />
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3"
          style={{ background: hovered ? "rgba(28,43,30,0.55)" : "rgba(28,43,30,0)", transition: "background 0.4s ease" }}>
          <button onClick={() => onQuickView(product)}
            className="bg-white text-[#1c2b1e] font-body text-[10px] tracking-widest uppercase px-4 py-2.5 hover:bg-[#c8a96e] hover:text-white"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0) scale(1)" : "translateY(14px) scale(0.9)",
              transition: "opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.22,1,0.36,1) 0.05s, background 0.2s",
            }}>
            Quick View
          </button>
          <button onClick={() => onWishlist(product.id)}
            className={`w-9 h-9 flex items-center justify-center text-base ${wishlisted ? "bg-[#b87355] text-white" : "bg-white text-[#1c2b1e] hover:bg-[#b87355] hover:text-white"}`}
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0) scale(1)" : "translateY(14px) scale(0.9)",
              transition: "opacity 0.3s ease 0.1s, transform 0.35s cubic-bezier(0.22,1,0.36,1) 0.1s, background 0.2s",
            }}>
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>

        {/* Shimmer sweep on hover */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.7s ease",
        }} />
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="font-body text-[10px] tracking-widest uppercase text-[#7a9e7e] mb-1">{product.category}</p>
        <h3 className="font-display text-[17px] font-light text-[#1c2b1e] leading-snug mb-1">{product.name}</h3>
        <p className="font-body text-xs text-[#8c8880] mb-3">{product.subtitle}</p>
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={product.rating} />
          <span className="font-body text-[10px] text-[#8c8880]">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {/* <span className="font-display text-xl font-light text-[#1c2b1e]">${product.price}</span>
            {product.originalPrice && (
              <span className="font-body text-xs text-[#8c8880] line-through">${product.originalPrice}</span>
            )} */}
          </div>
          <RippleBtn
            onClick={() => onAddToCart(product)}
            className="font-body text-[10px] tracking-widest uppercase bg-[#1c2b1e] text-white px-3 py-2 hover:bg-[#c8a96e]">
            Order Now
          </RippleBtn>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ExecutiveGiftPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [introPhase, setIntroPhase] = useState(0); // 0=curtain, 1=reveal, 2=done
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroScrollY, setHeroScrollY] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Intro animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase(1), 300);
    const t2 = setTimeout(() => setIntroPhase(2), 1600);
    const t3 = setTimeout(() => { setHeroVisible(true); setCursorVisible(true); }, 400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Scroll watcher
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setHeroScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = quickView ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [quickView]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastKey(k => k + 1);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const toggleWishlist = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filtered = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const { ref: statsRef, visible: statsVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: bannersRef, visible: bannersVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: testimonialsRef, visible: testimonialsVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: ctaRef, visible: ctaVisible } = useScrollReveal<HTMLDivElement>();

  // Hero parallax offset
  const heroParallax = heroScrollY * 0.35;

  return (
    <div className="min-h-screen bg-[#faf8f4]" style={{ fontFamily: "'Jost', system-ui, sans-serif" }}>

      {/* ══════════ GLOBAL STYLES ══════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Core Keyframes ── */
        @keyframes heroLine     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroFade     { from{opacity:0} to{opacity:1} }
        @keyframes slideRight   { from{opacity:0;transform:translateX(48px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastPop     { from{opacity:0;transform:translateY(14px) scale(0.94)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes scaleIn      { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes badgePop     { from{opacity:0;transform:scale(0.7) rotate(-6deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
        @keyframes shimmer      { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.5);opacity:0} }
        @keyframes spinSlow     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes rippleAnim   { to{transform:scale(1);opacity:0} }
        @keyframes countUp      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ── NEW TOP-CLASS ANIMATIONS ── */

        /* 1. Cinematic intro curtain - dual panels split from center */
        @keyframes curtainLeft  {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes curtainRight {
          0%   { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .curtain-left  { animation: curtainLeft  1s cubic-bezier(0.87,0,0.13,1) forwards; }
        .curtain-right { animation: curtainRight 1s cubic-bezier(0.87,0,0.13,1) forwards; }

        /* 2. Morphing gradient orbs behind hero */
        @keyframes orbDrift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.15); }
          66%      { transform: translate(-20px,20px) scale(0.9); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-35px,25px) scale(1.1); }
          66%      { transform: translate(25px,-15px) scale(0.95); }
        }
        @keyframes orbDrift3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,40px) scale(1.2); }
        }

        /* 3. Logo reveal: mask wipe */
        @keyframes logoReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .logo-reveal { animation: logoReveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both; }

        /* 4. Text scramble on hover (CSS-only approximation with clip-path) */
        @keyframes textClipReveal {
          from { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
          to   { clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 100%); }
        }

        /* 5. Hero line stagger with blur */
        @keyframes heroLineBlur {
          from { opacity:0; transform:translateY(20px); filter:blur(8px); }
          to   { opacity:1; transform:translateY(0); filter:blur(0); }
        }

        /* 6. Nav items cascade */
        @keyframes navCascade {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* 7. Category banner perspective flip-in */
        @keyframes flipIn {
          from { opacity:0; transform:perspective(600px) rotateX(-25deg) translateY(20px); }
          to   { opacity:1; transform:perspective(600px) rotateX(0deg) translateY(0); }
        }

        /* 8. Testimonial card morph */
        @keyframes cardMorph {
          from { opacity:0; transform:translateY(32px) scale(0.93) rotate(-1deg); }
          to   { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
        }

        /* 9. Stats digit flip */
        @keyframes digitFlip {
          from { opacity:0; transform:rotateX(-90deg) scale(0.8); }
          to   { opacity:1; transform:rotateX(0deg) scale(1); }
        }

        /* 10. Glitch effect for badges */
        @keyframes glitchAnim {
          0%   { clip-path:inset(20% 0 60% 0); transform:translate(-2px, 0); }
          20%  { clip-path:inset(60% 0 10% 0); transform:translate(2px, 0); }
          40%  { clip-path:inset(10% 0 70% 0); transform:translate(-1px, 0); }
          60%  { clip-path:inset(70% 0 5% 0);  transform:translate(1px, 0); }
          80%  { clip-path:inset(5% 0 80% 0);  transform:translate(-2px, 0); }
          100% { clip-path:inset(0); transform:translate(0); }
        }

        /* 11. CTA section floating text */
        @keyframes ctaFloat {
          0%,100% { transform:translateY(0) rotate(-0.5deg); }
          50%      { transform:translateY(-12px) rotate(0.5deg); }
        }

        /* 12. Cart item slide-stack */
        @keyframes stackIn {
          from { opacity:0; transform:translateX(24px) scale(0.95); }
          to   { opacity:1; transform:translateX(0) scale(1); }
        }

        /* 13. Gold shimmer sweep on price */
        @keyframes goldSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* 14. Underline draw for nav */
        @keyframes underlineDraw {
          from { transform:scaleX(0); transform-origin:left; }
          to   { transform:scaleX(1); transform-origin:left; }
        }

        /* 15. Scroll indicator bounce */
        @keyframes scrollBounce {
          0%,100% { transform:translateY(0) translateX(-50%); opacity:1; }
          50%      { transform:translateY(10px) translateX(-50%); opacity:0.5; }
        }

        /* 16. Page progress bar */
        @keyframes progressFill { from{width:0} to{width:var(--progress)} }

        /* 17. Hero image mosaic stagger with 3D depth */
        @keyframes mosaicReveal {
          from { opacity:0; transform:perspective(600px) translateZ(-40px) translateY(20px); }
          to   { opacity:1; transform:perspective(600px) translateZ(0) translateY(0); }
        }

        /* 18. Section heading with ink bleed */
        @keyframes inkBleed {
          from { letter-spacing:0.4em; opacity:0; }
          to   { letter-spacing:normal; opacity:1; }
        }

        /* ── Utility Classes ── */
        .slide-right  { animation: slideRight 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both; }
        .scale-in     { animation: scaleIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both; }
        .toast-in     { animation: toastPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .hero-line    { animation: heroLineBlur 0.75s cubic-bezier(0.22,1,0.36,1) both; }

        /* Shimmer skeleton */
        .shimmer {
          background: linear-gradient(90deg,#f0ebe3 25%,#faf8f4 50%,#f0ebe3 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        /* Nav underline hover */
        .nav-link { position: relative; }
        .nav-link::after {
          content: ""; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1px; background: #1c2b1e;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        /* Category tab ink wipe */
        .cat-btn { position: relative; overflow: hidden; }
        .cat-btn::before {
          content: ""; position: absolute; inset: 0;
          background: #1c2b1e; transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
          z-index: 0;
        }
        .cat-btn:hover::before, .cat-btn.active::before { transform: scaleX(1); }
        .cat-btn span { position: relative; z-index: 1; }

        /* Float variants */
        .float-1 { animation: float 4s ease-in-out infinite; }
        .float-2 { animation: float 5.5s ease-in-out infinite 1s; }
        .float-3 { animation: float 3.8s ease-in-out infinite 0.5s; }

        /* Gold price shimmer */
        .price-shimmer {
          background: linear-gradient(90deg, #1c2b1e 30%, #c8a96e 50%, #1c2b1e 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldSweep 3s linear infinite;
        }

        /* Testimonial hover */
        .testimonial-card {
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-6px) rotate(0.3deg);
          box-shadow: 0 20px 48px rgba(28,43,30,0.12);
        }

        /* Magnetic orbs */
        .orb-1 { animation: orbDrift1 8s ease-in-out infinite; }
        .orb-2 { animation: orbDrift2 11s ease-in-out infinite 2s; }
        .orb-3 { animation: orbDrift3 9s ease-in-out infinite 4s; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 2px; }

        /* Cursor override for custom cursor */
      

        /* CTA float */
        .cta-float { animation: ctaFloat 6s ease-in-out infinite; }
      `}</style>

      {/* ══════════ CUSTOM CURSOR ══════════ */}
      {cursorVisible && <CustomCursor />}

      {/* ══════════ INTRO CURTAIN ══════════ */}
      {introPhase < 2 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", pointerEvents: "none" }}>
          <div style={{
            width: "50%", height: "100%", background: "#1c2b1e",
            ...(introPhase === 1 ? { animation: "curtainLeft 1s cubic-bezier(0.87,0,0.13,1) 0.1s forwards" } : {}),
          }} />
          <div style={{
            width: "50%", height: "100%", background: "#1c2b1e",
            ...(introPhase === 1 ? { animation: "curtainRight 1s cubic-bezier(0.87,0,0.13,1) 0.1s forwards" } : {}),
          }} />
          {/* Centered logo during curtain */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: introPhase === 0 ? 1 : 0, transition: "opacity 0.5s ease",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#c8a96e", fontWeight: 300, letterSpacing: "0.3em" }}>ATELIER</p>
              <div style={{ width: "40px", height: "1px", background: "#c8a96e", margin: "12px auto", animation: "shimmer 1s ease infinite" }} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#7a9e7e", letterSpacing: "0.4em", textTransform: "uppercase" }}>Gifted</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SCROLL PROGRESS BAR ══════════ */}
      <ScrollProgressBar />

      {/* ══════════ TOAST ══════════ */}
      {toastMsg && (
        <div key={toastKey} className="toast-in fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1c2b1e] text-white text-sm px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap"
          style={{ boxShadow: "0 8px 32px rgba(28,43,30,0.4)" }}>
          <span className="w-5 h-5 rounded-full bg-[#7a9e7e] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {toastMsg}
        </div>
      )}

      {/* ══════════ QUICK VIEW MODAL ══════════ */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          style={{ animation: "heroFade 0.25s ease both" }}
          onClick={() => setQuickView(null)}>
          <div className="scale-in bg-white max-w-3xl w-full rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 overflow-hidden bg-[#f5f0e8] flex-shrink-0 h-64 md:h-auto relative">
              <img src={quickView.image} alt={quickView.name} className="w-full h-full object-cover"
                style={{ transition: "transform 0.7s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-body text-[10px] tracking-widest uppercase text-[#7a9e7e]" style={{ animation: "inkBleed 0.5s ease both" }}>{quickView.category}</span>
                  <button onClick={() => setQuickView(null)}
                    className="text-[#8c8880] hover:text-[#1c2b1e] text-2xl leading-none ml-4"
                    style={{ transition: "transform 0.25s ease, color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "rotate(90deg) scale(1.2)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1)")}>×</button>
                </div>
                <h3 className="font-display text-2xl font-light text-[#1c2b1e] mb-1" style={{ animation: "heroLineBlur 0.6s ease 0.1s both" }}>{quickView.name}</h3>
                <p className="font-body text-xs text-[#8c8880] mb-3" style={{ animation: "heroLine 0.5s ease 0.2s both" }}>{quickView.subtitle}</p>
                <div className="flex items-center gap-2 mb-4" style={{ animation: "heroLine 0.5s ease 0.3s both" }}>
                  <Stars rating={quickView.rating} />
                  <span className="font-body text-xs text-[#8c8880]">{quickView.rating} ({quickView.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4" style={{ animation: "heroLine 0.5s ease 0.35s both" }}>
                  <span className="font-display text-3xl font-light price-shimmer">${quickView.price}</span>
                  {quickView.originalPrice && <span className="font-body text-sm text-[#8c8880] line-through">${quickView.originalPrice}</span>}
                </div>
                <p className="font-body text-sm text-[#555] leading-relaxed mb-5" style={{ animation: "heroLine 0.5s ease 0.4s both" }}>{quickView.description}</p>
                <ul className="space-y-2 mb-6">
                  {quickView.details.map((d, i) => (
                    <li key={i} className="flex items-center gap-2 font-body text-xs text-[#555]"
                      style={{ animation: "heroLine 0.4s ease both", animationDelay: `${0.45 + i * 0.06}s` }}>
                      <span className="text-[#7a9e7e] flex-shrink-0" style={{ animation: `float ${2.5 + i * 0.3}s ease-in-out infinite` }}>✦</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <RippleBtn onClick={() => { addToCart(quickView); setQuickView(null); }}
                  className="w-full bg-[#1c2b1e] text-white font-body text-xs tracking-widest uppercase py-4 hover:bg-[#2e4a32]">
                  Add to Cart — ${quickView.price}
                </RippleBtn>
                <button onClick={() => toggleWishlist(quickView.id)}
                  className={`w-full border font-body text-xs tracking-widest uppercase py-3 transition-all duration-300 ${
                    wishlist.includes(quickView.id) ? "border-[#b87355] text-[#b87355]" : "border-[#e8e4dd] text-[#8c8880] hover:border-[#1c2b1e] hover:text-[#1c2b1e]"
                  }`}
                  style={{ transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                  {wishlist.includes(quickView.id) ? "♥ Wishlisted" : "♡ Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CART DRAWER ══════════ */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex" style={{ animation: "heroFade 0.2s ease both" }}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="slide-right w-full max-w-sm bg-[#faf8f4] h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#e8e4dd]">
              <div style={{ animation: "heroLine 0.5s ease both" }}>
                <h2 className="font-display text-2xl font-light text-[#1c2b1e]">Your Cart</h2>
                <p className="font-body text-xs text-[#8c8880]">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="text-[#8c8880] hover:text-[#1c2b1e] text-3xl leading-none"
                style={{ transition: "transform 0.25s ease, color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(90deg) scale(1.2)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "rotate(0) scale(1)")}>×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-16" style={{ animation: "heroLine 0.5s ease both" }}>
                  <p className="text-5xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>🎁</p>
                  <p className="font-body text-sm text-[#8c8880]">Your cart is empty</p>
                </div>
              ) : cart.map((item, i) => (
                <div key={item.id} className="flex gap-4 items-start border-b border-[#e8e4dd] pb-5"
                  style={{ animation: "stackIn 0.4s ease both", animationDelay: `${i * 70}ms` }}>
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08) rotate(1deg)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-[#1c2b1e] truncate">{item.name}</p>
                    <p className="font-body text-xs text-[#8c8880] mt-0.5">Qty: {item.quantity}</p>
                    <p className="font-display text-lg font-light price-shimmer mt-1">${item.price * item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="text-[#8c8880] hover:text-red-500 mt-1 text-sm"
                    style={{ transition: "color 0.2s, transform 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3) rotate(10deg)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1) rotate(0)")}>✕</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="px-8 py-6 border-t border-[#e8e4dd]">
                <div className="flex justify-between mb-2">
                  <span className="font-body text-xs tracking-widest uppercase text-[#8c8880]">Subtotal</span>
                  <span className="font-display text-2xl font-light price-shimmer">${cartTotal}</span>
                </div>
                <p className="font-body text-xs text-[#8c8880] mb-5">Free shipping on orders over $150</p>
                <RippleBtn className="w-full bg-[#1c2b1e] text-white font-body text-xs tracking-widest uppercase py-4 hover:bg-[#2e4a32] mb-3 block">
                  Checkout
                </RippleBtn>
                <button onClick={() => setCartOpen(false)}
                  className="w-full border border-[#e8e4dd] text-[#8c8880] font-body text-xs tracking-widest uppercase py-3 hover:border-[#1c2b1e] hover:text-[#1c2b1e] transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: navScrolled ? "rgba(250,248,244,0.97)" : "rgba(250,248,244,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: navScrolled ? "1px solid #e8e4dd" : "1px solid transparent",
        boxShadow: navScrolled ? "0 2px 24px rgba(28,43,30,0.06)" : "none",
        transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
      }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 logo-reveal">
            <span className="font-display text-xl tracking-widest text-[#1c2b1e]">ATELIER</span>
            <span className="font-body text-xs tracking-[0.3em] text-[#8c8880] ml-2 uppercase hidden sm:inline">Gifted</span>
          </div>
          {/* Search */}
          <div className="flex-1 max-w-xs hidden md:flex items-center border border-[#e8e4dd] bg-white px-4 py-2 gap-2"
            style={{ animation: "navCascade 0.5s ease 0.9s both", transition: "border-color 0.2s, box-shadow 0.2s" }}
            onFocus={e => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(200,169,110,0.25)")}
            onBlur={e => (e.currentTarget.style.boxShadow = "none")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8c8880" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search gifts..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 font-body text-xs text-[#1c2b1e] bg-transparent outline-none placeholder-[#8c8880]" />
          </div>
          {/* Links */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex gap-5 font-body text-xs tracking-widest uppercase text-[#8c8880]">
              {["Shop", "Reviews"].map((link, i) => (
                <a key={link} href={link === "Shop" ? "#products" : "#testimonials"}
                  className="nav-link hover:text-[#1c2b1e] transition-colors"
                  style={{ animation: `navCascade 0.5s ease ${0.7 + i * 0.1}s both` }}>
                  {link}
                </a>
              ))}
            </div>
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 font-body text-xs tracking-widest uppercase text-[#1c2b1e] hover:text-[#7a9e7e]"
              style={{ animation: "navCascade 0.5s ease 1.0s both", transition: "color 0.2s, transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#b87355] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                  style={{ animation: "badgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#1c2b1e] text-white" style={{ minHeight: "90vh" }}>
        {/* Morphing gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="orb-1 absolute" style={{
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,158,126,0.18) 0%, transparent 70%)",
            top: "-100px", right: "10%",
          }} />
          <div className="orb-2 absolute" style={{
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)",
            bottom: "0", left: "5%",
          }} />
          <div className="orb-3 absolute" style={{
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(184,115,85,0.1) 0%, transparent 70%)",
            top: "30%", left: "30%",
          }} />
        </div>

        {/* BG image with parallax */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1400&q=60')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: heroVisible ? 0.2 : 0,
          transform: `translateY(${heroParallax}px) scale(1.1)`,
          transition: "opacity 1.2s ease",
        }} />

        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(28,43,30,0.7) 0%, rgba(28,43,30,0.3) 60%, rgba(28,43,30,0.6) 100%)",
          zIndex: 2,
        }} />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 2, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center" style={{ zIndex: 3 }}>
          {/* Text Column */}
          <div>
            <p className="font-body text-xs tracking-[0.5em] uppercase text-[#7a9e7e] mb-5"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s" }}>
              Executive Gift Collections
            </p>

            {/* 3D split text headline */}
            <div className="mb-2" style={{ perspective: "600px" }}>
              <div className="overflow-hidden">
                <h1 className="font-display font-light leading-[1.1]"
                  style={{ fontSize: "clamp(2.5rem,5.5vw,4.5rem)", animation: heroVisible ? "heroLineBlur 0.8s ease 0.3s both" : "none" }}>
                  Gifts that
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-display font-light leading-[1.05] italic text-[#c8a96e]"
                  style={{ fontSize: "clamp(3rem,7vw,5.5rem)", animation: heroVisible ? "heroLineBlur 0.8s ease 0.45s both" : "none" }}>
                  speak
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-display font-light leading-[1.1]"
                  style={{ fontSize: "clamp(2.5rem,5.5vw,4.5rem)", animation: heroVisible ? "heroLineBlur 0.8s ease 0.6s both" : "none" }}>
                  without words.
                </h1>
              </div>
            </div>

            {/* Animated divider line */}
            <div style={{
              height: "1px", background: "linear-gradient(90deg, #c8a96e, transparent)",
              width: heroVisible ? "120px" : "0px",
              transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.8s",
              marginBottom: "20px",
            }} />

            <p className="font-body text-[#c8c4bb] text-base leading-relaxed max-w-md mb-10 font-light"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.85s, transform 0.7s ease 0.85s" }}>
              20 curated pieces — hand-pressed journals, single-origin teas, artisanal ceramics & bespoke gift boxes for executives who value craft over consumption.
            </p>

            <div className="flex flex-wrap gap-4"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 1s, transform 0.6s ease 1s" }}>
              <a href="#products"
                className="font-body text-xs tracking-widest uppercase bg-white text-[#1c2b1e] px-8 py-4"
                style={{ transition: "background 0.3s, color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.background = "#c8a96e"; e.currentTarget.style.color = "white"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#1c2b1e"; e.currentTarget.style.boxShadow = "none"; }}>
                Shop All 20 Products
              </a>
              <a href="#products" onClick={() => setActiveCategory("Gift Boxes")}
                className="font-body text-xs tracking-widest uppercase border border-white/30 text-white px-8 py-4"
                style={{ transition: "border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}>
                View Gift Boxes →
              </a>
            </div>
          </div>

          {/* Hero image mosaic with 3D depth stagger */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[products[12], products[5], products[1], products[8]].map((p, i) => (
              <div key={p.id}
                className={`overflow-hidden rounded-sm ${i === 0 ? "col-span-2 h-40" : "h-32"}`}
                style={{
                  animation: heroVisible ? `mosaicReveal 0.8s cubic-bezier(0.22,1,0.36,1) ${0.5 + i * 0.12}s both` : "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03) translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100"
                  style={{ transition: "opacity 0.4s ease, transform 0.7s ease, transform 0.7s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="relative border-t border-white/10" style={{ zIndex: 3 }}>
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[["20","+","Curated Products"],["100","%","Organic & Recycled"],["40","+","Artisan Makers"],["12","k+","Happy Recipients"]].map(([n,s,l], i) => (
              <div key={l} style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms`,
                animation: statsVisible ? `digitFlip 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both` : "none",
              }}>
                <p className="font-display text-3xl font-light text-[#c8a96e]">
                  {statsVisible ? <AnimatedCounter target={parseInt(n)} suffix={s} /> : "0"}
                </p>
                <p className="font-body text-[10px] tracking-widest uppercase text-[#8c8880] mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%",
          animation: "scrollBounce 2s ease-in-out infinite",
          zIndex: 3, opacity: heroVisible ? 1 : 0, transition: "opacity 0.5s ease 1.5s",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="5.5" y="0.5" width="5" height="10" rx="2.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              <rect x="7" y="2" width="2" height="3" rx="1" fill="rgba(200,169,110,0.7)" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}/>
              <path d="M8 16l-3 4h6l-3-4z" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════ CATEGORY BANNERS ══════════ */}
      <section ref={bannersRef} className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-4">
        {[
          { cat: "Journals", img: products[0].image, span: "md:col-span-2" },
          { cat: "Organic Teas", img: products[4].image, span: "md:col-span-1" },
          { cat: "Ceramics", img: products[8].image, span: "md:col-span-1" },
          { cat: "Gift Boxes", img: products[12].image, span: "md:col-span-1" },
        ].map((b, i) => (
          <button key={b.cat}
            onClick={() => { setActiveCategory(b.cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
            className={`relative overflow-hidden rounded-sm group text-left h-40 ${b.span}`}
            style={{
              animation: bannersVisible ? `flipIn 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none",
              transition: "box-shadow 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 48px rgba(28,43,30,0.18)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <ParallaxImage src={b.img} alt={b.cat} className="w-full h-full" />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to top, rgba(28,43,30,0.85) 0%, transparent 60%)",
              transition: "opacity 0.3s",
            }} />
            <div className="absolute bottom-4 left-4">
              <p className="font-display text-white text-lg font-light" style={{ animation: bannersVisible ? `inkBleed 0.5s ease ${i * 80 + 200}ms both` : "none" }}>{b.cat}</p>
              <p className="font-body text-[10px] text-[#c8a96e] tracking-widest uppercase mt-0.5 group-hover:underline"
                style={{ transition: "letter-spacing 0.3s ease" }}
                onMouseEnter={e => (e.currentTarget.style.letterSpacing = "0.2em")}
                onMouseLeave={e => (e.currentTarget.style.letterSpacing = "0.05em")}>Shop →</p>
            </div>
            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
              style={{ background: "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 0.8s ease" }} />
          </button>
        ))}
      </section>

      {/* ══════════ PRODUCTS SECTION ══════════ */}
      <section id="products" className="max-w-7xl mx-auto px-6 pb-20">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`cat-btn font-body text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors duration-200 ${
                  activeCategory === cat ? "active bg-[#1c2b1e] text-white border-[#1c2b1e]" : "text-[#8c8880] border-[#e8e4dd] hover:text-white"
                }`}
                style={{ transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", transitionDelay: `${i * 30}ms` }}>
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="font-body text-xs text-[#1c2b1e] border border-[#e8e4dd] px-3 py-2 bg-white outline-none"
              style={{ transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c8a96e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#e8e4dd")}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <span className="font-body text-xs text-[#8c8880]">{filtered.length} products</span>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="flex md:hidden items-center border border-[#e8e4dd] bg-white px-4 py-2.5 gap-2 mb-6">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8c8880" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search gifts..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 font-body text-xs text-[#1c2b1e] bg-transparent outline-none placeholder-[#8c8880]" />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ animation: "heroLine 0.5s ease both" }}>
            <p className="text-5xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🔍</p>
            <p className="font-body text-[#8c8880]">No products found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")}
              className="mt-4 font-body text-xs tracking-widest uppercase border border-[#e8e4dd] px-5 py-2.5 text-[#8c8880] hover:text-[#1c2b1e] hover:border-[#1c2b1e] transition-colors">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx}
                onQuickView={setQuickView}
                onWishlist={toggleWishlist}
                onAddToCart={addToCart}
                wishlisted={wishlist.includes(product.id)} />
            ))}
          </div>
        )}
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="testimonials" ref={testimonialsRef} className="bg-[#f5f0e8] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14"
            style={{
              opacity: testimonialsVisible ? 1 : 0,
              transform: testimonialsVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-[#7a9e7e] mb-3"
              style={{ animation: testimonialsVisible ? "inkBleed 0.6s ease both" : "none" }}>Client Stories</p>
            <h2 className="font-display text-4xl font-light text-[#1c2b1e]"
              style={{ animation: testimonialsVisible ? "heroLineBlur 0.7s ease 0.1s both" : "none" }}>What They Said</h2>
            <div className="mx-auto mt-4 h-px bg-[#c8a96e]"
              style={{ width: testimonialsVisible ? "48px" : "0px", transition: "width 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s" }} />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card bg-white border border-[#e8e4dd] p-7 rounded-sm"
                style={{
                  animation: testimonialsVisible ? `cardMorph 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` : "none",
                  boxShadow: "0 2px 8px rgba(28,43,30,0.04)",
                }}>
                <p className="font-display text-4xl text-[#c8a96e] leading-none mb-3"
                  style={{ animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>"</p>
                <p className="font-display text-base font-light italic text-[#1c2b1e] leading-relaxed mb-5">{t.quote}</p>
                <div className="border-t border-[#e8e4dd] pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c2b1e] flex items-center justify-center font-body text-[10px] text-white font-medium flex-shrink-0"
                    style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.2) rotate(8deg)"; e.currentTarget.style.background = "#7a9e7e"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0)"; e.currentTarget.style.background = "#1c2b1e"; }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-body text-xs font-medium text-[#1c2b1e]">{t.author}</p>
                    <p className="font-body text-[10px] text-[#8c8880]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CORPORATE CTA ══════════ */}
      <section ref={ctaRef} className="bg-[#1c2b1e] text-white py-20 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(45deg, #c8a96e 0, #c8a96e 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
            animation: "shimmer 8s linear infinite",
            backgroundPosition: ctaVisible ? "0 0" : "-100px -100px",
            transition: "background-position 0s",
          }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-2" style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%)", top: "-50px", right: "10%" }} />
          <div className="orb-3" style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(122,158,126,0.08) 0%, transparent 70%)", bottom: "-30px", left: "5%" }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-[#7a9e7e] mb-5"
            style={{ opacity: ctaVisible ? 1 : 0, animation: ctaVisible ? "inkBleed 0.6s ease 0.1s both" : "none" }}>
            Bulk & Corporate Orders
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic leading-snug mb-6 cta-float"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
            }}>
            Ordering for a<br />
            <span className="font-display text-4xl md:text-5xl font-light italic leading-snug mb-6 cta-float" >team or event?</span>
          </h2>
          <p className="font-body text-[#c8c4bb] text-sm leading-relaxed mb-10 max-w-lg mx-auto font-light"
            style={{ opacity: ctaVisible ? 1 : 0, transition: "opacity 0.6s ease 0.35s" }}>
            Custom branding, volume pricing, and white-glove delivery for orders of 10 or more. We handle every detail so your gifts arrive perfectly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease 0.45s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s" }}>
            <RippleBtn onClick={() => navigate("/configurator")}
              className="font-body text-xs tracking-widest uppercase bg-[#c8a96e] text-[#1c2b1e] px-10 py-4 hover:bg-[#b89558] font-medium">
              Request a Proposal
            </RippleBtn>
            <RippleBtn onClick={() => navigate("/contact")}
              className="font-body text-xs tracking-widest uppercase border border-white/30 text-white px-10 py-4 hover:border-white hover:bg-white/10">
              Contact Us
            </RippleBtn>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Scroll Progress Bar ────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", zIndex: 100, background: "transparent" }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #7a9e7e, #c8a96e, #b87355)",
        transition: "width 0.1s linear",
        boxShadow: "0 0 8px rgba(200,169,110,0.6)",
      }} />
    </div>
  );
}