import { AppHeader } from '@/components/layout/app-header';
import { Footer } from '@/components/layout/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AppHeader />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
