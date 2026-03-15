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
    <div className="relative w-full aspect-[16/7] bg-black/40 rounded-[40px] border border-white/5 overflow-hidden group">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Scanning Line Animation */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent z-10"
      />

      {/* Stylized World Map SVG (Simplified path) */}
      <svg className="w-full h-full opacity-20 fill-blue-500/20 stroke-blue-500/40 stroke-[0.5]" viewBox="0 0 800 400">
        <path d="M150,150 Q200,100 250,150 T350,150 M400,100 Q450,50 500,100 T600,120 M100,250 Q150,200 200,250 T300,280 M500,250 Q550,200 600,250 T700,300" 
              className="fill-none animate-pulse" />
        {/* Simplified continents */}
        <rect x="120" y="80" width="120" height="150" rx="40" opacity="0.5" />
        <rect x="380" y="60" width="200" height="180" rx="50" opacity="0.5" />
        <rect x="580" y="150" width="100" height="150" rx="30" opacity="0.5" />
      </svg>

      {/* Interactive Zones */}
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          style={{ left: zone.x, top: zone.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/zone cursor-crosshair"
          whileHover={{ scale: 1.2 }}
        >
          {/* Pulse Ring */}
          <motion.div 
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute w-8 h-8 rounded-full border ${
              zone.status === 'ACTIVE' ? 'border-blue-500' : 
              zone.status === 'ENGAGED' ? 'border-red-500' : 'border-emerald-500'
            }`}
          />
          
          {/* Core Dot */}
          <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${
             zone.status === 'ACTIVE' ? 'text-blue-500 bg-blue-500' : 
             zone.status === 'ENGAGED' ? 'text-red-500 bg-red-500' : 'text-emerald-500 bg-emerald-500'
          }`} />

          {/* zone label */}
          <div className="absolute top-4 left-4 whitespace-nowrap opacity-0 group-hover/zone:opacity-100 transition-opacity bg-black/80 backdrop-blur-md p-3 border border-white/10 rounded-xl z-20 pointer-events-none">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black italic text-white uppercase tracking-tighter">{zone.name}</span>
              <div className="flex justify-between items-center gap-8">
                <span className="text-[8px] font-mono text-gray-500">{zone.status}</span>
                <span className="text-[8px] font-mono text-blue-400">{zone.load}% LOAD</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Map Metadata */}
      <div className="absolute bottom-6 left-8 flex gap-8 font-mono text-[8px] text-white/30 tracking-[0.3em] uppercase">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Nodes: 2,842</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Active Theaters: 12</span>
        </div>
      </div>

      <div className="absolute top-6 right-8 text-right font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">
        Global Network Topology v3.2<br/>
        Real-time Synchronization Active
      </div>
    </div>
  );
};

export default TacticalMap;
