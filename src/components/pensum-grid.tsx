'use client';

import { Fragment, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  getEdSystem,
  getGradeDefinition,
  getAllGradeIds,
} from '@/lib/education-systems';
import {
  getLessonCountForGradeAndTopic,
  getTopicGrades,
} from '@/lib/curriculum';
import type { EdSystemCode, GradeId } from '@/types/education-system';
import type { Category, Topic } from '@/types/topic';

interface PensumGridProps {
  categories: Category[];
  edSystem: EdSystemCode;
}

/** Sum lesson counts per grade across all topics in a category. */
function aggregateCategory(
  cat: Category,
  allGrades: GradeId[],
  edSystem: EdSystemCode,
) {
  const byGrade = new Map<GradeId, number>();
  let total = 0;
  for (const topic of cat.topics) {
    for (const grade of allGrades) {
      const count = getLessonCountForGradeAndTopic(edSystem, grade, topic.id);
      if (count > 0) {
        byGrade.set(grade, (byGrade.get(grade) ?? 0) + count);
        total += count;
      }
    }
  }
  return { byGrade, total };
}

export function PensumGrid({ categories, edSystem }: PensumGridProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const t = useTranslations('curriculum');
  const tGroups = useTranslations('gradeGroups');

  const edSystemDef = getEdSystem(edSystem);
  const allGrades = getAllGradeIds(edSystem);

  const aggregates = useMemo(() => {
    const grades = getAllGradeIds(edSystem);
    return new Map(
      categories.map((c) => [c.id, aggregateCategory(c, grades, edSystem)]),
    );
  }, [categories, edSystem]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenIds(new Set(categories.map((c) => c.id)));
  const collapseAll = () => setOpenIds(new Set());
  const allOpen = openIds.size === categories.length;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          {allOpen ? t('hideAll') : t('showAll')}
        </button>
      </div>

      {/* Desktop: Matrix table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3" />
              {edSystemDef.groups.map((group) => (
                <th
                  key={group.key}
                  colSpan={group.grades.length}
                  className="text-center text-xs font-semibold uppercase tracking-wider text-muted px-1 pb-1"
                >
                  {tGroups(group.key)}
                </th>
              ))}
            </tr>
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-muted">
                {t('topic')}
              </th>
              {allGrades.map((gradeId) => {
                const def = getGradeDefinition(edSystem, gradeId);
                return (
                  <th
                    key={gradeId}
                    className="text-center p-2 text-sm font-medium text-muted w-10"
                  >
                    {def?.displayNumber ?? gradeId}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const isOpen = openIds.has(cat.id);
              const agg = aggregates.get(cat.id)!;
              return (
                <Fragment key={cat.id}>
                  <tr
                    onClick={() => toggle(cat.id)}
                    className="cursor-pointer group select-none"
                  >
                    <td className="pt-6 pb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="w-3.5 h-3.5 text-muted/60 transition-transform duration-200"
                          style={{
                            transform: isOpen
                              ? 'rotate(90deg)'
                              : 'rotate(0deg)',
                          }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-display text-sm mr-1.5">
                          {cat.symbol}
                        </span>
                        {cat.name}
                        <span className="text-muted/40 font-normal normal-case tracking-normal">
                          {t('topicsCount', { count: cat.topics.length })}
                          {agg.total > 0 &&
                            ` \u00b7 ${t('lessonsCount', { count: agg.total })}`}
                        </span>
                      </span>
                    </td>
                    {allGrades.map((gradeId) => {
                      const count = agg.byGrade.get(gradeId) ?? 0;
                      return (
                        <td
                          key={gradeId}
                          className="pt-6 pb-2 text-center text-xs tabular-nums"
                        >
                          {count > 0 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary-subtle text-primary text-xs font-semibold">
                              {count}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                  {isOpen &&
                    cat.topics.map((topic) => (
                      <tr
                        key={topic.id}
                        className="border-t border-border hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="p-3">
                          <Link
                            href={`/emne/${topic.id}`}
                            className="flex items-center gap-2 group"
                          >
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {topic.name}
                            </span>
                          </Link>
                        </td>
                        {allGrades.map((gradeId) => (
                          <MatrixCell
                            key={`${topic.id}-${gradeId}`}
                            topic={topic}
                            gradeId={gradeId}
                            edSystem={edSystem}
                          />
                        ))}
                      </tr>
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card list grouped by category */}
      <div className="lg:hidden space-y-6">
        {categories.map((cat) => {
          const isOpen = openIds.has(cat.id);
          const agg = aggregates.get(cat.id)!;
          const activeGrades = allGrades.filter(
            (g) => (agg.byGrade.get(g) ?? 0) > 0,
          );
          return (
            <div key={cat.id}>
              <button
                onClick={() => toggle(cat.id)}
                className="w-full text-left px-1 mb-3 select-none"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <svg
                    className="w-3.5 h-3.5 text-muted/60 transition-transform duration-200"
                    style={{
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-display text-sm mr-1.5">
                    {cat.symbol}
                  </span>
                  {cat.name}
                </div>
                <div className="mt-1.5 ml-5.5 flex items-center gap-2 text-xs text-muted/60">
                  <span>
                    {t('topicsCount', { count: cat.topics.length })}
                    {agg.total > 0 &&
                      ` \u00b7 ${t('lessonsCount', { count: agg.total })}`}
                  </span>
                </div>
                {!isOpen && activeGrades.length > 0 && (
                  <div className="mt-2 ml-5.5 flex flex-wrap gap-1">
                    {activeGrades.map((gradeId) => {
                      const def = getGradeDefinition(edSystem, gradeId);
                      const display = def?.displayNumber ?? gradeId;
                      return (
                        <span
                          key={gradeId}
                          className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded text-[10px] font-medium bg-primary-subtle text-primary"
                        >
                          {display} ({agg.byGrade.get(gradeId)})
                        </span>
                      );
                    })}
                  </div>
                )}
              </button>
              {isOpen && (
                <div className="space-y-4">
                  {cat.topics.map((topic) => {
                    const topicGrds = getTopicGrades(edSystem, topic.id);
                    return (
                      <Link
                        key={topic.id}
                        href={`/emne/${topic.id}`}
                        className="group flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-0.5">{topic.name}</h3>
                          <p className="text-muted text-sm mb-3">
                            {topic.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {topicGrds.map((gradeId) => {
                              const count = getLessonCountForGradeAndTopic(
                                edSystem,
                                gradeId,
                                topic.id,
                              );
                              const def = getGradeDefinition(edSystem, gradeId);
                              const display = def?.displayNumber ?? gradeId;
                              return (
                                <span
                                  key={gradeId}
                                  className={`inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-md text-xs font-medium ${
                                    count > 0
                                      ? 'bg-primary text-primary-fg'
                                      : 'bg-primary-subtle text-muted'
                                  }`}
                                >
                                  {count > 0
                                    ? `${display} (${count})`
                                    : display}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <svg
                          className="mt-1 shrink-0 text-muted group-hover:text-primary transition-colors"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 4L13 10L7 16" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function MatrixCell({
  topic,
  gradeId,
  edSystem,
}: {
  topic: Topic;
  gradeId: GradeId;
  edSystem: EdSystemCode;
}) {
  const topicGrades = getTopicGrades(edSystem, topic.id);
  const isValid = topicGrades.includes(gradeId);
  if (!isValid) {
    return <td className="text-center p-2" />;
  }

  const count = getLessonCountForGradeAndTopic(edSystem, gradeId, topic.id);
  if (count > 0) {
    return (
      <td className="text-center p-2">
        <Link
          href={`/emne/${topic.id}#grade-${gradeId}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-fg text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          {count}
        </Link>
      </td>
    );
  }

  return (
    <td className="text-center p-2">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted/40" />
    </td>
  );
}
