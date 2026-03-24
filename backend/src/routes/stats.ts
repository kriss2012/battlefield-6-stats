import express from 'express';
import pool from '../config/database';
import { fetchAndStorePlayerStats, addTrackedPlayer } from '../services/statsCollector';
import { generateRecommendations } from '../services/aiAnalytics';
import { collectAllTrackedPlayerStats } from '../services/cronJobs';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get historical stats for a player
router.get('/history/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT * FROM player_stats_history
       WHERE player_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
       ORDER BY recorded_at ASC`,
      [playerId]
    );

    res.json({
      playerId,
      history: result.rows,
    });
  } catch (error) {
    console.error('Error fetching player history:', error);
    res.status(500).json({ error: 'Failed to fetch player history' });
  }
});

// Get K/D trend data for a player
router.get('/trends/kd/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT
         DATE(recorded_at) as date,
         AVG(kd_ratio) as avg_kd,
         MAX(kd_ratio) as max_kd,
         MIN(kd_ratio) as min_kd
       FROM player_stats_history
       WHERE player_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
       GROUP BY DATE(recorded_at)
       ORDER BY date ASC`,
      [playerId]
    );

    res.json({
      playerId,
      trend: result.rows,
    });
  } catch (error) {
    console.error('Error fetching K/D trend:', error);
    res.status(500).json({ error: 'Failed to fetch K/D trend' });
  }
});

// Get win rate trend data for a player
router.get('/trends/winrate/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT
         DATE(recorded_at) as date,
         AVG(win_rate) as avg_win_rate,
         MAX(win_rate) as max_win_rate,
         MIN(win_rate) as min_win_rate
       FROM player_stats_history
       WHERE player_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
       GROUP BY DATE(recorded_at)
       ORDER BY date ASC`,
      [playerId]
    );

    res.json({
      playerId,
      trend: result.rows,
    });
  } catch (error) {
    console.error('Error fetching win rate trend:', error);
    res.status(500).json({ error: 'Failed to fetch win rate trend' });
  }
});

// Compare multiple players
router.post('/compare', async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 player IDs' });
    }

    const result = await pool.query(
      `SELECT DISTINCT ON (player_id)
         player_id,
         player_name,
         kills,
         deaths,
         kd_ratio,
         wins,
         losses,
         win_rate,
         score,
         time_played,
         headshots,
         headshot_percentage,
         accuracy,
         level,
         rank
       FROM player_stats_history
       WHERE player_id = ANY($1)
       ORDER BY player_id, recorded_at DESC`,
      [playerIds]
    );

    return res.json({
      players: result.rows,
    });
  } catch (error) {
    console.error('Error comparing players:', error);
    return res.status(500).json({ error: 'Failed to compare players' });
  }
});

// Track a player (add to tracked players list)
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { playerId, playerName, platform = 'pc' } = req.body;

    if (!playerId || !playerName) {
      return res.status(400).json({ error: 'playerId and playerName are required' });
    }

    await addTrackedPlayer(playerId, playerName, platform);

    // Immediately fetch stats for this player
    await fetchAndStorePlayerStats(playerId, playerName);

    return res.json({
      success: true,
      message: `${playerName} is now being tracked`,
    });
  } catch (error) {
    console.error('Error tracking player:', error);
    return res.status(500).json({ error: 'Failed to track player' });
  }
});

// Get list of tracked players
router.get('/tracked', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tracked_players ORDER BY player_name ASC'
    );

    res.json({
      trackedPlayers: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tracked players:', error);
    res.status(500).json({ error: 'Failed to fetch tracked players' });
  }
});

// Manually trigger stats collection for all tracked players
router.post('/collect', authenticateToken, async (req, res) => {
  try {
    // Run collection in background
    collectAllTrackedPlayerStats().catch(console.error);

    return res.json({
      success: true,
      message: 'Stats collection started',
    });
  } catch (error) {
    console.error('Error triggering stats collection:', error);
    return res.status(500).json({ error: 'Failed to trigger stats collection' });
  }
});

// Autocomplete for player names
router.get('/autocomplete', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.json({ suggestions: [] });
    }

    const result = await pool.query(
      `SELECT player_name as name, player_id as id, platform
       FROM tracked_players
       WHERE player_name ILIKE $1
       ORDER BY player_name ASC
       LIMIT $2`,
      [`%${query}%`, parseInt(limit as string)]
    );

    return res.json({
      suggestions: result.rows,
    });
  } catch (error) {
    console.error('Error in autocomplete:', error);
    return res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Get K/D trend
router.get('/trends/kd/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        DATE(recorded_at) as date,
        AVG(kd_ratio) as avg_kd,
        MAX(kd_ratio) as max_kd,
        MIN(kd_ratio) as min_kd
       FROM player_stats_history
       WHERE player_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
       GROUP BY DATE(recorded_at)
       ORDER BY date ASC`,
      [playerId]
    );

    res.json({
      playerId,
      trend: result.rows,
    });
  } catch (error) {
    console.error('Error fetching K/D trend:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
});

// Get Win Rate trend
router.get('/trends/winrate/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        DATE(recorded_at) as date,
        AVG(win_rate) as win_rate
       FROM player_stats_history
       WHERE player_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days as string)} days'
       GROUP BY DATE(recorded_at)
       ORDER BY date ASC`,
      [playerId]
    );

    res.json({
      playerId,
      trend: result.rows,
    });
  } catch (error) {
    console.error('Error fetching win rate trend:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
});

// Get AI Loadout Recommendations
router.get('/ai/recommendations/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const recommendations = await generateRecommendations(playerId);
    
    if (!recommendations) {
      return res.status(404).json({ error: 'Insufficient data for AI analysis' });
    }
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;
