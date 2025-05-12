'use client'
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import jsonwebtoken from "jsonwebtoken";
import { env } from '../env.mjs';


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [isMounted, setIsMounted] = useState(false)
const router = useRouter()
console.log("v"+env.NEXT_PUBLIC_API_BASE_URL)
  useEffect(() => {
    setIsMounted(true)
    setEmail("")
    setPassword("")
    console.log("is mounted"+ isMounted)
  }, [])


  const login3 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    
    const res = await axios.post(env.NEXT_PUBLIC_API_BASE_URL+'/login', {
      email: email,
      password: password
    });

    const {token} = res.data
    const decodedToken = jsonwebtoken.decode(token);
    let role = 0;
    if (decodedToken && typeof decodedToken !== 'string' && 'role' in decodedToken) {
      role = decodedToken.role;
    }
    document.cookie = `token=${token}; path=/; max-age=3600`;

    
    switch(role){
      case 1:
        router.push('/studentstuff');
        break;
      case 2:
        router.push('/teacherstuff');
        break;
      case 3:
        router.push('/ownerstuff');
        break;
      case 4:
        router.push('/adminstuff');
        break;
      default:
        console.log('No role found');
    } 
    }catch (err){
      console.log(err);
    }


  }


  return (
<>
<div className="gradient absolute z-10"></div>
<div className="flex min-h-screen text-foreground">
  
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
          <h3 className='text-white text-sm mb-4'>A DIGITAL SOLUTION FOR YOUR SCHOOL</h3>
          <h2 className="text-3xl font-bold mb-6 text-left text-white">Log in to your account<span className='text-blue-500'>.</span></h2>
          <h3 className='text-white text-sm my-4'>Interested in this service? <Link href="mailto:s235124@dtu.dk?subject=Applying for Learnflow&body=Hi, my name is (First name) (Last name), I would like to use LearnFlow for my shcool (School name). Optionally, my phone number is (Phone number)" className='text-blue-500'>Contact us.</Link></h3>
          <form className="space-y-6" onSubmit={login3}>
            <FloatingLabelInput value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} label="Email" id="email"/>
            <FloatingLabelInput value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} label="Password" id="password"/>
            <Button type="submit" className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
