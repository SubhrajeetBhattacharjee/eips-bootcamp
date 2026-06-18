import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Handle /ref/CODE pattern
  const refMatch = pathname.match(/^\/ref\/([a-zA-Z0-9_-]+)$/);
  if (refMatch) {
    const code = refMatch[1];
    const response = NextResponse.redirect(new URL('/sign-up', request.url));
    response.cookies.set('referral_code', code, { 
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  }

  // 2. Handle ?ref=CODE pattern
  const refParam = searchParams.get('ref');
  
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/apply');

  let response = NextResponse.next();

  if (isProtectedRoute) {
    const hasSession = request.cookies.getAll().some(c => c.name.includes("better-auth.session_token"));
    
    if (!hasSession) {
      response = NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // If refParam exists, set the cookie on the response
  if (refParam) {
    response.cookies.set('referral_code', refParam, { 
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};