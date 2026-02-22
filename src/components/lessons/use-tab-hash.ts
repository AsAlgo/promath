import { useState, useCallback, useEffect } from 'react';

/**
 * Syncs tab index with URL hash.
 * - Reads hash on mount to restore tab
 * - Updates hash on tab change (replaceState to avoid history spam)
 * - Listens for popstate (back/forward)
 */
export function useTabHash(keys: readonly string[]) {
  const [section, setSection] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const hash = window.location.hash.slice(1);
    const idx = keys.indexOf(hash);
    return idx >= 0 ? idx : 0;
  });

  const go = useCallback(
    (i: number) => {
      setSection(i);
      window.history.replaceState(null, '', `#${keys[i]}`);
    },
    [keys],
  );

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1);
      const idx = keys.indexOf(hash);
      if (idx >= 0) setSection(idx);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [keys]);

  // Set initial hash if none present
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${keys[0]}`);
    }
  }, [keys]);

  return [section, go] as const;
}
