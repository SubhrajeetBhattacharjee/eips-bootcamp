import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';
import { REWARDS_DATA } from '@/app/lib/rewards';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let sessionUserId: string | undefined;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      sessionUserId = session?.user?.id;
    } catch {
      // transient session read
    }

    const effectiveUserId = sessionUserId || userId;
    if (!effectiveUserId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/rewards/${effectiveUserId}`, {
        cache: 'no-store',
        headers: { 'x-api-key': getInternalApiKey() },
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.rewards || data.rewards.length === 0) {
          data.rewards = REWARDS_DATA;
        }
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn('API rewards fetch failed, falling back to direct DB/local:', e);
    }

    // Direct DB query fallback
    const [rewards, history, xpSum] = await Promise.all([
      prisma.reward.findMany(),
      prisma.rewardRedemption.findMany({
        where: { userId: effectiveUserId },
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' },
      }),
      prisma.xPTransaction.aggregate({
        where: { userId: effectiveUserId },
        _sum: { amount: true },
      }),
    ]);

    const currentXP = Math.max(0, xpSum._sum.amount ?? 0);
    const resolvedRewards = rewards.length > 0 ? rewards : REWARDS_DATA;
    const xpSpent = history.reduce((acc, h) => acc + h.xpSpent, 0);

    const nextRewardUnlock = (Math.floor(currentXP / 1000) + 1) * 1000;
    const progressPercentage = Math.min(
      100,
      Math.max(0, Math.floor((currentXP / nextRewardUnlock) * 100)),
    );

    return NextResponse.json({
      rewards: resolvedRewards,
      history: history.map((h) => ({
        rewardId: h.rewardId,
        title: h.reward?.title || 'Reward',
        xpSpent: h.xpSpent,
        redeemedAt: h.redeemedAt.toISOString(),
      })),
      userData: {
        currentXP,
        totalXPEarned: currentXP + xpSpent,
        rewardsRedeemed: history.length,
        totalValueUnlocked: xpSpent,
        nextRewardUnlock,
        progressPercentage,
      },
    });
  } catch (err) {
    console.error('Error fetching rewards:', err);
    return NextResponse.json({
      rewards: REWARDS_DATA,
      history: [],
      userData: {
        currentXP: 0,
        totalXPEarned: 0,
        rewardsRedeemed: 0,
        totalValueUnlocked: 0,
        nextRewardUnlock: 1000,
        progressPercentage: 0,
      },
    });
  }
}
