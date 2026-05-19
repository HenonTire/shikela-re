'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthLayout } from '@/components/auth/auth-layout';
import { registerCourier } from '@/lib/api-client';

interface CourierFormValues {
  fullName: string;
  email: string;
  phone: string;
  vehicleType: 'Motorcycle' | 'Car' | 'Truck';
  vehicleNumber: string;
  idDocumentUrl: string;
}

/**
 * CourierRegistrationPage
 * Handles courier account creation with vehicle and service area information
 * Creates new courier entry in localStorage and redirects to courier dashboard
 * 
 * Form Fields:
 * - Full name, email, phone
 * - Vehicle type (Motorcycle, Car, Truck)
 * - Vehicle registration number
 * - Service areas (cities/regions)
 * - ID document upload
 * 
 * Data Flow:
 * 1. User fills form with courier details
 * 2. Validation checks required fields
 * 3. Creates courier record in localStorage['couriers']
 * 4. Sets session variables (userRole, courierId, userEmail)
 * 5. Redirects to /courier/dashboard
 */
export default function CourierRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [formData, setFormData] = useState<CourierFormValues>({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: 'Motorcycle',
    vehicleNumber: '',
    idDocumentUrl: '',
  });

  const serviceAreas = [
    'Addis Ababa (Central)',
    'Addis Ababa (East)',
    'Addis Ababa (West)',
    'Addis Ababa (North)',
    'Addis Ababa (South)',
    'Dire Dawa',
    'Adama',
    'Hawassa',
    'Mekelle',
    'Bahir Dar',
    'Kombolcha',
    'Jijiga',
    'Harar',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert('Please fill all required fields');
        setIsLoading(false);
        return;
      }

      if (selectedAreas.length === 0) {
        alert('Please select at least one service area');
        setIsLoading(false);
        return;
      }

      await registerCourier({
        company_name: formData.fullName,
        email: formData.email,
        password: formData.vehicleNumber || 'Courier123!',
        phone_number: formData.phone,
        location: selectedAreas.join(', '),
        is_available: true,
      });

      // Save user session
      localStorage.setItem('userRole', 'courier');
      localStorage.setItem('userEmail', formData.email);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to courier dashboard
      window.location.href = '/courier/dashboard';
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Join as Courier</h1>
          <p className="text-gray-600">Complete your courier profile to start accepting deliveries</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <Input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <Input
              type="tel"
              name="phone"
              placeholder="+251 9XX XXX XXX"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value: any) =>
                setFormData(prev => ({ ...prev, vehicleType: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration Number *</label>
            <Input
              type="text"
              name="vehicleNumber"
              placeholder="e.g., AA-1234-23"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* ID Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Document URL *</label>
            <Input
              type="url"
              name="idDocumentUrl"
              placeholder="https://example.com/id.jpg"
              value={formData.idDocumentUrl}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Service Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas *</label>
            <p className="text-xs text-gray-500 mb-3">Select cities/regions where you can deliver</p>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {serviceAreas.map((area) => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(area)}
                    onChange={() => handleAreaToggle(area)}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Creating Account...' : 'Create Courier Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
