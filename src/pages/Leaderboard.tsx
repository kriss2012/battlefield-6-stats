import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
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
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-8 bg-amber-500" />
              <span className="text-[10px] font-mono text-amber-400 tracking-[0.4em] uppercase">Competitive Arena</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              Global <span className="bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">Rankings</span>
            </h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {(['kd_ratio', 'wins', 'level'] as const).map((stat) => (
              <button
                key={stat}
                onClick={() => setSortBy(stat as any)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  sortBy === stat ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                {stat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-6 font-mono text-xs">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                        index === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                        index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                        index === 2 ? 'bg-orange-800/20 text-orange-500 border border-orange-500/30' :
                        'text-gray-600'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black italic text-lg uppercase text-gray-500 group-hover:text-amber-400 transition-colors">
                          {entry.player_name[0]}
                        </div>
                        <div>
                          <div className="font-black italic uppercase tracking-wider text-sm">{entry.player_name}</div>
                          <div className="text-[9px] text-gray-600 font-mono">ID: {entry.player_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center font-black italic text-sm text-gray-400">LVL {entry.level}</td>
                    <td className="px-6 py-6 text-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest border border-emerald-500/20">
                        {entry.wins} W
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="font-black italic text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {parseFloat(entry.kd_ratio).toFixed(2)}
                      </div>
                      <div className="text-[8px] text-gray-600 uppercase tracking-widest font-mono">KILL_DEATH_RATIO</div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          
          {entries.length === 0 && !loading && (
            <div className="p-24 text-center">
              <div className="text-4xl mb-4 grayscale opacity-20">🏆</div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-600">Leaderboard data currently offline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
