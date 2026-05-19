/**
 * @file app/courier/dashboard/page.tsx
 * @description Courier dashboard home page
 * 
 * Displays:
 * - Quick stats (today's earnings, deliveries count, success rate)
 * - Recent deliveries
 * - Performance metrics
 * - Quick actions
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, TrendingUp, Clock, MapPin, Phone } from 'lucide-react';
import { Delivery, Courier } from '@/lib/types';
import Link from 'next/link';

/**
 * CourierDashboard Component
 * Main dashboard showing courier's key metrics and recent activity
 */
export default function CourierDashboard() {
  const [courier, setCourier] = useState<Courier | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [todaysEarnings, setTodaysEarnings] = useState(0);

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      // Load courier info
      const couriers = JSON.parse(localStorage.getItem('couriers') || '[]');
      const current = couriers.find((c: Courier) => c.id === courierId);
      setCourier(current);

      // Load deliveries
      const allDeliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
      const courierDeliveries = allDeliveries.filter((d: Delivery) => d.courierId === courierId);
      setDeliveries(courierDeliveries);

      // Calculate today's earnings
      const today = new Date().toISOString().split('T')[0];
      const todayDeliveries = courierDeliveries.filter(
        (d: Delivery) => d.assignedAt.startsWith(today) && d.status === 'Delivered'
      );
      const earnings = todayDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0);
      setTodaysEarnings(earnings);
    }
  }, []);

  const activeDeliveries = deliveries.filter(
    d => !['Delivered', 'Failed', 'Cancelled'].includes(d.status)
  );

  const completedToday = deliveries.filter(
    d => d.status === 'Delivered' && d.assignedAt.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {courier?.fullName}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {/* Today's Earnings */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today&apos;s Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{todaysEarnings} ETB</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        {/* Active Deliveries */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Deliveries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeDeliveries.length}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        {/* Completed Today */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedToday}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </Card>

        {/* Success Rate */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{courier?.successRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Recent Active Deliveries */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Deliveries</h2>
          <Link href="/courier/deliveries">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {activeDeliveries.length > 0 ? (
          <div className="space-y-4">
            {activeDeliveries.slice(0, 5).map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{delivery.customerName}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        delivery.status === 'InTransit' ? 'bg-blue-100 text-blue-700' :
                        delivery.status === 'PickedUp' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {delivery.status === 'InTransit' ? 'In Transit' : delivery.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {delivery.deliveryAddress}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4" />
                      {delivery.customerPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{delivery.deliveryFee} ETB</p>
                    <Link href={`/courier/deliveries`}>
                      <Button size="sm" className="mt-2">Update Status</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No active deliveries</p>
            <p className="text-sm text-gray-500 mt-1">Check available deliveries</p>
            <Link href="/courier/deliveries">
              <Button className="mt-4">View Available Deliveries</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Performance Tip */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Performance Tip</h3>
          <p className="text-sm text-gray-700">
            Complete more deliveries today to improve your success rate and earn more. You&apos;re {activeDeliveries.length} deliveries away from today&apos;s target!
          </p>
        </div>
      </Card>
    </div>
  );
}
