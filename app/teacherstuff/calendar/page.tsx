/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '@/components/calendar';
import { env } from '../../../env.mjs';
interface user {
  id: number;
  email: string;
  role: number;
  school_id: number;
}

interface course {
  course_id: number;
  course_name: string;
  course_description: string;
}
export default function CreateModulePage() {
  const [formData, setFormData] = useState({
    date: '',
    timeslot: '',
    course: '',
    course_id: "",
  });

  const hours = [
    "00:00:00", "01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00",
    "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00",
    "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00",
    "18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00"
  ];
  ;

  function timeslotInMinutes(timeslotStr: string) {
    const [hours, minutes, seconds] = timeslotStr.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  function minuteToTimeslot(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    //creates a time slot in the format of 00:00:00
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }


  function createIntervals(intervals: { start: number; end: number }[]) {
    if (intervals.length === 0) return [];
    intervals.sort((a, b) => a.start - b.start);
    const mergedIntervals = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const lastMerged = mergedIntervals[mergedIntervals.length - 1];
      if (current.start <= lastMerged.end) {
        lastMerged.end = Math.max(lastMerged.end, current.end);
      } else {
        mergedIntervals.push(current);
      }
    }
    return mergedIntervals;
  }

  interface Interval {
    start: number;
    end: number;
  }

  function findFreeIntervals(mergedIntervals: Interval[]): Interval[] {
    //initialize the arr of free intervals
    const freeIntervals: Interval[] = [];
    let previousEnd = 0;
    // loop through the merged intervals and find the free intervals
    for (let i = 0; i < mergedIntervals.length; i++) {
      const interval = mergedIntervals[i];
      //check if the start of the current interval is greater than the end of the previous interval if so, we know that there is at least one hour free between them
      // for example current interval start is 14:00:00 and previous interval end is 12:00:00 then we know that there is two hours free between them
      // so we push the interval between the previous end and the current start to the free intervals arr for example 12:00:00 - 14:00:00
      if (interval.start > previousEnd) {
        freeIntervals.push({
          start: previousEnd,
          end: interval.start
        });

      }
      //update the previous end to be the max of the current end and the previous end
      // this is to make sure that if there are overlapping intervals, we only take the max end time of them
      previousEnd = Math.max(previousEnd, interval.end)
    }
    //1440 is the number of minutes in 24 hours so we, if previous end is lower than 1440, we know that there is an interval between previous end and 1440(24:00:00)
    // so we push the interval between previous end and 1440 to the free intervals arr for example 14:00:00 - 24:00:00
    if (previousEnd < 1440) {
      freeIntervals.push({ start: previousEnd, end: 1440 });
    }
    return freeIntervals;
  }

  const [filteredHours, setFilteredHours] = useState(hours);
  const [freeTimeslots, setFreeTimeslots] = useState<{ start: number; end: number }[]>([]);
  const [existingTimeslots, setExistingTimeslots] = useState<{ start: number; end: number }[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [courses, setCourses] = useState<course[]>([]);
  const [user, setUser] = useState<user>();
  useEffect(() => {
    getUser();
  }, []);
  
  const getUser = () => {
    axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/getUser`)
    .then((response) => {
      console.log(response.data)
      setUser(response.data);
    }).catch((error) => {
      console.log("vvvv" + error)
    })

  console.log('User data:', user);

    console.log('User data:', user);;
  }

  const getCourses = (userid: number) => {
    if (!userid) {
      console.error('User not found');
      return;
    }
    axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/teacher/courses/${userid}`)
    .then((response) => { if (response.data.length > 0) {
        setCourses(response.data)
        console.log("no error"+response.data)}
        else { console.log('No courses found') }
        
    }).catch((error) => {
        console.log(error)
    })

  }

    useEffect(() => {
      if (!user?.id) return;
      getCourses(user.id);
    }, [user]);
  
  const updateHours = (date: string) => {
    if (!date) {
      console.error("Date is required");
      return;
    }
    const url = env.NEXT_PUBLIC_API_BASE_URL+`/timeslots?date=${encodeURIComponent(date)}`;
    console.log("Request URL:", url);
    axios({
      method: 'get',
      withCredentials: true,
      url: env.NEXT_PUBLIC_API_BASE_URL+`/timeslots?date=${encodeURIComponent(date)}`,
      timeout: 8000,
    }).then((response) => {
      console.log(response.data);
      const intervals = response.data.map(({ start, end }: { start: string; end: string }) => ({
        start: timeslotInMinutes(start),
        end: timeslotInMinutes(end)
      }));
      const mergedIntervals = createIntervals(intervals);
      const freeIntervals = findFreeIntervals(mergedIntervals);
      setExistingTimeslots(mergedIntervals);
      setFreeTimeslots(freeIntervals);
      console.log(filteredHours);
    }).catch((error) => {
      console.log(error);
    });
  }



  const availableStartTimes = hours.filter(hour => {
    const h = timeslotInMinutes(hour);
    return freeTimeslots.some(free => h >= free.start && h < free.end);
  });

  const availableEndTimes = startTime ? hours.filter(hour => {
    //end time has to be later than start time and within the free timeslots
    const hStart = timeslotInMinutes(startTime);
    const hEnd = timeslotInMinutes(hour);
    const free = freeTimeslots.find(f => hStart >= f.start && hStart < f.end);
    return free && hEnd > hStart && hEnd <= free.end;
  }) : [];

  useEffect(() => {
    // Set date constraints
    const today = new Date();
    setMinDate(today.toISOString().split('T')[0]);
    setMaxDate(new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0]);

    // Fetch available timeslots and classes
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(env.NEXT_PUBLIC_API_BASE_URL+'/createModule', {
        module_date: `${formData.date}`,
        module_start_time: startTime,
        module_end_time: endTime,
        course_id: formData.course_id
      });

      if (response.data.success) {
        alert('Module created successfully!');
        setFormData({ date: '', timeslot: '', course: '', content: '', course_id: '' });
      }
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Error creating module');
    }
  };

  return (
    <>
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Create a module
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Choose date:
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                const newDate = e.target.value;
                setFormData({ ...formData, date: e.target.value });

                updateHours(newDate);
              }
              }
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <div className='flex'>
              <div className='col-64 w-1/2'>Start time</div>
              <div className='col-64 w-1/2'>End time</div>
            </div>
            <div className='flex'>

              <select
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setFormData({ ...formData, timeslot: e.target.value });
                }}
                className="border dark:border-gray-600 p-2 w-5/6 mb-4 dark:bg-gray-700 dark:text-gray-100"
                required
              >

                <option value="">Choose timeslot</option>
                {availableStartTimes.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <div className='mx-2 font-bold text-2xl'> -</div>
              <select
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setFormData({ ...formData, timeslot: e.target.value });
                }}
                className="border dark:border-gray-600 p-2 w-5/6 mb-4 dark:bg-gray-700 dark:text-gray-100"
                required
              >

                <option value="">Choose timeslot</option>
                {availableEndTimes.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200">
              Course:
            </label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value, })}
              className="border dark:border-gray-600 p-2 w-full mb-4 dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Choose course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>


            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Create Module
            </button>
          </form>
        </div>

      </div>
      <div className='h-full'>
  {user && (
    <Calendar 
      refetchTrigger={formData.date} 
      currentTeacherId={user.id}
      schoolId={user.school_id}
    />
  )}
</div>
    </>
  );
}