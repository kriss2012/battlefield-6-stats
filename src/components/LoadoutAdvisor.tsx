import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { analyticsApi } from '../services/api';

interface AIRecommendation {
  primaryRecommendation: {
    weapon: string;
    attachments: string[];
    justification: string;
    performanceIndex: string;
  };
  secondaryOption: {
    weapon: string;
    justification: string;
  };
  tacticalAdvice: string;
}

export default function LoadoutAdvisor({ playerId }: { playerId: string }) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getAIRecommendations(playerId);
      if (res && !res.error) {
        setRecommendation(res);
      }
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (playerId) {
      loadRecommendations();
    }
  }, [playerId, loadRecommendations]);

  if (loading) return (
    <div className="glass-card p-8 animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-white/5 rounded w-1/3" />
      <div className="h-20 bg-white/5 rounded w-full" />
    </div>
  );

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="text-8xl grayscale">🧬</span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Tactical Loadout Advisor</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Primary Recommendation</span>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {recommendation.primaryRecommendation.weapon}
            </h3>
            
            <div className="space-y-2 mb-6">
              {recommendation.primaryRecommendation.attachments.map((attach, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-300">
                  <span className="w-1 h-1 bg-blue-500 rounded-full" />
                  {attach}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-blue-500/20 pl-4">
              "{recommendation.primaryRecommendation.justification}"
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-4">Neural Performance Index</span>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black italic text-blue-400 leading-none">
                  {recommendation.primaryRecommendation.performanceIndex}
                </span>
                <span className="text-[10px] font-black text-gray-600 mb-1">/ 100</span>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Tactical Advice</span>
              <p className="text-xs text-gray-300 font-medium italic">
                {recommendation.tacticalAdvice}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex justify-between items-center bg-blue-600/5 p-4 rounded-xl border border-blue-500/10">
            <div>
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">Secondary Deployment Configuration</span>
              <span className="text-sm font-black italic uppercase text-white">{recommendation.secondaryOption.weapon}</span>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
              SWITCH CONFIG
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
