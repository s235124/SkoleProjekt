"use client";
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingLabelInput from '@/components/FloatingLabelInput';
import router from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Coursesview() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
  });
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
     axios.get('http://localhost:3001/getUser')
     .then((response) => { if (response.data.length > 0) {
         setCourses(response.data) }
         else { console.log('No users found') }
         
     }).catch((error) => {
         console.log(error)
     })
 }, [])
 
 const listItems = <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 {courses.map((course) => (
   <Card 
     key={course.course_id}
     className="hover:shadow-lg transition-all cursor-pointer"
     onClick={() => router.push(`/ownerstuff/courses/specificcourse/${course.course_id}`)}
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

            <Link href="/teacherstuff/courses/createcourse">
              <button
                className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
                Add Course
              </button>
            </Link>

          </div>
        </div>

      <ScrollArea className="m-auto w-4/5 h-3/5 flex flex-row border-black border-b-[2px]">

      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      </ScrollArea>
      </div>  
    </div>
    </>
  );
}