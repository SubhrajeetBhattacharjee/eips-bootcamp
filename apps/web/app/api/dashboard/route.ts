import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDashboardData } from '@/app/lib/dashboard';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get('userId');

    let sessionUserId: string | undefined;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      sessionUserId = session?.user?.id;
    } catch (authErr) {
      console.warn('Session check warning in /api/dashboard:', authErr);
    }

    const effectiveUserId = sessionUserId || queryUserId;

    if (!effectiveUserId) {
      return NextResponse.json({ message: 'Missing user identification' }, { status: 401 });
    }

    const dashboard = await getDashboardData(effectiveUserId);
    return NextResponse.json(dashboard);
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
