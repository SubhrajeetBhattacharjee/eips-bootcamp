import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { claimNftReward } from '@/app/lib/nft-rewards';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await request.json();
    const { rewardId, walletAddress, userId } = body;

    const sessionUserId = session?.user?.id || userId;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!rewardId || !walletAddress) {
      return NextResponse.json(
        { message: 'Missing rewardId or walletAddress' },
        { status: 400 },
      );
    }

    const data = await claimNftReward(rewardId, sessionUserId, walletAddress);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error claiming NFT reward:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to claim NFT reward' },
      { status: 400 },
    );
  }
}

