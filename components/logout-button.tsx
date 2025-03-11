// components/LogoutButton.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    // Redirect to login/signup
    router.push('/signup');
    // Optional: Force a full page reload to clear client-side state
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="fixed top-1 right-4 w-28 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
      Logout
    </button>
  );
}