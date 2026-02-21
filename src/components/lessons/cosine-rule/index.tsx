'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { IntroSection } from './intro';
import { ProofSection } from './proof';
import { InteractiveSection } from './interactive';
import { ExamplesSection } from './examples';
import { ExercisesSection } from './exercises';

const SECTION_KEYS = [
  'intro',
  'proof',
  'interactive',
  'examples',
  'exercises',
] as const;

const SECTIONS = [
  IntroSection,
  ProofSection,
  InteractiveSection,
  ExamplesSection,
  ExercisesSection,
];

export default function CosineRuleApp() {
  const t = useTranslations('lesson.cosineRule');
  const [section, setSection] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = section;
      if (e.key === 'ArrowRight')
        next = Math.min(section + 1, SECTIONS.length - 1);
      else if (e.key === 'ArrowLeft') next = Math.max(section - 1, 0);
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
        className="flex gap-1 px-3 mb-5 overflow-x-auto scrollbar-hide"
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
