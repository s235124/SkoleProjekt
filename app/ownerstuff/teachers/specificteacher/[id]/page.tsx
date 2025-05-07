"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';
import router from 'next/router';
import { env } from '../../../../../env.mjs';

interface course {
  course_id: number;
  course_name: string;
  course_description: string;
}
interface teacher {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
export default function TeacherDetail() {
  const params = useParams();
  const teacherId = params?.id;
  const [teacher, setTeacher] = useState<teacher>();
  const [courses, setCourses] = useState<course[]>([]);
  const [loading, setLoading] = useState(true);
  const getCourses = (id: string | string[]) => {
    if (!id) {
      console.error('User not found');
      return;
    }
    axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/teacher/courses/${id}`)
    .then((response) => { if (response.data.length > 0) {
        setCourses(response.data) }
        else { console.log('No courses found') }
        
    }).catch((error) => {
        console.log(error)
    })

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teacher details
        const teacherResponse = await axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/teacher/${params.id}`);
        setTeacher(teacherResponse.data);

      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchData();
      getCourses(teacherId);
    }

  }, [params.id, teacherId]);

  if (loading) {
    return <div className="p-8 text-center">Loading teacher information...</div>;
  }

  if (!teacher) {
    return <div className="p-8 text-center text-red-500">Teacher not found</div>;
  }
 
  const listItems = <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {courses.map((course) => (
    <Card 
      key={course.course_id}
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={() => router.push(`/teacherstuff/courses/specificcourse/${course.course_id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{course.course_name}</CardTitle>
        <Book className="h-4 w-4 text-blue-500" /> {/* Assuming you have a Book icon */}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {course.course_description || 'No description available'}
        </div>
        {/* Add any additional course info you want to display here */}
      </CardContent>
    </Card>
  ))}
 </div>
 
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/ownerstuff/teachers" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Teachers
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Profile</h1>
          </div>
        </div>

        {/* Teacher Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xl font-medium">
              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
              {teacher.first_name || 'Unknown'} {teacher.last_name || 'Teacher'}
              </h2>
              <p className="text-gray-600">{teacher.email}</p>
              <p className="text-sm text-gray-500">Phone: {teacher.phone_number}</p>
              <p className="text-sm text-gray-500">
               
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
          {listItems}
        </div>
      </div>
    </div>
  );
}