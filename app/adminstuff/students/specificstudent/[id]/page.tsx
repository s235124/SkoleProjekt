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
interface Student {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}




export default function StudentDetail() {
  const params = useParams();
  const studentId = params?.id;
  const [student, setStudent] = useState<Student>();
  const [courses, setCourses] = useState<course[]>([]);
  const [loading, setLoading] = useState(true);
  const getCourses = (id: string | string[]) => {
    if (!id) {
      console.error('User not found');
      return;
    }
    axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/students/${id}/courses`)
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
        // Fetch student details
        const studentResponse = await axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/teacher/${params.id}`);
        setStudent(studentResponse.data);

      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
      getCourses(studentId);
    }

  }, [params.id, studentId]);

  if (loading) {
    return <div className="p-8 text-center">Loading student information...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-red-500">Student not found</div>;
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
            <Link href="/ownerstuff/students" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Students
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          </div>
        </div>

        {/* Student Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xl font-medium">
              {student.first_name?.[0]}{student.last_name?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
              {student.first_name || 'Unknown'} {student.last_name || 'Student'}
              </h2>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-sm text-gray-500">Phone: {student.phone_number}</p>
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