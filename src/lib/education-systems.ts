import type {
  EdSystemCode,
  EdSystemDefinition,
  GradeId,
} from '@/types/education-system';

// ── Denmark: 0. kl – 9. kl + 1.g – 3.g ──

const DK: EdSystemDefinition = {
  code: 'DK',
  nameKey: 'edSystem.dk',
  grades: [
    { id: '0kl', order: 0, displayNumber: '0' },
    { id: '1kl', order: 1, displayNumber: '1' },
    { id: '2kl', order: 2, displayNumber: '2' },
    { id: '3kl', order: 3, displayNumber: '3' },
    { id: '4kl', order: 4, displayNumber: '4' },
    { id: '5kl', order: 5, displayNumber: '5' },
    { id: '6kl', order: 6, displayNumber: '6' },
    { id: '7kl', order: 7, displayNumber: '7' },
    { id: '8kl', order: 8, displayNumber: '8' },
    { id: '9kl', order: 9, displayNumber: '9' },
    { id: '1g', order: 10, displayNumber: '1.g' },
    { id: '2g', order: 11, displayNumber: '2.g' },
    { id: '3g', order: 12, displayNumber: '3.g' },
  ],
  groups: [
    { key: 'dk_indskoling', grades: ['0kl', '1kl', '2kl', '3kl'] },
    { key: 'dk_mellemtrin', grades: ['4kl', '5kl', '6kl'] },
    { key: 'dk_udskoling', grades: ['7kl', '8kl', '9kl'] },
    { key: 'dk_gymnasium', grades: ['1g', '2g', '3g'] },
  ],
  defaultForLocales: ['da'],
};

// ── Germany G9: Klasse 1–13 ──

const DE: EdSystemDefinition = {
  code: 'DE',
  nameKey: 'edSystem.de',
  grades: [
    { id: '1', order: 0, displayNumber: '1' },
    { id: '2', order: 1, displayNumber: '2' },
    { id: '3', order: 2, displayNumber: '3' },
    { id: '4', order: 3, displayNumber: '4' },
    { id: '5', order: 4, displayNumber: '5' },
    { id: '6', order: 5, displayNumber: '6' },
    { id: '7', order: 6, displayNumber: '7' },
    { id: '8', order: 7, displayNumber: '8' },
    { id: '9', order: 8, displayNumber: '9' },
    { id: '10', order: 9, displayNumber: '10' },
    { id: '11', order: 10, displayNumber: '11' },
    { id: '12', order: 11, displayNumber: '12' },
    { id: '13', order: 12, displayNumber: '13' },
  ],
  groups: [
    { key: 'de_grundschule', grades: ['1', '2', '3', '4'] },
    { key: 'de_unterstufe', grades: ['5', '6'] },
    { key: 'de_mittelstufe', grades: ['7', '8', '9', '10'] },
    { key: 'de_oberstufe', grades: ['11', '12', '13'] },
  ],
  defaultForLocales: ['de'],
};

// ── UK: Year 1–13 ──

const UK: EdSystemDefinition = {
  code: 'UK',
  nameKey: 'edSystem.uk',
  grades: [
    { id: 'Y1', order: 0, displayNumber: '1' },
    { id: 'Y2', order: 1, displayNumber: '2' },
    { id: 'Y3', order: 2, displayNumber: '3' },
    { id: 'Y4', order: 3, displayNumber: '4' },
    { id: 'Y5', order: 4, displayNumber: '5' },
    { id: 'Y6', order: 5, displayNumber: '6' },
    { id: 'Y7', order: 6, displayNumber: '7' },
    { id: 'Y8', order: 7, displayNumber: '8' },
    { id: 'Y9', order: 8, displayNumber: '9' },
    { id: 'Y10', order: 9, displayNumber: '10' },
    { id: 'Y11', order: 10, displayNumber: '11' },
    { id: 'Y12', order: 11, displayNumber: '12' },
    { id: 'Y13', order: 12, displayNumber: '13' },
  ],
  groups: [
    { key: 'uk_ks1', grades: ['Y1', 'Y2'] },
    { key: 'uk_ks2', grades: ['Y3', 'Y4', 'Y5', 'Y6'] },
    { key: 'uk_ks3', grades: ['Y7', 'Y8', 'Y9'] },
    { key: 'uk_ks4', grades: ['Y10', 'Y11'] },
    { key: 'uk_ks5', grades: ['Y12', 'Y13'] },
  ],
  defaultForLocales: ['en'],
};

// ── US: K–Grade 12 ──

const US: EdSystemDefinition = {
  code: 'US',
  nameKey: 'edSystem.us',
  grades: [
    { id: 'K', order: 0, displayNumber: 'K' },
    { id: 'G1', order: 1, displayNumber: '1' },
    { id: 'G2', order: 2, displayNumber: '2' },
    { id: 'G3', order: 3, displayNumber: '3' },
    { id: 'G4', order: 4, displayNumber: '4' },
    { id: 'G5', order: 5, displayNumber: '5' },
    { id: 'G6', order: 6, displayNumber: '6' },
    { id: 'G7', order: 7, displayNumber: '7' },
    { id: 'G8', order: 8, displayNumber: '8' },
    { id: 'G9', order: 9, displayNumber: '9' },
    { id: 'G10', order: 10, displayNumber: '10' },
    { id: 'G11', order: 11, displayNumber: '11' },
    { id: 'G12', order: 12, displayNumber: '12' },
  ],
  groups: [
    { key: 'us_elementary', grades: ['K', 'G1', 'G2', 'G3', 'G4', 'G5'] },
    { key: 'us_middle', grades: ['G6', 'G7', 'G8'] },
    { key: 'us_high', grades: ['G9', 'G10', 'G11', 'G12'] },
  ],
  defaultForLocales: [],
};

// ── Registry ──

export const ED_SYSTEMS: Record<EdSystemCode, EdSystemDefinition> = {
  DK,
  DE,
  UK,
  US,
};

export function getEdSystem(code: EdSystemCode): EdSystemDefinition {
  return ED_SYSTEMS[code];
}

export function defaultEdSystemForLocale(locale: string): EdSystemCode {
  for (const sys of Object.values(ED_SYSTEMS)) {
    if (sys.defaultForLocales.includes(locale)) return sys.code;
  }
  return 'DK';
}

export function isValidGradeId(code: EdSystemCode, id: string): boolean {
  return ED_SYSTEMS[code].grades.some((g) => g.id === id);
}

export function getGradeOrder(code: EdSystemCode, id: string): number {
  const grade = ED_SYSTEMS[code].grades.find((g) => g.id === id);
  return grade?.order ?? -1;
}

export function findClosestGrade(
  targetSystem: EdSystemCode,
  foreignGradeId: GradeId,
  sourceSystem: EdSystemCode,
): GradeId | null {
  const sourceOrder = getGradeOrder(sourceSystem, foreignGradeId);
  if (sourceOrder < 0) return null;

  const target = ED_SYSTEMS[targetSystem];
  // Find grade with same order, or closest
  const exact = target.grades.find((g) => g.order === sourceOrder);
  if (exact) return exact.id;

  // Clamp to range
  const last = target.grades[target.grades.length - 1];
  if (sourceOrder > last.order) return last.id;
  return target.grades[0].id;
}

export function getGradeDefinition(code: EdSystemCode, id: GradeId) {
  return ED_SYSTEMS[code].grades.find((g) => g.id === id);
}

// Cached per system to provide stable references for React memoization
const gradeIdsCache: Record<string, GradeId[]> = {};

export function getAllGradeIds(code: EdSystemCode): GradeId[] {
  if (!gradeIdsCache[code]) {
    gradeIdsCache[code] = ED_SYSTEMS[code].grades.map((g) => g.id);
  }
  return gradeIdsCache[code];
}
