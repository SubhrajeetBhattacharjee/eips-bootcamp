import { NextResponse } from 'next/server';
import { fetchAllSeasons } from '@/app/lib/seasons';

export async function GET() {
  const data = await fetchAllSeasons();
  return NextResponse.json(data);
}

