'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle2, Clock, User, Search } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Order } from '@/lib/types';

const chartData = [
  { day: 'Mon', value: 2800 },
  { day: 'Tue', value: 3200 },
  { day: 'Wed', value: 3500 },
  { day: 'Thu', value: 3800 },
  { day: 'Fri', value: 4000 },
];

const recentOrders = [
  {
    id: 1,
    type: 'new',
    title: 'New order from Sarah Jones',
    details: '1,200ETB, 5 mins ago',
    icon: '👤',
  },
  {
    id: 2,
    type: 'processing',
    title: 'Order #1003 is being processed',
    details: '5 mins ago',
    icon: '⏳',
  },
  {
    id: 3,
    type: 'shipped',
    title: 'Order #1034 has been shipped',
    details: '7 mins ago',
    icon: '✓',
  },
];

const defaultOrders: Order[] = [
  {
    id: '1034',
    customerName: 'Sarah Jones',
    email: 'sarah@gmail.com',
    items: 'Elegant Luxury Bag',
    amount: '1,200 ETB',
    status: 'Completed',
    paymentStatus: 'Paid',
    deliveryOption: 'Standard',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '1007',
    customerName: 'John Doe',
    email: 'john@gmail.com',
    items: 'Earpods',
    amount: '800 ETB',
    status: 'Processing',
    paymentStatus: 'Processing',
    deliveryOption: 'Standard',
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    id: '1004',
    customerName: 'Emma Smith',
    email: 'emma@gmail.com',
    items: 'Smart Watch',
    amount: '4,000 ETB',
    status: 'Completed',
    paymentStatus: 'Paid',
    deliveryOption: 'Hud Hud',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: '1008',
    customerName: 'Michael Brown',
    email: 'michael@gmail.com',
    items: 'Galaxy S26',
    amount: '300 ETB',
    status: 'Processing',
    paymentStatus: 'Processing',
    deliveryOption: 'Standard',
    createdAt: new Date(Date.now() - 13 * 60000).toISOString(),
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = storage.getAll<Order>('orders');
    return stored.length > 0 ? stored : defaultOrders;
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  const newOrders = orders.filter(o => o.status === 'New').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and fulfill customer orders</p>
      </div>

      {/* Revenue Chart and Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="col-span-2 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">This Week</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">4,000</span>
              <span className="text-gray-600">ETB</span>
              <span className="text-emerald-600 text-sm font-medium">↗ 6%</span>
            </div>
            <p className="text-sm text-emerald-600 mt-2">+20% from last month</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 text-right mt-4">Last 30 days</p>
        </Card>

        {/* Order Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Order Activity</h3>
          <div className="space-y-6">
            <div className="text-center bg-orange-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-orange-500">{newOrders}</p>
              <p className="text-sm text-gray-600 mt-1">New Orders</p>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-500">{processingOrders}</p>
              <p className="text-sm text-gray-600 mt-1">Processing</p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-gray-700">{completedOrders}</p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-gray-100 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{order.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{order.title}</p>
                  <p className="text-sm text-gray-600">{order.details}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">→</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Item(s)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Delivery Opt.</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-900">{order.items}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} mins ago
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{order.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{order.deliveryOption}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
