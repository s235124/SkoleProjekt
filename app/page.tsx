'use client'
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Button } from "@/components/ui/button";
import { Router } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
class User {
  id: string;
  user_metadata: { first_name: string; last_name: string };
  email: string;
  password: string;
  role: string;

  constructor(id: string, first_name: string, last_name: string, email: string, password: string, role: string) {
    this.id = id;
    this.user_metadata = { first_name, last_name };
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

const users = [
  new User('1', 'John', 'Doe', 'v@gmail.com', 'password', 'owner'),
  new User('2', 'Jane', 'Doe', 'v1@gmail.com', 'password', 'instructor'),
  new User('3', 'John', 'Smith', 'v2@gmail.com', 'password', 'student'),
];


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [isMounted, setIsMounted] = useState(false)
const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    setEmail("")
    setPassword("")
  }, [])

  async function login(e: React.FormEvent) {
    for(let i = 0; i < users.length; i++) {
      console.log('v', users[i].email, users[i].password);
      if(users[i].email === email && users[i].password === password) {
        console.log('v', users[i].email, users[i].password);
        console.log('Logged in');
        switch(users[i].role) {
          case 'owner':
            router.push('/dashboards/owner')
            return;
          case 'instructor':
            router.push('/dashboards/instructor')
            return;
            case 'student':
              router.push('/dashboards/student')
              return;
        }
      }
    }
    console.log(email, password);
  }

  const login2 = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    axios({
        method: 'post',
        data: {
            email: email,
            password: password
        },
        withCredentials: true,
        url: 'http://localhost:3001/login',
        timeout: 8000,
        }).then((response) => {
            console.log(response);
            router.push('/dashboards/owner');
        }).catch((error) => {
            console.log(error);
        });
  }


  return (
<>
<div className="gradient absolute z-10"></div>
<div className="flex min-h-screen text-foreground">
  
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
          <h3 className='text-white text-sm mb-4'>EN DIGITAL LØSNING TIL DIN SKOLE</h3>
          <h2 className="text-3xl font-bold mb-6 text-left text-white">Log ind i din konto<span className='text-blue-500'>.</span></h2>
          <h3 className='text-white text-sm my-4'>Mangler du en konto? <Link href="/signup" className='text-blue-500'>Lav en her</Link></h3>
          <form className="space-y-6" onSubmit={login2}>
            <FloatingLabelInput value={email} onChange={(e: any) => setEmail(e.target.value)} label="Email" id="email"/>
            <FloatingLabelInput value={password} onChange={(e: any) => setPassword(e.target.value)} label="Password" id="password"/>
            <Button type="submit" className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              Log ind
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
