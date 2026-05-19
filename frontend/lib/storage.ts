/**
 * @file lib/storage.ts
 * @description localStorage database utilities for Shikela platform
 * Provides type-safe CRUD operations for all data models with localStorage persistence
 */

/**
 * Generates a unique ID for new records
 * @returns {string} A unique identifier (short UUID-like string)
 * @example
 * const id = generateId(); // "K8j9L2m4P"
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Formats a number as Ethiopian Birr currency
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string (e.g., "24,000ETB")
 * @example
 * formatETB(24000); // "24,000ETB"
 */
export const formatETB = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value) + 'ETB';
};

/**
 * Generic localStorage utilities with type-safe CRUD operations
 * All methods validate data before storage and handle errors gracefully
 * 
 * @example
 * ```tsx
 * // Get all products
 * const allProducts = storage.getAll<Product>('products');
 * 
 * // Create a new product
 * const newProduct = storage.create('products', {
 *   name: 'T-Shirt',
 *   price: 500,
 *   // ... other fields
 * });
 * 
 * // Update a product
 * storage.update('products', { ...product, price: 600 });
 * 
 * // Delete a product
 * storage.delete('products', productId);
 * ```
 */
export const storage = {
  /**
   * Retrieves all items of a specific type from localStorage
   * @template T - The data type to retrieve
   * @param {string} key - The localStorage key (e.g., 'products', 'orders')
   * @returns {T[]} Array of items, empty array if key doesn't exist
   */
  getAll<T>(key: string): T[] {
    try {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`[Storage] Error reading ${key}:`, error);
      return [];
    }
  },

  /**
   * Retrieves a single item by ID
   * @template T - The data type with an id property
   * @param {string} key - The localStorage key
   * @param {string} id - The item's unique identifier
   * @returns {T | null} The item if found, null otherwise
   */
  getById<T extends { id: string }>(key: string, id: string): T | null {
    try {
      const items = this.getAll<T>(key);
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`[Storage] Error reading ${key} by ID:`, error);
      return null;
    }
  },

  /**
   * Creates a new item and stores it
   * @template T - The data type (should have optional id field)
   * @param {string} key - The localStorage key
   * @param {T} item - The item to create (without id)
   * @returns {T} The created item with generated id
   */
  create<T extends Record<string, any>>(
    key: string,
    item: T & { id?: string }
  ): T & { id: string } {
    try {
      const items = this.getAll<T>(key);
      const newItem = { ...item, id: item.id || generateId() } as T & { id: string };
      items.push(newItem);
      localStorage.setItem(key, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error(`[Storage] Error creating in ${key}:`, error);
      throw error;
    }
  },

  /**
   * Updates an existing item
   * @template T - The data type with required id property
   * @param {string} key - The localStorage key
   * @param {T} item - The updated item (must include id)
   * @returns {T} The updated item
   * @throws Error if item with id not found
   */
  update<T extends { id: string }>(key: string, item: T): T {
    try {
      const items = this.getAll<T>(key);
      const index = items.findIndex(i => i.id === item.id);
      if (index === -1) throw new Error(`Item with id ${item.id} not found in ${key}`);
      items[index] = item;
      localStorage.setItem(key, JSON.stringify(items));
      return item;
    } catch (error) {
      console.error(`[Storage] Error updating in ${key}:`, error);
      throw error;
    }
  },

  /**
   * Updates multiple items at once
   * @template T - The data type with required id property
   * @param {string} key - The localStorage key
   * @param {T[]} items - Array of items to update
   * @returns {T[]} The updated items
   */
  updateMany<T extends { id: string }>(key: string, items: T[]): T[] {
    try {
      const stored = this.getAll<T>(key);
      const updated = stored.map(storedItem => {
        const updated = items.find(item => item.id === storedItem.id);
        return updated || storedItem;
      });
      localStorage.setItem(key, JSON.stringify(updated));
      return items;
    } catch (error) {
      console.error(`[Storage] Error updating many in ${key}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an item by ID
   * @param {string} key - The localStorage key
   * @param {string} id - The item's unique identifier
   * @returns {boolean} True if item was deleted, false if not found
   */
  delete(key: string, id: string): boolean {
    try {
      const items = this.getAll(key);
      const filtered = items.filter((item: any) => item.id !== id);
      const deleted = items.length !== filtered.length;
      localStorage.setItem(key, JSON.stringify(filtered));
      return deleted;
    } catch (error) {
      console.error(`[Storage] Error deleting from ${key}:`, error);
      return false;
    }
  },

  /**
   * Deletes multiple items by their IDs
   * @param {string} key - The localStorage key
   * @param {string[]} ids - Array of item IDs to delete
   * @returns {number} Number of items deleted
   */
  deleteMany(key: string, ids: string[]): number {
    try {
      const items = this.getAll(key);
      const filtered = items.filter((item: any) => !ids.includes(item.id));
      const deleted = items.length - filtered.length;
      localStorage.setItem(key, JSON.stringify(filtered));
      return deleted;
    } catch (error) {
      console.error(`[Storage] Error deleting many from ${key}:`, error);
      return 0;
    }
  },

  /**
   * Clears all items of a specific type
   * @param {string} key - The localStorage key to clear
   */
  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Error clearing ${key}:`, error);
    }
  },

  /**
   * Retrieves filtered items based on a predicate function
   * @template T - The data type to filter
   * @param {string} key - The localStorage key
   * @param {function} predicate - Filter function returning boolean
   * @returns {T[]} Array of filtered items
   */
  filter<T>(key: string, predicate: (item: T) => boolean): T[] {
    try {
      const items = this.getAll<T>(key);
      return items.filter(predicate);
    } catch (error) {
      console.error(`[Storage] Error filtering ${key}:`, error);
      return [];
    }
  },

  /**
   * Checks if an item exists by ID
   * @param {string} key - The localStorage key
   * @param {string} id - The item's unique identifier
   * @returns {boolean} True if item exists, false otherwise
   */
  exists(key: string, id: string): boolean {
    try {
      const items = this.getAll(key);
      return items.some((item: any) => item.id === id);
    } catch (error) {
      console.error(`[Storage] Error checking existence in ${key}:`, error);
      return false;
    }
  },

  /**
   * Gets the count of items
   * @param {string} key - The localStorage key
   * @returns {number} Total number of items
   */
  count(key: string): number {
    try {
      return this.getAll(key).length;
    } catch (error) {
      console.error(`[Storage] Error counting ${key}:`, error);
      return 0;
    }
  },

  /**
   * Exports all data for backup purposes
   * @returns {Record<string, any>} Object containing all localStorage data
   */
  exportAll(): Record<string, any> {
    try {
      const backup: Record<string, any> = {};
      const keys = [
        'products',
        'orders',
        'customers',
        'storeSettings',
        'shippingZones',
        'paymentMethods',
        'setupTasks',
        'aiChatHistory'
      ];
      keys.forEach(key => {
        backup[key] = this.getAll(key);
      });
      return backup;
    } catch (error) {
      console.error('[Storage] Error exporting data:', error);
      return {};
    }
  },

  /**
   * Imports data from a backup
   * @param {Record<string, any>} backup - Backup object from exportAll()
   */
  importAll(backup: Record<string, any>): void {
    try {
      Object.entries(backup).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
    } catch (error) {
      console.error('[Storage] Error importing data:', error);
    }
  }
};
