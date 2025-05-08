// components/Calendar.tsx
"use client";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { env } from '../env.mjs';
interface ModuleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    courseId: number;
    teacherId?: number;
  };
}

interface CalendarProps {
  refetchTrigger?: string;
  currentTeacherId?: number;  // Add this
  schoolId?: number; // Add this
}

interface user {
user_id: number;
first_name: string;
last_name: string;
email: string;
phone_number: string;
school_id: number; // Assuming this is the correct type
role: number;
}
interface CourseTeachers {
  course_id: number;
  teachers: number[];
}
export default function Calendar({ refetchTrigger, currentTeacherId,schoolId }: CalendarProps) {
  const [events, setEvents] = useState<ModuleEvent[]>([]);
  const [currentStart, setCurrentStart] = useState('');
  const [currentEnd, setCurrentEnd] = useState('');
  const [error, setError] = useState('');
  const [courseTeacherMap, setCourseTeacherMap] = useState<Record<number, number[]>>({});
  const [fetched, setFetched] = useState(false); // User state
// Add loading state
const [isLoading, setIsLoading] = useState(true);
const [user, setUser] = useState<user | null>(null);

useEffect(() => {
  getUser();
}, [])

const getUser = () => {

    axios({
        method: 'get',
        withCredentials: true,
        url: env.NEXT_PUBLIC_API_BASE_URL+'/getUser',
        timeout: 8000,
        }).then((response) => {
          setUser(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
}

// 1. Fetch teacher-course relationships with loading state
   const fetchCourseTeachers = async () => {
    try {
      const response = await axios.get<CourseTeachers[]>(env.NEXT_PUBLIC_API_BASE_URL+'/teaches');
      const map = response.data.reduce((acc, { course_id, teachers }) => {
        acc[course_id] = teachers;
        return acc;
      }, {} as Record<number, number[]>);
      setCourseTeacherMap(map);
    } catch (err) {
      console.error('Failed to load teacher associations:', err);
    } finally {
      setFetched(true); // Set fetched to true after loading
      setIsLoading(false); // Update loading state when done
    }
  };
  
  const fetchModules = useCallback(async (start: string, end: string) => {
    try {
      //setLoading(true);
      setError('');

      const response = await axios.get(env.NEXT_PUBLIC_API_BASE_URL+'/modules', { 
        params: {
          start: start.split('T')[0],
          end: end.split('T')[0]
        },
        headers: {
          'schoolid': schoolId?.toString() || '',
        }
      });
      const formattedEvents = response.data.map((module: { module_id: number; module_name: string; module_date: string; module_start_time: string; module_end_time: string; course_id: number; }) => {
        console.log("v"+currentTeacherId); // Debugging line

        const courseId = Number(module.course_id);
        const teachers = courseTeacherMap[courseId] || [];
        const isCurrentTeacher = teachers.includes(Number(currentTeacherId));
      console.log("what"+isCurrentTeacher); // Debugging line
      console.log("what"+ teachers); // Debugging line
        return {
          id: module.module_id.toString(), // Ensure id is a string
          title: module.module_name,
          start: `${module.module_date}T${module.module_start_time}`,
          end: `${module.module_date}T${module.module_end_time}`,
          extendedProps: {
            courseId: courseId,
            teacherId: isCurrentTeacher ? currentTeacherId : null // Set teacherId only if currentTeacherId is available
            
          },
          backgroundColor: isCurrentTeacher ? '#5F46E5' : '#3B82F6',
          borderColor: isCurrentTeacher ? '#3730A3' : '#2563EB',
          textColor: isCurrentTeacher ? '#FFFFFF' : '#F3F4F6'
        };
      });
      
      setEvents(formattedEvents);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching modules:', err);
    } finally {
      //setLoading(false);
    }
  }, [currentTeacherId, courseTeacherMap]);

  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    const startStr = dateInfo.start.toISOString();
    const endStr = dateInfo.end.toISOString();
    
    if (startStr !== currentStart || endStr !== currentEnd) {
      setCurrentStart(startStr);
      setCurrentEnd(endStr);
      fetchModules(startStr, endStr);
    }
  };
  const deleteModule = async (moduleId: string) => {
    try {
      const response = await axios.delete(
        env.NEXT_PUBLIC_API_BASE_URL+`/deletemodule/${moduleId}`
      );
      
      if (response.data.success) {
        // Refresh modules after successful deletion
        fetchModules(currentStart, currentEnd);
      }
    } catch (err) {
      console.error('Error deleting module:', err);
      alert('Failed to delete module');
    }
  };
  // Fixed useEffect with proper dependencies
  useEffect(() => {
    fetchCourseTeachers(); // Fetch course-teacher relationships on mount
    if (currentStart && currentEnd && fetched) {
      fetchModules(currentStart, currentEnd);
    }
  }, [refetchTrigger]); // Add all used dependencies

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        datesSet={handleDatesSet}
        timeZone="UTC"
        themeSystem="standard"     // 2-hour time slots// Labels every 2 hours    // End at 8 PM
        allDaySlot={false}           // Remove all-day row
        expandRows={false}           // Prevent vertical expansion
        contentHeight="auto"         // Compact height
        aspectRatio={1}            // Adjust width/height ratio
        eventContent={(arg) => (
          <div className="flex justify-between items-center h-full p-1">
            <div className="flex-1 overflow-hidden">{arg.event.title}</div>
            {(arg.event.extendedProps.teacherId === currentTeacherId || user?.role === 3 || user?.role === 4) && (
            <button 
              className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              onClick={(e) => {
                e.stopPropagation();
                deleteModule(arg.event.id);
                console.log('Delete module ID:', arg.event.id);
                // Add your delete logic here
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>)}
          </div>
        )}
        eventDidMount={(info) => {
          info.el.classList.add('dark:bg-gray-700', 'dark:border-gray-600');
        }}
      />
      )}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
    </div>
  );
}