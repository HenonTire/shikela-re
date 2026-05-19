'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, MapPin, Truck } from 'lucide-react';
import { storage } from '@/lib/storage';

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  rate: number;
  estimatedDays: number;
  active: boolean;
}

const defaultZones: ShippingZone[] = [
  {
    id: '1',
    name: 'Addis Ababa',
    regions: ['Addis Ababa'],
    rate: 50,
    estimatedDays: 1,
    active: true,
  },
  {
    id: '2',
    name: 'Regional Areas',
    regions: ['Dire Dawa', 'Adama', 'Hawassa'],
    rate: 100,
    estimatedDays: 3,
    active: true,
  },
];

export default function ShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>(() => {
    const stored = storage.getAll<ShippingZone>('shippingZones');
    return stored.length > 0 ? stored : defaultZones;
  });

  useEffect(() => {
    storage.clear('shippingZones');
    zones.forEach(zone => storage.create('shippingZones', zone));
  }, [zones]);

  const [showAddZone, setShowAddZone] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    regions: '',
    rate: '',
    estimatedDays: '',
  });

  const handleAddZone = () => {
    if (newZone.name && newZone.rate && newZone.estimatedDays) {
      const zone: ShippingZone = {
        id: Date.now().toString(),
        name: newZone.name,
        regions: newZone.regions.split(',').map((r) => r.trim()),
        rate: parseFloat(newZone.rate),
        estimatedDays: parseInt(newZone.estimatedDays),
        active: true,
      };
      setZones([...zones, zone]);
      setNewZone({ name: '', regions: '', rate: '', estimatedDays: '' });
      setShowAddZone(false);
    }
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter((zone) => zone.id !== id));
  };

  const toggleZoneActive = (id: string) => {
    setZones(
      zones.map((zone) =>
        zone.id === id ? { ...zone, active: !zone.active } : zone
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shipping</h1>
        <p className="text-gray-600 mt-2">
          Configure shipping options and courier integrations
        </p>
      </div>

      {/* Courier Integrations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Gateway Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Telebirr</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mobile money integration
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-blue-600">
                Setup
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-2 border-green-200 bg-green-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">CBE Birr</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Commercial bank integration
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-green-600">
                Setup
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-2 border-purple-200 bg-purple-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">HelloCash</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Digital wallet integration
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-purple-600">
                Setup
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Shipping Zones */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Shipping Zones</h2>
          <Button
            onClick={() => setShowAddZone(!showAddZone)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>

        {showAddZone && (
          <Card className="p-6 mb-6 border-blue-200 bg-blue-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name
                </label>
                <Input
                  placeholder="e.g., Addis Ababa"
                  value={newZone.name}
                  onChange={(e) =>
                    setNewZone({ ...newZone, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regions (comma-separated)
                </label>
                <Input
                  placeholder="e.g., Addis Ababa, Dire Dawa"
                  value={newZone.regions}
                  onChange={(e) =>
                    setNewZone({ ...newZone, regions: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Rate (ETB)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={newZone.rate}
                    onChange={(e) =>
                      setNewZone({ ...newZone, rate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Days
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={newZone.estimatedDays}
                    onChange={(e) =>
                      setNewZone({ ...newZone, estimatedDays: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddZone}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Zone
                </Button>
                <Button
                  onClick={() => setShowAddZone(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              className={`p-6 ${
                zone.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {zone.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {zone.regions.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-sm text-gray-600">Rate</p>
                    <p className="font-semibold text-gray-900">{zone.rate} ETB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Est. Days</p>
                    <p className="font-semibold text-gray-900">
                      {zone.estimatedDays}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleZoneActive(zone.id)}
                    >
                      {zone.active ? 'Active' : 'Inactive'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteZone(zone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Package Options */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Package Handling
        </h2>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">
                Weight-based Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Calculate shipping based on package weight
              </p>
            </div>
            <Button variant="outline" className="ml-auto">
              Configure
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
