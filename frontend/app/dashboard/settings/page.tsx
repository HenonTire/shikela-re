'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Save,
  Lock,
  Bell,
  FileText,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Sam's Store",
    email: 'sam@example.com',
    phone: '+251912345678',
    businessType: 'Fashion & Apparel',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    address: 'Bole, Addis Ababa',
  });

  const [accountSettings, setAccountSettings] = useState({
    firstName: 'Sam',
    lastName: 'Altman',
    email: 'sam@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    outOfStock: true,
    lowStock: true,
    reviews: true,
    marketing: false,
    updates: true,
  });

  const [policySettings, setPolicySettings] = useState({
    returnPolicy: 'Customers can return items within 14 days of purchase.',
    privacyPolicy: 'We protect your data and respect your privacy.',
    termsOfService:
      'By using our store, you agree to our terms and conditions.',
  });

  const handleSaveStore = () => {
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
    localStorage.setItem('storeName', storeSettings.storeName);
    console.log('Store settings saved:', storeSettings);
  };

  const handleSaveAccount = () => {
    if (accountSettings.newPassword === accountSettings.confirmPassword) {
      console.log('Account settings saved');
    }
  };

  const handleChangePassword = () => {
    handleSaveAccount();
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    console.log('Notification settings saved:', notificationSettings);
  };

  const handleSavePolicies = () => {
    localStorage.setItem('policySettings', JSON.stringify(policySettings));
    console.log('Policies saved:', policySettings);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your store and account settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('store')}
            className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'store'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Store Settings
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'account'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-4 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'policies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Policies
          </button>
        </div>
      </div>

      {/* Store Settings Tab */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Store Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <Input
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input value={storeSettings.email} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={storeSettings.phone}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <Input
                  value={storeSettings.businessType}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      businessType: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input value={storeSettings.country} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={storeSettings.city}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveStore}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Store Settings
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    value={accountSettings.firstName}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    value={accountSettings.lastName}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input value={accountSettings.email} disabled />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Change Password
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={accountSettings.currentPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={accountSettings.newPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={accountSettings.confirmPassword}
                    onChange={(e) =>
                      setAccountSettings({
                        ...accountSettings,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                className="bg-red-600 hover:bg-red-700 w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-600" />
              Logout
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sign out from all devices and sessions
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Email Notifications
          </h2>

          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>

          <Button
            onClick={handleSaveNotifications}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </Card>
      )}

      {/* Policies Tab */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Store Policies
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Policy
                </label>
                <textarea
                  value={policySettings.returnPolicy}
                  onChange={(e) =>
                    setPolicySettings({
                      ...policySettings,
                      returnPolicy: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Policy
                </label>
                <textarea
                  value={policySettings.privacyPolicy}
                  onChange={(e) =>
                    setPolicySettings({
                      ...policySettings,
                      privacyPolicy: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms of Service
                </label>
                <textarea
                  value={policySettings.termsOfService}
                  onChange={(e) =>
                    setPolicySettings({
                      ...policySettings,
                      termsOfService: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <Button
                onClick={handleSavePolicies}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Policies
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your store and all associated data. This action
              cannot be undone.
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Store
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
