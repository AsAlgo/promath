'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';

type Theme = 'light' | 'dark' | 'system';

function getSnapshot(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return 'system';
}

function getServerSnapshot(): Theme {
  return 'system';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useTranslations('theme');

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(next);
    window.dispatchEvent(new StorageEvent('storage'));
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-subtle transition-colors"
      aria-label={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="10" r="4" />
          <line x1="10" y1="1.5" x2="10" y2="3.5" />
          <line x1="10" y1="16.5" x2="10" y2="18.5" />
          <line x1="1.5" y1="10" x2="3.5" y2="10" />
          <line x1="16.5" y1="10" x2="18.5" y2="10" />
          <line x1="4" y1="4" x2="5.4" y2="5.4" />
          <line x1="14.6" y1="14.6" x2="16" y2="16" />
          <line x1="4" y1="16" x2="5.4" y2="14.6" />
          <line x1="14.6" y1="5.4" x2="16" y2="4" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.5 10.5a7.5 7.5 0 0 1-10-10 7.5 7.5 0 1 0 10 10Z" />
        </svg>
      )}
    </button>
  );
}
