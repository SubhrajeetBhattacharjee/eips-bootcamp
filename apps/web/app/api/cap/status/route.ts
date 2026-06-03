import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
import { NextResponse } from 'next/server';

const API_BASE = 'http://127.0.0.1:4000';

type BackendCAPApplication = {
  createdAt?: string;
  status: string;
  [key: string]: unknown;
};

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

function normalizeApplication(application: BackendCAPApplication) {
  const appliedAt = application.createdAt ?? new Date().toISOString();
  return {
    ...application,
    appliedOn: formatDate(appliedAt),
    expectedResponse: formatDate(addDays(appliedAt, 7)),
  };
}


export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!sessionUserId) {
    return NextResponse.json(null, { status: 200 });
  }

  try {
    const res = await fetch(`${API_BASE}/cap/status/${userId}`, {
      cache: 'no-store',
      headers: { 'x-api-key': 'dev-secret-key' },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch CAP status' }, { status: res.status });
    }

    const text = await res.text();
    if (!text.trim()) {
      return NextResponse.json(null, { status: 200 });
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(normalizeApplication(parsed));
    } catch {
      return NextResponse.json(null, { status: 200 });
    }
  } catch (err) {
    // Network error (backend down) — return null so frontend can show fallback
    return NextResponse.json(null, { status: 200 });
  }
}