import { AuthLayout } from '@/components/auth/auth-layout';
import { AccountForm } from '@/components/auth/account-form';

export const metadata = {
  title: 'Account Details - Shikela',
  description: 'Enter your account details',
};

export default function AccountFormPage() {
  return (
    <AuthLayout>
      <AccountForm />
    </AuthLayout>
  );
}
