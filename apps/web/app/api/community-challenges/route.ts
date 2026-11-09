import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchCommunityChallenges } from '@/app/lib/community-challenges';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const queryUserId = url.searchParams.get('userId');

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id || queryUserId || undefined;

  const data = await fetchCommunityChallenges(userId);
  return NextResponse.json(data);
}

