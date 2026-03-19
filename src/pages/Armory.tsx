import React, { useState } from 'react';
import ArmoryView from '../components/ArmoryView';

const Armory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operators' | 'arsenal'>('operators');
  const [selectedId, setSelectedId] = useState(1);
  const [customColor, setCustomColor] = useState('#3b82f6');
  
  // Advanced Attachment System
  const [attachments, setAttachments] = useState<{ [key: string]: string }>({
    optic: 'none',
    muzzle: 'none',
    underbarrel: 'none',
    magazine: 'none',
  });

  const operators = [
    { id: 1, name: 'VANGUARD', role: 'Assault', level: 42, xp: 85, desc: 'Frontline combat specialist with adaptive armor.', color: '#3b82f6', skills: ['ADAPTIVE PLATING', 'STORM BREACH'] },
    { id: 2, name: 'GHOST', role: 'Infiltrator', level: 28, xp: 40, desc: 'Stealth-focused operative with thermal suppression.', color: '#10b981', skills: ['CLOAK DRIVE', 'GHOST SENSOR'] },
    { id: 3, name: 'TITAN', role: 'Engineer', level: 15, xp: 90, desc: 'Heavy support unit capable of field repairs.', color: '#f59e0b', skills: ['REPAIR DRONE', 'FORTIFY'] },
  ];

  const weapons = [
    { id: 1, name: 'M5A3 MKII', type: 'Assault Rifle', level: 50, xp: 100, desc: 'Standard issue modular weapon platform.', color: '#4b5563' },
    { id: 2, name: 'SWS-10', type: 'Sniper', level: 32, xp: 15, desc: 'Long-range precision kinetic energy rifle.', color: '#1e293b' },
    { id: 3, name: 'VECTOR-9', type: 'SMG', level: 12, xp: 65, desc: 'High-rate spectral combat submachine gun.', color: '#6366f1' },
  ];

  const currentList = activeTab === 'operators' ? operators : weapons;
  const selectedItem = currentList.find(i => i.id === selectedId) || currentList[0];

  const updateAttachment = (slot: string, item: string) => {
    setAttachments(prev => ({ ...prev, [slot]: item }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Ambience handled by Layout but adding local flare */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-7xl relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] uppercase">Tactical Arsenal</span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter mb-2 uppercase leading-none chromatic-aberration animate-glitch-v2">
              The <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Armory</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl">
              Customize your combat readiness with high-fidelity 3D previews and advanced modular synthesis.
            </p>
          </div>

          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => { setActiveTab('operators'); setSelectedId(1); }}
              className={`px-8 py-2 rounded-xl text-xs font-black italic uppercase transition-all ${activeTab === 'operators' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'hover:bg-white/5 text-gray-400'}`}
            >
              Operators
            </button>
            <button 
              onClick={() => { setActiveTab('arsenal'); setSelectedId(1); }}
              className={`px-8 py-2 rounded-xl text-xs font-black italic uppercase transition-all ${activeTab === 'arsenal' ? 'bg-purple-600 shadow-lg shadow-purple-500/20' : 'hover:bg-white/5 text-gray-400'}`}
            >
              Arsenal
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* 3D Preview */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-square bg-black/40 border border-white/10 rounded-[40px] overflow-hidden relative backdrop-blur-xl">
              <ArmoryView 
                type={activeTab === 'operators' ? 'operator' : 'weapon'} 
                color={customColor === '#3b82f6' ? selectedItem.color : customColor} 
                accessory={attachments.optic !== 'none' ? attachments.optic : undefined}
              />
              
              {/* Controls UI overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 bg-black/60 border border-white/10 rounded-full backdrop-blur-xl">
                <div className="flex flex-col items-center gap-1 group/control">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[7px] font-mono text-gray-500 uppercase">3D_LOCKED</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <span className="text-[9px] font-black italic text-white/60 tracking-widest uppercase">Rotate to Inspect</span>
              </div>

              {/* Stats Overlay */}
              <div className="absolute top-8 left-8 space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Global Ranking</span>
                  <span className="text-2xl font-black italic">#{selectedItem.id * 124}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Mastery Level</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black italic">LVL {selectedItem.level}</span>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedItem.xp}%` }}
                        className="h-full bg-blue-500" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selection & Customization */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                    {activeTab === 'operators' ? 'Unit Profile' : 'Technical Specs'}
                  </span>
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">{selectedItem.name}</h2>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-[10px] text-gray-400">
                  {activeTab === 'operators' ? `SQUAD_ID_${selectedItem.id}` : `WPN_REF_${selectedItem.id}`}
                </div>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                {selectedItem.desc}
              </p>

              {/* Skills for Operators */}
              {activeTab === 'operators' && 'skills' in selectedItem && (
                <div className="space-y-4 mb-8">
                  <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-[0.2em] block">
                    Active Skills
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.skills.map((skill, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {i === 0 ? '⚡' : '🛡️'}
                        </div>
                        <span className="text-[10px] font-black italic uppercase block">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments for Weapons */}
              {activeTab === 'arsenal' && (
                <div className="space-y-6 mb-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-[0.2em] block">
                      Optics Slot
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['none', 'holo', '2x', '4x', '6x'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => updateAttachment('optic', opt)}
                          className={`px-3 py-1.5 border rounded-lg text-[9px] font-black italic uppercase transition-all ${
                            attachments.optic === opt 
                              ? 'bg-purple-600 border-purple-400 text-white' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {opt === 'none' ? 'Iron Sights' : opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-[0.2em] block">
                      Tactical Slot
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['none', 'laser', 'light', 'suppressor'].map((tac) => (
                        <button
                          key={tac}
                          onClick={() => updateAttachment('muzzle', tac)}
                          className={`px-3 py-1.5 border rounded-lg text-[9px] font-black italic uppercase transition-all ${
                            attachments.muzzle === tac 
                              ? 'bg-blue-600 border-blue-400 text-white' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {tac === 'none' ? 'Standard' : tac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-[0.2em] block">
                  Material Finish
                </span>
                <div className="flex gap-3">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ffffff', '#222222'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${customColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-white text-black rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-400 transition-colors flex items-center justify-center gap-3 active:scale-95">
                DEPLOY CONFIGURATION
                <span className="text-xs">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedId(item.id); setCustomColor('#3b82f6'); }}
                  className={`flex items-center gap-6 p-4 rounded-3xl border transition-all text-left group ${selectedId === item.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${selectedId === item.id ? 'bg-blue-600' : 'bg-white/5'}`}>
                    {activeTab === 'operators' ? '👤' : '🔫'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-black italic text-sm uppercase tracking-wide">{item.name}</h4>
                      <span className="text-[8px] font-mono text-blue-400">LVL {item.level}</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                      {'role' in item ? item.role : item.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Armory;
