import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import type { AIAsset } from '../services/aiService';

const NeuralForge: React.FC = () => {
  const [assets, setAssets] = useState<AIAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isStabilizing, setIsStabilizing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] NEURAL LINK ESTABLISHED', '[INFO] SECTOR SCANNING COMPLETE']);
  const [neuralLoad, setNeuralLoad] = useState(12);
  const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);

  // Neural Load Management
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setNeuralLoad(prev => Math.min(prev + Math.random() * 5, 95));
      }, 200);
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => {
        setNeuralLoad(12 + Math.random() * 5);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isGenerating]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const generate = async (type: 'texture' | 'character' | 'storyline') => {
    setIsGenerating(type);
    addLog(`INITIATING ${type.toUpperCase()} SYNTHESIS...`);
    
    try {
      let newAsset: AIAsset;
      if (type === 'texture') newAsset = await aiService.generateTexture();
      else if (type === 'character') newAsset = await aiService.generateCharacter();
      else newAsset = await aiService.generateStoryline();
      
      addLog(`DATA BLOCK RETRIEVED: ${newAsset.id}`);
      setIsStabilizing(true);
      addLog(`RECONSTRUCTION PHASE ACTIVE...`);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating stabilization
      
      setAssets((prev: AIAsset[]) => [newAsset, ...prev]);
      addLog(`STABILIZATION COMPLETE. COMMIT SUCCESS.`);
    } finally {
      setIsGenerating(null);
      setIsStabilizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.4em] uppercase">Neural Network Online</span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter mb-4 uppercase leading-none chromatic-aberration animate-glitch-v2">
              Neural <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Forge</span>
            </h1>
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">
              Tactical Synthesis & Asset Maturation Cycle v4.2
            </p>
          </div>

          {/* Neural Load Meter */}
          <div className="flex flex-col w-full md:w-64 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black italic tracking-widest text-gray-400 uppercase">Neural Load</span>
              <span className="text-[10px] font-mono text-blue-400">{neuralLoad.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className={`h-full bg-gradient-to-r ${neuralLoad > 80 ? 'from-orange-500 to-red-500' : 'from-blue-500 to-emerald-400'}`}
                animate={{ width: `${neuralLoad}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>
        </div>

        {/* Forge Controls & Live Feed */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex flex-wrap gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit h-fit">
            <button 
              onClick={() => generate('texture')}
              disabled={!!isGenerating}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/40 disabled:text-blue-300 rounded-xl transition-all font-black italic text-xs uppercase tracking-widest flex items-center gap-3"
            >
              {isGenerating === 'texture' ? 'Synthesizing...' : 'Dev Texture'}
              <span className="opacity-50 text-[10px]">01</span>
            </button>
            <button 
              onClick={() => generate('character')}
              disabled={!!isGenerating}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/40 disabled:text-emerald-300 rounded-xl transition-all font-black italic text-xs uppercase tracking-widest flex items-center gap-3"
            >
              {isGenerating === 'character' ? 'Forging...' : 'Dev Character'}
              <span className="opacity-50 text-[10px]">02</span>
            </button>
            <button 
              onClick={() => generate('storyline')}
              disabled={!!isGenerating}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 disabled:text-purple-300 rounded-xl transition-all font-black italic text-xs uppercase tracking-widest flex items-center gap-3"
            >
              {isGenerating === 'storyline' ? 'Analyzing...' : 'Dev Narrative'}
              <span className="opacity-50 text-[10px]">03</span>
            </button>
          </div>

          {/* Live Feed */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] h-[100px] overflow-hidden relative">
            <div className="absolute top-2 left-4 text-blue-500/40 font-black italic uppercase tracking-widest">Neural_Operations_Log</div>
            <div className="mt-4 flex flex-col gap-1">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - i * 0.1, x: 0 }}
                    className="text-gray-500"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Stabilization Overlay */}
        <AnimatePresence>
          {isStabilizing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-blue-500/5 backdrop-blur-md flex items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"
                  />
                </div>
                <span className="text-xl font-black italic tracking-[0.5em] text-blue-400 animate-pulse uppercase">Recalibrating Neural Mesh</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {assets.map((asset: AIAsset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 border-t-2 border-t-white/10 flex flex-col h-full group relative overflow-hidden"
              >
                {/* Tactical Scanning Background (Hover Only) */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 pointer-events-none" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-[0.2em] ${
                    asset.type === 'texture' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    asset.type === 'character' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}>
                    {asset.type}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">{asset.timestamp}</span>
                    <span className="text-[8px] font-mono text-blue-500/40">CORE_SYNC_OK</span>
                  </div>
                </div>

                {asset.type !== 'storyline' ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-black group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all">
                    <img 
                      src={asset.content} 
                      alt={asset.title} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Measurement Overlay */}
                    <div className="absolute bottom-4 left-4 font-mono text-[8px] text-white/40 tracking-widest flex gap-4 uppercase">
                      <span>X: 1024</span>
                      <span>Y: 1024</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-neutral-900 rounded-2xl border border-white/5 mb-6 flex-1 italic text-gray-400 font-mono text-sm leading-relaxed relative group-hover:bg-neutral-800 transition-colors">
                    <span className="absolute top-4 left-4 text-4xl text-white/5 pointer-events-none">"</span>
                    {asset.content}
                    <div className="absolute bottom-4 right-4 h-1 w-8 bg-purple-500/20" />
                  </div>
                )}

                <div className="relative z-10">
                  <h3 className="text-2xl font-black italic uppercase mb-2 group-hover:text-blue-400 transition-colors tracking-tight leading-none">
                    {asset.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                    {asset.description}
                  </p>

                  <div className="flex justify-between items-end">
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-black italic text-[9px] tracking-widest uppercase text-gray-400 hover:text-white"
                    >
                      Analyze Source
                    </button>
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] flex flex-col items-end">
                      <span>COM_VER_8.1</span>
                      <span className="text-emerald-500/40">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {assets.length === 0 && !isGenerating && (
            <div className="col-span-full py-48 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
              <div className="text-7xl mb-8 grayscale opacity-20">🧬</div>
              <p className="text-gray-500 font-mono uppercase tracking-[0.8em] text-xs">
                Uplink established. Accessing Neural Layers...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Modal Overlay */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[600px]"
            >
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-12 overflow-hidden group">
                {selectedAsset.type !== 'storyline' ? (
                  <img src={selectedAsset.content} alt={selectedAsset.title} className="w-full h-full object-contain scale-110 group-hover:scale-100 transition-transform duration-[3000ms]" />
                ) : (
                  <div className="text-6xl text-purple-500 opacity-20 group-hover:opacity-40 transition-opacity">"</div>
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40 pointer-events-none" />
              </div>

              <div className="flex-1 p-12 flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div className="uppercase">
                    <span className="text-[10px] text-blue-400 font-mono tracking-widest">{selectedAsset.type} // DATA_BLOCK</span>
                    <h2 className="text-4xl font-black italic tracking-tighter leading-none mt-2">{selectedAsset.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="p-3 hover:bg-white/5 rounded-full transition-colors group"
                  >
                    <span className="group-hover:rotate-90 transition-transform block text-2xl">✕</span>
                  </button>
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-[0.2em] block mb-2">Tactical Breakdown</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{selectedAsset.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-gray-600 block mb-1 uppercase">Synthesis Confidence</span>
                      <span className="text-lg font-black text-blue-400 italic">98.4%</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-gray-600 block mb-1 uppercase">Neural Load</span>
                      <span className="text-lg font-black text-blue-400 italic">{neuralLoad.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-400 transition-colors"
                    >
                      Finalize Command
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralForge;
