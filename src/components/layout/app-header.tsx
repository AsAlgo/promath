import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { MainNav } from '@/components/nav/main-nav';
import { MobileNav } from '@/components/nav/mobile-nav';
import { SiteHeader } from '@/components/nav/site-header';
import { ThemeToggle } from '@/components/nav/theme-toggle';
import { LanguageSelector } from '@/components/nav/language-selector';
import { getAllCategories } from '@/lib/curriculum';

export interface NavCategory {
  id: string;
  name: string;
  symbol: string;
  topics: { id: string; name: string }[];
}

export async function AppHeader() {
  const t = await getTranslations('nav');
  const navCategories: NavCategory[] = getAllCategories().map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    topics: c.topics.map((t) => ({ id: t.id, name: t.name })),
  }));

  return (
    <SiteHeader
      actions={
        <>
          <LanguageSelector />
          <ThemeToggle />
          <MobileNav categories={navCategories} />
        </>
      }
    >
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/omraader"
          className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          {t('topics')}
        </Link>
        <Link
          href="/trin"
          className="text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          {t('grades')}
        </Link>
        <MainNav />
      </div>
    </SiteHeader>
  );
}
