"use client"

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { env } from '../../../env.mjs';
import { useSelectedSchool } from '../selectedSchoolContext'; // Fix import path
interface School {
  school_id: number;
  school_name: string;
}

export default function Schools() {
  const { selectedSchoolId } = useSelectedSchool();
  console.log('Selected School ID:', selectedSchoolId);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    axios.get<School[]>(env.NEXT_PUBLIC_API_BASE_URL+'/getSchools')
      .then((response) => {
        if (response.data.length > 0) {
          setSchools(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching schools:', error);
      });
  }, []);

  const filteredTeachers = schools;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/adminstuff/addSchool">
              <button
                className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
                Add school
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search students..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[600px]">
          <div className="divide-y divide-gray-200">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((School) => (
                <div 
                  key={School.school_id} 
                  className="group p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  //onClick={() => router.push(`/adminstuff/schools/specificschool/${School.school_id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {School.school_id?.toString()[0]}{School.school_name?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {School.school_id} {School.school_name}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        School
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                {schools.length === 0 ? 'Loading...' : 'No schools found'}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}