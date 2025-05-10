"use client"

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { env } from '../../../env.mjs';


import { useSelectedSchool } from '../selectedSchoolContext'; // Fix import path
import { Button } from '@/components/ui/button';
interface User {
  user_id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  school_id: number;
}

export default function Teachers() {
  const [loading, setLoading] = useState(true);

  const { selectedSchoolId } = useSelectedSchool();
  console.log('Selected School ID:', selectedSchoolId);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (selectedSchoolId == null) return; // Ensure selectedSchoolId is not null
    setLoading(true);
    axios.get<User[]>(env.NEXT_PUBLIC_API_BASE_URL + '/getAllUsers', {
      headers: {
        'schoolid': selectedSchoolId.toString(),
      }
    })
      .then((response) => {
        if (response.data.length > 0) {
          setUsers(response.data);
        }

      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      }).finally(() => {
        setLoading(false); // Set loading to false after data fetching is complete
      });
  }, [selectedSchoolId]);


  async function removeTeacher(userId: number) {
    try {
      if (selectedSchoolId == null) {
        console.error('No school selected');
        return;
      }

      const response = await axios.delete(
        `${env.NEXT_PUBLIC_API_BASE_URL}/deleteteacher/${userId}`, // Changed endpoint to match server
        {
          headers: {
            'schoolid': selectedSchoolId.toString(),
          },
          withCredentials: true, // Include credentials for CORS
        }
      );

      console.log('Teacher removed successfully:', response.data);
      setUsers(prev => prev.filter(user => user.user_id !== userId));

    } catch (error) {
      console.error('Error removing teacher:');
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Failed to delete teacher');
      }
    }
  }




  const filteredStudents = users
    .filter(user =>
      user.role === 2 && user.school_id === selectedSchoolId && // Filter by role and school ID
      (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link href="/adminstuff/adduser">
              <button
                className="flex items-center rounded bg-slate-800 py-1 px-2.5 text-sm text-white hover:bg-slate-700 transition"
              >
                {/* Icon omitted for brevity */}
                Add teacher
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search teachers..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Search icon */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[600px]">
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading…</div>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map(user => (
                <div
                  key={user.user_id}
                  className="group p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/ownerstuff/students/specificstudent/${user.user_id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Teacher
                      </span>

                      <Button
                        className='bg-red-700 w-28'
                        onClick={(e) => {
                          e.stopPropagation();
                          setTeacherToDelete(user.user_id);
                          setShowConfirm(true);
                        }}
                      >
                        Remove Teacher
                      </Button>

                      {showConfirm && (
                        <div
                          className="fixed inset-0 bg-black/50 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation(); // Add this to prevent background click propagation
                            setShowConfirm(false);
                          }}
                        >
                          <div
                            className="bg-white p-4 rounded-lg"
                            onClick={(e) => e.stopPropagation()} // Prevent modal content clicks from closing
                          >
                            <p>Are you sure you want to delete this teacher?</p>
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Add this
                                  setShowConfirm(false);
                                }}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Add this
                                  setShowConfirm(false);
                                  if (teacherToDelete) removeTeacher(teacherToDelete);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No teachers found</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}