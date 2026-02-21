export type EdSystemCode = 'DK' | 'DE' | 'UK' | 'US';
export type GradeId = string; // '0kl', '1g', 'Y7', 'K', etc.

export interface GradeDefinition {
  id: GradeId; // URL-safe slug
  order: number; // Sort index (0-based)
  displayNumber: string; // Shown in circles/badges: '0', '1g', 'K'
}

export interface GradeGroupDefinition {
  key: string; // Translation key: 'dk_indskoling', 'de_grundschule'
  grades: GradeId[];
}

export interface EdSystemDefinition {
  code: EdSystemCode;
  nameKey: string;
  grades: GradeDefinition[];
  groups: GradeGroupDefinition[];
  defaultForLocales: string[];
}
