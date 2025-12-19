import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { MineLocation } from '../mockData';
import MinePortal from './MinePortal';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as THREE from 'three';

interface MineMapProps {
  mines: MineLocation[];
  selectedMine: MineLocation | null;
  onMineSelect: (mine: MineLocation) => void;
}

export default function MineMap({ mines, selectedMine, onMineSelect }: MineMapProps) {
  const globeEl = useRef<any>();
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [hoveredMine, setHoveredMine] = useState<MineLocation | null>(null);
  const [showPortal, setShowPortal] = useState(false);
  const [portalMine, setPortalMine] = useState<MineLocation | null>(null);
  const [labelPositions, setLabelPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [globeKey, setGlobeKey] = useState(0); // Key to force globe re-render
  const [mineListOpen, setMineListOpen] = useState(false); // Dropdown state
  const mineListRef = useRef<HTMLDivElement>(null);

  // Prepare points data - store color and info, but create Three.js objects dynamically
  const points = useMemo(() => {
    const result = mines.map((mine) => {
      const color = 
        mine.status === 'Active' ? '#22c55e' :
        mine.status === 'Maintenance' ? '#eab308' :
        '#ef4444';
      
      const pointData = {
        ...mine,
        lat: mine.coordinates[0],
        lng: mine.coordinates[1],
        color: color,
        size: 1,
        // Store color and info for dynamic creation
        pinColor: color,
        pinName: mine.name,
        pinType: mine.type,
      };
      return pointData;
    });
    return result;
  }, [mines]);

  // Update label positions based on pin screen coordinates using react-globe.gl's getScreenCoords
  // Render labels together with globe for better UX
  useEffect(() => {
    if (!globeReady || !globeEl.current || !globeContainerRef.current) {
      // Clear labels if globe is not ready
      setLabelPositions(new Map());
      return;
    }

    const updateLabelPositions = () => {
      const newPositions = new Map<string, { x: number; y: number }>();
      
      try {
        // Use react-globe.gl's built-in getScreenCoords method
        const globeInstance = globeEl.current;
        if (!globeInstance || typeof globeInstance.getScreenCoords !== 'function') {
          return;
        }

        points.forEach((point) => {
          const lat = point.lat;
          const lng = point.lng;
          // Label should be at the start of the arc (where line starts)
          const altitude = 0.25; // Match arc startAltitude
          
          const screenCoords = globeInstance.getScreenCoords(lat, lng, altitude);
          
          if (screenCoords && screenCoords.x !== undefined && screenCoords.y !== undefined) {
            const containerRect = globeContainerRef.current!.getBoundingClientRect();
            // getScreenCoords returns coordinates relative to the globe container
            const x = screenCoords.x;
            const y = screenCoords.y;
            
            // Only show label if coordinates are valid (on screen or slightly off-screen for smooth transitions)
            if (!isNaN(x) && !isNaN(y)) {
              // Allow labels slightly outside bounds for smooth transitions
              const margin = 50;
              if (x >= -margin && x <= containerRect.width + margin && 
                  y >= -margin && y <= containerRect.height + margin) {
                newPositions.set(point.id, { x, y });
              }
            }
          }
        });
        
        setLabelPositions(newPositions);
      } catch (error) {
        console.error('Error updating label positions:', error);
      }
    };

    // Initial update immediately when globe is ready
    updateLabelPositions();
    
    // Update positions frequently for smooth movement during rotation
    const interval = setInterval(updateLabelPositions, 16); // ~60fps

    return () => clearInterval(interval);
  }, [globeReady, points, globeKey]); // Include globeKey to re-render labels when globe re-renders

  // Create rings (halos) around each point for pulsing effect
  const rings = useMemo(() => mines.map((mine) => ({
    ...mine,
    lat: mine.coordinates[0],
    lng: mine.coordinates[1],
    maxRadius: mine.status === 'Incident' ? 4 : mine.status === 'Maintenance' ? 3 : 2.5,
    propagationSpeed: 0.8,
    repeatPeriod: 1500,
    color: 
      mine.status === 'Active' ? 'rgba(34, 197, 94, 0.4)' :
      mine.status === 'Maintenance' ? 'rgba(234, 179, 8, 0.4)' :
      'rgba(239, 68, 68, 0.4)',
  })), [mines]);

  // Create arcs (lines) from labels to Earth's surface with cyberpunk glow effect
  const [animationTime, setAnimationTime] = useState(0);
  
  // Animate for cyberpunk pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 0.02) % (Math.PI * 2));
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  const arcs = useMemo(() => mines.map((mine) => {
    const color = 
      mine.status === 'Active' ? '#22c55e' :
      mine.status === 'Maintenance' ? '#eab308' :
      '#ef4444';
    
    return {
      ...mine,
      startLat: mine.coordinates[0],
      startLng: mine.coordinates[1],
      startAltitude: 0.25, // Start from above (where label is)
      endLat: mine.coordinates[0],
      endLng: mine.coordinates[1],
      endAltitude: 0, // End at Earth's surface
      color: color,
      // Cyberpunk: Add glow colors with pulsing opacity
      glowColor: color + 'CC', // More opaque center
      outerGlowColor: color + '66', // Outer glow
    };
  }), [mines]);

  // Center globe on selected mine
  useEffect(() => {
    if (selectedMine && globeEl.current) {
      const { lat, lng } = selectedMine.coordinates;
      globeEl.current.pointOfView(
        { lat, lng, altitude: 2.5 },
        1000 // animation duration
      );
    }
  }, [selectedMine]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mineListRef.current && !mineListRef.current.contains(event.target as Node)) {
        setMineListOpen(false);
      }
    };

    if (mineListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mineListOpen]);

  // Removed the checkGlobe useEffect - it was causing re-render loops

  const handlePointClick = (point: any) => {
    console.log('Point clicked:', point);
    const mine = point as MineLocation;
    setPortalMine(mine);
    setShowPortal(true);
    onMineSelect(mine);
  };

  const handleClosePortal = useCallback(() => {
    // Close portal immediately - React will handle unmounting
    console.log('Closing portal...');
    setShowPortal(false);
    setPortalMine(null);
    setHoveredMine(null);
    // Force globe to re-render by changing its key
    setGlobeKey((prev) => prev + 1);
    console.log('Portal closed, forcing globe re-render');
  }, []);

  // Removed objectThreeObjectFn - no more 3D pins

  const handleMineListClick = (mine: MineLocation) => {
    handlePointClick(mine);
    // Center globe on selected mine
    if (globeEl.current) {
      const { lat, lng } = mine.coordinates;
      globeEl.current.pointOfView(
        { lat, lng, altitude: 2.5 },
        1000
      );
    }
  };

  return (
    <div ref={globeContainerRef} className="w-full h-full relative bg-slate-950 overflow-hidden">
      {/* Globe - Always rendered, re-renders when portal closes */}
      <Globe
        key={`globe-${globeKey}`}
        ref={(el) => {
          globeEl.current = el;
          // Don't trigger state updates here - it causes re-render loops
        }}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        // Add arcs (lines) from labels to Earth's surface - Cyberpunk style
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcStartAltitude="startAltitude"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcEndAltitude="endAltitude"
        arcColor={(arc: any) => {
          // Cyberpunk: pulsing glow based on animation time
          const pulse = Math.sin(animationTime) * 0.3 + 0.7; // Pulse between 0.7 and 1.0
          const baseColor = arc.color || '#22c55e';
          // Convert hex to rgba for opacity control
          const r = parseInt(baseColor.slice(1, 3), 16);
          const g = parseInt(baseColor.slice(3, 5), 16);
          const b = parseInt(baseColor.slice(5, 7), 16);
          const alpha = Math.floor(pulse * 255).toString(16).padStart(2, '0');
          return `rgba(${r}, ${g}, ${b}, ${pulse})`;
        }}
        arcStroke={0.5}
        arcCurveResolution={64}
        // Remove dash animation - solid glowing lines
        // Add rings for glow/halo effect
        ringsData={rings}
        ringColor="color"
        ringMaxRadius="maxRadius"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringResolution={32}
        // Click handlers for arcs
        onArcClick={(arc: any) => {
          handlePointClick(arc);
        }}
        onArcHover={(arc: any) => {
          setHoveredMine(arc as MineLocation | null);
        }}
        // Also keep point handlers for rings
        onPointClick={handlePointClick}
        onPointHover={(point: any) => {
          setHoveredMine(point as MineLocation | null);
        }}
        onGlobeReady={() => {
          console.log('✅ Globe is ready!');
          setGlobeReady(true);
          // Don't trigger additional state updates here
        }}
        animateIn={true}
        showAtmosphere={true}
        atmosphereColor="#1e293b"
        atmosphereAltitude={0.15}
        enablePointerInteraction={true}
      />
      
      {/* Legend */}
      <div 
        className="absolute top-4 left-4 backdrop-blur-md border rounded-lg p-4 z-50"
        style={{
          backgroundColor: 'rgba(30, 30, 30, 0.65)',
          borderColor: 'rgba(51, 51, 51, 0.4)',
        }}
      >
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mine Status</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            <span className="text-gray-300">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
            <span className="text-gray-300">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
            <span className="text-gray-300">Incident</span>
          </div>
        </div>
        <div 
          className="mt-3 pt-3 border-t text-xs text-gray-500"
          style={{
            borderTopColor: 'rgba(51, 51, 51, 0.4)',
          }}
        >
          Click pins to view details
        </div>
      </div>

      {/* Hovered mine info */}
      {hoveredMine && !showPortal && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md border rounded-lg p-3 z-10 animate-fade-in"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.65)',
            borderColor: 'rgba(51, 51, 51, 0.4)',
          }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ 
                backgroundColor: hoveredMine.status === 'Active' ? '#22c55e' : hoveredMine.status === 'Maintenance' ? '#eab308' : '#ef4444',
                boxShadow: `0 0 8px ${hoveredMine.status === 'Active' ? '#22c55e' : hoveredMine.status === 'Maintenance' ? '#eab308' : '#ef4444'}`
              }}
            />
            <span className="text-white font-semibold">{hoveredMine.name}</span>
            <span className="text-xs text-gray-400">• Click to view details</span>
          </div>
        </div>
      )}

      {/* HTML Labels positioned above pins - Clickable */}
      {Array.from(labelPositions.entries()).map(([mineId, pos]) => {
        const mine = mines.find(m => m.id === mineId);
        if (!mine) return null;
        
        const color = 
          mine.status === 'Active' ? '#22c55e' :
          mine.status === 'Maintenance' ? '#eab308' :
          '#ef4444';
        
        return (
          <div
            key={mineId}
            className="absolute z-30 cursor-pointer transition-transform hover:scale-105"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
            onClick={() => handlePointClick(mine)}
            onMouseEnter={() => setHoveredMine(mine)}
            onMouseLeave={() => {
              // Only clear hover if it's this mine
              if (hoveredMine?.id === mine.id) {
                setHoveredMine(null);
              }
            }}
          >
            <div 
              className="px-3 py-1.5 rounded border-2 shadow-lg backdrop-blur-md transition-all hover:shadow-xl"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.7)',
                borderColor: color,
                minWidth: '150px',
                textAlign: 'center',
                boxShadow: hoveredMine?.id === mine.id 
                  ? `0 0 20px ${color}80, 0 0 10px ${color}40`
                  : `0 0 8px ${color}40`,
              }}
            >
              <div className="text-white font-bold text-sm whitespace-nowrap">
                {mine.name.length > 20 ? mine.name.substring(0, 17) + '...' : mine.name}
              </div>
              <div className="text-orange-500 font-semibold text-xs mt-0.5">
                {mine.type}
              </div>
            </div>
          </div>
        );
      })}

      {/* Portal Popup */}
      {showPortal && portalMine && (
        <MinePortal 
          key={portalMine.id} 
          mine={portalMine} 
          onClose={handleClosePortal} 
        />
      )}

      {/* Mine Navigation List Dropdown - Right Side */}
      <div 
        ref={mineListRef}
        className="absolute top-4 right-4 w-64 z-50"
      >
        {/* Dropdown Button */}
        <button
          onClick={() => setMineListOpen(!mineListOpen)}
          className="w-full backdrop-blur-md border rounded-lg px-4 py-3 flex items-center justify-between transition-all hover:shadow-lg"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.65)',
            borderColor: 'rgba(51, 51, 51, 0.4)',
          }}
        >
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Mine Locations</h3>
            <p className="text-xs text-gray-500 mt-1">{mines.length} mines</p>
          </div>
          {mineListOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Dropdown Content */}
        {mineListOpen && (
          <div 
            className="mt-2 backdrop-blur-md border rounded-lg overflow-hidden max-h-[calc(100vh-12rem)] flex flex-col animate-fade-in"
            style={{
              backgroundColor: 'rgba(30, 30, 30, 0.65)',
              borderColor: 'rgba(51, 51, 51, 0.4)',
            }}
          >
            <div className="overflow-y-auto flex-1">
              <div className="p-2 space-y-1">
                {mines.map((mine) => {
                  const color = 
                    mine.status === 'Active' ? '#22c55e' :
                    mine.status === 'Maintenance' ? '#eab308' :
                    '#ef4444';
                  
                  const isSelected = selectedMine?.id === mine.id;
                  const isHovered = hoveredMine?.id === mine.id;
                  
                  return (
                    <button
                      key={mine.id}
                      onClick={() => {
                        handleMineListClick(mine);
                        setMineListOpen(false); // Close dropdown after selection
                      }}
                      className="w-full text-left px-3 py-2 rounded transition-all cursor-pointer border-l-2"
                      style={{
                        backgroundColor: isSelected 
                          ? 'rgba(51, 51, 51, 0.6)' 
                          : isHovered 
                            ? 'rgba(42, 42, 42, 0.5)' 
                            : 'transparent',
                        borderLeftColor: isSelected ? color : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        setHoveredMine(mine);
                        if (!isSelected && !isHovered) {
                          e.currentTarget.style.backgroundColor = 'rgba(37, 37, 37, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (hoveredMine?.id === mine.id) {
                          setHoveredMine(null);
                        }
                        if (!isSelected && !isHovered) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: color,
                            boxShadow: `0 0 6px ${color}80`
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}>
                            {mine.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{mine.type}</div>
                        </div>
                        {mine.incidents.filter(i => i.status === 'Open').length > 0 && (
                          <div className="flex-shrink-0 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded">
                            {mine.incidents.filter(i => i.status === 'Open').length}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
