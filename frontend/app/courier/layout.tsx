/**
 * @file app/courier/layout.tsx
 * @description Courier dashboard layout - wraps all courier pages with sidebar and header
 * 
 * This layout provides:
 * - Courier sidebar navigation
 * - Courier header with user info
 * - Protected route structure
 * - Role-based access control
 */

'use client';

import { ReactNode } from 'react';
import { CourierHeader } from '@/components/courier/header';
import { CourierSidebar } from '@/components/courier/sidebar';

interface CourierLayoutProps {
  children: ReactNode;
}

/**
 * Courier Layout Component
 * Main layout wrapper for all courier dashboard pages
 * Combines sidebar navigation and header for consistent UX
 * 
 * @param {ReactNode} children - Page content to render
 * @returns {JSX.Element} Layout structure with sidebar and content
 */
export default function CourierLayout({ children }: CourierLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Courier Sidebar */}
      <CourierSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Courier Header */}
        <CourierHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
