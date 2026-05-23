import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import Logo from './Logo';
import { useState } from 'react';
import { audio } from '../utils/audio';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    audio.playClickSound();
    logout();
    navigate('/');
  };

  const categories = [
    {
      id: "operations",
      label: "OPERATIONS",
      links: [
        { to: "/campaign", label: "CAMPAIGN" },
        { to: "/simulation", label: "SIMULATION" },
        { to: "/story", label: "SHADOW RISING" }
      ]
    },
    {
      id: "intel",
      label: "INTEL",
      links: [
        { to: "/operatives", label: "OPERATIVES" },
        { to: "/codex", label: "CODEX" },
        { to: "/explore", label: "WORLD LORE" }
      ]
    },
    {
      id: "system",
      label: "SYSTEM",
      links: [
        { to: "/armory", label: "ARMORY" },
        { to: "/forge", label: "NEURAL FORGE" }
      ]
    },
    {
      id: "terminal",
      label: "TERMINAL",
      links: [
        { to: "/player", label: "PLAYER SEARCH" },
        { to: "/analytics", label: "ANALYTICS" },
        { to: "/head-to-head", label: "5V5 SIMULATOR" },
        { to: "/leaderboard", label: "RANKINGS" },
        { to: "/servers", label: "NETWORKS" },
        { to: "/friends", label: "FRIENDS" },
        { to: "/squads", label: "SQUADS" }
      ]
    }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[201] flex items-center gap-2 w-[95%] max-w-[1280px]"
      >
        {/* Sector Identity */}
        <div className="hidden xl:flex flex-col items-end mr-4 font-mono text-[9px] text-gray-500 tracking-[0.3em] shrink-0">
          <span>SECTOR // 06</span>
          <span className="text-blue-500/50 font-bold">UPLINK_SECURE</span>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-visible group flex-1">
          {/* Subtle scanning line effect in background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none rounded-2xl" />
          
          <div className="flex items-center gap-2">
            <Link to="/" onClick={() => audio.playClickSound()} className="px-3 py-1 hover:bg-white/5 rounded-xl transition-all">
              <Logo size={32} />
            </Link>
            
            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            {/* Desktop Navigation Groups */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={() => {
                    audio.playHoverSound();
                    setActiveCategory(cat.id);
                  }}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className={`px-4 py-2 rounded-xl text-xs font-black tracking-[0.2em] transition-all duration-300 flex items-center gap-1 ${
                    activeCategory === cat.id ? 'bg-white/5 text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}>
                    {cat.label}
                    <span className="text-[8px] opacity-40 transition-transform duration-300" style={{ transform: activeCategory === cat.id ? 'rotate(180deg)' : 'none' }}>▼</span>
                  </button>

                  <AnimatePresence>
                    {activeCategory === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-neutral-950/95 backdrop-blur-3xl border border-white/10 p-2.5 rounded-xl shadow-2xl min-w-[200px] flex flex-col gap-1 z-[110]"
                      >
                        {cat.links.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => audio.playClickSound()}
                            className={({ isActive }) => `
                              px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all duration-200 block whitespace-nowrap
                              ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                          >
                            {link.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-[1px] bg-white/10 mx-1 hidden lg:block" />

            {/* Auth / Profile Area */}
            <div className="hidden lg:flex items-center gap-1">
              {isAuthenticated && <NotificationCenter />}
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link
                    to="/profile"
                    onClick={() => audio.playClickSound()}
                    className="px-4 py-2 text-[10px] font-black text-white hover:bg-white/5 rounded-xl transition-all tracking-widest uppercase border border-white/5 bg-white/5"
                  >
                    {user?.username}
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
                    onClick={() => audio.playClickSound()}
                    className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-white transition-all tracking-widest"
                  >
                    AUTH
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => audio.playClickSound()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 tracking-widest"
                  >
                    DEPLOY
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => {
                audio.playClickSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all gap-1.5"
            >
              <div className={`w-5 h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Telemetry Indicator */}
        <div className="hidden xl:flex flex-col ml-4 font-mono text-[9px] text-gray-500 tracking-[0.3em] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYNC_STABLE</span>
          </div>
          <span className="mt-0.5">MS_LATENCY: 12ms</span>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0d14] z-[200] lg:hidden flex flex-col p-8 pt-32 pb-24 overflow-y-auto border border-blue-500/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
          >
            {/* Visual background details */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,rgba(59,130,246,0.05)_95%)] bg-[size:100%_40px] pointer-events-none opacity-30" />
            
            <div className="flex flex-col gap-8 relative z-10">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-blue-500 tracking-[0.4em] uppercase font-bold border-b border-blue-500/20 pb-1">
                    {cat.label}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => {
                          audio.playClickSound();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold tracking-widest hover:border-blue-500/30 transition-all uppercase"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Auth links */}
            <div className="border-t border-white/10 pt-6 flex flex-col gap-3 relative z-10 mt-auto mt-12">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-xl">
                    <span className="text-gray-400 text-xs">OPERATOR:</span>
                    <span className="font-bold text-white tracking-widest uppercase">{user?.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-3 bg-white/10 border border-white/10 text-xs font-black tracking-widest rounded-xl hover:bg-white/20 transition-all"
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-6 bg-red-600/20 border border-red-500/30 text-red-500 text-sm rounded-xl hover:bg-red-600/30 transition-all"
                    >
                      ⏻
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => {
                      audio.playClickSound();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center py-3.5 border border-white/10 text-xs font-black text-gray-300 rounded-xl transition-all tracking-widest"
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => {
                      audio.playClickSound();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center py-3.5 bg-blue-600 text-xs font-black text-white rounded-xl transition-all shadow-lg tracking-widest"
                  >
                    DEPLOY
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
