import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCategoryById, getTopicGrades } from '@/lib/curriculum';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { CategoryTopics } from '@/components/category-topics';

interface PageProps {
  params: Promise<{ kategori: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { kategori } = await params;
  const category = getCategoryById(kategori);
  if (!category) return {};
  return {
    title: `${category.name} — Promath`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { kategori, locale } = await params;
  const category = getCategoryById(kategori);

  if (!category) {
    notFound();
  }

  const edSystem = await getEdSystemCode(locale);

  const totalLessons = category.topics.reduce(
    (sum, t) => sum + t.lessons.length,
    0,
  );

  const tCategory = await getTranslations({ locale, namespace: 'category' });
  const tTopic = await getTranslations({ locale, namespace: 'topic' });

  const topicItems = category.topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    description: topic.description,
    lessonCount: topic.lessons.length,
    gradeIds: getTopicGrades(edSystem, topic.id),
  }));

  const lessonsShortFn: Record<string, string> = {};
  for (const t of topicItems) {
    lessonsShortFn[t.id] = tTopic('lessonsShort', { count: t.lessonCount });
  }

  return (
    <div>
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-4xl text-primary">
            {category.symbol}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
            {category.name}
          </h1>
        </div>
        <p className="text-muted">{category.description}</p>
        <p className="text-muted text-sm mt-1">
          {tCategory('topicsAndLessons', {
            topics: category.topics.length,
            lessons: totalLessons,
          })}
        </p>
      </div>

      {tCategory.has(`about.${kategori}.p1`) && (
        <div className="max-w-2xl mb-10 space-y-4">
          {(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const)
            .filter((key) => tCategory.has(`about.${kategori}.${key}`))
            .map((key) => (
              <p
                key={key}
                className="text-sm leading-relaxed text-foreground/85"
              >
                {tCategory(`about.${kategori}.${key}` as never)}
              </p>
            ))}
        </div>
      )}

      <CategoryTopics topics={topicItems} lessonsShortFn={lessonsShortFn} />
    </div>
  );
}
