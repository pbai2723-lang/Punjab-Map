import React, { useState } from 'react';
import { District } from '../types/punjab';
import { DISTRICTS_DATA } from '../data/punjabDistricts';
import { formatNumber } from '../utils/punjabData';
import { X, GitCompare, Users, Compass, GraduationCap, MapPin, Sparkles, Wheat } from 'lucide-react';

interface DistrictComparatorProps {
  initialDistrictA?: District | null;
  initialDistrictB?: District | null;
  onClose: () => void;
  onSelectDistrict: (district: District) => void;
}

export const DistrictComparator: React.FC<DistrictComparatorProps> = ({
  initialDistrictA,
  initialDistrictB,
  onClose,
  onSelectDistrict,
}) => {
  const [districtAId, setDistrictAId] = useState<string>(
    initialDistrictA?.id || 'amritsar'
  );
  const [districtBId, setDistrictBId] = useState<string>(
    initialDistrictB?.id || 'lahore'
  );

  const districtA = DISTRICTS_DATA.find(d => d.id === districtAId) || DISTRICTS_DATA[0];
  const districtB = DISTRICTS_DATA.find(d => d.id === districtBId) || DISTRICTS_DATA[23];

  const densityA = Math.round(districtA.population / Math.max(districtA.areaKm2, 1));
  const densityB = Math.round(districtB.population / Math.max(districtB.areaKm2, 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Compare Punjab Districts</h2>
              <p className="text-xs text-slate-400">Side-by-side geographic & cultural comparison</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            aria-label="Close comparator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">District 1</label>
              <select
                value={districtAId}
                onChange={(e) => setDistrictAId(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-amber-500"
              >
                {DISTRICTS_DATA.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.side === 'east' ? '🇮🇳 East' : '🇵🇰 West'}) - {d.division}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">District 2</label>
              <select
                value={districtBId}
                onChange={(e) => setDistrictBId(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-amber-500"
              >
                {DISTRICTS_DATA.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.side === 'east' ? '🇮🇳 East' : '🇵🇰 West'}) - {d.division}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Titles & Scripts */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                  districtA.side === 'east' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-900/40 text-emerald-200'
                }`}
              >
                {districtA.side === 'east' ? '🇮🇳 East Punjab' : '🇵🇰 West Punjab'}
              </span>
              <h3 className="text-xl font-bold text-white">{districtA.name}</h3>
              <div className="text-xs text-amber-300 mt-0.5 flex items-center justify-center gap-1.5">
                <span className="font-gurmukhi">{districtA.nativeGurmukhi}</span>
                <span className="opacity-40">•</span>
                <span className="font-shahmukhi" dir="rtl">{districtA.nativeShahmukhi}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                  districtB.side === 'east' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-900/40 text-emerald-200'
                }`}
              >
                {districtB.side === 'east' ? '🇮🇳 East Punjab' : '🇵🇰 West Punjab'}
              </span>
              <h3 className="text-xl font-bold text-white">{districtB.name}</h3>
              <div className="text-xs text-amber-300 mt-0.5 flex items-center justify-center gap-1.5">
                <span className="font-gurmukhi">{districtB.nativeGurmukhi}</span>
                <span className="opacity-40">•</span>
                <span className="font-shahmukhi" dir="rtl">{districtB.nativeShahmukhi}</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
            {/* Population */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-semibold text-sm text-slate-200">
                {formatNumber(districtA.population)}
              </div>
              <div className="text-center text-slate-400 font-medium">Population</div>
              <div className="text-right font-semibold text-sm text-slate-200">
                {formatNumber(districtB.population)}
              </div>
            </div>

            {/* Area */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-semibold text-sm text-slate-200">
                {formatNumber(districtA.areaKm2)} km²
              </div>
              <div className="text-center text-slate-400 font-medium">Area</div>
              <div className="text-right font-semibold text-sm text-slate-200">
                {formatNumber(districtB.areaKm2)} km²
              </div>
            </div>

            {/* Density */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-semibold text-sm text-slate-200">
                {densityA} / km²
              </div>
              <div className="text-center text-slate-400 font-medium">Density</div>
              <div className="text-right font-semibold text-sm text-slate-200">
                {densityB} / km²
              </div>
            </div>

            {/* Literacy */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-semibold text-sm text-emerald-400">
                {districtA.literacyRate}%
              </div>
              <div className="text-center text-slate-400 font-medium">Literacy Rate</div>
              <div className="text-right font-semibold text-sm text-emerald-400">
                {districtB.literacyRate}%
              </div>
            </div>

            {/* Division */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-medium text-slate-300">{districtA.division}</div>
              <div className="text-center text-slate-400 font-medium">Division / Region</div>
              <div className="text-right font-medium text-slate-300">{districtB.division}</div>
            </div>

            {/* Headquarters */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-medium text-slate-300">{districtA.headquarters}</div>
              <div className="text-center text-slate-400 font-medium">Headquarters</div>
              <div className="text-right font-medium text-slate-300">{districtB.headquarters}</div>
            </div>

            {/* Rivers */}
            <div className="p-3.5 border-b border-slate-800/80 grid grid-cols-3 items-center">
              <div className="font-medium text-cyan-300">
                {districtA.rivers.length > 0 ? districtA.rivers.join(', ') : 'Canals'}
              </div>
              <div className="text-center text-slate-400 font-medium">Rivers</div>
              <div className="text-right font-medium text-cyan-300">
                {districtB.rivers.length > 0 ? districtB.rivers.join(', ') : 'Canals'}
              </div>
            </div>

            {/* Doab */}
            <div className="p-3.5 grid grid-cols-3 items-center">
              <div className="font-medium text-amber-300">{districtA.doab}</div>
              <div className="text-center text-slate-400 font-medium">Historic Doab</div>
              <div className="text-right font-medium text-amber-300">{districtB.doab}</div>
            </div>
          </div>

          {/* Landmarks Comparison */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div className="text-amber-400 font-semibold mb-2">Iconic Landmarks in {districtA.name}</div>
              <ul className="space-y-1 text-slate-300">
                {districtA.keyLandmarks.map((l, i) => (
                  <li key={i}>• {l.name}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div className="text-amber-400 font-semibold mb-2">Iconic Landmarks in {districtB.name}</div>
              <ul className="space-y-1 text-slate-300">
                {districtB.keyLandmarks.map((l, i) => (
                  <li key={i}>• {l.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
