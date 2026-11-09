import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

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

  let sessionUserId: string | undefined;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    sessionUserId = session?.user?.id;
  } catch {
    // transient session read
  }

  const effectiveUserId = sessionUserId || userId;
  if (!effectiveUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const resolvedUser = { id: effectiveUserId };

  if (!resolvedUser?.id) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const existing = await fetch(`${getApiBaseUrl()}/cap/status/${resolvedUser.id}`, {
    cache: 'no-store',
    headers: { 'x-api-key': getInternalApiKey() },
  });

  if (existing.ok) {
    const existingText = await existing.text();
    if (existingText.trim().length > 0) {
      try {
        return NextResponse.json(normalizeApplication(JSON.parse(existingText)));
      } catch (e) {
        console.error('Error parsing existing application JSON:', e);
      }
    }
  }

  const res = await fetch(`${getApiBaseUrl()}/cap/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': getInternalApiKey() },
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