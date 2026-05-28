/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TacticalHUD from '../components/TacticalHUD';

interface LoreNode {
  id: string;
  name: string;
  type: string;
  description: string;
  intel: string[];
  coordinates: { x: number; y: number };
  status: 'CONTROLLED' | 'INFILTRATED' | 'LIBERATED';
}

const loreNodes: LoreNode[] = [
  {
    id: 'school',
    name: 'St. Xavier\'s High',
    type: 'CITIZEN_SECTOR',
    description: 'A prestigious institution that became a hunting ground for Kabir Rao and his associates. The birthplace of the Shadow Rising.',
    intel: ['Sector 01: School District', 'High density of civilian signatures', 'ISF Recruitment influence: 12%'],
    coordinates: { x: 42, y: 35 },
    status: 'LIBERATED'
  },
  {
    id: 'gym',
    name: 'Balwant\'s Gym',
    type: 'SAFE_ZONE',
    description: 'An unmarked facility above a tailor shop on Nehru Street. Served as the primary training grounds for Aryan Sharma.',
    intel: ['Zero digital footprint', 'Acoustic dampening active', 'Legacy RAW encryption active'],
    coordinates: { x: 35, y: 58 },
    status: 'LIBERATED'
  },
  {
    id: 'safehouse3',
    name: 'Safehouse 3',
    type: 'ISF_NODE',
    description: 'Textile district warehouse used for initial processing of high-value targets. Where Savita Sharma was first held.',
    intel: ['12-second camera overlap gap', 'Subterranean access restricted', 'Logistics coordinator: Veer Choudhary'],
    coordinates: { x: 65, y: 48 },
    status: 'INFILTRATED'
  },
  {
    id: 'district7',
    name: 'District 7 Compound',
    type: 'ISF_FORTRESS',
    description: 'The high-security industrial facility where the ISF concentrated its local power. The site of the final rescue attempt.',
    intel: ['Automated perimeter defense', 'Basement Level 2: Restricted', 'Commander Hasan\'s active garrison'],
    coordinates: { x: 78, y: 72 },
    status: 'CONTROLLED'
  },
  {
    id: 'it_park',
    name: 'Nagpur IT Park',
    type: 'INTEL_HUB',
    description: 'The technological backbone of the city, serving as a hub for ISF\'s financial and surveillance operations.',
    intel: ['Fiber optic junction point', 'Encrypted data clusters', 'Political liaison office'],
    coordinates: { x: 55, y: 82 },
    status: 'CONTROLLED'
  }
];

const WorldLore: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<LoreNode | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      <TacticalHUD />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-blue-500" />
            <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Tactical Overlay / Geolocation</span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            World <span className="bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent">Exploration</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Viewer */}
          <div className="lg:col-span-8 glass-panel p-4 aspect-square md:aspect-video relative overflow-hidden">
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            {/* Compass Rose */}
            <div className="absolute top-8 right-8 w-24 h-24 border border-white/5 rounded-full flex items-center justify-center opacity-30">
              <div className="w-[1px] h-full bg-white/10" />
              <div className="h-[1px] w-full bg-white/10" />
              <span className="absolute top-1 text-[8px] font-mono tracking-widest">N</span>
            </div>

            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
              {/* Connection Lines (Paths) */}
              <motion.path 
                d="M42 35 L35 58 L65 48 L78 72" 
                fill="none" 
                stroke="white" 
                strokeWidth="0.2" 
                strokeDasharray="1 1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
                opacity="0.2"
              />

              {loreNodes.map((node) => (
                <g key={node.id}>
                  <motion.circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.5 }}
                    onClick={() => setSelectedNode(node)}
                    className={`cursor-pointer transition-colors ${
                      selectedNode?.id === node.id ? 'fill-blue-500 shadow-[0_0_10px_#3b82f6]' : 
                      node.status === 'CONTROLLED' ? 'fill-red-500/50' : 
                      node.status === 'INFILTRATED' ? 'fill-yellow-500/50' : 'fill-emerald-500/50'
                    }`}
                  />
                  {selectedNode?.id === node.id && (
                    <motion.circle 
                      layoutId="node-pulse"
                      cx={node.coordinates.x}
                      cy={node.coordinates.y}
                      r="4"
                      className="fill-none stroke-blue-500 stroke-[0.5] pointer-events-none"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Map Footer Information */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[9px] text-gray-500 tracking-[0.2em] uppercase">
              <div className="flex flex-col">
                <span>COORD_LAT: 21.1458° N</span>
                <span>COORD_LON: 79.0882° E</span>
              </div>
              <div className="text-right">
                <span>NAGPUR_SECTOR_OVERVIEW</span>
                <span className="block text-blue-500/50">SIGNAL_STRENGTH: OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Intel Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-panel p-8 flex-1 flex flex-col border-blue-500/20"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">{selectedNode.type}</span>
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                      selectedNode.status === 'CONTROLLED' ? 'bg-red-950 text-red-500 border border-red-500/30' : 
                      selectedNode.status === 'INFILTRATED' ? 'bg-yellow-950 text-yellow-500 border border-yellow-500/30' : 
                      'bg-emerald-950 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{selectedNode.name}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {selectedNode.description}
                  </p>

                  <div className="space-y-4 flex-1">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Intelligence Brief</h4>
                    <ul className="space-y-3">
                      {selectedNode.intel.map((line, i) => (
                        <li key={i} className="flex gap-3 text-xs font-medium text-blue-100/70">
                          <span className="text-blue-500 font-mono">»</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    Access Site Logs
                  </button>
                </motion.div>
              ) : (
                <div className="glass-panel p-8 flex-1 flex flex-col items-center justify-center text-center text-gray-600">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-20">?</span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase">Select a node to access site intelligence</span>
                </div>
              )}
            </AnimatePresence>

            {/* Global Status Legend */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sector Status Guide</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ISF_OCCUPIED</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SHADOW_CONTESTED</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OPERATIONAL_CONTROL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldLore;
