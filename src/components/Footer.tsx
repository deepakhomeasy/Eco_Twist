import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assests/logo2.png'; // ✅ logo import
export const Footer = () => {
  return (
    <footer className="bg-brand-charcoal text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Brand & Social */}


          <div className="lg:col-span-4">
  <Link to="/" className="flex flex-col items-start mb-8 group w-fit">

    {/* LOGO */}
    <img
      src={logo}
      alt="Ecotwist Logo"
      className="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition"
    />

    {/* TEXT BELOW LOGO */}
    <span className="mt-2 font-bold tracking-widest text-xl sm:text-2xl font-serif text-white uppercase">
      ECOTWIST
    </span>

  </Link>

  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
    Pioneering the future of corporate gifting through sustainable design, ethical sourcing, and circular economy principles.
  </p>

  <div className="flex gap-4">
    {['Instagram', 'LinkedIn', 'Journal'].map((social) => (
      <a
        key={social}
        href="#"
        className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
      >
        {social}
      </a>
    ))}
  </div>
</div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-[10px] text-brand-olive">Solutions</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/solutions" className="hover:text-white transition-colors">Custom Bundles</Link></li>
                <li><Link to="/consult" className="hover:text-white transition-colors">Eco-Consultancy</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">White-Label</a></li>
                <li><Link to="/impact" className="hover:text-white transition-colors">Impact Reports</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-[10px] text-brand-olive">Company</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/impact" className="hover:text-white transition-colors">Our Artisans</Link></li>
                <li><Link to="/impact" className="hover:text-white transition-colors">Impact 2024</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
            {/* <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-[10px] text-brand-olive">Support</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/consult" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Policy</a></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>

              </ul>
            </div> */}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h5 className="font-bold mb-6 uppercase tracking-widest text-[10px] text-brand-olive">Newsletter</h5>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Receive sustainable gifting insights and new collection previews.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-brand-olive transition-colors text-white placeholder:text-gray-500"
              />
              <button className="bg-brand-olive hover:bg-brand-dark-olive text-white font-bold py-3 rounded-sm text-sm transition-all uppercase tracking-widest">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 flex flex-wrap justify-center gap-x-8 gap-y-2">
          <span>© 2024 ECOTWIST INC.</span>
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">
          Designed with purpose for a better planet.
        </div>
      </div>
    </footer>
  );
};