'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/lib/types';

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: Product[]) => void;
}

export function CSVImportModal({ open, onOpenChange, onImport }: CSVImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [importedProducts, setImportedProducts] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  if (!open) return null;

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products: any[] = [];
    const parseErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < 3) continue;

      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index];
      });

      // Validate required fields
      const errors_for_row: string[] = [];
      if (!product.name) errors_for_row.push(`Row ${i + 1}: Missing product name`);
      if (!product.price || isNaN(parseFloat(product.price))) errors_for_row.push(`Row ${i + 1}: Invalid price`);
      if (!product.stock || isNaN(parseInt(product.stock))) errors_for_row.push(`Row ${i + 1}: Invalid stock`);

      if (errors_for_row.length > 0) {
        parseErrors.push(...errors_for_row);
      } else {
        products.push({
          name: product.name,
          category: product.category || 'Uncategorized',
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          description: product.description || '',
          status: product.status || 'Draft',
          image: product.image || '📦',
          sales: 0,
          revenue: '0 ETB',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    setErrors(parseErrors);
    return products;
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const products = parseCSV(text);
      setImportedProducts(products);
      if (products.length > 0) {
        setStep('preview');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImport = () => {
    const productsToImport = importedProducts.map(p => ({
      ...p,
      id: `product_${Date.now()}_${Math.random()}`,
    }));
    onImport(productsToImport);
    setStep('upload');
    setImportedProducts([]);
    setErrors([]);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Import Products from CSV</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'upload' ? (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">Drag and drop your CSV file here</p>
              <p className="text-gray-600 text-sm mb-4">or</p>
              <label>
                <Button variant="outline">Choose File</Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">CSV Format Required:</h3>
              <p className="text-sm text-gray-600 mb-2">name,category,price,stock,description,status,image</p>
              <code className="text-xs bg-white p-2 block rounded border border-blue-200 text-gray-700">
                Example: T-Shirt,Fashion,500,50,Blue cotton shirt,Active,👕
              </code>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">{importedProducts.length} products ready to import</p>
                {errors.length > 0 && (
                  <p className="text-sm text-green-700 mt-1">{errors.length} rows had issues and were skipped</p>
                )}
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    {errors.map((err, idx) => (
                      <p key={idx}>{err}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Price</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {importedProducts.map((product, idx) => (
                    <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-gray-600">{product.category}</td>
                      <td className="px-4 py-2 text-gray-900">{product.price} ETB</td>
                      <td className="px-4 py-2 text-gray-900">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('upload');
                  setImportedProducts([]);
                  setErrors([]);
                }}
              >
                Back
              </Button>
              <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700">
                Import {importedProducts.length} Products
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
