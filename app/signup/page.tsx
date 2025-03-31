'use client'
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Button } from "@/components/ui/button";
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
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    setRegisterEmail("")
    setRegisterPassword("")
  }, [])

  const signup = (e: React.FormEvent) => {
    // TypeError: e is undefined
    e.preventDefault();
    console.log(registerEmail, registerPassword);
    axios({
      method: 'post',

      data: {
        email: registerEmail,
        password: registerPassword
      },

      withCredentials: true,
      url: 'http://localhost:3001/signup',
      timeout: 8000,
    }).then((response) => {
      console.log(response);
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
            <h3 className='text-white text-sm mb-4'>En digital løsning til din skole</h3>
            <h2 className="text-3xl font-bold mb-6 text-left text-white">Opret konto<span className='text-blue-500'>.</span></h2>
            <h3 className='text-white text-sm my-4'>Har du allerede en konto? <Link href="../" className='text-blue-500'>Login her</Link></h3>
            <form className="space-y-6" onSubmit={signup}>
              <FloatingLabelInput value={registerEmail} onChange={(e: any) => setRegisterEmail(e.target.value)} label="Email" id="email" />
              <FloatingLabelInput value={registerPassword} onChange={(e: any) => setRegisterPassword(e.target.value)} label="Password" id="password" />
              <Button type="submit" className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
                Opret konto
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
