"use client";
import Link from 'next/link';
import React from 'react'
import { useState } from 'react';
import { env } from '../../../../env.mjs';

export default function CreateCourseForm() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form data:', formData);
    e.preventDefault();
    try {
      const response = await fetch(env.NEXT_PUBLIC_API_BASE_URL+'/createcourse', {
        method: 'POST',
        credentials: 'include',
        headers: {
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
      if (error instanceof Error) {
        alert(error.message || 'Error creating course');
      } else {
        alert('An unknown error occurred');
      }
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
        <Link href="/ownerstuff/courses">
              <button
                className="top-1 w-full flex items-center rounded bg-slate-800 py-2 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
                View courses
              </button>
            </Link>
      </div>
          
    </div>

    </>
  );
}