"use client";

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import router from 'next/router';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
}

export default function Students() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get<User[]>('http://localhost:3001/getAllUsers')
      .then((response) => {
        if (response.data.length > 0) {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const filteredTeachers = users
    .filter(user => 
      user.role === 2 &&
      (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Directory</h1>
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search teachers..."
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
              filteredTeachers.map((user) => (
                <div 
                  key={user.id} 
                  className="group p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/teacher/${user.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Teacher
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                {users.length === 0 ? 'Loading...' : 'No teachers found'}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}