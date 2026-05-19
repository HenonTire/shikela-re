/**
 * @file lib/types.ts
 * @description Type definitions for Shikela platform
 * Centralized TypeScript interfaces for all data models used throughout the application
 */

/**
 * Product interface - represents an item in the store inventory
 * @property {string} id - Unique identifier (auto-generated)
 * @property {string} name - Product name
 * @property {string} category - Product category (Bags, Shoes, Accessories, etc.)
 * @property {number} price - Price in Ethiopian Birr (ETB)
 * @property {number} stock - Current inventory count
 * @property {number} sales - Number of units sold
 * @property {string} revenue - Formatted revenue string (e.g., "24,000ETB")
 * @property {'Active' | 'Draft' | 'Low'} status - Product status
 * @property {string} image - Base64 encoded image or image URL
 * @property {string} [description] - Optional product description
 * @property {string} createdAt - ISO date string of creation
 * @property {string} updatedAt - ISO date string of last update
 * @property {boolean} [dropshipped] - Whether product is dropshipped
 * @property {string} [supplierId] - ID of supplier if dropshipped
 * @property {number} [wholesalePrice] - Wholesale price if dropshipped
 * @property {number} [markup] - Markup percentage applied to wholesale price
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  revenue: string;
  status: 'Active' | 'Draft' | 'Low';
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  dropshipped?: boolean;
  supplierId?: string;
  wholesalePrice?: number;
  markup?: number;
}

/**
 * SetupTask interface - represents onboarding tasks for new stores
 * @property {'products' | 'payments' | 'shipping' | 'store'} id - Task identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {boolean} completed - Whether task is completed
 * @property {string} pageUrl - URL to navigate to for this task
 * @property {string} icon - Icon name for UI display
 */
export interface SetupTask {
  id: 'products' | 'payments' | 'shipping' | 'store';
  title: string;
  description: string;
  completed: boolean;
  pageUrl: string;
  icon: string;
}

/**
 * Order interface - represents a customer order
 * @property {string} id - Unique order identifier
 * @property {string} customerName - Customer full name
 * @property {string} email - Customer email address
 * @property {string} items - Description of items ordered
 * @property {string} amount - Total order amount in ETB
 * @property {'New' | 'Processing' | 'Completed'} status - Order fulfillment status
 * @property {'Paid' | 'Processing' | 'Pending'} paymentStatus - Payment status
 * @property {string} deliveryOption - Shipping method (Standard, Express, etc.)
 * @property {string} createdAt - ISO date string of order creation
 */
export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: string;
  amount: string;
  status: 'New' | 'Processing' | 'Completed';
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  deliveryOption: string;
  createdAt: string;
}

/**
 * Customer interface - represents a customer record
 * @property {string} id - Unique customer identifier
 * @property {string} name - Customer full name
 * @property {string} email - Customer email address
 * @property {string} location - City/region of customer
 * @property {number} orders - Total number of orders placed
 * @property {string} totalSpent - Total amount spent formatted (e.g., "1,200 ETB")
 * @property {'VIP' | 'Regular' | 'New'} status - Customer classification
 * @property {string} createdAt - ISO date string of first purchase
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  totalSpent: string;
  status: 'VIP' | 'Regular' | 'New';
  createdAt: string;
}

/**
 * ChatMessage interface - represents an AI chat message
 * @property {string} id - Unique message identifier
 * @property {'user' | 'assistant'} role - Who sent the message
 * @property {string} content - Message text content
 * @property {string} timestamp - ISO date string of message time
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * ShippingZone interface - represents a shipping region with configured rates
 * @property {string} id - Unique zone identifier
 * @property {string} name - Zone name/region
 * @property {number} price - Base shipping price in ETB
 * @property {number} deliveryDays - Estimated delivery days
 * @property {string[]} regions - Array of regions covered
 * @property {boolean} active - Whether zone is currently active
 */
export interface ShippingZone {
  id: string;
  name: string;
  price: number;
  deliveryDays: number;
  regions: string[];
  active: boolean;
}

/**
 * PaymentMethod interface - represents a connected payment gateway
 * @property {string} id - Unique method identifier
 * @property {'Telebirr' | 'CBE Birr' | 'HelloCash'} provider - Payment provider name
 * @property {boolean} active - Whether method is enabled
 * @property {number} commissionRate - Commission percentage charged
 * @property {string} accountId - Connected account identifier
 * @property {string} connectedAt - ISO date string of connection
 */
export interface PaymentMethod {
  id: string;
  provider: 'Telebirr' | 'CBE Birr' | 'HelloCash';
  active: boolean;
  commissionRate: number;
  accountId: string;
  connectedAt: string;
}

/**
 * StoreSettings interface - represents store configuration
 * @property {string} storeName - Name of the store
 * @property {string} ownerName - Store owner full name
 * @property {string} email - Store contact email
 * @property {string} phone - Store contact phone
 * @property {string} businessType - Type of business
 * @property {string} location - Store physical location
 * @property {string} logo - Base64 logo image or URL
 * @property {string} returnPolicy - Store return policy text
 * @property {string} privacyPolicy - Privacy policy text
 * @property {string} termsOfService - Terms of service text
 */
export interface StoreSettings {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  logo: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
}

/**
 * PayoutHistory interface - represents a single payout transaction
 * @property {string} id - Transaction identifier
 * @property {string} date - ISO date string of payout
 * @property {string} amount - Amount paid in ETB
 * @property {'Completed' | 'Pending' | 'Failed'} status - Transaction status
 * @property {string} method - Payout method (Bank Transfer, Mobile Money, etc.)
 */
export interface PayoutHistory {
  id: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  method: string;
}

/**
 * Supplier interface - represents a supplier account
 * @property {string} id - Unique supplier identifier
 * @property {string} fullName - Supplier contact person name
 * @property {string} businessName - Registered business name
 * @property {string} email - Supplier email
 * @property {string} phone - Supplier phone number
 * @property {string} address - Physical business address
 * @property {string[]} categories - Product categories supplied
 * @property {string} createdAt - ISO date string of account creation
 * @property {number} productsCount - Total products supplied
 * @property {number} ordersCount - Total orders received
 */
export interface Supplier {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  createdAt: string;
  productsCount: number;
  ordersCount: number;
}

/**
 * SupplierOrder interface - represents an order from store owner to supplier
 * @property {string} id - Unique order identifier
 * @property {string} supplierId - Supplier ID
 * @property {string} storeOwnerId - Store owner ID placing the order
 * @property {string} items - Description of ordered items
 * @property {number} quantity - Total quantity ordered
 * @property {string} amount - Order amount in ETB
 * @property {'New' | 'Accepted' | 'Rejected' | 'Processing' | 'Shipped'} status - Order status
 * @property {string} createdAt - ISO date string of order placement
 */
export interface SupplierOrder {
  id: string;
  supplierId: string;
  storeOwnerId: string;
  items: string;
  quantity: number;
  amount: string;
  status: 'New' | 'Accepted' | 'Rejected' | 'Processing' | 'Shipped';
  createdAt: string;
}

/**
 * User interface - represents logged in user with role
 * @property {string} id - Unique user identifier
 * @property {string} email - User email
 * @property {'store_owner' | 'supplier' | 'courier'} role - User role
 * @property {string} displayName - User display name
 * @property {string} [supplierId] - Supplier ID if user is supplier
 * @property {string} [courierId] - Courier ID if user is courier
 */
export interface User {
  id: string;
  email: string;
  role: 'store_owner' | 'supplier' | 'courier';
  displayName: string;
  supplierId?: string;
  courierId?: string;
}

/**
 * Courier interface - represents a courier/delivery partner
 * @property {string} id - Unique courier identifier
 * @property {string} fullName - Courier's full name
 * @property {string} email - Courier email
 * @property {string} phone - Courier phone number
 * @property {string} vehicleType - Type of vehicle (Motorcycle, Car, Truck)
 * @property {string} vehicleNumber - Vehicle registration/plate number
 * @property {string[]} serviceAreas - City/regions where courier operates
 * @property {boolean} isActive - Whether courier is currently available
 * @property {number} rating - Average customer rating (0-5)
 * @property {number} totalDeliveries - Total completed deliveries
 * @property {number} successRate - Delivery success percentage
 * @property {string} profileImage - Base64 image or URL of courier
 * @property {string} createdAt - ISO date string of account creation
 * @property {string} idDocumentUrl - URL/ID of courier's identity document
 */
export interface Courier {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: 'Motorcycle' | 'Car' | 'Truck';
  vehicleNumber: string;
  serviceAreas: string[];
  isActive: boolean;
  rating: number;
  totalDeliveries: number;
  successRate: number;
  profileImage: string;
  createdAt: string;
  idDocumentUrl: string;
}

/**
 * Delivery interface - represents a delivery assignment to a courier
 * @property {string} id - Unique delivery identifier
 * @property {string} courierId - Assigned courier's ID
 * @property {string} orderId - Associated order ID
 * @property {string} storeOwnerId - Store owner ID
 * @property {string} customerName - Customer receiving delivery
 * @property {string} customerPhone - Customer contact phone
 * @property {string} pickupAddress - Pickup location (store address)
 * @property {string} deliveryAddress - Delivery destination address
 * @property {number} deliveryFee - Fee paid to courier in ETB
 * @property {'Pending' | 'Assigned' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Failed' | 'Cancelled'} status - Current delivery status
 * @property {string} [notes] - Special delivery instructions
 * @property {string} [proofOfDelivery] - Photo/signature proof URL
 * @property {string} assignedAt - ISO date of assignment
 * @property {string} [completedAt] - ISO date of completion
 * @property {number} [latitude] - Current delivery latitude for tracking
 * @property {number} [longitude] - Current delivery longitude for tracking
 */
export interface Delivery {
  id: string;
  courierId: string;
  orderId: string;
  storeOwnerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryFee: number;
  status: 'Pending' | 'Assigned' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Failed' | 'Cancelled';
  notes?: string;
  proofOfDelivery?: string;
  assignedAt: string;
  completedAt?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * CourierEarnings interface - represents earnings/payout for a courier
 * @property {string} id - Unique earnings record identifier
 * @property {string} courierId - Courier ID
 * @property {number} amount - Earnings amount in ETB
 * @property {number} deliveries - Number of deliveries in period
 * @property {string} period - Month/period (e.g., "2024-04")
 * @property {'Pending' | 'Processed' | 'Paid'} status - Payment status
 * @property {string} createdAt - ISO date of record creation
 */
export interface CourierEarnings {
  id: string;
  courierId: string;
  amount: number;
  deliveries: number;
  period: string;
  status: 'Pending' | 'Processed' | 'Paid';
  createdAt: string;
}

/**
 * DeliveryMessage interface - represents communication between courier and customer/store
 * @property {string} id - Unique message identifier
 * @property {string} deliveryId - Associated delivery ID
 * @property {string} senderId - Sender user ID
 * @property {'courier' | 'customer' | 'store'} senderRole - Sender's role
 * @property {string} message - Message text content
 * @property {string} timestamp - ISO date of message
 */
export interface DeliveryMessage {
  id: string;
  deliveryId: string;
  senderId: string;
  senderRole: 'courier' | 'customer' | 'store';
  message: string;
  timestamp: string;
}
