'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage } from '@/lib/storage';
import { Supplier } from '@/lib/types';

export default function SupplierSettingsPage() {
  const [supplierId] = useState(() => localStorage.getItem('supplierId') || '');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const suppliers = storage.getAll<Supplier>('suppliers');
    const currentSupplier = suppliers.find(s => s.id === supplierId);
    if (currentSupplier) {
      setSupplier(currentSupplier);
      setFormData({
        businessName: currentSupplier.businessName,
        email: currentSupplier.email,
        phone: currentSupplier.phone,
        address: currentSupplier.address,
      });
    }
  }, [supplierId]);

  const handleSave = () => {
    if (supplier) {
      const updated = { ...supplier, ...formData };
      storage.update('suppliers', updated);
      setSupplier(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your supplier account and preferences</p>
      </div>

      {supplier && (
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Business Info Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-medium text-gray-900">{supplier.businessName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{supplier.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{supplier.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{supplier.address}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <div className="flex gap-2 mt-2">
                      {supplier.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Categories
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Manage the product categories you supply
              </p>

              <div className="space-y-3">
                {supplier.categories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">{cat}</span>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Category
                </label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Bags, Shoes, Accessories" />
                  <Button className="bg-blue-600 hover:bg-blue-700">Add</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Banking & Payout Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Name
                  </label>
                  <Input placeholder="Your full name or business name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <Input placeholder="e.g., Addis Bank, Commercial Bank of Ethiopia" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <Input placeholder="Your bank account number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing/Swift Code
                  </label>
                  <Input placeholder="SWIFT/Routing code" />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Earnings will be transferred to this account on the last day of each month.
                  </p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Banking Details
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New Orders</p>
                    <p className="text-sm text-gray-600">Get notified when orders arrive</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order Status Updates</p>
                    <p className="text-sm text-gray-600">Receive updates on order processing</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Payment Updates</p>
                    <p className="text-sm text-gray-600">Get payment confirmation notifications</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
              </div>

              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Save Preferences
              </Button>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Password
                  </label>
                  <Input type="password" placeholder="Current password" className="mb-2" />
                  <Input type="password" placeholder="New password" className="mb-2" />
                  <Input type="password" placeholder="Confirm password" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Password
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                Deactivating your account will suspend your supplier profile.
              </p>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Deactivate Account
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
