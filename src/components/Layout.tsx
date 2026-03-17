import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import TacticalOverlay from './TacticalOverlay';
import GlobalAmbience from './GlobalAmbience';
import TacticalHUD from './TacticalHUD';
import { Canvas } from '@react-three/fiber';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-black selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 -z-20 bg-neutral-950" />
      
      {/* Global 3D Ambience Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <GlobalAmbience />
        </Canvas>
      </div>

      <TacticalOverlay />
      <TacticalHUD />
      
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
