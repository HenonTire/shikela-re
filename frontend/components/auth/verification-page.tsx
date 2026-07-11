'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VerificationPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Read the email locally from localStorage without contacting the backend
    const savedEmail = localStorage.getItem('registerEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  async function handleResendEmail() {
    setIsResending(true);
    // Simulated delay — email sending is paused for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
  }

  return (
    <div className="space-y-6 text-center pt-8 px-2 md:px-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verify your account
        </h2>
        <p className="text-center text-gray-600 mt-4">
          Please verify your email address by following the link sent to{' '}
          <span className="font-semibold text-blue-600">{email || 'your email'}</span>.
        </p>
        <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
          ⚠️ Development mode: Real email delivery is currently paused.
        </p>
      </div>

      <Button
        onClick={handleResendEmail}
        disabled={isResending}
        variant="outline"
        className="border-gray-300 text-gray-700 py-6 px-8 font-medium hover:bg-gray-50 cursor-pointer"
      >
        {isResending ? 'Simulating Send...' : 'Resend email (Simulated)'}
      </Button>

      <div className="pt-8 border-t border-gray-100">
        <Link 
          href="/register/store" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Skip to store creation step &rarr;
        </Link>
      </div>
    </div>
  );
}