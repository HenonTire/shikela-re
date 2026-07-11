'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clientLogin, detectUserRole } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      // Connect to Next.js API endpoint proxy route for secure token/cookie lifecycle forwarding
      await clientLogin(values.emailOrPhone, values.password);
      const role = await detectUserRole();
      
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', values.emailOrPhone);

      if (role === 'supplier') {
        router.push('/supplier/dashboard');
      } else if (role === 'courier') {
        router.push('/courier/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setError('password', { message: message.slice(0, 180) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Login to your account
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Login to access your shikela account
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
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-100 border-0 placeholder:text-gray-500"
                  />
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
            {isLoading ? 'Logging in...' : 'Continue with email'}
          </Button>
        </form>
      </Form>
    </div>
  );
}