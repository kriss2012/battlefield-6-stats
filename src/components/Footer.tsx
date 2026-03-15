import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-32 border-t border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden">
      {/* Live Operational Ticker */}
      <div className="w-full bg-blue-600/5 border-b border-white/5 py-2 overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="inline-flex gap-12 font-mono text-[9px] text-blue-400/60 uppercase tracking-[0.2em]"
        >
          <span>[SYSTEM] NEURAL FORGE V3.2 ONLINE</span>
          <span>[NET] GLOBAL NODES: 2,842 ACTIVE</span>
          <span>[STATUS] SECTOR 7G STABILIZED</span>
          <span>[OPS] MISSION_PROTOCOL_09 INITIATED</span>
          <span>[LOG] ENCRYPTION_HASH_SUCCESSFUL</span>
          {/* Duplicate for seamless loop */}
          <span>[SYSTEM] NEURAL FORGE V3.2 ONLINE</span>
          <span>[NET] GLOBAL NODES: 2,842 ACTIVE</span>
          <span>[STATUS] SECTOR 7G STABILIZED</span>
          <span>[OPS] MISSION_PROTOCOL_09 INITIATED</span>
          <span>[LOG] ENCRYPTION_HASH_SUCCESSFUL</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black italic tracking-tighter text-blue-500 bg-black p-2 border border-white/10 rounded-lg">
              BF6 <span className="text-white">SH</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic tracking-tight uppercase">Stats Hub</span>
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">Operational Tactical Command</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            The ultimate tactical visualization platform for the next generation of combat assets. 
            Real-time telemetry, neural synthesis, and global network monitoring.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Operational_Links
          </h4>
          <nav className="flex flex-col gap-3 font-mono">
            <Link to="/player" className="text-xs text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-20">01</span> Player_Tracking
            </Link>
            <Link to="/analytics" className="text-xs text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-20">02</span> Telemetry_Feed
            </Link>
            <Link to="/servers" className="text-xs text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-20">03</span> Network_Nodes
            </Link>
            <Link to="/forge" className="text-xs text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-20">04</span> Neural_Forge
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-end gap-6 text-right">
          <div className="glass-card px-8 py-4 border-blue-500/20 bg-blue-500/5 group">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 block mb-2 group-hover:text-blue-400 transition-colors">Digital_Signature</span>
            <span className="text-xl font-black italic tracking-tight bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent uppercase chromatic-aberration">
              KRISHNA_DEV_7
            </span>
          </div>
          <div className="text-[9px] text-gray-700 font-bold tracking-[0.3em] uppercase space-y-1">
            <p>© 2024 BF6 HUB // ALL RIGHTS RESERVED</p>
            <p className="text-red-900/40">UNAUTHORIZED_ACCESS_IS_FELONY</p>
          </div>
        </div>
      </div>

      {/* Background HUD Detail */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </footer>
  );
};

export default Footer;
