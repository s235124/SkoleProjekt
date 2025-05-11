"use client";
import Link from 'next/link';
import React from 'react'
import { useState } from 'react';
import { useSelectedSchool } from '../../selectedSchoolContext'  // ← two dots, one for createcourses → courses, second for courses → adminstuff
import { env } from '../../../../env.mjs';
export default function CreateCourseForm() {

    const { selectedSchoolId } = useSelectedSchool();
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    if (selectedSchoolId == null) return;
    console.log('Form data:', formData);
    e.preventDefault();
    try {
      const response = await fetch(env.NEXT_PUBLIC_API_BASE_URL+'/createcourse', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'schoolid': selectedSchoolId.toString(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create course');
      }
      alert('Course created successfully!');
      setFormData({
        course_name: '',
        course_description: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert((error as Error).message || 'Error creating course');
    }
  };


 

  return (
    <>
    <div className="flex flex-grow items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Create New Course
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Course Name:
          </label>
          <input
            type="text"
            name="course_name"
            value={formData.course_name}
            onChange={(e) =>
              setFormData({ ...formData, course_name: e.target.value })
            }
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            required
            maxLength={255}
          />

          <label className="block mb-2 text-gray-700 dark:text-gray-200">
            Course Description:
          </label>
          <textarea
            name="course_description"
            value={formData.course_description}
            onChange={(e) =>
              setFormData({ ...formData, course_description: e.target.value })
            }
            className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
            rows={4}
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full dark:bg-green-600 dark:hover:bg-green-700"
          >
            Create Course
          </button>
        </form>
          <div className='h-10 w-1'></div>
          <Link href="/adminstuff/courses">
            <button
              className="top-1 w-full flex items-center rounded bg-slate-800 py-2 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-4 h-4 mr-2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 6-6m-6 6 6 6m-6-6h14"></path></g></svg>
              View courses
            </button>
          </Link>
        </div>

      </div>

    </>
  );
}