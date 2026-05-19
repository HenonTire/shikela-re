'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crown, User, Sparkles, Search, MoreVertical } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Customer } from '@/lib/types';

const defaultCustomers: Customer[] = [
  {
    id: '1',
    name: 'Mahlet Tesfaye',
    email: 'mahlet@gmail.com',
    location: 'Bole, A.A',
    orders: 30,
    totalSpent: '1,200 ETB',
    status: 'VIP',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Dawit Salamon',
    email: 'dawit@gmail.com',
    location: '6 kilo, A.A',
    orders: 28,
    totalSpent: '800 ETB',
    status: 'Regular',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sara Bekele',
    email: 'Sara@gmail.com',
    location: 'Mezoria, A.A',
    orders: 13,
    totalSpent: '4,000 ETB',
    status: 'Regular',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Fitsum Amara',
    email: 'fitsum@gmail.com',
    location: 'Akaki Kaliti, A.A',
    orders: 20,
    totalSpent: '300 ETB',
    status: 'New',
    createdAt: new Date().toISOString(),
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const stored = storage.getAll<Customer>('customers');
    return stored.length > 0 ? stored : defaultCustomers;
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            className="pl-10 bg-gray-100 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Orders</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total Spent</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.location}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.orders}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{customer.totalSpent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 w-fit ${
                      customer.status === 'VIP' ? 'bg-gray-100 text-gray-900' :
                      customer.status === 'Regular' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {customer.status === 'VIP' ? <Crown className="w-4 h-4" /> :
                       customer.status === 'New' ? <Sparkles className="w-4 h-4" /> :
                       <User className="w-4 h-4" />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
