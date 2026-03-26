import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import KDTrendChart from '../components/KDTrendChart';
import WinRateTrendChart from '../components/WinRateTrendChart';
import PlayerComparison from '../components/PlayerComparison';
import { analyticsApi, playerApi } from '../services/api';
import { Skeleton } from '../components/Skeleton';
import LoadoutAdvisor from '../components/LoadoutAdvisor';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import HologramChart from '../components/HologramChart';

interface PlayerData {
  playerCount: number;
  userName: string;
  stats?: {
    kd?: number;
    winRate?: number;
    accuracy?: number;
    spm?: number;
  };
}

export default function PlayerAnalytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlayerId = searchParams.get('playerId') || '';
  const initialPlayerName = searchParams.get('playerName') || '';

  const [playerId, setPlayerId] = useState(initialPlayerId);
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [days, setDays] = useState(30);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackMessage, setTrackMessage] = useState('');

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (playerName) {
        setLoading(true);
        const response = await playerApi.getPlayerStats(playerName);
        if (response.data) {
          setPlayerData(response.data as PlayerData);
        }
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [playerName]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setPlayerId(searchInput.trim());
      setPlayerName(searchInput.trim());
      setSearchParams({ playerId: searchInput.trim(), playerName: searchInput.trim() });
      setPlayerData(null); // Reset data on new search
    }
  };

  const handleTrackPlayer = async () => {
    if (!playerId || !playerName) {
      setTrackMessage('Please search for a player first');
      return;
    }

    setTracking(true);
    setTrackMessage('');

    const result = await analyticsApi.trackPlayer(playerId, playerName);

    if (result.error) {
      setTrackMessage(`Error: ${result.error}`);
    } else {
      setTrackMessage(`${playerName} is now being tracked! Historical data will be collected.`);
    }

    setTracking(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter animate-fade-in">
            Player <span className="text-blue-500">Analytics</span>
          </h1>
          <Link to="/player" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2">
            ← BACK TO SEARCH
          </Link>
        </div>

        {/* Search Section */}
        <div className="glass-card p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-black uppercase tracking-widest mb-6 opacity-50">Intelligence Search</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter exact player name..."
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-white transition-all placeholder-gray-600"
            />
            <button
              onClick={handleSearch}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black italic transition-all shadow-lg shadow-blue-900/20"
            >
              INITIALIZE SCAN
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Temporal Range</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none text-sm font-bold"
              >
                <option value={7}>LAST 7 CYCLES</option>
                <option value={14}>LAST 14 CYCLES</option>
                <option value={30}>LAST 30 CYCLES</option>
                <option value={60}>LAST 60 CYCLES</option>
                <option value={90}>LAST 90 CYCLES</option>
              </select>
            </div>

            {playerId && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTrackPlayer}
                  disabled={tracking}
                  className="px-6 py-2 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  {tracking ? 'ESTABLISHING LINK...' : 'TRACK TARGET'}
                </button>
                {trackMessage && (
                  <p className={`text-xs font-bold ${trackMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {trackMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Display */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-[400px] lg:col-span-1" />
            <Skeleton className="h-[400px] lg:col-span-1" />
            <Skeleton className="h-[400px] lg:col-span-1" />
          </div>
        ) : playerId && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card p-6 min-h-[400px] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <Canvas shadows camera={{ position: [0, 2, 8] }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <HologramChart 
                        title="Skill Signature"
                        data={[
                          { label: 'ACC', value: playerData?.stats?.accuracy || 45, color: '#3b82f6' },
                          { label: 'K/D', value: (playerData?.stats?.kd || 1.5) * 20, color: '#60a5fa' },
                          { label: 'W/R', value: playerData?.stats?.winRate || 50, color: '#10b981' },
                          { label: 'SPM', value: (playerData?.stats?.spm || 400) / 10, color: '#f59e0b' },
                        ]} 
                      />
                      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Suspense>
                  </Canvas>
                </div>
                <div className="relative z-10 pointer-events-none">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-1">Neural Analysis</span>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Live Telemetry</h3>
                </div>
              </div>
              <div className="glass-card p-6 min-h-[400px]">
                <KDTrendChart playerId={playerId} days={days} />
              </div>
              <div className="glass-card p-6 min-h-[400px]">
                <WinRateTrendChart playerId={playerId} days={days} />
              </div>
            </div>

            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <LoadoutAdvisor playerId={playerId} />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <PlayerComparison />
            </div>
          </>
        )}

        {/* Documentation Section */}
        {!playerId && (
          <div className="glass-card p-12 text-center border-l-4 border-l-blue-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-6xl mb-6">📉</div>
            <h3 className="text-2xl font-black italic uppercase mb-4">Tactical Data Feed</h3>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium mb-12">
              Advanced trend analysis and performance signature visualization. Enter a target name to begin telemetry analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2">Skill Signature</h4>
                <p className="text-sm text-gray-500">Multi-dimensional radar visualization of combat efficiency across key metrics.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2">Trend Analysis</h4>
                <p className="text-sm text-gray-500">Longitudinal tracking of K/D and win-rate stability over selected temporal cycles.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
