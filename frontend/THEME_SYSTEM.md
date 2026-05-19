## Shikela Theme System Documentation

This document describes the complete theme system for Shikela online stores, including architecture, usage, and extension guidelines.

### Overview

The theme system provides a flexible, production-ready solution for managing store appearance. Store owners can select from professionally designed themes, which instantly reflect across their entire storefront with consistent typography, colors, spacing, and layout.

**Key Features:**
- 3 professionally designed themes (Modern, Minimal, Elegant)
- Complete layout configuration with colors, typography, and spacing
- Instant live preview on storefront
- Persistent theme selection in localStorage
- Real-time synchronization across dashboard and store
- Modular, scalable architecture for future themes

---

## Architecture

### Theme Structure

```
lib/
├── themes.ts              # Theme definitions and registry
└── use-store-theme.ts     # Theme selection and persistence hook

components/themes/
├── theme-header.tsx       # Theme-aware header component
├── theme-product-card.tsx # Theme-aware product card
└── theme-footer.tsx       # Theme-aware footer

app/
├── dashboard/online-store/page.tsx  # Theme selection UI
└── store/[storeId]/page.tsx          # Theme application
```

### Core Types

```typescript
interface ThemeConfig {
  id: ThemeId;                    // Unique identifier ('modern', 'minimal', 'elegant')
  name: string;                   // Display name
  description: string;            // User-facing description
  colors: ThemeColor;             // Complete color palette
  typography: ThemeTypography;    // Font sizes, weights, line heights
  spacing: ThemeSpacing;          // Spacing scale (xs, sm, md, lg, xl, 2xl)
  header: {...};                  // Header-specific styles
  card: {...};                    // Card component styles
  button: {...};                  // Button variants
  footer: {...};                  // Footer-specific styles
  page: {...};                    // Page background
  preview: {...};                 // Dashboard preview styling
}
```

---

## Available Themes

### 1. Modern Theme
**ID:** `modern`
- **Character:** Contemporary, vibrant, forward-thinking
- **Primary Colors:** Teal (#14b8a6) and Emerald (#10b981)
- **Best For:** Tech, fashion, SaaS products, modern brands
- **Aesthetic:** Fresh gradients, clean layouts, energetic feel

### 2. Minimal Theme
**ID:** `minimal`
- **Character:** Clean, sophisticated, professional
- **Primary Colors:** Gray palette (white to dark gray)
- **Best For:** Luxury goods, minimalist brands, professional services
- **Aesthetic:** Elegant simplicity, timeless design, focus on content

### 3. Elegant Theme
**ID:** `elegant`
- **Character:** Luxurious, warm, exclusive
- **Primary Colors:** Navy Blue (#1e3a8a) and Gold (#b8860b)
- **Best For:** Premium products, fashion, beauty, high-end services
- **Aesthetic:** Warm tones, sophisticated typography, refined elegance

---

## Usage

### Storefront Integration

The storefront automatically applies themes using the `useStoreTheme` hook:

```typescript
'use client';

import { useStoreTheme } from '@/lib/use-store-theme';
import { ThemeHeader } from '@/components/themes/theme-header';

export default function StorefrontPage() {
  const { theme, themeId, setTheme, isLoaded } = useStoreTheme();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: theme.page.bgClass }}>
      <ThemeHeader theme={theme} {...props} />
      {/* Rest of page */}
    </div>
  );
}
```

### Theme Component Usage

Theme-aware components accept the theme configuration:

```typescript
// Header Component
<ThemeHeader
  theme={theme}
  storeName="My Store"
  businessType="Fashion"
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setCategory}
  searchTerm={search}
  onSearchChange={setSearch}
  cartCount={5}
/>

// Product Card Component
<ThemeProductCard
  theme={theme}
  product={product}
  onAddToCart={handleAdd}
/>

// Footer Component
<ThemeFooter theme={theme} storeName="My Store" />
```

### Dashboard Theme Selection

Store owners select themes from the online store dashboard:

1. Navigate to **Online Store** → **Themes tab**
2. View all available themes with previews
3. Click **Apply Theme** to activate
4. Changes reflect instantly on live storefront
5. Click **View Live Store** to preview

### Programmatic Theme Selection

```typescript
import { useStoreTheme } from '@/lib/use-store-theme';

function MyComponent() {
  const { theme, setTheme } = useStoreTheme();

  const applyModernTheme = () => {
    setTheme('modern');  // Persists to localStorage
  };

  return (
    <button onClick={applyModernTheme}>
      Apply Modern Theme
    </button>
  );
}
```

---

## Theme Data Persistence

### Storage Mechanism

```typescript
// localStorage key: 'selectedTheme'
// Value: ThemeId ('modern', 'minimal', or 'elegant')

// Example:
localStorage.setItem('selectedTheme', 'elegant');
const savedTheme = localStorage.getItem('selectedTheme'); // 'elegant'
```

### Synchronization

When a theme is changed in the dashboard, it automatically syncs to the storefront:

```typescript
const handleThemeChange = (themeId: ThemeId) => {
  setSelectedThemeId(themeId);
  localStorage.setItem('selectedTheme', themeId);
  
  // Dispatch event for real-time updates
  const event = new CustomEvent('themeChanged', { 
    detail: { themeId } 
  });
  window.dispatchEvent(event);
};
```

The storefront listens for theme changes:

```typescript
useEffect(() => {
  const handleThemeChange = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.themeId) {
      setTheme(customEvent.detail.themeId);
    }
  };
  
  window.addEventListener('themeChanged', handleThemeChange);
  return () => window.removeEventListener('themeChanged', handleThemeChange);
}, [setTheme]);
```

---

## Creating Custom Themes

### Adding a New Theme

1. **Define theme in `lib/themes.ts`:**

```typescript
export const customTheme: ThemeConfig = {
  id: 'custom',
  name: 'Custom Theme',
  description: 'Your custom theme description',
  colors: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    accent: '#YOUR_COLOR',
    neutral: {
      50: '#...',
      // ... complete neutral scale
      900: '#...',
    },
    success: '#...',
    warning: '#...',
    error: '#...',
  },
  typography: {
    heading1: { size: '32px', weight: '700', lineHeight: '1.2' },
    heading2: { size: '24px', weight: '600', lineHeight: '1.3' },
    body: { size: '16px', weight: '400', lineHeight: '1.6' },
    caption: { size: '14px', weight: '500', lineHeight: '1.4' },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  header: {
    bgClass: 'bg-gradient-to-r from-primary to-secondary',
    textClass: 'text-white',
    gradientClass: 'from-primary to-secondary',
    shadowClass: 'shadow-lg',
  },
  card: {
    bgClass: 'bg-white',
    borderClass: 'border border-primary-100',
    shadowClass: 'shadow-sm hover:shadow-md',
  },
  button: {
    primaryClass: 'bg-primary hover:bg-primary-dark text-white',
    secondaryClass: 'border border-primary text-primary hover:bg-primary-50',
    accentClass: 'bg-accent hover:bg-accent-dark text-white',
  },
  footer: {
    bgClass: 'bg-gradient-to-r from-primary-dark to-secondary-dark',
    textClass: 'text-white',
    gradientClass: 'from-primary to-secondary',
  },
  page: {
    bgClass: 'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
  },
  preview: {
    gradient: 'from-primary to-secondary',
    colors: ['#PRIMARY_HEX', '#SECONDARY_HEX'],
  },
};
```

2. **Register in theme registry:**

```typescript
export const THEMES: Record<ThemeId, ThemeConfig> = {
  modern: modernTheme,
  minimal: minimalTheme,
  elegant: elegantTheme,
  custom: customTheme, // Add here
};

export const THEME_LIST = [modernTheme, minimalTheme, elegantTheme, customTheme];
```

3. **Update TypeScript type:**

```typescript
export type ThemeId = 'modern' | 'minimal' | 'elegant' | 'custom';
```

---

## Styling Considerations

### Color Application

Colors are applied inline with `style` attributes for maximum flexibility:

```typescript
<div style={{ color: theme.colors.primary }}>
  Primary Color Text
</div>

<button style={{
  backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
}}>
  Gradient Button
</button>
```

### Typography Usage

```typescript
<h1 style={{
  fontSize: theme.typography.heading1.size,
  fontWeight: theme.typography.heading1.weight,
  lineHeight: theme.typography.heading1.lineHeight,
}}>
  Page Title
</h1>
```

### Spacing Application

```typescript
<div style={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
  {/* Content with consistent spacing */}
</div>
```

---

## Performance Optimization

### Theme Loading

The `useStoreTheme` hook loads synchronously from localStorage to prevent flash of default theme:

```typescript
const { theme, isLoaded } = useStoreTheme();

if (!isLoaded) {
  return <LoadingSpinner />;  // Brief loading state
}
```

### Component Memoization

Theme-aware components can be memoized to prevent unnecessary re-renders:

```typescript
import { memo } from 'react';

export const ThemeProductCard = memo(function ThemeProductCard({ 
  theme, 
  product, 
  onAddToCart 
}) {
  // Component code
});
```

---

## Testing

### Theme Selection Testing

```typescript
describe('Theme System', () => {
  it('should apply theme from localStorage', () => {
    localStorage.setItem('selectedTheme', 'elegant');
    render(<StorefrontPage />);
    // Assert theme styles applied
  });

  it('should persist theme selection', () => {
    const { setTheme } = useStoreTheme();
    setTheme('minimal');
    expect(localStorage.getItem('selectedTheme')).toBe('minimal');
  });

  it('should sync theme across tabs', () => {
    const event = new CustomEvent('themeChanged', { 
      detail: { themeId: 'modern' } 
    });
    window.dispatchEvent(event);
    // Assert theme updated in other tab
  });
});
```

---

## Backend Integration Ready

When ready to move to a backend:

1. Replace localStorage with API calls:
```typescript
// Fetch from backend
const { data: theme } = await fetch(`/api/stores/${storeId}/theme`);

// Save to backend
await fetch(`/api/stores/${storeId}/theme`, {
  method: 'POST',
  body: JSON.stringify({ themeId })
});
```

2. Use WebSocket for real-time sync:
```typescript
const socket = io('/');
socket.on('themeChanged', (themeId) => {
  setTheme(themeId);  // Auto-update
});
```

---

## Future Enhancements

Potential improvements for upcoming releases:

1. **Theme Editor** - Allow custom color/font customization within themes
2. **Theme Variants** - Multiple color variants per theme
3. **Mobile-specific Themes** - Responsive theme adjustments
4. **Preview Panel** - Live theme preview in dashboard
5. **Theme Transitions** - Smooth animations between theme changes
6. **A/B Testing** - Test theme impact on conversions
7. **User-created Themes** - Allow store owners to create themes
8. **Theme Scheduling** - Auto-switch themes based on time/season

---

## Support

For theme-related questions or custom theme requests, refer to the main ARCHITECTURE.md documentation or DEVELOPER_GUIDE.md.
