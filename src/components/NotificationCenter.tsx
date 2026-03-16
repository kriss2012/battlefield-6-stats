import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { notificationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationCenter() {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadNotifications();
      // Polling for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications(token!, { limit: 5 });
      if (res.notifications) {
        setNotifications(res.notifications);
        const unread = res.notifications.filter((n: Notification) => !n.is_read).length;
        // In a real app we'd fetch the total unread count from backend
        setUnreadCount(unread); 
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(token!, id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(token!);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all relative group"
        title="TACTICAL ALERTS"
      >
        <span className="text-blue-400 group-hover:scale-110 transition-transform">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[8px] font-black flex items-center justify-center rounded-full border border-neutral-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] backdrop-blur-2xl"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Combat Feed</h3>
              <button 
                onClick={handleMarkAllAsRead}
                className="text-[8px] font-mono text-gray-500 hover:text-white transition-colors uppercase"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors relative group ${!notification.is_read ? 'bg-blue-600/5' : ''}`}
                  >
                    {!notification.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
                    )}
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-white truncate">{notification.title}</h4>
                      <span className="text-[7px] font-mono text-gray-600 uppercase whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-relaxed mb-3 line-clamp-2 italic">
                      {notification.message}
                    </p>
                    <div className="flex gap-2">
                      {notification.link && (
                        <Link 
                          to={notification.link}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded text-[8px] font-black tracking-widest transition-all"
                        >
                          ACCESS
                        </Link>
                      )}
                      {!notification.is_read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded text-[8px] font-black tracking-widest transition-all"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center opacity-30">
                  <p className="text-[9px] font-mono uppercase tracking-[0.3em]">No incoming data</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 text-center border-t border-white/5">
              <button className="text-[8px] font-black text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-[0.3em]">
                View Full Log
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
