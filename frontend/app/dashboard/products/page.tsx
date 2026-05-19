'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Download, Plus, Search, MoreVertical, Trash2, Edit, Copy, Eye, EyeOff, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';
import { AddProductModal } from '@/components/dashboard/modals/add-product-modal';
import { ProductActionMenu } from '@/components/dashboard/product-action-menu';
import { DropshippingModal } from '@/components/dashboard/modals/dropshipping-modal';
import { CSVImportModal } from '@/components/dashboard/modals/csv-import-modal';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => storage.getAll<Product>('products'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropshippingModal, setShowDropshippingModal] = useState(false);
  const [showCSVImportModal, setShowCSVImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('own');

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const draftProducts = products.filter(p => p.status === 'Draft').length;
  const lowStockProducts = products.filter(p => p.status === 'Low').length;

  // Filter and search
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = storage.create('products', product);
    setProducts(prev => [...prev, newProduct]);
    setShowAddModal(false);
  };

  const handleUpdateProduct = (product: Product) => {
    storage.update('products', product);
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    storage.delete('products', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newStatus = product.status === 'Draft' ? 'Active' : 'Draft';
      handleUpdateProduct({ ...product, status: newStatus });
    }
  };

  const handleDuplicate = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const duplicated = { ...product, name: `${product.name} (Copy)` };
      delete (duplicated as any).id;
      handleAddProduct(duplicated);
    }
  };

  const handleImportDropshipped = (product: Product) => {
    const newProduct = storage.create('products', product);
    setProducts(prev => [...prev, newProduct]);
    setShowDropshippingModal(false);
  };

  const handleImportCSV = (productsToImport: Product[]) => {
    const newProducts = productsToImport.map(p => storage.create('products', p));
    setProducts(prev => [...prev, ...newProducts]);
  };

  // Filter products by type
  const ownProducts = products.filter(p => !p.dropshipped);
  const dropshippedProducts = products.filter(p => p.dropshipped);

  return (
    <div className="space-y-6">
      <AddProductModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSubmit={handleAddProduct}
        editingProduct={editingProduct}
        onEditSubmit={handleUpdateProduct}
      />

      <DropshippingModal
        open={showDropshippingModal}
        onOpenChange={setShowDropshippingModal}
        onImport={handleImportDropshipped}
      />

      <CSVImportModal
        open={showCSVImportModal}
        onOpenChange={setShowCSVImportModal}
        onImport={handleImportCSV}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowCSVImportModal(true)}>
            <Download className="w-4 h-4" />
            Import CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white p-6">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
        </Card>
        <Card className="bg-emerald-50 p-6">
          <p className="text-gray-600 text-sm">Active Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{activeProducts}</p>
        </Card>
        <Card className="bg-blue-50 p-6">
          <p className="text-gray-600 text-sm">Draft</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{draftProducts}</p>
        </Card>
        <Card className="bg-red-50 p-6">
          <p className="text-gray-600 text-sm">Low Stock</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{lowStockProducts}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="own">My Products</TabsTrigger>
          <TabsTrigger value="dropshipping">Dropshipping</TabsTrigger>
        </TabsList>

        <TabsContent value="own" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-gray-100 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                className={filterStatus === 'all' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Total Products
              </Button>
              <Button
                variant={filterStatus === 'Active' ? 'default' : 'outline'}
                className={filterStatus === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                size="sm"
                onClick={() => setFilterStatus('Active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'Draft' ? 'default' : 'outline'}
                className={filterStatus === 'Draft' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                size="sm"
                onClick={() => setFilterStatus('Draft')}
              >
                Draft
              </Button>
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Revenue
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
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'Draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-gray-900">{product.sales}</td>
                  <td className="px-6 py-4 text-gray-900">{product.revenue}</td>
                  <td className="px-6 py-4">
                    <ProductActionMenu
                      product={product}
                      onEdit={() => {
                        setEditingProduct(product);
                        setShowAddModal(true);
                      }}
                      onDelete={() => handleDeleteProduct(product.id)}
                      onToggleStatus={() => handleToggleStatus(product.id)}
                      onDuplicate={() => handleDuplicate(product.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
        </TabsContent>

        <TabsContent value="dropshipping" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dropshipped Products</h3>
              <p className="text-sm text-gray-600 mt-1">
                Products imported from verified suppliers. Stock syncs automatically.
              </p>
            </div>
            <Button
              onClick={() => setShowDropshippingModal(true)}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Package className="w-4 h-4" />
              Browse Suppliers
            </Button>
          </div>

          {/* Dropshipping Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-gray-600 text-sm">Total Dropshipped</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dropshippedProducts.length}</p>
            </Card>
            <Card className="p-6 bg-green-50">
              <p className="text-gray-600 text-sm">In Stock</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {dropshippedProducts.filter(p => p.stock > 0).length}
              </p>
            </Card>
            <Card className="p-6 bg-red-50">
              <p className="text-gray-600 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {dropshippedProducts.filter(p => p.stock === 0).length}
              </p>
            </Card>
          </div>

          {/* Dropshipping Products Table */}
          {dropshippedProducts.length > 0 ? (
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Wholesale Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Retail Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Margin
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dropshippedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {storage.getAll('suppliers').find((s: any) => s.id === product.supplierId)?.businessName || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {product.wholesalePrice} ETB
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.price} ETB
                      </td>
                      <td className="px-6 py-4 text-green-600 font-medium">
                        {product.markup}%
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No dropshipped products yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Browse suppliers to start importing products
              </p>
              <Button
                onClick={() => setShowDropshippingModal(true)}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Browse Suppliers
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
