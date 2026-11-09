import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { claimSeasonReward } from '@/app/lib/seasons';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await request.json();
    const { seasonId, userId } = body;

    const sessionUserId = session?.user?.id || userId;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!seasonId) {
      return NextResponse.json(
        { message: 'Missing seasonId' },
        { status: 400 },
      );
    }

    const data = await claimSeasonReward(seasonId, sessionUserId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error claiming season reward:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to claim season reward' },
      { status: 400 },
    );
  }
}

