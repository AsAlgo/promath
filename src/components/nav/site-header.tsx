import { Link } from '@/i18n/routing';
import { SITE_NAME } from '@/lib/constants';

interface SiteHeaderProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SiteHeader({ children, actions }: SiteHeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-xl tracking-tight shrink-0"
          >
            {SITE_NAME}
          </Link>
          {children}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </nav>
  );
}
