/**
 * @file app/store/[storeId]/page.tsx
 * @description Store storefront page with full theme support
 * 
 * Displays products with theme-aware layouts, colors, and components.
 * Changes to theme settings are reflected immediately on this page.
 */

'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';
import { useStoreTheme, getValidTheme } from '@/lib/use-store-theme';
import { ThemeHeader } from '@/components/themes/theme-header';
import { ThemeProductCard } from '@/components/themes/theme-product-card';
import { ThemeFooter } from '@/components/themes/theme-footer';

interface StoreConfig {
  storeName: string;
  businessType: string;
}

export default function StorefrontPage({ params }: { params: { storeId: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Product[]>([]);
  
  // Theme management with persistence
  const { theme, themeId, setTheme, isLoaded } = useStoreTheme();

  useEffect(() => {
    // Load store config
    const config = JSON.parse(localStorage.getItem('storeData') || '{}');
    setStoreConfig(config);

    // Load products
    const allProducts = storage.getAll<Product>('products');
    const activeProducts = allProducts.filter(p => p.status === 'Active');
    setProducts(activeProducts);

    // Load cart
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    // Listen for theme changes from other tabs/windows
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.themeId) {
        setTheme(customEvent.detail.themeId);
      }
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [setTheme]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleAddToCart = (product: Product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.page.bgClass }}
    >
      {/* Header with Theme Support */}
      <ThemeHeader
        theme={theme}
        storeName={storeConfig?.storeName || 'Store'}
        businessType={storeConfig?.businessType || ''}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={cart.length}
      />

      {/* Products Grid Main Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ThemeProductCard
                key={product.id}
                theme={theme}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p 
              className="text-lg"
              style={{ color: theme.colors.neutral[600] }}
            >
              No products found
            </p>
          </div>
        )}
      </main>

      {/* Footer with Theme Support */}
      <ThemeFooter theme={theme} storeName={storeConfig?.storeName || 'Store'} />
    </div>
  );
}
