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
        <div className="flex justify-end mb-16">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <span className="text-gray-400 font-bold text-sm">Welcome, {user?.username}!</span>
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-black text-xs uppercase"
              >
                ACCOUNT
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-sm"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-black text-sm"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32 perspective-1000">
          <div className="flex-1 text-left animate-fade-in relative preserve-3d">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] uppercase">Tactical Intelligence Hub</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-6 italic tracking-tighter chromatic-aberration animate-glitch-v2 leading-none">
              BF6 <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">STATS HUB</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-xl dof-blur mb-8 leading-relaxed">
              Advanced performance tracking, real-time server telemetry, and global competitive analytics.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-blue-600 rounded-xl font-black italic text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Launch Theater</button>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-black italic text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Manuals</button>
            </div>
          </div>
          <div className="flex-1 w-full lg:max-w-2xl floating-3d">
            <Hero3D />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { to: "/player", icon: "📊", title: "Tactical Stats", desc: "Deep-dive into player performance with detailed metrics and class breakdowns.", color: "blue" },
            { to: "/analytics", icon: "📈", title: "Telemetry", desc: "Visualize historical trends with skill signatures and performance stability charts.", color: "purple" },
            { to: "/leaderboard", icon: "🏆", title: "Rankings", desc: "Global ranking system tracking the most lethal operators in the combat theater.", color: "amber" },
            { to: "/servers", icon: "🎮", title: "Network", desc: "Scan active combat zones for server availability and real-time player density.", color: "emerald" },
            { to: "/forge", icon: "🧬", title: "Neural Forge", desc: "AI-driven development of tactical textures, characters, and combat narratives.", color: "blue" },
            { to: "/friends", icon: "👥", title: "Friends", desc: "Manage your tactical network and coordinate with fellow operators.", color: "purple" },
            { to: "/story", icon: "🎬", title: "Shadow Rising", desc: "Experience the interactive revenge saga of Aryan Malik.", color: "red" },
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
          <div className="inline-flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
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
