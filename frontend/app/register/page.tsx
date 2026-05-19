'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, Package, Truck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'store_owner' | 'supplier' | 'courier' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'store_owner') {
      localStorage.setItem('userRole', 'store_owner');
      router.push('/register/email');
    } else if (selectedRole === 'supplier') {
      localStorage.setItem('userRole', 'supplier');
      router.push('/register/supplier');
    } else if (selectedRole === 'courier') {
      localStorage.setItem('userRole', 'courier');
      router.push('/register/courier');
    }
  };

  const roles = [
    {
      id: 'store_owner',
      title: 'Store Owner',
      description: 'Create and manage your online store',
      icon: Store,
      color: 'border-blue-300',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'supplier',
      title: 'Supplier',
      description: 'Supply products to verified store owners',
      icon: Package,
      color: 'border-blue-300',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'courier',
      title: 'Courier',
      description: 'Handle deliveries and earn from logistics',
      icon: Truck,
      color: 'border-blue-300',
      bgColor: 'bg-blue-50',
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Welcome to Shikela
          </h1>
          <p className="text-base text-gray-600 text-center">
            Choose how you&apos;d like to use Shikela. Select your role to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isDisabled = role.disabled;

            return (
              <Card
                key={role.id}
                className={`p-6 cursor-pointer border-2 transition-all ${isSelected
                  ? `${role.color} shadow-lg`
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
                onClick={() => !isDisabled && setSelectedRole(role.id as any)}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${role.bgColor}`}
                >
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                <p className="text-sm text-gray-600 -mt-2">{role.description}</p>
                {isDisabled && (
                  <p className="text-xs text-gray-500 mt-2 font-medium">Coming Soon</p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-center w-full flex-col space-y-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="py-5 text-base cursor-pointer font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as {selectedRole === 'store_owner' ? 'a Store Owner' : selectedRole === 'supplier' ? 'a Supplier' : 'a Courier'}
          </Button>
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
