import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  getTopicById,
  getLessonBySlug,
  getCategoryById,
} from '@/lib/curriculum';
import { notFound } from 'next/navigation';
import CosineRuleApp from '@/components/lessons/cosine-rule/index';

interface PageProps {
  params: Promise<{ lektion: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lektion, locale } = await params;
  const lesson = getLessonBySlug(lektion);
  const tTopic = await getTranslations({ locale, namespace: 'topic' });
  if (!lesson) return { title: tTopic('notFoundTitle') };
  const topic = getTopicById(lesson.topicId);
  return {
    title: `${lesson.name} — ${topic?.name ?? lektion} — Promath`,
    description: lesson.name,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { lektion, locale } = await params;
  const lesson = getLessonBySlug(lektion);

  if (!lesson) {
    notFound();
  }

  const topic = getTopicById(lesson.topicId);

  if (!topic) {
    notFound();
  }

  const category = getCategoryById(topic.categoryId);
  const t = await getTranslations({ locale, namespace: 'lesson' });

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
          {lesson.name}
        </h1>
      </div>

      {lesson.id === 'cosinusreglen' ? (
        <CosineRuleApp />
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 sm:p-16 text-center">
          <span className="font-display text-7xl text-primary/20 block mb-6">
            {category?.symbol}
          </span>
          <h2 className="font-display text-2xl tracking-tight mb-3">
            {t('comingSoonTitle')}
          </h2>
          <p className="text-muted max-w-md mx-auto">
            {t('comingSoonDesc', { lessonName: lesson.name })}
          </p>
        </div>
      )}
    </>
  );
}
