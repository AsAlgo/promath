import { cookies } from 'next/headers';
import type { GradeId } from '@/types/education-system';

const COOKIE_NAME = 'grade';

export async function getGradeFromCookie(): Promise<GradeId[]> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  return raw.split(',').filter(Boolean) as GradeId[];
}
