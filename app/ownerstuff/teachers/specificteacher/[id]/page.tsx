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
    <div className="p-4">
      <h1 className="text-2xl font-bold">Teacher Profile</h1>
      <p>Email: {teacher.email}</p>
      {/* Add more teacher details here */}
    </div>
  )
}