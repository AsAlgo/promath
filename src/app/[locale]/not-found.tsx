import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="text-center">
        <span className="font-display text-8xl sm:text-9xl text-primary/20 block mb-6">
          {t('code')}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto mb-8">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center h-12 px-8 rounded-full bg-primary text-primary-fg font-medium transition-all duration-200 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            {t('goHome')}
          </Link>
          <Link
            href="/pensum"
            className="inline-flex items-center h-12 px-8 rounded-full border border-border font-medium transition-all duration-200 hover:bg-surface-alt hover:border-primary/30"
          >
            {t('seePensum')}
          </Link>
        </div>
      </div>
    </div>
  );
}
