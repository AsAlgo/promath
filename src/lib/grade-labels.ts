import type { EdSystemCode, GradeId } from '@/types/education-system';
import { getGradeDefinition } from './education-systems';

interface GradeLabelInfo {
  key: string;
  params: Record<string, string>;
}

export function gradeLabelKey(
  system: EdSystemCode,
  gradeId: GradeId,
): GradeLabelInfo {
  const def = getGradeDefinition(system, gradeId);
  const n = def?.displayNumber ?? gradeId;

  switch (system) {
    case 'DK':
      if (gradeId.endsWith('g')) {
        return { key: 'grades.label_DK_gym', params: { n } };
      }
      return { key: 'grades.label_DK', params: { n } };
    case 'DE':
      return { key: 'grades.label_DE', params: { n } };
    case 'UK':
      return { key: 'grades.label_UK', params: { n } };
    case 'US':
      if (gradeId === 'K') {
        return { key: 'grades.label_US_K', params: {} };
      }
      return { key: 'grades.label_US', params: { n } };
  }
}

export function gradeLabelShortKey(
  system: EdSystemCode,
  gradeId: GradeId,
): GradeLabelInfo {
  const def = getGradeDefinition(system, gradeId);
  const n = def?.displayNumber ?? gradeId;

  switch (system) {
    case 'DK':
      if (gradeId.endsWith('g')) {
        return { key: 'grades.label_short_DK_gym', params: { n } };
      }
      return { key: 'grades.label_short_DK', params: { n } };
    case 'DE':
      return { key: 'grades.label_short_DE', params: { n } };
    case 'UK':
      return { key: 'grades.label_short_UK', params: { n } };
    case 'US':
      if (gradeId === 'K') {
        return { key: 'grades.label_short_US_K', params: {} };
      }
      return { key: 'grades.label_short_US', params: { n } };
  }
}
