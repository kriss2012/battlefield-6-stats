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
            <h1 className="text-5xl font-black tracking-tighter text-blue-500 shadow-blue-500/50 drop-shadow-lg">
              BATTLEFIELD 6
            </h1>
            <p className="mt-2 text-xl text-blue-200 tracking-widest uppercase">The Next Generation</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
