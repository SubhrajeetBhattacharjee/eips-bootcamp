import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:4000';


export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const resolvedParams = await params;
  const body = await request.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const userAuth = session?.user;
  if (!userAuth || userAuth.id !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  

  try {
    const res = await fetch(`${API_BASE}/bootcamp/modules/${resolvedParams.moduleId}/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key'},
      body: JSON.stringify({ userId: userId })
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to subscribe' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
