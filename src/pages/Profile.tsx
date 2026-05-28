/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import ArmoryView from '../components/ArmoryView';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [playerName, setPlayerName] = useState(user?.playerName || '');
  const [playerId, setPlayerId] = useState(user?.playerId || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl] = useState(user?.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  if (!user || !token) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    const result = await authApi.updateProfile(token, {
      playerName: playerName || undefined,
      playerId: playerId || undefined,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Profile updated successfully!');
      updateUser(result.user);
      setEditing(false);
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await authApi.changePassword(token, currentPassword, newPassword);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Password changed successfully!');
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-12 mb-12 items-start">
          {/* 3D Operator Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/3 glass-card overflow-hidden h-[500px] relative group"
          >
            <ArmoryView type="operator" color="#3b82f6" />
            <div className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">Combat Entity</span>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">{user.username}</h2>
            </div>
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-mono text-gray-500 uppercase">Unit Integrity</span>
                <span className="text-[8px] font-mono text-emerald-400">NOMINAL</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500" />
              </div>
            </div>
          </motion.div>

          {/* User Info Overview */}
          <div className="flex-1 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">My <span className="text-blue-500">Profile</span></h1>
                <p className="text-gray-500 font-medium">Uplink established // Operational since 2024</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black italic text-xs uppercase tracking-widest transition-all"
                >
                  {editing ? 'CANCEL' : 'CONFIGURE'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-600 block mb-1 uppercase tracking-widest">Player Identity</span>
                <span className="text-lg font-black text-white italic">{user.playerName || 'UNASSIGNED'}</span>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-600 block mb-1 uppercase tracking-widest">Deployment Sector</span>
                <span className="text-lg font-black text-white italic">NEO-TOKYO // 01</span>
              </div>
            </div>

            <div className="glass-card p-6 min-h-[150px] relative">
              <span className="text-[10px] text-gray-600 block mb-4 uppercase tracking-widest">Combat Bio / Directives</span>
              <p className="text-gray-400 font-medium italic">"{user.bio || 'Initial directives not yet established.'}"</p>
              <div className="absolute bottom-4 right-4 text-[40px] opacity-5 pointer-events-none">📜</div>
            </div>
          </div>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-black italic text-xs uppercase tracking-widest">
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-black italic text-xs uppercase tracking-widest">
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Profile Information */}
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500/60">Profile Identification</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-hover/field:text-blue-500/60 transition-colors">Access_Username</label>
                <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-gray-400">{user.username}</div>
              </div>

              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-hover/field:text-blue-500/60 transition-colors">Neural_Email_Link</label>
                <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-gray-400">{user.email}</div>
              </div>

              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-hover/field:text-blue-500/60 transition-colors">Tactical_Callsign</label>
                {editing ? (
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-blue-500/30 rounded-2xl focus:outline-none focus:border-blue-500 text-sm font-black italic uppercase text-white transition-all"
                    placeholder="Enter callsign..."
                  />
                ) : (
                  <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-black italic uppercase text-white">{user.playerName || 'UNASSIGNED'}</div>
                )}
              </div>

              <div className="group/field">
                <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest group-hover/field:text-blue-500/60 transition-colors">Operator_Serial_ID</label>
                {editing ? (
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-blue-500/30 rounded-2xl focus:outline-none focus:border-blue-500 text-sm font-black italic uppercase text-white transition-all"
                    placeholder="Enter serial ID..."
                  />
                ) : (
                  <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-black italic uppercase text-white">{user.playerId || 'NOT_SET'}</div>
                )}
              </div>

              {editing && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 rounded-2xl transition-all font-black italic uppercase tracking-widest shadow-lg shadow-blue-900/20"
                >
                  {loading ? 'SYNCHRONIZING...' : 'UPDATE CORE DATA'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Bio Section in Edit Mode */}
            {editing && (
              <div className="glass-card p-8 border-l-4 border-emerald-500 animate-fade-in">
                <label className="block text-xs font-black text-emerald-500/60 mb-4 uppercase tracking-[0.4em]">Update Directives</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 bg-white/10 border border-emerald-500/30 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-medium italic text-gray-200 transition-all resize-none"
                  placeholder="Enter mission directives..."
                />
              </div>
            )}

            {/* Change Password Card */}
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500/60">Encryption Protocols</h2>
                </div>
                <button
                  onClick={() => setChangingPassword(!changingPassword)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black italic text-[10px] uppercase tracking-widest transition-all"
                >
                  {changingPassword ? 'ABORT' : 'MODIFY KEY'}
                </button>
              </div>

              {changingPassword && (
                <div className="space-y-6 animate-fade-in">
                  <div className="group/field">
                    <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest">Active_Pass_Key</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 border border-amber-500/30 rounded-2xl focus:outline-none focus:border-amber-500 text-sm font-mono text-white transition-all"
                    />
                  </div>

                  <div className="group/field">
                    <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest">New_Pass_Key</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 border border-amber-500/30 rounded-2xl focus:outline-none focus:border-amber-500 text-sm font-mono text-white transition-all"
                    />
                  </div>

                  <div className="group/field">
                    <label className="block text-[10px] font-black text-gray-600 mb-2 uppercase tracking-widest">Confirm_Key</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 border border-amber-500/30 rounded-2xl focus:outline-none focus:border-amber-500 text-sm font-mono text-white transition-all"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 rounded-2xl transition-all font-black italic uppercase tracking-widest shadow-lg shadow-amber-900/20"
                  >
                    {loading ? 'RE-ENCRYPTING...' : 'UPDATE PROTOCOLS'}
                  </button>
                </div>
              )}

              {!changingPassword && (
                <div className="flex flex-col items-center justify-center h-48 opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="text-6xl mb-4">🔐</span>
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Encrypted Storage Active</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row gap-6 mt-12 border-t border-white/5 pt-12">
          <button
            onClick={handleLogout}
            className="px-10 py-4 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-2xl transition-all font-black italic uppercase tracking-widest shadow-lg shadow-red-900/10"
          >
            TERMINATE SESSION
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-black italic uppercase tracking-widest text-gray-400 hover:text-white"
          >
            BACK TO HUB
          </button>
        </div>
      </div>
    </div>
  );
}
