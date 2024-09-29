'use client';

import Link from 'next/link';
import SignupForm from '@/components/SignupForm';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Waitlist() {
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center px-4 py-8">
      <Link href="/" className="self-start ml-4 mb-8 text-green-800 hover:text-green-600 flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        {!isSignupSuccess && (
          <>
            <h1 className="text-4xl font-bold text-green-800 mb-4 text-center">Join the FreshPlate Waitlist</h1>
            <p className="text-gray-600 mb-6 text-center">
              Be the first to know when FreshPlate launches. Enter your email to join our exclusive waitlist.
            </p>
          </>
        )}
        <SignupForm onSignupSuccess={() => setIsSignupSuccess(true)} />
      </div>
    </div>
  );
}