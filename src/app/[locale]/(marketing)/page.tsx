import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FloatingSymbols } from '@/components/shared/floating-symbols';

const topics = [
  {
    symbol: 'x²',
    name: 'Algebra',
    slug: 'grundlaeggende-algebra',
    descKey: 'topicAlgebraDesc' as const,
  },
  {
    symbol: '△',
    name: 'Geometri',
    slug: 'trekanter',
    descKey: 'topicGeometryDesc' as const,
  },
  {
    symbol: 'sin',
    name: 'Trigonometri',
    slug: 'retvinklet-trigonometri',
    descKey: 'topicTrigDesc' as const,
  },
  {
    symbol: 'f(x)',
    name: 'Funktioner',
    slug: 'lineaere-funktioner',
    descKey: 'topicFunctionsDesc' as const,
  },
  {
    symbol: '→',
    name: 'Vektorer',
    slug: 'vektorer-i-planen',
    descKey: 'topicVectorsDesc' as const,
  },
  {
    symbol: '∫',
    name: 'Integralregning',
    slug: 'bestemt-integral',
    descKey: 'topicIntegralDesc' as const,
  },
  {
    symbol: 'μ',
    name: 'Statistik',
    slug: 'deskriptiv-statistik',
    descKey: 'topicStatsDesc' as const,
  },
  {
    symbol: 'Σₙ',
    name: 'Følger',
    slug: 'foelger',
    descKey: 'topicSequencesDesc' as const,
  },
];

export default function Home() {
  const t = useTranslations('home');

  const features = [
    { symbol: 'Σ', title: t('feature1Title'), description: t('feature1Desc') },
    { symbol: '↗', title: t('feature2Title'), description: t('feature2Desc') },
    { symbol: '∞', title: t('feature3Title'), description: t('feature3Desc') },
    { symbol: '◇', title: t('feature4Title'), description: t('feature4Desc') },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div
          className="absolute inset-0 graph-paper pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[150px] bg-primary/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full blur-[120px] bg-accent/5 pointer-events-none"
          aria-hidden="true"
        />
        <FloatingSymbols />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-subtle text-primary text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t('badge')}
            </span>
          </div>

          <h1
            className="animate-fade-in-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] mb-6"
            style={{ animationDelay: '0.2s' }}
          >
            {t('title')}
            <br />
            <span className="text-primary">{t('titleHighlight')}</span>
          </h1>

          <p
            className="animate-fade-in-up text-muted text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ animationDelay: '0.35s' }}
          >
            {t('subtitle')}
          </p>

          <div
            className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: '0.5s' }}
          >
            <Link
              href="/pensum"
              className="inline-flex items-center h-12 px-8 rounded-full bg-primary text-primary-fg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              {t('cta')}
            </Link>
            <a
              href="#features"
              className="inline-flex items-center h-12 px-8 rounded-full border border-border font-medium transition-all duration-200 hover:bg-surface-alt hover:border-primary/30"
            >
              {t('secondaryCta')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
              {t('featuresTitle')}{' '}
              <span className="text-primary">
                {t('featuresTitleHighlight')}
              </span>
            </h2>
            <p className="text-muted text-lg max-w-lg mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative p-7 sm:p-8 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle text-primary text-xl font-display mb-5 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-fg">
                  {f.symbol}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topics ── */}
      <section className="relative py-24 sm:py-32 px-6 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
              {t('topicsTitle')}{' '}
              <span className="text-primary">{t('topicsTitleHighlight')}</span>
            </h2>
            <p className="text-muted text-lg max-w-lg mx-auto">
              {t('topicsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {topics.map((tp, i) => (
              <Link
                key={i}
                href={`/emne/${tp.slug}`}
                className="group relative flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
              >
                <span className="font-display text-4xl sm:text-5xl text-primary/80 mb-4 transition-transform duration-200 group-hover:scale-110">
                  {tp.symbol}
                </span>
                <span className="font-semibold mb-1">{tp.name}</span>
                <span className="text-muted text-sm">{t(tp.descKey)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
            {t('ctaTitle')}{' '}
            <span className="text-primary">{t('ctaTitleHighlight')}</span>
          </h2>
          <p className="text-muted text-lg max-w-md mx-auto mb-10">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/pensum"
            className="inline-flex items-center h-14 px-10 rounded-full bg-primary text-primary-fg text-lg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </>
  );
}
