import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: "/player", label: "PLAYER" },
    { to: "/analytics", label: "ANALYSIS" },
    { to: "/leaderboard", label: "RANKINGS" },
    { to: "/servers", label: "NETWORKS" },
    { to: "/head-to-head", label: "H2H" },
    { to: "/forge", label: "NEURAL FORGE" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2"
    >
      {/* Sector Identity */}
      <div className="hidden lg:flex flex-col items-end mr-6 font-mono text-[8px] text-gray-500 tracking-[0.3em]">
        <span>SECTOR // 06</span>
        <span className="text-blue-500/50">ACTIVE_LINK_STABLE</span>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl relative overflow-hidden group">
        {/* Subtle scanning line effect in background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
        
        <Link to="/" className="px-4 py-2 hover:bg-white/5 rounded-xl transition-all group/logo">
          <div className="font-black italic text-sm tracking-tighter text-white group-hover/logo:text-blue-400">
            BF6 <span className="text-[10px] not-italic opacity-50 ml-1">v2.0</span>
          </div>
        </Link>
        
        <div className="h-4 w-[1px] bg-white/10 mx-2" />

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }: { isActive: boolean }) => `
                px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 relative
                ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {link.label}
              <motion.div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </NavLink>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="px-4 py-2 text-[10px] font-black text-white hover:bg-white/5 rounded-xl transition-all tracking-widest"
              >
                {user?.username?.toUpperCase()}
              </Link>
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-xl transition-all group/logout"
                title="TERMINATE SESSION"
              >
                <span className="text-red-500 group-hover:scale-110 transition-transform">⏻</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-white transition-all tracking-widest"
              >
                AUTH
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 tracking-widest"
              >
                DEPLOY
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Indicator */}
      <div className="hidden lg:flex flex-col ml-6 font-mono text-[8px] text-gray-500 tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYNC_READY</span>
        </div>
        <span className="mt-0.5">LATENCY: 12ms</span>
      </div>
    </motion.nav>
  );
}
