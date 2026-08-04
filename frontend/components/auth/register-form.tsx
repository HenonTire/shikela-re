'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
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

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and privacy policy',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      agree: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setFormError(null);

    try {
      await clientRegisterShopOwner({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        phone_number: values.phone,
        role: "SHOP_OWNER",
      });

      // 1. Set the specific email key so VerificationPage can read standard email string directly
      localStorage.setItem('registerEmail', values.email);

      // 2. (Optional) Store full metadata if needed elsewhere in the setup flow
      localStorage.setItem(
        'registerData',
        JSON.stringify({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        })
      );

      // Redirect to verification screen after registration
      router.push('/register/verify');
    } catch (error: any) {
      const rawMessage = error?.message || '';

      // Check if backend returned JSON string error object
      try {
        const parsedError = JSON.parse(rawMessage);
        
        // Handle field-specific backend errors (e.g. email already exists)
        if (parsedError.email) {
          const emailMsg = Array.isArray(parsedError.email) ? parsedError.email[0] : parsedError.email;
          if (emailMsg.toLowerCase().includes('already exists') || emailMsg.toLowerCase().includes('already registered')) {
            form.setError('email', { message: 'A user with this email is already registered.' });
          } else {
            form.setError('email', { message: emailMsg });
          }
        }
        if (parsedError.phone_number) {
          const phoneMsg = Array.isArray(parsedError.phone_number) ? parsedError.phone_number[0] : parsedError.phone_number;
          form.setError('phone', { message: phoneMsg });
        }
        if (parsedError.password) {
          const passMsg = Array.isArray(parsedError.password) ? parsedError.password[0] : parsedError.password;
          form.setError('password', { message: passMsg });
        }
        if (parsedError.detail) {
          setFormError(parsedError.detail);
        }
      } catch {
        // Fallback for string-based errors
        const lowerMsg = rawMessage.toLowerCase();
        if (lowerMsg.includes('already exists') || lowerMsg.includes('already registered')) {
          form.setError('email', { message: 'A user with this email is already registered.' });
          setFormError('An account with this email already exists. Please try logging in.');
        } else {
          setFormError(rawMessage || 'Registration failed. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 px-2 md:px-0">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-100 border-0 placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      {...field}
                      disabled={isLoading}
                      className="bg-gray-100 border-0 placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phone Number"
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...field}
                      disabled={isLoading}
                      className="bg-gray-100 border-0 placeholder:text-gray-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <p className="text-sm text-gray-600">
                    By continuing, you agree to the Terms and Privacy Policy.
                  </p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* General API error message display at the bottom */}
          {formError && (
            <div className="p-3 text-sm rounded bg-red-50 text-red-600 border border-red-200 text-center font-medium">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-5 text-base font-medium"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </div>
  );
}