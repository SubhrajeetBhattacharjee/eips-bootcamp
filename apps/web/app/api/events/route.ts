import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:4000';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      cache: 'no-store',
      headers: { 'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key'},
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch events' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key'},
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to create event' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
