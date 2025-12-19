import { useState, useMemo } from 'react';
import { mineLocations, MineLocation } from './mockData';
import MineMap from './components/MineMap';
import AnalysisSidebar from './components/AnalysisSidebar';
import IncidentLog from './components/IncidentLog';
import Login from './components/Login';
import { AlertCircle, X } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showIncidentLog, setShowIncidentLog] = useState(false);

  // Count open incidents for badge
  const openIncidentCount = useMemo(() => {
    return mineLocations.reduce((count, mine) => {
      return count + mine.incidents.filter(i => i.status === 'Open').length;
    }, 0);
  }, [mineLocations]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header 
        className="backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between z-10"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          borderBottomColor: 'rgba(30, 41, 59, 0.4)',
        }}
      >
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
          <div className="text-sm text-slate-400">
            {mineLocations.length} Active Mines
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Height */}
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

      {/* Floating Incident Log Button */}
      <button
        onClick={() => setShowIncidentLog(true)}
        className="fixed bottom-6 left-6 z-50 backdrop-blur-sm text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center group border"
        style={{ 
          width: '64px', 
          height: '64px',
          backgroundColor: 'rgba(220, 38, 38, 0.7)',
          borderColor: 'rgba(239, 68, 68, 0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(185, 28, 28, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.7)';
        }}
        aria-label="Open Incident Reporting Log"
      >
        <AlertCircle className="w-7 h-7" />
        {openIncidentCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-950">
            {openIncidentCount > 99 ? '99+' : openIncidentCount}
          </span>
        )}
      </button>

      {/* Incident Log Popout Modal */}
      {showIncidentLog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowIncidentLog(false);
            }
          }}
        >
          <div 
            className="relative w-full max-w-6xl h-[85vh] backdrop-blur-md border rounded-lg shadow-2xl overflow-hidden animate-zoom-in flex flex-col"
            style={{
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              borderColor: 'rgba(51, 51, 51, 0.4)',
            }}
          >
            {/* Header */}
            <div 
              className="backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between flex-shrink-0"
              style={{
                backgroundColor: 'rgba(37, 37, 37, 0.7)',
                borderBottomColor: 'rgba(51, 51, 51, 0.4)',
              }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  Incident Reporting Log
                </h2>
                {openIncidentCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 text-sm px-3 py-1 rounded-full border border-red-500/30">
                    {openIncidentCount} Open Incident{openIncidentCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowIncidentLog(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close Incident Log"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <IncidentLog mines={mineLocations} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
