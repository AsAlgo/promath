import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { UnifiedSidebar } from '@/components/nav/unified-sidebar';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { isValidGradeId, findClosestGrade } from '@/lib/education-systems';
import { gradeLabelKey } from '@/lib/grade-labels';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ klasse: string; locale: string }>;
}

export default async function GradeLayout({ children, params }: LayoutProps) {
  const { klasse, locale } = await params;
  const edSystem = await getEdSystemCode(locale);

  if (!isValidGradeId(edSystem, klasse)) {
    // Try to find closest grade from other systems (edge case: user switched system)
    const systems = ['DK', 'DE', 'UK', 'US'] as const;
    for (const src of systems) {
      if (src === edSystem) continue;
      if (isValidGradeId(src, klasse)) {
        const closest = findClosestGrade(edSystem, klasse, src);
        if (closest) {
          redirect(`/${locale}/trin/${closest}`);
        }
      }
    }
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'grades' });
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'breadcrumb',
  });

  const labelInfo = gradeLabelKey(edSystem, klasse);
  const label = t(labelInfo.key.replace('grades.', ''), labelInfo.params);

  return (
    <>
      <SubNav
        breadcrumbs={[{ label: tBreadcrumb('trin'), href: '/trin' }, { label }]}
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
