import express from 'express';
import { fetchMultiplePlayers } from '../services/batchFetcher';
import {
  batchUpdateLeaderboard,
  getLeaderboard,
  getPlayerRank,
  getLeaderboardStats,
} from '../services/leaderboardService';

const router = express.Router();

// Get leaderboard with pagination and sorting
router.get('/', async (req, res) => {
  try {
    const { orderBy = 'kd_ratio', limit = '100', offset = '0' } = req.query as { orderBy?: string; limit?: string; offset?: string };

    const validOrderBy = ['kd_ratio', 'score', 'wins', 'level'];
    const sortBy = (validOrderBy.includes(orderBy) ? orderBy : 'kd_ratio') as 'kd_ratio' | 'score' | 'wins' | 'level';

    const leaderboard = await getLeaderboard(
      sortBy,
      Math.min(parseInt(limit) || 100, 500),
      parseInt(offset) || 0
    );

    res.json({
      leaderboard,
      orderBy: sortBy,
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get player rank
router.get('/rank/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { orderBy = 'kd_ratio' } = req.query as { orderBy?: string };

    const validOrderBy = ['kd_ratio', 'score', 'wins', 'level'];
    const sortBy = (validOrderBy.includes(orderBy) ? orderBy : 'kd_ratio') as 'kd_ratio' | 'score' | 'wins' | 'level';

    const rank = await getPlayerRank(playerId, sortBy);

    if (rank === null) {
      return res.status(404).json({ error: 'Player not found in leaderboard' });
    }

    res.json({
      playerId,
      rank,
      orderBy: sortBy,
    });
  } catch (error) {
    console.error('Error fetching player rank:', error);
    res.status(500).json({ error: 'Failed to fetch player rank' });
  }
});

// Get leaderboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getLeaderboardStats();

    if (!stats) {
      return res.status(500).json({ error: 'Failed to fetch leaderboard stats' });
    }

    res.json({
      stats,
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard stats' });
  }
});

// Batch fetch and update leaderboard
router.post('/batch-update', async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({ error: 'playerIds array is required' });
    }

    if (playerIds.length === 0) {
      return res.status(400).json({ error: 'playerIds array cannot be empty' });
    }

    if (playerIds.length > 128) {
      return res.status(400).json({ error: 'Maximum 128 players can be fetched at once' });
    }

    // Fetch player data from BF6 API
    const players = await fetchMultiplePlayers(playerIds);

    if (players.length === 0) {
      return res.status(404).json({ error: 'No player data found' });
    }

    // Update leaderboard with fetched data
    await batchUpdateLeaderboard(players);

    res.json({
      success: true,
      playersUpdated: players.length,
      players,
    });
  } catch (error) {
    console.error('Error batch updating leaderboard:', error);
    res.status(500).json({ error: 'Failed to batch update leaderboard' });
  }
});

// Fetch multiple players (without updating leaderboard)
router.post('/fetch-multiple', async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({ error: 'playerIds array is required' });
    }

    if (playerIds.length === 0) {
      return res.status(400).json({ error: 'playerIds array cannot be empty' });
    }

    if (playerIds.length > 128) {
      return res.status(400).json({ error: 'Maximum 128 players can be fetched at once' });
    }

    const players = await fetchMultiplePlayers(playerIds);

    res.json({
      players,
      count: players.length,
    });
  } catch (error) {
    console.error('Error fetching multiple players:', error);
    res.status(500).json({ error: 'Failed to fetch multiple players' });
  }
});

export default router;
