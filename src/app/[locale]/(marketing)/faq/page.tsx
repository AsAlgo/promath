import { getTranslations } from 'next-intl/server';
import { SubNav } from '@/components/nav/sub-nav';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function FaqPage() {
  const t = await getTranslations('faq');
  const tBreadcrumb = await getTranslations('breadcrumb');

  const faqs = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
  ];

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('faq') }]} />
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

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-2xl bg-surface border border-border"
                >
                  <h2 className="font-semibold text-lg mb-2">{faq.question}</h2>
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
