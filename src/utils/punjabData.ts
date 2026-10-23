import { DISTRICTS_DATA, DOABS_DATA, RIVERS_DATA } from '../data/punjabDistricts';
import { District, PunjabSide } from '../types/punjab';

export interface FilterOptions {
  side?: 'all' | PunjabSide;
  division?: string;
  search?: string;
  doab?: string;
  river?: string;
  sortBy?: 'name' | 'population' | 'area' | 'literacy';
  sortOrder?: 'asc' | 'desc';
}

export function getAllDistricts(): District[] {
  return DISTRICTS_DATA;
}

export function getDistrictsBySide(side: 'all' | PunjabSide): District[] {
  if (side === 'all') return DISTRICTS_DATA;
  return DISTRICTS_DATA.filter(d => d.side === side);
}

export function getDistrictById(id: string): District | undefined {
  return DISTRICTS_DATA.find(d => d.id === id);
}

export function filterDistricts(options: FilterOptions): District[] {
  const {
    side = 'all',
    division = '',
    search = '',
    doab = '',
    river = '',
    sortBy = 'name',
    sortOrder = 'asc',
  } = options;

  let results = [...DISTRICTS_DATA];

  // Filter by side
  if (side !== 'all') {
    results = results.filter(d => d.side === side);
  }

  // Filter by division / subregion
  if (division && division !== 'all') {
    results = results.filter(d => d.division.toLowerCase() === division.toLowerCase());
  }

  // Filter by Doab
  if (doab && doab !== 'all') {
    results = results.filter(d => d.doab.toLowerCase().includes(doab.toLowerCase()));
  }

  // Filter by River
  if (river && river !== 'all') {
    results = results.filter(d =>
      d.rivers.some(r => r.toLowerCase().includes(river.toLowerCase()))
    );
  }

  // Search query: searches name, native scripts, HQ, landmarks, famousFor, crops
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(d => {
      const matchName = d.name.toLowerCase().includes(q);
      const matchGurmukhi = d.nativeGurmukhi.toLowerCase().includes(q);
      const matchShahmukhi = d.nativeShahmukhi.toLowerCase().includes(q);
      const matchHQ = d.headquarters.toLowerCase().includes(q);
      const matchLandmarks = d.keyLandmarks.some(l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
      const matchFamous = d.famousFor.some(f => f.toLowerCase().includes(q));
      const matchCrops = d.majorCrops.some(c => c.toLowerCase().includes(q));
      return matchName || matchGurmukhi || matchShahmukhi || matchHQ || matchLandmarks || matchFamous || matchCrops;
    });
  }

  // Sort
  results.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortBy === 'population') {
      cmp = a.population - b.population;
    } else if (sortBy === 'area') {
      cmp = a.areaKm2 - b.areaKm2;
    } else if (sortBy === 'literacy') {
      cmp = a.literacyRate - b.literacyRate;
    }
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  return results;
}

export function getRegionalStatistics(districts: District[] = DISTRICTS_DATA) {
  const count = districts.length;
  const eastCount = districts.filter(d => d.side === 'east').length;
  const westCount = districts.filter(d => d.side === 'west').length;
  const totalPopulation = districts.reduce((acc, d) => acc + d.population, 0);
  const totalAreaKm2 = districts.reduce((acc, d) => acc + d.areaKm2, 0);
  const averageLiteracy = count > 0
    ? Number((districts.reduce((acc, d) => acc + d.literacyRate, 0) / count).toFixed(1))
    : 0;

  return {
    count,
    eastCount,
    westCount,
    totalPopulation,
    totalAreaKm2,
    averageLiteracy,
  };
}

export function getAllDivisions(side?: 'all' | PunjabSide): string[] {
  const list = side && side !== 'all' ? DISTRICTS_DATA.filter(d => d.side === side) : DISTRICTS_DATA;
  const divisions = new Set<string>();
  list.forEach(d => divisions.add(d.division));
  return Array.from(divisions).sort();
}

export function getAllRiversList(): string[] {
  return RIVERS_DATA.map(r => r.name.split(' ')[0]);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function compareTwoDistricts(idA: string, idB: string) {
  const a = getDistrictById(idA);
  const b = getDistrictById(idB);
  if (!a || !b) return null;

  return {
    a,
    b,
    populationDiff: a.population - b.population,
    areaDiff: a.areaKm2 - b.areaKm2,
    literacyDiff: Number((a.literacyRate - b.literacyRate).toFixed(1)),
  };
}
