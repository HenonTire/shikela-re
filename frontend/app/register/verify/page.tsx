import { AuthLayout } from '@/components/auth/auth-layout';
import { VerificationPage } from '@/components/auth/verification-page';

export const metadata = {
  title: 'Verify Email - Shikela',
  description: 'Verify your email address',
};

export default function VerifyPage() {
  return (
    <AuthLayout showFooter={false}>
      <VerificationPage />
    </AuthLayout>
  );
}
