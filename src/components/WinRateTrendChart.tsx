import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../services/api';

interface WinRateTrendChartProps {
  playerId: string;
  days?: number;
}

interface TrendData {
  date: string;
  win_rate: number;
}

export default function WinRateTrendChart({ playerId, days = 30 }: WinRateTrendChartProps) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendData() {
      setLoading(true);
      setError(null);
      const result = await analyticsApi.getWinRateTrend(playerId, days);
      if (result.error) {
        setError(result.error);
      } else if (result.trend && result.trend.length > 0) {
        setData(result.trend);
      } else {
        setError('Insufficient historical data for trend analysis.');
      }
      setLoading(false);
    }
    if (playerId) fetchTrendData();
  }, [playerId, days]);

  if (loading) return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-4 bg-white/5 rounded w-1/4 mb-4" />
      <div className="flex-1 bg-white/5 rounded-2xl" />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 block mb-1">Squad Operations</span>
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Strategic Win Rate <span className="text-gray-600">v4.0</span></h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-500 uppercase">Victory Probability</span>
          <div className="text-lg font-black italic text-purple-500 tracking-tighter">CALCULATING...</div>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] -ml-6 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/60">{error}</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10,10,10,0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px'
              }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
              labelStyle={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px', fontFamily: 'monospace' }}
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'WIN RATE']}
            />
            <Area 
              type="monotone" 
              dataKey="win_rate" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorWin)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
