'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { clientRegisterShopOwner } from '@/lib/api-client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const accountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and privacy policy',
  }),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export function AccountForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('registerEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      agree: false,
    },
  });

  async function onSubmit(values: AccountFormValues) {
    setIsLoading(true);
    try {
      await clientRegisterShopOwner({
        first_name: values.firstName,
        last_name: values.lastName,
        email,
        password: values.password,
        phone_number: values.phone,
      });

      localStorage.setItem(
        'registerData',
        JSON.stringify({
          email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        })
      );
      router.push('/register/verify');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      form.setError('phone', { message: message.slice(0, 180) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create a new account
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Create an account to start using shikela
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First Name" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last Name" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
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
                <FormControl>
                  <Input placeholder="Phone Number" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
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
                  <Input type="password" placeholder="Password" {...field} disabled={isLoading} className="bg-gray-100 border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <p className="text-sm text-gray-600">By continuing, you agree to the Terms and Privacy Policy.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-5">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </div>
  );
}