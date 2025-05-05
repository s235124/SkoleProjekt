// app/adminstuff/selectedSchoolContext.ts
"use client";
//chat cooked, it rewrote old code and stores school id in local storage instead
import { createContext, useContext, useState, useEffect } from 'react';

type SelectedSchoolContextType = {
  selectedSchoolId: number | null;
  setSelectedSchoolId: (id: number | null) => void;
};

const SelectedSchoolContext = createContext<SelectedSchoolContextType>({
  selectedSchoolId: null,
  setSelectedSchoolId: () => {},
});

export const useSelectedSchool = () => useContext(SelectedSchoolContext);

export const SelectedSchoolProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from localStorage (runs only in the browser)
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('selectedSchoolId');
    return stored ? Number(stored) : null;
  });

  // Persist whenever selectedSchoolId changes
  useEffect(() => {
    if (selectedSchoolId !== null) {
      window.localStorage.setItem('selectedSchoolId', String(selectedSchoolId));
    } else {
      window.localStorage.removeItem('selectedSchoolId');
    }
  }, [selectedSchoolId]);

  return (
    <SelectedSchoolContext.Provider value={{ selectedSchoolId, setSelectedSchoolId }}>
      {children}
    </SelectedSchoolContext.Provider>
  );
};