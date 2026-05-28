/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpeningCredits({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 3000);
    const timer2 = setTimeout(() => setStage(2), 6000);
    const timer3 = setTimeout(() => onComplete(), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-white text-center"
          >
            <h2 className="text-2xl font-bold tracking-[0.2em] text-gray-400">KIRI STUDIOS</h2>
            <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">Presents</p>
          </motion.div>
        )}
        {stage === 1 && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="text-white text-center"
          >
            <h1 className="text-6xl font-black tracking-[0.25em] bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              SPECTRE DIVISION
            </h1>
            <p className="mt-4 text-xs font-mono text-gray-400 tracking-[0.5em] uppercase">SHADOW RECKONING</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
