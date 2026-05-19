/**
 * @file components/supplier/sidebar.tsx
 * @description Sidebar navigation for supplier dashboard
 * 
 * Navigation items:
 * - Dashboard: Overview and business metrics
 * - Products: Inventory and product management
 * - Orders: Order requests from store owners
 * - Deliveries: Outbound shipment tracking
 * - Settings: Account and business preferences
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, ShoppingCart, Truck, Settings, LogOut } from 'lucide-react';
import { clearSession } from '@/lib/api-client';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/supplier/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Products',
    href: '/supplier/products',
    icon: Package,
  },
  {
    label: 'Orders',
    href: '/supplier/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Deliveries',
    href: '/supplier/deliveries',
    icon: Truck,
  },
  {
    label: 'Settings',
    href: '/supplier/settings',
    icon: Settings,
  },
];

/**
 * SupplierSidebar Component
 * Navigation sidebar for supplier dashboard with consistent styling
 * Matches courier sidebar UX patterns and styling
 * 
 * Features:
 * - Active page indication with blue highlight
 * - Responsive navigation with hover states
 * - Organized logout in footer section
 * - Clear visual hierarchy
 */
export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
      {/* Logo */}
      <Link href="/supplier/dashboard" className="block mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shikela</h1>
        <p className="text-sm text-gray-500">Supplier Portal</p>
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
