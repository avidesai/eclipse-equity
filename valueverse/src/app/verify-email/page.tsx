// /src/app/verify-email/page.tsx

'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          router.push('/');
          return;
        }

        // Call the backend verification endpoint
        await api.get(`/auth/verify-email?token=${token}`);
        
        // After successful verification, get the JWT token
        const loginResponse = await api.post('/auth/verify-login', { token });
        
        // Log the user in
        if (loginResponse.data.token) {
          await login(loginResponse.data.token);
          router.push('/models'); // Or wherever you want to redirect after verification
        }
      } catch (error) {
        console.error('Verification failed:', error);
        router.push('/auth'); // Redirect to auth page instead of home on failure
      }
    };

    verifyEmail();
  }, [router, searchParams, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  );
}