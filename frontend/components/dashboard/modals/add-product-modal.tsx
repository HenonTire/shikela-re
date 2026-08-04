'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { Product } from '@/lib/types';
import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from '@/lib/constants';
import { apiRequest } from '@/lib/api-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productData: Omit<Product, 'id'>) => Promise<void>;
  editingProduct?: Product | null;
  onEditSubmit?: (product: Product) => Promise<void>;
}

export function AddProductModal({
  open,
  onOpenChange,
  onSubmit,
  editingProduct,
  onEditSubmit,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    supplier_price: '',
    stock: '',
    description: '',
    status: 'Draft' as 'Active' | 'Draft',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>(PRODUCT_CATEGORIES);

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      supplier_price: '',
      stock: '',
      description: '',
      status: 'Draft',
    });
    setImagePreview(null);
    setErrors({});
  };

  // Fetch live categories from backend catalog
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const response = await apiRequest<any>('/catalog/categories/', { auth: true });
        const categories = Array.isArray(response) ? response : response?.results || [];
        if (isMounted && categories.length > 0) {
          setCategoriesList(categories);
        }
      } catch (err) {
        console.warn('Failed to fetch catalog categories, fallback to static defaults.', err);
      }
    };

    if (open) {
      loadCategories();
    }

    return () => {
      isMounted = false;
    };
  }, [open]);

  // Sync form state when editing or opening modal
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category:
          (editingProduct as any).category_id ||
          editingProduct.category ||
          '',
        price: editingProduct.price ? String(editingProduct.price) : '',
        supplier_price: (editingProduct as any).supplier_price ? String((editingProduct as any).supplier_price) : '',
        stock: editingProduct.stock ? String(editingProduct.stock) : '',
        description: (editingProduct as any).description || '',
        status:
          editingProduct.status?.toLowerCase() === 'active' ? 'Active' : 'Draft',
      });
      setImagePreview(
        typeof editingProduct.image === 'string' ? editingProduct.image : null
      );
    } else {
      resetForm();
    }
  }, [editingProduct, open]);

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stock || parseInt(formData.stock, 10) < 0) {
      newErrors.stock = 'Valid stock is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Clean payload adhering strictly to backend expectations (omitting empty optional foreign keys)
      const payload: any = {
        name: formData.name.trim(),
        price: parseFloat(formData.price).toFixed(2),
        stock: parseInt(formData.stock, 10),
        is_active: formData.status === 'Active',
        description: formData.description.trim(),
        tags: [],
      };

      if (formData.category && formData.category.trim() !== '') {
        payload.category_id = formData.category;
      }

      if (formData.supplier_price) {
        payload.supplier_price = parseFloat(formData.supplier_price).toFixed(2);
      }

      if (imagePreview && !imagePreview.startsWith('data:')) {
        payload.media = [
          {
            media_type: 'IMAGE',
            file: imagePreview,
            is_primary: true,
            order: 1,
          },
        ];
      }

      if (editingProduct && onEditSubmit) {
        await onEditSubmit({
          ...editingProduct,
          ...payload,
        } as unknown as Product);
      } else {
        await onSubmit(payload as unknown as Omit<Product, 'id'>);
      }
      handleClose();
    } catch (error: any) {
      console.error('Error submitting product form:', error?.message || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-6 shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.map((cat, index) => {
                  const itemValue =
                    typeof cat === 'string' ? cat : cat.id || cat.name;
                  const itemLabel =
                    typeof cat === 'string' ? cat : cat.name || cat.id;
                  const itemKey =
                    typeof cat === 'string'
                      ? cat
                      : cat.id || cat.name || index;

                  return (
                    <SelectItem key={itemKey} value={String(itemValue)}>
                      {itemLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (ETB)
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Product description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <p className="text-xs text-gray-600">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload image
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Draft') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUS.map((status, index) => (
                  <SelectItem key={status || index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editingProduct
                ? 'Update Product'
                : 'Add Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}