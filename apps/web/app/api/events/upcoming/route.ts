import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE = 'http://127.0.0.1:4000';


export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const userAuth = session?.user;
  if (!userAuth || userAuth.id !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  

  try {
    const res = await fetch(`${API_BASE}/events/upcoming/${userId}`, {
      cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch upcoming events' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
