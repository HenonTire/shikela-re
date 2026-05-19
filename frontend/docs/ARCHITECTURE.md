# Shikela Platform - Architecture Documentation

## Project Overview

Shikela is a Shopify-like e-commerce platform designed specifically for Ethiopian merchants. It provides store owners with tools to manage products, orders, customers, payments, and shipping with a focus on Ethiopian payment methods and regional shipping.

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: localStorage (client-side)
- **State Management**: React hooks (useState) + localStorage
- **Type Safety**: TypeScript

## Directory Structure

```
/app
  /dashboard
    /page.tsx                    # Main dashboard (home)
    /products
      /page.tsx                  # Products inventory management
    /orders
      /page.tsx                  # Order management
    /customers
      /page.tsx                  # Customer management
    /online-store
      /page.tsx                  # Store customization
    /shipping
      /page.tsx                  # Shipping zone configuration
    /payments
      /page.tsx                  # Payment method management
    /settings
      /page.tsx                  # Store settings
    /ai
      /page.tsx                  # Shikela AI assistant
    layout.tsx                   # Dashboard layout (header + sidebar)

/components
  /dashboard
    sidebar.tsx                  # Left navigation
    header.tsx                   # Top bar with search & AI button
    welcome-hero.tsx             # Welcome banner
    setup-progress.tsx           # Onboarding task tracker
    ai-chat.tsx                  # AI chat interface
    product-action-menu.tsx      # Product row actions
    /modals
      add-product-modal.tsx      # Add product form

/lib
  storage.ts                     # localStorage CRUD utilities
  types.ts                       # TypeScript interfaces
  constants.ts                   # App constants
  utils.ts                       # Utility functions

/docs
  ARCHITECTURE.md                # This file
  STORAGE_API.md                 # Storage utilities guide
  /features                      # Feature-specific docs
```

## Data Flow Architecture

### 1. Component -> State -> localStorage

All data flows through this pattern:

```
User Input (Form/Button)
    ↓
Component setState() updates
    ↓
Call storage.create/update/delete()
    ↓
Data persisted to localStorage
    ↓
Component re-renders with new data
```

### 2. Page Load -> Load from localStorage

```
Page mounts
    ↓
Component calls storage.getAll() in useState initializer
    ↓
Initial state set from localStorage
    ↓
Component renders with data
```

### 3. localStorage Keys Mapping

| Key | Type | Purpose |
|-----|------|---------|
| `products` | Product[] | All store products |
| `orders` | Order[] | Customer orders |
| `customers` | Customer[] | Customer database |
| `setupTasks` | SetupTask[] | Onboarding completion tracking |
| `shippingZones` | ShippingZone[] | Configured shipping regions |
| `paymentMethods` | PaymentMethod[] | Connected payment gateways |
| `storeSettings` | StoreSettings | Store configuration |
| `aiChatHistory` | ChatMessage[] | AI chat message history |

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── DashboardLayout (app/dashboard/layout.tsx)
│   ├── Sidebar (components/dashboard/sidebar.tsx)
│   ├── DashboardHeader (components/dashboard/header.tsx)
│   └── Page Content
│       ├── Dashboard Home
│       │   ├── WelcomeHero
│       │   └── SetupProgress
│       ├── Products Page
│       ├── Orders Page
│       ├── Customers Page
│       ├── Online Store Page
│       ├── Shipping Page
│       ├── Payments Page
│       ├── Settings Page
│       └── AI Page
│           └── AIChat
```

## Authentication & Authorization

**Current Status**: Not implemented (bypass in place)

TODO: Implement proper authentication with:
- Email/password registration and login
- Session management with HTTP-only cookies
- Protected routes (redirect to /login if not authenticated)
- User context provider for accessing current user

See `/docs/features/AUTH.md` when implementing.

## Storage Utilities Pattern

### CRUD Operations

All storage operations use the `storage` utility object:

```typescript
// Create
const product = storage.create('products', {
  name: 'T-Shirt',
  price: 500,
  // ... other fields
});

// Read
const products = storage.getAll<Product>('products');
const product = storage.getById<Product>('products', productId);

// Update
storage.update('products', updatedProduct);

// Delete
storage.delete('products', productId);
```

### Component Integration Example

```typescript
'use client';
import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';

export function ProductsPage() {
  // Load from localStorage on mount
  const [products, setProducts] = useState<Product[]>(() => {
    return storage.getAll<Product>('products');
  });

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const created = storage.create('products', newProduct);
    setProducts(prev => [...prev, created]);
  };

  const deleteProduct = (id: string) => {
    storage.delete('products', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Component JSX...
}
```

## Navigation Pattern

All navigation uses Next.js Link components for soft page transitions:

```typescript
import Link from 'next/link';

<Link href="/dashboard/products">
  <Button>View Products</Button>
</Link>
```

This provides automatic soft refreshes without full page reloads.

## Form Pattern

Forms use controlled components with validation:

```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  if (!formData.name) newErrors.name = 'Name is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Process form...
};
```

## Modal Pattern

Modals are controlled by parent component state:

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

<AddProductModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onProductAdded={(product) => {
    setProducts(prev => [...prev, product]);
  }}
/>
```

## Filter & Search Pattern

Filters and search are applied to displayed data without modifying localStorage:

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('All');

const filtered = products.filter(p => {
  const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

## Error Handling

All storage operations include try-catch:

```typescript
try {
  const item = storage.getById('products', id);
  // Use item
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error
  alert('Failed to load product. Please refresh and try again.');
}
```

## Performance Considerations

1. **localStorage Limits**: ~5-10MB per domain (monitor usage)
2. **Initial Load**: getAll() loads all items (optimize with pagination)
3. **Re-renders**: Use React.memo for large lists
4. **Search/Filter**: Apply client-side only (don't modify localStorage)

## Testing Strategy

- Test localStorage CRUD operations
- Test form validation
- Test modal open/close
- Test filters and search
- Test soft navigation

## Future Enhancements

1. Implement backend API integration
2. Add real authentication
3. Add payment gateway integration
4. Implement real-time notifications
5. Add analytics and reporting
6. Add image upload to cloud storage
7. Add email notifications
8. Add multi-language support

## Deployment Checklist

- [ ] Test all CRUD operations
- [ ] Verify localStorage quotahandling
- [ ] Test all forms and validations
- [ ] Test all navigation links
- [ ] Verify responsive design
- [ ] Test AI chat functionality
- [ ] Clear debug console.logs
- [ ] Update environment variables
- [ ] Create database/API documentation
