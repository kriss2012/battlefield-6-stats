// BF6 API Service Configuration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Player Stats API
export const playerApi = {
  // Get player ID by name
  getPlayerId: async (playerName: string) => {
    return apiFetch(`/bf6/player/?name=${encodeURIComponent(playerName)}`);
  },

  // Get player stats (by name, playerid, or oid)
  getPlayerStats: async (nameOrId: string) => {
    return apiFetch(`/bf6/stats/?name=${encodeURIComponent(nameOrId)}`);
  },

  // Get multiple players' stats (max 128)
  getMultiplePlayers: async (playerIds: string[]) => {
    return apiFetch('/bf6/multiple/', {
      method: 'POST',
      body: JSON.stringify({ playerIds }),
    });
  },
};

// Server API
export const serverApi = {
  // Get servers by name (name is optional, empty string returns all servers)
  getServers: async (serverName: string = '', limit: number = 20) => {
    return apiFetch(`/bf6/servers/?name=${encodeURIComponent(serverName)}&limit=${limit}`);
  },

  // Get detailed server info
  getDetailedServer: async (serverName: string) => {
    return apiFetch(`/bf6/detailedserver/?name=${encodeURIComponent(serverName)}`);
  },
};

// Content API
export const contentApi = {
  // Get store catalog (DLCs)
  getStoreCatalog: async () => {
    return apiFetch('/bf6/storecatalog/');
  },

  // Get game events
  getGameEvents: async () => {
    return apiFetch('/bf6/gameevents/');
  },

  // Get translations (warning: large data)
  getTranslations: async () => {
    return apiFetch('/bf6/translations/');
  },
};

// Analytics API (Backend)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const analyticsApi = {
  // Get player stats history
  getPlayerHistory: async (playerId: string, days: number = 30) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/history/${playerId}?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch player history');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get K/D trend
  getKDTrend: async (playerId: string, days: number = 30) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/trends/kd/${playerId}?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch K/D trend');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get win rate trend
  getWinRateTrend: async (playerId: string, days: number = 30) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/trends/winrate/${playerId}?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch win rate trend');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Compare players
  comparePlayers: async (playerIds: string[]) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds }),
      });
      if (!response.ok) throw new Error('Failed to compare players');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Track a player
  trackPlayer: async (playerId: string, playerName: string, platform: string = 'pc') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName, platform }),
      });
      if (!response.ok) throw new Error('Failed to track player');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get tracked players
  getTrackedPlayers: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/tracked`);
      if (!response.ok) throw new Error('Failed to fetch tracked players');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Global autocomplete
  getAutocomplete: async (query: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/autocomplete?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch autocomplete suggestions');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  getAIRecommendations: async (playerId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats/ai/recommendations/${playerId}`);
      if (!response.ok) throw new Error('Failed to fetch AI recommendations');
      return await response.json();
    } catch (error) {
      console.error('Analytics API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },
};

// Leaderboard API
export const leaderboardApi = {
  // Get leaderboard
  getLeaderboard: async (orderBy: string = 'kd_ratio', limit: number = 100, offset: number = 0) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/leaderboard?orderBy=${orderBy}&limit=${limit}&offset=${offset}`
      );
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get player rank
  getPlayerRank: async (playerId: string, orderBy: string = 'kd_ratio') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard/rank/${playerId}?orderBy=${orderBy}`);
      if (!response.ok) throw new Error('Failed to fetch player rank');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get leaderboard stats
  getLeaderboardStats: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard stats');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Batch update leaderboard
  batchUpdate: async (playerIds: string[]) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard/batch-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds }),
      });
      if (!response.ok) throw new Error('Failed to batch update leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Fetch multiple players
  fetchMultiple: async (playerIds: string[]) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard/fetch-multiple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds }),
      });
      if (!response.ok) throw new Error('Failed to fetch multiple players');
      return await response.json();
    } catch (error) {
      console.error('Leaderboard API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },
};

// Authentication API
export const authApi = {
  // Register new user
  register: async (username: string, email: string, password: string, playerName?: string, playerId?: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, playerName, playerId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Login
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get current user
  getMe: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Update profile
  updateProfile: async (token: string, data: { playerName?: string; playerId?: string; avatarUrl?: string; bio?: string }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Change password
  changePassword: async (token: string, currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },
};

// Social & Squads API
export const socialApi = {
  // Friends
  getFriends: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/friends`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch friends');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  getFriendRequests: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/friends/requests`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch friend requests');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  sendFriendRequest: async (token: string, friendUsername: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ friendUsername }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send friend request');
      }
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  respondToFriendRequest: async (token: string, friendshipId: number, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/friends/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ friendshipId, action }),
      });
      if (!response.ok) throw new Error('Failed to respond to friend request');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  removeFriend: async (token: string, friendshipId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to remove friend');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  // Squads
  createSquad: async (token: string, data: { name: string; tag: string; description?: string; isPublic?: boolean }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/squads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create squad');
      }
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  getSquads: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/squads`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch squads');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  getMySquads: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/squads/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch my squads');
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  joinSquad: async (token: string, squadId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/social/squads/${squadId}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join squad');
      }
      return await response.json();
    } catch (error) {
      console.error('Social API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },
};

// Notifications API
export const notificationApi = {
  getNotifications: async (token: string, options?: { limit?: number; unreadOnly?: boolean }) => {
    try {
      const queryParams = new URLSearchParams();
      if (options?.limit) queryParams.append('limit', options.limit.toString());
      if (options?.unreadOnly) queryParams.append('unreadOnly', 'true');
      
      const response = await fetch(`${BACKEND_URL}/api/notifications?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Notification API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  markAsRead: async (token: string, notificationId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return await response.json();
    } catch (error) {
      console.error('Notification API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  markAllAsRead: async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return await response.json();
    } catch (error) {
      console.error('Notification API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },

  deleteNotification: async (token: string, notificationId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return await response.json();
    } catch (error) {
      console.error('Notification API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  },
};

export { API_BASE_URL, BACKEND_URL };
