'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientCreateShop } from '@/lib/api-client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const storeSchema = z.object({
  storeName: z.string().min(1, 'Store name is required').min(3, 'Store name must be at least 3 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  logo: z.instanceof(File).optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export function StoreForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: '',
      businessType: '',
    },
  });

  async function onSubmit(values: StoreFormValues) {
    setIsLoading(true);
    const registerDataRaw = localStorage.getItem('registerData');
    const registerData = JSON.parse(registerDataRaw || '{}');

    const storePayload = {
      ...registerData,
      storeName: values.storeName,
      businessType: values.businessType,
      logo: logoPreview,
    };

    localStorage.setItem('storeData', JSON.stringify(storePayload));
    localStorage.setItem('storeName', values.storeName);
    if (registerData.firstName) localStorage.setItem('firstName', registerData.firstName);
    if (registerData.lastName) localStorage.setItem('lastName', registerData.lastName);

    try {
      // Create shop with access token saved during authorization pipeline step
      await clientCreateShop({
        name: values.storeName,
        description: `Business type: ${values.businessType}`,
      });
    } catch (e) {
      console.error("Preserving local configuration flow:", e);
    }

    localStorage.removeItem('registerEmail');
    localStorage.removeItem('registerData');

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push('/dashboard');
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center"> Create a new store </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Store Name" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Business Type" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-6">
            {isLoading ? 'Creating store...' : 'Create Store'}
          </Button>
        </form>
      </Form>
    </div>
  );
}