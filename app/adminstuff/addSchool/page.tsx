"use client";

import React, { useState } from 'react';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    school_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form data:', formData);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/addSchool', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Ensure school_id is included but will be overridden by the backend
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create school');
      }
      alert('School created successfully!');
      // Reset form or redirect as needed
      setFormData({
        school_name: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error creating user');
    }
  };

  return (
    <>
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Add New User
          </h2>
          <form onSubmit={handleSubmit}>

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              School Name:
            </label>
            <input
              type="text"
              name="school name"
              value={formData.school_name}
              onChange={(e) =>
                setFormData({ ...formData, school_name: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />


            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add User
            </button>
          </form>
        </div>
      </div>
    </>
  );
}