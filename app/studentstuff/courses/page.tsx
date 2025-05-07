"use client";
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface course {
  course_id: number;
  course_name: string;
  course_description: string;
}
interface user {
  id: number;
  email: string;
  role: number;
  school_id: number;
}
export default function Coursesview() {
  const router = useRouter();

  const [courses, setCourses] = useState<course[]>([]);
  const [user, setUser] = useState<user>();

  
  const getUser = () => {
    axios.get(`http://localhost:3001/getUser`)
      .then((response) => {
        console.log(response.data)
        setUser(response.data);
      }).catch((error) => {
        console.log("vvvv" + error)
      })

    console.log('User data:', user);
  }
  // Fetch courses for the user
  const getCourses = (data: number) => {
    if (!data) {
      console.error('User not found');
      return;
    }
    axios.get(`http://localhost:3001/students/${data}/courses`)
    .then((response) => { if (response.data.length > 0) {
        setCourses(response.data) }
        else { console.log('No courses found') }
        
    }).catch((error) => {
        console.log(error)
    })

  }
   useEffect(() => {
    getUser();
  },);
  useEffect(() => {
    if (!user?.id) return;
    getCourses(user.id);
  }, [user]);

 const listItems = <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 {courses.map((course) => (
   <Card 
     key={course.course_id}
     className="hover:shadow-lg transition-all cursor-pointer"
     onClick={() => router.push(`/studentstuff/courses/specificcourse/${course.course_id}`)}
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
    <>
    <div className="w-full h-full justify-center bg-slate-600 overflow-hidden">
            <div className='w-4/5  h-4 flex flex-row'>
            </div>

      <div className='h-full w-11/12 bg-white m-auto rounded-xl'>

        <div className='w-full m-auto h-16 flex flex-row border-black border-b-[1px] justify-center items-center'>
          <div className='basis-1/6'></div>
          <div className='basis-4/6 font-bold text-5xl'> Courses</div>
          <div className='basis-1/6 bg-violet-200"'>

          </div>
        </div>

      <ScrollArea className="m-auto w-4/5 h-3/5 flex flex-row border-black border-b-[2px]">

      {listItems}
      
      </ScrollArea>
      </div>  
    </div>
    </>
  );
}