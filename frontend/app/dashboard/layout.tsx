'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // TODO: Implement proper authentication check with backend
    // For now, allow access to dashboard
    setIsAuthed(true);
  }, []);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Sidebar />
      <DashboardHeader />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  );
}
