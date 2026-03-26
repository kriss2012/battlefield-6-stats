import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { missions } from '../utils/missionData';
import type { Mission } from '../utils/missionData';
import TacticalHUD from '../components/TacticalHUD';

const Campaign: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [view, setView] = useState<'map' | 'briefing'>('map');

  const handleSelectMission = (mission: Mission) => {
    if (mission.status === 'LOCKED') return;
    setSelectedMission(mission);
    setView('briefing');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      <TacticalHUD />
      
      {/* Background World Map (Stylized) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <AnimatePresence mode="wait">
          {view === 'map' ? (
            <motion.div
              key="map-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-[1px] w-8 bg-blue-500" />
                    <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Global Operations</span>
                  </div>
                  <h1 className="text-6xl font-black italic tracking-tighter mb-2 uppercase leading-none chromatic-aberration">
                    Campaign <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Nexus</span>
                  </h1>
                  <p className="text-gray-500 font-medium max-w-xl">
                    Select an active deployment zone. Intelligence levels are restricted to Clearance Level 4.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {missions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    whileHover={mission.status !== 'LOCKED' ? { scale: 1.02 } : {}}
                    onClick={() => handleSelectMission(mission)}
                    className={`relative p-8 rounded-[40px] border transition-all cursor-pointer overflow-hidden group ${
                      mission.status === 'LOCKED' 
                        ? 'bg-white/5 border-white/5 grayscale opacity-50 cursor-not-allowed' 
                        : 'bg-white/10 border-white/10 hover:border-blue-500/50 hover:bg-white/20'
                    }`}
                  >
                    {/* Mission Header */}
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                        mission.difficulty === 'EASY' ? 'border-emerald-500/50 text-emerald-400' :
                        mission.difficulty === 'MEDIUM' ? 'border-yellow-500/50 text-yellow-400' :
                        'border-red-500/50 text-red-400'
                      }`}>
                        {mission.difficulty}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {mission.location}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black italic uppercase mb-2 group-hover:text-blue-400 transition-colors">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium line-clamp-2">
                      {mission.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                        {mission.status === 'COMPLETED' ? (
                          <span className="text-xs font-black text-emerald-500 uppercase">Mission Status: COMPLETED</span>
                        ) : mission.status === 'LOCKED' ? (
                          <span className="text-xs font-black text-red-500/50 uppercase">Mission Status: LOCKED</span>
                        ) : (
                          <span className="text-xs font-black text-blue-500 uppercase animate-pulse">Mission Status: AVAILABLE</span>
                        )}
                      </div>
                      {mission.status !== 'LOCKED' && (
                        <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                      )}
                    </div>

                    {/* Animated scanning line */}
                    {mission.status === 'AVAILABLE' && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div 
                          animate={{ y: ['0%', '200%'] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="w-full h-1/2 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="briefing-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setView('map')}
                className="mb-8 text-xs font-black italic uppercase text-gray-500 hover:text-white transition-colors flex items-center gap-2"
              >
                ← BACK TO NEXUS
              </button>

              <div className="glass-card p-12 relative overflow-hidden">
                {/* Briefing Top Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
                
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-white/10 pb-8 gap-4">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-2">Transmission Received</span>
                    <h2 className="text-4xl font-black italic uppercase">{selectedMission?.title}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-500 uppercase block">Commander</span>
                    <span className="text-lg font-black italic uppercase text-white">{selectedMission?.briefing.commander}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black italic uppercase text-gray-500 tracking-[0.2em] mb-4">Intelligence Brief</h4>
                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-xs leading-loose text-blue-100/80">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 2 }}
                        >
                          {selectedMission?.briefing.text}
                        </motion.p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black italic uppercase text-gray-500 tracking-[0.2em] mb-4">Priority Objectives</h4>
                      <ul className="space-y-3">
                        {selectedMission?.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="text-blue-500 font-mono mt-1">0{i+1}</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black italic uppercase text-gray-500 tracking-[0.2em] mb-4">Mission Rewards</h4>
                      <div className="grid gap-3">
                        {selectedMission?.rewards.map((reward, i) => (
                          <div key={i} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black italic uppercase text-purple-400">
                            {reward}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/simulation?missionId=${selectedMission?.id}`)}
                      className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black italic uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
                    >
                      INITIALIZE DEPLOYMENT
                      <span className="ml-3 group-hover:translate-x-2 transition-transform inline-block">→</span>
                    </button>
                    <p className="text-[11px] text-center font-mono text-gray-600 uppercase tracking-widest">
                      Warning: Deployment is irreversible once initialized.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Campaign;
