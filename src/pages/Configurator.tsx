import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

/* ─────────────────────────────────────────────
   Only animation keyframes injected globally.
   All layout/colours stay in Tailwind classes
   exactly as in the original code.
───────────────────────────────────────────── */
const ANIM_STYLES = `
  @keyframes cardLand {
    0%   { opacity:0; transform: translateY(-60px) rotateX(30deg) scale(0.88); }
    60%  { opacity:1; transform: translateY(6px)   rotateX(-3deg)  scale(1.02); }
    80%  {             transform: translateY(-3px)  rotateX(1deg)   scale(0.99); }
    100% { opacity:1; transform: translateY(0)      rotateX(0)      scale(1);   }
  }
  @keyframes headSlideUp {
    from { opacity:0; transform: translateY(32px) rotateX(14deg); }
    to   { opacity:1; transform: translateY(0)    rotateX(0);     }
  }
  @keyframes descFade {
    from { opacity:0; transform: translateY(18px); }
    to   { opacity:1; transform: translateY(0);    }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }
  @keyframes checkPop {
    from { transform: scale(0) rotate(-45deg); opacity:0; }
    to   { transform: scale(1) rotate(0);      opacity:1; }
  }
  @keyframes navFade {
    from { opacity:0; transform: translateY(12px); }
    to   { opacity:1; transform: translateY(0);    }
  }
  @keyframes img1Land {
    0%   { opacity:0; transform: translateY(-100px) translateX(-20px) rotate(-8deg) scale(0.8);  filter:blur(8px); }
    55%  { opacity:1;                                                                              filter:blur(0);   }
    72%  {            transform: translateY(8px)   translateX(4px)   rotate(1.5deg) scale(1.03); }
    88%  {            transform: translateY(-4px)  translateX(-1px)  rotate(-0.5deg) scale(0.99); }
    100% { opacity:1; transform: translateY(0)     translateX(0)     rotate(-4deg)  scale(1);    filter:blur(0);   }
  }
  @keyframes img2Land {
    0%   { opacity:0; transform: translateY(100px)  translateX(30px)  rotate(7deg)  scale(0.8);  filter:blur(8px); }
    55%  { opacity:1;                                                                              filter:blur(0);   }
    72%  {            transform: translateY(-7px)  translateX(-3px)  rotate(-1deg) scale(1.03); }
    88%  {            transform: translateY(3px)   translateX(2px)   rotate(0.8deg) scale(0.99); }
    100% { opacity:1; transform: translateY(0)     translateX(0)     rotate(5deg)  scale(1);    filter:blur(0);   }
  }
  @keyframes quoteUp {
    from { opacity:0; transform: translateY(20px) rotateX(8deg); }
    to   { opacity:1; transform: translateY(0)    rotateX(0);    }
  }
  @keyframes dotExpand {
    from { width:6px; opacity:.15; }
    to   { width:22px; opacity:1; }
  }

  /* Applied classes */
  .anim-head      { perspective:800px; animation: headSlideUp .55s cubic-bezier(.22,1,.36,1) both; }
  .anim-desc      { animation: descFade .55s .1s cubic-bezier(.22,1,.36,1) both; }
  .anim-nav       { animation: navFade  .5s  .32s cubic-bezier(.22,1,.36,1) both; }

  .anim-card      { animation: cardLand .65s cubic-bezier(.22,1,.36,1) both; transform-style:preserve-3d; }
  .anim-card:nth-child(1) { animation-delay:.04s; }
  .anim-card:nth-child(2) { animation-delay:.11s; }
  .anim-card:nth-child(3) { animation-delay:.18s; }
  .anim-card:nth-child(4) { animation-delay:.25s; }

  /* Gold bottom line on selected card */
  .card-selected-line::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg, #2C2D1E, #B8974A);
    animation: lineGrow .4s cubic-bezier(.22,1,.36,1) both;
  }

  /* Check icon pop */
  .anim-check { animation: checkPop .35s cubic-bezier(.34,1.56,.64,1) both; }

  /* 3D card tilt — applied via JS inline style */
  .card-3d { will-change:transform; }

  /* Image land */
  .anim-img1 { animation: img1Land .95s .06s cubic-bezier(.22,1,.36,1) both; }
  .anim-img2 { animation: img2Land .95s .22s cubic-bezier(.22,1,.36,1) both; }

  /* Hover: straighten + zoom */
  .anim-img1:hover { transform: rotate(-1deg) scale(1.03) translateY(-8px) !important; transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease !important; }
  .anim-img2:hover { transform: rotate( 2deg) scale(1.03) translateY(-8px) !important; transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease !important; }

  /* Quote */
  .anim-quote { animation: quoteUp .55s .45s cubic-bezier(.22,1,.36,1) both; }

  /* Progress dots */
  .dot-base   { width:6px; height:6px; border-radius:50%; background:#2C2D1E; opacity:.15; transition: all .4s cubic-bezier(.34,1.56,.64,1); }
  .dot-active { width:22px; border-radius:3px; opacity:1; }

  /* Continue button sweep */
  .btn-sweep { position:relative; overflow:hidden; transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease; }
  .btn-sweep::before {
    content:''; position:absolute; inset:0;
    background:#B8974A;
    transform:translateX(-101%);
    transition: transform .4s cubic-bezier(.22,1,.36,1);
  }
  .btn-sweep:hover::before { transform:translateX(0); }
  .btn-sweep:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 28px rgba(44,45,30,.18); }
  .btn-sweep span { position:relative; z-index:1; }
`;

const stepContent: any = {
  1: {
    title: 'Occasion', subtitle: 'Tell us about the',
    desc: 'Every gift tells a story. Select the purpose for your curated collection.',
    data: [
      { title: 'Employee Appreciation', desc: 'Reward your team.' },
      { title: 'New Hire Onboarding',   desc: 'Welcome new employees.' },
      { title: 'Client Gifting',        desc: 'Strengthen relationships.' },
      { title: 'Event Swag',            desc: 'Perfect for events.' },
    ],
  },
  2: {
    title: 'Budget', subtitle: 'Define your',
    desc: 'Choose a budget range that aligns with your gifting goals.',
    data: [{ title: '₹100 - ₹500' }, { title: '₹500 - ₹1000' }, { title: '₹1000 - ₹2000' }, { title: '₹2000+' }],
  },
  3: {
    title: 'Quantity', subtitle: 'Select the',
    desc: 'Tell us how many recipients you are planning for.',
    data: [{ title: '10 - 50' }, { title: '50 - 100' }, { title: '100 - 500' }, { title: '500+' }],
  },
  4: {
    title: 'Branding', subtitle: 'Choose your',
    desc: 'Customize your gifts with premium branding options.',
    data: [{ title: 'Logo Print' }, { title: 'Custom Packaging' }, { title: 'Embroidery' }, { title: 'No Branding' }],
  },
};

const images: any = {
  1: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da'],
  2: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e'],
  3: ['https://images.unsplash.com/photo-1521791136064-7986c2920216', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'],
  4: ['https://images.unsplash.com/photo-1556740738-b6a63e27c4df', 'https://images.unsplash.com/photo-1607082349566-187342175e2f'],
};

const quotes: any = {
  1: { text: "The most thoughtful corporate gift our team has ever received.", author: "— Global Tech Lead" },
  2: { text: "Perfectly aligned with our budget and sustainability goals.",    author: "— Procurement Head" },
  3: { text: "Seamless bulk gifting experience with zero hassle.",             author: "— HR Manager" },
  4: { text: "Branding quality exceeded all expectations.",                    author: "— Marketing Director" },
};

const STEPS = [
  { id: 1, label: '01. Occasion' },
  { id: 2, label: '02. Budget' },
  { id: 3, label: '03. Quantity' },
  { id: 4, label: '04. Branding' },
];

export const Configurator = () => {
  const [step, setStep]           = React.useState(1);
  const [contentKey, setContentKey] = React.useState(0);   // drives re-mount of content only
  const [selected, setSelected]   = React.useState<Record<number,string>>({
    1: 'Employee Appreciation', 2: '₹100 - ₹500', 3: '50 - 100', 4: 'Logo Print',
  });

  const goToStep = (s: number) => {
    if (s === step) return;
    setStep(s);
    setContentKey(k => k + 1);
  };

  const handleSelect = (value: string) =>
    setSelected(prev => ({ ...prev, [step]: value }));

  // 3-D tilt on option cards
  const onTilt = (e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rotX = -((e.clientY - r.top  - r.height / 2) / r.height) * 10;
    const rotY =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 10;
    el.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
  };
  const onTiltLeave = (el: HTMLDivElement | null, isSel: boolean) => {
    if (!el) return;
    el.style.transform = isSel ? 'translateY(-3px) scale(1.01)' : '';
  };

  const content  = stepContent[step];
  const [img1, img2] = images[step];
  const quote    = quotes[step];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />

      <div className="bg-brand-beige min-h-screen">
        <main className="max-w-7xl mx-auto px-6 lg:px-10 py-6 grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* ── LEFT ── */}
          <div className="lg:col-span-7">

            {/* ── STEPPER — outside contentKey, NEVER re-animates ── */}
            <div className="mb-8">
              <div className="flex items-center gap-1 w-fit border border-brand-dark-olive/10 bg-brand-dark-olive/[0.03] p-1">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.id}>
                    {i > 0 && <div style={{ width:1, height:20, background:'rgba(44,45,30,.13)' }} />}
                    <div
                      onClick={() => goToStep(s.id)}
                      className="flex items-center gap-2 px-5 py-2.5 cursor-pointer"
                      style={{
                        background: step === s.id ? '#2C2D1E' : 'transparent',
                        opacity:    step === s.id ? 1 : 0.3,
                        transition: 'background .22s ease, opacity .22s ease',
                      }}
                    >
                      {/* Gold dot — visible only on active */}
                      <div style={{
                        width:5, height:5, borderRadius:'50%', background:'#B8974A', flexShrink:0,
                        opacity:    step === s.id ? 1 : 0,
                        transform:  step === s.id ? 'scale(1)' : 'scale(0.4)',
                        transition: 'opacity .25s ease, transform .35s cubic-bezier(.34,1.56,.64,1)',
                      }} />
                      <span
                        className="text-[9px] uppercase tracking-widest font-bold"
                        style={{ color: step === s.id ? '#F5F0E8' : '#2C2D1E', transition:'color .22s ease', whiteSpace:'nowrap' }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── CONTENT — keyed so it re-mounts + re-animates each step ── */}
            <div key={contentKey} className="max-w-2xl" style={{ perspective:'900px' }}>

              {/* Heading */}
              <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8 anim-head">
                {content.subtitle}<br />
                <span className="italic font-normal">{content.title}</span>.
              </h1>

              {/* Desc */}
              <p className="text-brand-dark-olive/70 text-lg md:text-xl font-light leading-relaxed mb-12 anim-desc">
                {content.desc}
              </p>

              {/* Option cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" style={{ perspective:'1100px' }}>
                {content.data.map((item: any) => {
                  const isSel = selected[step] === item.title;
                  let ref: HTMLDivElement | null = null;
                  return (
                    <div
                      key={item.title}
                      ref={(el: HTMLDivElement | null) => { ref = el; }}
                      onClick={() => handleSelect(item.title)}
                      onMouseMove={e => onTilt(e, ref)}
                      onMouseLeave={() => onTiltLeave(ref, isSel)}
                      className={`anim-card card-3d group relative p-8 border-2 cursor-pointer transition-colors
                        ${isSel
                          ? 'border-brand-dark-olive bg-white card-selected-line'
                          : 'border-brand-dark-olive/10 bg-white/50 hover:bg-white hover:border-brand-dark-olive/30'
                        }`}
                    >
                      {isSel && (
                        <div className="absolute top-6 right-6 anim-check">
                          <CheckCircle className="text-brand-dark-olive" size={20} />
                        </div>
                      )}
                      <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                      {item.desc && (
                        <p className="text-sm text-brand-dark-olive/60 leading-relaxed">{item.desc}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mb-8 anim-nav">
                {[1,2,3,4].map(d => (
                  <div key={d} className={`dot-base ${step === d ? 'dot-active' : ''}`} />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-brand-dark-olive/10 pt-10 anim-nav">
                <button
                  onClick={() => goToStep(Math.max(step - 1, 1))}
                  className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 opacity-40 hover:opacity-100 transition-all hover:-translate-x-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <button
                  onClick={() => goToStep(Math.min(step + 1, 4))}
                  className="btn-sweep bg-brand-dark-olive text-brand-beige px-12 py-5 text-[10px] font-bold uppercase tracking-widest"
                >
                  <span>{step === 4 ? 'Finish' : 'Continue'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT — two images landing from opposite directions ── */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div key={`imgs-${step}`} className="relative" style={{ height: 780 }}>

              {/* Image 1 — top-left, tilted left */}
              <div
                className="anim-img1 absolute overflow-hidden shadow-2xl cursor-pointer"
                style={{ width:'78%', height:380, top:0, left:0, transform:'rotate(-4deg)', zIndex:2 }}
              >
                <span style={{
                  position:'absolute', top:12, left:12, zIndex:3,
                  background:'rgba(245,240,232,0.92)', backdropFilter:'blur(4px)',
                  fontFamily:'monospace', fontSize:8, letterSpacing:2, fontWeight:700,
                  textTransform:'uppercase', color:'#2C2D1E', padding:'5px 10px',
                }}>0{step} / Gift</span>

                <img
                  src={`${img1}?q=80&w=900&auto=format&fit=crop`}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter:'grayscale(15%) contrast(1.04)', transition:'filter .9s ease, transform .8s ease' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.filter='grayscale(0%) contrast(1.1)'; (e.target as HTMLImageElement).style.transform='scale(1.05)'; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.filter='grayscale(15%) contrast(1.04)'; (e.target as HTMLImageElement).style.transform='scale(1)'; }}
                />

                {/* Corner accent */}
                <div style={{ position:'absolute', bottom:12, right:12, width:34, height:34,
                  borderRight:'2px solid rgba(245,240,232,0.6)', borderBottom:'2px solid rgba(245,240,232,0.6)' }} />
              </div>

              {/* Image 2 — bottom-right, tilted right */}
              <div
                className="anim-img2 absolute overflow-hidden shadow-2xl cursor-pointer"
                style={{ width:'66%', height:300, bottom:80, right:0, transform:'rotate(5deg)', zIndex:1 }}
              >
                <span style={{
                  position:'absolute', top:12, left:12, zIndex:3,
                  background:'rgba(245,240,232,0.92)', backdropFilter:'blur(4px)',
                  fontFamily:'monospace', fontSize:8, letterSpacing:2, fontWeight:700,
                  textTransform:'uppercase', color:'#2C2D1E', padding:'5px 10px',
                }}>Editorial</span>

                <img
                  src={`${img2}?q=80&w=900&auto=format&fit=crop`}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter:'grayscale(15%) contrast(1.04)', transition:'filter .9s ease, transform .8s ease' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.filter='grayscale(0%) contrast(1.1)'; (e.target as HTMLImageElement).style.transform='scale(1.05)'; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.filter='grayscale(15%) contrast(1.04)'; (e.target as HTMLImageElement).style.transform='scale(1)'; }}
                />

                <div style={{ position:'absolute', bottom:12, right:12, width:34, height:34,
                  borderRight:'2px solid rgba(245,240,232,0.6)', borderBottom:'2px solid rgba(245,240,232,0.6)' }} />
              </div>

              {/* Quote card */}
              <div
                key={`q-${step}`}
                className="anim-quote absolute bg-brand-dark-olive text-brand-beige"
                style={{ bottom:0, left:-16, right:24, zIndex:5, padding:'28px 32px' }}
              >
                <div style={{ width:28, height:2, background:'#B8974A', marginBottom:14 }} />
                <p className="font-serif text-xl italic mb-3">"{quote.text}"</p>
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-50">{quote.author}</span>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default Configurator;