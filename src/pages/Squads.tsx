import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Squad {
  id: number;
  name: string;
  tag: string;
  description: string;
  owner_user_id: number;
  owner_name?: string;
  member_count: number;
  is_public: boolean;
  avatar_url: string | null;
}

export default function Squads() {
  const { token, user } = useAuth();
  const [publicSquads, setPublicSquads] = useState<Squad[]>([]);
  const [mySquads, setMySquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSquad, setNewSquad] = useState({ name: '', tag: '', description: '', isPublic: true });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (token) {
      loadSquadData();
    }
  }, [token]);

  const loadSquadData = async () => {
    setLoading(true);
    try {
      const [publicRes, myRes] = await Promise.all([
        socialApi.getSquads(token!),
        socialApi.getMySquads(token!)
      ]);
      if (publicRes.squads) setPublicSquads(publicRes.squads);
      if (myRes.squads) setMySquads(myRes.squads);
    } catch (error) {
      console.error('Failed to load squad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await socialApi.createSquad(token!, newSquad);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'Squad deployed successfully!', type: 'success' });
        setShowCreateModal(false);
        setNewSquad({ name: '', tag: '', description: '', isPublic: true });
        loadSquadData();
      }
    } catch (error) {
      setMessage({ text: 'Deployment failed', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleJoinSquad = async (squadId: number) => {
    try {
      const res = await socialApi.joinSquad(token!, squadId);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'Successfully joined squad!', type: 'success' });
        loadSquadData();
      }
    } catch (error) {
      setMessage({ text: 'Failed to join squad', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-8 bg-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-400 tracking-[0.4em] uppercase">Tactical Units</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              Squad <span className="bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent">Operations</span>
            </h1>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20"
          >
            CREATE SQUAD
          </button>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl mb-8 font-bold text-center text-xs tracking-widest uppercase border ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Public Squads Search */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Available Divisions ({publicSquads.length})
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {publicSquads.map((squad) => (
                  <motion.div
                    key={squad.id}
                    whileHover={{ y: -5 }}
                    className="glass-card p-6 group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-blue-400">[{squad.tag}]</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">{squad.member_count} OPERATORS</div>
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{squad.name}</h3>
                    <p className="text-xs text-gray-400 mb-6 line-clamp-2 h-8 leading-relaxed italic">{squad.description || 'No mission priority assigned.'}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-mono text-gray-600">CMD: {squad.owner_name}</span>
                      {!mySquads.some(ms => ms.id === squad.id) && (
                        <button 
                          onClick={() => handleJoinSquad(squad.id)}
                          className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-[9px] font-black tracking-widest transition-all"
                        >
                          JOIN
                        </button>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* User's Squads */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              My Deployments ({mySquads.length})
            </h2>

            <div className="space-y-4">
              {mySquads.map((squad) => (
                <div key={squad.id} className="glass-card p-4 border-l-4 border-emerald-500 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-emerald-400 font-mono text-[10px]">[{squad.tag}]</span>
                    <h3 className="font-black italic uppercase text-sm tracking-widest">{squad.name}</h3>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="uppercase tracking-widest">MEMBERS: {squad.member_count}</span>
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black tracking-tighter">
                      {squad.owner_user_id === user?.id ? 'COMMANDER' : 'OPERATOR'}
                    </span>
                  </div>
                </div>
              ))}
              
              {mySquads.length === 0 && !loading && (
                <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl opacity-50">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600">Unassigned to any unit.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Squad Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Establish New Unit</h2>
              
              <form onSubmit={handleCreateSquad} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">SQUAD_NAME</label>
                  <input 
                    type="text" 
                    required
                    value={newSquad.name}
                    onChange={(e) => setNewSquad(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all uppercase font-black"
                    placeholder="WOLFPACK_Actual"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">IDENT_TAG</label>
                    <input 
                      type="text" 
                      required
                      maxLength={4}
                      value={newSquad.tag}
                      onChange={(e) => setNewSquad(prev => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all uppercase font-black"
                      placeholder="WOLF"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-3 pl-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={newSquad.isPublic}
                        onChange={(e) => setNewSquad(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-emerald-600 focus:ring-emerald-500/50"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-emerald-400 transition-colors">Public Signal</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">MISSION_OBJECTIVES</label>
                  <textarea 
                    value={newSquad.description}
                    onChange={(e) => setNewSquad(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all h-24 resize-none leading-relaxed italic"
                    placeholder="Enter mission description..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    ABORT
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20"
                  >
                    DEPLOY UNIT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
