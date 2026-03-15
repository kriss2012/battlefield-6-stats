import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroSequence: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState('');
  const fullText = "INITIALIZING TACTICAL DATA HUB... ACCESSING BF6 TELEMETRY... AUTHORIZED.";

  useEffect(() => {
    let currentText = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setText(currentText);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsVisible(false), 1000);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl px-8 py-12 border border-blue-500/30 bg-blue-500/5 relative overflow-hidden"
          >
            {/* Glitch lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/20 animate-pulse" />
            
            <h2 className="text-blue-500 font-mono text-xs tracking-[0.5em] mb-8 animate-pulse">
              SECURE CONNECTION ESTABLISHED
            </h2>
            
            <div className="h-20 flex items-center justify-center">
              <p className="text-white font-mono text-sm md:text-md tracking-wider leading-relaxed">
                {text}
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-bounce" />
              </p>
            </div>

            <div className="mt-12 flex justify-between items-end">
              <div className="space-y-1">
                <div className="w-32 h-1 bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5 }}
                    className="h-full bg-blue-500"
                  />
                </div>
                <p className="text-[8px] text-white/30 font-mono">LOADING SYSTEM MODULES...</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-white/30 font-mono italic">ENCRYPTION: AES-256</p>
                <p className="text-[8px] text-white/30 font-mono italic">ORIGIN: [REDACTED]</p>
              </div>
            </div>
          </motion.div>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSequence;
