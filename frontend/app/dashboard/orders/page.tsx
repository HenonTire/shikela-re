'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';

// --- TYPES FOR BACKEND RESPONSE MATCHING ---
interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface BackendOrder {
  id: string;
  items: string | OrderItem[]; // Can adapt depending on backend payload
  total_amount?: string;
  amount?: string;
  status: string;
  payment_status?: string;
  delivery_method: 'courier' | 'seller';
  created_at: string;
  customer_name?: string;
}

interface DashboardMetrics {
  total_revenue: string;
  this_month_revenue: string;
  orders_count: number;
  units_sold: number;
  today_orders: number;
  last_7_days: { date: string; revenue: string }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve token securely (usually stored on login)
  const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        };

        // 1. Fetch Dashboard Analytics Data
        const metricsRes = await fetch('http://127.0.0.1:8000/analytics/shop/dashboard/', { headers });
        if (!metricsRes.ok) throw new Error('Failed to load dashboard metrics.');
        const metricsData: DashboardMetrics = await metricsRes.json();
        setMetrics(metricsData);

        // 2. Fetch Active Orders
        const ordersRes = await fetch('http://127.0.0.1:8000/order/orders/', { headers });
        if (!ordersRes.ok) throw new Error('Failed to load orders.');
        const ordersData: BackendOrder[] = await ordersRes.json();
        setOrders(ordersData);

      } catch (err: any) {
        setError(err.message || 'An error occurred while syncing data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders matching Search Query
  const filteredOrders = orders.filter(order => {
    const itemString = typeof order.items === 'string' ? order.items : JSON.stringify(order.items);
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Dynamic counter mappings derived from real backend data status mapping
  const newOrdersCount = orders.filter(o => o.status.toLowerCase() === 'pending' || o.status.toLowerCase() === 'new').length;
  const processingCount = orders.filter(o => o.status.toLowerCase() === 'processing' || o.status.toLowerCase() === 'confirmed').length;
  const completedCount = orders.filter(o => o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'completed').length;

  // Recharts payload parser mapped to backend structure `last_7_days: [{date, revenue}]`
  const chartData = metrics?.last_7_days.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: parseFloat(d.revenue),
  })) || [];

  if (loading) return <div className="p-6 text-center text-gray-600">Syncing live store data...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">Live updates synced directly with Shikela Backend Engine</p>
      </div>

      {/* Revenue Chart and Activity Metric Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Recharts Component */}
        <Card className="col-span-1 md:col-span-2 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">This Month Revenue</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {parseFloat(metrics?.this_month_revenue || '0').toLocaleString()}
              </span>
              <span className="text-gray-600 font-semibold">ETB</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total Historic Generated: {parseFloat(metrics?.total_revenue || '0').toLocaleString()} ETB</p>
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
              <Tooltip formatter={(value) => [`${value} ETB`, 'Revenue']} />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Dynamic Aggregated Status Breakdown Cards */}
        <Card className="p-6 flex flex-col justify-between">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Metric Activity</h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="text-center bg-orange-50 rounded-lg p-3">
              <p className="text-3xl font-bold text-orange-500">{newOrdersCount}</p>
              <p className="text-sm text-gray-600 mt-1">New / Pending</p>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <p className="text-3xl font-bold text-blue-500">{processingCount}</p>
              <p className="text-sm text-gray-600 mt-1">Processing / Confirmed</p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              <p className="text-sm text-gray-600 mt-1">Delivered Full</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Query Search Filter bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Filter orders by ID or items description..."
            className="pl-10 bg-gray-100 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Primary Data Grid Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Item Details</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Fulfillment Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Captured Value</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Delivery Route</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                      #{order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">
                      {typeof order.items === 'string' ? order.items : 'Structured Payload'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        ['delivered', 'completed'].includes(order.status.toLowerCase()) ? 'bg-green-100 text-green-700' :
                        ['processing', 'confirmed', 'in_transit'].includes(order.status.toLowerCase()) ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {parseFloat(order.amount || order.total_amount || '0').toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium capitalize">
                      {order.delivery_method}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No records found matching current database state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}