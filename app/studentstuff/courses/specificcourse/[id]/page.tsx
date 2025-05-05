// app/teacher/[id]/page.tsx
"use client"
import TeacherAssignmentModal from '@/components/teacherAssign';
import DeleteConfirmation from '@/components/deleteConfirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StudentEnrollmentModal from '@/components/studentAssign';
export default function CoursePage() {
    const router = useRouter()
    const params = useParams()
    const [me, setMe] = useState()
    const [course, setCourse] = useState()
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [assignmentOpen, setAssignmentOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    useEffect(() => {
        axios.get(`http://localhost:3001/getUser`)
        .then((response) => {
            if (response.data.length > 0) {
                console.log(response.data)
                setMe(response.data)
            }
            else { console.log('we cant find you') }

        }).catch((error) => {
            console.log("vvvv" + error)
        })
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


    //student stuff
    const [enrollmentOpen, setEnrollmentOpen] = useState(false);

    // Add useEffect for fetching students
    useEffect(() => {
        if (params?.id) {
            axios.get(`http://localhost:3001/courses/${params.id}/students`)
                .then(response => setStudents(response.data))
                .catch(console.error);

        }
    }, [params?.id]);

    // Add enrollment handlers

    const handleUnenrollStudent = async (studentId) => {
        try {
            await axios.delete(`http://localhost:3001/courses/${params.id}/students/delete/${me.user_id}`);
            setStudents(students.filter(s => s.user_id !== studentId));
        } catch (error) {
            console.error('Unenrollment failed:', error);
            alert('Failed to unenroll student');
        }
    };



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

                        </div>
                        <div className='basis-1/6 bg-violet-200"'>
                        </div>
                        <div className='basis-1/6 bg-violet-200"'>

                            <button
                                onClick={() => setDeleteDialogOpen(true)}
                                className="top-1 flex items-center rounded bg-red-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                                </svg>
                                Leave Course
                            </button>

                        </div>
                        <div className='basis-1/6 bg-violet-200"'>


                        </div>
                    </div>
                    <ScrollArea className="m-auto w-4/5 h-3/5 border-black border-b-[2px]">
                        <div className="flex flex-col">                            <div className="w-full flex items-center my-4">
                            <div className="flex-1 border-t border-slate-300"></div>
                            <span className="px-3 text-slate-600 text-sm font-medium uppercase tracking-wide">Teachers</span>
                            <div className="flex-1 border-t border-slate-300"></div>
                        </div>
                            {teachers.map((teacher) => (
                                <div
                                    key={teacher.user_id}
                                    className='bg-white hover:bg-slate-100 transition-all cursor-pointer p-4 border-b flex justify-between items-center'
                                >
                                    <div
                                        className='flex-1 flex items-center gap-4'
                                        onClick={() => router.push(`/ownerstuff/teachers/specificteacher/${teacher.user_id}`)}
                                    >
                                        <div className='w-8 h-8 rounded-full bg-violet-400'></div>
                                        <div>
                                            <p className='font-medium'>{teacher.first_name} {teacher.last_name}</p>
                                            <p className='text-sm text-gray-600'>{teacher.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="w-full flex items-center my-4">
                                <div className="flex-1 border-t border-slate-300"></div>
                                <span className="px-3 text-slate-600 text-sm font-medium uppercase tracking-wide">Students</span>
                                <div className="flex-1 border-t border-slate-300"></div>
                            </div>
                            {students.map((student) => (
                                <div
                                    key={student.user_id}
                                    className='bg-white hover:bg-slate-100 transition-all cursor-pointer p-4 border-b flex justify-between items-center'
                                >
                                    <div className='flex-1 flex items-center gap-4'>
                                        <div className='w-8 h-8 rounded-full bg-violet-400'></div>
                                        <div>
                                            <p className='font-medium'>{student.first_name} {student.last_name}</p>
                                            <p className='text-sm text-gray-600'>{student.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <DeleteConfirmation
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleUnenrollStudent}
            />
        </>
    )
}