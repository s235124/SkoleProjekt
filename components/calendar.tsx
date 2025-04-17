// components/Calendar.tsx
"use client";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface ModuleEvent {
  id: number;
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
}
interface CourseTeachers {
  course_id: number;
  teachers: number[];
}
export default function Calendar({ refetchTrigger, currentTeacherId }: CalendarProps) {
  const [events, setEvents] = useState<ModuleEvent[]>([]);
  const [currentStart, setCurrentStart] = useState('');
  const [currentEnd, setCurrentEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [courseTeacherMap, setCourseTeacherMap] = useState<Record<number, number[]>>({});

  useEffect(() => {
    const fetchCourseTeachers = async () => {
      try {
        const response = await axios.get<CourseTeachers[]>('http://localhost:3001/teaches');
        const map = response.data.reduce((acc, { course_id, teachers }) => {
          acc[course_id] = teachers;
          return acc;
        }, {} as Record<number, number[]>);
        setCourseTeacherMap(map);
      } catch (err) {
        console.error('Failed to load teacher associations:', err);
      }
    };
    fetchCourseTeachers();
  }, []);
  
  
  const fetchModules = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('http://localhost:3001/modules', {
        params: {
          start: start.split('T')[0],
          end: end.split('T')[0]
        }
      });
      const formattedEvents = response.data.map((module: any) => {
        const courseId = Number(module.course_id);
        const teachers = courseTeacherMap[courseId] || [];
        const isCurrentTeacher = teachers.includes(Number(currentTeacherId));
      
        return {
          id: module.module_id,
          title: module.module_name,
          start: `${module.module_date}T${module.module_start_time}`,
          end: `${module.module_date}T${module.module_end_time}`,
          extendedProps: {
            courseId: courseId,
            teacherId: module.teacher_id
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
      setLoading(false);
    }
  }, [currentTeacherId]);

  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    const startStr = dateInfo.start.toISOString();
    const endStr = dateInfo.end.toISOString();
    
    if (startStr !== currentStart || endStr !== currentEnd) {
      setCurrentStart(startStr);
      setCurrentEnd(endStr);
      fetchModules(startStr, endStr);
    }
  };

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    if (currentStart && currentEnd) {
      fetchModules(currentStart, currentEnd);
    }
  }, [refetchTrigger, currentStart, currentEnd, fetchModules]); // Add all used dependencies

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      {loading && <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      
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
            <button 
              className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              onClick={(e) => {
                e.stopPropagation();
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
            </button>
          </div>
        )}
        eventDidMount={(info) => {
          info.el.classList.add('dark:bg-gray-700', 'dark:border-gray-600');
        }}
      />
    </div>
  );
}