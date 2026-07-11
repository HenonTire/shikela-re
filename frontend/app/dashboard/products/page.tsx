'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types';
import { AddProductModal } from '@/components/dashboard/modals/add-product-modal';
import { ProductActionMenu } from '@/components/dashboard/product-action-menu';
import { DropshippingModal } from '@/components/dashboard/modals/dropshipping-modal';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropshippingModal, setShowDropshippingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('own');
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Helper method for authenticated fetch requests
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  // Fetch all products and supplier details from backend on load
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/catalog/products/');
      // Map backend fields to component format if required
      const normalizedProducts = data.map((p: any) => ({
        id: p.id,
        name: p.name || p.title,
        category: p.category || '',
        status: p.is_active || p.status === 'Active' ? 'Active' : 'Draft',
        price: p.price,
        stock: p.stock || p.inventory_quantity || 0,
        sales: p.sales || 0,
        revenue: p.revenue || 0,
        image: p.image || '📦',
        dropshipped: p.dropshipped || false,
        supplierId: p.supplier_id || p.supplierId,
        wholesalePrice: p.wholesale_price || p.wholesalePrice || 0,
        markup: p.markup || 0,
      }));
      setProducts(normalizedProducts);

      // Attempt to load suppliers for dropshipping name verification mapping
      try {
        const suppliersData = await apiFetch('/shops/');
        setSuppliers(suppliersData);
      } catch (_) {
        // Fallback gracefully if separate vendors endpoint differs
      }
    } catch (error) {
      console.error('Error loading products from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  // Calculate statistics from backend products state data
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const draftProducts = products.filter(p => p.status === 'Draft').length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const payload = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        is_active: productData.status === 'Active',
        dropshipped: productData.dropshipped || false,
      };
      await apiFetch('/catalog/products/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      fetchProductsData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create new product:', error);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const payload = {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        is_active: product.status === 'Active',
        dropshipped: product.dropshipped,
      };
      await apiFetch(`/catalog/products/${product.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      fetchProductsData();
      setEditingProduct(null);
      setShowAddModal(false); // ✅ FIX: Added this to close the modal after updating
    } catch (error) {
      console.error('Failed to update product details:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiFetch(`/catalog/products/${id}/`, {
        method: 'DELETE',
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product from inventory:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newStatus = product.status === 'Draft' ? 'Active' : 'Draft';
      await handleUpdateProduct({ ...product, status: newStatus });
    }
  };

  const handleDuplicate = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const duplicated = { ...product, name: `${product.name} (Copy)` };
      delete (duplicated as any).id;
      await handleAddProduct(duplicated);
    }
  };

  const handleImportDropshipped = async (product: Product) => {
    try {
      await handleAddProduct({ ...product, dropshipped: true });
      setShowDropshippingModal(false);
    } catch (error) {
      console.error('Failed to import dropshipped product:', error);
    }
  };

  const ownProducts = filteredProducts.filter(p => !p.dropshipped);
  const dropshippedProducts = products.filter(p => p.dropshipped);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddProductModal 
        open={showAddModal} 
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setEditingProduct(null); // ✅ UX Improvement: Clears editing state if user cancels/clicks backdrop
        }}
        onSubmit={handleAddProduct}
        editingProduct={editingProduct}
        onEditSubmit={handleUpdateProduct}
      />

      <DropshippingModal
        open={showDropshippingModal}
        onOpenChange={setShowDropshippingModal}
        onImport={handleImportDropshipped}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2" 
            onClick={() => { 
              setEditingProduct(null); 
              setShowAddModal(true); 
            }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white p-6">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-990 mt-2">{totalProducts}</p>
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
                className={filterStatus === 'all' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' : ''}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Total Products
              </Button>
              <Button
                variant={filterStatus === 'Active' ? 'default' : 'outline'}
                className={filterStatus === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' : ''}
                size="sm"
                onClick={() => setFilterStatus('Active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'Draft' ? 'default' : 'outline'}
                className={filterStatus === 'Draft' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' : ''}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sales</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ownProducts.length > 0 ? (
                  ownProducts.map((product) => (
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{product.price} ETB</td>
                      <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                      <td className="px-6 py-4 text-gray-900">{product.sales}</td>
                      <td className="px-6 py-4 text-gray-900">{product.revenue} ETB</td>
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
                      No matching shop manager items found.
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
            <Button onClick={() => setShowDropshippingModal(true)} className="bg-green-600 hover:bg-green-700 gap-2">
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

          {/* Dropshipping Table */}
          {dropshippedProducts.length > 0 ? (
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Wholesale Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Retail Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Margin</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
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
                        {suppliers.find((s: any) => s.id === product.supplierId)?.name || 'Platform Supplier'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{product.wholesalePrice} ETB</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.price} ETB</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{product.markup}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
              <p className="text-gray-500 text-sm mt-2">Browse suppliers to start importing products</p>
              <Button onClick={() => setShowDropshippingModal(true)} className="mt-4 bg-green-600 hover:bg-green-700">
                Browse Suppliers
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}