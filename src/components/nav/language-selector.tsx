'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';

const localeLabels: Record<Locale, string> = {
  da: 'Dansk',
  en: 'English',
  de: 'Deutsch',
};

const localeShort: Record<Locale, string> = {
  da: 'DA',
  en: 'EN',
  de: 'DE',
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next !== locale) {
      router.replace(pathname, { locale: next });
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-subtle transition-colors text-sm font-medium"
        aria-label={t('switchLocale')}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {localeShort[locale]}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('label')}
          className="absolute right-0 top-full mt-1 min-w-32 rounded-lg border border-border bg-surface shadow-lg py-1 z-50"
        >
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => switchTo(l)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  l === locale
                    ? 'text-primary font-medium bg-primary-subtle'
                    : 'text-foreground hover:bg-primary-subtle/50'
                }`}
              >
                {localeLabels[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
