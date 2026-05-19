/**
 * @file app/courier/profile/page.tsx
 * @description Courier profile and public profile information
 * 
 * Displays:
 * - Courier personal information
 * - Vehicle details
 * - Service areas
 * - Performance ratings and reviews
 * - Document verification status
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Truck, FileCheck, AlertCircle, BarChart3 } from 'lucide-react';
import { Courier } from '@/lib/types';
import { storage } from '@/lib/storage';

/**
 * CourierProfile Component
 * Displays courier's profile information, ratings, and performance
 */
export default function CourierProfile() {
  const [courier, setCourier] = useState<Courier | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      const couriers = storage.getAll<Courier>('couriers');
      const current = couriers.find(c => c.id === courierId);
      setCourier(current || null);
    }
  }, []);

  const handleStatusToggle = () => {
    if (courier) {
      const updated = { ...courier, isActive: !courier.isActive };
      setCourier(updated);
      const couriers = storage.getAll<Courier>('couriers');
      const updatedList = couriers.map(c => c.id === courier.id ? updated : c);
      storage.updateMany('couriers', updatedList);
    }
  };

  if (!courier) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your courier profile</p>
        </div>
        <Button onClick={handleStatusToggle} className={courier.isActive ? 'bg-green-600' : 'bg-gray-400'}>
          {courier.isActive ? '✓ Available' : 'Offline'}
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-3 gap-6">
        {/* Personal Info Card */}
        <Card className="p-6 col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-900">{courier.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{courier.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{courier.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-900">
                {new Date(courier.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Rating Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating</h2>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.floor(courier.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-3xl font-bold text-gray-900">{courier.rating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">({courier.totalDeliveries} deliveries)</p>
          </div>
        </Card>
      </div>

      {/* Vehicle & Service */}
      <div className="grid grid-cols-2 gap-6">
        {/* Vehicle Info */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Truck className="w-6 h-6 text-blue-600 mt-1" />
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Information</h2>
          </div>
          <div className="space-y-4 ml-9">
            <div>
              <p className="text-sm text-gray-600">Vehicle Type</p>
              <p className="font-semibold text-gray-900">{courier.vehicleType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Number</p>
              <p className="font-semibold text-gray-900">{courier.vehicleNumber}</p>
            </div>
          </div>
        </Card>

        {/* Service Areas */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-6 h-6 text-green-600 mt-1" />
            <h2 className="text-xl font-semibold text-gray-900">Service Areas</h2>
          </div>
          <div className="space-y-2 ml-9">
            {courier.serviceAreas.map((area) => (
              <div key={area} className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                {area}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 ml-9">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Deliveries</p>
            <p className="text-2xl font-bold text-blue-600">{courier.totalDeliveries}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-green-600">{courier.successRate}%</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Status</p>
            <p className="text-2xl font-bold text-yellow-600">{courier.isActive ? 'Available' : 'Offline'}</p>
          </div>
        </div>
      </Card>

      {/* Document Verification */}
      <Card className="p-6 border-l-4 border-yellow-400 bg-yellow-50">
        <div className="flex items-start gap-3">
          <FileCheck className="w-6 h-6 text-yellow-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Document Verification</h3>
            <p className="text-sm text-gray-700 mt-1">ID Document: Pending Review</p>
            <p className="text-xs text-gray-600 mt-2">Your identity document is under review. This typically takes 24-48 hours.</p>
            <Button variant="outline" size="sm" className="mt-3">
              View Document
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Profile Button */}
      <div className="flex gap-4">
        <Button onClick={() => setIsEditing(!isEditing)} className="px-6">
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(false)} className="px-6">
          Cancel
        </Button>
      </div>
    </div>
  );
}
