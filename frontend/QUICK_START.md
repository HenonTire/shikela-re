# Shikela Quick Start Guide

Get the Shikela e-commerce dashboard up and running in 5 minutes!

## 🚀 One-Minute Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open in browser
open http://localhost:3000/dashboard
```

That's it! The dashboard is ready to use.

## 📍 Key Pages to Visit

After starting the dev server, explore these pages:

### Dashboard Home
**http://localhost:3000/dashboard**
- Welcome message and setup progress tracker
- Quick links to all features
- Feature unlock cards

### Products (`/dashboard/products`)
- ➕ Add, edit, delete products
- 🔍 Search by name
- 🏷️ Filter by status (Active, Draft, Low Stock)
- 📊 Real-time inventory statistics

### Orders (`/dashboard/orders`)
- 📦 View all customer orders
- 📊 Revenue analytics chart
- 🔍 Search orders by ID or customer name
- 📈 Activity metrics (new, processing, completed)

### Customers (`/dashboard/customers`)
- 👥 Complete customer database
- 🔍 Search by name, email, or location
- 💰 Track customer spending
- 🏆 Customer segmentation (VIP, Regular, New)

### Online Store (`/dashboard/online-store`)
- 🎨 Select from 4 themes
- 🌐 Configure custom domain
- 📱 View store preview
- 📝 Manage store pages and inventory

### Shipping (`/dashboard/shipping`)
- ✈️ Create delivery zones
- 💵 Set shipping rates
- 📅 Define estimated delivery times
- 🤝 Courier integration options

### Payments (`/dashboard/payments`)
- 💳 Setup payment gateways
- 📊 Track revenue and payouts
- 🔗 Integrate Telebirr, CBE Birr, HelloCash
- 💰 Manage commission rates

### Settings (`/dashboard/settings`)
- 🏢 Store information
- 👤 Account management
- 🔔 Notification preferences
- 📋 Store policies

### Notifications (`/dashboard/notifications`)
- 🔔 Configure alert types
- ✉️ Toggle email notifications
- 🔊 Toggle push notifications
- ⚙️ Customize preferences

### AI Assistant (`/dashboard/ai`)
- 🤖 Chat with Shikela AI
- 💬 Get store management help
- 📝 Persistent chat history

## 💡 Common Tasks

### Add Your First Product

1. Click **Products** in sidebar
2. Click **+ Add Product** button
3. Fill in:
   - Product name: "My First Product"
   - Category: "Fashion"
   - Price: "500"
   - Stock: "50"
4. Click **Create Product**
5. See it appear in your product list!

### Create a Shipping Zone

1. Go to **Shipping** page
2. Click **+ Add Zone**
3. Enter:
   - Zone name: "Addis Ababa"
   - Regions: "Addis Ababa"
   - Rate: "50"
   - Days: "1"
4. Click **Add Zone**
5. Your shipping zone is created!

### Setup Payment Method

1. Navigate to **Payments**
2. Click **Setup** on Telebirr, CBE Birr, or HelloCash
3. Enter merchant credentials
4. Connection automatically updates status
5. Start accepting payments!

### Configure Online Store

1. Go to **Online Store**
2. Select your preferred theme
3. Click **Edit** on domain section
4. Enter custom domain (optional)
5. Click **Save Domain**
6. Visit your store via link

## 🎯 Pre-loaded Test Data

The app comes with sample data to explore:

### Products
- Elegant Luxury Bag (1,200 ETB) - 300 in stock
- Earpods (800 ETB) - 50 in stock
- Sneakers (800 ETB) - 30 in stock
- Smart Watch (650 ETB) - 67 in stock

### Orders (4 sample orders)
- Order #1034: Completed, 1,200 ETB
- Order #1007: Processing, 800 ETB
- Order #1004: Completed, 4,000 ETB
- Order #1008: Processing, 300 ETB

### Customers (4 sample customers)
- Mahlet Tesfaye (VIP) - 30 orders
- Dawit Salamon (Regular) - 28 orders
- Sara Bekele (Regular) - 13 orders
- Fitsum Amara (New) - 20 orders

### Shipping Zones (2 pre-configured)
- Addis Ababa: 50 ETB, 1 day
- Regional Areas: 100 ETB, 3 days

### Payment Methods (3 integrated)
- Telebirr: Connected
- CBE Birr: Connected
- HelloCash: Disconnected

## 🔄 Daily Seller Workflow

**Morning**
1. Check **Dashboard** for overnight stats
2. Go to **Orders** to see new orders
3. Update order status as shipped

**Afternoon**
1. Click **Customers** to review new buyers
2. Visit **Online Store** to check sales page
3. Review **Products** for low stock alerts

**Evening**
1. Check **Payments** for day's revenue
2. Review setup progress in Dashboard
3. Use **Shikela AI** for any questions

## 📊 Understanding Setup Progress

The setup tracker shows 4 critical tasks:

1. **Products** - Add products to inventory
   - Status: Completes when you visit /products
2. **Payments** - Setup payment methods
   - Status: Completes when you visit /payments
3. **Shipping** - Configure delivery zones
   - Status: Completes when you visit /shipping
4. **Online Store** - Launch your store
   - Status: Completes when you visit /online-store

Progress bar fills automatically as you complete each task!

## 🛠️ Developer Tips

### Using localStorage

```typescript
import { storage } from '@/lib/storage';

// Add item
storage.create('products', newProduct);

// Get all items
const products = storage.getAll('products');

// Update item
storage.update('products', updatedProduct);

// Delete item
storage.delete('products', productId);

// Clear collection
storage.clear('products');
```

### Debugging in Browser Console

```javascript
// View all data
Object.keys(localStorage)

// Get specific data
JSON.parse(localStorage.getItem('products'))

// Add test product
localStorage.setItem('products', JSON.stringify([{id:'1', name:'Test'}]))

// Clear all data
localStorage.clear()
```

### Hot Reload in Development

- Edit any file and save
- Browser automatically refreshes
- Changes appear instantly
- State resets (intended)

### Build for Production

```bash
# Optimize build
pnpm build

# Start production server
pnpm start

# Check bundle size
pnpm analyze  # if analyzer installed
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
pnpm dev -- -p 3001
```

### Data Not Persisting
- Check DevTools (F12) → Application → Local Storage
- Ensure localStorage is enabled in browser
- Try incognito/private window
- Check browser privacy settings

### Styles Not Loading
```bash
pnpm install
pnpm dev
```

### Search Not Working
- Ensure data exists (check in localStorage)
- Clear browser cache
- Check console for errors (F12)

### Modal Won't Close
- Click outside modal or Cancel button
- Check console for JavaScript errors
- Refresh page if stuck

## 📚 File Organization

**Core Files:**
- `lib/storage.ts` - Data persistence utilities
- `lib/types.ts` - TypeScript definitions
- `lib/constants.ts` - Default test data
- `components/dashboard/sidebar.tsx` - Navigation menu
- `components/dashboard/header.tsx` - Top bar
- `app/dashboard/*/page.tsx` - Feature pages

**Page Structure:**
Each feature follows this pattern:
1. State management with React hooks
2. Data retrieval from localStorage
3. CRUD operations
4. Real-time search/filtering
5. Responsive UI with Tailwind CSS

## 🎓 Learning Paths

**Beginner (30 min)**
- [ ] Explore all dashboard pages
- [ ] Add 5+ test products
- [ ] Create 2 shipping zones
- [ ] Configure payment method
- [ ] Customize online store

**Intermediate (2 hours)**
- [ ] Edit existing components
- [ ] Add new product fields
- [ ] Modify table columns
- [ ] Update styling/colors
- [ ] Add form validation

**Advanced (6+ hours)**
- [ ] Add API integration
- [ ] Implement backend database
- [ ] Build mobile app
- [ ] Add real-time features
- [ ] Deploy to production

## 🎯 Feature Checklist

Before deployment, verify:
- [ ] All 9 dashboard pages work
- [ ] Search/filtering on each page
- [ ] Data persists after refresh
- [ ] Add/Edit/Delete operations work
- [ ] Responsive on mobile (F12 device toolbar)
- [ ] No console errors (F12 console tab)
- [ ] Navigation links work
- [ ] Setup progress auto-completes
- [ ] localStorage data exports

## 📖 Additional Resources

**Documentation Files:**
- `README.md` - Full user guide
- `docs/FINAL_IMPLEMENTATION.md` - Complete feature list
- `docs/ARCHITECTURE.md` - System design
- `docs/IMPLEMENTATION_GUIDE.md` - Developer guide

**External Resources:**
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [shadcn/ui](https://ui.shadcn.com)

## 💬 Getting Help

1. Check documentation in `/docs` folder
2. Read comments in source code
3. Use browser DevTools (F12)
4. Ask Shikela AI from dashboard
5. Check GitHub issues

## 🎉 Next Steps

1. ✅ Explore all pages with test data
2. ✅ Add your own products and orders
3. ✅ Configure shipping and payments
4. ✅ Customize online store
5. ✅ Read docs/ documentation
6. ✅ Plan next features
7. ✅ Deploy to production!

## 🚀 Time to First Feature

- **View Dashboard**: 1 minute
- **Add Product**: 2 minutes
- **Create Order**: 3 minutes
- **Configure Shipping**: 5 minutes
- **Setup Payments**: 5 minutes
- **Customize Store**: 5 minutes

**Total: 21 minutes to a fully functional dashboard!**

---

**Pro Tips:**
- Use incognito mode for testing without cached data
- Export data before major changes: `JSON.stringify(localStorage)`
- Use AI assistant for feature questions
- Check console (F12) for helpful error messages
- Mobile test with device toolbar (Ctrl+Shift+M)

**Ready to build? Start with `/dashboard` now! 🚀**
