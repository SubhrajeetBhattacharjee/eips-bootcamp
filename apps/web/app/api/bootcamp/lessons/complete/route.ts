import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:4000';


export async function POST(request: Request) {
  const body = await request.json();
  const { userId, lessonId } = body;

  if (!userId || !lessonId) {
    return NextResponse.json({ message: 'Missing userId or lessonId' }, { status: 400 });
  } 

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  

  try {
    const res = await fetch(`${API_BASE}/bootcamp/modules/${lessonId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key'},
      body: JSON.stringify({ userId: userId }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ message: msg || 'Failed to complete lesson' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
