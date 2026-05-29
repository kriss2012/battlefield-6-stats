/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: TacticalOverlay.tsx
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const TacticalOverlay: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
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

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
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
        <div className="flex flex-col w-48">
          <span className="text-xs text-blue-400 tracking-widest uppercase mb-1 font-bold">SHIELD STATUS</span>
          <div className="h-2 bg-white/5 rounded-sm overflow-hidden border border-blue-500/20 mb-1">
            <motion.div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              animate={{ width: `100%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-cyan-400/60 uppercase">
            <span>PR%</span>
            <span>4 GRPS</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic text-white">{fps}</span>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/50 tracking-widest">FPS</span>
              <span className="text-[8px] text-white/50 tracking-widest">NEURAL LOAD {neuralLoad}%</span>
            </div>
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
      <div className="absolute top-2 w-full flex justify-between px-12 font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase pointer-events-none">
        <div className="flex gap-8">
          <span>Uplink: Synchronized</span>
          <span>Encryption: AES 256</span>
        </div>
        <div className="flex gap-8">
          <span>Combat Zone: US_EAST_01</span>
          <span>Cycle: 08:24:55</span>
        </div>
      </div>

      {/* Bottom Right Integrity Log & Controls */}
      <div className="absolute bottom-12 right-12 flex items-end gap-6 pointer-events-auto">
        <div className="w-56 font-mono text-[9px] text-white/30 uppercase tracking-widest flex flex-col gap-1 items-end text-right mb-2">
          <span className="text-blue-500/50 font-black mb-1">SYSTEM_SMIRORTTY_LOG</span>
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-end">
            <span>MEMORY SYNERGITY</span>
            <span>KERNEL LOAD: NOMINAL</span>
            <span>BROCKATIO LAMBLE LOGOAD</span>
            <span>UP THE LIATERET ZONE</span>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="font-bold text-xs text-white/50 tracking-widest">CAM</div>
          <button className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center relative overflow-hidden backdrop-blur-sm group hover:bg-red-600/40 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] cursor-crosshair">
            <span className="text-red-500 font-bold text-sm tracking-widest group-hover:scale-110 transition-transform">FIRE</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.4)_0%,transparent_70%)]" />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px]" />
    </div>
  );
};

export default TacticalOverlay;
