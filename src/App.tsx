import { useState } from 'react';
import { mineLocations, MineLocation } from './mockData';
import MineMap from './components/MineMap';
import AnalysisSidebar from './components/AnalysisSidebar';
import IncidentLog from './components/IncidentLog';

function App() {
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showIncidentLog, setShowIncidentLog] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Mine Analysis Dashboard</h1>
            <p className="text-xs text-slate-400">Real-time monitoring and incident management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowIncidentLog(!showIncidentLog)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-white transition-colors"
          >
            {showIncidentLog ? 'Hide' : 'Show'} Incident Log
          </button>
          <div className="text-sm text-slate-400">
            {mineLocations.length} Active Mines
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Section */}
        <div className="flex-1 transition-all duration-300">
          <MineMap
            mines={mineLocations}
            selectedMine={selectedMine}
            onMineSelect={(mine) => {
              setSelectedMine(mine);
              setSidebarCollapsed(false);
            }}
          />
        </div>

        {/* Sidebar */}
        <AnalysisSidebar
          mine={selectedMine}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Incident Log Section */}
      {showIncidentLog && (
        <div className="h-96 border-t border-slate-800 overflow-y-auto">
          <IncidentLog mines={mineLocations} />
        </div>
      )}
    </div>
  );
}

export default App;
