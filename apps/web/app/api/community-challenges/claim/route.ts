import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { claimCommunityChallengeReward } from '@/app/lib/community-challenges';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await request.json();
    const { challengeId, userId } = body;

    const sessionUserId = session?.user?.id || userId;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!challengeId) {
      return NextResponse.json(
        { message: 'Missing challengeId' },
        { status: 400 },
      );
    }

    const data = await claimCommunityChallengeReward(challengeId, sessionUserId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error claiming community challenge reward:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to claim challenge reward' },
      { status: 400 },
    );
  }
}

