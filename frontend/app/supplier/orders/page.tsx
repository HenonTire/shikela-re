'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { storage } from '@/lib/storage';
import { SupplierOrder } from '@/lib/types';

export default function SupplierOrdersPage() {
  const [supplierId] = useState(() => localStorage.getItem('supplierId') || '');
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const supplierOrders = storage.getAll<SupplierOrder>('supplierOrders').filter(
      (order) => order.supplierId === supplierId
    );
    setOrders(supplierOrders);
  }, [supplierId]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status: newStatus as any };
      storage.update('supplierOrders', updatedOrder);
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    }
  };

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'New').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    completed: orders.filter(o => o.status === 'Shipped').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders from Store Owners</h1>
        <p className="text-gray-600 mt-1">Review and manage incoming orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6 bg-blue-50">
          <p className="text-gray-600 text-sm">New Orders</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.new}</p>
        </Card>
        <Card className="p-6 bg-amber-50">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.processing}</p>
        </Card>
        <Card className="p-6 bg-green-50">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </Card>
      </div>

      {/* Search and Filter */}
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
        <div className="flex gap-2">
          {['all', 'New', 'Accepted', 'Processing', 'Shipped'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-blue-600' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Items
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-900">{order.items}</td>
                  <td className="px-6 py-4 text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'New' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(order.id, 'Accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {order.status === 'Accepted' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusChange(order.id, 'Processing')}
                      >
                        Process
                      </Button>
                    )}
                    {order.status === 'Processing' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(order.id, 'Shipped')}
                      >
                        Mark Shipped
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
