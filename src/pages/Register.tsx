/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: Register.tsx
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(username, email, password, playerName || undefined, playerId || undefined);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-[1px] w-6 bg-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-[0.4em] uppercase">Personnel Enlistment</span>
            <span className="h-[1px] w-6 bg-emerald-500" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Create <span className="text-emerald-500">Account</span></h1>
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Join the tactical elite coalition</p>
        </div>

        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
              >
                ENLISTMENT_ERROR: {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-emerald-500 transition-colors">
                  OPERATOR_UID
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 text-white font-mono text-xs placeholder-gray-700 transition-all uppercase"
                  placeholder="USERNAME"
                />
              </div>

              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-emerald-500 transition-colors">
                  SECURE_COMMS_EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 text-white font-mono text-xs placeholder-gray-700 transition-all"
                  placeholder="EMAIL@ADDRESS.COM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-emerald-500 transition-colors">
                  ENCRYPTION_KEY
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 text-white font-mono text-xs placeholder-gray-700 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-emerald-500 transition-colors">
                  VERIFY_KEY
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 text-white font-mono text-xs placeholder-gray-700 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Deployment Identity (Optional)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group/field">
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">TACTICAL_CALLSIGN</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/30 text-white font-black italic uppercase text-xs transition-all"
                    placeholder="PLAYER_NAME"
                  />
                </div>
                <div className="group/field">
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">OPERATOR_ID</label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/30 text-white font-black italic uppercase text-xs transition-all"
                    placeholder="SPECTRE_ID"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 rounded-2xl transition-all font-black italic uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 text-sm mt-4"
            >
              {loading ? 'ENLISTING...' : 'FINALIZE ENLISTMENT'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Already enlisted? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1 uppercase">AUTHENTICATE</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.4em]">
            ← ABORT_TO_HOME
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
