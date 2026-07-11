'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  MapPin,
  Phone,
  RefreshCw,
} from 'lucide-react';

type ShipmentStatus =
  | 'PENDING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

interface Shipment {
  id: string;

  tracking_number: string;

  status: ShipmentStatus;

  payload?: {
    note?: string;
  };

  created_at: string;
  updated_at: string;

  order: {
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    total_price?: number;
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const statusOptions: ShipmentStatus[] = [
  'PENDING',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
];

const statusStyles: Record<ShipmentStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  PICKED_UP: 'bg-blue-100 text-blue-700',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function CourierPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<string, ShipmentStatus>
  >({});

  const courierClient = axios.create({
    baseURL: API_URL,
  });

  courierClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  const fetchShipments = async () => {
    try {
      setLoading(true);

      const response = await courierClient.get(
        '/courier/shipments/'
      );

      const data = response.data;

      setShipments(data);

      const initialStatuses: Record<
        string,
        ShipmentStatus
      > = {};

      data.forEach((shipment: Shipment) => {
        initialStatuses[shipment.id] = shipment.status;
      });

      setSelectedStatuses(initialStatuses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const updateShipmentStatus = async (
    shipmentId: string
  ) => {
    try {
      setUpdatingId(shipmentId);

      await courierClient.post(
        `/courier/shipments/${shipmentId}/status/`,
        {
          status: selectedStatuses[shipmentId],
          payload: {
            note: 'Updated from courier dashboard',
          },
        }
      );

      await fetchShipments();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const query = search.toLowerCase();

      return (
        shipment.order.customer_name
          .toLowerCase()
          .includes(query) ||
        shipment.order.order_number
          .toLowerCase()
          .includes(query) ||
        shipment.tracking_number
          .toLowerCase()
          .includes(query)
      );
    });
  }, [shipments, search]);

  const stats = useMemo(() => {
    return {
      total: shipments.length,

      pending: shipments.filter(
        (s) => s.status === 'PENDING'
      ).length,

      transit: shipments.filter(
        (s) =>
          s.status === 'IN_TRANSIT' ||
          s.status === 'OUT_FOR_DELIVERY'
      ).length,

      delivered: shipments.filter(
        (s) => s.status === 'DELIVERED'
      ).length,
    };
  }, [shipments]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Courier Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Manage assigned shipments and delivery statuses
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Shipments
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {stats.total}
              </h2>
            </div>

            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {stats.pending}
              </h2>
            </div>

            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                In Transit
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {stats.transit}
              </h2>
            </div>

            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Delivered
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {stats.delivered}
              </h2>
            </div>

            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* SEARCH */}
      <Card className="p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, order number, or tracking number"
            className="pl-10"
          />
        </div>
      </Card>

      {/* SHIPMENTS */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 text-center text-gray-500">
            Loading shipments...
          </Card>
        ) : filteredShipments.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No shipments found.
          </Card>
        ) : (
          filteredShipments.map((shipment) => (
            <Card
              key={shipment.id}
              className="p-6 space-y-5"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />

                    <h2 className="font-bold text-lg text-gray-900">
                      #{shipment.order.order_number}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Tracking: {shipment.tracking_number}
                  </p>
                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${statusStyles[shipment.status]}
                  `}
                >
                  {shipment.status.replaceAll('_', ' ')}
                </span>
              </div>

              {/* CONTENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-medium text-gray-900">
                      {shipment.order.customer_name}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-500 mt-1" />

                    <p className="text-sm text-gray-700">
                      {shipment.order.customer_phone}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {shipment.order.delivery_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />

                  <select
                    value={
                      selectedStatuses[shipment.id] ||
                      shipment.status
                    }
                    onChange={(e) =>
                      setSelectedStatuses({
                        ...selectedStatuses,
                        [shipment.id]:
                          e.target.value as ShipmentStatus,
                      })
                    }
                    className="
                      border
                      border-gray-300
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() =>
                    updateShipmentStatus(shipment.id)
                  }
                  disabled={updatingId === shipment.id}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updatingId === shipment.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
