import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, image, college, hobbies, bio, city, country, twitter, github, linkedin } = body;

    // Update user in DB (handled by BetterAuth mostly, but we can do it here too just in case)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image,
        profile: {
          upsert: {
            create: {
              fullName: name,
              college,
              hobbies,
              bio,
              city,
              country,
              twitter,
              github,
              linkedin,
            },
            update: {
              fullName: name,
              college,
              hobbies,
              bio,
              city,
              country,
              twitter,
              github,
              linkedin,
            },
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
