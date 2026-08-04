import AuthLayout from '@/components/auth/auth-layout'; // Updated to default import (adjust if your layout uses named export)
import {StoreForm} from '@/components/auth/store-form';

export const metadata = {
  title: 'Create Store - Shikela',
  description: 'Create your store on Shikela',
};

export default function StoreCreationPage() {
  return (
    <AuthLayout>
      <StoreForm />
    </AuthLayout>
  );
}