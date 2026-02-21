'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useEdSystem } from '@/components/ed-system-provider';
import { useGrade } from '@/components/grade-provider';
import {
  getAllCategories,
  getCategoriesForGrade,
  getLessonBySlug,
  getTopicById,
} from '@/lib/curriculum';
import type { Category } from '@/types/topic';

function filterCategories(categories: Category[], query: string): Category[] {
  const q = query.toLowerCase().trim();
  if (!q) return categories;
  return categories
    .map((cat) => {
      const catMatch = cat.name.toLowerCase().includes(q);
      const matchedTopics = cat.topics.filter((t) =>
        t.name.toLowerCase().includes(q),
      );
      if (catMatch) return cat;
      if (matchedTopics.length > 0) return { ...cat, topics: matchedTopics };
      return null;
    })
    .filter((c): c is Category => c !== null);
}

export function UnifiedSidebar() {
  const { edSystem } = useEdSystem();
  const { grades } = useGrade();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine categories based on grade filter
  const baseCategories =
    grades.length > 0
      ? grades
          .flatMap((g) => getCategoriesForGrade(edSystem, g))
          .filter(
            (cat, i, arr) => arr.findIndex((c) => c.id === cat.id) === i,
          )
      : getAllCategories();

  const categories = useMemo(
    () => filterCategories(baseCategories, search),
    [baseCategories, search],
  );

  // Determine which category to auto-expand based on current route
  function getInitialExpanded(): string | null {
    // /omraader/[kategori] → expand that category
    const categoryMatch = pathname.match(/^\/omraader\/([^/]+)/);
    if (categoryMatch) {
      const catId = categoryMatch[1];
      if (categories.some((c) => c.id === catId)) return catId;
    }

    // /emne/[emne] → find topic's category and expand it
    const topicMatch = pathname.match(/^\/emne\/([^/]+)/);
    if (topicMatch) {
      const topic = getTopicById(topicMatch[1]);
      if (topic && categories.some((c) => c.id === topic.categoryId)) {
        return topic.categoryId;
      }
    }

    // /lektion/[lektion] → find lesson's topic's category and expand it
    const lessonMatch = pathname.match(/^\/lektion\/([^/]+)/);
    if (lessonMatch) {
      const lesson = getLessonBySlug(lessonMatch[1]);
      if (lesson) {
        const topic = getTopicById(lesson.topicId);
        if (topic && categories.some((c) => c.id === topic.categoryId)) {
          return topic.categoryId;
        }
      }
    }

    // /trin/[klasse] or fallback → expand first category
    return categories[0]?.id ?? null;
  }

  const [expanded, setExpanded] = useState<string | null>(getInitialExpanded);

  // Re-compute expanded when pathname or categories change
  useEffect(() => {
    setExpanded(getInitialExpanded());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, grades, edSystem]);

  const toggle = useCallback((catId: string) => {
    setExpanded((prev) => (prev === catId ? null : catId));
  }, []);

  // Collapsed: narrow icon strip
  if (collapsed) {
    return (
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-20 pb-8">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-muted hover:text-foreground hover:bg-primary-subtle transition-colors mb-2"
            aria-label="Udvid menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="1" width="14" height="14" rx="2" />
              <path d="M6 1v14" />
            </svg>
          </button>
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/omraader/${cat.id}`}
                title={cat.name}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-primary hover:bg-primary-subtle transition-colors"
              >
                <span className="font-display text-base">{cat.symbol}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // Expanded: full sidebar
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-0.5 pb-8">
        <div className="flex items-center gap-1 mb-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søg emne..."
              className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-border bg-surface text-sm placeholder:text-muted/60 focus:outline-none focus:border-primary/40 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-primary-subtle transition-colors shrink-0"
            aria-label="Kollaps menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="1" width="14" height="14" rx="2" />
              <path d="M6 1v14" />
            </svg>
          </button>
        </div>

        {categories.map((cat) => {
          const isExpanded = search ? true : expanded === cat.id;
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-subtle transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className="shrink-0 text-muted hover:text-primary transition-colors"
                  aria-label={isExpanded ? 'Luk' : 'Åbn'}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  >
                    <path d="M4.5 3L7.5 6L4.5 9" />
                  </svg>
                </button>
                <Link
                  href={`/omraader/${cat.id}`}
                  className="flex-1 min-w-0 truncate"
                >
                  {cat.name}
                </Link>
              </div>

              {isExpanded && (
                <div className="ml-[2.125rem] space-y-0.5 pb-1">
                  {cat.topics.map((topic) => {
                    const active =
                      pathname === `/emne/${topic.id}` ||
                      topic.lessons.some(
                        (l) => pathname === `/lektion/${l.id}`,
                      );
                    return (
                      <Link
                        key={topic.id}
                        href={`/emne/${topic.id}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors truncate ${
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
          );
        })}
      </div>
    </aside>
  );
}
