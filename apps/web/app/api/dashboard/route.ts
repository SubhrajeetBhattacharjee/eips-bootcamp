import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDashboardData } from '@/app/lib/dashboard';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clerkId = url.searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ message: 'Missing clerkId' }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId || userId !== clerkId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const dashboard = await getDashboardData(clerkId);
  return NextResponse.json(dashboard);
}