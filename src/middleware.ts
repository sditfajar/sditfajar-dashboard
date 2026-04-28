import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/admin',
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
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/siswa/:path*',
    '/guru/:path*',
    '/pembayaran/:path*',
    '/alumni/:path*',
    '/konten/:path*',
    '/absensi/:path*',
    '/login'
  ],
}
