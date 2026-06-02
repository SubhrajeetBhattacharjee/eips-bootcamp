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

async function resolveInternalUserId(clerkId: string) {
  const res = await fetch(`${API_BASE}/users/clerk/${encodeURIComponent(clerkId)}`, {
    cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
  });

  if (!res.ok) return null;

  const text = await res.text();
  if (!text.trim()) return null;

  return JSON.parse(text) as { id: string } | null;
}

async function syncClerkUser(clerkId: string, email?: string, username?: string | null) {
  if (!email) {
    return null;
  }

  const res = await fetch(`${API_BASE}/auth/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'dev-secret-key' },
    body: JSON.stringify({ clerkId, email, username: username ?? undefined }),
  });

  if (!res.ok) {
    return null;
  }

  const text = await res.text();
  if (!text.trim()) return null;

  return JSON.parse(text) as { id: string } | null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { clerkId, graduationYear, email, username, ...data } = body as {
    clerkId?: string;
    graduationYear?: string | number;
    email?: string;
    username?: string | null;
    [key: string]: unknown;
  };

  if (!clerkId) {
    return NextResponse.json({ message: 'Missing clerkId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId || userId !== clerkId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await resolveInternalUserId(clerkId);
  const resolvedUser = user ?? (await syncClerkUser(clerkId, email, username));

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