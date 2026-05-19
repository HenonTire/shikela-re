'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductActionMenuProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: Product) => void;
  onStatusChange: (product: Product, newStatus: Product['status']) => void;
}

/**
 * ProductActionMenu Component
 * 
 * Purpose: Dropdown menu for product row actions
 * Actions:
 * - Edit product
 * - Delete product
 * - Duplicate product
 * - Change status (Active/Draft)
 * 
 * Props:
 * - product: The product to perform actions on
 * - onEdit: Called when edit action is clicked
 * - onDelete: Called when delete action is clicked
 * - onDuplicate: Called when duplicate action is clicked
 * - onStatusChange: Called when status toggle is clicked
 */
export function ProductActionMenu({
  product,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}: ProductActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (confirm(`Delete "${product.name}"?`)) {
      onDelete(product.id);
      setIsOpen(false);
    }
  };

  const handleStatusToggle = () => {
    const newStatus = product.status === 'Active' ? 'Draft' : 'Active';
    onStatusChange(product, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <Card className="absolute right-0 top-8 w-48 p-0 shadow-lg z-10">
            <div className="py-2">
              {/* Edit */}
              <button
                onClick={() => {
                  onEdit(product);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>

              {/* Status Toggle */}
              <button
                onClick={handleStatusToggle}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                {product.status === 'Active' ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Make Draft
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Make Active
                  </>
                )}
              </button>

              {/* Duplicate */}
              <button
                onClick={() => {
                  onDuplicate(product);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
