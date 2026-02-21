'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react';
import type { EdSystemCode } from '@/types/education-system';
import { setEdSystemAction } from '@/app/actions/set-ed-system';

interface EdSystemContextValue {
  edSystem: EdSystemCode;
  setEdSystem: (code: EdSystemCode) => void;
  isPending: boolean;
}

const EdSystemContext = createContext<EdSystemContextValue | null>(null);

export function EdSystemProvider({
  initial,
  children,
}: {
  initial: EdSystemCode;
  children: React.ReactNode;
}) {
  const [edSystem, setLocal] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const setEdSystem = useCallback((code: EdSystemCode) => {
    setLocal(code);
    startTransition(async () => {
      await setEdSystemAction(code);
    });
  }, []);

  return (
    <EdSystemContext.Provider value={{ edSystem, setEdSystem, isPending }}>
      {children}
    </EdSystemContext.Provider>
  );
}

export function useEdSystem(): EdSystemContextValue {
  const ctx = useContext(EdSystemContext);
  if (!ctx) {
    throw new Error('useEdSystem must be used within EdSystemProvider');
  }
  return ctx;
}
