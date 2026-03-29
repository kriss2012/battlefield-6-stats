import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { leaderboardApi } from '../services/api';

interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  kills: number;
  kd_ratio: string;
  wins: number;
  level: number;
  rank: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'kd_ratio' | 'score' | 'wins' | 'level'>('kd_ratio');

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leaderboardApi.getLeaderboard(sortBy, 50);
      if (res.leaderboard) {
        setEntries(res.leaderboard);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return (
    <div className="min-h-screen bg-tactical-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-tactical-grid bg-grid-lg opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-tactical-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-tactical-secondary/10 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2px] w-12 bg-tactical-primary tactical-glow" />
              <span className="text-xs font-hud text-tactical-primary tracking-[0.4em] uppercase">Competitive Arena</span>
            </div>
            <h1 className="text-5xl font-display font-black tracking-tighter uppercase leading-none text-glow">
              Global <span className="text-white">Rankings</span>
            </h1>
          </div>

          <div className="flex glass-card p-1">
            {(['kd_ratio', 'wins', 'level'] as const).map((stat) => (
              <button
                key={stat}
                onClick={() => setSortBy(stat)}
                className={`px-6 py-2 rounded-lg text-xs font-hud uppercase tracking-widest transition-all ${
                  sortBy === stat ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary/50 shadow-neon-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {stat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-tactical-primary/20 text-xs font-hud uppercase tracking-[0.2em] text-tactical-primary">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Operator</th>
                <th className="px-6 py-4 text-center">Level</th>
                <th className="px-6 py-4 text-center">Wins</th>
                <th className="px-6 py-4 text-right">K/D Ratio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse border-b border-white/5">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-white/5 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                entries.map((entry, index) => (
                  <motion.tr
                    key={entry.player_id}
                    initial={{ opacity: 0, x: -20, rotateX: -10 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                    className="border-b border-tactical-primary/10 hover:bg-tactical-primary/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-6 font-hud text-xs">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary shadow-neon-blue' : 
                        index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400' :
                        index === 2 ? 'bg-orange-800/20 text-orange-500 border border-orange-500' :
                        'text-gray-500 border border-transparent group-hover:border-tactical-primary/30 group-hover:text-tactical-primary'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-tactical-dark border border-tactical-primary/20 flex items-center justify-center font-display text-lg uppercase text-tactical-primary group-hover:shadow-neon-blue transition-all">
                          {entry.player_name[0]}
                        </div>
                        <div>
                          <div className="font-display font-medium uppercase tracking-wider text-sm text-white group-hover:text-tactical-primary transition-colors">{entry.player_name}</div>
                          <div className="text-[10px] text-gray-500 font-hud">ID: {entry.player_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center font-hud text-sm text-tactical-accent">LVL {entry.level}</td>
                    <td className="px-6 py-6 text-center">
                      <span className="px-3 py-1 rounded-sm bg-tactical-success/10 text-tactical-success text-xs font-hud tracking-widest border border-tactical-success/20">
                        {entry.wins} W
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="font-hud text-lg text-white group-hover:text-glow transition-all">
                        {parseFloat(entry.kd_ratio).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-tactical-primary/50 uppercase tracking-widest font-hud">KILL/DEATH</div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          
          {entries.length === 0 && !loading && (
            <div className="p-24 text-center">
              <div className="text-4xl mb-4 grayscale opacity-20">🏆</div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-gray-600">Leaderboard data currently offline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
