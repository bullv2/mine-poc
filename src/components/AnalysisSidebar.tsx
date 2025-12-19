import { MineLocation, getTrendData } from '../mockData';
import { Cloud, Sun, CloudRain, Wind, Thermometer, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalysisSidebarProps {
  mine: MineLocation | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AnalysisSidebar({ mine, isCollapsed, onToggleCollapse }: AnalysisSidebarProps) {
  if (!mine) {
    return (
      <div className={`bg-slate-900 border-l border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-0 overflow-hidden' : 'w-96'
      } flex items-center justify-center text-slate-400`}>
        <p>Select a mine to view details</p>
      </div>
    );
  }

  const trendData = getTrendData(mine.id);
  const totalIncidents = mine.incidents.length;
  const severityCounts = {
    High: mine.incidents.filter(i => i.severity === 'High').length,
    Medium: mine.incidents.filter(i => i.severity === 'Medium').length,
    Low: mine.incidents.filter(i => i.severity === 'Low').length,
  };

  const productionPercentage = (mine.production.current / mine.production.target) * 100;

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'Cloudy':
        return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'Rain':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <div className={`bg-slate-900 border-l border-slate-800 transition-all duration-300 overflow-y-auto ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-96 max-w-[90vw]'
    }`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{mine.name}</h2>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ←
          </button>
        </div>

        {/* Weather Widget */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Weather Conditions
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(mine.weather.condition)}
              <div>
                <div className="text-2xl font-bold text-white">{mine.weather.temperature}°C</div>
                <div className="text-sm text-slate-400">{mine.weather.condition}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Wind className="w-4 h-4" />
              <span className="text-sm">{mine.weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Safety Metrics */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Safety Metrics
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{severityCounts.High}</div>
                <div className="text-xs text-slate-400">High</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{severityCounts.Medium}</div>
                <div className="text-xs text-slate-400">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{severityCounts.Low}</div>
                <div className="text-xs text-slate-400">Low</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalIncidents}</div>
              <div className="text-xs text-slate-400">Total Incidents</div>
            </div>
            
            {/* 7-Day Trend */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">7-Day Incident Trend</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    stroke="#475569"
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    stroke="#475569"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operational Data */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Operational Data
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Production</span>
                <span className="text-white font-semibold">
                  {mine.production.current.toLocaleString()} / {mine.production.target.toLocaleString()} {mine.production.unit}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    productionPercentage >= 90 ? 'bg-green-500' :
                    productionPercentage >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(productionPercentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {productionPercentage.toFixed(1)}% of target
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Site Temperature</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Thermometer className="w-4 h-4" />
                  {mine.temperature}°C
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
