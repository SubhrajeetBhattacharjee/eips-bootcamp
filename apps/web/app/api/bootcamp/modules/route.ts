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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${getApiBaseUrl()}/bootcamp/modules/${effectiveUserId}`, {
      cache: 'no-store',
      headers: { 'x-api-key': getInternalApiKey() },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch modules' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Bootcamp modules route error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
