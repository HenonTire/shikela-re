/**
 * @file app/courier/earnings/page.tsx
 * @description Courier earnings and payouts management
 * 
 * Shows:
 * - Monthly earnings breakdown
 * - Daily earnings chart
 * - Payout history
 * - Commission structure
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Delivery, CourierEarnings } from '@/lib/types';
import { storage } from '@/lib/storage';

/**
 * CourierEarnings Component
 * Displays earnings history, breakdown, and payout management
 * 
 * Data Flow:
 * 1. Load deliveries for this courier from localStorage
 * 2. Calculate earnings from completed deliveries
 * 3. Group by month for earnings records
 * 4. Display payout history and pending amounts
 */
export default function CourierEarnings() {
  const [earnings, setEarnings] = useState<CourierEarnings[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [thisMonth, setThisMonth] = useState('0 ETB');

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      // Load deliveries
      const allDeliveries = storage.getAll<Delivery>('deliveries');
      const courierDeliveries = allDeliveries.filter(d => d.courierId === courierId && d.status === 'Delivered');
      setDeliveries(courierDeliveries);

      // Calculate earnings
      const total = courierDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0);
      setTotalEarnings(total);

      // Calculate this month's earnings
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const thisMonthEarnings = courierDeliveries
        .filter(d => d.completedAt?.startsWith(currentMonth))
        .reduce((sum, d) => sum + d.deliveryFee, 0);
      setThisMonth(`${thisMonthEarnings} ETB`);

      // Load earnings records
      const existingEarnings = storage.getAll<CourierEarnings>('courierEarnings');
      const courierEarnings = existingEarnings.filter(e => e.courierId === courierId);
      setEarnings(courierEarnings);

      // Calculate pending (not yet paid)
      const pending = courierEarnings
        .filter(e => e.status !== 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);
      setPendingPayout(pending);
    }
  }, []);

  const monthlyBreakdown = deliveries.reduce((acc, delivery) => {
    const month = delivery.completedAt?.substring(0, 7) || 'Unknown';
    if (!acc[month]) {
      acc[month] = { count: 0, amount: 0 };
    }
    acc[month].count += 1;
    acc[month].amount += delivery.deliveryFee;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-2">Track your income and payouts</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total Earnings */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalEarnings} ETB</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        {/* This Month */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{thisMonth}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        {/* Pending Payout */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Payout</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{pendingPayout} ETB</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="details">Earnings Details</TabsTrigger>
        </TabsList>

        {/* Monthly Breakdown */}
        <TabsContent value="monthly" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
            <div className="space-y-3">
              {Object.entries(monthlyBreakdown)
                .sort()
                .reverse()
                .map(([month, data]) => (
                  <div key={month} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{month}</p>
                      <p className="text-sm text-gray-600">{data.count} deliveries</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{data.amount} ETB</p>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Payout History */}
        <TabsContent value="payouts" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
            {earnings.length > 0 ? (
              <div className="space-y-3">
                {earnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{earning.period}</p>
                      <p className="text-sm text-gray-600">{earning.deliveries} deliveries</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{earning.amount} ETB</p>
                      <div className="flex items-center gap-1 mt-1">
                        {earning.status === 'Paid' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-semibold">Paid</span>
                          </>
                        )}
                        {earning.status === 'Pending' && (
                          <>
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs text-yellow-600 font-semibold">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No payout records yet</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Earnings Details */}
        <TabsContent value="details" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Commission Structure</p>
                <p className="font-semibold text-gray-900">100% of delivery fees</p>
                <p className="text-xs text-gray-600 mt-1">You earn the full amount per delivery</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Deliveries</p>
                <p className="font-semibold text-gray-900">{deliveries.length}</p>
                <p className="text-xs text-gray-600 mt-1">Completed deliveries this period</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Average per Delivery</p>
                <p className="font-semibold text-gray-900">
                  {deliveries.length > 0 ? Math.round(totalEarnings / deliveries.length) : 0} ETB
                </p>
                <p className="text-xs text-gray-600 mt-1">Average earnings per delivery</p>
              </div>
            </div>

            {/* Request Payout Button */}
            <Button className="w-full mt-6 bg-green-600 hover:bg-green-700" size="lg">
              Request Payout
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
