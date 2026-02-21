import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');
  const tBreadcrumb = await getTranslations('breadcrumb');

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('about') }]} />
      <div>
        <section className="py-24 sm:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
              {t('title')}{' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h1>
            <p className="text-muted text-lg sm:text-xl leading-relaxed mb-8">
              {t('intro')}
            </p>

            <div className="space-y-12">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                  {t('missionTitle')}
                </h2>
                <p className="text-muted leading-relaxed">{t('missionText')}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                  {t('howTitle')}
                </h2>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t('howText1')}</p>
                  <p>{t('howText2')}</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                  {t('levelsTitle')}
                </h2>
                <p className="text-muted leading-relaxed">{t('levelsText')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
