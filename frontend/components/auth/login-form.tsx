'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { clientLogin, apiRequest } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

/**
 * Interface matching backend user-owned shop response
 */
interface Shop {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  [key: string]: unknown;
}

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

 async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setLoadingStatus('Authenticating account...');

    try {
      // 1. Authenticate user credentials via client API proxy
      await clientLogin(values.emailOrPhone, values.password);

      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', values.emailOrPhone);
      }

      // 2. Check existing store for the authenticated user using /shops/details/
      setLoadingStatus('Checking existing stores...');

      // Authenticated request to /shops/details/ (tied to the logged-in user profile)
      const res = await apiRequest<Shop | Shop[]>('/shops/details/', { auth: true });
      console.log(res);

      // 3. Evaluate whether a shop exists based on the returned response
      // If the response is an empty array or falsy, redirect to the store creation flow
      const hasNoShop = Array.isArray(res) && res.length === 0;

      if (hasNoShop || !res) {
        router.push('/create/store');
        return;
      }

      // 4. Default redirect to dashboard if the shop exists successfully
      setLoadingStatus('Redirecting to dashboard...');
      router.push('/dashboard');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setError('password', { message: message.slice(0, 180) });
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Login to your account
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Login to access your store portal
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email or Phone"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-100 border-0 placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      disabled={isLoading}
                      className="bg-gray-100 border-0 placeholder:text-gray-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base font-medium cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{loadingStatus || 'Logging in...'}</span>
              </div>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </Form>

      {/* Sign Up Section */}
      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}