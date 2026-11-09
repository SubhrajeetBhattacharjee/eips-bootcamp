import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchUserLeague } from '@/app/lib/leagues';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await fetchUserLeague(userId);
  if (!data) {
    return NextResponse.json(
      { message: 'Failed to retrieve league data' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

