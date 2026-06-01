import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiFetch } from '@/app/lib/api';

export async function GET(request: Request) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.role;
  if (userRole !== 'admin' && userId !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await apiFetch('/cap/applications');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CAP applications:', error);
    return NextResponse.json({ message: 'Failed to fetch' }, { status: 500 });
  }
}
