import { NextResponse } from 'next/server';

export function middleware(request) {
  const token    = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (['/dashboard', '/checkout'].some(r => pathname.startsWith(r)) && !token)
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));

  if (['/admin'].some(r => pathname.startsWith(r)) && !token)
    return NextResponse.redirect(new URL('/login', request.url));

  if (['/login', '/register'].includes(pathname) && token)
    return NextResponse.redirect(new URL('/dashboard', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*', '/admin/:path*', '/login', '/register'],
};