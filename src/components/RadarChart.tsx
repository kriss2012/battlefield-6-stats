import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  data: any;
  title?: string;
}

export default function RadarChart({ data, title }: RadarChartProps) {
  if (!data) return null;

  // Normalize data for radar chart (mock normalization as we don't have max values)
  const chartData = [
    { subject: 'Kills', A: data.kills || 0, fullMark: 10000 },
    { subject: 'Win Rate', A: (data.winRate || 0) * 100, fullMark: 100 },
    { subject: 'Accuracy', A: (data.accuracy || 0) * 100, fullMark: 100 },
    { subject: 'Headshots', A: (data.headshotPercentage || 0) * 100, fullMark: 100 },
    { subject: 'K/D', A: (data.kdRatio || 0) * 20, fullMark: 100 },
    { subject: 'Level', A: data.level || 0, fullMark: 100 },
  ];

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      {title && <h3 className="text-lg font-black italic uppercase tracking-widest mb-4 text-blue-400">{title}</h3>}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 10, fontWeight: 'bold' }} />
            <Radar
              name="Player"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
