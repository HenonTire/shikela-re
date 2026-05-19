import { AuthLayout } from '@/components/auth/auth-layout';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Create Account - Shikela',
  description: 'Create a new Shikela store owner account',
};

export default function RegisterEmailPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
