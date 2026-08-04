'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';

interface UserDetailResponse {
  id: number | string;
  first_name?: string;
}

export function WelcomeHero() {
  const [firstName, setFirstName] = useState('Sam');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await apiRequest<UserDetailResponse>('/auth/user/current-user/', {
          method: 'GET',
          auth: true,
        });
        if (userData?.first_name) {
          setFirstName(userData.first_name);
          localStorage.setItem('firstName', userData.first_name);
        }
      } catch {
        const saved = localStorage.getItem('firstName');
        if (saved) setFirstName(saved);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 space-y-3">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-50 border border-white/20 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Store Command Center</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Welcome back, {firstName}! ✨
        </h1>

        <p className="text-blue-100/90 text-sm md:text-base max-w-xl font-normal leading-relaxed">
          Your digital storefront is live. Scale your inventory, track orders, and boost sales with AI insights.
        </p>
      </div>

      <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
        <Link href="/dashboard/ai" className="block">
          <Button className="w-full md:w-auto bg-white text-blue-700 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 gap-2.5 rounded-2xl px-7 py-6 text-sm font-semibold shadow-lg shadow-black/10 cursor-pointer">
            <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
            <span>Ask Shikela AI</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}