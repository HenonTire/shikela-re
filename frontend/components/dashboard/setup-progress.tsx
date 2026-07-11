'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Package, Zap, Truck, Store, ArrowRight } from 'lucide-react';

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  pageUrl: string;
  completed: boolean;
}

const DEFAULT_SETUP_TASKS: SetupTask[] = [
  {
    id: 'products',
    title: 'Add your first product',
    description: 'Add products to your catalog to show them in your store.',
    icon: 'Package',
    pageUrl: '/dashboard/products',
    completed: false,
  },
  {
    id: 'payments',
    title: 'Set up payments',
    description: 'Configure your payment gateways to receive client money via Santimpay.',
    icon: 'CreditCard',
    pageUrl: '/dashboard/payments',
    completed: false,
  },
  {
    id: 'shipping',
    title: 'Configure shipping options',
    description: 'Set up courier delivery profiles or standard flat delivery fees.',
    icon: 'Truck',
    pageUrl: '/dashboard/shipping',
    completed: false,
  },
  {
    id: 'store',
    title: 'Customize your online store theme',
    description: 'Modify configurations on your shop settings page.',
    icon: 'Store',
    pageUrl: '/dashboard/online-store',
    completed: false,
  },
];

export function SetupProgress() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedTask, setExpandedTask] = useState('products');
  const [tasks, setTasks] = useState<SetupTask[]>(DEFAULT_SETUP_TASKS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage securely on client mount
  useEffect(() => {
    const localTasksRaw = localStorage.getItem('setupTasks');
    if (localTasksRaw) {
      try {
        setTasks(JSON.parse(localTasksRaw));
      } catch (e) {
        console.error("Error parsing local setupTasks storage state:", e);
        localStorage.setItem('setupTasks', JSON.stringify(DEFAULT_SETUP_TASKS));
      }
    } else {
      localStorage.setItem('setupTasks', JSON.stringify(DEFAULT_SETUP_TASKS));
    }
    setIsHydrated(true);
  }, []);

  // Backwards compatibility: Also complete tasks automatically if they navigate manually
  useEffect(() => {
    if (!isHydrated) return;

    const pageTaskMap: Record<string, string> = {
      '/dashboard/products': 'products',
      '/dashboard/payments': 'payments',
      '/dashboard/shipping': 'shipping',
      '/dashboard/online-store': 'store',
    };

    let updateNeeded = false;
    const updatedTasks = tasks.map((task) => {
      const targetPath = Object.keys(pageTaskMap).find((path) => pathname?.includes(path));
      if (targetPath && pageTaskMap[targetPath] === task.id && !task.completed) {
        updateNeeded = true;
        return { ...task, completed: true };
      }
      return task;
    });

    if (updateNeeded) {
      setTasks(updatedTasks);
      localStorage.setItem('setupTasks', JSON.stringify(updatedTasks));
    }
  }, [pathname, isHydrated, tasks]);

  // Handler to mark task as completed immediately when click occurs
  const handleTaskClick = (taskId: string, targetUrl: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('setupTasks', JSON.stringify(updatedTasks));
    
    // Navigate smoothly to the action workspace
    router.push(targetUrl);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Package': <Package className="w-6 h-6 text-blue-600" />,
      'CreditCard': <Zap className="w-6 h-6 text-blue-600" />,
      'Truck': <Truck className="w-6 h-6 text-blue-600" />,
      'Store': <Store className="w-6 h-6 text-blue-600" />,
    };
    return iconMap[iconName] || <Store className="w-6 h-6 text-blue-600" />;
  };

  if (!isHydrated) {
    return <div className="animate-pulse bg-gray-100 rounded-xl h-[400px] w-full" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Setup Card */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
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
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id}>
                {expandedTask === task.id ? (
                  /* Expanded View */
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-lg p-3 mt-1">
                        {getIconComponent(task.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {task.title}
                          </h3>
                          {task.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-50" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {task.description}
                        </p>
                        <Button 
                          onClick={() => handleTaskClick(task.id, task.pageUrl)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
                        >
                          {task.completed ? 'Review Settings' : 'Continue'}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Collapsed View */
                  <div 
                    className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => setExpandedTask(task.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span
                        className={`font-medium ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-100"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task.id, task.pageUrl);
                      }}
                    >
                      {task.completed ? 'Review' : 'Set Up'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Unlock Features */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            What You&apos;ll Unlock
          </h3>

          <div className="space-y-5">
            <div className="pb-5 border-b border-gray-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Verified Merchant Badge
                  </p>
                  <p className="text-xs text-gray-500 mt-1">After first sale</p>
                </div>
              </div>
            </div>

            <div className="pb-5 border-b border-gray-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Analytics Dashboard
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Track your growth</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Customer Insights
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Know your buyers</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => router.push('/dashboard/ai')}
          className="w-full p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none cursor-pointer hover:shadow-md transition-all rounded-xl text-left flex flex-col items-start h-auto"
        >
          <div className="flex gap-3 mb-4 items-center">
            <Zap className="w-6 h-6 flex-shrink-0 text-white fill-white" />
            <h3 className="font-bold text-base">Need personalized help?</h3>
          </div>
          <p className="text-sm text-blue-50 leading-relaxed font-normal normal-case whitespace-normal">
            Ask Shikela AI anything about setting up your store, adding products, or configuring payments.
          </p>
        </Button>
      </div>
    </div>
  );
}