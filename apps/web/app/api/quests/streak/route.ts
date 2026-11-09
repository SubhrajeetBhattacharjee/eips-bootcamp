import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchUserStreak } from '@/app/lib/quests';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id || userId;

  if (!sessionUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await fetchUserStreak(sessionUserId);
  return NextResponse.json(data);
}

