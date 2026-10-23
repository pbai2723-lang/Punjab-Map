import React, { useState, useMemo } from 'react';
import { District, PunjabSide, River } from '../types/punjab';
import { RIVERS_DATA, DOABS_DATA } from '../data/punjabDistricts';
import { formatNumber } from '../utils/punjabData';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Search, Layers, Compass, MapPin, Sparkles } from 'lucide-react';

interface MapCanvasProps {
  districts: District[];
  selectedSide: 'all' | PunjabSide;
  onSelectDistrict: (district: District) => void;
  selectedDistrict: District | null;
}

// Distinct division color palette for crisp visual distinction
const DIVISION_COLORS: Record<string, string> = {
  // East Punjab Sub-regions
  'Majha': '#f59e0b', // Amber
  'Doaba': '#10b981', // Emerald
  'Malwa': '#8b5cf6', // Violet
  'Malwa (Shivalik Margin)': '#6366f1', // Indigo

  // West Punjab Divisions
  'Lahore Division': '#ef4444', // Red
  'Gujranwala Division': '#f97316', // Orange
  'Gujrat Division': '#06b6d4', // Cyan
  'Rawalpindi Division': '#3b82f6', // Blue
  'Faisalabad Division': '#ec4899', // Pink
  'Sargodha Division': '#14b8a6', // Teal
  'Sahiwal Division': '#84cc16', // Lime
  'Multan Division': '#a855f7', // Purple
  'Bahawalpur Division': '#d97706', // Ochre
  'Dera Ghazi Khan Division': '#64748b', // Slate
};

const DOAB_COLORS: Record<string, string> = {
  'Bist Doab (Jalandhar Doab)': '#059669',
  'Bari Doab (Majha)': '#d97706',
  'Bari Doab': '#d97706',
  'Bari Doab (Ganji Bar)': '#d97706',
  'Bari Doab / Neeli Bar': '#d97706',
  'Bari Doab / Sutlej Valley': '#d97706',
  'Rechna Doab': '#2563eb',
  'Jech Doab': '#7c3aed',
  'Rechna / Jech Doab': '#7c3aed',
  'Sindh Sagar Doab': '#dc2626',
  'Sindh Sagar / Salt Range': '#dc2626',
  'Sindh Sagar (Thal Desert)': '#dc2626',
  'Sindh Sagar (Thal Margin)': '#dc2626',
  'Sindh Sagar Doab (Tip)': '#dc2626',
  'Pothohar Plateau': '#0284c7',
  'Salt Range / Pothohar': '#0284c7',
  'Himalayan Foothills': '#0891b2',
  'Malwa Plains': '#9333ea',
  'Malwa': '#9333ea',
  'Malwa (Shivalik Margin)': '#9333ea',
  'Cholistan Desert / Panjnad': '#b45309',
  'Sutlej Valley / Cholistan Margin': '#b45309',
  'Lower Punjab / Cholistan': '#b45309',
  'Derajat (West of Indus)': '#475569',
  'Neeli Bar / Sutlej': '#ca8a04',
};

export const MapCanvas: React.FC<MapCanvasProps> = ({
  districts,
  selectedSide,
  onSelectDistrict,
  selectedDistrict,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Toggles
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showHQMarkers, setShowHQMarkers] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<'division' | 'doab' | 'density'>('division');

  // Hover state
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [searchHighlight, setSearchHighlight] = useState<string>('');

  // Density Max for Heatmap
  const maxDensity = useMemo(() => {
    return Math.max(...districts.map(d => d.population / Math.max(d.areaKm2, 1)));
  }, [districts]);

  // Color determination function
  const getFillColor = (d: District) => {
    if (searchHighlight && d.name.toLowerCase().includes(searchHighlight.toLowerCase())) {
      return '#facc15'; // Golden yellow highlight
    }

    if (colorMode === 'division') {
      return DIVISION_COLORS[d.division] || '#94a3b8';
    }

    if (colorMode === 'doab') {
      return DOAB_COLORS[d.doab] || '#64748b';
    }

    if (colorMode === 'density') {
      const density = d.population / Math.max(d.areaKm2, 1);
      const ratio = Math.min(density / 1500, 1);
      // Heatmap gradient from mellow green to bright ruby
      if (ratio > 0.7) return '#b91c1c';
      if (ratio > 0.4) return '#ea580c';
      if (ratio > 0.2) return '#eab308';
      return '#10b981';
    }

    return '#94a3b8';
  };

  // Zoom presets
  const handleFocusEast = () => {
    setZoom(1.6);
    setPan({ x: -450, y: -150 });
  };

  const handleFocusWest = () => {
    setZoom(1.35);
    setPan({ x: 100, y: -60 });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Top Map Controls Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md p-3 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Highlight district..."
              value={searchHighlight}
              onChange={(e) => setSearchHighlight(e.target.value)}
              className="bg-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
            />
            {searchHighlight && (
              <button
                onClick={() => setSearchHighlight('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400 px-1 font-medium">Color:</span>
            <button
              onClick={() => setColorMode('division')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                colorMode === 'division' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Divisions
            </button>
            <button
              onClick={() => setColorMode('doab')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                colorMode === 'doab' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Doabs
            </button>
            <button
              onClick={() => setColorMode('density')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                colorMode === 'density' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Density
            </button>
          </div>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showRivers}
              onChange={(e) => setShowRivers(e.target.checked)}
              className="rounded text-amber-600 focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Rivers
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showLandmarks}
              onChange={(e) => setShowLandmarks(e.target.checked)}
              className="rounded text-amber-600 focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Landmarks
            </span>
          </label>

          <label className="hidden md:flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showBorder}
              onChange={(e) => setShowBorder(e.target.checked)}
              className="rounded text-amber-600 focus:ring-0 cursor-pointer"
            />
            <span>Radcliffe Line</span>
          </label>

          <label className="hidden sm:flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded text-amber-600 focus:ring-0 cursor-pointer"
            />
            <span>Labels</span>
          </label>
        </div>

        {/* Zoom Presets & Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={handleFocusEast}
            className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700"
            title="Focus East Punjab (India)"
          >
            🇮🇳 East
          </button>
          <button
            onClick={handleFocusWest}
            className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700"
            title="Focus West Punjab (Pakistan)"
          >
            🇵🇰 West
          </button>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
            className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.6))}
            className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
            title="Reset Map View"
            aria-label="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div
        className="flex-1 w-full relative overflow-hidden cursor-grab active:cursor-grabbing bg-radial from-slate-900 to-slate-950 select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1150 880"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '550px 450px',
          }}
        >
          <defs>
            {/* Water Flow Animation Gradient */}
            <linearGradient id="riverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>

            {/* Drop Shadow for Selected District */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Grid Pattern for Cartographic Texture */}
          <g opacity="0.07">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="880" stroke="#94a3b8" strokeDasharray="3,3" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="1150" y2={i * 50} stroke="#94a3b8" strokeDasharray="3,3" />
            ))}
          </g>

          {/* Regional Area Watermark Labels */}
          <text x="440" y="70" fill="#334155" fontSize="24" fontWeight="800" letterSpacing="4">
            WEST PUNJAB (PAKISTAN)
          </text>
          <text x="820" y="190" fill="#334155" fontSize="22" fontWeight="800" letterSpacing="4">
            EAST PUNJAB (INDIA)
          </text>

          {/* 1947 Radcliffe Border Line (Between East and West Punjab) */}
          {showBorder && (
            <g id="radcliffe-border">
              <path
                d="M 810 240 L 805 275 L 810 320 L 785 365 L 755 420 L 745 470 L 745 530 L 715 570 L 670 600"
                stroke="#e2e8f0"
                strokeWidth="3.5"
                strokeDasharray="6,4"
                fill="none"
                opacity="0.75"
              />
              <text x="760" y="300" fill="#cbd5e1" fontSize="10" transform="rotate(78 760 300)" opacity="0.8">
                Radcliffe Demarcation Line (1947)
              </text>
            </g>
          )}

          {/* Districts Polygons */}
          <g id="districts-layer">
            {districts.map((district) => {
              const isSelected = selectedDistrict?.id === district.id;
              const isHovered = hoveredDistrict?.id === district.id;
              const isFilteredOut = selectedSide !== 'all' && district.side !== selectedSide;
              const fill = getFillColor(district);

              return (
                <g
                  key={district.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDistrict(district);
                  }}
                  onMouseEnter={() => setHoveredDistrict(district)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <path
                    d={district.svgPath}
                    fill={fill}
                    fillOpacity={isFilteredOut ? 0.15 : isSelected ? 0.95 : isHovered ? 0.9 : 0.72}
                    stroke={isSelected ? '#ffffff' : isHovered ? '#fef08a' : '#1e293b'}
                    strokeWidth={isSelected ? 3 : isHovered ? 2.2 : 1.2}
                    filter={isSelected ? 'url(#glowEffect)' : undefined}
                    className="hover:brightness-110 transition-all"
                  />
                </g>
              );
            })}
          </g>

          {/* The 5 Rivers of Punjab ("Panj-Aab") Layer */}
          {showRivers && (
            <g id="rivers-layer" pointerEvents="none">
              {RIVERS_DATA.map((river) => (
                <g key={river.id}>
                  {/* Outer glow stroke */}
                  <path
                    d={river.pathD}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                  {/* River water stroke */}
                  <path
                    d={river.pathD}
                    fill="none"
                    stroke="url(#riverGlow)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>
              ))}

              {/* River Text Markers */}
              <text x="960" y="475" fill="#38bdf8" fontSize="12" fontWeight="700" letterSpacing="1">
                Sutlej River ~
              </text>
              <text x="880" y="380" fill="#38bdf8" fontSize="11" fontWeight="700" letterSpacing="1">
                Beas River ~
              </text>
              <text x="690" y="390" fill="#38bdf8" fontSize="11" fontWeight="700" letterSpacing="1">
                Ravi River ~
              </text>
              <text x="590" y="340" fill="#38bdf8" fontSize="12" fontWeight="700" letterSpacing="1">
                Chenab River ~
              </text>
              <text x="470" y="270" fill="#38bdf8" fontSize="12" fontWeight="700" letterSpacing="1">
                Jhelum River ~
              </text>
              <text x="320" y="240" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="1">
                Indus River (Sindh) ~
              </text>
            </g>
          )}

          {/* District Labels & Headquarters Markers */}
          {showLabels && (
            <g id="labels-layer" pointerEvents="none">
              {districts.map((d) => {
                const isFilteredOut = selectedSide !== 'all' && d.side !== selectedSide;
                if (isFilteredOut) return null;

                const [cx, cy] = d.center;
                return (
                  <g key={`lbl-${d.id}`}>
                    {showHQMarkers && (
                      <circle
                        cx={cx}
                        cy={cy - 4}
                        r="2.5"
                        fill="#ffffff"
                        stroke="#0f172a"
                        strokeWidth="1"
                      />
                    )}
                    <text
                      x={cx}
                      y={cy + 10}
                      fill="#f8fafc"
                      fontSize={zoom > 1.3 ? '10' : '8.5'}
                      fontWeight="600"
                      textAnchor="middle"
                      style={{
                        textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
                      }}
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Iconic Landmarks Highlight Pins */}
          {showLandmarks && (
            <g id="landmarks-layer" pointerEvents="none">
              {/* Golden Temple, Amritsar */}
              <g transform="translate(815, 350)">
                <circle r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle r="2" fill="#78350f" />
                <text x="8" y="4" fill="#fbbf24" fontSize="10" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Harmandir Sahib
                </text>
              </g>

              {/* Badshahi Mosque & Fort, Lahore */}
              <g transform="translate(730, 385)">
                <circle r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <circle r="2" fill="#7f1d1d" />
                <text x="8" y="4" fill="#fca5a5" fontSize="10" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Lahore Fort / Badshahi
                </text>
              </g>

              {/* Rohtas Fort, Jhelum */}
              <g transform="translate(580, 225)">
                <circle r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.2" />
                <text x="8" y="3" fill="#93c5fd" fontSize="9" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Rohtas Fort
                </text>
              </g>

              {/* Harappa, Sahiwal */}
              <g transform="translate(610, 485)">
                <circle r="5" fill="#84cc16" stroke="#ffffff" strokeWidth="1.2" />
                <text x="8" y="3" fill="#bef264" fontSize="9" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Harappa (3300 BCE)
                </text>
              </g>

              {/* Katas Raj, Chakwal */}
              <g transform="translate(520, 215)">
                <circle r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.2" />
                <text x="8" y="3" fill="#67e8f9" fontSize="9" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Katas Raj
                </text>
              </g>

              {/* Derawar Fort, Cholistan */}
              <g transform="translate(430, 665)">
                <circle r="5" fill="#d97706" stroke="#ffffff" strokeWidth="1.2" />
                <text x="8" y="3" fill="#fde68a" fontSize="9" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Derawar Fort
                </text>
              </g>

              {/* Virasat-e-Khalsa, Anandpur Sahib */}
              <g transform="translate(950, 445)">
                <circle r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.2" />
                <text x="8" y="3" fill="#ddd6fe" fontSize="9" fontWeight="bold" style={{ textShadow: '0 1px 2px #000' }}>
                  Anandpur Sahib
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Hovered District Tooltip Card (Floating Inspector) */}
        {hoveredDistrict && (
          <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs max-w-xs pointer-events-none z-30 transition-all">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                {hoveredDistrict.name}
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {hoveredDistrict.side === 'east' ? '🇮🇳 East Punjab' : '🇵🇰 West Punjab'}
                </span>
              </span>
              <span className="text-amber-400 font-semibold">{hoveredDistrict.division}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div>
                <span className="text-slate-400 block">Gurmukhi:</span>
                <span className="font-medium text-amber-200">{hoveredDistrict.nativeGurmukhi}</span>
              </div>
              <div dir="rtl">
                <span className="text-slate-400 block">Shahmukhi:</span>
                <span className="font-medium text-amber-200">{hoveredDistrict.nativeShahmukhi}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Population:</span>
                <span className="font-semibold text-slate-200">{formatNumber(hoveredDistrict.population)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Area:</span>
                <span className="font-semibold text-slate-200">{formatNumber(hoveredDistrict.areaKm2)} km²</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-800/80">
              <span className="text-amber-400 font-medium">Doab: </span>
              {hoveredDistrict.doab}
            </div>

            <p className="text-[10px] text-amber-300/80 mt-1 italic">
              Click to view complete district profile & historic landmarks →
            </p>
          </div>
        )}

        {/* Legend Panel in Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg text-[10px] text-slate-300 max-w-xs hidden sm:block z-20">
          <div className="font-semibold text-xs text-white mb-1.5 flex items-center justify-between">
            <span>Punjab Cartography</span>
            <span className="text-amber-400">Panj-Aab (5 Rivers)</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded"></span>
              <span>Historic 5 Rivers (Sutlej, Beas, Ravi, Chenab, Jhelum)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-300"></span>
              <span>1947 Partition Border (Radcliffe Line)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Key Historic / Cultural Landmark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
