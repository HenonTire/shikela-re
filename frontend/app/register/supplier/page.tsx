'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { registerSupplier } from '@/lib/api-client';

const supplierSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  businessName: z.string().min(3, 'Business name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(9, 'Phone must be at least 9 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  categories: z.string().min(1, 'Please select at least one category'),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const PRODUCT_CATEGORIES = [
  'Fashion',
  'Electronics',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Personal Care',
  'Food & Beverages',
  'Books & Media',
  'Toys & Games',
];

export default function SupplierRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      categories: '',
    },
  });

  async function onSubmit(values: SupplierFormValues) {
    setIsLoading(true);

    try {
      await registerSupplier({
        company_name: values.businessName,
        email: values.email,
        password: values.password,
        phone_number: values.phone,
        location: values.address,
      });

      // Save user session
      localStorage.setItem('userRole', 'supplier');
      localStorage.setItem('supplierEmail', values.email);

      // Redirect to supplier dashboard
      window.location.href = '/supplier/dashboard';
    } catch (error) {
      console.error('Registration error:', error);
      form.setError('email', { message: 'Supplier registration failed. Check inputs and try again.' });
      setIsLoading(false);
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Supplier Account</h1>
          <p className="text-gray-600 mt-2">
            Register your business to supply products to store owners
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+251 911 234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories Selection */}
            <FormItem>
              <FormLabel>Product Categories</FormLabel>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {PRODUCT_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedCategories.includes(category)
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-sm text-red-500 mt-2">Select at least one category</p>
              )}
            </FormItem>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || selectedCategories.length === 0}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Supplier Account'}
            </Button>
          </form>
        </Form>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </button>
        </div>
      </Card>
    </div>
  );
}
