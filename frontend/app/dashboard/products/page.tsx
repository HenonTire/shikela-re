'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, Package, ShoppingBag, DollarSign, MoreHorizontal, Pencil, Trash2, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types';
import { AddProductModal } from '@/components/dashboard/modals/add-product-modal';
import { DropshippingModal } from '@/components/dashboard/modals/dropshipping-modal';
import { apiRequest } from '@/lib/api-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnalyticsData {
  total_revenue: string;
  this_month_revenue: string;
  orders_count: number;
  units_sold: number;
  refund_amount: string;
  commission_paid: string;
  platform_fee: string;
  today_orders: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropshippingModal, setShowDropshippingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('own');
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Fetch all products, suppliers, and live dashboard analytics using authenticated apiRequest
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const [productsData, suppliersData, analyticsData] = await Promise.allSettled([
        apiRequest<any>('/catalog/products/', { auth: true }),
        apiRequest<any>('/shops/', { auth: true }),
        apiRequest<AnalyticsData>('/analytics/shop/dashboard/', { auth: true }),
      ]);

      // Handle Products Data Parsing
      if (productsData.status === 'fulfilled') {
        const rawList = Array.isArray(productsData.value)
          ? productsData.value
          : productsData.value?.results || [];

        const normalizedProducts = rawList.map((p: any) => ({
          id: p.id,
          name: p.name || p.title || 'Untitled Product',
          category: p.category_name || p.category?.name || p.category || 'General',
          status: p.is_active || p.status === 'Active' || p.status === 'active' ? 'Active' : 'Draft',
          price: p.price || 0,
          stock: p.stock ?? p.inventory_quantity ?? 0,
          sales: p.sales || p.units_sold || 0,
          revenue: p.revenue || 0,
          image: p.image || p.media?.[0]?.file || '📦',
          dropshipped: p.dropshipped || Boolean(p.supplier_id),
          supplierId: p.supplier_id || p.supplierId,
          wholesalePrice: p.wholesale_price || p.supplier_price || 0,
          markup: p.markup || 0,
        }));
        setProducts(normalizedProducts);
      }

      // Handle Suppliers Data
      if (suppliersData.status === 'fulfilled') {
        const rawSuppliers = Array.isArray(suppliersData.value)
          ? suppliersData.value
          : suppliersData.value?.results || [];
        setSuppliers(rawSuppliers);
      }

      // Handle Analytics Data
      if (analyticsData.status === 'fulfilled' && analyticsData.value) {
        setAnalytics(analyticsData.value);
      }
    } catch (error) {
      console.error('Error loading inventory dashboard from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  // Calculate statistics from products list + analytics endpoint
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'Active').length;
  const draftProducts = products.filter((p) => p.status === 'Draft').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5).length;

  // Filter and search logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const payload: Record<string, any> = {
        name: productData.name,
        description: (productData as any).description || '',
        price: String(productData.price),
        stock: Number(productData.stock),
        is_active: productData.status === 'Active' || productData.status === ('active' as any),
      };

      if ((productData as any).category_id || productData.category) {
        payload.category_id = (productData as any).category_id || productData.category;
      }

      await apiRequest('/catalog/products/', {
        method: 'POST',
        body: payload,
        auth: true,
      });

      await fetchProductsData();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Failed to create new product:', error);
      alert(error.message || 'Error creating product');
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const payload: Record<string, any> = {
        name: product.name,
        price: String(product.price),
        stock: Number(product.stock),
        is_active: product.status === 'Active' || product.status === ('active' as any),
      };

      if ((product as any).category_id) {
        payload.category_id = (product as any).category_id;
      }

      await apiRequest(`/catalog/products/${product.id}/`, {
        method: 'PATCH',
        body: payload,
        auth: true,
      });

      await fetchProductsData();
      setEditingProduct(null);
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Failed to update product details:', error);
      alert(error.message || 'Error updating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiRequest(`/catalog/products/${id}/`, {
        method: 'DELETE',
        auth: true,
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      fetchProductsData();
    } catch (error: any) {
      console.error('Failed to delete product from inventory:', error);
      alert(error.message || 'Error deleting product');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const newStatus = product.status === 'Draft' ? 'Active' : 'Draft';
      await handleUpdateProduct({ ...product, status: newStatus });
    }
  };

  const handleDuplicate = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const duplicated = { ...product, name: `${product.name} (Copy)` };
      delete (duplicated as any).id;
      await handleAddProduct(duplicated);
    }
  };

  const handleImportDropshipped = async (product: Product) => {
    try {
      await apiRequest(`/catalog/products/${product.id}/import/`, {
        method: 'POST',
        auth: true,
      });
      await fetchProductsData();
      setShowDropshippingModal(false);
    } catch (error: any) {
      console.error('Failed to import dropshipped product:', error);
      alert(error.message || 'Error importing dropshipped product');
    }
  };

  const ownProducts = filteredProducts.filter((p) => !p.dropshipped);
  const dropshippedProducts = products.filter((p) => p.dropshipped);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add / Edit Product Modal */}
      <AddProductModal
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setEditingProduct(null);
        }}
        onSubmit={handleAddProduct}
        editingProduct={editingProduct}
        onEditSubmit={handleUpdateProduct}
      />

      {/* Dropshipping Modal */}
      <DropshippingModal
        open={showDropshippingModal}
        onOpenChange={setShowDropshippingModal}
        onImport={handleImportDropshipped}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory & sales performance</p>
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

      {/* Primary Analytics & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {analytics ? `${parseFloat(analytics.total_revenue || '0').toLocaleString()} ETB` : '0 ETB'}
          </p>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>This Month: {analytics ? parseFloat(analytics.this_month_revenue || '0').toLocaleString() : 0} ETB</span>
          </div>
        </Card>

        <Card className="bg-emerald-50/50 p-6 border border-emerald-100">
          <p className="text-gray-600 text-sm font-medium">Units Sold</p>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {analytics ? analytics.units_sold : 0}
          </p>
          <div className="mt-2 text-xs text-emerald-800 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders: {analytics ? analytics.orders_count : 0}</span>
          </div>
        </Card>

        <Card className="bg-blue-50/50 p-6 border border-blue-100">
          <p className="text-gray-600 text-sm font-medium">Active Inventory</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">{activeProducts}</p>
          <div className="mt-2 text-xs text-blue-800">
            <span>{draftProducts} Drafts / {totalProducts} Total</span>
          </div>
        </Card>

        <Card className="bg-red-50/50 p-6 border border-red-100">
          <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{lowStockProducts}</p>
          <div className="mt-2 text-xs text-red-700">
            <span>Requires restocking</span>
          </div>
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
                className="pl-10 bg-gray-50 border-gray-200"
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
                All
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

          {/* Products Table using Shadcn Table components */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow>
                  <TableHead className="w-12 px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Product</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Price</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Stock</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Sales</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Revenue</TableHead>
                  <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {ownProducts.length > 0 ? (
                  ownProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50">
                      <TableCell className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg overflow-hidden border">
                            {typeof product.image === 'string' && product.image.startsWith('http') ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              product.image || '📦'
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-900">{product.price} ETB</TableCell>
                      <TableCell className="px-6 py-4 text-gray-900">{product.stock}</TableCell>
                      <TableCell className="px-6 py-4 text-gray-900">{product.sales}</TableCell>
                      <TableCell className="px-6 py-4 text-gray-900">{product.revenue} ETB</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingProduct(product);
                                setShowAddModal(true);
                              }}
                              className="gap-2 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(product.id)}
                              className="gap-2 cursor-pointer"
                            >
                              Toggle Status ({product.status === 'Active' ? 'Draft' : 'Active'})
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(product.id)}
                              className="gap-2 cursor-pointer"
                            >
                              <Copy className="w-4 h-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

          {/* Dropshipping Table using Shadcn Table */}
          {dropshippedProducts.length > 0 ? (
            <Card className="overflow-hidden border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Product</TableHead>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Supplier</TableHead>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Wholesale Price</TableHead>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Retail Price</TableHead>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Margin</TableHead>
                    <TableHead className="px-6 py-3 text-sm font-semibold text-gray-900">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                  {dropshippedProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-900">
                        {suppliers.find((s: any) => s.id === product.supplierId)?.name || 'Platform Supplier'}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-900">{product.wholesalePrice} ETB</TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-900">{product.price} ETB</TableCell>
                      <TableCell className="px-6 py-4 text-green-600 font-medium">{product.markup}%</TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="p-12 text-center border-dashed">
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