import { NextResponse } from 'next/server';

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
  const { password, captchaToken } = await request.json();

  // Verify CAPTCHA
  const isCaptchaValid = await verifyCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return NextResponse.json({ error: 'Invalid CAPTCHA' }, { status: 400 });
  }

  // Check password
  const correctPassword = process.env.ADMIN_PASSWORD || 'annaisthepass';
  if (password === correctPassword) {
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}