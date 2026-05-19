'use client';

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

export function DashboardHeader() {
  const storeName = localStorage.getItem('storeName') || "Sam's Store";

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-64 right-0 h-16 z-40">
      <div className="h-full flex items-center px-6 justify-between">
        {/* Left: Store Selector */}
        <div className="w-44 flex-shrink-0">
          <Select defaultValue={storeName}>
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue />
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
