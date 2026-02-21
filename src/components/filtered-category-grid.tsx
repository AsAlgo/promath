'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useGrade } from '@/components/grade-provider';
import { useEdSystem } from '@/components/ed-system-provider';
import {
  getAllCategories,
  getCategoriesForGrade,
  getLessonCountForGradeAndTopic,
} from '@/lib/curriculum';

export function FilteredCategoryGrid() {
  const tCategory = useTranslations('category');
  const { edSystem } = useEdSystem();
  const { grades } = useGrade();

  const categories =
    grades.length > 0
      ? grades
          .flatMap((g) => getCategoriesForGrade(edSystem, g))
          .filter(
            (cat, i, arr) => arr.findIndex((c) => c.id === cat.id) === i,
          )
      : getAllCategories();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const totalLessons =
          grades.length > 0
            ? grades.reduce(
                (sum, g) =>
                  sum +
                  cat.topics.reduce(
                    (s, t) =>
                      s + getLessonCountForGradeAndTopic(edSystem, g, t.id),
                    0,
                  ),
                0,
              )
            : cat.topics.reduce((sum, t) => sum + t.lessons.length, 0);

        return (
          <Link
            key={cat.id}
            href={`/omraader/${cat.id}`}
            className="group p-6 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-display text-3xl text-primary">
                {cat.symbol}
              </span>
              <div>
                <h2 className="font-semibold group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                <p className="text-muted text-xs">
                  {tCategory('topicsAndLessons', {
                    topics: cat.topics.length,
                    lessons: totalLessons,
                  })}
                </p>
              </div>
            </div>
            <p className="text-muted text-sm">{cat.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
