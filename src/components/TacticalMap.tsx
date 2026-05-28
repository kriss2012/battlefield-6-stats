/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 */
import React from 'react';
import { motion } from 'framer-motion';

const TacticalMap: React.FC = () => {
  // Mock tactical zones
  const zones = [
    { id: 1, x: '25%', y: '40%', name: 'US_EAST_01', status: 'ACTIVE', load: 84 },
    { id: 2, x: '70%', y: '35%', name: 'EU_CENTRAL_02', status: 'STABLE', load: 42 },
    { id: 3, x: '82%', y: '65%', name: 'ASIA_PACIFIC_04', status: 'ENGAGED', load: 91 },
    { id: 4, x: '35%', y: '75%', name: 'SA_SOUTH_01', status: 'STANDBY', load: 12 },
  ];

  return (
    <div className="relative w-full aspect-[16/7] bg-black/60 rounded-[40px] border border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-900/10">
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Trailing Scanning Line */}
      <motion.div 
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full z-10"
      >
        <div className="h-[2px] bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
        <div className="h-24 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent blur-xl" />
      </motion.div>

      {/* World Map Background (Simplified SVG paths) */}
      <svg className="w-full h-full opacity-30 fill-blue-500/5 stroke-blue-400/20 stroke-[0.5]" viewBox="0 0 800 400">
        <path d="M150,150 Q200,100 250,150 T350,150 M400,100 Q450,50 500,100 T600,120 M100,250 Q150,200 200,250 T300,280 M500,250 Q550,200 600,250 T700,300" 
              className="fill-none" />
        <motion.path 
          d="M120,100 h100 v120 h-100 z M400,80 h180 v150 h-180 z M600,180 h80 v100 h-80 z" 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>

      {/* Interactive Zones */}
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          style={{ left: zone.x, top: zone.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/zone cursor-crosshair z-20"
          whileHover={{ scale: 1.2 }}
        >
          {/* Multi-ring Pulse */}
          {[0, 1].map((i) => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
              className={`absolute w-10 h-10 rounded-full border ${
                zone.status === 'ACTIVE' ? 'border-blue-500' : 
                zone.status === 'ENGAGED' ? 'border-red-500' : 'border-emerald-500'
              }`}
            />
          ))}
          
          {/* Core Dot with Pulse */}
          <div className="relative">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] animate-pulse ${
               zone.status === 'ACTIVE' ? 'text-blue-500 bg-blue-500' : 
               zone.status === 'ENGAGED' ? 'text-red-500 bg-red-500' : 'text-emerald-500 bg-emerald-500'
            }`} />
          </div>

          {/* Enhanced Zone Label */}
          <div className="absolute top-6 left-6 whitespace-nowrap opacity-0 group-hover/zone:opacity-100 transition-all transform group-hover/zone:translate-x-2 bg-neutral-900/90 backdrop-blur-xl p-4 border border-blue-500/30 rounded-2xl z-30 shadow-2xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                <span className="text-sm font-black italic text-white uppercase tracking-tighter">{zone.name}</span>
              </div>
              <div className="h-[1px] bg-white/10 w-full" />
              <div className="flex justify-between items-center gap-12">
                <span className={`text-xs font-mono font-bold ${
                   zone.status === 'ENGAGED' ? 'text-red-400' : 'text-gray-400'
                }`}>{zone.status}</span>
                <span className="text-xs font-mono text-blue-400 tabular-nums">{zone.load}% LOAD</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.load}%` }}
                  className={`h-full ${zone.load > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Metadata Readouts */}
      <div className="absolute top-8 left-10 flex flex-col gap-1 font-mono text-[11px] text-blue-400/40 uppercase tracking-widest">
        <span>STRAT_NET_ESTABLISHED</span>
        <span>LATENCY_SYNC_ACTIVE [12MS]</span>
      </div>

      <div className="absolute bottom-8 right-10 text-right">
         <span className="text-xs font-black italic text-blue-500/60 uppercase tracking-[0.4em]">Subsurface Scan Mode</span>
         <div className="mt-2 h-[2px] w-32 bg-gradient-to-r from-transparent to-blue-500/40 ml-auto" />
      </div>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </div>
  );
};

export default TacticalMap;

