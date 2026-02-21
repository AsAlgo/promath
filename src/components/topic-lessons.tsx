'use client';

import { Link } from '@/i18n/routing';
import { useGrade } from '@/components/grade-provider';
import { useTranslations } from 'next-intl';
import type { GradeId } from '@/types/education-system';

export interface LessonItem {
  id: string;
  name: string;
  gradeIds: GradeId[];
  gradeRange: string | null;
}

interface TopicLessonsProps {
  lessons: LessonItem[];
}

export function TopicLessons({ lessons }: TopicLessonsProps) {
  const { grades } = useGrade();
  const t = useTranslations('topic');

  const filtered =
    grades.length > 0
      ? lessons.filter((l) => l.gradeIds.some((g) => grades.includes(g)))
      : lessons;

  if (filtered.length === 0 && grades.length > 0) {
    return (
      <p className="text-muted text-sm py-8 text-center">
        {t('noLessonsForGrade')}
      </p>
    );
  }

  return (
    <ul className="max-w-2xl divide-y divide-border/40">
      {filtered.map((lesson, i) => (
        <li key={lesson.id}>
          <Link
            href={`/lektion/${lesson.id}`}
            className="group flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-lg transition-colors hover:bg-primary-subtle/50"
          >
            <span className="text-xs text-muted/60 tabular-nums w-5 shrink-0 text-right">
              {i + 1}
            </span>
            <span className="text-sm min-w-0 truncate group-hover:text-primary transition-colors">
              {lesson.name}
            </span>
            {lesson.gradeRange && (
              <span className="text-xs text-muted tabular-nums whitespace-nowrap shrink-0">
                {lesson.gradeRange}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
