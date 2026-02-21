'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeToggle } from '@/components/nav/theme-toggle';
import { LanguageSelector } from '@/components/nav/language-selector';
import { SITE_NAME } from '@/lib/constants';
import { useEdSystem } from '@/components/ed-system-provider';
import { getEdSystem, getGradeDefinition } from '@/lib/education-systems';
import { gradeLabelKey } from '@/lib/grade-labels';
import type { NavCategory } from '@/components/layout/app-header';

interface MobileNavProps {
  categories: NavCategory[];
}

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const t = useTranslations('nav');
  const tGrades = useTranslations('grades');
  const tGroups = useTranslations('gradeGroups');
  const { edSystem: edSystemCode } = useEdSystem();
  const edSystem = getEdSystem(edSystemCode);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    setExpandedCat(null);
  }, []);

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCat((prev) => (prev === catId ? null : catId));
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-subtle transition-colors"
        aria-label={t('openMenu')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-surface border-l border-border shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <span className="font-display text-lg tracking-tight">
              {SITE_NAME}
            </span>
            <div className="flex items-center gap-1">
              <LanguageSelector />
              <ThemeToggle />
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-subtle transition-colors"
                aria-label={t('closeMenu')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="5" x2="15" y2="15" />
                  <line x1="15" y1="5" x2="5" y2="15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 px-6 py-6 space-y-2">
            {categories.map((cat) => (
              <div key={cat.id}>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-subtle transition-colors"
                >
                  <span className="font-display text-primary text-lg w-8 text-center shrink-0">
                    {cat.symbol}
                  </span>
                  <span className="flex-1 text-left">{cat.name}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-muted transition-transform duration-200 ${
                      expandedCat === cat.id ? 'rotate-180' : ''
                    }`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" />
                  </svg>
                </button>
                {expandedCat === cat.id && (
                  <div className="ml-11 space-y-0.5 pb-2">
                    {cat.topics.map((topic) => {
                      const active = pathname === `/emne/${topic.id}`;
                      return (
                        <Link
                          key={topic.id}
                          href={`/emne/${topic.id}`}
                          onClick={close}
                          className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            active
                              ? 'text-primary font-medium bg-primary-subtle'
                              : 'text-muted hover:text-foreground hover:bg-primary-subtle'
                          }`}
                        >
                          {topic.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-border pt-6 mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                {t('gradeSection')}
              </h3>
              {edSystem.groups.map((group) => (
                <div key={group.key} className="mb-4 last:mb-0">
                  <p className="text-xs text-muted mb-1 px-3">
                    {tGroups(group.key)}
                  </p>
                  <div className="space-y-1">
                    {group.grades.map((gradeId) => {
                      const def = getGradeDefinition(edSystemCode, gradeId);
                      const labelInfo = gradeLabelKey(edSystemCode, gradeId);
                      const label = tGrades(
                        labelInfo.key.replace('grades.', ''),
                        labelInfo.params,
                      );
                      return (
                        <Link
                          key={gradeId}
                          href={`/trin/${gradeId}`}
                          onClick={close}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            pathname === `/trin/${gradeId}`
                              ? 'text-primary font-medium bg-primary-subtle'
                              : 'hover:bg-primary-subtle'
                          }`}
                        >
                          <span className="font-display text-primary text-lg w-8 text-center">
                            {def?.displayNumber ?? gradeId}
                          </span>
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-1">
              {[
                { label: t('matematik'), href: '/pensum' as const },
                { label: t('about'), href: '/om' as const },
                { label: t('contact'), href: '/kontakt' as const },
              ].map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'text-primary font-medium bg-primary-subtle'
                        : 'hover:bg-primary-subtle'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border">
            <Link
              href="/pensum"
              onClick={close}
              className="flex items-center justify-center h-12 w-full rounded-full bg-primary text-primary-fg font-medium transition-colors hover:bg-primary-hover"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
