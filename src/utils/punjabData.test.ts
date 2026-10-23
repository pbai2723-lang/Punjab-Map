import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllDistricts,
  getDistrictsBySide,
  getDistrictById,
  filterDistricts,
  getRegionalStatistics,
  compareTwoDistricts
} from './punjabData';
import { RIVERS_DATA, DOABS_DATA, QUIZ_QUESTIONS } from '../data/punjabDistricts';

test('Punjab dataset contains all 64 districts (23 East and 41 West)', () => {
  const all = getAllDistricts();
  assert.equal(all.length, 64, 'Total districts must equal 64');

  const east = getDistrictsBySide('east');
  assert.equal(east.length, 23, 'East Punjab (India) must have 23 districts');

  const west = getDistrictsBySide('west');
  assert.equal(west.length, 41, 'West Punjab (Pakistan) must have 41 districts');
});

test('Punjab dataset contains all 5 rivers plus Indus and 5 historic Doabs', () => {
  assert.equal(RIVERS_DATA.length >= 5, true, 'Must contain at least 5 historic rivers');
  const riverNames = RIVERS_DATA.map(r => r.name);
  assert.equal(riverNames.some(n => n.includes('Sutlej')), true);
  assert.equal(riverNames.some(n => n.includes('Beas')), true);
  assert.equal(riverNames.some(n => n.includes('Ravi')), true);
  assert.equal(riverNames.some(n => n.includes('Chenab')), true);
  assert.equal(riverNames.some(n => n.includes('Jhelum')), true);

  assert.equal(DOABS_DATA.length, 5, 'Must have 5 historic Doabs');
});

test('District retrieval by ID works properly', () => {
  const amritsar = getDistrictById('amritsar');
  assert.ok(amritsar, 'Amritsar district must exist');
  assert.equal(amritsar.side, 'east');
  assert.equal(amritsar.headquarters, 'Amritsar');
  assert.equal(amritsar.nativeGurmukhi, 'ਅੰਮ੍ਰਿਤਸਰ');

  const lahore = getDistrictById('lahore');
  assert.ok(lahore, 'Lahore district must exist');
  assert.equal(lahore.side, 'west');
  assert.equal(lahore.headquarters, 'Lahore');
  assert.equal(lahore.nativeShahmukhi, 'لاہور');
});

test('Search functionality supports English, Gurmukhi, and Shahmukhi queries', () => {
  // English search
  const resEng = filterDistricts({ search: 'Ludhiana' });
  assert.equal(resEng.length, 1);
  assert.equal(resEng[0].id, 'ludhiana');

  // Gurmukhi search
  const resGur = filterDistricts({ search: 'ਅੰਮ੍ਰਿਤਸਰ' });
  assert.equal(resGur.length >= 1, true);
  assert.equal(resGur[0].id, 'amritsar');

  // Shahmukhi search
  const resShah = filterDistricts({ search: 'لاہور' });
  assert.equal(resShah.length >= 1, true);
  assert.equal(resShah[0].id, 'lahore');

  // Landmark search
  const resLandmark = filterDistricts({ search: 'Golden Temple' });
  assert.equal(resLandmark.length >= 1, true);
  assert.equal(resLandmark[0].id, 'amritsar');

  const resHarappa = filterDistricts({ search: 'Harappa' });
  assert.equal(resHarappa.length >= 1, true);
  assert.equal(resHarappa.some(d => d.id === 'sahiwal'), true);
});

test('Regional statistics calculation gives accurate summaries', () => {
  const stats = getRegionalStatistics();
  assert.equal(stats.count, 64);
  assert.equal(stats.eastCount, 23);
  assert.equal(stats.westCount, 41);
  assert.ok(stats.totalPopulation > 100000000, 'Total combined Punjab population should exceed 100M');
  assert.ok(stats.averageLiteracy > 50 && stats.averageLiteracy < 100, 'Average literacy should be a realistic percentage');
});

test('Comparison tool accurately compares two districts', () => {
  const comp = compareTwoDistricts('amritsar', 'lahore');
  assert.ok(comp);
  assert.equal(comp.a.id, 'amritsar');
  assert.equal(comp.b.id, 'lahore');
  assert.ok(comp.populationDiff < 0, 'Amritsar population should be less than mega-city Lahore');
});

test('Quiz dataset includes valid questions with valid correct indexes', () => {
  assert.ok(QUIZ_QUESTIONS.length >= 5);
  for (const q of QUIZ_QUESTIONS) {
    assert.ok(q.question.length > 10);
    assert.ok(q.options.length >= 3);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
    assert.ok(q.explanation.length > 5);
  }
});
