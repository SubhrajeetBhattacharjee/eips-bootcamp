import { NextResponse } from 'next/server';

const API_BASE = 'http://localhost:4000';

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

async function resolveInternalUserId(clerkId: string) {
  try {
    const res = await fetch(`${API_BASE}/users/clerk/${encodeURIComponent(clerkId)}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text.trim()) return null;

    return JSON.parse(text) as { id: string } | null;
  } catch (err) {
    // Backend unreachable — return null so callers can fallback
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clerkId = url.searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ message: 'Missing clerkId' }, { status: 400 });
  }

  const user = await resolveInternalUserId(clerkId);
  if (!user?.id) {
    return NextResponse.json(null, { status: 200 });
  }

  try {
    const res = await fetch(`${API_BASE}/cap/status/${user.id}`, {
      cache: 'no-store',
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