'use client';

import { Link } from '@/i18n/routing';
import { useGrade } from '@/components/grade-provider';
import type { GradeId } from '@/types/education-system';

interface TopicItem {
  id: string;
  name: string;
  description: string;
  lessonCount: number;
  gradeIds: GradeId[];
}

interface CategoryTopicsProps {
  topics: TopicItem[];
  lessonsShortFn: Record<string, string>;
}

export function CategoryTopics({
  topics,
  lessonsShortFn,
}: CategoryTopicsProps) {
  const { grades } = useGrade();

  const filtered =
    grades.length > 0
      ? topics.filter((t) => t.gradeIds.some((g) => grades.includes(g)))
      : topics;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((topic) => (
        <Link
          key={topic.id}
          href={`/emne/${topic.id}`}
          className="group block p-5 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
        >
          <h2 className="font-semibold mb-0.5 group-hover:text-primary transition-colors">
            {topic.name}
          </h2>
          <p className="text-muted text-sm">{topic.description}</p>
          <span className="text-xs text-muted mt-2 block">
            {lessonsShortFn[topic.id]}
          </span>
        </Link>
      ))}
    </div>
  );
}
