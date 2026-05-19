import { Metadata } from 'next';
import { Sidebar } from '@/components/supplier/sidebar';
import { Header } from '@/components/supplier/header';

export const metadata: Metadata = {
  title: 'Supplier Dashboard - Shikela',
  description: 'Manage your products and orders as a Shikela supplier',
};

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
