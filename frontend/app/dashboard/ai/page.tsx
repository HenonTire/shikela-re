/**
 * @file app/dashboard/ai/page.tsx
 * @description Shikela AI Assistant page
 * 
 * Purpose:
 * - Provides an interactive AI chat interface for store owners
 * - Helps with store management questions and suggestions
 * - Persists chat history in localStorage
 * 
 * Features:
 * - Real-time chat with Shikela AI
 * - Message history persistence
 * - Quick suggestion buttons
 * - Responsive design for desktop and mobile
 * 
 * Dependencies:
 * - AIChat component: Main chat interface
 * - storage utilities: For message persistence
 */

import { AIChat } from '@/components/dashboard/ai-chat';

export const metadata = {
  title: 'Shikela AI - Get Help Managing Your Store',
  description: 'Chat with Shikela AI to get personalized guidance on products, payments, shipping, and growing your business.'
};

export default function AIPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shikela AI Assistant</h1>
        <p className="text-gray-600 mt-1">
          Get personalized help managing your store, products, orders, and growing your business
        </p>
      </div>

      {/* AI Chat Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-96">
        <AIChat />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Products Management</h3>
          <p className="text-sm text-gray-600">
            Ask about adding products, inventory management, pricing strategies, and product categories.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">Orders & Shipping</h3>
          <p className="text-sm text-gray-600">
            Get help with order management, shipping zones, delivery options, and customer fulfillment.
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-2">Growth Strategies</h3>
          <p className="text-sm text-gray-600">
            Learn how to increase sales, improve customer experience, and scale your e-commerce business.
          </p>
        </div>
      </div>
    </div>
  );
}
