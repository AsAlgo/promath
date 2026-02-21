import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border py-10 sm:py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg tracking-tight">
          {SITE_NAME}
        </Link>
        <span className="text-muted text-sm">
          &copy; {new Date().getFullYear()} {SITE_NAME}. {t('tagline')}
        </span>
      </div>
    </footer>
  );
}
