import React from 'react';
import { Map, Layers, Compass, HelpCircle, GitCompare, Bookmark, ExternalLink } from 'lucide-react';
import { PunjabSide } from '../types/punjab';

interface HeaderProps {
  activeTab: 'map' | 'directory' | 'doabs' | 'quiz';
  onTabChange: (tab: 'map' | 'directory' | 'doabs' | 'quiz') => void;
  selectedSide: 'all' | PunjabSide;
  onSideChange: (side: 'all' | PunjabSide) => void;
  savedBookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenComparator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedSide,
  onSideChange,
  savedBookmarkCount,
  onOpenBookmarks,
  onOpenComparator,
}) => {
  return (
    <header className="bg-amber-950 text-amber-50 border-b border-amber-900 shadow-md sticky top-0 z-40">
      {/* Top Banner with Multilingual Script & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-inner font-bold text-xl border border-amber-400/40 font-gurmukhi">
            ਪੰ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                Punjab Maps Explorer
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-800 text-amber-200 border border-amber-700 font-gurmukhi">
                  Panj-Aab (ਪੰਜ ਆਬ)
                </span>
              </h1>
            </div>
            <p className="text-xs text-amber-300/80 flex items-center gap-2">
              <span className="font-gurmukhi">ਪੰਜਾਬ ਨਕਸ਼ਾ</span>
              <span className="opacity-40">•</span>
              <span dir="rtl" className="font-medium font-shahmukhi">نقشہ پنجاب</span>
              <span className="opacity-40">•</span>
              <span>All 64 Districts & 5 Historic Rivers</span>
            </p>
          </div>
        </div>

        {/* Region Scope Pill Selector */}
        <div className="flex items-center bg-amber-900/80 p-1 rounded-xl border border-amber-800 shadow-inner">
          <button
            onClick={() => onSideChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSide === 'all'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-amber-200 hover:text-white hover:bg-amber-800/60'
            }`}
          >
            All Punjab (64)
          </button>
          <button
            onClick={() => onSideChange('east')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSide === 'east'
                ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                : 'text-amber-200 hover:text-white hover:bg-amber-800/60'
            }`}
            title="East Punjab (India) - 23 Districts"
          >
            🇮🇳 East Punjab (23)
          </button>
          <button
            onClick={() => onSideChange('west')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSide === 'west'
                ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                : 'text-amber-200 hover:text-white hover:bg-amber-800/60'
            }`}
            title="West Punjab (Pakistan) - 41 Districts"
          >
            🇵🇰 West Punjab (41)
          </button>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenComparator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-800 transition-colors"
            title="Compare two Punjab districts"
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white border border-amber-800 transition-colors"
            title="Saved bookmarks"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bookmarks</span>
            {savedBookmarkCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-amber-950 text-[10px] font-bold">
                {savedBookmarkCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-amber-900/40 border-t border-amber-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2" aria-label="Tabs">
            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'map'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-200 hover:bg-amber-800/50 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Interactive Vector Map
            </button>
            <button
              onClick={() => onTabChange('directory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'directory'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-200 hover:bg-amber-800/50 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Districts Directory & Filter
            </button>
            <button
              onClick={() => onTabChange('doabs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'doabs'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-200 hover:bg-amber-800/50 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              5 Rivers & Historic Doabs
            </button>
            <button
              onClick={() => onTabChange('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-200 hover:bg-amber-800/50 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Punjab Geography Quiz
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
