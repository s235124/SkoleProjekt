"use client";
import { useEffect, useState } from 'react';
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

export default function Calendar() {
  const [events, setEvents] = useState<ModuleEvent[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://localhost:3001/modules');
        const formattedEvents = response.data.map((module: any) => ({
          id: module.module_id,
          title: module.module_name,
          start: `${module.module_date}T${module.module_start_time}`,
          end: `${module.module_date}T${module.module_end_time}`,
          extendedProps: {
            courseId: module.course_id,
            teacherId: module.teacher_id
          }
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        height="auto"
        themeSystem="standard"
        eventDidMount={(info) => {
          info.el.classList.add('dark:bg-gray-700', 'dark:border-gray-600');
        }}
      />
    </div>
  );
}