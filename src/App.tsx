import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import OpeningCredits from './components/OpeningCredits';
import { audio } from './utils/audio';
import { useState } from 'react';

function App() {
  const [showCredits, setShowCredits] = useState(true);
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <button
          className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.5)]"
          onClick={() => {
            audio.init();
            audio.playStartupSound();
            setStarted(true);
          }}
        >
          START GAME
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {showCredits && <OpeningCredits onComplete={() => setShowCredits(false)} />}
      <Navigation />
      <ErrorBoundary>
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
