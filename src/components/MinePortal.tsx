import { X, Thermometer, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { MineLocation } from '../mockData';

interface MinePortalProps {
  mine: MineLocation;
  onClose: () => void;
}

export default function MinePortal({ mine, onClose }: MinePortalProps) {
  const getStatusColor = (status: MineLocation['status']) => {
    switch (status) {
      case 'Active':
        return '#22c55e';
      case 'Maintenance':
        return '#eab308';
      case 'Incident':
        return '#ef4444';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getStatusDot = (status: MineLocation['status']) => {
    const color = getStatusColor(status);
    return (
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  };

  const totalIncidents = mine.incidents.length;
  const openIncidents = mine.incidents.filter(i => i.status === 'Open').length;
  const resolvedIncidents = mine.incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
      style={{
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="bg-[#252525] border-b border-[#333333] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusDot(mine.status)}
            <h2 className="text-xl font-bold text-white tracking-wide uppercase">
              {mine.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status & Metrics Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#252525] border border-[#333333] rounded p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Status
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: getStatusColor(mine.status) }}
                >
                  {mine.status === 'Active' ? 'OPERATIONAL' : mine.status === 'Maintenance' ? 'MAINTENANCE' : 'INCIDENT'}
                </div>
              </div>
            </div>

            <div className="bg-[#252525] border border-[#333333] rounded p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                Temperature
              </div>
              <div className="text-2xl font-bold text-white">
                {mine.temperature}°C
              </div>
            </div>

            <div className="bg-[#252525] border border-[#333333] rounded p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Mine Type
              </div>
              <div className="text-lg font-semibold text-white">
                {mine.type}
              </div>
            </div>
          </div>

          {/* Location & Production */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#252525] border border-[#333333] rounded p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Location
              </div>
              <div className="text-sm text-white">
                {mine.location}
              </div>
            </div>

            <div className="bg-[#252525] border border-[#333333] rounded p-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Production
              </div>
              <div className="text-sm text-white mb-2">
                <span className="font-semibold text-lg" style={{ color: '#f97316' }}>
                  {mine.production.current.toLocaleString()}
                </span>
                {' / '}
                <span className="text-gray-400">
                  {mine.production.target.toLocaleString()}
                </span>
                {' '}
                <span className="text-gray-500 text-xs">
                  {mine.production.unit}
                </span>
              </div>
              <div className="mt-2 w-full bg-[#1E1E1E] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((mine.production.current / mine.production.target) * 100, 100)}%`,
                    backgroundColor: mine.production.current >= mine.production.target * 0.9 ? '#22c55e' : 
                                   mine.production.current >= mine.production.target * 0.7 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Incident Summary */}
          <div className="bg-[#252525] border border-[#333333] rounded p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Incident Summary
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-white">{totalIncidents}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{openIncidents}</div>
                <div className="text-xs text-gray-400">Open</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{resolvedIncidents}</div>
                <div className="text-xs text-gray-400">Resolved</div>
              </div>
            </div>
            <div className="flex gap-2">
              {['High', 'Medium', 'Low'].map((severity) => {
                const count = mine.incidents.filter(i => i.severity === severity).length;
                return (
                  <div key={severity} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSeverityColor(severity) }}
                    />
                    <span className="text-xs text-gray-400">
                      {severity}: <span className="text-white font-semibold">{count}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log / Recent Incidents */}
          <div className="bg-[#252525] border border-[#333333] rounded p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity Log
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mine.incidents.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center">
                  No incidents reported
                </div>
              ) : (
                mine.incidents.map((incident) => {
                  const date = new Date(incident.date);
                  const formattedDate = date.toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  });
                  const formattedTime = date.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div
                      key={incident.id}
                      className="border-l-2 pl-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                      style={{ borderColor: getSeverityColor(incident.severity) }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getSeverityColor(incident.severity) }}
                            />
                            <span className="text-sm font-semibold text-white">
                              {incident.type}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: incident.status === 'Open' ? '#ef4444' : '#22c55e',
                                color: '#fff'
                              }}
                            >
                              {incident.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {incident.description}
                          </p>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <div className="text-xs text-gray-500 font-mono">
                            {formattedDate}
                          </div>
                          <div className="text-xs text-gray-600 font-mono">
                            {formattedTime}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Severity:</span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: getSeverityColor(incident.severity) }}
                          >
                            {incident.severity.toUpperCase()}
                          </span>
                        </div>
                        {incident.status === 'Open' && (
                          <span className="text-xs" style={{ color: '#f97316' }}>
                            • ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
