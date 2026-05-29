/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * File: PlayerSearch.tsx
 * Date: 2026-05-28
 * #Made WIth Love TO The Kiri Family
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Combobox, Transition } from '@headlessui/react';
import { playerApi, analyticsApi } from '../services/api';
import type { PlayerStats } from '../types';
import { PlayerCache } from '../utils/playerCache';
import { PlayerStatsSkeleton } from '../components/Skeleton';

const PLATFORMS = [
  { id: 'all', name: 'All Platforms', icon: '🌐' },
  { id: 'pc', name: 'PC', icon: '💻' },
  { id: 'ps5', name: 'PlayStation', icon: '🎮' },
  { id: 'xboxseries', name: 'Xbox', icon: '🎯' },
  { id: 'steam', name: 'Steam', icon: '⚙️' },
];

interface PlayerSuggestion {
  name: string;
  player_id?: string;
  platform?: string;
  isGlobal?: boolean;
}

export default function PlayerSearch() {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [suggestions, setSuggestions] = useState<PlayerSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<{ name: string; platform?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSuggestion | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    const recent = PlayerCache.getRecentSearches(5);
    setRecentSearches(recent);
  }, []);

  // Update suggestions as user types (local + global)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length >= 2) {
        try {
          // Get local matches
          const localMatches = PlayerCache.searchPlayers(query, 5);
          
          // Get global matches from backend
          const response = await analyticsApi.getAutocomplete(query);
          const globalMatches = (response.suggestions as PlayerSuggestion[]) || [];
          
          // Merge and deduplicate
          const merged: PlayerSuggestion[] = localMatches.map(lm => ({
            ...lm,
            isGlobal: false
          }));

          globalMatches.forEach((gm) => {
            if (!merged.find(m => m.name.toLowerCase() === gm.name.toLowerCase())) {
              merged.push({ ...gm, isGlobal: true });
            }
          });
          
          setSuggestions(merged.slice(0, 10));
        } catch (_error) {
          console.error("Failed to fetch suggestions:", _error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handlePlayerSelect = useCallback(async (playerName: string) => {
    setLoading(true);
    setError('');
    setPlayerStats(null);

    // Build search query with platform if not "all"
    let searchQuery = playerName;
    if (selectedPlatform !== 'all') {
      searchQuery = `${playerName}?platform=${selectedPlatform}`;
    }

    try {
      // Try to fetch stats directly by name
      const response = await playerApi.getPlayerStats(searchQuery);

      if (response.error || (response.data as { errors?: string[] })?.errors) {
        setError((response.data as { errors?: string[] })?.errors?.[0] || response.error || 'Player not found');
      } else if (response.data) {
        setPlayerStats(response.data as PlayerStats);
        // Add to cache on successful search
        const platformToCache = selectedPlatform !== 'all' ? selectedPlatform : undefined;
        PlayerCache.addPlayer(playerName, platformToCache);
        // Refresh recent searches
        setRecentSearches(PlayerCache.getRecentSearches(5));
        
        // Also track this player on our backend for future global autocomplete
        analyticsApi.trackPlayer(playerName, playerName, selectedPlatform).catch(() => {});
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('An unexpected error occurred during search');
    }

    setLoading(false);
  }, [selectedPlatform]);

  // Handle player selection from dropdown
  useEffect(() => {
    if (selectedPlayer && selectedPlayer.name) {
      handlePlayerSelect(selectedPlayer.name);
    }
  }, [selectedPlayer, handlePlayerSelect]); // Dependency array is correct

  const handleReset = () => {
    setQuery('');
    setPlayerStats(null);
    setError('');
    setSelectedPlayer(null);
    setSuggestions([]);
  };

  const handleManualSearch = () => {
    if (query.trim()) {
      handlePlayerSelect(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleManualSearch();
    }
  };

  const handleClearCache = () => {
    PlayerCache.clearCache();
    setRecentSearches([]);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white premium-gradient">
      <div className="container mx-auto px-4 py-12 relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -z-10" />

        <div className="mb-8 flex justify-between items-center">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 group transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </Link>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg text-xs font-semibold transition-all backdrop-blur-sm"
          >
            Clear Cache ({PlayerCache.getPlayerCount()})
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          {!playerStats && (
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                  SPECTRE
                </span>
                <span className="ml-4">DIVISION</span>
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Advanced performance tracking and global operative search
              </p>
            </div>
          )}

          {/* Search Section */}
          <div className="mb-12">
            <div className="space-y-6">
              {/* Platform Selector */}
              <div className="flex justify-center gap-2 flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all border ${
                      selectedPlatform === platform.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-105'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </button>
                ))}
              </div>

              {/* Search Bar with Autocomplete */}
              <div className="relative max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Combobox value={selectedPlayer} onChange={setSelectedPlayer}>
                  <div className="relative">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Combobox.Input
                          className="w-full px-8 py-5 text-xl bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-gray-500 transition-all backdrop-blur-md"
                          placeholder="Search player name..."
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          displayValue={(player: PlayerSuggestion) => player?.name || query} // Use PlayerSuggestion type
                          autoComplete="off"
                        />
                        {loading && (
                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <div className="h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-500 border-r-transparent"></div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleManualSearch}
                        disabled={loading || !query.trim()}
                        className="px-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 disabled:border-white/10 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-950/20 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                      >
                        {loading ? 'Searching...' : 'SEARCH'}
                      </button>
                    </div>

                    <Transition
                      show={suggestions.length > 0 && query.length >= 1 && !playerStats}
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="absolute mt-3 w-full glass-panel z-50 p-2 overflow-hidden">
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          <div className="text-[10px] text-gray-500 px-4 py-2 font-black uppercase tracking-[0.2em]">
                            Global Suggestions
                          </div>
                          {suggestions.map((player, index) => (
                            <Combobox.Option
                              key={index}
                              value={player}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-3 rounded-xl mb-1 last:mb-0 transition-all ${
                                  active
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'hover:bg-white/5'
                                }`
                              }
                            >
                              {({ active }) => (
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-bold text-lg">{player.name}</div>
                                    <div className={`text-xs flex items-center gap-2 ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                                      <span>{PLATFORMS.find(p => p.id === player.platform)?.icon || '🎮'}</span>
                                      <span className="capitalize">{player.platform || 'Cross-play'}</span>
                                      {player.isGlobal && (
                                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">Global</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className={`text-sm font-bold ${active ? 'text-white' : 'text-blue-400 opacity-0 group-hover:opacity-100'}`}>
                                    LIFT OFF →
                                  </div>
                                </div>
                              )}
                            </Combobox.Option>
                          ))}
                        </div>
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </div>

              {/* Recent Searches Pills */}
              {recentSearches.length > 0 && !playerStats && (
                <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {recentSearches.map((player, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlayerSelect(player.name)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                      >
                        <span className="opacity-70">{PLATFORMS.find(p => p.id === player.platform)?.icon || '🎮'}</span>
                        <span className="text-gray-300">{player.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && <PlayerStatsSkeleton />}

          {/* Error Message */}
          {error && !loading && (
            <div className="max-w-3xl mx-auto mb-8 glass-card border-red-500/30 p-8 animate-fade-in">
              <div className="flex items-center gap-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="text-xl font-bold text-red-400">Target Not Found</h3>
                  <p className="text-gray-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Player Stats */}
          {playerStats && !loading && (
            <div className="space-y-8 animate-fade-in">
              {/* Player Header */}
              <div className="glass-card p-8 border-l-4 border-l-blue-600">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-5xl font-black mb-3 tracking-tight italic">
                      {playerStats.userName || query.toUpperCase()}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-xl">{PLATFORMS.find(p => p.id === selectedPlatform)?.icon || '🎮'}</span>
                        <span className="font-black text-sm uppercase tracking-widest text-blue-400">{selectedPlatform}</span>
                      </div>
                      <div className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em]">Verified Profile</div>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105"
                  >
                    New Op
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(playerStats).map(([key, value]) => {
                  if (
                    typeof value === 'object' ||
                    Array.isArray(value) ||
                    key === 'errors' ||
                    key === 'avatar' ||
                    key === 'userName'
                  ) return null;

                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/_/g, ' ')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <div key={key} className="glass-card p-6 border-white/5 hover:border-blue-500/50 hover:bg-white/10 group">
                      <div className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
                        {formattedKey}
                      </div>
                      <div className="text-3xl font-black text-white italic">
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : (value as string | number | boolean | null | undefined)?.toString() || 'N/A'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Class Performance */}
              {playerStats.classes && Array.isArray(playerStats.classes) && (
                <div className="glass-panel p-8">
                  <h3 className="text-2xl font-black mb-8 italic uppercase tracking-wider">Class Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {playerStats.classes.map((classData: { className?: string; kills?: number }, index: number) => (
                      <div key={index} className="space-y-2 group">
                        <div className="text-xs text-gray-500 font-black uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                          {classData.className || `Specialist ${index + 1}`}
                        </div>
                        <div className="bg-white/5 rounded-xl h-2 overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-1000"
                            style={{ width: `${Math.min(100, ((classData.kills || 0) / 1000) * 100)}%` }}
                          />
                        </div>
                        <div className="text-2xl font-black italic">{classData.kills?.toLocaleString() || 0} <span className="text-[10px] non-italic text-gray-600 ml-1">KILLS</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!playerStats && !loading && !error && (
            <div className="max-w-3xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="glass-panel p-16 text-center border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-500">🛰️</div>
                <h3 className="text-2xl font-black mb-4 uppercase italic">Ready for Deployment</h3>
                <p className="text-gray-400 max-w-md mx-auto font-medium">
                  Scan the Spectre network nodes for operator combat performance data and tactical statistics.
                </p>

                <div className="grid grid-cols-3 gap-8 mt-16">
                  <div className="space-y-2">
                    <div className="text-3xl">💹</div>
                    <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Real-time</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl">📈</div>
                    <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">History</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl">⚔️</div>
                    <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Compare</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
