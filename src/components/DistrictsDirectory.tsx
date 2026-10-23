import React, { useState, useMemo } from 'react';
import { District, PunjabSide } from '../types/punjab';
import { formatNumber, getAllDivisions, getAllRiversList } from '../utils/punjabData';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Bookmark,
  GitCompare,
  MapPin,
  Sparkles,
  Check
} from 'lucide-react';

interface DistrictsDirectoryProps {
  districts: District[];
  selectedSide: 'all' | PunjabSide;
  onSideChange: (side: 'all' | PunjabSide) => void;
  onSelectDistrict: (district: District) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (districtId: string) => void;
  onAddToCompare: (district: District) => void;
}

export const DistrictsDirectory: React.FC<DistrictsDirectoryProps> = ({
  districts,
  selectedSide,
  onSideChange,
  onSelectDistrict,
  bookmarkedIds,
  onToggleBookmark,
  onAddToCompare,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedRiver, setSelectedRiver] = useState('all');
  const [selectedDoab, setSelectedDoab] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'population' | 'area' | 'literacy'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Available Divisions and Rivers for dropdowns
  const availableDivisions = useMemo(() => getAllDivisions(selectedSide), [selectedSide]);
  const availableRivers = useMemo(() => getAllRiversList(), []);

  // Filtered & Sorted list
  const filteredDistricts = useMemo(() => {
    let list = districts;

    // Filter by side
    if (selectedSide !== 'all') {
      list = list.filter(d => d.side === selectedSide);
    }

    // Filter by division
    if (selectedDivision !== 'all') {
      list = list.filter(d => d.division.toLowerCase() === selectedDivision.toLowerCase());
    }

    // Filter by river
    if (selectedRiver !== 'all') {
      list = list.filter(d => d.rivers.some(r => r.toLowerCase().includes(selectedRiver.toLowerCase())));
    }

    // Filter by doab
    if (selectedDoab !== 'all') {
      list = list.filter(d => d.doab.toLowerCase().includes(selectedDoab.toLowerCase()));
    }

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(d => {
        return (
          d.name.toLowerCase().includes(q) ||
          d.nativeGurmukhi.toLowerCase().includes(q) ||
          d.nativeShahmukhi.toLowerCase().includes(q) ||
          d.headquarters.toLowerCase().includes(q) ||
          d.famousFor.some(f => f.toLowerCase().includes(q)) ||
          d.majorCrops.some(c => c.toLowerCase().includes(q)) ||
          d.keyLandmarks.some(l => l.name.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'population') cmp = a.population - b.population;
      else if (sortBy === 'area') cmp = a.areaKm2 - b.areaKm2;
      else if (sortBy === 'literacy') cmp = a.literacyRate - b.literacyRate;
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return sorted;
  }, [districts, selectedSide, selectedDivision, selectedRiver, selectedDoab, search, sortBy, sortOrder]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Gurmukhi', 'Shahmukhi', 'Region/Side', 'Division', 'Headquarters', 'Population', 'Area (km2)', 'Literacy (%)', 'Rivers', 'Doab'];
    const rows = filteredDistricts.map(d => [
      `"${d.name}"`,
      `"${d.nativeGurmukhi}"`,
      `"${d.nativeShahmukhi}"`,
      `"${d.side === 'east' ? 'East Punjab (India)' : 'West Punjab (Pakistan)'}"`,
      `"${d.division}"`,
      `"${d.headquarters}"`,
      d.population,
      d.areaKm2,
      d.literacyRate,
      `"${d.rivers.join(', ')}"`,
      `"${d.doab}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `punjab_districts_${selectedSide}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const toggleSort = (field: 'name' | 'population' | 'area' | 'literacy') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc'); // default high-to-low for numbers
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search any district, city, crop (Basmati, Cotton), landmark, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 text-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-500 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* View Mode & Export Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Cards View"
                aria-label="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Download CSV of visible districts"
            >
              {copiedCsv ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-amber-400" />}
              <span>{copiedCsv ? 'Exported!' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          {/* Side Selector */}
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Region / Side</label>
            <select
              value={selectedSide}
              onChange={(e) => onSideChange(e.target.value as any)}
              className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Punjab (64)</option>
              <option value="east">🇮🇳 East Punjab (23)</option>
              <option value="west">🇵🇰 West Punjab (41)</option>
            </select>
          </div>

          {/* Division Selector */}
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Division / Tract</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Divisions ({availableDivisions.length})</option>
              {availableDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          {/* River Selector */}
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">River Basin</label>
            <select
              value={selectedRiver}
              onChange={(e) => setSelectedRiver(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Rivers</option>
              {availableRivers.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="population-desc">Population (Highest first)</option>
              <option value="population-asc">Population (Lowest first)</option>
              <option value="area-desc">Area (Largest first)</option>
              <option value="area-asc">Area (Smallest first)</option>
              <option value="literacy-desc">Literacy (Highest first)</option>
            </select>
          </div>
        </div>

        {/* Status Count Line */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            Showing <strong className="text-white">{filteredDistricts.length}</strong> of{' '}
            <strong>{districts.length}</strong> districts
          </span>
          {(search || selectedDivision !== 'all' || selectedRiver !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedDivision('all');
                setSelectedRiver('all');
                setSelectedDoab('all');
              }}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Content: Cards View or Table View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDistricts.map((district) => {
            const isBookmarked = bookmarkedIds.has(district.id);
            return (
              <div
                key={district.id}
                onClick={() => onSelectDistrict(district)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            district.side === 'east' ? 'bg-emerald-400' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-400">
                          {district.side === 'east' ? 'East Punjab (IN)' : 'West Punjab (PK)'}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-amber-400/90 font-medium">
                          {district.division}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                        {district.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(district.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                      aria-label={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Dual Native Script Display */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800/80 mb-3">
                    <span className="font-gurmukhi text-amber-200">{district.nativeGurmukhi}</span>
                    <span className="font-shahmukhi text-amber-300" dir="rtl">{district.nativeShahmukhi}</span>
                  </div>

                  {/* Stat Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-400">Pop.</div>
                      <div className="font-semibold text-slate-200 truncate">
                        {formatNumber(district.population)}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-400">Area</div>
                      <div className="font-semibold text-slate-200">
                        {district.areaKm2} <span className="text-[9px] text-slate-400">km²</span>
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/50">
                      <div className="text-[10px] text-slate-400">Literacy</div>
                      <div className="font-semibold text-emerald-400">{district.literacyRate}%</div>
                    </div>
                  </div>

                  {/* Landmarks Tag Line */}
                  {district.keyLandmarks.length > 0 && (
                    <div className="text-xs text-slate-300 line-clamp-1 mb-2 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-1" />
                      <span className="text-amber-400 font-medium mr-1">Landmark:</span>
                      <span className="truncate">{district.keyLandmarks[0].name}</span>
                    </div>
                  )}

                  {/* Rivers / Doab */}
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    <span>Doab: {district.doab}</span>
                    {district.rivers.length > 0 && <span> • River: {district.rivers.join(', ')}</span>}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                    Explore profile →
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCompare(district);
                    }}
                    className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] flex items-center gap-1"
                  >
                    <GitCompare className="w-3 h-3 text-cyan-400" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tabular Data View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 pl-4">District</th>
                <th className="p-3.5">Scripts (ਪੰ / پن)</th>
                <th className="p-3.5">Region & Division</th>
                <th
                  onClick={() => toggleSort('population')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Population</span>
                    <ArrowUpDown className="w-3 h-3 text-amber-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('area')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Area (km²)</span>
                    <ArrowUpDown className="w-3 h-3 text-amber-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('literacy')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Literacy</span>
                    <ArrowUpDown className="w-3 h-3 text-amber-500" />
                  </div>
                </th>
                <th className="p-3.5">Rivers & Doab</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDistricts.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => onSelectDistrict(d)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 pl-4 font-semibold text-white whitespace-nowrap">
                    {d.name}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-amber-200/90">
                    <span className="font-gurmukhi">{d.nativeGurmukhi}</span> <span className="opacity-40">|</span> <span dir="rtl" className="font-shahmukhi">{d.nativeShahmukhi}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] mr-1.5 ${
                        d.side === 'east' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-900/40 text-emerald-200'
                      }`}
                    >
                      {d.side === 'east' ? 'East' : 'West'}
                    </span>
                    <span className="text-slate-400">{d.division}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-medium text-slate-200">
                    {formatNumber(d.population)}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-300">
                    {formatNumber(d.areaKm2)}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-semibold text-emerald-400">
                    {d.literacyRate}%
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-400">
                    {d.rivers.length > 0 ? d.rivers.join(', ') : 'Canals'} • {d.doab}
                  </td>
                  <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCompare(d);
                      }}
                      className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] mr-1"
                    >
                      Compare
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(d.id);
                      }}
                      className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px]"
                    >
                      {bookmarkedIds.has(d.id) ? 'Saved' : 'Bookmark'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
