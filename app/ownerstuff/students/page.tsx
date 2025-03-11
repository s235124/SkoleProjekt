"use client"

import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingLabelInput from '@/components/FloatingLabelInput';

export default function Students () {

  const [users, setUsers] = useState<User[]>([]);

 useEffect(() => {
    axios.get('http://localhost:3001/getAllUsers')
    .then((response) => { if (response.data.length > 0) {
        setUsers(response.data) }
        else { console.log('No users found') }
        
    }).catch((error) => {
        console.log(error)
    })
}, [])

const listItems1 = users.filter(user => user.role === 1)

const listItems = listItems1.map((user) => (
    <div key={user.id}>
      <div className='w-5/5 m-auto bg-white h-16 flex flex-row border-black border-b-[1px]'>
        <div className="basis-64 bg-white">01</div>
        <div className="basis-128">{user.email}</div>
      </div>
      <div className='w-5/5 flex flex-row'></div>
    </div>
  
));


  return (
    <div className="w-full h-full justify-center bg-slate-600 overflow-hidden">
            <div className='w-4/5  h-4 flex flex-row'>
            </div>

      <div className='h-full w-11/12 bg-white m-auto rounded-xl'>

        <div className='w-fuill m-auto h-16 flex flex-row border-black border-b-[1px] justify-center items-center'>
          <div className="basis-1/6 bg-white font-bold px-1">All Students Info</div>
          <div className="basis-2/3"></div>
          <div className="basis-1/6 right-5 px-1">
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Search"
                />
                <button
                  className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                  </svg>

                  Search
                </button>
              </div>
            </div>
          </div>
          
        </div>

      <div className='w-4/5 m-auto bg-purple-500 h-8 flex flex-row border-black border-b-[1px]'>
        <div className="basis-64 bg-white font-bold">Info</div>
        <div className="basis-48">Email</div>
        <div className="basis-48">Name</div>
        <div className="basis-48">v</div>
        <div className="basis-48">V</div>
      </div>
      <ScrollArea className="m-auto w-4/5 h-3/5 flex flex-row border-black border-b-[2px]">

      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      {listItems}
      </ScrollArea>
      </div>  
    </div>
  )
}