"use client"

import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <div className='w-4/5 m-auto bg-purple-500 h-48 flex flex-row'>
        <div className="basis-64 bg-white">01</div>
        <div className="basis-128">{user.email}</div>
      </div>
      <div className='w-4/5 h-4 flex flex-row'></div>
    </div>
  
));


  return (
    <div className="w-full h-full justify-center bg-green-500 overflow-hidden">
            <div className='w-4/5  h-4 flex flex-row'>
            </div>
      <ScrollArea className="w-4/5 h-4/5">
      {listItems}
      {listItems}
      {listItems}
      </ScrollArea>
    </div>
  )
}