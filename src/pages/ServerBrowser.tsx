import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serverApi } from '../services/api';
import type { Server } from '../types';

export default function ServerBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load servers on mount
  useEffect(() => {
    loadServers('');
  }, []);

  const loadServers = async (name: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await serverApi.getServers(name, 30);

      if (response.error) {
        setError(response.error);
        setServers([]);
      } else if (response.data) {
        const serverData = (response.data as { servers?: Server[] }).servers || [];
        setServers(serverData);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to load servers. Please try again.');
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadServers(searchTerm);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase">Network Infrastructure</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              Server <span className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">Nodes</span>
            </h1>
          </div>
          
          <Link to="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-xs tracking-widest uppercase">
            ← RETREAT TO HOME
          </Link>
        </div>

          <form onSubmit={handleSearch} className="glass-card p-2 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="AUTHENTICATE NODE BY NAME..."
                className="flex-1 px-6 py-4 bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-600 font-mono text-xs uppercase tracking-widest"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 rounded-xl font-black italic transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest"
              >
                {loading ? 'UPLINKING...' : 'SCAN NETWORK'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="glass-card p-24 text-center border-dashed border-2 border-white/5 opacity-50">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-6"></div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-gray-500">Establishing multi-node synchronization...</p>
            </div>
          ) : servers.length === 0 ? (
            <div className="glass-card p-24 text-center border-dashed border-2 border-white/5 opacity-50">
              <div className="text-4xl mb-6 grayscale opacity-20">📡</div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-gray-600">
                {searchTerm ? 'ZERO_TARGETS_ACQUIRED' : 'NETWORK_OFFLINE'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {servers.map((server: Server) => (
                <motion.div
                  key={server.serverId || server.id}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="glass-card p-8 group relative overflow-hidden transition-all border border-white/5 hover:border-blue-500/30"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                          {server.prefix}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5">
                          {server.mode}
                        </span>
                        <span className="px-3 py-1 bg-blue-600/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                          {server.region}
                        </span>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/5 flex items-center gap-2">
                          🗺️ {server.currentMap}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <div className="text-3xl font-black italic text-white leading-none mb-1">
                          {server.playerAmount}<span className="text-blue-500/40">/</span>{server.maxPlayers}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Combatants</div>
                      </div>
                      
                      <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black italic text-xs uppercase tracking-[0.2em] transition-all border border-white/10 group-hover:border-blue-500/50 group-hover:text-blue-400">
                        CONNECT
                      </button>
                    </div>
                  </div>
                  
                  {server.progress !== null && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${server.progress}%` }}
                        className="h-full bg-blue-500/40"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
