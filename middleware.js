import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login and signup pages
    if (pathname === '/admin/login' || pathname === '/admin/signup') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session');

    if (!adminSession) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};