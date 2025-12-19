import { useState, useMemo } from 'react';
import { Incident, MineLocation } from '../mockData';
import { Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface IncidentLogProps {
  mines: MineLocation[];
}

export default function IncidentLog({ mines }: IncidentLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const allIncidents = useMemo(() => {
    return mines.flatMap(mine => 
      mine.incidents.map((incident: Incident) => ({
        ...incident,
        mineName: mine.name,
        mineLocation: mine.location
      }))
    );
  }, [mines]);

  const filteredIncidents = useMemo(() => {
    return allIncidents.filter(incident => {
      const matchesSearch = 
        incident.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || incident.type === filterType;
      const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allIncidents, searchTerm, filterType, filterStatus]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'Open' ? (
      <Clock className="w-4 h-4 text-yellow-400" />
    ) : (
      <CheckCircle2 className="w-4 h-4 text-green-400" />
    );
  };

  return (
    <div 
      className="h-full flex flex-col backdrop-blur-sm p-6 overflow-hidden"
      style={{
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
      }}
    >
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="text-sm text-gray-400">
          Total: <span className="text-white font-semibold">{filteredIncidents.length}</span> incidents
        </div>
      </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              id="incident-search"
              name="incident-search"
              placeholder="Search by mine name, type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 backdrop-blur-sm border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: 'rgba(37, 37, 37, 0.6)',
                borderColor: 'rgba(51, 51, 51, 0.4)',
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <select
              id="incident-type-filter"
              name="incident-type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 backdrop-blur-sm border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'rgba(37, 37, 37, 0.6)',
                borderColor: 'rgba(51, 51, 51, 0.4)',
              }}
            >
              <option value="all">All Types</option>
              <option value="Equipment Failure">Equipment Failure</option>
              <option value="Structural">Structural</option>
              <option value="Personal Injury">Personal Injury</option>
              <option value="Environmental">Environmental</option>
              <option value="Other">Other</option>
            </select>

            <select
              id="incident-status-filter"
              name="incident-status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 backdrop-blur-sm border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'rgba(37, 37, 37, 0.6)',
                borderColor: 'rgba(51, 51, 51, 0.4)',
              }}
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Incident Table */}
        <div 
          className="backdrop-blur-sm rounded-lg border overflow-hidden flex-1 flex flex-col min-h-0"
          style={{
            backgroundColor: 'rgba(37, 37, 37, 0.6)',
            borderColor: 'rgba(51, 51, 51, 0.4)',
          }}
        >
          <div className="overflow-auto flex-1">
            <table className="w-full">
              <thead 
                className="backdrop-blur-sm border-b sticky top-0 z-10"
                style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.7)',
                  borderBottomColor: 'rgba(51, 51, 51, 0.4)',
                }}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Mine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No incidents found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(incident.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{incident.mineName}</div>
                        <div className="text-xs text-slate-400">{incident.mineLocation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {incident.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(incident.status)}
                          <span className={incident.status === 'Open' ? 'text-yellow-400' : 'text-green-400'}>
                            {incident.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 max-w-md">
                        {incident.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
