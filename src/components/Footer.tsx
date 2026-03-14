import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-black italic tracking-tighter text-blue-500">
            BF6 <span className="text-white">STATS HUB</span>
          </div>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">
            Advancing Tactical Intelligence
          </p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Operational Data</h4>
            <Link to="/player" className="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors">Player Search</Link>
            <Link to="/analytics" className="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors">Analytics Feed</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Network Status</h4>
            <Link to="/servers" className="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors">Server List</Link>
            <Link to="/leaderboard" className="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors">Leaderboards</Link>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="glass-card px-6 py-3 border-blue-500/20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 block mb-1">Developer Signature</span>
            <span className="text-lg font-black italic tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase">
              Made by Krishna
            </span>
          </div>
          <p className="text-[10px] text-gray-700 font-bold tracking-widest uppercase mt-4">
            © 2024 Battlefield 6 Stats Hub. Unauthorized access prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
