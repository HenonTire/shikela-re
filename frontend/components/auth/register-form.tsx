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
  FormMessage,
} from '@/components/ui/form';

const registerSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      emailOrPhone: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    localStorage.setItem('registerEmail', values.emailOrPhone);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push('/register/form');
    setIsLoading(false);
  }

  return (
    <div className="space-y-6 pt-8 px-2 md:px-0">
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
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-5 text-base font-medium"
          >
            {isLoading ? 'Continuing...' : 'Continue with Email'}
          </Button>
        </form>
      </Form>
    </div>
  );
}