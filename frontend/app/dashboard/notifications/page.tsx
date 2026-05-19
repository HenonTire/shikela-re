'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, ShoppingCart, AlertCircle } from 'lucide-react';

const notificationSettings = [
  {
    id: 'orders',
    title: 'Order Notifications',
    description: 'Get notified when you receive new orders',
    icon: ShoppingCart,
    subcategories: [
      { id: 'new-orders', label: 'New orders', email: true, push: true },
      { id: 'order-shipped', label: 'Order shipped', email: true, push: true },
      { id: 'order-cancelled', label: 'Order cancelled', email: true, push: false },
    ]
  },
  {
    id: 'messages',
    title: 'Message Notifications',
    description: 'Get notified about customer messages',
    icon: Mail,
    subcategories: [
      { id: 'customer-inquiry', label: 'Customer inquiry', email: true, push: true },
      { id: 'review-received', label: 'Review received', email: true, push: false },
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Alerts',
    description: 'Get alerted about low stock items',
    icon: AlertCircle,
    subcategories: [
      { id: 'low-stock', label: 'Low stock alert', email: true, push: true },
      { id: 'out-of-stock', label: 'Out of stock', email: true, push: true },
    ]
  },
  {
    id: 'system',
    title: 'System Notifications',
    description: 'Important updates about your store',
    icon: Bell,
    subcategories: [
      { id: 'security', label: 'Security alerts', email: true, push: true },
      { id: 'maintenance', label: 'Maintenance updates', email: true, push: false },
    ]
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(notificationSettings);

  const toggleNotification = (parentId: string, subId: string, type: 'email' | 'push') => {
    setSettings(prev => prev.map(parent => {
      if (parent.id === parentId) {
        return {
          ...parent,
          subcategories: parent.subcategories.map(sub => {
            if (sub.id === subId) {
              return { ...sub, [type]: !sub[type] };
            }
            return sub;
          })
        };
      }
      return parent;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Manage how you receive notifications from Shikela</p>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-6">
        {settings.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{sub.label}</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Switch
                          checked={sub.email}
                          onCheckedChange={() => toggleNotification(category.id, sub.id, 'email')}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <Switch
                          checked={sub.push}
                          onCheckedChange={() => toggleNotification(category.id, sub.id, 'push')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
        <Button variant="outline">
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
