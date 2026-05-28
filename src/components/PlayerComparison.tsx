/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import { useState } from 'react';
import { analyticsApi } from '../services/api';

interface PlayerStats {
  player_id: string;
  player_name: string;
  kills: number;
  deaths: number;
  kd_ratio: number;
  wins: number;
  losses: number;
  win_rate: number;
  score: number;
  time_played: number;
  headshots: number;
  headshot_percentage: number;
  accuracy: number;
  level: number;
  rank: string;
}

export default function PlayerComparison() {
  const [playerIds, setPlayerIds] = useState<string[]>(['', '']);
  const [comparisonData, setComparisonData] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    const validIds = playerIds.filter((id) => id.trim() !== '');

    if (validIds.length < 2) {
      setError('Please enter at least 2 player IDs');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await analyticsApi.comparePlayers(validIds);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.players && result.players.length > 0) {
      setComparisonData(result.players);
    } else {
      setError('No data found for these players. Make sure they are tracked.');
    }

    setLoading(false);
  };

  const addPlayerInput = () => {
    if (playerIds.length < 4) {
      setPlayerIds([...playerIds, '']);
    }
  };

  const removePlayerInput = (index: number) => {
    if (playerIds.length > 2) {
      setPlayerIds(playerIds.filter((_, i) => i !== index));
    }
  };

  const updatePlayerId = (index: number, value: string) => {
    const newIds = [...playerIds];
    newIds[index] = value;
    setPlayerIds(newIds);
  };

  const getBestValue = (values: number[]) => Math.max(...values);
  const isHighlighted = (value: number, values: number[]) => value === getBestValue(values);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Player Comparison</h2>

      <div className="space-y-3 mb-6">
        {playerIds.map((id, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={id}
              onChange={(e) => updatePlayerId(index, e.target.value)}
              placeholder={`Player ${index + 1} ID`}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {playerIds.length > 2 && (
              <button
                onClick={() => removePlayerInput(index)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          {playerIds.length < 4 && (
            <button
              onClick={addPlayerInput}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              + Add Player
            </button>
          )}
          <button
            onClick={handleCompare}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {comparisonData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3">Stat</th>
                {comparisonData.map((player) => (
                  <th key={player.player_id} className="text-center p-3">
                    {player.player_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-3 font-semibold">K/D Ratio</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.kd_ratio);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.kd_ratio, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.kd_ratio.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Win Rate</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.win_rate);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.win_rate, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.win_rate.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Kills</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.kills);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.kills, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.kills.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Deaths</td>
                {comparisonData.map((player) => (
                  <td key={player.player_id} className="text-center p-3">
                    {player.deaths.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Headshot %</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.headshot_percentage);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.headshot_percentage, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.headshot_percentage.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Accuracy</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.accuracy);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.accuracy, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.accuracy.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Score</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.score);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.score, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.score.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Level</td>
                {comparisonData.map((player) => {
                  const values = comparisonData.map((p) => p.level);
                  return (
                    <td
                      key={player.player_id}
                      className={`text-center p-3 ${isHighlighted(player.level, values) ? 'bg-green-900/30 font-bold' : ''}`}
                    >
                      {player.level}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-semibold">Rank</td>
                {comparisonData.map((player) => (
                  <td key={player.player_id} className="text-center p-3">
                    {player.rank}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
