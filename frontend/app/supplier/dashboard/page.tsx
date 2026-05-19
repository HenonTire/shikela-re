'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  Truck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { SupplierOrder } from '@/lib/types';

export default function SupplierDashboardPage() {
  const [supplierId, setSupplierId] = useState('');
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupplierId(localStorage.getItem('supplierId') || '');
  }, []);

  useEffect(() => {
    if (!supplierId) return;
    const supplierOrders = storage.getAll<SupplierOrder>('supplierOrders').filter(
      (order) => order.supplierId === supplierId
    );
    setOrders(supplierOrders);

    setStats({
      totalOrders: supplierOrders.length,
      newOrders: supplierOrders.filter((o) => o.status === 'New').length,
      processingOrders: supplierOrders.filter((o) => o.status === 'Processing').length,
      completedOrders: supplierOrders.filter((o) => o.status === 'Shipped').length,
    });
  }, [supplierId]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6 bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.newOrders}</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-amber-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Processing</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.processingOrders}</p>
            </div>
            <Truck className="w-5 h-5 text-amber-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/supplier/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No orders yet</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/supplier/products">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
              <Link href="/supplier/orders">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  View All Orders
                </Button>
              </Link>
              <Link href="/supplier/deliveries">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Truck className="w-4 h-4" />
                  Track Deliveries
                </Button>
              </Link>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-blue-100 mb-4">
              Check our supplier guide for best practices.
            </p>
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
              Learn More
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
