'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export type ItemStatus =
  | 'pending'
  | 'completed'
  | 'correct'
  | 'incorrect';

interface ItemStepperProps {
  count: number;
  labels: string[];
  statuses?: ItemStatus[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveChange?: (index: number) => void;
  children: (activeIndex: number) => React.ReactNode;
  autoAdvanceDelay?: number;
  autoAdvanceOn?: ItemStatus[];
  renderSummary?: () => React.ReactNode;
  className?: string;
}

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 3L5 8L10 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 3L11 8L6 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ItemStepper({
  count,
  labels,
  statuses,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onActiveChange,
  children,
  autoAdvanceDelay = 1000,
  autoAdvanceOn = ['correct', 'completed'],
  renderSummary,
  className,
}: ItemStepperProps) {
  const [uncontrolledIndex, setUncontrolledIndex] =
    useState(defaultActiveIndex);
  const active = controlledIndex ?? uncontrolledIndex;
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<ItemStatus | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(count - 1, idx));
      if (controlledIndex === undefined) setUncontrolledIndex(clamped);
      onActiveChange?.(clamped);
    },
    [count, controlledIndex, onActiveChange],
  );

  const prev = useCallback(() => go(active - 1), [go, active]);
  const next = useCallback(() => go(active + 1), [go, active]);

  // Auto-advance when current item's status matches trigger
  useEffect(() => {
    if (!statuses || autoAdvanceDelay <= 0) return;
    const currentStatus = statuses[active];
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = currentStatus;

    if (
      currentStatus &&
      autoAdvanceOn.includes(currentStatus) &&
      currentStatus !== prevStatus &&
      active < count - 1
    ) {
      const timer = setTimeout(() => go(active + 1), autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [statuses, active, autoAdvanceDelay, autoAdvanceOn, count, go]);

  // Update prevStatusRef when active index changes
  useEffect(() => {
    prevStatusRef.current = statuses?.[active];
  }, [active, statuses]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Keyboard navigation (vertical for desktop sidebar)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'Home':
          e.preventDefault();
          go(0);
          break;
        case 'End':
          e.preventDefault();
          go(count - 1);
          break;
      }
    },
    [prev, next, go, count],
  );

  const allAnswered =
    statuses &&
    statuses.every((s) => s === 'correct' || s === 'incorrect');

  const navItemClass = (
    status: ItemStatus,
    isCurrent: boolean,
  ) =>
    cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left w-full',
      isCurrent
        ? status === 'correct'
          ? 'bg-success/10 text-success font-bold'
          : status === 'incorrect'
            ? 'bg-error/10 text-error font-bold'
            : 'bg-primary-subtle text-primary font-bold'
        : status === 'correct'
          ? 'text-success/70 hover:bg-success/5'
          : status === 'incorrect'
            ? 'text-error/70 hover:bg-error/5'
            : status === 'completed'
              ? 'text-primary/70 hover:bg-primary-subtle/50'
              : 'text-muted hover:bg-primary-subtle/30',
    );

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col', className)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Desktop: sidebar + content */}
      <div className="hidden sm:flex gap-4">
        {/* Sidebar nav */}
        <div className="w-44 shrink-0">
          <nav role="tablist" className="flex flex-col gap-1">
            {Array.from({ length: count }, (_, i) => {
              const status = statuses?.[i] ?? 'pending';
              const isCurrent = i === active;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => go(i)}
                  className={navItemClass(status, isCurrent)}
                >
                  <span className="truncate">{labels[i]}</span>
                </button>
              );
            })}
          </nav>

          {/* Summary below nav */}
          {allAnswered && renderSummary && (
            <div className="mt-3">{renderSummary()}</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">{children(active)}</div>
      </div>

      {/* Mobile: dropdown + prev/next */}
      <div className="sm:hidden">
        {/* Navigation row */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={prev}
            disabled={active === 0}
            className="p-1.5 rounded-md text-muted hover:text-primary disabled:opacity-30 disabled:cursor-default transition-colors cursor-pointer"
            aria-label="Forrige"
          >
            <ArrowLeft />
          </button>

          {/* Dropdown */}
          <div ref={dropdownRef} className="relative flex-1">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                'bg-primary-subtle text-primary font-bold',
              )}
            >
              <span className="truncate flex-1 text-left">
                {labels[active]}
              </span>
              <ChevronDown />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
                {Array.from({ length: count }, (_, i) => {
                  const status = statuses?.[i] ?? 'pending';
                  const isCurrent = i === active;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        go(i);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors cursor-pointer text-left',
                        isCurrent
                          ? status === 'correct'
                            ? 'bg-success/10 text-success font-bold'
                            : status === 'incorrect'
                              ? 'bg-error/10 text-error font-bold'
                              : 'bg-primary-subtle text-primary font-bold'
                          : status === 'correct'
                            ? 'text-success/70 hover:bg-success/5'
                            : status === 'incorrect'
                              ? 'text-error/70 hover:bg-error/5'
                              : status === 'completed'
                                ? 'text-primary/70 hover:bg-primary-subtle/50'
                                : 'text-muted hover:bg-primary-subtle/30',
                      )}
                    >
                      <span className="truncate">{labels[i]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={active === count - 1}
            className="p-1.5 rounded-md text-muted hover:text-primary disabled:opacity-30 disabled:cursor-default transition-colors cursor-pointer"
            aria-label="Naeste"
          >
            <ArrowRight />
          </button>
        </div>

        {/* Content */}
        {children(active)}

        {/* Summary */}
        {allAnswered && renderSummary && (
          <div className="mt-4">{renderSummary()}</div>
        )}
      </div>
    </div>
  );
}
