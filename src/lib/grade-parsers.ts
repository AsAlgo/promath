import type { EdSystemCode, GradeId } from '@/types/education-system';

// ── Danish grade parser ──

export function parseDKGrades(text: string): GradeId[] {
  if (!text) return [];
  const normalized = text.trim().toLowerCase();

  // Gymnasium / gymnasie → 1g, 2g, 3g
  if (
    normalized.includes('gymnasium') ||
    normalized.includes('gymnasie') ||
    normalized.includes('gym')
  ) {
    const gMatch = normalized.match(/(\d)\.?\s*g/g);
    if (gMatch) {
      return gMatch
        .map((m) => {
          const n = parseInt(m, 10);
          return n >= 1 && n <= 3 ? (`${n}g` as GradeId) : null;
        })
        .filter((g): g is GradeId => g !== null);
    }
    return ['1g', '2g', '3g'];
  }

  // Range pattern: "N.-M. kl" or "N-M. kl" or "N.-M."
  const rangeMatch = normalized.match(/(\d+)\.\s*-\s*(\d+)\./);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    const grades: GradeId[] = [];
    for (let i = start; i <= end; i++) {
      if (i >= 0 && i <= 9) grades.push(`${i}kl`);
    }
    return grades;
  }

  // Single grade: "N. kl" or "N. klasse"
  const singleMatch = normalized.match(/(\d+)\.\s*(kl|klasse)/);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    if (n >= 0 && n <= 9) return [`${n}kl`];
  }

  return [];
}

// ── UK grade parser ──

export function parseUKGrades(text: string): GradeId[] {
  if (!text) return [];
  const normalized = text.trim();

  // Range: "Y3-Y4" or "Year 3-Year 4"
  const rangeMatch = normalized.match(
    /(?:Y|Year\s*)(\d+)\s*-\s*(?:Y|Year\s*)(\d+)/i,
  );
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    const grades: GradeId[] = [];
    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= 13) grades.push(`Y${i}`);
    }
    return grades;
  }

  // Single: "Y7" or "Year 7"
  const singleMatch = normalized.match(/(?:Y|Year\s*)(\d+)/i);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    if (n >= 1 && n <= 13) return [`Y${n}`];
  }

  return [];
}

// ── US grade parser ──

export function parseUSGrades(text: string): GradeId[] {
  if (!text) return [];
  const normalized = text.trim();

  // Kindergarten
  if (/\bkindergarten\b/i.test(normalized) || /\bK\b/.test(normalized)) {
    // Check for range: "K-4"
    const kRange = normalized.match(/K\s*-\s*(\d+)/);
    if (kRange) {
      const end = parseInt(kRange[1], 10);
      const grades: GradeId[] = ['K'];
      for (let i = 1; i <= end && i <= 12; i++) {
        grades.push(`G${i}`);
      }
      return grades;
    }
    return ['K'];
  }

  // Range: "3-8" or "Grade 3-8"
  const rangeMatch = normalized.match(
    /(?:Grade\s*)?(\d+)\s*-\s*(?:Grade\s*)?(\d+)/i,
  );
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    const grades: GradeId[] = [];
    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= 12) grades.push(`G${i}`);
    }
    return grades;
  }

  // Single: "Grade 5" or just "5"
  const singleMatch = normalized.match(/(?:Grade\s*)?(\d+)/i);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    if (n >= 1 && n <= 12) return [`G${n}`];
  }

  return [];
}

// ── German grade parser (placeholder until real DE data) ──

export function parseDEGrades(text: string): GradeId[] {
  if (!text) return [];
  const normalized = text.trim();

  // Range: "Klasse 5-6" or "5-6"
  const rangeMatch = normalized.match(
    /(?:Klasse\s*)?(\d+)\s*-\s*(?:Klasse\s*)?(\d+)/i,
  );
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    const grades: GradeId[] = [];
    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= 13) grades.push(`${i}`);
    }
    return grades;
  }

  // Single: "Klasse 5" or just "5"
  const singleMatch = normalized.match(/(?:Klasse\s*)?(\d+)/i);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    if (n >= 1 && n <= 13) return [`${n}`];
  }

  return [];
}

// ── Dispatcher ──

export function parseGradesForSystem(
  system: EdSystemCode,
  text: string,
): GradeId[] {
  switch (system) {
    case 'DK':
      return parseDKGrades(text);
    case 'DE':
      return parseDEGrades(text);
    case 'UK':
      return parseUKGrades(text);
    case 'US':
      return parseUSGrades(text);
  }
}
