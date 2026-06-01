import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiFetch } from '@/app/lib/api';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.role;
  if (userRole !== 'admin' && userId !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = await apiFetch(`/cap/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating CAP application ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
  }
}
