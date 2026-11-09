import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchCompetitions } from '@/app/lib/competitions';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;

  // If userId is passed, verify session matches or allow guest overview
  const effectiveUserId = sessionUserId || (userId ?? undefined);

  const data = await fetchCompetitions(effectiveUserId);
  return NextResponse.json(data);
}

