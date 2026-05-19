/**
 * @file app/supplier/products/page.tsx
 * @description Supplier product inventory management page
 * 
 * Features:
 * - View all supplied products
 * - Real-time inventory tracking
 * - Stock level monitoring (in stock, low stock, out of stock)
 * - Product search and filtering
 * - Quick actions (edit, delete, manage)
 * - Batch operations support
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Edit, Trash2, TrendingUp } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';

export default function SupplierProductsPage() {
  const [supplierId] = useState(() => localStorage.getItem('supplierId') || '');
  const [products, setProducts] = useState<Product[]>(() => {
    return storage.getAll<Product>('products').filter(
      (p) => p.supplierId === supplierId && p.dropshipped
    );
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'in-stock') return matchesSearch && product.stock > 10;
    if (filterStatus === 'low-stock') return matchesSearch && product.stock > 0 && product.stock <= 10;
    if (filterStatus === 'out-of-stock') return matchesSearch && product.stock === 0;
    
    return matchesSearch;
  });

  const handleAddProduct = () => {
    // TODO: Open add product modal
    console.log('Add product clicked');
  };

  const handleDelete = (id: string) => {
    storage.delete('products', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
          <p className="text-gray-600 mt-1">Manage inventory levels across all your products</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleAddProduct}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.total} active products</p>
        </Card>
        <Card className="p-6 bg-green-50 border-green-200">
          <p className="text-gray-600 text-sm font-medium">In Stock</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.inStock}</p>
          <p className="text-xs text-green-600 mt-2">{Math.round(stats.inStock / stats.total * 100 || 0)}% of inventory</p>
        </Card>
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <p className="text-gray-600 text-sm font-medium">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.lowStock}</p>
          <p className="text-xs text-yellow-600 mt-2">Requires attention</p>
        </Card>
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.outOfStock}</p>
          <p className="text-xs text-red-600 mt-2">Needs restock</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products by name..."
            className="pl-10 bg-gray-100 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'in-stock', 'low-stock', 'out-of-stock'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {status === 'all' && 'All'}
              {status === 'in-stock' && 'In Stock'}
              {status === 'low-stock' && 'Low Stock'}
              {status === 'out-of-stock' && 'Out of Stock'}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Wholesale Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-lg">
                        {product.image}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.wholesalePrice || product.price} ETB
                  </td>
                  <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No products found. Add your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
