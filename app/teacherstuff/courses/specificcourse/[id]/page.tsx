// app/teacher/[id]/page.tsx
"use client"
import TeacherAssignmentModal from '@/components/teacherAssign';
import DeleteConfirmation from '@/components/deleteConfirmation';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import StudentEnrollmentModal from '@/components/studentAssign';
import { env } from '../../../../../env.mjs';
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
interface student {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
}
interface teacher {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
}
export default function CoursePage() {
    const router = useRouter()
    const params = useParams()
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const [me, setMe] = useState<user>()
    const [course, setCourse] = useState<course>()
    const [students, setStudents] = useState<student[]>([])
    const [teachers, setTeachers] = useState<teacher[]>([])
    const [assignmentOpen, setAssignmentOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    useEffect(() => {
        axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/getUser`)
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
            axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/course/${params.id}`)
                .then(response => setCourse(response.data))
                .catch(error => console.error(error))
            console.log(params.id)
        }

        axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/teachers`)
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
    const handleDeleteCourse = async () => {
        try {
            console.log('Deleting course with ID:', params.id);
            await axios.delete(env.NEXT_PUBLIC_API_BASE_URL+`/courses/delete/${params.id}`);
            router.push('/ownerstuff/courses'); // Redirect after deletion
        } catch (error) {
            console.error('Delete failed:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || 'Failed to delete course');
            } else {
                alert('Failed to delete course');
            }
        } finally {
            setDeleteDialogOpen(false);
        }
    };
    const handleRemoveTeacher = async (teacherId: number) => {
        try {
            await axios.delete(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/teachers/delete/${teacherId}`);
            setTeachers(teachers.filter(t => t.user_id !== teacherId));
        } catch (error) {
            console.error('Failed to remove teacher:', error);
            alert('Failed to remove teacher');
        }
    };


    //student stuff
    const [enrollmentOpen, setEnrollmentOpen] = useState(false);

    // Add useEffect for fetching students
    useEffect(() => {
        if (params?.id) {
            axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/students`)
                .then(response => setStudents(response.data))
                .catch(console.error);

        }
    }, [params?.id]);

    // Add enrollment handlers
    const handleEnrollStudent = async (studentId: number): Promise<void> => {
        try {
            console.log("Enrolling student with ID:", studentId);
            await axios.post(`/api/enroll/${studentId}`);
        } catch (error) {
            console.error('Enrollment failed:', error);
        }
    };

    const handleUnenrollStudent = async (studentId: number) => {
        try {
            await axios.delete(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/students/delete/${studentId}`);
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
                            <button
                                onClick={() => setEnrollmentOpen(true)}
                                className="top-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                </svg>
                                Assign Student
                            </button>
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
                                Delete Course
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTeacher(teacher.user_id);
                                        }}
                                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnenrollStudent(student.user_id);
                                        }}
                                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <DeleteConfirmation
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteCourse}
            />
            <TeacherAssignmentModal
                courseId={params.id}
                open={assignmentOpen}
                onOpenChange={setAssignmentOpen}
            />
            <StudentEnrollmentModal
                courseId={params.id}
                open={enrollmentOpen}
                onOpenChange={setEnrollmentOpen}
                onEnroll={(studentId: string) => handleEnrollStudent(Number(studentId))} // Convert string to number
            />
        </>
    )
}