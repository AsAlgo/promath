import type { EdSystemCode, GradeId } from '@/types/education-system';
import type { Category, Lesson, Topic } from '@/types/topic';
import { parseDKGrades } from './grade-parsers';
import { ED_SYSTEMS, getGradeOrder } from './education-systems';
import curriculumData from '@/data/curriculum.json';

// ── Raw types from JSON ──

interface RawLesson {
  id: string;
  name: string;
  countries: Record<string, { grades: string; notes?: string }>;
}

interface RawTopic {
  id: string;
  name: string;
  description: string;
  lessons: RawLesson[];
}

interface RawCategory {
  id: string;
  name: string;
  symbol: string;
  description: string;
  topics: RawTopic[];
}

const raw = curriculumData as { categories: RawCategory[] };

// ── Build base model (system-agnostic) ──

const allCategories: Category[] = [];
const categoryMap = new Map<string, Category>();
const topicMap = new Map<string, Topic>();
const lessonMap = new Map<string, Lesson>();
const globalLessonMap = new Map<string, Lesson>();

for (const rc of raw.categories) {
  const category: Category = {
    id: rc.id,
    name: rc.name,
    symbol: rc.symbol,
    description: rc.description,
    topics: [],
  };

  for (const rt of rc.topics) {
    const topic: Topic = {
      id: rt.id,
      name: rt.name,
      description: rt.description,
      categoryId: rc.id,
      grades: [], // will be populated per-system
      lessons: [],
    };

    for (const rl of rt.lessons) {
      const lesson: Lesson = {
        id: rl.id,
        name: rl.name,
        topicId: rt.id,
        categoryId: rc.id,
        countries: rl.countries as Lesson['countries'],
      };

      topic.lessons.push(lesson);
      lessonMap.set(`${rt.id}/${rl.id}`, lesson);
      globalLessonMap.set(rl.id, lesson);
    }

    category.topics.push(topic);
    topicMap.set(rt.id, topic);
  }

  allCategories.push(category);
  categoryMap.set(rc.id, category);
}

// ── Per-system index ──

interface SystemIndex {
  topicsByGrade: Map<GradeId, Topic[]>;
  lessonGrades: Map<string, GradeId[]>; // lessonId → grades
  lessonPrimaryGrade: Map<string, GradeId>; // lessonId → primary grade
  topicGrades: Map<string, GradeId[]>; // topicId → sorted grades
}

function mapDKGradesToSystem(
  dkGrades: GradeId[],
  targetSystem: EdSystemCode,
): GradeId[] {
  if (targetSystem === 'DK') return dkGrades;

  const targetDef = ED_SYSTEMS[targetSystem];
  const mapped = new Set<GradeId>();

  for (const dkId of dkGrades) {
    const order = getGradeOrder('DK', dkId);
    if (order < 0) continue;
    const target = targetDef.grades.find((g) => g.order === order);
    if (target) mapped.add(target.id);
  }

  return [...mapped];
}

function buildSystemIndex(system: EdSystemCode): SystemIndex {
  const topicsByGrade = new Map<GradeId, Topic[]>();
  const lessonGrades = new Map<string, GradeId[]>();
  const lessonPrimaryGrade = new Map<string, GradeId>();
  const topicGrades = new Map<string, GradeId[]>();

  for (const cat of allCategories) {
    for (const topic of cat.topics) {
      const gradeSet = new Set<GradeId>();

      for (const lesson of topic.lessons) {
        // Parse DK grades from country data (primary source)
        const dkText = lesson.countries?.DK?.grades ?? '';
        const dkGrades = parseDKGrades(dkText);

        // Map to target system
        const grades = mapDKGradesToSystem(dkGrades, system);

        lessonGrades.set(lesson.id, grades);
        if (grades.length > 0) {
          lessonPrimaryGrade.set(lesson.id, grades[0]);
        }

        for (const g of grades) gradeSet.add(g);
      }

      const sortedGrades = [...gradeSet].sort((a, b) => {
        return getGradeOrder(system, a) - getGradeOrder(system, b);
      });
      topicGrades.set(topic.id, sortedGrades);

      for (const g of sortedGrades) {
        if (!topicsByGrade.has(g)) topicsByGrade.set(g, []);
        topicsByGrade.get(g)!.push(topic);
      }
    }
  }

  return { topicsByGrade, lessonGrades, lessonPrimaryGrade, topicGrades };
}

// Build indexes for all systems at module load
const indexes: Record<EdSystemCode, SystemIndex> = {
  DK: buildSystemIndex('DK'),
  DE: buildSystemIndex('DE'),
  UK: buildSystemIndex('UK'),
  US: buildSystemIndex('US'),
};

// ── Public query functions (system-agnostic) ──

export function getAllCategories(): Category[] {
  return allCategories;
}

export function getCategoryById(id: string): Category | undefined {
  return categoryMap.get(id);
}

export function getTopicById(id: string): Topic | undefined {
  return topicMap.get(id);
}

export function getTopicsByCategory(categoryId: string): Topic[] {
  return categoryMap.get(categoryId)?.topics ?? [];
}

export function getLessonsForTopic(topicId: string): Lesson[] {
  return topicMap.get(topicId)?.lessons ?? [];
}

export function getLessonById(
  topicId: string,
  lessonId: string,
): Lesson | undefined {
  return lessonMap.get(`${topicId}/${lessonId}`);
}

export function getLessonBySlug(lessonId: string): Lesson | undefined {
  return globalLessonMap.get(lessonId);
}

// ── System-aware query functions ──

export function getTopicsForGrade(
  system: EdSystemCode,
  gradeId: GradeId,
): Topic[] {
  return indexes[system].topicsByGrade.get(gradeId) ?? [];
}

export function getTopicGrades(
  system: EdSystemCode,
  topicId: string,
): GradeId[] {
  return indexes[system].topicGrades.get(topicId) ?? [];
}

export function getLessonGrades(
  system: EdSystemCode,
  lessonId: string,
): GradeId[] {
  return indexes[system].lessonGrades.get(lessonId) ?? [];
}

export function getLessonPrimaryGrade(
  system: EdSystemCode,
  lessonId: string,
): GradeId | undefined {
  return indexes[system].lessonPrimaryGrade.get(lessonId);
}

export function getLessonsForGradeAndTopic(
  system: EdSystemCode,
  gradeId: GradeId,
  topicId: string,
): Lesson[] {
  const idx = indexes[system];
  return (topicMap.get(topicId)?.lessons ?? []).filter((l) => {
    const primary = idx.lessonPrimaryGrade.get(l.id);
    return primary === gradeId;
  });
}

export function getLessonCountForGradeAndTopic(
  system: EdSystemCode,
  gradeId: GradeId,
  topicId: string,
): number {
  return getLessonsForGradeAndTopic(system, gradeId, topicId).length;
}

export function getCategoriesForGrade(
  system: EdSystemCode,
  gradeId: GradeId,
): Category[] {
  const topicGrades = indexes[system].topicGrades;
  return allCategories
    .map((cat) => ({
      ...cat,
      topics: cat.topics.filter((t) => {
        const grades = topicGrades.get(t.id) ?? [];
        return grades.includes(gradeId);
      }),
    }))
    .filter((cat) => cat.topics.length > 0);
}
