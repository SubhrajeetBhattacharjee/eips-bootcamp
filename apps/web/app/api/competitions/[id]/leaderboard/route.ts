import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchCompetitionLeaderboard } from '@/app/lib/competitions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id || (userId ?? undefined);

  const data = await fetchCompetitionLeaderboard(id, sessionUserId);
  if (!data) {
    return NextResponse.json(
      { message: 'Competition leaderboard unavailable' },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

