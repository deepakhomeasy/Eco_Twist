import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// ── Core pages (default exports) ──────────────────────
import { Home } from "./pages/Home";
import Contact      from './pages/Contact';
import { Solutions } from "./pages/Solutions";
import Configurator from './pages/Configurator';
import Impact       from './pages/Impact';

// ── Original 5 Occasion pages ─────────────────────────
import ClientAppreciation from './pages/ClientAppreciation';
import EmployeeOnboarding from './pages/EmployeeOnboarding';
import FestiveGifting     from './pages/FestiveGifting.';
import EventsConferences  from './pages/EventsConferences..tsx';
import EmployeeWellness   from './pages/EmployeeWellness..tsx';

// ── New 5 Occasion pages ──────────────────────────────
import BirthdayGifting    from './pages/BirthdayGifting.tsx';
import WorkAnniversary    from './pages/WorkAnniversary.tsx';
import ProductLaunch      from './pages/ProductLaunch.tsx';
import AwardRecognition   from './pages/AwardRecognition.tsx';
import RetirementGifting  from './pages/RetirementGifting.tsx';
import  ProductList  from './pages/Products.tsx';

// ── Policy pages ──────────────────────────────────────
import PrivacyPolicy   from './components/PrivacyPolicy';
import TermsOfService  from './components/TermsOfService';
import RefundPolicy    from './components/RefundPolicy';
import ShippingPolicy  from './components/ShippingPolicy';
// ──────────────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion';

/* ========= PAGE TRANSITION WRAPPER ========= */
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ========= ANIMATED ROUTES ========= */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ── Core routes ── */}
        <Route path="/"             element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/contact"      element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/solutions"    element={<PageWrapper><Solutions /></PageWrapper>} />
        <Route path="/configurator" element={<PageWrapper><Configurator /></PageWrapper>} />
        <Route path="/impact"       element={<PageWrapper><Impact /></PageWrapper>} />
        <Route path="/product"      element={<PageWrapper><ProductList /></PageWrapper>} />

        {/* ── Original 5 occasion routes ── */}
        <Route path="/occasions/client-appreciation" element={<PageWrapper><ClientAppreciation /></PageWrapper>} />
        <Route path="/occasions/employee-onboarding" element={<PageWrapper><EmployeeOnboarding /></PageWrapper>} />
        <Route path="/occasions/festive-gifting"     element={<PageWrapper><FestiveGifting /></PageWrapper>} />
        <Route path="/occasions/events-conferences"  element={<PageWrapper><EventsConferences /></PageWrapper>} />
        <Route path="/occasions/employee-wellness"   element={<PageWrapper><EmployeeWellness /></PageWrapper>} />

        {/* ── New 5 occasion routes ── */}
        <Route path="/occasions/birthday-gifting"    element={<PageWrapper><BirthdayGifting /></PageWrapper>} />
        <Route path="/occasions/work-anniversary"    element={<PageWrapper><WorkAnniversary /></PageWrapper>} />
        <Route path="/occasions/product-launch"      element={<PageWrapper><ProductLaunch /></PageWrapper>} />
        <Route path="/occasions/award-recognition"   element={<PageWrapper><AwardRecognition /></PageWrapper>} />
        <Route path="/occasions/retirement-gifting"  element={<PageWrapper><RetirementGifting /></PageWrapper>} />
        <Route path="/products"                      element={<PageWrapper><ProductList /></PageWrapper>} />

        {/* ── Policy routes ── */}
        <Route path="/privacy-policy"   element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
        <Route path="/terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        <Route path="/refund-policy"    element={<PageWrapper><RefundPolicy /></PageWrapper>} />
        <Route path="/shipping-policy"  element={<PageWrapper><ShippingPolicy /></PageWrapper>} />

      </Routes>
    </AnimatePresence>
  );
};

/* ========= MAIN APP ========= */
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}