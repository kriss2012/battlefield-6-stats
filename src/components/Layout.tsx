import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import TacticalOverlay from './TacticalOverlay';
import IntroSequence from './IntroSequence';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-black selection:bg-blue-500/30 selection:text-blue-200">
      <div className="noise-overlay" />
      <IntroSequence />
      <TacticalOverlay />
      
      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
