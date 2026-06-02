import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/apply');

  if (isProtectedRoute) {
    // Better Auth uses "better-auth.session_token" by default in production,
    // or "__Secure-better-auth.session_token" depending on env. 
    // A robust check is to just look for any better-auth session cookie.
    const hasSession = request.cookies.getAll().some(c => c.name.includes("better-auth.session_token"));
    
    if (!hasSession) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};