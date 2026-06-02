import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
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

export async function POST(request: Request) {
  const body = await request.json();
  const { clerkId, rewardId } = body;

  if (!clerkId || !rewardId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  } 

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId || userId !== clerkId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await resolveInternalUserId(clerkId);
  if (!user?.id) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'dev-secret-key' },
      body: JSON.stringify({ userId: user.id, rewardId }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ message: msg || 'Failed to redeem reward' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
