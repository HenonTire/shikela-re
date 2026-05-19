'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createShop } from '@/lib/api-client';

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
  const [dragActive, setDragActive] = useState(false);

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
    const registerData = JSON.parse(registerDataRaw || '{}') as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };

    const storePayload = {
      ...registerData,
      storeName: values.storeName,
      businessType: values.businessType,
      logo: logoPreview,
    };

    localStorage.setItem(
      'storeData',
      JSON.stringify(storePayload)
    );
    localStorage.setItem('storeName', values.storeName);
    if (registerData.firstName) localStorage.setItem('firstName', registerData.firstName);
    if (registerData.lastName) localStorage.setItem('lastName', registerData.lastName);

    try {
      await createShop({
        name: values.storeName,
        description: `Business type: ${values.businessType}`,
      });
    } catch {
      // User may not be logged in yet (email verification flow). Preserve local flow.
    }

    // Clear temporary data
    localStorage.removeItem('registerEmail');
    localStorage.removeItem('registerData');

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push('/dashboard');
    setIsLoading(false);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }

  function handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create a new store
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Store Name */}
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Store Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your store name"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-100 border-0 placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Type */}
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Business Type
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white border border-gray-300 text-gray-700">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Store Logo Upload */}
          <FormField
            control={form.control}
            name="logo"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Store Logo (optional)
                </FormLabel>
                <FormControl>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {logoPreview ? (
                        <div className="space-y-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-20 h-20 mx-auto object-cover rounded"
                          />
                          <p className="text-sm text-gray-600">
                            Click or drag to replace
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="font-medium text-gray-700">
                            Upload your store logo
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG or SVG recommended
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium"
          >
            {isLoading ? 'Creating store...' : 'Create Store'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
