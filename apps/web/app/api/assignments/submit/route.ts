import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE = 'http://127.0.0.1:4000';


export async function POST(request: Request) {
  const body = await request.json();
  const { userId, assignmentId, content } = body;

  if (!userId || !assignmentId || !content) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  } 

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  

  try {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'dev-secret-key' },
      body: JSON.stringify({ userId: userId, content }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ message: msg || 'Failed to submit assignment' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
