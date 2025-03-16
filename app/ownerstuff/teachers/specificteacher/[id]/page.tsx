// app/teacher/[id]/page.tsx
"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Teacher {
  id: string;
  email: string;
  role: number;
  // add other fields you need
}

export default function TeacherPage() {
  const params = useParams()
  const [teacher, setTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    if (params?.id) {
      axios.get(`http://localhost:3001/teacher/${params.id}`)
        .then(response => setTeacher(response.data))
        .catch(error => console.error(error))
    }
  }, [params?.id])

  if (!teacher) return <div>Loading...</div>

  return (

      <>
          <div className=' flex w-full h-full bg-slate-50'>
              <div className='flex flex-auto w-4/6 h-full bg-fuchsia-500'>
                  <div className='font-bold text-4xl' >
                      {teacher.email}'s profile
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