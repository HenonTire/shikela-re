'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { resendVerificationEmail, verifyEmailAccount } from '@/lib/api-client';

export function VerificationPage() {
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    // 1. Fetch cached registration email
    const savedEmail = localStorage.getItem('registerEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // 2. Automatically verify account if token exists in query string
    if (token) {
      handleTokenVerification(token);
    }
  }, [token]);

  async function handleTokenVerification(verificationToken: string) {
    setIsVerifying(true);
    setMessage(null);

    try {
      const res = await verifyEmailAccount(verificationToken);
      setIsVerified(true);
      setMessage({
        type: 'success',
        text: res?.message || 'Email successfully verified! Proceeding to store setup...',
      });
      
      // Clear cached email on success and redirect to store creation after short delay
      localStorage.removeItem('registerEmail');
      setTimeout(() => {
        router.push('/register/store');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Verification failed. The link may be expired or invalid.',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendEmail() {
    if (!email) {
      setMessage({ type: 'error', text: 'No email address found to send verification to.' });
      return;
    }

    setIsResending(true);
    setMessage(null);

    try {
      const res = await resendVerificationEmail(email);
      setMessage({
        type: 'success',
        text: res?.message || 'A new verification link has been sent to your email address.',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to resend verification email. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="space-y-6 text-center pt-8 px-2 md:px-0 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isVerified ? 'Account Verified!' : 'Verify your account'}
        </h2>
        <p className="text-center text-gray-600 mt-4">
          {isVerified ? (
            'Your email has been confirmed successfully.'
          ) : (
            <>
              Please verify your email address by following the link sent to{' '}
              <span className="font-semibold text-blue-600">{email || 'your email'}</span>.
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        {!isVerified && (
          <Button
            onClick={handleResendEmail}
            disabled={isResending || isVerifying}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 py-6 font-medium hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </Button>
        )}

        {isVerifying && (
          <p className="text-sm text-gray-500 animate-pulse">
            Verifying your account token...
          </p>
        )}

        {message && (
          <p
            className={`text-sm mt-2 p-3 rounded-md w-full text-center ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}