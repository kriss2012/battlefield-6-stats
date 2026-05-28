/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import PlayerSearch from './pages/PlayerSearch';
import ServerBrowser from './pages/ServerBrowser';
import PlayerAnalytics from './pages/PlayerAnalytics';
import HeadToHead from './pages/HeadToHead';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NeuralForge from './pages/NeuralForge';
import Friends from './pages/Friends';
import Squads from './pages/Squads';
import Leaderboard from './pages/Leaderboard';
import Armory from './pages/Armory';
import Campaign from './pages/Campaign';
import Simulation from './pages/Simulation';
import ShadowRising from './pages/ShadowRising';
import Codex from './pages/Codex';
import WorldLore from './pages/WorldLore';
import Operatives from './pages/Operatives';
import OpeningCredits from './components/OpeningCredits';
import { audio } from './utils/audio';
import { useState, useEffect } from 'react';

function App() {
  const [showCredits, setShowCredits] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        audio.playHoverSound();
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        audio.playClickSound();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
    };
  }, [started]);

  if (!started) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black relative overflow-hidden">
        {/* Ambient Grid for start screen */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <button
          className="btn-tactical text-2xl px-12 py-6 animate-pulse hover:animate-none z-10"
          onClick={() => {
            audio.init();
            audio.playStartupSound();
            setStarted(true);
          }}
        >
          <span className="relative z-10">INITIALIZE UPLINK</span>
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        {showCredits && <OpeningCredits onComplete={() => setShowCredits(false)} />}
        <Navigation />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player" element={<PlayerSearch />} />
            <Route path="/servers" element={<ServerBrowser />} />
            <Route path="/analytics" element={<PlayerAnalytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/head-to-head" element={<HeadToHead />} />
            <Route path="/forge" element={<NeuralForge />} />
            <Route path="/armory" element={<Armory />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/story" element={<ShadowRising />} />
            <Route path="/codex" element={<Codex />} />
             <Route path="/explore" element={<WorldLore />} />
            <Route path="/operatives" element={<Operatives />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/squads"
              element={
                <ProtectedRoute>
                  <Squads />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
