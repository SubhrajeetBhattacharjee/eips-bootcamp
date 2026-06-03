import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
import { NextResponse } from 'next/server';

const API_BASE = 'http://127.0.0.1:4000';

function formatDate(dateInput: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateInput));
}

function addDays(dateInput: string | Date, days: number) {
  const date = new Date(dateInput);
  date.setDate(date.getDate() + days);
  return date;
}

function normalizeApplication(application: { createdAt?: string; [key: string]: unknown }) {
  const appliedAt = application.createdAt ?? new Date().toISOString();
  return {
    ...application,
    appliedOn: formatDate(appliedAt),
    expectedResponse: formatDate(addDays(appliedAt, 7)),
  };
}




export async function POST(request: Request) {
  const body = await request.json();
  const { userId, graduationYear, email, username, ...data } = body as {
    userId?: string;
    graduationYear?: string | number;
    email?: string;
    username?: string | null;
    [key: string]: unknown;
  };

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const resolvedUser = { id: userId };

  if (!resolvedUser?.id) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const existing = await fetch(`${API_BASE}/cap/status/${resolvedUser.id}`, {
    cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
  });

  if (existing.ok) {
    const existingText = await existing.text();
    if (existingText.trim().length > 0) {
      return NextResponse.json(normalizeApplication(JSON.parse(existingText)));
    }
  }

  const res = await fetch(`${API_BASE}/cap/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'dev-secret-key' },
    body: JSON.stringify({
      userId: resolvedUser.id,
      graduationYear: Number(graduationYear),
      ...data,
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    return NextResponse.json({ message: message || 'Failed to submit CAP application' }, { status: res.status });
  }

  const result = await res.json();
  return NextResponse.json(normalizeApplication(result), { status: 201 });
}