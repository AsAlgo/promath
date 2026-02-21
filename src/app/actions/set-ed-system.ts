'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { EdSystemCode } from '@/types/education-system';
import { ED_SYSTEMS } from '@/lib/education-systems';

export async function setEdSystemAction(code: EdSystemCode) {
  if (!(code in ED_SYSTEMS)) return;
  const jar = await cookies();
  jar.set('ed-system', code, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
