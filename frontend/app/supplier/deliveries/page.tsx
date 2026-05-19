'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Truck, MapPin, Calendar } from 'lucide-react';
import { storage } from '@/lib/storage';
import { SupplierOrder } from '@/lib/types';

export default function SupplierDeliveriesPage() {
  const [supplierId] = useState(() => localStorage.getItem('supplierId') || '');
  const [shipments, setShipments] = useState<SupplierOrder[]>([]);

  useEffect(() => {
    const shippedOrders = storage.getAll<SupplierOrder>('supplierOrders').filter(
      (order) => order.supplierId === supplierId && order.status === 'Shipped'
    );
    setShipments(shippedOrders);
  }, [supplierId]);

  const stats = {
    inTransit: shipments.filter(s => s.status === 'Shipped').length,
    delivered: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
        <p className="text-gray-600 mt-1">Track outgoing shipments and deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Transit</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inTransit}</p>
            </div>
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</p>
            </div>
            <Truck className="w-5 h-5 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Shipments */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Shipments</h2>

          {shipments.length > 0 ? (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{shipment.id}</p>
                      <p className="text-sm text-gray-600 mt-1">{shipment.items}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      In Transit
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="w-4 h-4" />
                      <span>Standard Delivery</span>
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      {shipment.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No active shipments</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
