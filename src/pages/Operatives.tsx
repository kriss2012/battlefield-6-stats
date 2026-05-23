import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterLore, CharacterPortraits } from '../utils/characterAssets';
import type { CharacterLore } from '../utils/characterAssets';
import TacticalHUD from '../components/TacticalHUD';
import { audio } from '../utils/audio';
import ThreeScene from '../components/ThreeScene';
import CharacterModel from '../components/CharacterModel';
import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const getOperativeColor = (id: string) => {
  switch (id) {
    case 'aryan_shadow': return '#ef4444';
    case 'savita': return '#9ca3af';
    case 'balwant': return '#fbbf24';
    case 'kabir': return '#f97316';
    case 'director': return '#c084fc';
    default: return '#3b82f6';
  }
};

const getOperativeType = (id: string) => {
  if (id === 'kabir' || id === 'director') return 'enemy';
  return 'player';
};

const HologramOperative: React.FC<{ id: string; gender?: 'male' | 'female'; costume?: string }> = ({ id, gender = 'male', costume = '' }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.4;
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.04 - 0.4;
  });

  const color = getOperativeColor(id);
  const type = getOperativeType(id);

  return (
    <group ref={groupRef}>
      <Cylinder args={[0.9, 1.0, 0.1, 32]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#0c111d" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder args={[0.85, 0.85, 0.02, 32]} position={[0, -1.14, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </Cylinder>

      <group position={[0, -0.05, 0]}>
        <CharacterModel color={color} type={type} isMoving={false} scale={0.9} gender={gender} costume={costume} />
      </group>
    </group>
  );
};

const Operatives: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('aryan_shadow');
  const activeChar: CharacterLore = characterLore[selectedId] || characterLore.aryan_shadow;

  const handleSelect = (id: string) => {
    audio.playClickSound();
    setSelectedId(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
      case 'MIA':
        return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'REDACTED':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/5';
      case 'DECEASED':
        return 'border-red-500/30 text-red-500 bg-red-500/5';
      default:
        return 'border-gray-500/30 text-gray-400 bg-gray-500/5';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 px-4 relative overflow-hidden">
      <TacticalHUD />

      {/* Cyber Background details */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-blue-500" />
            <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Tactical Database</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter mb-2 uppercase leading-none chromatic-aberration">
            ACTIVE <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">OPERATIVES</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-xl">
            Personnel profiles, deployment status, and tactical intelligence clearance logs for Sector Command.
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Selection Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="font-mono text-[10px] tracking-[0.3em] text-gray-500 uppercase border-b border-white/5 pb-2 mb-2">
              Select Profile Dossier
            </div>
            <div className="flex flex-col gap-3">
              {Object.values(characterLore).map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSelect(char.id)}
                  onMouseEnter={() => audio.playHoverSound()}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                    selectedId === char.id
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/50 p-1 flex items-center justify-center">
                      {CharacterPortraits[char.id]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wider uppercase group-hover:text-blue-400 transition-colors">
                        {char.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-0.5">
                        {char.role}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${getStatusColor(char.status)}`}>
                    {char.status}
                  </span>

                  {selectedId === char.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Showcase Dossier Column (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 md:p-12 relative overflow-hidden"
              >
                {/* Visual scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.03)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                
                {/* Dossier Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* 3D Hologram Portrait Panel */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center gap-4">
                    <div className="w-full aspect-square bg-black/40 border border-blue-500/20 rounded-2xl p-2 relative group shadow-2xl overflow-hidden h-[300px]">
                      <div className="absolute inset-0 bg-tactical-grid bg-grid-sm opacity-10 pointer-events-none" />
                      <div className="w-full h-full">
                        <ThreeScene autoRotate={false} enableZoom={false} environment="studio">
                          <HologramOperative id={activeChar.id} gender={activeChar.gender} costume={activeChar.costume} />
                        </ThreeScene>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
                    </div>
                    <div className="text-center font-mono">
                      <span className="text-[10px] text-gray-500 tracking-widest uppercase block mb-1">Clearance Protocol</span>
                      <span className="text-xs text-blue-400 font-bold tracking-[0.25em]">SEC_LEVEL_04</span>
                    </div>
                  </div>

                  {/* Text Details Panel */}
                  <div className="md:col-span-8 space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${getStatusColor(activeChar.status)}`}>
                          {activeChar.status}
                        </span>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                          {activeChar.role}
                        </span>
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest border border-gray-600/30 px-2 py-0.5 rounded bg-gray-900/50">
                          {activeChar.gender === 'male' ? 'MALE' : 'FEMALE'}
                        </span>
                      </div>
                      <h2 className="text-4xl font-black italic uppercase text-white tracking-tight">
                        {activeChar.name}
                      </h2>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <h4 className="text-[10px] font-mono text-blue-500/60 uppercase tracking-[0.3em] font-black">
                        TACTICAL_BIOGRAPHY
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
                        "{activeChar.bio}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <h4 className="text-[10px] font-mono text-blue-500/60 uppercase tracking-[0.3em] mb-2 font-black">
                          SPECIALIZATION
                        </h4>
                        <span className="text-xs text-white font-bold tracking-wide block bg-white/5 border border-white/10 px-3 py-2 rounded-lg mb-4">
                          {activeChar.specialization}
                        </span>
                        
                        <h4 className="text-[10px] font-mono text-blue-500/60 uppercase tracking-[0.3em] mb-2 font-black">
                          DEPLOYMENT_GEAR
                        </h4>
                        <span className="text-xs text-blue-300 font-bold tracking-wide block bg-blue-900/10 border border-blue-500/20 px-3 py-2 rounded-lg">
                          {activeChar.costume}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono text-blue-500/60 uppercase tracking-[0.3em] mb-2 font-black">
                          DEX_ATTRIBUTES
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeChar.traits.map((trait) => (
                            <span
                              key={trait}
                              className="text-[9px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded"
                            >
                              {trait.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Cyber HUD Borders */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/30 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/30 rounded-bl-xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-xl pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Operatives;
