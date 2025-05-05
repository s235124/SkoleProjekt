"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/calendar';
import axios from 'axios';

export default function CreateModulePage() {
  const [user, setUser] = useState(null); // Initialize as null for explicit checks

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/getUser', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Handle errors (e.g., redirect to login)
    }
  }, []); // Memoize with useCallback to prevent unnecessary re-renders

  useEffect(() => {
    getUser();
  }, [getUser]); // Effect runs once on mount due to stable getUser

  return (
    <div className='h-full'>
      {user ? (
        <Calendar schoolId={user.school_id} />
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
  );
}