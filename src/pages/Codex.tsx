import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterPortraits, characterLore } from '../utils/characterAssets';
import TacticalHUD from '../components/TacticalHUD';

const Codex: React.FC = () => {
  const [selectedId, setSelectedId] = useState(Object.keys(characterLore)[0]);
  const activeChar = characterLore[selectedId];

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      <TacticalHUD />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-blue-500" />
            <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Neural Network / Archive</span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            Character <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Codex</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Character List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {Object.values(characterLore).map((char) => (
              <motion.button
                key={char.id}
                whileHover={{ x: 10 }}
                onClick={() => setSelectedId(char.id)}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  selectedId === char.id 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black flex-shrink-0">
                  {CharacterPortraits[char.id]}
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[10px] font-mono tracking-widest ${selectedId === char.id ? 'text-blue-400' : 'text-gray-500'}`}>
                    {char.role}
                  </span>
                  <span className="font-black italic uppercase tracking-tighter truncate w-full text-left">
                    {char.name}
                  </span>
                </div>
                {selectedId === char.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Character Details Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 md:p-12 relative overflow-hidden min-h-[600px] flex flex-col"
              >
                {/* Tactical Backdrop */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
                  <div className="scale-150 transform rotate-12">
                    {CharacterPortraits[activeChar.id]}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 relative z-10 flex-1">
                  {/* Portrait Section */}
                  <div className="space-y-8 flex flex-col items-center justify-center">
                    <div className="w-64 h-64 md:w-80 md:h-80 relative group perspective-1000">
                      <motion.div 
                        whileHover={{ rotateY: 15, rotateX: -5 }}
                        className="w-full h-full rounded-full border-2 border-white/10 bg-neutral-900 shadow-2xl overflow-hidden p-6 relative preserve-3d transition-transform duration-500"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
                        {CharacterPortraits[activeChar.id]}
                        
                        {/* Scanning Line */}
                        <motion.div 
                          animate={{ y: ['-100%', '200%'] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-x-0 h-[2px] bg-blue-500/30 blur-sm pointer-events-none"
                        />
                      </motion.div>
                      
                      {/* Decorative HUD markers */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50" />
                      <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/50" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {activeChar.traits.map(trait => (
                        <span key={trait} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">{activeChar.role}</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${activeChar.status === 'ACTIVE' ? 'bg-emerald-500' : activeChar.status === 'DECEASED' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`} />
                          <span className="text-[10px] font-mono text-gray-500 uppercase">{activeChar.status}</span>
                        </div>
                      </div>
                      <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">{activeChar.name}</h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent" />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Intelligence Summary</h4>
                        <p className="text-gray-400 leading-relaxed font-medium">
                          {activeChar.bio}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Primary Specialization</h4>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-sm font-black italic uppercase text-blue-400">
                            {activeChar.specialization}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                      <span>Ref: {activeChar.id.toUpperCase()} // 0xAF77</span>
                      <span>Clearance: Level 5 required</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codex;
