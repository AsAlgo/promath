'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useTabHash } from '../use-tab-hash';
import { ExploreSection } from './explore';
import { UnderstandSection } from './understand';
import { ProofSection } from './proof';
import { ExamplesSection } from './examples';
import { ExercisesSection } from './exercises';

const SECTION_KEYS = [
  'explore',
  'understand',
  'proof',
  'examples',
  'exercises',
] as const;

const SECTIONS = [
  ExploreSection,
  UnderstandSection,
  ProofSection,
  ExamplesSection,
  ExercisesSection,
];

export default function PythagorasApp() {
  const t = useTranslations('lesson.pythagoras');
  const [section, setSection] = useTabHash(SECTION_KEYS);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = section;
      if (e.key === 'ArrowRight')
        next = Math.min(section + 1, SECTIONS.length - 1);
      else if (e.key === 'ArrowLeft')
        next = Math.max(section - 1, 0);
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = SECTIONS.length - 1;
      else return;

      e.preventDefault();
      setSection(next);
    },
    [section],
  );

  const ActiveSection = SECTIONS[section];

  return (
    <div>
      {/* Tab navigation */}
      <div
        className="flex gap-1 mb-4 overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-label="Lesson sections"
      >
        {SECTION_KEYS.map((key, i) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={i === section}
            aria-controls={`tabpanel-${key}`}
            tabIndex={i === section ? 0 : -1}
            onClick={() => setSection(i)}
            onKeyDown={handleKeyDown}
            className={cn(
              'py-2 px-3.5 rounded-full whitespace-nowrap text-xs font-medium cursor-pointer transition-all duration-200',
              i === section
                ? 'bg-primary text-primary-fg font-bold'
                : 'bg-transparent text-muted hover:text-foreground',
            )}
          >
            {t(`sections.${key}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${SECTION_KEYS[section]}`}
        aria-labelledby={`tab-${SECTION_KEYS[section]}`}
      >
        <ActiveSection />
      </div>
    </div>
  );
}
