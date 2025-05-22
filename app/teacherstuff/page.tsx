/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react'
import { CalendarDays, Users, GraduationCap, ClipboardCheck, Car, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { env } from '../../env.mjs';
import axios from 'axios'

// Mock data (replace with actual data fetching in a real application)


export default function OwnerDashboard() {
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState();
  useEffect(() => {
    getUser();
    getAllUsers();
  }, [])
  
  const getUser = async () => {
    try {
      const response = await axios.get(env.NEXT_PUBLIC_API_BASE_URL+'/getUser', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUser(response.data);
      console.log('User data:', response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Handle unauthorized access
      }
    }
  };
  
  const getAllUsers = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: env.NEXT_PUBLIC_API_BASE_URL+'/getAllUsers',
      timeout: 8000,
      }).then((response) => {
        setUsers(response.data);
          console.log(response.data);
      }).catch((error) => {
          console.log(error);
      });
  }

  return (
    <div className="p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, Instructor
        <span className='text-blue-500'>.</span>
      </h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      </div>

    </div>
  )
}