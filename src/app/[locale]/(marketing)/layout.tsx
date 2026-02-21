import { AppHeader } from '@/components/layout/app-header';
import { Footer } from '@/components/layout/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AppHeader />
      {children}
      <Footer />
    </div>
  );
}
