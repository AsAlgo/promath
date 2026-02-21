import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  getTopicById,
  getLessonsForTopic,
  getCategoryById,
  getLessonGrades,
} from '@/lib/curriculum';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { getGradeOrder } from '@/lib/education-systems';
import { gradeLabelShortKey } from '@/lib/grade-labels';
import type { EdSystemCode, GradeId } from '@/types/education-system';
import { notFound } from 'next/navigation';
import { TopicLessons } from '@/components/topic-lessons';

interface PageProps {
  params: Promise<{ emne: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { emne, locale } = await params;
  const topic = getTopicById(emne);
  const tTopic = await getTranslations({ locale, namespace: 'topic' });
  if (!topic) return { title: tTopic('notFoundTitle') };
  return {
    title: `${topic.name} — Promath`,
    description: `${topic.name}: ${topic.description}. ${tTopic('lessonsForGradeAndTopic')}`,
  };
}

function formatGradeRange(
  gradeIds: GradeId[],
  edSystem: EdSystemCode,
  tGrades: Awaited<ReturnType<typeof getTranslations>>,
): string | null {
  if (gradeIds.length === 0) return null;

  const sorted = [...gradeIds].sort(
    (a, b) => getGradeOrder(edSystem, a) - getGradeOrder(edSystem, b),
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstInfo = gradeLabelShortKey(edSystem, first);
  const firstStr = tGrades(
    firstInfo.key.replace('grades.', '') as never,
    firstInfo.params as never,
  );

  if (sorted.length === 1 || first === last) return firstStr;

  const lastInfo = gradeLabelShortKey(edSystem, last);
  const lastStr = tGrades(
    lastInfo.key.replace('grades.', '') as never,
    lastInfo.params as never,
  );

  return `${firstStr}\u2013${lastStr}`;
}

export default async function TopicPage({ params }: PageProps) {
  const { emne, locale } = await params;
  const topic = getTopicById(emne);

  if (!topic) {
    notFound();
  }

  const category = getCategoryById(topic.categoryId);
  const allLessons = getLessonsForTopic(emne);
  const edSystemCode = await getEdSystemCode(locale);

  const t = await getTranslations({ locale, namespace: 'topic' });
  const tGrades = await getTranslations({ locale, namespace: 'grades' });

  const lessonItems = allLessons.map((l) => {
    const gradeIds = getLessonGrades(edSystemCode, l.id);
    return {
      id: l.id,
      name: l.name,
      gradeIds,
      gradeRange: formatGradeRange(gradeIds, edSystemCode, tGrades),
    };
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-display text-5xl text-primary/80">
            {category?.symbol}
          </span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
              {topic.name}
            </h1>
            <p className="text-muted">{topic.description}</p>
          </div>
        </div>
      </div>

      {t.has(`about.${emne}.p1`) && (
        <div className="max-w-2xl mb-8 space-y-3">
          {(['p1', 'p2'] as const)
            .filter((key) => t.has(`about.${emne}.${key}`))
            .map((key) => (
              <p
                key={key}
                className="text-sm leading-relaxed text-foreground/85"
              >
                {t(`about.${emne}.${key}` as never)}
              </p>
            ))}
        </div>
      )}

      {allLessons.length === 0 ? (
        <div className="text-center py-16">
          <span className="font-display text-6xl text-primary/20 block mb-4">
            {category?.symbol}
          </span>
          <p className="text-muted text-lg mb-2">
            {t('noLessons', { topicName: topic.name })}
          </p>
          <p className="text-muted text-sm">{t('noLessonsHint')}</p>
        </div>
      ) : (
        <TopicLessons lessons={lessonItems} />
      )}
    </div>
  );
}
