import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/admin',
  '/siswa',
  '/guru',
  '/pembayaran',
  '/alumni',
  '/konten',
  '/absensi',
  '/dashboard-guru',
  '/dashboard-siswa',
  '/mata-pelajaran',
  '/jadwal',
  '/jadwal-siswa',
  '/tugas-saya',
  '/pengumuman',
  '/kelas-saya'
];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  const userRole = request.cookies.get('userRole')?.value;

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role locking: if user is a teacher and tries to access an admin route, redirect to dashboard-guru
  if (session && userRole === 'teacher' && isProtectedRoute && !request.nextUrl.pathname.startsWith('/dashboard-guru')) {
    return NextResponse.redirect(new URL('/dashboard-guru', request.url));
  }

  // Role locking: if user is a student and tries to access an admin/teacher route, redirect to dashboard-siswa
  const studentRoutes = ['/dashboard-siswa', '/mata-pelajaran', '/jadwal-siswa', '/tugas-saya', '/pengumuman', '/kelas-saya'];
  if (session && (userRole === 'student' || userRole === 'murid') && isProtectedRoute && !studentRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard-siswa', request.url));
  }

  if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/')) {
    if (userRole === 'teacher') {
      return NextResponse.redirect(new URL('/dashboard-guru', request.url));
    }
    if (userRole === 'student' || userRole === 'murid') {
      return NextResponse.redirect(new URL('/dashboard-siswa', request.url));
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/siswa/:path*',
    '/guru/:path*',
    '/pembayaran/:path*',
    '/alumni/:path*',
    '/konten/:path*',
    '/absensi/:path*',
    '/dashboard-guru/:path*',
    '/dashboard-siswa/:path*',
    '/mata-pelajaran/:path*',
    '/jadwal/:path*',
    '/jadwal-siswa/:path*',
    '/tugas-saya/:path*',
    '/pengumuman/:path*',
    '/kelas-saya/:path*',
    '/login'
  ],
}
