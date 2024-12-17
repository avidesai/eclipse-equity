// src/app/auth/page.tsx
'use client';
import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';
import Navigation from '../components/Navigation';

function LoadingState() {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <div className="pt-16">
        <Suspense fallback={<LoadingState />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}