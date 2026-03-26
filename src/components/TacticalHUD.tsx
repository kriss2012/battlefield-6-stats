import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TacticalHUD: React.FC = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Dynamic Corner UI Brackets - Top Left */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="w-40 h-40 border-l-2 border-t-2 border-blue-500/40 rounded-tl-3xl relative">
           <div className="absolute top-0 left-0 w-8 h-[2px] bg-blue-400" />
           <div className="absolute top-0 left-0 w-[2px] h-8 bg-blue-400" />
        </div>
        <div className="flex flex-col gap-1 font-mono text-[11px] text-blue-400/60 uppercase tracking-widest pl-2">
           <span className="animate-pulse">OS_VER: BF_6.0.42</span>
           <span>SYS_STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Top Right - Clock & Connectivity */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
        <div className="w-40 h-40 border-r-2 border-t-2 border-blue-500/40 rounded-tr-3xl relative">
           <div className="absolute top-0 right-0 w-8 h-[2px] bg-blue-400" />
           <div className="absolute top-0 right-0 w-[2px] h-8 bg-blue-400" />
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[11px] text-blue-400/60 uppercase tracking-widest pr-2">
           <span className="text-blue-300 font-bold">{timestamp}</span>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>LINK: SECURE</span>
           </div>
        </div>
      </div>

      {/* Bottom Left - Telemetry 1 */}
      <div className="absolute bottom-16 left-8">
        <div className="w-32 h-32 border-l-2 border-b-2 border-blue-500/40 rounded-bl-3xl relative">
           <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-blue-400" />
           <div className="absolute bottom-0 left-0 w-[2px] h-8 bg-blue-400" />
        </div>
        <motion.div 
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 flex flex-col gap-1 font-mono text-[10px] text-purple-400/60 uppercase tracking-[0.3em] pl-2"
        >
          <span>UPLINK_BANDWIDTH: 1.2 GBPS</span>
          <span>PACKET_LOSS: 0.00%</span>
        </motion.div>
      </div>

      {/* Bottom Right - Telemetry 2 */}
      <div className="absolute bottom-16 right-8 flex flex-col items-end">
        <div className="w-32 h-32 border-r-2 border-b-2 border-blue-500/40 rounded-br-3xl relative">
           <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-blue-400" />
           <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-blue-400" />
        </div>
        <motion.div 
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-4 flex flex-col items-end gap-1 font-mono text-[10px] text-blue-400/60 uppercase tracking-[0.3em] pr-2"
        >
          <span>LATENCY: 12MS</span>
          <span>GEO_SYNC: VALIDATED</span>
        </motion.div>
      </div>

      {/* Global Scanline Glitch Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] opacity-10" />
      
      {/* Top Border Progress Bar */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent origin-left"
      />
    </div>
  );
};

export default TacticalHUD;

