"use client";

import React, { useState } from 'react';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    school_id: '',
    password: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    role: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form data:', formData);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/adduser', {
        method: 'POST',
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
        throw new Error(data.message || 'Failed to create user');
      }
      alert('User created successfully!');
      // Reset form or redirect as needed
      setFormData({
        school_id: '',
        password: '',
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        role: '',
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
              School id:
            </label>
            <input
              type="number"
              name="school_id"
              value={formData.school_id}
              onChange={(e) =>
                setFormData({ ...formData, school_id: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Phone number:
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              First Name:
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Last Name:
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Role:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Choose role</option>
              <option value="3">Owner</option>
              <option value="2">Teacher</option>
              <option value="1">Student</option>
            </select>

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