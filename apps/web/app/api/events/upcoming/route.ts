import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 6,
      include: {
        module: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(events);
  } catch (err: any) {
    console.error('Error in /api/events/upcoming:', err);
    return NextResponse.json([], { status: 200 }); // return empty array rather than breaking the UI
  }
}
