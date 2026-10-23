import React from 'react';
import { District } from '../types/punjab';
import { formatNumber } from '../utils/punjabData';
import {
  X,
  Bookmark,
  GitCompare,
  MapPin,
  Users,
  Compass,
  GraduationCap,
  Sparkles,
  Wheat,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';

interface DistrictDetailModalProps {
  district: District | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (districtId: string) => void;
  onAddToCompare: (district: District) => void;
  onNavigateDistrict?: (direction: 'prev' | 'next') => void;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onAddToCompare,
  onNavigateDistrict,
}) => {
  if (!district) return null;

  const density = Math.round(district.population / Math.max(district.areaKm2, 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Script Typography */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  district.side === 'east'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60'
                }`}
              >
                {district.side === 'east' ? '🇮🇳 East Punjab (India)' : '🇵🇰 West Punjab (Pakistan)'}
              </span>
              <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {district.division}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white tracking-tight">{district.name}</h2>
              <span className="text-lg font-semibold text-amber-400 font-gurmukhi">
                {district.nativeGurmukhi}
              </span>
              <span className="text-lg font-semibold text-amber-300 font-shahmukhi" dir="rtl">
                {district.nativeShahmukhi}
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Headquarters: <strong className="text-slate-200">{district.headquarters}</strong></span>
              <span className="opacity-40">•</span>
              <span>Doab: <strong className="text-slate-200">{district.doab}</strong></span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(district.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onAddToCompare(district)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Compare with another district"
              aria-label="Compare with another district"
            >
              <GitCompare className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> Population
              </div>
              <div className="text-base font-bold text-white">{formatNumber(district.population)}</div>
              <div className="text-[10px] text-slate-500">Census approximate</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Area
              </div>
              <div className="text-base font-bold text-white">{formatNumber(district.areaKm2)} <span className="text-xs font-normal text-slate-400">km²</span></div>
              <div className="text-[10px] text-slate-500">{density} people/km²</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Literacy Rate
              </div>
              <div className="text-base font-bold text-emerald-400">{district.literacyRate}%</div>
              <div className="text-[10px] text-slate-500">Education metric</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Rivers
              </div>
              <div className="text-xs font-bold text-cyan-300 truncate">
                {district.rivers.length > 0 ? district.rivers.join(', ') : 'Canal irrigated'}
              </div>
              <div className="text-[10px] text-slate-500">Historic waterway</div>
            </div>
          </div>

          {/* Brief History & Cultural Context */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Landmark className="w-4 h-4" /> Historical Heritage & Evolution
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {district.briefHistory}
            </p>
          </div>

          {/* Key Landmarks */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Iconic Landmarks & Heritage Sites ({district.keyLandmarks.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {district.keyLandmarks.map((landmark, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-white">{landmark.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded capitalize ${
                        landmark.type === 'religious'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : landmark.type === 'historic'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : landmark.type === 'nature'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : landmark.type === 'monument'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {landmark.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{landmark.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agriculture & Famous Specialties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-amber-400" /> Major Agricultural Crops
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {district.majorCrops.map((crop, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-200 border border-amber-800/60"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Famous For & Traditions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {district.famousFor.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with District Navigation */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-3 border-t border-slate-800 flex items-center justify-between gap-2">
          {onNavigateDistrict ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateDistrict('prev')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => onNavigateDistrict('next')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => onAddToCompare(district)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare This District
          </button>
        </div>
      </div>
    </div>
  );
};
