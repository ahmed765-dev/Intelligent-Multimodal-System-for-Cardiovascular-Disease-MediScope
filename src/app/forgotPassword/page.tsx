'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect legacy /forgotPassword to /forgot-password
export default function ForgotPasswordRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/forgot-password');
  }, [router]);
  return null;
}