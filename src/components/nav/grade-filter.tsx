import { getTranslations } from 'next-intl/server';
import type { GradeId, EdSystemCode } from '@/types/education-system';
import { gradeLabelKey } from '@/lib/grade-labels';

interface GradeFilterProps {
  grades: GradeId[];
  edSystem: EdSystemCode;
}

export async function GradeFilter({ grades, edSystem }: GradeFilterProps) {
  const t = await getTranslations('grades');

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
        {grades.map((gradeId) => {
          const labelInfo = gradeLabelKey(edSystem, gradeId);
          const label = t(
            labelInfo.key.replace('grades.', ''),
            labelInfo.params,
          );
          return (
            <a
              key={gradeId}
              href={`#grade-${gradeId}`}
              className="inline-flex items-center shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-primary-subtle text-primary hover:bg-primary/15 transition-colors"
            >
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
