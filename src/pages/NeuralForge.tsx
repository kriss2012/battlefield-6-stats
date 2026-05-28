/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import CharacterModel from '../components/CharacterModel';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { addCustomCharacter, type CharacterLore } from '../utils/characterAssets';
import { audio } from '../utils/audio';

// Small inner component for the rotating hologram
const ForgeHologram: React.FC<{ gender: 'male' | 'female'; costume: string }> = ({ gender, costume }) => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.position.y = Math.sin(time * 2) * 0.05 - 0.4;
  });

  return (
    <group ref={groupRef}>
      <Cylinder args={[1.2, 1.4, 0.1, 32]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#0c111d" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.02, 32]} position={[0, -1.14, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3} />
      </Cylinder>
      <group position={[0, -0.05, 0]}>
        <CharacterModel color="#3b82f6" type="player" isMoving={false} scale={1.1} gender={gender} costume={costume} />
      </group>
    </group>
  );
};

const NeuralForge: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('CUSTOM OPERATIVE');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [costume, setCostume] = useState('Standard Issue Armor');
  const [isDeploying, setIsDeploying] = useState(false);

  const costumes = [
    'Standard Issue Armor',
    'Stealth Tactical Suit with Adaptive Camo Mesh',
    'Desert Ghillie Suit with Thermal Negation',
    'Juggernaut Powered Exoskeleton',
    'Sleek Runner Jacket and Augmented VR Visor',
    'Civilian Attire with Hidden Kevlar Weave',
    'Tactical Catsuit with Concealed Holsters',
    'High-Tech Urban Riot Gear',
    'EOD Blast Suit with Reinforced Plating'
  ];

  const handleDeploy = () => {
    if (!name.trim()) return;
    audio.playClickSound();
    setIsDeploying(true);
    audio.playVoiceAnnouncement(`New operative ${name} authorized. Deploying to roster.`);
    
    setTimeout(() => {
      const newChar: CharacterLore = {
        id: `custom_${Date.now()}`,
        name: name.toUpperCase(),
        role: role.toUpperCase(),
        bio: 'Classified Operative forged in the Neural Network. Origin unknown. Combat effectiveness rated highly anomalous.',
        traits: ['Adaptable', 'Unpredictable', 'Forged'],
        specialization: 'Custom Combat Parameters',
        status: 'ACTIVE',
        gender: gender,
        costume: costume
      };
      
      addCustomCharacter(newChar);
      navigate('/operatives');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto relative h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-xs text-blue-400 tracking-[0.4em] uppercase">Tactical Synthesis Forge</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none chromatic-aberration">
              Operative <span className="text-blue-500">Creator</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[600px]">
          {/* Left Panel: 3D Hologram Preview */}
          <div className="lg:col-span-7 glass-panel rounded-2xl relative overflow-hidden flex flex-col border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">Live Telemetry</span>
              <span className="text-xs font-black uppercase tracking-widest text-white/50 border border-white/10 px-2 py-1 rounded bg-black/50 backdrop-blur w-fit">
                {name || 'UNIDENTIFIED_ASSET'}
              </span>
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-tactical-grid bg-grid-sm opacity-10 pointer-events-none" />
            
            <div className="w-full h-full min-h-[500px]">
              <ThreeScene autoRotate={false} enableZoom={false} environment="studio">
                <ForgeHologram gender={gender} costume={costume} />
              </ThreeScene>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-neutral-950/90 to-transparent pointer-events-none" />
          </div>

          {/* Right Panel: Customization Options */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Identity Settings */}
            <div className="glass-card p-6 border-t-2 border-t-blue-500/50 flex flex-col gap-4">
              <h3 className="text-sm font-mono text-blue-400 tracking-[0.3em] uppercase mb-2">Identity Matrix</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Operative Callsign</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER CALLSIGN..."
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-black italic tracking-widest uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Combat Role</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-black italic tracking-widest uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-gray-300"
                />
              </div>
            </div>

            {/* Biological / Structural Settings */}
            <div className="glass-card p-6 border-t-2 border-t-emerald-500/50 flex flex-col gap-4">
              <h3 className="text-sm font-mono text-emerald-400 tracking-[0.3em] uppercase mb-2">Structural Base</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Anatomical Profile (Gender)</label>
                <div className="flex gap-4 mt-1">
                  <button
                    onClick={() => { audio.playHoverSound(); setGender('male'); }}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-black tracking-widest uppercase transition-all ${
                      gender === 'male' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/50 border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                    MALE
                  </button>
                  <button
                    onClick={() => { audio.playHoverSound(); setGender('female'); }}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-black tracking-widest uppercase transition-all ${
                      gender === 'female' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/50 border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                    FEMALE
                  </button>
                </div>
              </div>
            </div>

            {/* Tactical Gear Settings */}
            <div className="glass-card p-6 border-t-2 border-t-purple-500/50 flex flex-col gap-4 flex-1">
              <h3 className="text-sm font-mono text-purple-400 tracking-[0.3em] uppercase mb-2">Deployment Gear</h3>
              
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                {costumes.map(c => (
                  <button
                    key={c}
                    onClick={() => { audio.playHoverSound(); setCostume(c); }}
                    className={`w-full text-left p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      costume === c ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy Action */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !name.trim()}
              className="btn-tactical py-5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-600/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 text-lg font-black tracking-[0.2em]">{isDeploying ? 'AUTHORIZING DEPLOYMENT...' : 'DEPLOY TO ROSTER'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Deployment Overlay Effect */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-blue-500/10 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden mb-8">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1/2 h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"
              />
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-[0.5em] text-white animate-pulse text-glow">
              SYNTHESIZING
            </h2>
            <p className="mt-4 font-mono text-blue-400 tracking-widest text-sm uppercase">Integrating identity into core roster...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralForge;
