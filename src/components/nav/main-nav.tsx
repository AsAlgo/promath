'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export function MainNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const links = [
    { label: t('pensum'), href: '/pensum' as const },
    { label: t('about'), href: '/om' as const },
    { label: t('contact'), href: '/kontakt' as const },
  ];

  return (
    <div className="hidden md:flex items-center gap-6">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors duration-200 ${
              active
                ? 'text-foreground font-medium'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
