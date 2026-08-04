'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Search, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiRequest } from '@/lib/api-client';

export function DashboardHeader() {
  const [storeName, setStoreName] = useState<string>("Sam's Store");
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStoreDetails() {
      try {
        const res = await apiRequest<any>('/shops/details/', {
          method: 'GET',
          auth: true,
        });

        // Handle both single object or array formats returned by the backend
        let shopData = null;
        if (Array.isArray(res) && res.length > 0) {
          shopData = res[0];
        } else if (res && !Array.isArray(res)) {
          shopData = res;
        }

        if (shopData) {
          const name = shopData.name || shopData.storeName;
          if (name) {
            setStoreName(name);
            // Optionally update localStorage for persistence across components
            localStorage.setItem('storeName', name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch store details for header:', err);
        // Fallback to local storage if API call fails
        const localStore = localStorage.getItem('storeName');
        if (localStore) {
          setStoreName(localStore);
        }
      } finally {
        setIsLoadingStore(false);
      }
    }

    fetchStoreDetails();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-64 right-0 h-16 z-40">
      <div className="h-full flex items-center px-6 justify-between">
        {/* Left: Store Selector */}
        <div className="w-44 flex-shrink-0">
          <Select value={storeName} disabled={isLoadingStore}>
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue placeholder={isLoadingStore ? "Loading..." : storeName} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={storeName}>{storeName}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-100 border-gray-300 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/dashboard/ai">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-4 py-2 text-sm">
              <Zap className="w-4 h-4" />
              <span>Ask AI</span>
            </Button>
          </Link>

          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </Link>

          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-6 h-6 text-gray-600" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}