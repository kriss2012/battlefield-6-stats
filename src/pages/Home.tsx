import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Hero3D from '../components/Hero3D';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient">
      <div className="container mx-auto px-4 py-20 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        {/* User Navigation */}
        <div className="flex justify-end mb-8 md:mb-16 mt-8 md:mt-0 z-10 relative">
          {isAuthenticated ? (
            <div className="flex flex-col md:flex-row items-end md:items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <span className="text-gray-400 font-hud text-[10px] tracking-widest uppercase">Operator: {user?.username}</span>
              <Link
                to="/profile"
                className="btn-tactical py-2 px-6"
              >
                <span className="relative z-10">DASHBOARD</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/login"
                className="btn-tactical px-6 py-2 bg-transparent"
              >
                <span className="relative z-10">AUTHENTICATE</span>
              </Link>
              <Link
                to="/register"
                className="btn-tactical px-6 py-2"
              >
                <span className="relative z-10">DEPLOY</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-24 lg:mb-32 perspective-1000">
          <div className="flex-1 text-left animate-fade-in relative preserve-3d w-full mt-12 md:mt-0 z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-[10px] md:text-xs font-hud text-blue-400 tracking-[0.4em] uppercase">Tactical Intelligence Hub</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-2 italic tracking-tighter chromatic-aberration animate-glitch-v2 leading-none uppercase">
              SPECTRE <br className="lg:hidden" /><span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">DIVISION</span>
            </h1>
            <p className="text-[10px] md:text-xs font-hud text-blue-400/80 tracking-[0.3em] md:tracking-[0.45em] mb-6 md:mb-8 uppercase">SHADOW RECKONING</p>
            <p className="text-sm md:text-lg text-gray-400 font-medium max-w-xl dof-blur mb-8 leading-relaxed">
              Advanced tactical performance tracking, real-time command center telemetry, and cyber-espionage analytics for Spectre operatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/campaign" 
                className="btn-tactical py-4 px-10 text-center"
              >
                <span className="relative z-10">LAUNCH THEATER</span>
              </Link>
              <Link 
                to="/codex" 
                className="btn-tactical py-4 px-10 text-center bg-transparent"
              >
                <span className="relative z-10">ACCESS DATABASE</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full lg:max-w-2xl floating-3d relative z-0">
            <Hero3D />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { to: "/player", icon: "📊", title: "Tactical Stats", desc: "Deep-dive into player performance with detailed metrics and class breakdowns.", color: "blue" },
            { to: "/analytics", icon: "📈", title: "Telemetry", desc: "Visualize historical trends with skill signatures and performance stability charts.", color: "purple" },
            { to: "/leaderboard", icon: "🏆", title: "Rankings", desc: "Global ranking system tracking the most lethal operators in the combat theater.", color: "amber" },
            { to: "/servers", icon: "🎮", title: "Network", desc: "Scan active combat zones for server availability and real-time player density.", color: "emerald" },
            { to: "/operatives", icon: "👤", title: "Operatives Dossiers", desc: "Access tactical bios, clearance status levels, and agent lore files.", color: "blue" },
            { to: "/forge", icon: "🧬", title: "Neural Forge", desc: "AI-driven development of tactical textures, characters, and combat narratives.", color: "purple" },
            { to: "/friends", icon: "👥", title: "Friends Network", desc: "Coordinate and manage links with fellow Spectre operatives.", color: "emerald" },
            { to: "/story", icon: "🎬", title: "Shadow Rising", desc: "Experience the interactive revenge saga of Aryan Sharma.", color: "red" },
          ].map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            >
              <Link
                to={item.to}
                className="glass-card p-8 group relative overflow-hidden block h-full select-none"
              >
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3">{item.icon}</div>
                <h2 className={`text-xl font-black mb-3 italic uppercase tracking-wider group-hover:text-${item.color}-400 transition-colors`}>{item.title}</h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/head-to-head"
                className="glass-card p-6 group hover:bg-white/10 flex items-center gap-6 relative overflow-hidden block"
              >
                <div className="text-4xl group-hover:rotate-12 transition-transform">⚔️</div>
                <div>
                  <h3 className="text-lg font-black italic uppercase tracking-widest group-hover:text-orange-400 transition-colors">1v1 Comparison</h3>
                  <p className="text-gray-500 text-sm font-medium">Side-by-side tactical analysis of two unique targets.</p>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-1/4 -translate-y-1/4 grayscale pointer-events-none text-8xl">⚔️</div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/squads"
                className="glass-card p-6 group hover:bg-white/10 flex items-center gap-6 relative overflow-hidden block"
              >
                <div className="text-4xl group-hover:rotate-12 transition-transform">👥</div>
                <div>
                  <h3 className="text-lg font-black italic uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Clan Systems</h3>
                  <p className="text-gray-500 text-sm font-medium">Coordinate with divisions and dominate the leaderboard together.</p>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-1/4 -translate-y-1/4 grayscale pointer-events-none text-8xl">👥</div>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-24 text-center border-t border-white/5 pt-12">
          <div className="inline-flex gap-8 text-xs font-black uppercase tracking-[0.3em] text-gray-600">
            <span className="hover:text-blue-500 transition-colors cursor-default">Real-time Stats</span>
            <span className="hidden md:inline">•</span>
            <span className="hover:text-blue-500 transition-colors cursor-default">Analytics Feed</span>
            <span className="hidden md:inline">•</span>
            <span className="hover:text-blue-500 transition-colors cursor-default">Global Data</span>
            <span className="hidden md:inline">•</span>
            <span className="hover:text-blue-500 transition-colors cursor-default">Target Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
