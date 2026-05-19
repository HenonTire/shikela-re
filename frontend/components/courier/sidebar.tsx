/**
 * @file components/courier/sidebar.tsx
 * @description Sidebar navigation for courier dashboard
 * 
 * Navigation items:
 * - Dashboard: Overview and quick stats
 * - Deliveries: Active and available deliveries
 * - Earnings: Income tracking and payouts
 * - Messages: Communication with stores and customers
 * - Profile: Courier information and ratings
 * - Settings: Account preferences
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, DollarSign, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { clearSession } from '@/lib/api-client';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/courier/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Deliveries',
    href: '/courier/deliveries',
    icon: Package,
  },
  {
    label: 'Earnings',
    href: '/courier/earnings',
    icon: DollarSign,
  },
  {
    label: 'Messages',
    href: '/courier/messages',
    icon: MessageSquare,
  },
  {
    label: 'Profile',
    href: '/courier/profile',
    icon: User,
  },
  {
    label: 'Settings',
    href: '/courier/settings',
    icon: Settings,
  },
];

/**
 * CourierSidebar Component
 * Navigation sidebar for courier dashboard
 * Shows active page highlight and quick navigation
 * 
 * Features:
 * - Active page indication
 * - Quick navigation to all courier features
 * - Logout functionality
 * - Collapsible on mobile
 */
export function CourierSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
      {/* Logo */}
      <Link href="/courier/dashboard" className="block mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shikela</h1>
        <p className="text-sm text-gray-500">Courier Portal</p>
      </Link>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
