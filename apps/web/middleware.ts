import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/apply(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // In production we protect sensitive routes. During local development
  // invoking `auth.protect()` may trigger Clerk's dev-browser rewrite
  // which requires additional dev setup. Skip protection when running
  // in development to allow smooth local navigation.
  if (isProtectedRoute(req) && process.env.NODE_ENV === 'production') {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
};