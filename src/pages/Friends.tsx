import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Friend {
  friendship_id: number;
  user_id: number;
  username: string;
  player_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface FriendRequest {
  friendship_id: number;
  user_id: number;
  username: string;
  player_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function Friends() {
  const { token } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadSocialData = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        socialApi.getFriends(token!),
        socialApi.getFriendRequests(token!)
      ]);

      if (friendsRes.friends) setFriends(friendsRes.friends);
      if (requestsRes.requests) setRequests(requestsRes.requests);
    } catch (_error) {
      console.error('Failed to load social data:', _error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadSocialData();
    }
  }, [token, loadSocialData]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    try {
      const res = await socialApi.sendFriendRequest(token!, searchUsername);
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ text: 'Friend request sent!', type: 'success' });
        setSearchUsername('');
      }
    } catch (_error) {
      setMessage({ text: 'Deployment failed', type: 'error' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleRespond = async (friendshipId: number, action: 'accept' | 'reject') => {
    try {
      const res = await socialApi.respondToFriendRequest(token!, friendshipId, action);
      if (!res.error) {
        setRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
        if (action === 'accept') {
          loadSocialData(); // Reload to get new friend in list
        }
      }
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  const handleRemoveFriend = async (friendshipId: number) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      const res = await socialApi.removeFriend(token!, friendshipId);
      if (!res.error) {
        setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId));
      }
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] uppercase">Social Intelligence</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              Friend <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Network</span>
            </h1>
          </div>

          <form onSubmit={handleSendRequest} className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-full md:w-auto">
            <input 
              type="text" 
              placeholder="ENTER USERNAME..." 
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="bg-transparent border-none outline-none px-4 py-2 text-xs font-mono uppercase tracking-widest flex-1 min-w-[200px]"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
            >
              SIGNAL
            </button>
          </form>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl mb-8 font-bold text-center text-xs tracking-widest uppercase ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Friends List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Connections ({friends.length})
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : friends.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {friends.map((friend) => (
                    <motion.div
                      key={friend.friendship_id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-4 group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
                          <div className="w-full h-full rounded-[11px] bg-neutral-900 flex items-center justify-center overflow-hidden">
                            {friend.avatar_url ? (
                              <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-black italic">{friend.username[0].toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black italic uppercase tracking-wider text-sm">{friend.username}</h3>
                          <p className="text-[10px] text-gray-500 font-mono tracking-tight">{friend.player_name || 'NO_LINKED_ACCOUNT'}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveFriend(friend.friendship_id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                          title="TERMINATE LINK"
                        >
                          <span className="text-red-500 text-xs">×</span>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="glass-card p-12 text-center border-dashed border-2 border-white/5 opacity-50">
                <div className="text-4xl mb-4 grayscale">📡</div>
                <p className="text-xs font-mono uppercase tracking-widest">No active data streams detected.</p>
              </div>
            )}
          </div>

          {/* Side Panel: Requests */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Incoming Signals ({requests.length})
            </h2>

            <div className="space-y-3">
              <AnimatePresence>
                {requests.map((request) => (
                  <motion.div
                    key={request.friendship_id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="glass-card p-3"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center text-xs font-black italic">
                        {request.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black uppercase tracking-widest truncate">{request.username}</p>
                        <p className="text-[8px] text-gray-500 font-mono uppercase truncate">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleRespond(request.friendship_id, 'accept')}
                        className="py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        ACCEPT
                      </button>
                      <button 
                        onClick={() => handleRespond(request.friendship_id, 'reject')}
                        className="py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        DECLINE
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {requests.length === 0 && !loading && (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 opacity-50">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-gray-600">Frequency clear.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
