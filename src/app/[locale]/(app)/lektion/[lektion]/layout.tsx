import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { UnifiedSidebar } from '@/components/nav/unified-sidebar';
import {
  getLessonBySlug,
  getTopicById,
  getCategoryById,
} from '@/lib/curriculum';
import { notFound } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lektion: string; locale: string }>;
}

export default async function LessonLayout({
  children,
  params,
}: LayoutProps) {
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
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'breadcrumb',
  });

  return (
    <>
      <SubNav
        breadcrumbs={[
          { label: tBreadcrumb('omraader'), href: '/omraader' },
          {
            label: category?.name ?? topic.categoryId,
            href: `/omraader/${topic.categoryId}`,
          },
          { label: topic.name, href: `/emne/${topic.id}` },
          { label: lesson.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-4 sm:py-6">
        <div className="flex gap-8">
          <UnifiedSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
