import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    } 

    const session = await auth.api.getSession({ headers: await headers() });
    const sessionUserId = session?.user?.id;
    if (!sessionUserId || sessionUserId !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': getInternalApiKey() },
        body: JSON.stringify({ userId: userId, rewardId }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }

      try {
        const errorJson = await res.json();
        const errorMsg = errorJson?.message || 'Failed to redeem reward';
        return NextResponse.json(
          { message: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) },
          { status: res.status }
        );
      } catch {
        const msg = await res.text();
        return NextResponse.json({ message: msg || 'Failed to redeem reward' }, { status: res.status });
      }
    } catch (apiErr) {
      // Fallback: Perform atomic redemption directly in Prisma if remote NestJS is unreachable
      try {
        const result = await prisma.$transaction(async (tx) => {
          const reward = await tx.reward.findUnique({
            where: { id: rewardId },
          });

          if (!reward || !reward.available) {
            throw new Error('Reward not available');
          }

          const aggregate = await tx.xPTransaction.aggregate({
            where: { userId },
            _sum: { amount: true },
          });
          const currentXP = aggregate._sum.amount ?? 0;

          if (currentXP < reward.cost) {
            throw new Error('Not enough XP to redeem this reward');
          }

          const redemption = await tx.rewardRedemption.create({
            data: {
              userId,
              rewardId,
              xpSpent: reward.cost,
            },
          });

          await tx.xPTransaction.create({
            data: {
              userId,
              amount: -reward.cost,
              reason: `Redeemed ${reward.title}`,
              category: 'REWARD_REDEMPTION',
              referenceId: `reward-${redemption.id}`,
            },
          });

          return {
            success: true,
            message: 'Reward redeemed successfully!',
            redemption,
          };
        });

        return NextResponse.json(result);
      } catch (dbErr: any) {
        return NextResponse.json(
          { message: dbErr.message || 'Failed to redeem reward' },
          { status: 400 }
        );
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
