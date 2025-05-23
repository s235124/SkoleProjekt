// app/teacher/[id]/page.tsx
"use client"
import DeleteConfirmation from '@/components/deleteConfirmation';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
// import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSelectedSchool } from '../../../selectedSchoolContext';
import TeacherAssignmentModalAdmin from '@/components/teacherAssignAdmin';
import StudentEnrollmentModalAdmin from '@/components/studentAssignAdmin';
import { env } from '../../../../../env.mjs';
export default function CoursePage() {
    const router = useRouter()
    const params = useParams()
    const [me, setMe] = useState()
    interface Course {
        course_name: string;
        // Add other properties of the course object here if needed
    }
    const [course, setCourse] = useState<Course | null>(null);
    interface Student {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
    }
    const [students, setStudents] = useState<Student[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
      const { selectedSchoolId } = useSelectedSchool();
    const [assignmentOpen, setAssignmentOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    useEffect(() => {
        // Fetch the current user
        axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/getUser`)
        .then((response) => {
            if (response.data.length > 0) {
                console.log(response.data)
                setMe(response.data)
                console.log('me', me)
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
    interface Teacher {
        user_id: string;
        first_name: string;
        last_name: string;
        email: string;
    }

    const handleRemoveTeacher = async (teacherId: string): Promise<void> => {
        try {
            await axios.delete(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/teachers/delete/${teacherId}`);
            setTeachers(teachers.filter((t: Teacher) => t.user_id !== teacherId));
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

    const handleUnenrollStudent = async (studentId: string) => {
        try {
            await axios.delete(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${params.id}/students/delete/${studentId}`);
            setStudents(students.filter(s => String(s.user_id) !== studentId));
        } catch (error) {
            console.error('Unenrollment failed:', error);
            alert('Failed to unenroll student');
        }}
    if (!course) return <div>Loading...</div>;


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
                                        onClick={() => router.push(`/adminstuff/teachers/specificteacher/${teacher.user_id}`)}
                                    >
                                        <div className='w-8 h-8 rounded-full bg-violet-400'></div>
                                        <div>
                                            <p className='font-medium'>{teacher.first_name} {teacher.last_name}</p>
                                            <p className='text-sm text-gray-600'>{teacher.email}</p>
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
                                            handleUnenrollStudent(String(student.user_id));
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
            <TeacherAssignmentModalAdmin
                courseId={params.id}
                open={assignmentOpen}
                onOpenChange={setAssignmentOpen}
                schoolId={selectedSchoolId}
            />
            <StudentEnrollmentModalAdmin
                courseId={params.id}
                open={enrollmentOpen}
                onOpenChange={setEnrollmentOpen}
                onEnroll={(studentId: string) => handleEnrollStudent(Number(studentId))}
                schoolId={selectedSchoolId}
            />
        </>
    )
}