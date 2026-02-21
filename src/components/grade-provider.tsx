'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react';
import type { GradeId } from '@/types/education-system';
import { setGradeAction } from '@/app/actions/set-grade';
import { useEdSystem } from '@/components/ed-system-provider';
import { isValidGradeId } from '@/lib/education-systems';

interface GradeContextValue {
  grades: GradeId[];
  setGrades: (grades: GradeId[]) => void;
  isPending: boolean;
}

const GradeContext = createContext<GradeContextValue | null>(null);

export function GradeProvider({
  initial,
  children,
}: {
  initial: GradeId[];
  children: React.ReactNode;
}) {
  const [raw, setLocal] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const { edSystem } = useEdSystem();

  // Filter out any grades invalid for current edSystem
  const grades = raw.filter((g) => isValidGradeId(edSystem, g));

  const setGrades = useCallback((gs: GradeId[]) => {
    setLocal(gs);
    startTransition(async () => {
      await setGradeAction(gs);
    });
  }, []);

  return (
    <GradeContext.Provider value={{ grades, setGrades, isPending }}>
      {children}
    </GradeContext.Provider>
  );
}

export function useGrade(): GradeContextValue {
  const ctx = useContext(GradeContext);
  if (!ctx) {
    throw new Error('useGrade must be used within GradeProvider');
  }
  return ctx;
}
