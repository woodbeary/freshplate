import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;

  const db = await getAdminDb();
  const snapshot = await db.collection('waitlist')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const waitlistData = snapshot.docs.map(doc => ({
    id: doc.id,
    email: doc.data().email,
    timestamp: doc.data().timestamp
  }));

  const totalSnapshot = await db.collection('waitlist').count().get();
  const total = totalSnapshot.data().count;

  return NextResponse.json({
    entries: waitlistData,
    total,
    page,
    limit
  });
}