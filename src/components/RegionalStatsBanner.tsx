import React from 'react';
import { District, PunjabSide } from '../types/punjab';
import { getRegionalStatistics, formatNumber } from '../utils/punjabData';
import { MapPin, Users, Compass, GraduationCap, Waves } from 'lucide-react';

interface RegionalStatsBannerProps {
  districts: District[];
  selectedSide: 'all' | PunjabSide;
  onSideChange: (side: 'all' | PunjabSide) => void;
}

export const RegionalStatsBanner: React.FC<RegionalStatsBannerProps> = ({
  districts,
  selectedSide,
  onSideChange,
}) => {
  const stats = getRegionalStatistics(districts);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* District Count */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Present Districts</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {selectedSide === 'all' ? '64' : selectedSide === 'east' ? '23' : '41'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {selectedSide === 'all'
              ? '23 East (IN) + 41 West (PK)'
              : selectedSide === 'east'
              ? 'All 23 Indian Punjab'
              : 'All 41 Pakistani Punjab'}
          </div>
        </div>

        {/* Combined Population */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Total Population</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {formatNumber(stats.totalPopulation)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Census aggregate
          </div>
        </div>

        {/* Total Geographic Area */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geographic Area</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            {formatNumber(stats.totalAreaKm2)} <span className="text-xs font-normal text-slate-400">km²</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Plains & Shivalik foothills
          </div>
        </div>

        {/* Average Literacy */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Avg. Literacy Rate</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-400">
            {stats.averageLiteracy}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Cross-district average
          </div>
        </div>

        {/* Historic Rivers */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Panj-Aab Hydrology</span>
          </div>
          <div className="text-xl font-extrabold text-cyan-300">
            5 Rivers
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Sutlej, Beas, Ravi, Chenab, Jhelum
          </div>
        </div>
      </div>
    </div>
  );
};
