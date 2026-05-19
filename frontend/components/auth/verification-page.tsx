'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export function VerificationPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('registerEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  async function handleResendEmail() {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsResending(false);
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verify your account
        </h2>
        <p className="text-center text-gray-600 mt-4">
          Please verify your email address by following the link sent to{' '}
          <span className="font-semibold text-blue-600">{email}</span>.
        </p>
      </div>

      <Button
        onClick={handleResendEmail}
        disabled={isResending}
        variant="outline"
        className="border-gray-300 text-gray-700 py-6 px-8 font-medium hover:bg-gray-50"
      >
        {isResending ? 'Resending...' : 'Resend email'}
      </Button>

      <div className="pt-8">
        <p className="text-sm text-gray-500">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <Link href="/register/email" className="text-blue-600 hover:underline font-medium">
            try another email
          </Link>
        </p>
      </div>
    </div>
  );
}
