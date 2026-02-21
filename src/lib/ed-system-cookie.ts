import { cookies } from 'next/headers';
import type { EdSystemCode } from '@/types/education-system';
import { defaultEdSystemForLocale, ED_SYSTEMS } from './education-systems';

const COOKIE_NAME = 'ed-system';

export async function getEdSystemCode(locale?: string): Promise<EdSystemCode> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (raw && raw in ED_SYSTEMS) return raw as EdSystemCode;
  return defaultEdSystemForLocale(locale ?? 'da');
}
