// src/app/reset-password/[token]/page.tsx

import { Suspense } from 'react';
import Navigation from '../../components/Navigation';
import ResetPasswordForm from './ResetPasswordForm';

interface PageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({
  params,
}: PageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <div className="w-full min-h-[calc(100vh-64px)] px-4 py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm token={params.token} />
        </Suspense>
      </div>
    </div>
  );
}