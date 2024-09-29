import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase';
import { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

async function verifyCaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.success;
}

export async function POST(request: Request) {
  const { email, captchaToken } = await request.json();
  const db = await getAdminDb();

  // Verify CAPTCHA token
  const isCaptchaValid = await verifyCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return NextResponse.json({ error: 'Invalid CAPTCHA' }, { status: 400 });
  }

  // Check if email already exists
  const snapshot = await db.collection('waitlist').where('email', '==', email).get();

  if (!snapshot.empty) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  try {
    const docRef = await db.collection('waitlist').add({
      email,
      timestamp: new Date().toISOString()
    });

    // Get waitlist position
    const allDocs = await db.collection('waitlist').orderBy('timestamp', 'asc').get();
    const position = allDocs.docs.findIndex((doc: QueryDocumentSnapshot<DocumentData>) => doc.id === docRef.id) + 1;

    return NextResponse.json({ id: docRef.id, position }, { status: 201 });
  } catch (e) {
    console.error("Error adding document: ", e);
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
  }
}