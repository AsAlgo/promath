import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { EdSystemProvider } from '@/components/ed-system-provider';
import { GradeProvider } from '@/components/grade-provider';
import { getEdSystemCode } from '@/lib/ed-system-cookie';
import { getGradeFromCookie } from '@/lib/grade-cookie';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const edSystem = await getEdSystemCode(locale);
  const grade = await getGradeFromCookie();

  return (
    <NextIntlClientProvider messages={messages}>
      <EdSystemProvider initial={edSystem}>
        <GradeProvider initial={grade}>{children}</GradeProvider>
      </EdSystemProvider>
    </NextIntlClientProvider>
  );
}
