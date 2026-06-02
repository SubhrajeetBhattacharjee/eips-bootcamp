import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:4000";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'x-api-key': 'dev-secret-key' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API Proxy Error:", err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
