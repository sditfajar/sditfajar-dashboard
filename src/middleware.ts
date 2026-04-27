import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard', 
  '/siswa', 
  '/guru', 
  '/pembayaran', 
  '/alumni', 
  '/konten', 
  '/absensi'
];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/siswa/:path*', 
    '/guru/:path*', 
    '/pembayaran/:path*', 
    '/alumni/:path*', 
    '/konten/:path*', 
    '/absensi/:path*', 
    '/login'
  ],
}
