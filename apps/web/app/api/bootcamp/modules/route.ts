import { currentUser } from '@clerk/nextjs/server';
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

  const userAuth = await currentUser();
  if (!userAuth || userAuth.id !== clerkId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let user = await resolveInternalUserId(clerkId);
  
  if (!user?.id) {
    // Sync the user to the internal database automatically
    const email = userAuth.emailAddresses[0]?.emailAddress;
    const username = userAuth.username || email?.split('@')[0] || 'student';
    
    try {
      const createRes = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'dev-secret-key' },
        body: JSON.stringify({ clerkId, email, username, role: 'STUDENT' })
      });
      if (createRes.ok) {
        user = await createRes.json();
      }
    } catch (e) {
      console.error('Failed to auto-sync user', e);
    }
  }

  if (!user?.id) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const res = await fetch(`${API_BASE}/bootcamp/modules/${user.id}`, {
      cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch modules' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
