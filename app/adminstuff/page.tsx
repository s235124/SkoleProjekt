"use client"
import SchoolSelector from '@/components/SchoolSelector';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelectedSchool } from './selectedSchoolContext';
import { env } from '../../env.mjs';
// Mock data (replace with actual data fetching in a real application)
interface School {
  school_id: number;
  school_name: string;
}

export default function AdminDashboard() {
  const { selectedSchoolId, setSelectedSchoolId } = useSelectedSchool();
  const [schools, setSchools] = useState<School[]>([]);
  //const [activeView, setActiveView] = useState<'calendar' | 'students' | 'courses'>('calendar');
  const getSchools = () => {
    axios.get(env.NEXT_PUBLIC_API_BASE_URL+'/getSchools')
     .then((response) => { if (response.data.length > 0) {
         setSchools(response.data) }
         else { console.log('No users found') }
         
     }).catch((error) => {
         console.log(error)
     })
  }
  console.log('Selected School ID:', selectedSchoolId);
  const handleSchoolSelect = (schoolId: number) => {
    setSelectedSchoolId(Number(schoolId));
    console.log('Selected School ID:', selectedSchoolId);
    // Optionally fetch additional school details here
  };


useEffect(() => {
    getSchools();
  getUser();
}, [])

const getUser = () => {

    axios({
        method: 'get',
        withCredentials: true,
        url: env.NEXT_PUBLIC_API_BASE_URL+'/getUser',
        timeout: 8000,
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
}

  return (

 <div className="p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, admin!
        <span className='text-blue-500'>.</span>
      </h1>

      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <SchoolSelector 
            schools={schools}
            onSelect={handleSchoolSelect}
            selectedSchoolId={selectedSchoolId ?? 0}
          />
        </div>
      </div>

    </div>
   
  )
}