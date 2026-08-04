'use client';

import Link from 'next/link';
import ShikelaLogo from "@/components/dashboard/ShikelaLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function AuthLayout({ children, showFooter = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <ShikelaLogo />
      </header>

      <div className="flex-1 flex flex-col items-center 2xl:pt-0">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {showFooter && (
        <div className="border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to the{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}