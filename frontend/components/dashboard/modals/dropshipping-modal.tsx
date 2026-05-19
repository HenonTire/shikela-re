'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ShoppingCart, Plus } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Supplier, Product } from '@/lib/types';

interface DropshippingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (product: Product) => void;
}

export function DropshippingModal({
  open,
  onOpenChange,
  onImport,
}: DropshippingModalProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarkup, setSelectedMarkup] = useState(20);

  useEffect(() => {
    const allSuppliers = storage.getAll<Supplier>('suppliers');
    setSuppliers(allSuppliers);
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      const products = storage.getAll<Product>('products').filter(
        (p) => p.supplierId === selectedSupplier && !p.dropshipped
      );
      setSupplierProducts(products);
    }
  }, [selectedSupplier]);

  const filteredProducts = supplierProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = (product: Product) => {
    const wholesalePrice = product.price;
    const markupAmount = wholesalePrice * (selectedMarkup / 100);
    const retailPrice = wholesalePrice + markupAmount;

    const importedProduct: Product = {
      ...product,
      id: `dropship_${Date.now()}`,
      price: Math.round(retailPrice),
      dropshipped: true,
      wholesalePrice: wholesalePrice,
      markup: selectedMarkup,
      status: 'Draft',
    };

    onImport(importedProduct);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Browse Supplier Products</DialogTitle>
          <DialogDescription>
            Find and import products from verified suppliers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedSupplier ? (
            // Supplier Selection View
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Select a Supplier</h3>
              {suppliers.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {suppliers.map((supplier) => (
                    <Card
                      key={supplier.id}
                      className="p-4 cursor-pointer border-2 hover:border-blue-300 transition-all"
                      onClick={() => setSelectedSupplier(supplier.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {supplier.businessName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {supplier.categories.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {supplier.productsCount} products
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {supplier.ordersCount} orders
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No suppliers available yet</p>
                </div>
              )}
            </div>
          ) : (
            // Product Selection View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {suppliers.find((s) => s.id === selectedSupplier)?.businessName} Products
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSupplier(null);
                    setSearchTerm('');
                  }}
                >
                  Back to Suppliers
                </Button>
              </div>

              {/* Markup Setting */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Markup Percentage: {selectedMarkup}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedMarkup}
                  onChange={(e) => setSelectedMarkup(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Your retail price will be wholesale price + {selectedMarkup}%
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  {filteredProducts.map((product) => {
                    const wholesalePrice = product.price;
                    const retailPrice = wholesalePrice * (1 + selectedMarkup / 100);

                    return (
                      <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <div>
                                <p className="text-gray-600">Wholesale</p>
                                <p className="font-medium text-gray-900">{wholesalePrice} ETB</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Your Price</p>
                                <p className="font-medium text-green-600">
                                  {Math.round(retailPrice)} ETB
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Stock</p>
                                <p className="font-medium text-gray-900">{product.stock}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleImport(product)}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Import
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No products found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
