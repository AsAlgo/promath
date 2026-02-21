import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { FilteredCategoryGrid } from '@/components/filtered-category-grid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'breadcrumb',
  });
  return {
    title: `${tBreadcrumb('omraader')} — Promath`,
  };
}

export default async function OmraaderPage() {
  const tBreadcrumb = await getTranslations('breadcrumb');

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('omraader') }]} />
      <div className="py-6 sm:py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <FilteredCategoryGrid />
        </div>
      </div>
    </>
  );
}
