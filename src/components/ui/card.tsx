import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CardProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ href, className, children }: CardProps) {
  const classes = cn(
    'relative p-7 sm:p-8 rounded-2xl bg-surface border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
