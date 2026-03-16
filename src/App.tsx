import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import PlayerSearch from './pages/PlayerSearch';
import ServerBrowser from './pages/ServerBrowser';
import PlayerAnalytics from './pages/PlayerAnalytics';
import Leaderboard from './pages/Leaderboard';
import HeadToHead from './pages/HeadToHead';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NeuralForge from './pages/NeuralForge';

function App() {
  return (
    <BrowserRouter>
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
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
