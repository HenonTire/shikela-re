'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Truck,
  CreditCard,
  Sparkles,
  Settings,
  LogOut,
} from 'lucide-react';
import ShikelaLogo from "@/components/dashboard/ShikelaLogo"
import { clearSession } from '@/lib/api-client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Online Store', href: '/dashboard/online-store', icon: Store },
  { name: 'Shipping', href: '/dashboard/shipping', icon: Truck },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Shikela AI', href: '/dashboard/ai', icon: Sparkles },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  const userFullName =
    localStorage.getItem('firstName') && localStorage.getItem('lastName')
      ? `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`
      : 'Store Owner';

  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col z-50">
      <div className="flex-shrink-0 p-6 border-b border-gray-200 w-full flex items-center justify-center flex-col gap-2">
        <ShikelaLogo />
        <p className="text-sm text-gray-500">Store Owner</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userFullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userFullName}
            </p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full text-xs"
          size="sm"
        >
          Upgrade
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100 h-8"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  );
}
