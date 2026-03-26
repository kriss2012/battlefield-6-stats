import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from 'framer-motion';

const TacticalOverlay: React.FC = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [fps, setFps] = useState(144);
  const [neuralLoad, setNeuralLoad] = useState(24);

  useEffect(() => {
    // Simulate telemetry changes
    const interval = setInterval(() => {
      setFps(Math.floor(140 + Math.random() * 10));
      setNeuralLoad(Math.floor(20 + Math.random() * 15));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    const { clientX, clientY } = e as MouseEvent;
    const moveX = (clientX - window.innerWidth / 2) / 25;
    const moveY = (clientY - window.innerHeight / 2) / 25;
    mouseX.set(moveX);
    mouseY.set(moveY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Subtle parallax for the grid based on scroll
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const smoothGridY = useSpring(gridY, { stiffness: 100, damping: 30 });

  // Compass Heading Logic
  const heading = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothHeading = useSpring(heading, { stiffness: 50, damping: 30 });

  // Scroll Glitch Intensity
  const glitchOpacity = useTransform(scrollVelocity, [-2000, 0, 2000], [0.3, 0, 0.3]);
  const smoothGlitchOpacity = useSpring(glitchOpacity, { stiffness: 100, damping: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Noise Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Jitter Layer on High Speed */}
      <motion.div 
        style={{ opacity: smoothGlitchOpacity }}
        className="absolute inset-0 bg-blue-500/5 mix-blend-color-dodge z-[150]"
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 2, -2, 0],
        }}
        transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Dynamic Tactical Grid */}
      <motion.div 
        style={{ x: smoothMouseX, y: smoothGridY }}
        className="absolute inset-0 opacity-[0.07]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:200px_200px]" />
      </motion.div>

      {/* Vignette & CRT Scars */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Left Telemetry Panel */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-4 font-mono">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 tracking-widest uppercase">Telemetry Status</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black italic text-blue-400">{fps}</span>
            <span className="text-xs text-blue-400/50">FPS</span>
          </div>
        </div>

        <div className="flex flex-col w-32">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 tracking-widest uppercase">Neural Load</span>
            <span className="text-xs text-white/60">{neuralLoad}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
              animate={{ width: `${neuralLoad}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
        </div>
      </div>

      {/* Compass / Heading Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-12 font-mono text-[11px] tracking-[0.3em] text-white/40 mb-2">
          <span>N</span>
          <span>E</span>
          <span className="text-blue-400 font-bold">S</span>
          <span>W</span>
        </div>
        <div className="relative w-64 h-2 flex items-center justify-center">
          <div className="absolute inset-0 border-b border-white/20" />
          <motion.div 
            style={{ x: useTransform(smoothHeading, [0, 360], [-100, 100]) }}
            className="absolute top-0 w-4 h-full flex flex-col items-center"
          >
            <div className="w-[1px] h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <div className="w-2 h-2 rounded-full border border-blue-500 absolute -top-4" />
          </motion.div>
        </div>
        <div className="font-mono text-xs font-black italic text-white/60 mt-2">
          HDG // <motion.span>{useTransform(smoothHeading, (v) => v.toFixed(1))}</motion.span>°
        </div>
      </div>

      {/* HUD Corner Elements */}
      <motion.div 
        style={{ x: useTransform(smoothMouseX, (v) => v * 0.2), y: useTransform(smoothMouseY, (v) => v * 0.2) }}
        className="absolute inset-0 p-8"
      >
        <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-white/20 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/20 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/20 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-white/20 rounded-br-xl" />
      </motion.div>

      {/* Top Bar Signal (Already handled by Nav mostly, but adding small detail) */}
      <div className="absolute top-2 w-full flex justify-between px-12 font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase pointer-events-none">
        <div className="flex gap-4">
          <span>Uplink: Synchronized</span>
          <span>Encryption: AES-256</span>
        </div>
        <div className="flex gap-4">
          <span>Combat Zone: US_EAST_01</span>
          <span>Cycle: 08:24:55</span>
        </div>
      </div>

      {/* Bottom Right Integrity Log */}
      <div className="absolute bottom-12 right-12 w-48 font-mono text-[10px] text-white/20 uppercase tracking-widest flex flex-col gap-1 items-end text-right">
        <span className="text-blue-500/40 font-black mb-1">System_Integrity_Log</span>
        <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
          - MEMORY_SYNC: OK<br/>
          - KERNEL_LOAD: NOMINAL<br/>
          - ENCRYPTION: ACTIVE<br/>
          - UPLINK_LATENCY: 24MS
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px]" />
    </div>
  );
};

export default TacticalOverlay;
