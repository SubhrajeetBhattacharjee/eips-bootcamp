import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const API_BASE = 'http://127.0.0.1:4000';

async function resolveInternalUserId(clerkId: string) {
  try {
    const res = await fetch(`${API_BASE}/users/clerk/${encodeURIComponent(clerkId)}`, {
      cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.trim()) return null;
    return JSON.parse(text) as { id: string } | null;
  } catch (err) {
    return null;
  }
}

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

  const user = await resolveInternalUserId(clerkId);
  if (!user?.id) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const res = await fetch(`${API_BASE}/rewards/${user.id}`, {
      cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch rewards' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
