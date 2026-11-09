import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl, getInternalApiKey } from '@/app/lib/api';

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

  let sessionUserId: string | undefined;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    sessionUserId = session?.user?.id;
  } catch {
    // transient session read
  }

  const effectiveUserId = sessionUserId || userId;
  if (!effectiveUserId) {
    return NextResponse.json(null, { status: 200 });
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/cap/status/${effectiveUserId}`, {
      cache: 'no-store',
      headers: { 'x-api-key': getInternalApiKey() },
    });

    if (!res.ok) {
      return NextResponse.json(null, { status: 200 });
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
    return NextResponse.json(null, { status: 200 });
  }
}
