"use client";

import React, { useState } from 'react';

export default function CreateCourseForm() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form data:', formData);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/createcourse', {
        method: 'POST',
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
      alert(error.message || 'Error creating course');
    }
  };

  return (
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
      </div>
    </div>
  );
}