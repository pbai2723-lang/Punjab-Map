import React from 'react';
import { District } from '../types/punjab';
import { DISTRICTS_DATA } from '../data/punjabDistricts';
import { formatNumber } from '../utils/punjabData';
import { X, Bookmark, Trash2, MapPin, ArrowRight } from 'lucide-react';

interface BookmarksDrawerProps {
  bookmarkedIds: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict: (district: District) => void;
  onRemoveBookmark: (districtId: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  bookmarkedIds,
  isOpen,
  onClose,
  onSelectDistrict,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const bookmarkedDistricts = DISTRICTS_DATA.filter(d => bookmarkedIds.has(d.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col justify-between text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <h3 className="text-lg font-bold text-white">Saved Districts</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
              {bookmarkedDistricts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            aria-label="Close bookmarks"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {bookmarkedDistricts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bookmark className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-1" />
              <p className="text-sm font-medium text-slate-300">No districts saved yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any district card or map inspector to save it for quick reference.
              </p>
            </div>
          ) : (
            bookmarkedDistricts.map((district) => (
              <div
                key={district.id}
                onClick={() => {
                  onSelectDistrict(district);
                  onClose();
                }}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/40 group flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-medium ${
                        district.side === 'east' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-900/40 text-emerald-200'
                      }`}
                    >
                      {district.side === 'east' ? 'East (India)' : 'West (Pakistan)'}
                    </span>
                    <span className="text-xs text-slate-400">{district.division}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {district.name}
                  </h4>
                  <div className="text-xs text-amber-300/80 font-serif">
                    {district.nativeGurmukhi} • {district.nativeShahmukhi}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                    <span>Pop: {formatNumber(district.population)}</span>
                    <span>•</span>
                    <span>Area: {district.areaKm2} km²</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(district.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-red-400"
                    title="Remove bookmark"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedDistricts.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950">
            <button
              onClick={onClearAll}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all bookmarks
            </button>
            <span className="text-xs text-slate-400">{bookmarkedDistricts.length} saved</span>
          </div>
        )}
      </div>
    </div>
  );
};
