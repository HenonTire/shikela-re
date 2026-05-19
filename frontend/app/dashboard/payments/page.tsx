'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { storage } from '@/lib/storage';

interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'pending' | 'disconnected';
  lastTransaction?: string;
  commission: number;
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Telebirr',
    provider: 'Ethiopian Telecom',
    status: 'connected',
    lastTransaction: '2 hours ago',
    commission: 2.5,
  },
  {
    id: '2',
    name: 'CBE Birr',
    provider: 'Commercial Bank of Ethiopia',
    status: 'connected',
    lastTransaction: '1 day ago',
    commission: 1.5,
  },
  {
    id: '3',
    name: 'HelloCash',
    provider: 'Digital Wallet',
    status: 'disconnected',
    commission: 2,
  },
];

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const stored = storage.getAll<PaymentMethod>('paymentMethods');
    return stored.length > 0 ? stored : defaultPaymentMethods;
  });

  useEffect(() => {
    storage.clear('paymentMethods');
    paymentMethods.forEach(method => storage.create('paymentMethods', method));
  }, [paymentMethods]);

  const [payoutSettings, setPayoutSettings] = useState({
    frequency: 'weekly',
    minimumBalance: '1000',
    bankAccount: '****3456',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'disconnected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const totalRevenue = 24000;
  const thisMonthRevenue = 4000;
  const availablePayout = 3800;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Manage payment methods and track transaction history
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalRevenue.toLocaleString()} ETB
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {thisMonthRevenue.toLocaleString()} ETB
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Payout</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {availablePayout.toLocaleString()} ETB
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-auto">
              Withdraw
            </Button>
          </div>
        </Card>
      </div>

      {/* Payment Methods */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Connected Payment Methods
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {method.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                        method.status
                      )}`}
                    >
                      {method.status === 'connected' && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                      {method.status === 'pending' && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {method.status === 'disconnected' && (
                        <span className="flex items-center gap-1">
                          Disconnected
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{method.provider}</p>
                  {method.lastTransaction && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last transaction: {method.lastTransaction}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-3">Commission</p>
                  <p className="font-semibold text-gray-900 mb-4">
                    {method.commission}%
                  </p>
                  {method.status === 'connected' ? (
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payout Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payout Settings
        </h2>
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payout Frequency
            </label>
            <select
              value={payoutSettings.frequency}
              onChange={(e) =>
                setPayoutSettings({
                  ...payoutSettings,
                  frequency: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Balance for Payout (ETB)
            </label>
            <Input
              type="number"
              value={payoutSettings.minimumBalance}
              onChange={(e) =>
                setPayoutSettings({
                  ...payoutSettings,
                  minimumBalance: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account
            </label>
            <div className="flex gap-3">
              <Input
                value={payoutSettings.bankAccount}
                disabled
                className="bg-gray-50"
              />
              <Button variant="outline">Change</Button>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 w-full">
            Save Changes
          </Button>
        </Card>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Transactions
        </h2>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Today</td>
                <td className="px-6 py-4 text-sm text-gray-900">Telebirr</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  1,200 ETB
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">30 ETB</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Yesterday</td>
                <td className="px-6 py-4 text-sm text-gray-900">CBE Birr</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  800 ETB
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">12 ETB</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">2 days ago</td>
                <td className="px-6 py-4 text-sm text-gray-900">Telebirr</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  2,000 ETB
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">50 ETB</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
