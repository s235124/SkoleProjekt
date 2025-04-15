// app/teacher/[id]/page.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { Users } from 'lucide-react';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    if (params?.id) {
      axios.get(`http://localhost:3001/course/${params.id}`)
        .then(response => setCourse(response.data))
        .catch(error => console.error(error))
        console.log(params.id)
    }
  }, [params?.id])

  if (!course) return <div>Loading...</div>

  return (

      <>
          <div className=' flex w-full h-full bg-slate-50'>
              <div className='flex flex-col w-4/6 h-full bg-fuchsia-500'>
                  <div className='font-bold text-4xl h-2/5 w-full' >
                      {course.course_name}
                  </div>
                  <div className='h-3/5 bg-red-800 w-full flex flex-row'>
                      <div className='text-4xl absolute'> Courses </div>
                      <Card className='w-1/3 mx-2 mt-10 h-20 my-10'>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Course name</CardTitle>
                              <Users className="h-4 w-4 text-blue-500" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold"></div>
                          </CardContent>
                      </Card>
                      <Card className='w-1/3 mx-2 mt-10 h-20'>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Course name</CardTitle>
                              <Users className="h-4 w-4 text-blue-500" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold"></div>
                          </CardContent>
                      </Card>
                  </div>
              </div>
              <div className='flex-auto w-2/6'>
                  <div className='w-full h-2/5 bg-slate-500'>
                      <div className='rounded-full bg-red-800 w-56 h-56 m-auto'></div>
                      <div className=''>
                          <div className='w-full text-center text-slate-900 text-2xl'>
                              First name, Last Name
                          </div>
                          <div className='w-full text-center'>Phone: 22222222</div>
                          <div className='w-full text-center'>Role: 2</div>
                      </div>

                  </div>
                  <div className='w.full text-center text-4xl font-bold underline-offset-8 underline text-slate-900'>
                      Activity
                  </div>
              </div>
          </div>
      </>
  )
}