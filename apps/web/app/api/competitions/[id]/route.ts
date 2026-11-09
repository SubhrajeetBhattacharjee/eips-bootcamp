import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  fetchCompetitionDetail,
  registerForCompetition,
  startCompetition,
  submitCompetition,
} from '@/app/lib/competitions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id || (userId ?? undefined);

  const data = await fetchCompetitionDetail(id, sessionUserId);
  if (!data) {
    return NextResponse.json(
      { message: 'Competition not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action || 'register';

    if (action === 'register') {
      const res = await registerForCompetition(id, sessionUserId);
      return NextResponse.json(res);
    } else if (action === 'start') {
      const res = await startCompetition(id, sessionUserId);
      return NextResponse.json(res);
    } else if (action === 'submit') {
      const answers = body.answers || [];
      const res = await submitCompetition(id, sessionUserId, answers);
      return NextResponse.json(res);
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Action failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}

