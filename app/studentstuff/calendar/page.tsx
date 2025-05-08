"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/calendar';
import axios from 'axios';
import { env } from '../../../env.mjs';
export default function CreateModulePage() {
  interface User {
    school_id: number; // Define the expected properties of the user object
    // Add other properties if needed
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }

  const [user, setUser] = useState<User | null>(null); // Use the User type for state

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(env.NEXT_PUBLIC_API_BASE_URL+'/getUser', {
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