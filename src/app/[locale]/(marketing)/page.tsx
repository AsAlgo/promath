import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getAllCategories } from '@/lib/curriculum';
import { Math } from '@/components/ui/math';

export default function Home() {
  const t = useTranslations('home');

  const categories = getAllCategories();
  const totalTopics = categories.reduce(
    (sum, c) => sum + c.topics.length,
    0,
  );
  const totalLessons = categories.reduce(
    (sum, c) =>
      sum + c.topics.reduce((s, tp) => s + tp.lessons.length, 0),
    0,
  );

  // Sort categories by topic count descending, pick top 3 as featured
  const sorted = [...categories].sort(
    (a, b) => b.topics.length - a.topics.length,
  );
  const featured = sorted.slice(0, 3);
  const featuredIds = new Set(featured.map((c) => c.id));
  const compact = categories.filter((c) => !featuredIds.has(c.id));

  const edSystems = [
    {
      flag: '\u{1F1E9}\u{1F1F0}',
      name: t('edSystemDK'),
      range: t('edSystemDKRange'),
      groups: t('edSystemDKGroups'),
    },
    {
      flag: '\u{1F1E9}\u{1F1EA}',
      name: t('edSystemDE'),
      range: t('edSystemDERange'),
      groups: t('edSystemDEGroups'),
    },
    {
      flag: '\u{1F1EC}\u{1F1E7}',
      name: t('edSystemUK'),
      range: t('edSystemUKRange'),
      groups: t('edSystemUKGroups'),
    },
    {
      flag: '\u{1F1FA}\u{1F1F8}',
      name: t('edSystemUS'),
      range: t('edSystemUSRange'),
      groups: t('edSystemUSGroups'),
    },
  ];

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Promath',
        url: 'https://promath.dk',
        description:
          'Gratis matematikplatform med visuelle forklaringer og interaktive lektioner fra indskoling til gymnasium.',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Promath',
        url: 'https://promath.dk',
        sameAs: ['https://github.com/AsAlgo/promath'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  function getCategoryLessonCount(cat: (typeof categories)[number]) {
    return cat.topics.reduce((s, tp) => s + tp.lessons.length, 0);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero — Compact Split Layout ── */}
      <section className="relative pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div
          className="absolute inset-0 hero-glow pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column — text */}
          <div>
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-subtle text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t('badge')}
              </span>
            </div>

            <h1
              className="animate-fade-in-up font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-5"
              style={{ animationDelay: '0.2s' }}
            >
              {t('title')}
              <br />
              <span className="text-primary">
                {t('titleHighlight')}
              </span>
            </h1>

            <p
              className="animate-fade-in-up text-muted text-base sm:text-lg max-w-lg mb-8 leading-relaxed"
              style={{ animationDelay: '0.35s' }}
            >
              {t('subtitle', { lessons: totalLessons })}
            </p>

            {/* Stats row */}
            <div
              className="animate-fade-in-up flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted mb-8"
              style={{ animationDelay: '0.45s' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono tabular-nums">
                  {t('trustLessons', { count: totalLessons })}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono tabular-nums">
                  {t('trustTopics', { count: totalTopics })}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono tabular-nums">
                  {t('trustSystems', { count: 4 })}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t('trustFree')}
              </span>
            </div>

            {/* CTA buttons */}
            <div
              className="animate-fade-in-up flex flex-col sm:flex-row items-start gap-4"
              style={{ animationDelay: '0.55s' }}
            >
              <Link
                href="/pensum"
                className="animate-cta-glow inline-flex items-center h-12 px-8 rounded-full bg-primary text-primary-fg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                {t('cta')}
              </Link>
              <a
                href="#how"
                className="inline-flex items-center h-12 px-8 rounded-full border border-border font-medium transition-all duration-200 hover:bg-surface-alt hover:border-primary/30"
              >
                {t('secondaryCta')}
              </a>
            </div>
          </div>

          {/* Right column — lesson preview mockup (desktop only) */}
          <div className="hidden md:block" aria-hidden="true">
            <div className="relative -rotate-1 rounded-2xl bg-surface border border-border shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Mock title bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-alt">
                <span className="w-3 h-3 rounded-full bg-border" />
                <span className="w-3 h-3 rounded-full bg-border" />
                <span className="w-3 h-3 rounded-full bg-border" />
                <span className="ml-3 text-sm font-semibold">
                  {t('previewTitle')}
                </span>
              </div>

              {/* Mock tab bar */}
              <div className="flex gap-1.5 px-5 py-3 border-b border-border text-xs">
                <span className="px-3 py-1 rounded-full text-muted">
                  Intro
                </span>
                <span className="px-3 py-1 rounded-full text-muted">
                  Bevis
                </span>
                <span className="px-3 py-1 rounded-full bg-primary text-primary-fg font-medium">
                  Interaktiv
                </span>
                <span className="px-3 py-1 rounded-full text-muted">
                  Eksempler
                </span>
                <span className="px-3 py-1 rounded-full text-muted">
                  Opgaver
                </span>
              </div>

              {/* Mock lesson content */}
              <div className="p-6 space-y-5">
                {/* Triangle SVG */}
                <svg
                  viewBox="0 0 280 180"
                  className="w-full max-w-[280px] mx-auto"
                >
                  {/* Triangle */}
                  <polygon
                    points="40,150 240,150 180,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {/* Vertex labels */}
                  <text
                    x="25"
                    y="160"
                    className="fill-foreground text-sm font-semibold"
                    fontSize="14"
                  >
                    B
                  </text>
                  <text
                    x="245"
                    y="160"
                    className="fill-foreground text-sm font-semibold"
                    fontSize="14"
                  >
                    C
                  </text>
                  <text
                    x="180"
                    y="22"
                    className="fill-foreground text-sm font-semibold"
                    fontSize="14"
                  >
                    A
                  </text>
                  {/* Side labels */}
                  <text
                    x="95"
                    y="82"
                    className="fill-muted text-xs"
                    fontSize="12"
                  >
                    {t('previewLabel2')}
                  </text>
                  <text
                    x="220"
                    y="85"
                    className="fill-muted text-xs"
                    fontSize="12"
                  >
                    {t('previewLabel1')}
                  </text>
                  <text
                    x="120"
                    y="170"
                    className="fill-muted text-xs"
                    fontSize="12"
                  >
                    a
                  </text>
                  {/* Angle arc at A */}
                  <path
                    d="M 170,45 Q 165,55 175,55"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-accent"
                  />
                  <text
                    x="160"
                    y="62"
                    className="fill-accent text-xs"
                    fontSize="10"
                  >
                    {t('previewLabel3')}
                  </text>
                </svg>

                {/* KaTeX formula */}
                <div className="text-center">
                  <Math display>
                    {'a^2 = b^2 + c^2 - 2bc \\cdot \\cos A'}
                  </Math>
                </div>

                {/* Mock slider controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted w-10">
                      {t('previewLabel1')}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-border relative">
                      <div className="absolute left-0 top-0 h-2 w-3/5 rounded-full bg-primary/40" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-3.5 h-3.5 rounded-full bg-primary border-2 border-surface" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted w-10">
                      {t('previewLabel2')}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-border relative">
                      <div className="absolute left-0 top-0 h-2 w-2/5 rounded-full bg-primary/40" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-3.5 h-3.5 rounded-full bg-primary border-2 border-surface" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Categories — Visual Centerpiece ── */}
      <section className="animate-on-scroll py-14 sm:py-20 px-6 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">
              {t('categoriesTitle')}
            </h2>
            <p className="text-muted text-base">
              {t('categoriesSubtitle')}
            </p>
          </div>

          {/* Featured cards — top 3 */}
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {featured.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/omraader/${cat.id}`}
                className="group relative flex flex-col p-5 sm:p-6 rounded-2xl border border-border transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                style={{
                  backgroundColor: [
                    'color-mix(in srgb, var(--primary) 4%, var(--surface))',
                    'color-mix(in srgb, var(--accent) 4%, var(--surface))',
                    'color-mix(in srgb, var(--primary) 3%, var(--surface))',
                  ][i],
                }}
              >
                <span className="font-display text-4xl sm:text-5xl text-primary/80 mb-3 transition-transform duration-200 group-hover:scale-110">
                  {cat.symbol}
                </span>
                <span className="font-semibold text-base mb-1">
                  {cat.name}
                </span>
                <span className="text-muted text-sm mb-2 line-clamp-1">
                  {cat.description}
                </span>
                <span className="text-xs text-muted mt-auto">
                  {t('topicsCount', { count: cat.topics.length })}
                  {' · '}
                  {t('lessonsCount', {
                    count: getCategoryLessonCount(cat),
                  })}
                </span>
              </Link>
            ))}
          </div>

          {/* Compact cards — remaining 12 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {compact.map((cat) => (
              <Link
                key={cat.id}
                href={`/omraader/${cat.id}`}
                className="group relative flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
              >
                <span className="font-display text-2xl sm:text-3xl text-primary/80 mb-2 transition-transform duration-200 group-hover:scale-110">
                  {cat.symbol}
                </span>
                <span className="font-semibold text-sm text-center mb-1">
                  {cat.name}
                </span>
                <span className="text-muted text-xs">
                  {t('topicsCount', { count: cat.topics.length })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page CTA ── */}
      <div className="py-8 sm:py-10 px-6 text-center">
        <Link
          href="/pensum"
          className="animate-cta-glow inline-flex items-center h-12 px-10 rounded-full bg-primary text-primary-fg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
        >
          {t('cta')}
        </Link>
      </div>

      {/* ── 3. How it works + Education Systems — Merged ── */}
      <section id="how" className="animate-on-scroll py-14 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left column (3/5) — How it works */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-8">
              {t('howTitle')}
            </h2>

            <div className="space-y-5">
              {[
                {
                  num: '1',
                  title: t('howStep1Title'),
                  desc: t('howStep1Desc'),
                },
                {
                  num: '2',
                  title: t('howStep2Title'),
                  desc: t('howStep2Desc'),
                },
                {
                  num: '3',
                  title: t('howStep3Title'),
                  desc: t('howStep3Desc'),
                },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white font-display text-lg">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column (2/5) — Education systems */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-8">
              {t('systemsLabel')}
            </h2>

            <div className="space-y-2">
              {edSystems.map((sys, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-surface border border-border"
                >
                  <span className="text-2xl flex-shrink-0">
                    {sys.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {sys.name}
                      </span>
                      <span className="font-mono text-xs text-primary">
                        {sys.range}
                      </span>
                    </div>
                    <div className="text-xs text-muted truncate">
                      {sys.groups}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FAQ — Compact Two-Column ── */}
      <section className="animate-on-scroll py-14 sm:py-20 px-6 bg-surface-alt">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-8">
            {t('faqTitle')}{' '}
            <span className="text-primary">
              {t('faqTitleHighlight')}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold mb-1.5">
                  {faq.q}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Final CTA — Tight ── */}
      <section className="animate-on-scroll py-14 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-3">
            {t('ctaTitle')}{' '}
            <span className="text-primary">
              {t('ctaTitleHighlight')}
            </span>
          </h2>
          <p className="text-sm text-muted mb-6">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/pensum"
            className="inline-flex items-center h-12 px-10 rounded-full bg-primary text-primary-fg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            {t('ctaButton')}
          </Link>
          <div className="mt-4 text-xs text-muted">
            {t('ctaTrust1')} · {t('ctaTrust2')} · {t('ctaTrust3')}
          </div>
        </div>
      </section>
    </>
  );
}
