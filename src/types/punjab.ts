export type PunjabSide = 'east' | 'west'; // 'east' = Indian Punjab, 'west' = Pakistani Punjab

export interface DistrictLandmark {
  name: string;
  type: 'monument' | 'religious' | 'nature' | 'historic' | 'modern';
  description: string;
}

export interface District {
  id: string;
  name: string;
  nativeGurmukhi: string;
  nativeShahmukhi: string;
  side: PunjabSide;
  division: string; // West: Division name; East: Sub-region (Majha, Malwa, Doaba)
  headquarters: string;
  areaKm2: number;
  population: number; // approximate census
  literacyRate: number; // percentage
  rivers: string[];
  doab: string;
  keyLandmarks: DistrictLandmark[];
  famousFor: string[];
  majorCrops: string[];
  briefHistory: string;
  // Map positioning for SVG vector map
  svgPath: string;
  center: [number, number]; // [x, y] in SVG canvas coordinate space
}

export interface River {
  id: string;
  name: string;
  punjabiGurmukhi: string;
  punjabiShahmukhi: string;
  origin: string;
  tributaryOf: string;
  lengthKm: number;
  flowsThroughDistricts: string[];
  historicImportance: string;
  pathD: string; // SVG path data
}

export interface Doab {
  id: string;
  name: string;
  meaning: string;
  boundedBy: [string, string];
  keyDistricts: string[];
  description: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'geography' | 'history' | 'rivers' | 'landmarks';
}
