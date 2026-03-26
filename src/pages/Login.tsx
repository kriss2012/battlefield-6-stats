import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 blur-[100px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-[1px] w-6 bg-blue-500" />
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] uppercase">Security Protocol</span>
            <span className="h-[1px] w-6 bg-blue-500" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome <span className="text-blue-500">Back</span></h1>
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Authenticate to establish uplink</p>
        </div>

        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
              >
                AUTH_FAILURE: {error}
              </motion.div>
            )}

            <div className="group/field">
              <label htmlFor="username" className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-blue-500 transition-colors">
                OPERATOR_IDENT
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 text-white font-mono text-sm placeholder-gray-700 transition-all"
                placeholder="USERNAME_OR_EMAIL"
              />
            </div>

            <div className="group/field">
              <label htmlFor="password" className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-focus-within/field:text-blue-500 transition-colors">
                ENCRYPTION_KEY
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 text-white font-mono text-sm placeholder-gray-700 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 rounded-2xl transition-all font-black italic uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 text-sm"
            >
              {loading ? 'AUTHENTICATING...' : 'ESTABLISH UPLINK'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
              Mission critical? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">ENLIST_NOW</Link>
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
