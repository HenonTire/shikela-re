/**
 * @file components/themes/theme-header.tsx
 * @description Theme-aware header component for store
 * 
 * Renders store header with theme-specific styling, including
 * logo, navigation, search, and cart with full theme support.
 */

import { ReactNode } from 'react';
import { ThemeConfig } from '@/lib/themes';
import { Search, ShoppingCart } from 'lucide-react';

interface ThemeHeaderProps {
  theme: ThemeConfig;
  storeName: string;
  businessType: string;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartCount: number;
  children?: ReactNode;
}

export function ThemeHeader({
  theme,
  storeName,
  businessType,
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  cartCount,
  children,
}: ThemeHeaderProps) {
  return (
    <header className={`${theme.header.bgClass} ${theme.header.textClass} ${theme.header.shadowClass}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Section - Branding and Search */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 
              className="font-bold"
              style={{
                fontSize: theme.typography.heading1.size,
                fontWeight: theme.typography.heading1.weight,
              }}
            >
              {storeName}
            </h1>
            <p className="text-sm opacity-75 mt-1">{businessType}</p>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-50 border border-white border-opacity-30 rounded-lg focus:outline-none focus:bg-opacity-30"
              />
            </div>
          </div>

          {/* Cart */}
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-current border-opacity-30 hover:bg-white hover:bg-opacity-10 transition-colors`}>
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">Cart ({cartCount})</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                selectedCategory === cat
                  ? `bg-white text-opacity-100`
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              style={
                selectedCategory === cat
                  ? { color: theme.colors.primary }
                  : {}
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {children}
      </div>
    </header>
  );
}
