'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Package, DollarSign, TrendingUp, ShoppingBag, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api-client'; // Adjust path based on your project setup

export interface ShopAnalytics {
  total_revenue: string;
  this_month_revenue: string;
  orders_count: number;
  units_sold: number;
  refund_amount: string;
  commission_paid: string;
  platform_fee: string;
  today_orders: number;
  last_7_days: Array<{ date: string; revenue: string }>;
}

export function SetupProgress() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [analytics, setAnalytics] = useState<ShopAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardAnalytics() {
      try {
        setLoading(true);
        // Using the robust apiRequest client with auth: true
        const data = await apiRequest<ShopAnalytics>('/analytics/shop/dashboard/', {
          method: 'GET',
          auth: true,
        });
        setAnalytics(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch analytics data');
        }
      } finally {
        setLoading(false);
        setIsHydrated(true);
      }
    }

    fetchDashboardAnalytics();
  }, []);

  if (!isHydrated || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-28 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">Could not load store analytics: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary Grid */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h4 className="text-xl font-bold text-gray-900 mt-1">${analytics.total_revenue}</h4>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <h4 className="text-xl font-bold text-gray-900 mt-1">${analytics.this_month_revenue}</h4>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h4 className="text-xl font-bold text-gray-900 mt-1">{analytics.orders_count}</h4>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Units Sold</p>
              <h4 className="text-xl font-bold text-gray-900 mt-1">{analytics.units_sold}</h4>
            </div>
          </Card>
        </div>
      )}

      {/* Additional breakdown row if needed */}
      {analytics?.last_7_days && analytics.last_7_days.length > 0 && (
        <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {analytics.last_7_days.map((day, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{day.date}</p>
                <p className="text-sm font-semibold text-gray-900">${day.revenue}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}