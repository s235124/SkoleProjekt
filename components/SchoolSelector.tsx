// components/SchoolSelector.tsx
//deepseek made this code more readable
"use client";
import { useSelectedSchool } from '@/app/adminstuff/selectedSchoolContext';


 interface School {
    school_id: number;
    school_name: string;
  }
export default function SchoolSelector({ schools, onSelect, selectedSchoolId }: { schools: School[]; onSelect: (schoolId: number) => void; selectedSchoolId: number }) {
  const { setSelectedSchoolId } = useSelectedSchool();
 
  const handleSelect = (schoolId: number) => {
    setSelectedSchoolId(schoolId);
    onSelect(schoolId);
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select School</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schools.map((School) => (
          <button
            key={School.school_id}
            onClick={() => handleSelect(School.school_id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedSchoolId === School.school_id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-left">
              <p className="font-medium">{School.school_name}</p>
              <p className="text-sm text-gray-500">ID: {School.school_id}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}