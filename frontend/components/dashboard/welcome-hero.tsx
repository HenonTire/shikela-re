'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Rocket } from 'lucide-react';

export function WelcomeHero() {
  // Use a default state to prevent hydration mismatches during server-side rendering
  const [firstName, setFirstName] = useState('Sam');

  useEffect(() => {
    // Safely access localStorage once the component mounts on the client side
    const savedName = localStorage.getItem('firstName');
    if (savedName) {
      setFirstName(savedName);
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white flex items-center justify-between">
      <div className="flex-1">
        {/* Getting Started Tag */}
        <div className="flex items-center text-gray-800 gap-2 mb-6 bg-white bg-opacity-20 w-fit px-3 py-1 rounded-full">
          <Rocket className="w-4 h-4" />
          <span className="text-sm font-medium">Getting Started</span>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold mb-4">
          👋 Welcome to Shikela
        </h1>

        <p className="text-lg text-blue-100 max-w-lg">
          You&apos;re just a few steps away from launching your e-commerce store.
        </p>
      </div>

      {/* Ask AI Button */}
      <Link href="/dashboard/ai">
        <Button className="bg-white text-blue-600 hover:bg-gray-100 gap-2 rounded-lg px-6 py-6 text-base font-medium cursor-pointer">
          <Zap className="w-5 h-5 fill-blue-600" />
          Ask Shikela AI
        </Button>
      </Link>
    </div>
  );
}