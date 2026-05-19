/**
 * @file components/courier/header.tsx
 * @description Header component for courier dashboard
 * 
 * Displays:
 * - Courier name and email
 * - Status indicator (Active/Inactive)
 * - Rating and total deliveries
 * - Quick action buttons
 */

'use client';

import { useEffect, useState } from 'react';
import { Bell, MapPin, Star } from 'lucide-react';
import { Courier } from '@/lib/types';

/**
 * CourierHeader Component
 * Top navigation bar for courier dashboard
 * Shows courier info, status, and notifications
 */
export function CourierHeader() {
  const [courier, setCourier] = useState<Courier | null>(null);

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      const couriers = JSON.parse(localStorage.getItem('couriers') || '[]');
      const currentCourier = couriers.find((c: Courier) => c.id === courierId);
      setCourier(currentCourier);
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Courier Info */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{courier?.fullName}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{courier?.serviceAreas?.[0] || 'No areas'}</span>
            {courier?.isActive && (
              <>
                <span className="mx-1">•</span>
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                <span>Available</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center gap-6">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-gray-900">{courier?.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">({courier?.totalDeliveries} deliveries)</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
