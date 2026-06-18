'use server';

import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { headers, cookies } from 'next/headers';

export async function linkReferral() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, message: 'Not authenticated' };

    const cookieStore = await cookies();
    const referralCode = cookieStore.get('referral_code')?.value;

    if (!referralCode) return { success: false, message: 'No referral code found' };

    // Check if user is already referred
    const existingReferral = await prisma.referral.findUnique({
      where: { referredUserId: session.user.id }
    });

    if (existingReferral) {
      // Clear cookie and return
      cookieStore.delete('referral_code');
      return { success: false, message: 'User already referred' };
    }

    // Find the referral code in DB
    const refCode = await prisma.referralCode.findUnique({
      where: { code: referralCode }
    });

    if (!refCode) {
      cookieStore.delete('referral_code');
      return { success: false, message: 'Invalid referral code' };
    }

    // Don't refer yourself
    if (refCode.userId === session.user.id) {
      cookieStore.delete('referral_code');
      return { success: false, message: 'Cannot refer yourself' };
    }

    // Create the referral
    await prisma.referral.create({
      data: {
        referralCodeId: refCode.id,
        referredUserId: session.user.id,
        status: 'JOINED'
      }
    });

    // Award XP to the referrer? The API normally handles this, 
    // but we can add a basic transaction here or let a background task handle it.
    // For now, let's keep it simple and just link them.
    
    await prisma.xPTransaction.create({
        data: {
            userId: refCode.userId,
            amount: 500, // 500 XP for referral
            reason: `Referral Join: ${session.user.email}`
        }
    });

    cookieStore.delete('referral_code');
    return { success: true };

  } catch (error) {
    console.error('Error linking referral:', error);
    return { success: false, message: 'Internal error' };
  }
}
