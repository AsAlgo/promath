import type { GradeId } from './education-system';

// ── Country data (stored, not displayed in UI yet) ──
export interface CountryGradeInfo {
  grades: string;
  notes?: string;
}

export type CountryCode = 'DK' | 'DE' | 'US' | 'UK';

// ── 3-layer model ──
export interface Category {
  id: string;
  name: string;
  symbol: string;
  description: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  grades: GradeId[];
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  topicId: string;
  categoryId: string;
  countries: Partial<Record<CountryCode, CountryGradeInfo>>;
}
