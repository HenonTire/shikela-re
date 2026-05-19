# Shikela Developer Guide

## Quick Start for Developers

### Project Overview
Shikela is a multi-role e-commerce platform built with Next.js 16, React, and TypeScript. It currently uses localStorage for data persistence and is structured for easy backend integration.

### Three User Roles

#### 1. Store Owner
**Dashboard**: `/dashboard`
- **Key Files**: 
  - `app/dashboard/products/page.tsx` - Product management
  - `app/dashboard/orders/page.tsx` - Order management
  - `app/dashboard/customers/page.tsx` - Customer database
  - `app/dashboard/online-store/` - Storefront management

- **Components**:
  - `components/dashboard/sidebar.tsx` - Navigation
  - `components/dashboard/header.tsx` - Top bar
  - `components/dashboard/modals/*` - Forms and dialogs

- **Key Features**:
  - CSV import for bulk product uploads
  - Dropshipping integration with suppliers
  - Online store builder with drag-and-drop UI
  - Theme selection (4 themes available)
  - Public storefront at `/store/[storeId]`

#### 2. Supplier
**Dashboard**: `/supplier`
- **Key Files**:
  - `app/supplier/products/page.tsx` - Manage supplier inventory
  - `app/supplier/orders/page.tsx` - Orders from stores
  - `app/supplier/deliveries/page.tsx` - Shipment tracking
  - `app/supplier/settings/page.tsx` - Account settings

- **Components**:
  - `components/supplier/sidebar.tsx` - Navigation
  - `components/supplier/header.tsx` - Top bar

#### 3. Courier (NEW)
**Dashboard**: `/courier`
- **Key Files**:
  - `app/courier/dashboard/page.tsx` - Overview and stats
  - `app/courier/deliveries/page.tsx` - Delivery management
  - `app/courier/earnings/page.tsx` - Income tracking
  - `app/courier/messages/page.tsx` - Communication
  - `app/courier/profile/page.tsx` - Profile information
  - `app/courier/settings/page.tsx` - Account preferences

- **Components**:
  - `components/courier/sidebar.tsx` - Navigation
  - `components/courier/header.tsx` - Top bar

---

## Authentication Flow

### Registration
```
/register (role selection)
  ↓
/register/email (store owner) OR
/register/supplier (supplier) OR  
/register/courier (courier)
  ↓
Create account in localStorage
  ↓
Redirect to dashboard
```

### Login
```
/login
  ↓
Check email in localStorage['suppliers'] or localStorage['couriers']
  ↓
Set userRole, userId, userEmail in localStorage
  ↓
Redirect to appropriate dashboard
```

### Code Example
```typescript
// Check user role and redirect
const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
const isCourier = suppliers.some(s => s.email === email);

if (isCourier) {
  localStorage.setItem('userRole', 'courier');
  router.push('/courier/dashboard');
}
```

---

## Data Management

### localStorage Keys

**Store Owner:**
- `products` - Array of Product objects
- `orders` - Array of Order objects
- `customers` - Array of Customer objects
- `storeSettings` - StoreSettings object
- `shippingZones` - Array of ShippingZone objects
- `paymentMethods` - Array of PaymentMethod objects

**Supplier:**
- `suppliers` - Array of Supplier objects
- `supplierOrders` - Array of SupplierOrder objects

**Courier:**
- `couriers` - Array of Courier objects
- `deliveries` - Array of Delivery objects
- `courierEarnings` - Array of CourierEarnings objects
- `deliveryMessages` - Array of DeliveryMessage objects

**Session:**
- `userRole` - 'store_owner' | 'supplier' | 'courier'
- `userEmail` - User email address
- `storeId` - Store owner store ID
- `supplierId` - Supplier ID
- `courierId` - Courier ID

### Storage Service Usage

Located in `lib/storage.ts`. Provides type-safe CRUD operations:

```typescript
import { storage } from '@/lib/storage';
import { Product } from '@/lib/types';

// Get all products
const products = storage.getAll<Product>('products');

// Get single item
const product = storage.getById<Product>('products', productId);

// Create
const newProduct = storage.create('products', {
  name: 'T-Shirt',
  price: 500,
  // ... other fields
});

// Update
storage.update('products', { ...product, price: 600 });

// Delete
storage.delete('products', productId);

// Filter
const active = storage.filter<Product>('products', p => p.status === 'Active');

// Count
const total = storage.count('products');

// Check exists
const exists = storage.exists('products', productId);
```

---

## Component Architecture

### Page Components Pattern

```typescript
'use client'; // Client-side rendering

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';

export default function ExamplePage() {
  const [items, setItems] = useState([]);

  // Load data on mount
  useEffect(() => {
    const data = storage.getAll('items');
    setItems(data);
  }, []);

  // Render UI
  return (
    <div>
      {items.map(item => (
        <Card key={item.id}>
          {/* Item content */}
        </Card>
      ))}
    </div>
  );
}
```

### Modal Components Pattern

```typescript
interface ExampleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExampleData) => void;
}

export function ExampleModal({ open, onOpenChange, onSubmit }: ExampleModalProps) {
  const [data, setData] = useState<ExampleData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Type System

### Key Types in `lib/types.ts`

**Product**
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;          // In ETB
  stock: number;
  sales: number;
  revenue: string;        // Formatted "1,200ETB"
  status: 'Active' | 'Draft' | 'Low';
  image: string;          // Base64 or URL
  description?: string;
  createdAt: string;      // ISO date
  updatedAt: string;
  
  // Dropshipping fields
  dropshipped?: boolean;
  supplierId?: string;
  wholesalePrice?: number;
  markup?: number;        // Percentage
}
```

**Order**
```typescript
interface Order {
  id: string;
  customerName: string;
  email: string;
  items: string;          // "2x T-Shirt, 1x Jeans"
  amount: string;         // In ETB
  status: 'New' | 'Processing' | 'Completed';
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  deliveryOption: string;
  createdAt: string;
}
```

**Delivery (Courier)**
```typescript
interface Delivery {
  id: string;
  courierId: string;
  orderId: string;
  storeOwnerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryFee: number;    // In ETB
  status: 'Pending' | 'Assigned' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Failed' | 'Cancelled';
  notes?: string;
  proofOfDelivery?: string;
  assignedAt: string;
  completedAt?: string;
  latitude?: number;
  longitude?: number;
}
```

See `lib/types.ts` for complete type definitions.

---

## Common Patterns

### Form Handling

```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (!formData.name || !formData.email) {
    alert('All fields required');
    return;
  }

  // Save
  const newItem = storage.create('items', formData);
  
  // Update UI
  setItems(prev => [...prev, newItem]);
};
```

### Filtering & Searching

```typescript
const [searchTerm, setSearchTerm] = useState('');

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Status Management

```typescript
const activeDeliveries = deliveries.filter(
  d => !['Delivered', 'Failed', 'Cancelled'].includes(d.status)
);

const completedDeliveries = deliveries.filter(
  d => ['Delivered', 'Failed', 'Cancelled'].includes(d.status)
);
```

---

## Adding New Features

### Step 1: Define Types
```typescript
// In lib/types.ts
export interface NewFeature {
  id: string;
  name: string;
  // ... properties
}
```

### Step 2: Create Page
```typescript
// In app/role/feature/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { NewFeature } from '@/lib/types';

export default function FeaturePage() {
  const [items, setItems] = useState<NewFeature[]>([]);

  useEffect(() => {
    const data = storage.getAll<NewFeature>('features');
    setItems(data);
  }, []);

  return (
    // Page content
  );
}
```

### Step 3: Create Components
```typescript
// In components/feature/component.tsx
export function FeatureComponent() {
  return (
    // Component content
  );
}
```

### Step 4: Update Constants (if needed)
```typescript
// In lib/constants.ts
export const FEATURE_OPTIONS = [
  { id: 'option1', label: 'Option 1' },
  // ...
];
```

---

## Backend Integration

### Current vs. Future

**Current (localStorage):**
```typescript
const products = storage.getAll<Product>('products');
storage.create('products', newProduct);
```

**Future (with API):**
```typescript
const response = await fetch('/api/products');
const products = await response.json();

const newResponse = await fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify(newProduct),
});
```

### Preparing for Backend

1. **API Routes** - Structure already in place at `/api`
2. **Type Safety** - All interfaces defined in `lib/types.ts`
3. **Separation** - Storage logic isolated in `lib/storage.ts`
4. **Error Handling** - Use try-catch for all operations

### Migration Steps

1. Create API routes in `/api` directory
2. Replace `storage.*` calls with `fetch()` requests
3. Add error handling for network failures
4. Implement token-based authentication
5. Add request/response validation

---

## Debugging

### Enable Debug Logging

Add console logs with `[v0]` prefix:
```typescript
console.log('[v0] Loading couriers:', couriers);
console.log('[v0] Delivery status updated:', delivery.id, status);
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('couriers')  // View courier data
localStorage.getItem('userRole')  // Check current role
```

### Network Requests (Future)
```typescript
fetch('/api/endpoint', { method: 'GET' })
  .then(r => r.json())
  .then(data => console.log('[v0] API Response:', data))
  .catch(e => console.error('[v0] API Error:', e));
```

---

## Testing

### Manual Testing Checklist

**Registration:**
- [ ] Can create store owner account
- [ ] Can create supplier account
- [ ] Can create courier account
- [ ] Email field validates correctly
- [ ] Phone field validates correctly

**Login:**
- [ ] Store owner redirects to `/dashboard`
- [ ] Supplier redirects to `/supplier/dashboard`
- [ ] Courier redirects to `/courier/dashboard`
- [ ] Session persists on reload

**CRUD Operations:**
- [ ] Can create new items
- [ ] Can read/view items
- [ ] Can update items
- [ ] Can delete items
- [ ] Changes persist in localStorage

**Role-Based Access:**
- [ ] Store owner can't access `/supplier`
- [ ] Supplier can't access `/courier`
- [ ] Courier can't access `/dashboard`

---

## Performance Tips

### Optimization Patterns

```typescript
// Bad: Creating new array reference on every render
const active = items.filter(i => i.status === 'active');

// Good: Use useMemo
const active = useMemo(() => 
  items.filter(i => i.status === 'active'),
  [items]
);
```

### Pagination (Future Implementation)
```typescript
const itemsPerPage = 10;
const currentPage = 1;

const paginated = items.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

---

## Troubleshooting

### Issue: Data not persisting
- **Check**: localStorage is enabled in browser
- **Check**: Key name matches exactly
- **Check**: Using `storage.create()` or `storage.update()`

### Issue: Wrong dashboard on login
- **Check**: User email exists in correct localStorage key
- **Check**: `userRole` is set correctly
- **Check**: Router redirect path is correct

### Issue: Component not updating
- **Check**: Using `useState` for state
- **Check**: `setItems()` called after data changes
- **Check**: `useEffect` dependency array is correct

---

## Resources

- **Architecture**: See `ARCHITECTURE.md`
- **Types**: See `lib/types.ts`
- **Storage**: See `lib/storage.ts`
- **Components**: See `components/ui/` (shadcn/ui)

---

## Contributing

### Code Style
- Use TypeScript for all code
- Add JSDoc comments to functions
- Keep components under 300 lines
- Use semantic HTML elements
- Follow existing patterns

### Git Workflow
1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push and create PR
4. Address review comments

---

Last Updated: April 2026
