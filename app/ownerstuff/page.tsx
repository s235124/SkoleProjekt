// components/OwnerDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, GraduationCap, ClipboardList, BarChart, LineChart as LineIcon, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { env } from '../../env.mjs';

interface Stats {
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  totalModules: number;
  pendingLessons: number;
  completedLessons: number;
  lessonsTrend: { date: string; count: number }[];
}

export default function OwnerDashboard() {
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get(env.NEXT_PUBLIC_API_BASE_URL+'/getUser', { withCredentials: true }),
          axios.get<Stats>(env.NEXT_PUBLIC_API_BASE_URL+'/ownerStats', { withCredentials: true })
        ]);
        setEmail(userRes.data.email);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard…</div>;
  if (error || !stats) return <div className="p-8 text-red-600">{error || 'No data'}</div>;
console.log(stats);
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-semibold">Welcome back, <span className="text-blue-600">{email}</span></h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Instructors</CardTitle>
            <Users className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInstructors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Students</CardTitle>
            <GraduationCap className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Courses</CardTitle>
            <ClipboardList className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Modules</CardTitle>
            <BarChart className="w-5 h-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalModules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Upcoming Modules
            </CardTitle>
            <LineIcon className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingLessons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Past Modules</CardTitle>
            <ClipboardList className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedLessons}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <h2 className="text-xl font-medium mb-4">Lessons Trend (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.lessonsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
