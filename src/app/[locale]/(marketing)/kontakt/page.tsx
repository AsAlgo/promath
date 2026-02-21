import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SubNav } from '@/components/nav/sub-nav';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');
  const tBreadcrumb = await getTranslations('breadcrumb');

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('contact') }]} />
      <div>
        <section className="py-24 sm:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
              {t('title')}{' '}
              <span className="text-primary">{t('titleHighlight')}</span>
            </h1>
            <p className="text-muted text-lg sm:text-xl leading-relaxed mb-12">
              {t('subtitle')}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-7 sm:p-8 rounded-2xl bg-surface border border-border">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle text-primary text-xl font-display mb-5">
                  ✉
                </div>
                <h2 className="text-lg font-semibold mb-2">
                  {t('emailTitle')}
                </h2>
                <p className="text-muted text-sm mb-4">{t('emailDesc')}</p>
                <a
                  href="mailto:kontakt@promath.dk"
                  className="text-primary text-sm font-medium hover:text-primary-hover transition-colors"
                >
                  kontakt@promath.dk
                </a>
              </div>

              <div className="p-7 sm:p-8 rounded-2xl bg-surface border border-border">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle text-primary text-xl font-display mb-5">
                  ?
                </div>
                <h2 className="text-lg font-semibold mb-2">{t('faqTitle')}</h2>
                <p className="text-muted text-sm mb-4">{t('faqDesc')}</p>
                <Link
                  href="/faq"
                  className="text-primary text-sm font-medium hover:text-primary-hover transition-colors"
                >
                  {t('faqLink')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
