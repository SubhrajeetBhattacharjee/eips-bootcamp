import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { claimQuestReward } from '@/app/lib/quests';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await request.json();
    const { questId, userId } = body;

    const sessionUserId = session?.user?.id || userId;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!questId) {
      return NextResponse.json(
        { message: 'Missing questId' },
        { status: 400 },
      );
    }

    const data = await claimQuestReward(questId, sessionUserId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error claiming quest reward:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to claim quest reward' },
      { status: 400 },
    );
  }
}

