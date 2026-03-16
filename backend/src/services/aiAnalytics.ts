import pool from '../config/database';

interface WeaponStat {
  weapon_name: string;
  kills: number;
  accuracy: number;
  hs_percentage: number;
}

export const generateRecommendations = async (playerId: string) => {
  try {
    // Fetch latest weapon stats for this player
    const result = await pool.query(
      `SELECT weapon_name, kills, accuracy, hs_percentage 
       FROM weapon_stats_history 
       WHERE player_id = $1 
       ORDER BY timestamp DESC LIMIT 10`,
      [playerId]
    );

    const stats: WeaponStat[] = result.rows;
    if (stats.length === 0) return null;

    // Logic: Identify best performing weapon and suggest "Advanced" variants or attachments
    const bestWeapon = stats.reduce((prev, current) => (prev.kills > current.kills) ? prev : current);

    // AI "Analysis" - Mocking some deep insights based on accuracy
    const accuracyGrade = bestWeapon.accuracy > 25 ? 'ELITE' : bestWeapon.accuracy > 15 ? 'VETERAN' : 'STANDARD';
    
    return {
      playerId,
      primaryRecommendation: {
        weapon: bestWeapon.weapon_name,
        attachments: [
          'HOLO-SIGHT GEN 4',
          'VERTICAL RECOIL STABILIZER',
          'EXTENDED MAG T3'
        ],
        justification: `Based on your ${bestWeapon.accuracy}% accuracy with this weapon, we recommend a precision-focused loadout to maximize your ${accuracyGrade} performance.`,
        performanceIndex: (bestWeapon.kills * bestWeapon.accuracy / 10).toFixed(1)
      },
      secondaryOption: {
        weapon: 'M5A3 (CQB)',
        justification: 'For high-intensity close-quarters combat where your reaction speed is paramount.'
      },
      tacticalAdvice: accuracyGrade === 'ELITE' 
        ? 'Your precision is optimal. Transition to high-damage, low-fire-rate weaponry for maximum lethality.'
        : 'Focus on recoil management training to stabilize your engagement cycles.'
    };
  } catch (error) {
    console.error('AI Analytics Error:', error);
    return null;
  }
};
