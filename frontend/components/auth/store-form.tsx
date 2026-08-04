'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, Upload, Loader2, Sparkles, Building2, Globe, AlertCircle, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateShopThemeSettings, apiRequest } from '@/lib/api-client';

const storeSchema = z.object({
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  businessType: z.string().min(1, 'Please select a business category'),
  description: z.string().max(300, 'Description must be 300 characters or less').optional(),
  domain: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export function StoreForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStores, setIsCheckingStores] = useState(true);
  const [showExistingStoreModal, setShowExistingStoreModal] = useState(false);
  const [existingStoreName, setExistingStoreName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: '',
      businessType: '',
      description: '',
      domain: '',
    },
  });

  // Check if the user already has a store on mount using authenticated apiRequest
  useEffect(() => {
    async function checkExistingShops() {
      try {
        const res = await apiRequest<any>('/shops/details/', {
          method: 'GET',
          auth: true,
        });

        console.log(res);

        // Determine if a shop object or a list containing a shop is returned
        let shopData = null;
        if (Array.isArray(res) && res.length > 0) {
          shopData = res[0];
        } else if (res && !Array.isArray(res)) {
          shopData = res;
        }

        if (shopData) {
          // Extract store name dynamically (fallback to default label if name key varies)
          const name = shopData.name || shopData.storeName || 'Your Store';
          setExistingStoreName(name);
          setShowExistingStoreModal(true);
          return;
        }
      } catch (err) {
        // If it throws an error or returns empty array [], we stay on this page to allow creation
        console.error('No existing shop found or error checking shops:', err);
      } finally {
        setIsCheckingStores(false);
      }
    }

    checkExistingShops();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 2MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  async function onSubmit(values: StoreFormValues) {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create shop via POST request to /shops/details/
      await apiRequest('/shops/details/', {
        method: 'POST',
        auth: true,
        body: {
          name: values.storeName,
          description: values.description || `Business Category: ${values.businessType}`,
          domain: values.domain || undefined,
        },
      });

      // 2. Upload Logo if attached
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await updateShopThemeSettings(formData);
      }

      // 3. Clear transient storage
      localStorage.removeItem('registerEmail');
      localStorage.removeItem('registerData');

      // 4. Redirect to Dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Failed to create shop:', err);
      const message = err instanceof Error ? err.message : 'Failed to set up your store. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRedirectDashboard = () => {
    router.push('/dashboard');
  };

  if (isCheckingStores) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm font-medium">Checking account status...</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal Popup: User Already Has a Store */}
      {showExistingStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Store Already Exists</h3>
            <p className="text-sm text-gray-600">
              You already have an active store named <span className="font-semibold text-gray-900">&quot;{existingStoreName}&quot;</span> registered under your account. Each account can only own one store.
            </p>
            <Button
              onClick={handleRedirectDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl h-11 transition-all cursor-pointer"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Main Store Form */}
      <div className="-mt-4 max-w-lg mx-auto bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-1">
            <Store className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create your storefront</h2>
          <p className="text-xs text-gray-500">
            Set up your digital presence and start selling globally.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Logo Upload Section */}
            <div className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-gray-700">Store Logo</FormLabel>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 overflow-hidden transition-all group shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleLogoChange}
                    disabled={isLoading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700">Upload store logo</p>
                  <p className="text-[11px] text-gray-400">PNG, JPG, WEBP (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Grid row: Store Name & Business Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700">Store Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="e.g. Acme Outfitters"
                          {...field}
                          disabled={isLoading}
                          className="pl-9 h-9 text-xs bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs bg-gray-50/50 border-gray-200 rounded-lg">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retail">Fashion & Apparel</SelectItem>
                        <SelectItem value="electronics">Electronics & Tech</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="other">Other / General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Custom Domain (Optional) */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-700">Custom Domain (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="mystore.com"
                        {...field}
                        disabled={isLoading}
                        className="pl-9 h-9 text-xs bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            {/* Store Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-700">Store Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly tell customers what your shop offers..."
                      {...field}
                      disabled={isLoading}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg resize-none h-16 text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-xs mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching Store...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Complete Store Creation</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}