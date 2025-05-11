'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { env } from '../env.mjs';
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      // 1. Tell the server to clear the HttpOnly cookie
      const res = await fetch(env.NEXT_PUBLIC_API_BASE_URL+'/logout', { method: 'POST',credentials: 'include' });
      if (!res.ok) {
        console.error('Logout failed:', await res.text());
        return;
      }

      // 2. Redirect the user to the signup/login page
      //    Use a full-nav so React state is wiped clean
      window.location.href = '/signup';
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [router]);

  return (
    <button
      onClick={handleLogout}
      className="fixed top-1 right-4 w-28 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
    >
      Logout
    </button>
  );
}
