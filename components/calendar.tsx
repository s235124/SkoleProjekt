// components/Calendar.tsx
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

interface CalendarProps {
  refetchTrigger?: string;  // Add this interface for props
}

export default function Calendar({ refetchTrigger }: CalendarProps) {
  const [events, setEvents] = useState<ModuleEvent[]>([]);
  const [currentStart, setCurrentStart] = useState('');
  const [currentEnd, setCurrentEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModules = async (start: string, end: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:3001/modules', {
        params: {
          start: start.split('T')[0],
          end: end.split('T')[0]
        }
      });

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
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [refetchTrigger, currentStart, currentEnd]); // Add all used dependencies

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
        themeSystem="standard"
        slotDuration="02:00:00"       // 2-hour time slots
        slotLabelInterval="02:00:00" // Labels every 2 hours
        slotMinTime="00:00:00"       // Start at 8 AM
        slotMaxTime="24:00:00"       // End at 8 PM
        allDaySlot={false}           // Remove all-day row
        expandRows={false}           // Prevent vertical expansion
        contentHeight="auto"         // Compact height
        aspectRatio={1}            // Adjust width/height ratio
  
        eventDidMount={(info) => {
          info.el.classList.add('dark:bg-gray-700', 'dark:border-gray-600');
        }}
      />
    </div>
  );
}