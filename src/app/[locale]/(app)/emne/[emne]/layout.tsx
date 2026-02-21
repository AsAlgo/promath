import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { UnifiedSidebar } from '@/components/nav/unified-sidebar';
import { getTopicById, getCategoryById } from '@/lib/curriculum';
import { notFound } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ emne: string; locale: string }>;
}

export default async function TopicLayout({ children, params }: LayoutProps) {
  const { emne, locale } = await params;
  const topic = getTopicById(emne);

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
          { label: topic.name },
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        <div className="flex gap-8">
          <UnifiedSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
