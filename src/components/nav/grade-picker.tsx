'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGrade } from '@/components/grade-provider';
import { useEdSystem } from '@/components/ed-system-provider';
import { Flag } from '@/components/nav/flag';
import { getEdSystem } from '@/lib/education-systems';
import { gradeLabelKey } from '@/lib/grade-labels';
import type { EdSystemCode, GradeId } from '@/types/education-system';

const systemKeys: Record<EdSystemCode, string> = {
  DK: 'dk',
  DE: 'de',
  UK: 'uk',
  US: 'us',
};

const systems: EdSystemCode[] = ['DK', 'DE', 'UK', 'US'];

interface GradePickerProps {
  compact?: boolean;
}

export function GradePicker({ compact }: GradePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tGrades = useTranslations('grades');
  const tGroups = useTranslations('gradeGroups');
  const tTopic = useTranslations('topic');
  const tEdSystem = useTranslations('edSystem');
  const { edSystem: edSystemCode, setEdSystem } = useEdSystem();
  const { grades, setGrades } = useGrade();
  const edSystem = getEdSystem(edSystemCode);

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

  function getLabel(gradeId: GradeId): string {
    const info = gradeLabelKey(edSystemCode, gradeId);
    return tGrades(info.key.replace('grades.', ''), info.params);
  }

  function selectGrade(gradeId: GradeId) {
    setGrades([gradeId]);
    close();
  }

  function selectGroup(groupGrades: GradeId[]) {
    setGrades([...groupGrades]);
    close();
  }

  function isGroupSelected(groupGrades: GradeId[]): boolean {
    if (grades.length !== groupGrades.length) return false;
    const set = new Set(groupGrades);
    return grades.every((g) => set.has(g));
  }

  function currentLabel(): string {
    if (grades.length === 0) return tTopic('allGrades');
    if (grades.length === 1) return getLabel(grades[0]);

    for (const group of edSystem.groups) {
      if (isGroupSelected(group.grades)) {
        return tGroups(group.key);
      }
    }

    return tTopic('allGrades');
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-lg transition-colors ${
          compact
            ? 'px-3 py-1.5 text-xs bg-primary-subtle text-primary font-semibold hover:bg-primary hover:text-primary-fg'
            : 'px-3 py-1.5 text-sm border border-border hover:border-primary/30 hover:bg-primary-subtle'
        }`}
      >
        <span className="shrink-0 opacity-80">
          <Flag code={edSystemCode} size={compact ? 14 : 16} />
        </span>
        <span className="font-medium truncate max-w-[10rem]">
          {currentLabel()}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 rounded-xl bg-surface border border-border shadow-xl shadow-black/10 z-50 p-4">
          <div className="flex items-center gap-1 mb-2">
            {systems.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => code !== edSystemCode && setEdSystem(code)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                  code === edSystemCode
                    ? 'bg-primary-subtle text-primary font-medium'
                    : 'text-muted hover:bg-primary-subtle/50 hover:text-foreground'
                }`}
              >
                <Flag code={code} size={14} />
                <span className="hidden sm:inline">
                  {tEdSystem(systemKeys[code]).split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-border mb-3" />

          <div
            className="grid gap-x-5 gap-y-1"
            style={{
              gridTemplateColumns: `repeat(${Math.min(edSystem.groups.length, 5)}, minmax(auto, 1fr))`,
            }}
          >
            {edSystem.groups.map((group) => (
              <div key={group.key}>
                <button
                  type="button"
                  onClick={() => selectGroup(group.grades)}
                  className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider mb-1 whitespace-nowrap rounded transition-colors ${
                    isGroupSelected(group.grades)
                      ? 'text-primary bg-primary-subtle'
                      : 'text-muted hover:text-primary hover:bg-primary-subtle/50'
                  }`}
                >
                  {tGroups(group.key)}
                </button>
                {group.grades.map((gradeId) => (
                  <button
                    key={gradeId}
                    type="button"
                    onClick={() => selectGrade(gradeId)}
                    className={`block w-full text-left px-2 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      grades.length === 1 && grades[0] === gradeId
                        ? 'text-primary font-medium bg-primary-subtle'
                        : 'hover:text-foreground hover:bg-primary-subtle'
                    }`}
                  >
                    {getLabel(gradeId)}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => { setGrades([]); close(); }}
              className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                grades.length === 0
                  ? 'text-primary font-medium bg-primary-subtle'
                  : 'text-muted hover:text-foreground hover:bg-primary-subtle'
              }`}
            >
              {tTopic('allGrades')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
