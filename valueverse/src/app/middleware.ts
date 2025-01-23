// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/account'];

// Define authentication routes (login/signup)
const authRoutes = ['/auth'];

// Define password reset routes
const passwordRoutes = ['/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // If it's a protected route and user is not authenticated
  if (protectedRoutes.includes(pathname) && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth pages
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated and trying to access password reset pages
  if (passwordRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    ...protectedRoutes,
    ...authRoutes,
    '/forgot-password',
    '/reset-password'
  ]
};