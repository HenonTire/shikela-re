'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crown, User, Sparkles, Search, MoreVertical } from 'lucide-react';

// Define structure matching our processed backend dataset
interface LiveCustomer {
  id: string;
  name: string;
  email: string;
  location: string;
  ordersCount: number;
  totalSpentAmount: number;
  status: 'VIP' | 'Regular' | 'New';
}

interface BackendOrder {
  id: string;
  amount?: string;
  total_amount?: string;
  customer_name?: string;
  customer_email?: string;
  delivery_address?: string;
  status: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<LiveCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read clean base URL from configuration parameters
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchCustomersFromOrders = async () => {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        
        const response = await fetch(`${BASE_URL}/order/orders/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error('Could not synchronize store relationships from backend engine.');
        }

        const orders: BackendOrder[] = await response.json();

        // Map and accumulate metrics for each distinct customer email
        const customerMap: Record<string, {
          name: string;
          location: string;
          ordersCount: number;
          totalSpent: number;
        }> = {};

        orders.forEach((order) => {
          // Fallback placeholders if optional properties are omitted by serializing schemas
          const email = order.customer_email || `customer_${order.id.slice(0, 4)}@shikela.internal`;
          const name = order.customer_name || 'Guest Checkout User';
          const location = order.delivery_address || 'Addis Ababa, ET';
          const rawAmount = parseFloat(order.amount || order.total_amount || '0');

          if (!customerMap[email]) {
            customerMap[email] = {
              name,
              location,
              ordersCount: 0,
              totalSpent: 0,
            };
          }

          customerMap[email].ordersCount += 1;
          customerMap[email].totalSpent += rawAmount;
        });

        // Transform records into view arrays matching frontend tier definitions
        const parsedCustomers: LiveCustomer[] = Object.entries(customerMap).map(([email, info], index) => {
          // Compute logical tier state variables using transaction volumes
          let tierStatus: 'VIP' | 'Regular' | 'New' = 'Regular';
          if (info.ordersCount >= 25 || info.totalSpent >= 3000) {
            tierStatus = 'VIP';
          } else if (info.ordersCount <= 1) {
            tierStatus = 'New';
          }

          return {
            id: String(index + 1),
            name: info.name,
            email: email,
            location: info.location,
            ordersCount: info.ordersCount,
            totalSpentAmount: info.totalSpent,
            status: tierStatus,
          };
        });

        setCustomers(parsedCustomers);
      } catch (err: any) {
        setError(err.message || 'An unknown network synchronization error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersFromOrders();
  }, [BASE_URL]);

  // Handle local query filter matching
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center text-gray-600 font-medium">Loading customer database ledger...</div>;
  if (error) return <div className="p-6 text-center text-red-500 font-medium">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer relationships and transaction insights</p>
      </div>

      {/* Search Bar filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by customer name, credentials, or location addresses..."
            className="pl-10 bg-gray-100 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Live Synchronized Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Contact Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Fulfillment Target</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Orders</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total Capital Spent</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Customer Value Status</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[180px]">{customer.location}</td>
                    <td className="px-6 py-4 text-gray-900 font-mono">{customer.ordersCount}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {customer.totalSpentAmount.toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit uppercase ${
                        customer.status === 'VIP' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        customer.status === 'Regular' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {customer.status === 'VIP' && <Crown className="w-3.5 h-3.5" />}
                        {customer.status === 'New' && <Sparkles className="w-3.5 h-3.5" />}
                        {customer.status === 'Regular' && <User className="w-3.5 h-3.5" />}
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No customers found matching database criteria.
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