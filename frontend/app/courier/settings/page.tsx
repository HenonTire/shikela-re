/**
 * @file app/courier/settings/page.tsx
 * @description Courier account settings and preferences
 * 
 * Features:
 * - Notification preferences
 * - Availability management
 * - Payment/payout settings
 * - Account security
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, DollarSign, LogOut, AlertCircle } from 'lucide-react';
import { Courier } from '@/lib/types';
import { storage } from '@/lib/storage';

interface NotificationSettings {
  newDeliveries: boolean;
  messages: boolean;
  payoutNotifications: boolean;
  promotions: boolean;
}

/**
 * CourierSettings Component
 * Manages courier account settings and preferences
 */
export default function CourierSettings() {
  const [courier, setCourier] = useState<Courier | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newDeliveries: true,
    messages: true,
    payoutNotifications: true,
    promotions: false,
  });
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bank: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      const couriers = storage.getAll<Courier>('couriers');
      const current = couriers.find(c => c.id === courierId);
      setCourier(current || null);

      // Load saved settings
      const settings = JSON.parse(localStorage.getItem('courierSettings') || '{}');
      if (settings.notifications) {
        setNotifications(settings.notifications);
      }
      if (settings.bankDetails) {
        setBankDetails(settings.bankDetails);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(
      'courierSettings',
      JSON.stringify({ notifications, bankDetails })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('courierId');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
      </div>

      {/* Success Message */}
      {saved && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-700 font-medium">Settings saved successfully!</p>
        </Card>
      )}

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4 ml-9">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Delivery Notifications</p>
              <p className="text-sm text-gray-600">Get notified when new deliveries are available</p>
            </div>
            <Switch
              checked={notifications.newDeliveries}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, newDeliveries: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Message Notifications</p>
              <p className="text-sm text-gray-600">Get notified when you receive messages</p>
            </div>
            <Switch
              checked={notifications.messages}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, messages: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Payout Notifications</p>
              <p className="text-sm text-gray-600">Get notified about payouts and earnings</p>
            </div>
            <Switch
              checked={notifications.payoutNotifications}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, payoutNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Promotional Offers</p>
              <p className="text-sm text-gray-600">Receive promotional and marketing emails</p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, promotions: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Payment Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payment & Payout</h2>
        </div>
        <div className="space-y-4 ml-9">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <Input
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <Input
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Bank account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <Input
              value={bankDetails.bank}
              onChange={(e) => setBankDetails(prev => ({ ...prev, bank: e.target.value }))}
              placeholder="Your bank name"
            />
          </div>

          <p className="text-xs text-gray-600 p-3 bg-blue-50 rounded">
            Your payout information is securely stored and only used for depositing your earnings.
          </p>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4 ml-9">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-900 mb-2">Change Password</p>
            <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} className="px-6 bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
        <Button variant="outline" className="px-6">
          Reset to Defaults
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-l-4 border-red-400 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Logout</h3>
            <p className="text-sm text-gray-700 mt-1">Sign out from your account on this device</p>
            <Button
              onClick={handleLogout}
              className="mt-3 bg-red-600 hover:bg-red-700 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
