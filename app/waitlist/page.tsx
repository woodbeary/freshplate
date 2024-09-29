'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Here you would typically send the email to your backend or a service like Mailchimp
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col justify-center items-center px-4">
      <Link href="/" className="absolute top-4 left-4 text-green-800 hover:text-green-600">
        &larr; Back to Home
      </Link>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Join the FreshPlate Waitlist</h1>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600 mb-4">
              Be the first to know when FreshPlate launches. Enter your email to join our exclusive waitlist.
            </p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Join Waitlist'
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">
              Thank you for joining our waitlist!
            </p>
            <p className="text-gray-600">
              We'll notify you as soon as FreshPlate is ready to launch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}