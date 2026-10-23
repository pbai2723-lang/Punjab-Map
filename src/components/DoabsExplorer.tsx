import React, { useState } from 'react';
import { DOABS_DATA, RIVERS_DATA, DISTRICTS_DATA } from '../data/punjabDistricts';
import { District, Doab, River } from '../types/punjab';
import { Compass, Waves, MapPin, Sparkles, BookOpen, Layers } from 'lucide-react';

interface DoabsExplorerProps {
  onSelectDistrict: (district: District) => void;
}

export const DoabsExplorer: React.FC<DoabsExplorerProps> = ({ onSelectDistrict }) => {
  const [activeDoabId, setActiveDoabId] = useState<string>('bari');
  const [activeRiverId, setActiveRiverId] = useState<string>('ravi');

  const selectedDoab = DOABS_DATA.find(d => d.id === activeDoabId) || DOABS_DATA[0];
  const selectedRiver = RIVERS_DATA.find(r => r.id === activeRiverId) || RIVERS_DATA[0];

  return (
    <div className="space-y-8">
      {/* Intro Hero Section on the Meaning of "Panj-Aab" */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-900/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Waves className="w-3.5 h-3.5" />
            <span>
              Etymology of Punjab: Panj (<span className="font-gurmukhi">ਪੰਜ</span> / <span className="font-shahmukhi" dir="rtl">پنج</span> = Five) + Aab (<span className="font-gurmukhi">ਆਬ</span> / <span className="font-shahmukhi" dir="rtl">آب</span> = Waters)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Land of Five Rivers & Historic Doabs
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Historic Punjab derives its identity from the fertile alluvial tracts created by the five Himalayan tributaries of the Indus:
            the <strong className="text-amber-300">Sutlej</strong>, <strong className="text-amber-300">Beas</strong>,{' '}
            <strong className="text-amber-300">Ravi</strong>, <strong className="text-amber-300">Chenab</strong>, and{' '}
            <strong className="text-amber-300">Jhelum</strong>.
            The land between each pair of rivers is called a <strong className="text-emerald-400">Doab</strong> (Do = Two, Aab = Water).
          </p>
        </div>
      </div>

      {/* Part 1: Interactive Doabs Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              The Five Historic Doabs of Punjab
            </h3>
            <p className="text-xs text-slate-400">
              Coined largely during Mughal Emperor Akbar’s administrative reorganisation using the first syllables of each bounding river.
            </p>
          </div>
        </div>

        {/* Doab Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {DOABS_DATA.map((doab) => {
            const isSelected = doab.id === activeDoabId;
            return (
              <button
                key={doab.id}
                onClick={() => setActiveDoabId(doab.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-600/20 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: doab.color }}
                />
                <div className="text-xs font-bold text-white truncate">{doab.name.split(' (')[0]}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {doab.boundedBy.join(' & ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Doab Detail Feature Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedDoab.color }}
                />
                <h4 className="text-xl font-bold text-white">{selectedDoab.name}</h4>
              </div>
              <p className="text-xs text-amber-400 mt-1 font-medium">{selectedDoab.meaning}</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Bounded by:</span>
              <strong className="text-cyan-300">{selectedDoab.boundedBy[0]}</strong>
              <span className="text-slate-600">and</span>
              <strong className="text-cyan-300">{selectedDoab.boundedBy[1]}</strong>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedDoab.description}
          </p>

          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Key Districts Inside this Doab (Click to inspect)
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedDoab.keyDistricts.map((name) => {
                const districtObj = DISTRICTS_DATA.find(d => d.name.toLowerCase() === name.toLowerCase());
                return (
                  <button
                    key={name}
                    onClick={() => {
                      if (districtObj) onSelectDistrict(districtObj);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 hover:border-amber-500/50 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{name}</span>
                    {districtObj && (
                      <span className="text-[10px] text-slate-400">
                        ({districtObj.side === 'east' ? 'East' : 'West'})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: The Rivers of Punjab */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            The Mighty Himalayan Rivers of Punjab
          </h3>
          <p className="text-xs text-slate-400">
            Click any river to explore its source, length, mythological and folklore heritage.
          </p>
        </div>

        {/* Rivers Tab Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {RIVERS_DATA.map((river) => {
            const isSelected = river.id === activeRiverId;
            return (
              <button
                key={river.id}
                onClick={() => setActiveRiverId(river.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {river.name}
              </button>
            );
          })}
        </div>

        {/* Selected River Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h4 className="text-xl font-bold text-white">{selectedRiver.name}</h4>
              <span className="text-base text-cyan-400 font-gurmukhi">{selectedRiver.punjabiGurmukhi}</span>
              <span className="text-base text-cyan-300 font-shahmukhi" dir="rtl">{selectedRiver.punjabiShahmukhi}</span>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              Length: {selectedRiver.lengthKm} km
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Glacial Origin:</span>
              <span className="font-semibold text-white">{selectedRiver.origin}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Confluence / Drainage:</span>
              <span className="font-semibold text-white">{selectedRiver.tributaryOf}</span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Historic, Folklore & Cultural Significance
            </h5>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedRiver.historicImportance}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-400 mb-2">
              Key Punjab Districts along this River:
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {selectedRiver.flowsThroughDistricts.map((districtName) => (
                <span
                  key={districtName}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {districtName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
