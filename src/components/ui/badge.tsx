import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning';

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-primary-subtle text-primary',
  success: 'bg-success/10 text-success border border-success/25',
  error: 'bg-error/10 text-error border border-error/25',
  warning: 'bg-accent/10 text-accent border border-accent/25',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
