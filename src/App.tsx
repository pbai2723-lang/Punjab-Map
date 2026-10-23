import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MapCanvas } from './components/MapCanvas';
import { DistrictsDirectory } from './components/DistrictsDirectory';
import { DoabsExplorer } from './components/DoabsExplorer';
import { PunjabQuiz } from './components/PunjabQuiz';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { DistrictComparator } from './components/DistrictComparator';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { RegionalStatsBanner } from './components/RegionalStatsBanner';
import { DISTRICTS_DATA } from './data/punjabDistricts';
import { District, PunjabSide } from './types/punjab';
import { getDistrictsBySide } from './utils/punjabData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'directory' | 'doabs' | 'quiz'>('map');
  const [selectedSide, setSelectedSide] = useState<'all' | PunjabSide>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Bookmarking with local storage persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('punjab_bookmarked_districts');
      return saved ? new Set(JSON.parse(saved)) : new Set(['amritsar', 'lahore']);
    } catch {
      return new Set(['amritsar', 'lahore']);
    }
  });

  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [compareDistrictA, setCompareDistrictA] = useState<District | null>(null);
  const [compareDistrictB, setCompareDistrictB] = useState<District | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('punjab_bookmarked_districts', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [bookmarkedIds]);

  // Handle URL query parameters (e.g. ?district=amritsar, ?tab=quiz)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'directory' || tabParam === 'map' || tabParam === 'doabs' || tabParam === 'quiz') {
      setActiveTab(tabParam);
    }
    const districtParam = params.get('district');
    if (districtParam) {
      const match = DISTRICTS_DATA.find(d => d.id.toLowerCase() === districtParam.toLowerCase());
      if (match) setSelectedDistrict(match);
    }
    const sideParam = params.get('side');
    if (sideParam === 'east' || sideParam === 'west' || sideParam === 'all') {
      setSelectedSide(sideParam);
    }
  }, []);

  // Filtered districts according to side
  const activeDistricts = useMemo(() => {
    return getDistrictsBySide(selectedSide);
  }, [selectedSide]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenComparatorWithDistrict = (district: District) => {
    setCompareDistrictA(district);
    const oppositeSide = district.side === 'east' ? 'west' : 'east';
    const suggested = DISTRICTS_DATA.find(d => d.side === oppositeSide && d.id !== district.id);
    setCompareDistrictB(suggested || DISTRICTS_DATA[0]);
    setIsComparatorOpen(true);
  };

  // Keyboard support for navigating district modal
  const handleNavigateDistrict = (direction: 'prev' | 'next') => {
    if (!selectedDistrict) return;
    const currentList = activeDistricts;
    const currentIndex = currentList.findIndex(d => d.id === selectedDistrict.id);
    if (currentIndex === -1) return;

    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % currentList.length;
      setSelectedDistrict(currentList[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
      setSelectedDistrict(currentList[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
        savedBookmarkCount={bookmarkedIds.size}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenComparator={() => {
          setCompareDistrictA(DISTRICTS_DATA.find(d => d.id === 'amritsar') || null);
          setCompareDistrictB(DISTRICTS_DATA.find(d => d.id === 'lahore') || null);
          setIsComparatorOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Regional Stats Banner */}
        <RegionalStatsBanner
          districts={activeDistricts}
          selectedSide={selectedSide}
          onSideChange={setSelectedSide}
        />

        {/* Tab Views */}
        {activeTab === 'map' && (
          <div className="h-[750px] w-full">
            <MapCanvas
              districts={DISTRICTS_DATA}
              selectedSide={selectedSide}
              onSelectDistrict={setSelectedDistrict}
              selectedDistrict={selectedDistrict}
            />
          </div>
        )}

        {activeTab === 'directory' && (
          <DistrictsDirectory
            districts={DISTRICTS_DATA}
            selectedSide={selectedSide}
            onSideChange={setSelectedSide}
            onSelectDistrict={setSelectedDistrict}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onAddToCompare={handleOpenComparatorWithDistrict}
          />
        )}

        {activeTab === 'doabs' && (
          <DoabsExplorer
            onSelectDistrict={setSelectedDistrict}
          />
        )}

        {activeTab === 'quiz' && (
          <PunjabQuiz />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-400 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Punjab Maps Explorer</span>
            <span className="opacity-40">•</span>
            <span>Land of Five Rivers (Panj-Aab)</span>
          </div>
          <div className="text-center sm:text-right text-slate-400">
            <span>23 Districts in East Punjab (India)</span>
            <span className="mx-2 opacity-40">•</span>
            <span>41 Districts in West Punjab (Pakistan)</span>
            <span className="mx-2 opacity-40">•</span>
            <span className="text-amber-400/90 font-medium">64 Total Districts</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedDistrict && (
        <DistrictDetailModal
          district={selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
          isBookmarked={bookmarkedIds.has(selectedDistrict.id)}
          onToggleBookmark={toggleBookmark}
          onAddToCompare={handleOpenComparatorWithDistrict}
          onNavigateDistrict={handleNavigateDistrict}
        />
      )}

      {/* District Comparator Modal */}
      {isComparatorOpen && (
        <DistrictComparator
          initialDistrictA={compareDistrictA}
          initialDistrictB={compareDistrictB}
          onClose={() => setIsComparatorOpen(false)}
          onSelectDistrict={setSelectedDistrict}
        />
      )}

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        bookmarkedIds={bookmarkedIds}
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectDistrict={setSelectedDistrict}
        onRemoveBookmark={toggleBookmark}
        onClearAll={() => setBookmarkedIds(new Set())}
      />
    </div>
  );
}
