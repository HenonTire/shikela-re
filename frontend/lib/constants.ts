/**
 * @file lib/constants.ts
 * @description Application-wide constants and default values for Shikela
 */

import { SetupTask, ShippingZone, PaymentMethod, Supplier, SupplierOrder } from './types';

/**
 * Default setup tasks shown to new store owners
 * These tasks guide users through the initial store setup process
 */
export const DEFAULT_SETUP_TASKS: SetupTask[] = [
  {
    id: 'products',
    title: 'Find products to sell',
    description: 'Start selling by adding products to your store. Upload photos, set prices in ETB, and add descriptions.',
    completed: false,
    pageUrl: '/dashboard/products',
    icon: 'Package'
  },
  {
    id: 'payments',
    title: 'Set up payments',
    description: 'Connect Telebirr, CBE Birr, or HelloCash to accept payments.',
    completed: false,
    pageUrl: '/dashboard/payments',
    icon: 'CreditCard'
  },
  {
    id: 'shipping',
    title: 'Configure shipping',
    description: 'Set delivery rates for Addis Ababa and regional areas.',
    completed: false,
    pageUrl: '/dashboard/shipping',
    icon: 'Truck'
  },
  {
    id: 'store',
    title: 'Setup your store',
    description: 'Customize and launch your online store',
    completed: false,
    pageUrl: '/dashboard/online-store',
    icon: 'Store'
  }
];

/**
 * Default Ethiopian shipping zones with major regions
 */
export const DEFAULT_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'addis',
    name: 'Addis Ababa',
    price: 100,
    deliveryDays: 1,
    regions: ['Addis Ababa'],
    active: true
  },
  {
    id: 'central',
    name: 'Central Ethiopia',
    price: 250,
    deliveryDays: 3,
    regions: ['Oromia', 'SNNPR'],
    active: true
  },
  {
    id: 'north',
    name: 'Northern Ethiopia',
    price: 400,
    deliveryDays: 5,
    regions: ['Amhara', 'Tigray'],
    active: true
  },
  {
    id: 'east',
    name: 'Eastern Ethiopia',
    price: 350,
    deliveryDays: 4,
    regions: ['Somali', 'Afar'],
    active: true
  }
];

/**
 * Available payment providers in Ethiopia
 */
export const PAYMENT_PROVIDERS = [
  'Telebirr',
  'CBE Birr',
  'HelloCash'
] as const;

/**
 * Default payment methods (empty - users add their own)
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [];

/**
 * Product categories for inventory management
 */
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Bags',
  'Shoes',
  'Accessories',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Beauty & Personal Care',
  'Food & Beverages',
  'Other'
] as const;

/**
 * Product status options
 */
export const PRODUCT_STATUS = ['Active', 'Draft', 'Low'] as const;

/**
 * Order status options
 */
export const ORDER_STATUS = ['New', 'Processing', 'Completed'] as const;

/**
 * Payment status options
 */
export const PAYMENT_STATUS = ['Paid', 'Processing', 'Pending'] as const;

/**
 * Customer status tiers
 */
export const CUSTOMER_STATUS = ['VIP', 'Regular', 'New'] as const;

/**
 * Delivery options for orders
 */
export const DELIVERY_OPTIONS = [
  'Standard',
  'Express',
  'Hud Hud',
  'Self-Pickup'
] as const;

/**
 * CSV import column headers expected from uploaded files
 */
export const CSV_HEADERS = [
  'Product Name',
  'Category',
  'Price',
  'Stock',
  'Description',
  'Status'
] as const;

/**
 * Notification preference keys for settings
 */
export const NOTIFICATION_PREFERENCES = {
  newOrders: 'New Order Notifications',
  lowStock: 'Low Stock Alerts',
  paymentReceived: 'Payment Received Notifications',
  customerMessages: 'Customer Messages',
  weeklyReport: 'Weekly Sales Report',
  promotionalEmails: 'Promotional Emails'
} as const;

/**
 * Currency settings
 */
export const CURRENCY = {
  code: 'ETB',
  symbol: 'ብር',
  name: 'Ethiopian Birr',
  locale: 'am-ET'
} as const;

/**
 * Pagination settings
 */
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100]
} as const;

/**
 * Validation rules for form inputs
 */
export const VALIDATION = {
  productName: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-\.]+$/
  },
  price: {
    min: 1,
    max: 999999
  },
  stock: {
    min: 0,
    max: 999999
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^(\+251|0)[0-9]{9}$/,
    example: '+251912345678 or 0912345678'
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
} as const;

/**
 * AI chat suggestions for quick actions
 */
export const AI_QUICK_SUGGESTIONS = [
  'How do I add products?',
  'How do I set up payments?',
  'What shipping zones should I create?',
  'How can I increase sales?',
  'How do I manage customer orders?',
  'Can you help me set up my store?'
] as const;

/**
 * Sample AI responses for demonstration
 */
export const AI_SAMPLE_RESPONSES = {
  addProducts:
    'To add products: 1) Go to Products page, 2) Click "Add Product", 3) Fill in name, price, stock, 4) Upload image, 5) Set as Active or Draft, 6) Click "Add Product". You can also bulk import via CSV!',
  shipping:
    'I recommend creating zones for Addis Ababa (fast delivery), Central Ethiopia, Northern, and Eastern regions. Adjust prices based on distance.',
  sales:
    'To increase sales: 1) Ensure high-quality product images, 2) Write clear descriptions, 3) Offer competitive prices, 4) Use promotional offers, 5) Ensure quick response to customer inquiries.'
} as const;
