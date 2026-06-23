import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:4000';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const resolvedParams = await params;
  try {
    const res = await fetch(`${API_BASE}/events/${resolvedParams.eventId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key'},
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to delete event' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
