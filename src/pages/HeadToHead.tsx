import { useState } from 'react';
import { characterLore } from '../utils/characterAssets';
import { audio } from '../utils/audio';

interface PlayerMatchStats {
  id: string;
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  ping: number;
  team: 'SPECTRE' | 'ISF';
  isAlive: boolean;
  costume: string;
}

export default function HeadToHead() {
  const [matchStarted, setMatchStarted] = useState(false);
  const [spectreTeam, setSpectreTeam] = useState<PlayerMatchStats[]>([]);
  const [isfTeam, setIsfTeam] = useState<PlayerMatchStats[]>([]);
  const [spectreScore, setSpectreScore] = useState(0);
  const [isfScore, setIsfScore] = useState(0);

  const simulateMatch = () => {
    audio.playClickSound();
    
    // Announce match start using real human voice
    audio.playVoiceAnnouncement("Tactical match initialized. Spectre Division versus Iron Shadow Front.");

    const characters = Object.values(characterLore);
    const spectreRoster = characters.slice(0, 5); // First 5
    const isfRoster = characters.slice(5, 10); // Next 5

    const generateStats = (roster: any[], team: 'SPECTRE' | 'ISF'): PlayerMatchStats[] => {
      return roster.map(char => ({
        id: char.id,
        name: char.name,
        kills: Math.floor(Math.random() * 25) + 2,
        deaths: Math.floor(Math.random() * 20) + 5,
        assists: Math.floor(Math.random() * 15),
        score: Math.floor(Math.random() * 5000) + 1000,
        ping: Math.floor(Math.random() * 40) + 10,
        team,
        isAlive: Math.random() > 0.3,
        costume: char.costume || 'Standard Issue Armor'
      })).sort((a, b) => b.score - a.score);
    };

    const sTeam = generateStats(spectreRoster, 'SPECTRE');
    const iTeam = generateStats(isfRoster, 'ISF');

    // Calculate match score based on total team kills
    const sKills = sTeam.reduce((acc, p) => acc + p.kills, 0);
    const iKills = iTeam.reduce((acc, p) => acc + p.kills, 0);
    
    // Convert to round wins (max 13)
    let sWins = Math.floor((sKills / (sKills + iKills)) * 25);
    let iWins = 25 - sWins;
    
    if (sWins > 13) { sWins = 13; iWins = Math.floor(Math.random() * 12); }
    if (iWins > 13) { iWins = 13; sWins = Math.floor(Math.random() * 12); }

    setSpectreScore(sWins);
    setIsfScore(iWins);
    setSpectreTeam(sTeam);
    setIsfTeam(iTeam);
    setMatchStarted(true);

    setTimeout(() => {
      const winner = sWins > iWins ? "Spectre Division" : "Iron Shadow Front";
      audio.playVoiceAnnouncement(`Match complete. ${winner} wins the simulation.`);
    }, 2000);
  };

  const renderTeamTable = (team: PlayerMatchStats[], teamName: string, teamColor: string, score: number) => (
    <div className="glass-card overflow-hidden animate-fade-in relative">
      <div className={`absolute top-0 left-0 w-1 h-full ${teamName === 'SPECTRE' ? 'bg-blue-500' : 'bg-red-500'}`} />
      <div className={`bg-white/5 border-b border-white/10 p-4 flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded border flex items-center justify-center font-black ${teamName === 'SPECTRE' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
            {score}
          </div>
          <h2 className={`text-2xl font-black italic uppercase tracking-widest ${teamColor}`}>
            {teamName}
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Team Stats</span>
      </div>
      <table className="w-full border-collapse">
        <thead className="bg-white/[0.02] border-b border-white/10 text-left">
          <tr>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 w-12">STS</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Operative</th>
            <th className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Score</th>
            <th className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">K</th>
            <th className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">D</th>
            <th className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">A</th>
            <th className="p-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ping</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-mono">
          {team.map((player) => (
            <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="p-4 text-center">
                <div className={`w-2 h-2 rounded-full mx-auto ${player.isAlive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500/30'}`} />
              </td>
              <td className="p-4">
                <div className="text-sm font-black uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">
                  {player.name}
                </div>
                <div className="text-[9px] text-gray-500 tracking-[0.2em] font-mono mt-1">
                  GEAR: {player.costume}
                </div>
              </td>
              <td className="p-4 text-center text-sm font-black italic text-gray-300">
                {player.score.toLocaleString()}
              </td>
              <td className="p-4 text-center text-sm font-black text-white">
                {player.kills}
              </td>
              <td className="p-4 text-center text-sm font-black text-gray-500">
                {player.deaths}
              </td>
              <td className="p-4 text-center text-sm font-black text-gray-400">
                {player.assists}
              </td>
              <td className="p-4 text-right text-xs text-emerald-500/60 font-bold">
                {player.ping}ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient p-6">
      <div className="max-w-7xl mx-auto relative pt-12">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1px] w-8 bg-blue-500" />
              <span className="text-[10px] font-hud text-blue-400 tracking-[0.4em] uppercase">Tactical Match Simulator</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter chromatic-aberration">
              5v5 <span className="text-blue-500">SCOREBOARD</span>
            </h1>
          </div>
          
          <button
            onClick={simulateMatch}
            className="btn-tactical mt-4 md:mt-0"
          >
            <span className="relative z-10">{matchStarted ? 'RERUN SIMULATION' : 'SIMULATE MATCH'}</span>
          </button>
        </div>

        {!matchStarted ? (
          <div className="glass-panel p-16 text-center animate-fade-in border-blue-500/20 mt-12">
            <div className="w-16 h-16 mx-auto border-2 border-blue-500/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-2">Awaiting Match Data</h2>
            <p className="text-sm font-mono text-gray-600 uppercase tracking-widest">Click 'Simulate Match' to generate live 5v5 combat telemetry.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Match Header / Score Banner */}
            <div className="glass-panel p-6 flex justify-between items-center border-t-4 border-t-white/10 animate-fade-in bg-gradient-to-r from-blue-900/20 via-black to-red-900/20">
              <div className="flex-1 text-right pr-8">
                <h3 className="text-xl font-black italic uppercase text-blue-400 tracking-widest">SPECTRE</h3>
                <span className="text-xs font-mono text-gray-500">DEFENDERS</span>
              </div>
              <div className="flex items-center gap-6 px-8 py-2 bg-black/50 border border-white/10 rounded-2xl">
                <span className="text-5xl font-black text-white">{spectreScore}</span>
                <span className="text-xl text-gray-600 font-black italic">VS</span>
                <span className="text-5xl font-black text-white">{isfScore}</span>
              </div>
              <div className="flex-1 text-left pl-8">
                <h3 className="text-xl font-black italic uppercase text-red-400 tracking-widest">ISF</h3>
                <span className="text-xs font-mono text-gray-500">ATTACKERS</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {renderTeamTable(spectreTeam, 'SPECTRE', 'text-blue-400', spectreScore)}
              {renderTeamTable(isfTeam, 'ISF', 'text-red-400', isfScore)}
            </div>
            
            {/* Match MVP / Top Fragger */}
            <div className="glass-card p-6 mt-4 flex items-center gap-6 bg-gradient-to-r from-emerald-900/20 to-transparent">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded flex items-center justify-center text-2xl">
                👑
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">Match MVP</div>
                <div className="text-2xl font-black italic uppercase tracking-widest">
                  {[...spectreTeam, ...isfTeam].sort((a, b) => b.score - a.score)[0].name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
