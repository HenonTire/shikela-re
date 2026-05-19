/**
 * SetupProgress Component
 * 
 * Purpose: Display and track store setup onboarding tasks
 * Features:
 * - localStorage persistence for task completion status
 * - Tasks auto-complete when user visits their respective pages
 * - Expandable task details with action buttons
 * - Progress percentage calculation
 * - Links to task pages (Products, Payments, Shipping, Online Store)
 * 
 * localStorage key: 'setupTasks' - Array of SetupTask objects
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Package, Zap, Truck, Store, ArrowRight } from 'lucide-react';
import { storage } from '@/lib/storage';
import { SetupTask } from '@/lib/types';
import { DEFAULT_SETUP_TASKS } from '@/lib/constants';

export function SetupProgress() {
  const [expandedTask, setExpandedTask] = useState('products');
  const [tasks, setTasks] = useState<SetupTask[]>(() => {
    const stored = storage.getAll<SetupTask>('setupTasks');
    return stored.length > 0 ? stored : DEFAULT_SETUP_TASKS;
  });

  // Initialize localStorage with default tasks if empty
  useEffect(() => {
    if (storage.getAll<SetupTask>('setupTasks').length === 0) {
      DEFAULT_SETUP_TASKS.forEach(task => {
        storage.create('setupTasks', task);
      });
    }
  }, []);

  // Auto-complete setup tasks based on page visits
  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    
    const pageTaskMap: Record<string, string> = {
      '/dashboard/products': 'products',
      '/dashboard/payments': 'payments',
      '/dashboard/shipping': 'shipping',
      '/dashboard/online-store': 'store',
    };

    Object.entries(pageTaskMap).forEach(([path, taskId]) => {
      if (pathname.includes(path)) {
        const task = tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
          const updatedTask = { ...task, completed: true };
          storage.update('setupTasks', updatedTask);
          setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        }
      }
    });
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  /**
   * Get icon component by name
   */
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Package': <Package className="w-6 h-6 text-blue-600" />,
      'CreditCard': <Zap className="w-6 h-6 text-blue-600" />,
      'Truck': <Truck className="w-6 h-6 text-blue-600" />,
      'Store': <Store className="w-6 h-6 text-blue-600" />,
    };
    return iconMap[iconName];
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Setup Card */}
      <div className="col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-gray-400" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Finish store setup
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete these essential steps to start selling
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{progressPercent}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => {
              return (
                <div key={task.id}>
                  {expandedTask === task.id ? (
                    // Expanded View
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-200 rounded-lg p-3 mt-1">
                          {getIconComponent(task.icon)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {task.description}
                          </p>
                          <Link href={task.pageUrl}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                              Continue
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Collapsed View
                    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => setExpandedTask(task.id)}>
                      <div className="flex items-center gap-3 flex-1">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={`font-medium ${
                            task.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <Link href={task.pageUrl}>
                        <Button
                          variant="outline"
                          className="text-gray-700 border-gray-300"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Set Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Unlock Features */}
      <div className="col-span-1 space-y-6">
        {/* What You'll Unlock Card */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            What You&apos;ll Unlock Once You Go Live
          </h3>

          <div className="space-y-5">
            {/* Item 1 */}
            <div className="pb-5 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Verified Merchant Badge
                  </p>
                  <p className="text-xs text-gray-600 mt-1">After first sale</p>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="pb-5 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Analytics Dashboard
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Track your growth</p>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Customer Insights
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Know your buyers</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Help Card */}
        <Link href="/dashboard/ai">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex gap-3 mb-4">
              <Zap className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-base">Need personalized help?</h3>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              Ask Shikela AI anything about setting up your store, adding products, or configuring payments.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
