'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { GradeId } from '@/types/education-system';

export async function setGradeAction(grades: GradeId[]) {
  const jar = await cookies();
  if (grades.length === 0) {
    jar.delete('grade');
  } else {
    jar.set('grade', grades.join(','), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }
  revalidatePath('/', 'layout');
}
