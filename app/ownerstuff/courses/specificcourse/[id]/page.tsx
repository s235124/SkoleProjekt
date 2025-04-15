// app/teacher/[id]/page.tsx
"use client"
import TeacherAssignmentModal from '@/components/teacherAssign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function CoursePage() {
    const params = useParams()
    const [course, setCourse] = useState()
    const [students, setStudents] = useState()
    const [teachers, setTeachers] = useState([])
    const [assignmentOpen, setAssignmentOpen] = useState(false);
    useEffect(() => {
        if (params?.id) {
            axios.get(`http://localhost:3001/course/${params.id}`)
                .then(response => setCourse(response.data))
                .catch(error => console.error(error))
            console.log(params.id)
        }

        axios.get(`http://localhost:3001/courses/${params.id}/teachers`)
            .then((response) => {
                if (response.data.length > 0) {
                    console.log(response.data)
                    setTeachers(response.data)
                }
                else { console.log('No teachers on the course found') }

            }).catch((error) => {
                console.log("vvvv" + error)
            })
    }, [params?.id])
    const listItems1 = teachers.filter(teacher => teacher.role === 2 || teacher.role === 3)
    listItems1.map((teacher) => console.log(teacher.user_id))
    const listItems = listItems1.map((teacher) => (

        <div key={teacher.user_id} className=' bg-white hover:bg-slate-400 transition-all' onClick={() => router.push(`/ownerstuff/teachers/specificteacher/${user.user_id}`)}>
            <div className='w-5/5 m-auto h-16 flex flex-row border-black border-b-[1px]'>
                <div className="basis-64"><div className='rounded-3xl bg-violet-400 h-full w-1/3'></div></div>
                <div className="basis-128">{teacher.email}</div>
            </div>
            <div className='w-5/5 flex flex-row'></div>
        </div>

    ));

    if (!course) return <div>Loading...</div>

    return (

        <>

            <div className="w-full h-full justify-center bg-slate-600 overflow-hidden">
                <div className='w-4/5  h-4 flex flex-row'>
                </div>

                <div className='h-full w-11/12 bg-white m-auto rounded-xl'>

                    <div className='w-4/5 m-auto h-16 flex flex-row border-black border-b-[1px] justify-center items-center'>
                        <div className='basis-1/6 font-bold text-5xl'> {course.course_name} </div>
                        <div className='basis-1/6 font-bold text-5xl'></div>
                        <div className='basis-1/6 bg-violet-200"'>

                            <button
                                onClick={() => setAssignmentOpen(true)}
                                className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                                </svg>
                                Assign Teacher
                            </button>
                        </div>
                        <div className='basis-1/6 bg-violet-200"'>

                            <Link href="/ownerstuff/courses/createcourse">
                                <button
                                    className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                    </svg>
                                    Assign Teacher
                                </button>
                            </Link>

                        </div>
                        <div className='basis-1/6 bg-violet-200"'>

                            <Link href="/ownerstuff/courses/createcourse">
                                <button
                                    className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                    </svg>
                                    Delete Course
                                </button>
                            </Link>

                        </div>
                        <div className='basis-1/6 bg-violet-200"'>

                            <Link href="/ownerstuff/courses/createcourse">
                                <button
                                    className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                    </svg>
                                    Delete Course
                                </button>
                            </Link>

                        </div>
                    </div>
                    <ScrollArea className="m-auto w-4/5 h-3/5 border-black border-b-[2px]">
                        <div className="flex flex-col">
                            {teachers
                                .map((teacher) => (
                                    <div
                                        key={teacher.user_id}
                                        className='bg-white hover:bg-slate-100 transition-all cursor-pointer p-4 border-b'
                                        onClick={() => router.push(`/ownerstuff/teachers/specificteacher/${teacher.user_id}`)}
                                    >
                                        <div className='flex items-center gap-4'>
                                            <div className='w-8 h-8 rounded-full bg-violet-400'></div>
                                            <div>
                                                <p className='font-medium'>{teacher.first_name} {teacher.last_name}</p>
                                                <p className='text-sm text-gray-600'>{teacher.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <TeacherAssignmentModal
                courseId={params.id}
                open={assignmentOpen}
                onOpenChange={setAssignmentOpen}
            />
        </>
    )
}