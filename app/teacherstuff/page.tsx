/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react'
import { CalendarDays, Users, GraduationCap, ClipboardCheck, Car, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { env } from '../../env.mjs';
import axios from 'axios'

// Mock data (replace with actual data fetching in a real application)
const mockData = {
  totalInstructors: 10,
  totalStudents: 75,
  totalTeams: 8,
  pendingLessons: 15,
  completedLessons: 30,
  averageRating: 4.5
}

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalInstructors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total teams</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalTeams}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="mt-6">
        <TabsList>
          <TabsTrigger value="lessons">Lessons Overview</TabsTrigger>
          <TabsTrigger value="ratings">School Rating</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Lessons</CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.pendingLessons}</div>
                <p className="text-xs text-muted-foreground">Awaiting instructor approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.completedLessons}</div>
                <p className="text-xs text-muted-foreground">In the last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Average School Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <div className="text-2xl font-bold">{mockData.averageRating.toFixed(1)}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Based on student feedback</p>
              <p className="text-sm text-muted-foreground">out of 5</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}