# Shikela Platform - Complete Architecture & Documentation

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [User Roles & Features](#user-roles--features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Models](#data-models)
6. [Authentication Flow](#authentication-flow)
7. [Storage & State Management](#storage--state-management)
8. [Component Architecture](#component-architecture)
9. [API Integration Points](#api-integration-points)
10. [Deployment & Environment](#deployment--environment)

---

## Platform Overview

Shikela is a multi-role e-commerce platform enabling three distinct user types:
- **Store Owners**: Create and manage online stores
- **Suppliers**: Supply products to store owners (dropshipping)
- **Couriers**: Handle order deliveries and logistics

The platform is built with Next.js 16, React, TypeScript, and Tailwind CSS, with localStorage-based persistence for MVP/demo purposes. It's structured for seamless backend integration.

### Core Principles
- **Multi-tenancy**: Each user role has isolated dashboards and data
- **Separation of Concerns**: Clear UI, business logic, and storage layers
- **Type Safety**: Full TypeScript coverage across all components
- **Scalability**: Designed for transition from localStorage to real backend

---

## User Roles & Features

### 1. Store Owner Dashboard
**Location**: `/dashboard/*`

#### Features
- **Products Management** (`/dashboard/products`)
  - Add/edit/delete products
  - CSV bulk import
  - Inventory management with stock tracking
  - Dropshipping integration with suppliers
  - Product categorization

- **Orders Management** (`/dashboard/orders`)
  - Order tracking (New → Processing → Completed)
  - Payment status monitoring
  - Customer communication
  - Delivery assignment to couriers

- **Customers** (`/dashboard/customers`)
  - Customer database with purchase history
  - Segmentation (VIP, Regular, New)
  - Contact information management

- **Online Store** (`/dashboard/online-store`)
  - Theme selection (Shikela, Minimal, Bright, Dark)
  - Drag-and-drop UI builder (`/dashboard/online-store/builder`)
  - Page management (`/dashboard/online-store/pages`)
  - Public storefront at `/store/[storeId]`

- **Shipping** (`/dashboard/shipping`)
  - Shipping zone configuration
  - Regional delivery rate setup
  - Delivery time estimation

- **Payments** (`/dashboard/payments`)
  - Payment method configuration
  - Commission tracking
  - Payout history

- **Settings** (`/dashboard/settings`)
  - Store information
  - Account preferences
  - Business policies

#### Authentication
- Registration: Email → Personal Info → Store Details → Dashboard
- Login: Email/Phone → Password → Role-based redirect
- Session: Stored in localStorage (email, role, storeId)

---

### 2. Supplier Dashboard
**Location**: `/supplier/*`

#### Features
- **Products** (`/supplier/products`)
  - Create/manage supplier inventory
  - Stock level management
  - Category organization

- **Orders** (`/supplier/orders`)
  - View orders from store owners
  - Accept/reject orders
  - Track order status
  - Update fulfillment progress

- **Deliveries** (`/supplier/deliveries`)
  - Track outgoing shipments
  - Delivery confirmation
  - Supplier to courier handoff

- **Settings** (`/supplier/settings`)
  - Business information
  - Account management
  - Bank/payout details
  - Category management

#### Authentication
- Registration: Email → Business Details → Categories → Dashboard
- Login: Email → Password → Redirects to `/supplier/dashboard`
- Session: Stored in localStorage (email, role, supplierId)

---

### 3. Courier Dashboard (NEW)
**Location**: `/courier/*`

#### Features
- **Deliveries** (`/courier/deliveries`)
  - Available delivery assignments
  - Active deliveries tracking
  - Delivery status updates
  - Real-time location tracking
  - Proof of delivery collection

- **Earnings** (`/courier/earnings`)
  - Daily/monthly earnings tracking
  - Performance metrics
  - Payout history
  - Commission breakdown

- **Messages** (`/courier/messages`)
  - Communication with store owners
  - Chat with customers
  - Delivery notes

- **Profile** (`/courier/profile`)
  - Courier information
  - Vehicle details
  - Service areas
  - Rating and reviews
  - Document management

- **Settings** (`/courier/settings`)
  - Account preferences
  - Availability management
  - Notification preferences

#### Authentication
- Registration: Email → Personal Info → Vehicle → Service Areas → Dashboard
- Login: Email → Password → Redirects to `/courier/dashboard`
- Session: Stored in localStorage (email, role, courierId)

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State**: React hooks + localStorage

### Backend Integration Ready
- API routes: `/api/*` (structure in place)
- Fetch patterns: Configured for REST endpoints
- Error handling: Implemented
- Request/response types: TypeScript interfaces defined

### Database (Current & Future)
- **Current**: localStorage (browser)
- **Future**: PostgreSQL/MongoDB with backend API

---

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Store owner routes
│   │   ├── page.tsx            # Dashboard home
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   ├── customers/          # Customer database
│   │   ├── online-store/       # Storefront management
│   │   │   ├── builder/        # Drag-and-drop UI builder
│   │   │   ├── pages/          # Page management
│   │   │   └── page.tsx        # Theme selection
│   │   ├── shipping/           # Shipping configuration
│   │   ├── payments/           # Payment setup
│   │   └── settings/           # Store settings
│   ├── supplier/               # Supplier routes
│   │   ├── dashboard/          # Supplier home
│   │   ├── products/           # Supplier inventory
│   │   ├── orders/             # Orders from stores
│   │   ├── deliveries/         # Shipment tracking
│   │   └── settings/           # Supplier settings
│   ├── courier/                # Courier routes (NEW)
│   │   ├── dashboard/          # Courier home
│   │   ├── deliveries/         # Delivery management
│   │   ├── earnings/           # Earnings & payouts
│   │   ├── messages/           # Communication
│   │   ├── profile/            # Profile management
│   │   └── settings/           # Courier settings
│   ├── store/                  # Public storefronts
│   │   └── [storeId]/          # Individual store page
│   ├── login/                  # Login page
│   ├── register/               # Registration flows
│   │   ├── page.tsx           # Role selection
│   │   ├── email/             # Store owner registration
│   │   └── supplier/          # Supplier registration
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                 # Reusable React components
│   ├── auth/                  # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-layout.tsx
│   ├── dashboard/             # Store owner components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── modals/
│   │   │   ├── add-product-modal.tsx
│   │   │   ├── csv-import-modal.tsx
│   │   │   └── dropshipping-modal.tsx
│   │   └── ...other components
│   ├── supplier/              # Supplier components
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── courier/               # Courier components (NEW)
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── ...courier specific
│   └── ui/                    # shadcn/ui base components
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # localStorage utilities
│   ├── constants.ts          # Application constants
│   └── utils.ts              # Helper functions
├── public/                    # Static assets
└── ARCHITECTURE.md           # This file
```

---

## Data Models

### Core Entities

#### 1. Product
```typescript
interface Product {
  id: string;                    // Auto-generated
  name: string;
  category: string;              // "Bags", "Shoes", etc.
  price: number;                 // In ETB
  stock: number;
  sales: number;                 // Units sold
  revenue: string;               // Formatted "1,200ETB"
  status: 'Active' | 'Draft' | 'Low';
  image: string;                 // Base64 or URL
  description?: string;
  createdAt: string;             // ISO date
  updatedAt: string;
  
  // Dropshipping fields
  dropshipped?: boolean;
  supplierId?: string;
  wholesalePrice?: number;
  markup?: number;               // Percentage
}
```

#### 2. Order
```typescript
interface Order {
  id: string;
  customerName: string;
  email: string;
  items: string;                 // "2x T-Shirt, 1x Jeans"
  amount: string;                // In ETB
  status: 'New' | 'Processing' | 'Completed';
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  deliveryOption: string;
  createdAt: string;
}
```

#### 3. Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;                // Total orders placed
  totalSpent: string;            // Formatted
  status: 'VIP' | 'Regular' | 'New';
  createdAt: string;
}
```

#### 4. Supplier
```typescript
interface Supplier {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];          // Product categories
  createdAt: string;
  productsCount: number;
  ordersCount: number;
}
```

#### 5. Courier (NEW)
```typescript
interface Courier {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: 'Motorcycle' | 'Car' | 'Truck';
  vehicleNumber: string;
  serviceAreas: string[];        // Cities/regions
  isActive: boolean;
  rating: number;                // 0-5 stars
  totalDeliveries: number;
  successRate: number;           // Percentage
  profileImage: string;
  createdAt: string;
  idDocumentUrl: string;
}
```

#### 6. Delivery (NEW)
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
  deliveryFee: number;           // In ETB
  status: 'Pending' | 'Assigned' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Failed' | 'Cancelled';
  notes?: string;
  proofOfDelivery?: string;      // Photo URL
  assignedAt: string;
  completedAt?: string;
  latitude?: number;             // For tracking
  longitude?: number;
}
```

---

## Authentication Flow

### Store Owner Registration
1. **Role Selection** (`/register`)
   - User selects "Store Owner"
   - Sets `localStorage.userRole = 'store_owner'`

2. **Email Entry** (`/register/email`)
   - User enters email
   - Uses existing `RegisterForm` component

3. **Account Creation** (`/register/form` or `store`)
   - Personal details (name, phone)
   - Store details (name, business type)
   - Creates entry in `localStorage['storeSettings']`

4. **Redirect**
   - Navigation to `/dashboard`
   - Session loaded from localStorage

### Supplier Registration
1. **Role Selection** (`/register`)
   - User selects "Supplier"
   - Sets `localStorage.userRole = 'supplier'`

2. **Details Form** (`/register/supplier`)
   - Full name, business name
   - Email, phone, address
   - Product categories
   - Creates entry in `localStorage['suppliers']`

3. **Redirect**
   - Navigation to `/supplier/dashboard`
   - Session loaded from localStorage

### Courier Registration (NEW)
1. **Role Selection** (`/register`)
   - User selects "Courier"
   - Sets `localStorage.userRole = 'courier'`

2. **Details Form** (`/register/courier` - TO BUILD)
   - Personal information
   - Vehicle details
   - Service areas
   - Creates entry in `localStorage['couriers']`

3. **Redirect**
   - Navigation to `/courier/dashboard`
   - Session loaded from localStorage

### Login Flow
```
POST /login
├─ Validate email/password
├─ Check user role (localStorage['suppliers'], localStorage['couriers'], etc.)
├─ Set session variables
└─ Redirect to role-specific dashboard
```

---

## Storage & State Management

### localStorage Schema

```javascript
// All keys stored at browser localStorage level
{
  // Store owner data
  'products': Product[],
  'orders': Order[],
  'customers': Customer[],
  'storeSettings': StoreSettings,
  'shippingZones': ShippingZone[],
  'paymentMethods': PaymentMethod[],
  'setupTasks': SetupTask[],
  
  // Supplier data
  'suppliers': Supplier[],
  'supplierOrders': SupplierOrder[],
  
  // Courier data (NEW)
  'couriers': Courier[],
  'deliveries': Delivery[],
  'courierEarnings': CourierEarnings[],
  'deliveryMessages': DeliveryMessage[],
  
  // Session/UI
  'userRole': 'store_owner' | 'supplier' | 'courier',
  'userEmail': string,
  'storeId': string,
  'supplierId': string,
  'courierId': string,
  'selectedTheme': string,
  'storeName': string
}
```

### Storage Service
Located in `lib/storage.ts`, provides type-safe CRUD operations:

```typescript
// Get all items
const products = storage.getAll<Product>('products');

// Create
const newProduct = storage.create('products', productData);

// Update
storage.update('products', updatedProduct);

// Delete
storage.delete('products', productId);

// Filter
const active = storage.filter<Product>('products', p => p.status === 'Active');
```

---

## Component Architecture

### Page Components
- Use `'use client'` directive for client-side rendering
- Fetch data from localStorage on mount
- Manage local state with `useState`
- Share data between components via props

### Modal Components
- Controlled by parent's `useState`
- Props: `open`, `onOpenChange`, `onSubmit`
- Form validation before submission

### Table Components
- Render arrays of items
- Inline actions (edit, delete)
- Search/filter capabilities

### Layout Components
- **DashboardLayout**: Sidebar + Header + Content
- **SupplierLayout**: Supplier-specific layout
- **CourierLayout**: Courier-specific layout (NEW)
- **AuthLayout**: Login/Register pages

---

## API Integration Points

### Ready for Backend Integration

#### Products Endpoint
```typescript
// GET /api/products
// Return: Product[]

// POST /api/products
// Body: Omit<Product, 'id'>
// Return: Product

// PUT /api/products/:id
// Body: Product
// Return: Product

// DELETE /api/products/:id
// Return: { success: boolean }
```

#### Orders Endpoint
```typescript
// GET /api/orders
// GET /api/orders/:id
// POST /api/orders
// PUT /api/orders/:id
// DELETE /api/orders/:id
```

#### Deliveries Endpoint (NEW)
```typescript
// GET /api/deliveries
// GET /api/deliveries/:id
// POST /api/deliveries (assign courier)
// PUT /api/deliveries/:id (update status)
// DELETE /api/deliveries/:id
```

#### Authentication Endpoint
```typescript
// POST /api/auth/register
// Body: { email, password, role, ...details }
// Return: { success, user, token }

// POST /api/auth/login
// Body: { email, password }
// Return: { success, user, token, role }

// POST /api/auth/logout
// Return: { success }
```

### Migration from localStorage to Backend

1. **Create API routes** in `/api` directory
2. **Replace storage.ts calls** with fetch requests
3. **Add error handling** for network failures
4. **Implement token-based auth** (JWT/sessions)
5. **Add request validation** with Zod/TypeScript
6. **Update types** to match backend responses

---

## Deployment & Environment

### Current Setup
- **Hosting**: Vercel (via v0)
- **Package Manager**: pnpm
- **Runtime**: Node.js 18+

### Environment Variables
Currently none required (localStorage-based), but for backend integration:

```env
NEXT_PUBLIC_API_URL=https://api.shikela.com
API_SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:pass@host:5432/shikela
```

### Production Checklist
- [ ] Migrate to real database
- [ ] Implement backend API
- [ ] Add JWT authentication
- [ ] Enable HTTPS/security headers
- [ ] Set up monitoring & logging
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Implement real payment processing
- [ ] Set up real email service
- [ ] Add SMS notifications for couriers

---

## Development Guidelines

### Adding a New Feature

1. **Define Types** in `lib/types.ts`
2. **Add Constants** in `lib/constants.ts` if needed
3. **Create Components** in `components/`
4. **Create Pages** in `app/` using App Router
5. **Add Storage Methods** in `lib/storage.ts`
6. **Document** in JSDoc comments

### Code Style
- Use TypeScript interfaces for all data
- Add JSDoc comments for public APIs
- Use component composition over prop drilling
- Keep pages under 300 lines (split into components)

### Testing
- Test forms with sample data
- Verify localStorage persistence
- Test role-based redirects
- Test CSV import validation

---

## Future Enhancements

### Phase 2: Backend Integration
- PostgreSQL database
- Express/Node backend API
- JWT authentication
- Email verification
- Password reset

### Phase 3: Real-time Features
- WebSocket for live delivery tracking
- Real-time order notifications
- Chat messaging
- Live dashboard updates

### Phase 4: Advanced Features
- Payment processing (Stripe/Telebirr)
- Analytics & reporting
- Automated fulfillment
- Multi-language support
- Mobile apps

---

## Support & Documentation

For questions or issues:
1. Check component JSDoc comments
2. Review types in `lib/types.ts`
3. Check `storage.ts` for data operations
4. Review example implementations in pages

Last Updated: April 2026
