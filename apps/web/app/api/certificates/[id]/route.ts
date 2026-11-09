import { NextResponse } from 'next/server';
import { verifyCertificate } from '@/app/lib/certificates';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await verifyCertificate(id);

  if (!data) {
    return NextResponse.json(
      { message: 'Certificate verification failed or not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

