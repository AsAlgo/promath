'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useEdSystem } from '@/components/ed-system-provider';
import { Flag } from '@/components/nav/flag';
import type { EdSystemCode } from '@/types/education-system';

const systems: EdSystemCode[] = ['DK', 'DE', 'UK', 'US'];

const systemKeys: Record<EdSystemCode, string> = {
  DK: 'dk',
  DE: 'de',
  UK: 'uk',
  US: 'us',
};

export function EdSystemSelector() {
  const { edSystem, setEdSystem, isPending } = useEdSystem();
  const t = useTranslations('edSystem');

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function switchTo(code: EdSystemCode) {
    setOpen(false);
    if (code !== edSystem) {
      setEdSystem(code);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-subtle transition-colors text-sm font-medium"
        aria-label={t('switchSystem')}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {isPending ? (
          <span className="animate-pulse">
            <Flag code={edSystem} />
          </span>
        ) : (
          <Flag code={edSystem} />
        )}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('label')}
          className="absolute right-0 top-full mt-1 min-w-48 rounded-lg border border-border bg-surface shadow-lg py-1 z-50"
        >
          {systems.map((code) => (
            <li key={code} role="option" aria-selected={code === edSystem}>
              <button
                type="button"
                onClick={() => switchTo(code)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  code === edSystem
                    ? 'text-primary font-medium bg-primary-subtle'
                    : 'text-foreground hover:bg-primary-subtle/50'
                }`}
              >
                <span className="inline-flex mr-2">
                  <Flag code={code} />
                </span>
                {t(systemKeys[code])}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
