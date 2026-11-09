import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

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

    const res = await fetch(`${getApiBaseUrl()}/assignments/${effectiveUserId}`, {
      cache: 'no-store',
      headers: { 'x-api-key': getInternalApiKey() },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch assignments' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error fetching assignments:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
