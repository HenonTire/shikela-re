/**
 * @file components/themes/theme-product-card.tsx
 * @description Theme-aware product card component
 * 
 * Displays products with theme-specific styling for price, buttons, and layout.
 */

import { ShoppingCart, Heart } from 'lucide-react';
import { ThemeConfig } from '@/lib/themes';
import { Product } from '@/lib/types';

interface ThemeProductCardProps {
  theme: ThemeConfig;
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ThemeProductCard({ theme, product, onAddToCart }: ThemeProductCardProps) {
  return (
    <div 
      className={`${theme.card.bgClass} ${theme.card.borderClass} rounded-lg overflow-hidden ${theme.card.shadowClass} transition-shadow h-full flex flex-col`}
    >
      {/* Product Image */}
      <div 
        className={`h-48 flex items-center justify-center text-6xl bg-gradient-to-br`}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral[100]}, ${theme.colors.neutral[200]})`,
        }}
      >
        {product.image}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 
          className="font-semibold line-clamp-2 mb-1"
          style={{
            fontSize: theme.typography.body.size,
            color: theme.colors.primary,
          }}
        >
          {product.name}
        </h3>
        
        <p 
          className="text-xs mb-2"
          style={{ color: theme.colors.neutral[500] }}
        >
          {product.category}
        </p>

        {/* Description */}
        {product.description && (
          <p 
            className="text-sm line-clamp-2 mb-3"
            style={{ color: theme.colors.neutral[600] }}
          >
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b"
          style={{ borderColor: theme.colors.neutral[200] }}
        >
          <div>
            <p 
              className="text-2xl font-bold"
              style={{ color: theme.colors.accent }}
            >
              {product.price} ETB
            </p>
            <p 
              className="text-xs mt-1"
              style={{ color: theme.colors.neutral[500] }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
          <button
            className="px-3 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
