'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { NavCategory } from '@/components/layout/app-header';

interface TopicSelectorProps {
  categories: NavCategory[];
}

export function TopicSelector({ categories }: TopicSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations('nav');

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        aria-label={t('selectTopic')}
      >
        {t('topics')}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 rounded-xl bg-surface border border-border shadow-xl shadow-black/10 z-50 p-4">
          <div
            className="grid grid-cols-3 gap-x-6 gap-y-0.5"
            style={{ width: '36rem' }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/omraader/${cat.id}`}
                onClick={close}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-primary-subtle transition-colors"
              >
                <span className="font-display text-base w-7 text-center shrink-0">
                  {cat.symbol}
                </span>
                <span className="whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
