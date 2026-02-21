import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';
import { getAllCategories } from '@/lib/curriculum';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { PensumGrid } from '@/components/pensum-grid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'curriculum' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

const categories = getAllCategories();

export default async function MatematikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('curriculum');
  const tBreadcrumb = await getTranslations('breadcrumb');
  const edSystem = await getEdSystemCode(locale);

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('pensum') }]} />
      <div className="py-12 sm:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
              {t('title')}{' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h1>
            <p className="text-muted text-lg max-w-lg mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <PensumGrid categories={categories} edSystem={edSystem} />
        </div>
      </div>
    </>
  );
}
