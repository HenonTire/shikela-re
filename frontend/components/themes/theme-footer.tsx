/**
 * @file components/themes/theme-footer.tsx
 * @description Theme-aware footer component
 * 
 * Renders store footer with theme-specific styling and branding.
 */

import { ThemeConfig } from '@/lib/themes';

interface ThemeFooterProps {
  theme: ThemeConfig;
  storeName: string;
}

export function ThemeFooter({ theme, storeName }: ThemeFooterProps) {
  return (
    <footer 
      className={`${theme.footer.bgClass} ${theme.footer.textClass} py-8 mt-12`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 
              className="font-bold mb-3"
              style={{ fontSize: theme.typography.heading2.size }}
            >
              {storeName}
            </h3>
            <p className="text-sm opacity-75">
              Your trusted online shopping destination
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 
              className="font-semibold mb-3"
              style={{ fontSize: theme.typography.caption.size }}
            >
              Shop
            </h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">All Products</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">New Arrivals</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Best Sellers</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Sale</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 
              className="font-semibold mb-3"
              style={{ fontSize: theme.typography.caption.size }}
            >
              Support
            </h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQs</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Shipping Info</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 
              className="font-semibold mb-3"
              style={{ fontSize: theme.typography.caption.size }}
            >
              Legal
            </h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="my-6"
          style={{ borderTop: `1px solid rgba(255,255,255,0.2)` }}
        ></div>

        {/* Copyright */}
        <div className="text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
