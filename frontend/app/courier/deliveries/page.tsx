/**
 * @file app/courier/deliveries/page.tsx
 * @description Courier delivery management page
 * 
 * Features:
 * - View all assigned deliveries
 * - Update delivery status
 * - Track delivery location
 * - Add delivery notes
 * - Upload proof of delivery
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Phone, Clock, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { Delivery } from '@/lib/types';
import { storage } from '@/lib/storage';

/**
 * CourierDeliveries Component
 * Manages courier's assigned deliveries
 * 
 * Statuses:
 * - Pending: Waiting to be picked up
 * - Assigned: Assigned to this courier
 * - PickedUp: Item picked from store
 * - InTransit: On the way to customer
 * - Delivered: Successfully delivered
 * - Failed: Delivery failed
 * - Cancelled: Delivery cancelled
 */
export default function CourierDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  useEffect(() => {
    const courierId = localStorage.getItem('courierId');
    if (courierId) {
      const allDeliveries = storage.getAll<Delivery>('deliveries');
      const courierDeliveries = allDeliveries.filter(d => d.courierId === courierId);
      setDeliveries(courierDeliveries);
    }
  }, []);

  const activeDeliveries = deliveries.filter(
    d => !['Delivered', 'Failed', 'Cancelled'].includes(d.status)
  );

  const completedDeliveries = deliveries.filter(
    d => ['Delivered', 'Failed', 'Cancelled'].includes(d.status)
  );

  const filteredDeliveries = (
    activeTab === 'active' ? activeDeliveries : completedDeliveries
  ).filter(d =>
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (deliveryId: string, newStatus: string) => {
    const updated = deliveries.map(d =>
      d.id === deliveryId
        ? { ...d, status: newStatus as any, completedAt: newStatus === 'Delivered' ? new Date().toISOString() : d.completedAt }
        : d
    );
    setDeliveries(updated);
    storage.updateMany('deliveries', updated);
    setShowStatusUpdate(false);
  };

  const statusColors = {
    'Pending': 'bg-gray-100 text-gray-700',
    'Assigned': 'bg-blue-100 text-blue-700',
    'PickedUp': 'bg-yellow-100 text-yellow-700',
    'InTransit': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Failed': 'bg-red-100 text-red-700',
    'Cancelled': 'bg-gray-100 text-gray-600',
  };

  const statusNexts: Record<string, string[]> = {
    'Assigned': ['PickedUp'],
    'PickedUp': ['InTransit'],
    'InTransit': ['Delivered', 'Failed'],
    'Pending': ['Assigned'],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
        <p className="text-gray-600 mt-2">Manage your assigned deliveries</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by customer or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeDeliveries.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedDeliveries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredDeliveries.length > 0 ? (
            filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  {/* Delivery Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{delivery.customerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[delivery.status as keyof typeof statusColors]}`}>
                        {delivery.status === 'InTransit' ? 'In Transit' : delivery.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {delivery.deliveryAddress}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        {delivery.customerPhone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        {new Date(delivery.assignedAt).toLocaleString()}
                      </p>
                    </div>

                    {delivery.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Notes:</strong> {delivery.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-4">{delivery.deliveryFee} ETB</div>
                    <div className="space-y-2">
                      {statusNexts[delivery.status as keyof typeof statusNexts]?.map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          size="sm"
                          className={`w-full ${
                            nextStatus === 'Delivered'
                              ? 'bg-green-600 hover:bg-green-700'
                              : nextStatus === 'Failed'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => handleStatusUpdate(delivery.id, nextStatus)}
                        >
                          {nextStatus === 'InTransit' ? 'Start Delivery' : `Mark as ${nextStatus}`}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        <Camera className="w-4 h-4" />
                        Add Proof
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No {activeTab} deliveries</p>
              <p className="text-sm text-gray-500 mt-2">
                {activeTab === 'active' ? 'Accept a delivery to get started' : 'Completed deliveries will appear here'}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
