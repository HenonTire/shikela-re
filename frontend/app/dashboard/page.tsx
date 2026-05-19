'use client';

import { WelcomeHero } from '@/components/dashboard/welcome-hero';
import { SetupProgress } from '@/components/dashboard/setup-progress';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <WelcomeHero />

      {/* Setup Progress Section */}
      <SetupProgress />
    </div>
  );
}
