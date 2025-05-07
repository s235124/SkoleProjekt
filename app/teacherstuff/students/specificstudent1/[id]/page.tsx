// app/teacher/[id]/student/[studentId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Book, CalendarDays, ClipboardCheck } from 'lucide-react';
import { env } from '../../../../../env.mjs';
interface Student {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Course {
  course_id: number;
  course_name: string;
}

interface Module {
  module_id: number;
  module_name: string;
  module_date: string;
  module_start_time: string;
  module_end_time: string;
}

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;
console.log(studentId);
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stuRes, courseRes, modRes] = await Promise.all([
          axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/student/${studentId}`),
          axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/students/${studentId}/courses`),
          axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/students/${studentId}/modules`),
        ]);
        setStudent(stuRes.data);
        setCourses(courseRes.data);
        setModules(modRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!student) return <div>No student found</div>;

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="flex items-center gap-4">
          <Users className="w-6 h-6" />
          <CardTitle className="text-xl">
            {student.first_name} {student.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Email: {student.email}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            <Book className="w-4 h-4 mr-2" /> Courses
          </TabsTrigger>
          <TabsTrigger value="modules">
            <CalendarDays className="w-4 h-4 mr-2" /> Modules
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <ClipboardCheck className="w-4 h-4 mr-2" /> Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          {courses.length === 0 ? (
            <p>No enrolled courses.</p>
          ) : (
            <ScrollArea className="h-48">
              <ul className="space-y-2">
                {courses.map(c => (
                  <li
                    key={c.course_id}
                    className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/courses/${c.course_id}`)}
                  >
                    {c.course_name}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="modules">
          {modules.length === 0 ? (
            <p>No modules attended yet.</p>
          ) : (
            <ScrollArea className="h-48">
              <ul className="space-y-2">
                {modules.map(m => (
                  <li key={m.module_id} className="p-2 border rounded">
                    <div className="font-medium">{m.module_name}</div>
                    <div className="text-sm text-gray-600">
                      {m.module_date} {m.module_start_time}-{m.module_end_time}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
