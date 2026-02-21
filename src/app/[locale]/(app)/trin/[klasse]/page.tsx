import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import {
  getCategoriesForGrade,
  getLessonCountForGradeAndTopic,
  getTopicsForGrade,
  getLessonsForGradeAndTopic,
} from '@/lib/curriculum';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { isValidGradeId, getGradeDefinition } from '@/lib/education-systems';
import { gradeLabelKey } from '@/lib/grade-labels';

interface PageProps {
  params: Promise<{ klasse: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { klasse, locale } = await params;
  const edSystem = await getEdSystemCode(locale);
  const t = await getTranslations({ locale, namespace: 'grades' });
  const labelInfo = gradeLabelKey(edSystem, klasse);
  const label = t(labelInfo.key.replace('grades.', ''), labelInfo.params);
  return {
    title: `${label} — Promath`,
    description: t('metaDescription'),
  };
}

export default async function GradePage({ params }: PageProps) {
  const { klasse, locale } = await params;
  const edSystem = await getEdSystemCode(locale);

  if (!isValidGradeId(edSystem, klasse)) {
    notFound();
  }

  const categories = getCategoriesForGrade(edSystem, klasse);
  const allTopics = getTopicsForGrade(edSystem, klasse);
  const totalLessons = allTopics.reduce(
    (sum, tp) =>
      sum + getLessonsForGradeAndTopic(edSystem, klasse, tp.id).length,
    0,
  );

  const t = await getTranslations({ locale, namespace: 'grades' });
  const tTopic = await getTranslations({ locale, namespace: 'topic' });

  const def = getGradeDefinition(edSystem, klasse);
  const labelInfo = gradeLabelKey(edSystem, klasse);
  const label = t(labelInfo.key.replace('grades.', ''), labelInfo.params);

  return (
    <div>
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">
          <span className="text-primary">{def?.displayNumber ?? klasse}</span>{' '}
          {label}
        </h1>
        <p className="text-muted">
          {t('topicsCount', { count: allTopics.length })} ·{' '}
          {t('lessonsCount', { count: totalLessons })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map((cat) => {
          const catLessons = cat.topics.reduce(
            (sum, tp) =>
              sum + getLessonCountForGradeAndTopic(edSystem, klasse, tp.id),
            0,
          );

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-surface border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-2xl text-primary">
                  {cat.symbol}
                </span>
                <div>
                  <h2 className="font-semibold">{cat.name}</h2>
                  <p className="text-muted text-xs">
                    {t('topicsCount', { count: cat.topics.length })} ·{' '}
                    {t('lessonsCount', { count: catLessons })}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {cat.topics.map((topic) => {
                  const count = getLessonCountForGradeAndTopic(
                    edSystem,
                    klasse,
                    topic.id,
                  );
                  return (
                    <Link
                      key={topic.id}
                      href={`/emne/${topic.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary-subtle transition-colors group"
                    >
                      <span className="text-muted group-hover:text-foreground transition-colors truncate">
                        {topic.name}
                      </span>
                      {count > 0 && (
                        <span className="shrink-0 text-xs text-muted">
                          {tTopic('lessonsShort', { count })}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
