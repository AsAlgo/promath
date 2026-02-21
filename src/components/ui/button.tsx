import { cn } from '@/lib/utils';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5',
  outline: 'border border-border hover:bg-surface-alt hover:border-primary/30',
  ghost: 'hover:bg-primary-subtle',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-5 text-sm',
  md: 'h-12 px-8',
  lg: 'h-14 px-10 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-default pointer-events-none',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
