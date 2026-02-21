import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { UnifiedSidebar } from '@/components/nav/unified-sidebar';
import { getCategoryById } from '@/lib/curriculum';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ kategori: string; locale: string }>;
}

export default async function CategoryLayout({
  children,
  params,
}: LayoutProps) {
  const { kategori, locale } = await params;
  const category = getCategoryById(kategori);

  if (!category) {
    notFound();
  }

  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'breadcrumb',
  });

  return (
    <>
      <SubNav
        breadcrumbs={[
          { label: tBreadcrumb('omraader'), href: '/omraader' },
          { label: category.name },
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
