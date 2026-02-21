import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SubNav } from '@/components/nav/sub-nav';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { getEdSystem } from '@/lib/education-systems';
import {
  getTopicsForGrade,
  getLessonsForGradeAndTopic,
} from '@/lib/curriculum';
import { gradeLabelKey } from '@/lib/grade-labels';
import type { GradeId } from '@/types/education-system';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'grades' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TrinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('grades');
  const tGroups = await getTranslations('gradeGroups');
  const tBreadcrumb = await getTranslations('breadcrumb');

  const edSystemCode = await getEdSystemCode(locale);
  const edSystem = getEdSystem(edSystemCode);

  return (
    <>
      <SubNav breadcrumbs={[{ label: tBreadcrumb('trin') }]} />
      <div className="py-6 sm:py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {edSystem.groups.map((group) => (
              <div key={group.key}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 px-1">
                  {tGroups(group.key)}
                </h2>
                <div className="space-y-2">
                  {group.grades.map((gradeId) => (
                    <GradeCard
                      key={gradeId}
                      gradeId={gradeId}
                      edSystemCode={edSystemCode}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function GradeCard({
  gradeId,
  edSystemCode,
  t,
}: {
  gradeId: GradeId;
  edSystemCode: 'DK' | 'DE' | 'UK' | 'US';
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const topics = getTopicsForGrade(edSystemCode, gradeId);
  const lessonCount = topics.reduce(
    (sum, tp) =>
      sum + getLessonsForGradeAndTopic(edSystemCode, gradeId, tp.id).length,
    0,
  );
  const labelInfo = gradeLabelKey(edSystemCode, gradeId);
  const label = t(labelInfo.key.replace('grades.', ''), labelInfo.params);

  return (
    <Link
      href={`/trin/${gradeId}`}
      className="group block px-3 py-2.5 rounded-xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:bg-primary-subtle"
    >
      <h3 className="font-semibold text-sm">{label}</h3>
      <p className="text-muted text-xs mt-0.5">
        {t('topicsCount', { count: topics.length })} ·{' '}
        {t('lessonsCount', { count: lessonCount })}
      </p>
    </Link>
  );
}
