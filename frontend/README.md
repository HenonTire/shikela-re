# Shikela - Multi-Role E-Commerce Platform

A complete, production-ready multi-role e-commerce platform for Ethiopian merchants. Three distinct user roles work together:
- **Store Owners**: Manage products, orders, customers, and online stores
- **Suppliers**: Supply products through dropshipping integration
- **Couriers**: Handle deliveries with real-time tracking and earnings management

All in one integrated platform with role-based dashboards.

## Platform Overview

### 🏪 Store Owner Dashboard
Manage your e-commerce business with a complete dashboard featuring products, orders, customers, shipping, and payments.

### 🏢 Supplier Portal
Supply products to multiple stores through dropshipping with order management and delivery tracking.

### 🚚 Courier Dashboard (NEW)
Handle deliveries, track earnings, communicate with stores/customers, and manage your delivery profile.

## Features

### Store Owner Features

#### 🛍️ Product Management
- Create, edit, and delete products with rich details
- Track inventory and stock levels
- Categorize products and set prices in ETB
- Search and filter by status (Active, Draft, Low Stock)
- Bulk actions and duplicate products
- Real-time inventory analytics

### 📦 Order Management
- Track all customer orders with detailed information
- Monitor order status (New, Processing, Completed)
- Search orders by ID, customer name, or items
- Revenue analytics and charts
- Payment status tracking
- Delivery option management

### 👥 Customer Management
- Complete customer database with contact information
- Search and filter customers
- Track customer lifetime value and order history
- Customer segmentation (VIP, Regular, New)
- Customer insights and analytics

### 🏪 Online Store
- Multiple theme options for store customization
- Custom domain configuration
- Search engine optimization preview
- Direct link to view online store
- Page management and inventory sync controls

### 📦 Shipping Management
- Create and manage shipping zones
- Configure delivery rates and estimated delivery times
- Support for multiple regions
- Enable/disable shipping zones on demand
- Courier integration options (Telebirr, CBE Birr, HelloCash)

### 💳 Payment Methods
- Setup and manage payment gateways
- Integration with Ethiopian payment providers:
  - Telebirr (Mobile money)
  - CBE Birr (Bank transfers)
  - HelloCash (Digital wallet)
- Track payment commission rates
- Revenue and payout tracking
- Payout settings configuration

### 🔔 Notifications
- Customizable notification preferences
- Email and push notification toggles
- Order notifications
- Customer message alerts
- Inventory alerts
- System notifications

### ⚙️ Settings
- Store information management
- Account settings and password management
- Notification preferences
- Store policies (return, privacy, terms)
- Persistent settings across sessions

### 🤖 Shikela AI Assistant
- Interactive AI chat for store management help
- Conversation history persistence
- Quick suggestion buttons
- Answer questions about products, orders, shipping, payments

### 📊 Dashboard Analytics
- Welcome hero with quick actions
- Setup progress tracker with auto-completion
- Revenue charts and metrics
- Order activity overview
- Feature unlock cards

### Courier Features

#### 🚚 Delivery Management
- View assigned deliveries with detailed information
- Real-time status tracking (Assigned → PickedUp → InTransit → Delivered)
- Customer contact information and delivery addresses
- Delivery fee tracking and transparency
- Order notes and special instructions
- Proof of delivery uploads

#### 💰 Earnings Dashboard
- Daily earnings tracking with real-time updates
- Monthly earnings breakdown by delivery
- Payout history and status management
- Total earnings and pending payout amounts
- Commission structure display
- Request payout functionality

#### 📨 Messaging System
- Communicate with stores and customers
- Message history and conversation tracking
- Real-time message notifications
- Quick delivery status updates

#### 👤 Profile Management
- Public profile with ratings and reviews
- Vehicle information and documentation
- Service area management
- Performance metrics display
- Verification document tracking
- Status availability toggle (Online/Offline)

#### ⚙️ Settings
- Notification preferences (deliveries, messages, payouts)
- Bank account details for payouts
- Two-factor authentication setup
- Password management
- Account security controls

### Supplier Features
- Complete inventory management
- Order management from multiple stores
- Delivery tracking and fulfillment
- Performance analytics
- Account settings and integrations

## Tech Stack

- **Frontend Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Hooks + localStorage
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shikela.git
cd shikela
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
shikela/
├── app/
│   ├── dashboard/                 # Store owner routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── products/page.tsx      # Products management
│   │   ├── orders/page.tsx        # Orders tracking
│   │   ├── customers/page.tsx     # Customer database
│   │   ├── online-store/page.tsx  # Store customization
│   │   ├── shipping/page.tsx      # Shipping configuration
│   │   ├── payments/page.tsx      # Payment methods
│   │   ├── notifications/page.tsx # Notification settings
│   │   ├── settings/page.tsx      # Account settings
│   │   └── ai/page.tsx            # AI assistant
│   │
│   ├── supplier/                  # Supplier routes
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── deliveries/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── courier/                   # Courier routes (NEW)
│   │   ├── dashboard/page.tsx     # Overview and stats
│   │   ├── deliveries/page.tsx    # Delivery management
│   │   ├── earnings/page.tsx      # Income tracking
│   │   ├── messages/page.tsx      # Communication
│   │   ├── profile/page.tsx       # Profile & ratings
│   │   └── settings/page.tsx      # Preferences
│   │
│   ├── store/[storeId]/           # Public storefronts
│   ├── login/page.tsx
│   ├── register/
│   └── page.tsx
│
├── components/
│   ├── dashboard/                 # Store owner components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── welcome-hero.tsx
│   │   ├── setup-progress.tsx
│   │   ├── ai-chat.tsx
│   │   ├── product-action-menu.tsx
│   │   └── modals/
│   │
│   ├── supplier/                  # Supplier components
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── courier/                   # Courier components (NEW)
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── auth/                      # Authentication
│   └── ui/                        # shadcn/ui base components
│
├── lib/
│   ├── types.ts                   # TypeScript definitions
│   ├── storage.ts                 # localStorage utilities
│   ├── constants.ts               # Default data
│   └── utils.ts
│
├── public/
│   └── images/
│
├── docs/ & guides/
│   ├── ARCHITECTURE.md            # System architecture
│   ├── DEVELOPER_GUIDE.md         # Development patterns
│   └── README.md                  # This file
│
└── package.json
```

## Usage

### Getting Started

#### 1. Registration
```
Visit /register
↓
Select your role:
  • Store Owner → Create online store
  • Supplier → Supply products to stores
  • Courier → Handle deliveries
↓
Complete the registration form with email and details
↓
Automatically redirected to your role-based dashboard
```

#### 2. Login
```
Visit /login
↓
Enter your email address
↓
System automatically detects your role
↓
Redirected to appropriate dashboard
```

### Store Owner Workflow

#### Adding a Product

1. Navigate to **Products** page
2. Click **+ Add Product** button
3. Fill in product details:
   - Product name
   - Category
   - Price (in ETB)
   - Stock quantity
   - Product image
4. Click **Create Product**
5. Product appears in inventory list

#### Managing Orders

1. Go to **Orders** page
2. View all customer orders with:
   - Order number
   - Customer details
   - Items ordered
   - Order status
   - Payment status
3. Use search to find specific orders
4. Click on order to view details

#### Configuring Shipping

1. Navigate to **Shipping** page
2. Click **+ Add Zone** to create shipping area
3. Set zone details:
   - Zone name
   - Regions covered
   - Shipping rate (ETB)
   - Estimated delivery days
4. Save and activate zone

#### Setup Wizard

First-time users see the Setup Progress tracker:
1. ✅ Add Products - Create at least one product
2. ✅ Configure Payments - Setup payment methods
3. ✅ Set Shipping Options - Define delivery zones
4. ✅ Launch Online Store - Customize and publish store

Tasks auto-complete when you visit their respective pages!

### Courier Workflow

#### Managing Deliveries

1. Go to **Deliveries** page
2. View all assigned deliveries
3. Update status as you progress:
   - **PickedUp** - Collected item from store
   - **InTransit** - On the way to customer
   - **Delivered** - Successfully delivered
   - **Failed** - Could not deliver
4. Add delivery notes and proof of delivery

#### Tracking Earnings

1. Navigate to **Earnings** page
2. View earnings breakdown by month
3. Check payout history
4. Request payouts when ready
5. Configure bank details in **Settings**

#### Communicating with Customers

1. Go to **Messages** page
2. Select a delivery conversation
3. Send real-time messages
4. Provide delivery updates
5. Answer customer questions

## Data Persistence

All data is stored in the browser's localStorage:
- Products, orders, customers
- Shipping zones and payment methods
- Settings and preferences
- Chat history

**Note**: Data is stored locally. To backup:
1. Use browser developer tools (F12)
2. Go to Storage → Local Storage
3. Export data for backup

For production use, consider migrating to a backend database like Supabase.

## Environment Variables

No environment variables required for basic setup. For production with backend:

```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

## API Integration Ready

The application is structured to easily add API integration:

1. Replace localStorage calls in `lib/storage.ts`
2. Add API routes in `app/api/`
3. Update components to use fetch/axios
4. Implement proper error handling

## Customization

### Changing Colors
Edit `app/globals.css` and update Tailwind color variables.

### Adding New Pages
1. Create new folder in `app/dashboard/[feature]/`
2. Add `page.tsx` with your content
3. Update navigation in `components/dashboard/sidebar.tsx`
4. Link in header if needed

### Modifying Sidebar
Edit `components/dashboard/sidebar.tsx` navigation array.

## Performance Tips

- Products list uses client-side filtering (fast for <1000 items)
- For large datasets, implement pagination
- Consider IndexedDB for larger data storage
- Use React memo for expensive components

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Data Not Persisting
- Check browser storage is enabled
- Clear cache and reload
- Check localStorage in DevTools

### Styles Not Loading
```bash
pnpm install
pnpm dev
```

### Search Not Working
- Ensure you're on the correct page
- Check data exists in localStorage
- Try clearing filters

## Contributing

Contributions welcome! Please:
1. Create feature branch
2. Make your changes
3. Submit pull request
4. Include description of changes

## Roadmap

### Phase 1 (Current) ✅
- ✅ Store Owner Dashboard (Products, Orders, Customers)
- ✅ Online Store Builder
- ✅ Supplier Portal
- ✅ Courier Dashboard & Delivery Management
- ✅ Multi-role authentication
- ✅ Earnings tracking for couriers
- ✅ localStorage persistence

### Phase 2 (Planned)
- [ ] Backend API integration (Node.js/Express)
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] Real-time WebSocket updates
- [ ] Payment processing integration
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] GPS tracking for deliveries
- [ ] Multi-store support
- [ ] Inventory forecasting
- [ ] Marketing automation
- [ ] Team collaboration features

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/shikela/issues)
- Email: support@shikela.com
- Documentation: See `/docs` folder

## Credits

Built with:
- Next.js and React community
- Tailwind CSS
- shadcn/ui components
- Recharts
- Lucide icons

## Changelog

### v1.0.0 (Current)
- ✅ Complete product management system
- ✅ Order tracking and management
- ✅ Customer database
- ✅ Online store customization
- ✅ Shipping configuration
- ✅ Payment gateway setup
- ✅ Notification management
- ✅ Settings and preferences
- ✅ AI assistant integration
- ✅ Setup wizard with auto-completion
- ✅ localStorage persistence
- ✅ Full TypeScript coverage

---

**Made for Ethiopian Merchants** 🇪🇹

Start selling online with Shikela today!

For more information, visit [shikela.com](https://shikela.com)
