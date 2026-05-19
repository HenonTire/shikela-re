# Component Architecture - Shikela Auth

## 🏗️ Component Hierarchy

```
AuthLayout (Shared wrapper for all auth pages)
├── LoginForm
├── RegisterForm  
├── AccountForm
├── VerificationPage
└── StoreForm
```

## 📦 Components Overview

### AuthLayout (`components/auth/auth-layout.tsx`)
Shared wrapper component for all authentication pages.

**Props:**
- `children: React.ReactNode` - Page content
- `showFooter?: boolean` - Toggle footer with terms/privacy links (default: true)

**Features:**
- "Shikela" header
- Centered layout with max-width container
- Optional Terms & Privacy Policy footer
- Mobile-responsive styling

**Used By:**
- All auth pages (login, register, form, verify, store)

---

### LoginForm (`components/auth/login-form.tsx`)
Login form component with email/phone and password.

**Form Fields:**
- `emailOrPhone` - Email or phone number (required)
- `password` - Password (required)

**Features:**
- Email/phone and password inputs
- "Continue with email" CTA button
- "Continue with Google" OAuth button
- Link to registration page
- Form validation with error messages
- 500ms simulated auth delay

**Validation (Zod Schema):**
```typescript
{
  emailOrPhone: string (required),
  password: string (required)
}
```

**On Submit:**
- Stores nothing in localStorage
- Redirects to `/dashboard`

---

### RegisterForm (`components/auth/register-form.tsx`)
Initial registration form for email/phone entry.

**Form Fields:**
- `emailOrPhone` - Email or phone number (required)

**Features:**
- Email/phone input
- "Continue with email" primary button
- "Continue with Google" OAuth button
- "Continue with Facebook" OAuth button
- Link to login page
- Form validation with error messages
- 300ms simulated navigation delay

**Validation (Zod Schema):**
```typescript
{
  emailOrPhone: string (required)
}
```

**On Submit:**
- Stores `emailOrPhone` in localStorage key: `registerEmail`
- Redirects to `/register/form`

---

### AccountForm (`components/auth/account-form.tsx`)
Account details form for personal information and password.

**Form Fields:**
- `firstName` - First name (required)
- `lastName` - Last name (required)
- `phone` - Phone number (required)
- `password` - Password (required, validated)
- `agree` - Terms agreement checkbox (required)

**Features:**
- Two-column layout for first/last name (responsive)
- Phone input with Ethiopian format hint (+251)
- Password input with strength requirements
- Terms agreement checkbox with link styling
- Form validation with error messages
- 300ms simulated navigation delay

**Validation (Zod Schema):**
```typescript
{
  firstName: string (required),
  lastName: string (required),
  phone: string (required),
  password: string (
    min 8 chars, 
    must include uppercase letter,
    must include number
  ),
  agree: boolean (must be true)
}
```

**On Submit:**
- Reads `registerEmail` from localStorage
- Stores complete data in localStorage key: `registerData`
  ```javascript
  {
    email,
    firstName,
    lastName,
    phone,
    password
  }
  ```
- Redirects to `/register/verify`

---

### VerificationPage (`components/auth/verification-page.tsx`)
Email verification confirmation page (non-form component).

**Features:**
- Shows registered email from localStorage
- "Resend email" button with loading state
- Helpful messaging for spam folder
- Option to try another email (placeholder)
- 500ms simulated resend delay

**Data Source:**
- Reads `registerEmail` from localStorage

**On Resend:**
- Simulates 500ms delay
- No actual email sent (mocked)

---

### StoreForm (`components/auth/store-form.tsx`)
Store creation form with business setup.

**Form Fields:**
- `storeName` - Store name (required)
- `businessType` - Business category (required)
- `logo` - Store logo file (optional)

**Features:**
- Store name input with 3+ char validation
- Business type dropdown selector (8 categories)
- Logo upload with drag & drop support
- Logo preview display
- Drag & drop visual feedback
- File type validation (images only)
- 500ms simulated creation delay

**Business Type Options:**
```
- Clothing & Fashion
- Electronics
- Food & Beverage
- Home & Garden
- Beauty & Personal Care
- Sports & Outdoors
- Books & Media
- Other
```

**Validation (Zod Schema):**
```typescript
{
  storeName: string (required, min 3 chars),
  businessType: string (required),
  logo: File (optional)
}
```

**On Submit:**
- Reads `registerData` from localStorage
- Converts logo file to Data URL if provided
- Stores complete profile in localStorage key: `storeData`
  ```javascript
  {
    email,
    firstName,
    lastName,
    phone,
    password,
    storeName,
    businessType,
    logo (data URL or null)
  }
  ```
- Clears temporary localStorage keys (`registerEmail`, `registerData`)
- Redirects to `/dashboard`

**File Handling:**
- Accepts all image types
- Converts to Base64 Data URL for preview
- Stores in localStorage (not production-safe for large files)

---

## 🎨 Styling Patterns

All components follow consistent design patterns:

### Input Fields
```jsx
<Input 
  className="bg-gray-100 border-0 placeholder:text-gray-400"
  placeholder="..."
/>
```

### Primary Buttons
```jsx
<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-medium">
  Action Label
</Button>
```

### Secondary Buttons
```jsx
<Button 
  variant="outline" 
  className="border border-gray-300 py-6 text-base font-medium text-gray-700 hover:bg-gray-50"
>
  Action Label
</Button>
```

### Form Labels
```jsx
<FormLabel className="text-gray-700 text-sm font-medium">Label Text</FormLabel>
```

---

## 🔄 Data Flow Through Components

```
RegisterForm
    ↓ stores: registerEmail
RegisterForm (button click)
    ↓ redirects
AccountForm
    ↓ reads: registerEmail
    ↓ stores: registerData
AccountForm (button click)
    ↓ redirects
VerificationPage
    ↓ reads: registerEmail
VerificationPage (manual nav or email click)
    ↓ redirects
StoreForm
    ↓ reads: registerData
    ↓ stores: storeData
    ↓ clears: registerEmail, registerData
StoreForm (button click)
    ↓ redirects
Dashboard
    ↓ reads: storeData
    ↓ displays user & store info
```

---

## 🧪 Using Components Individually

All components can be imported and used separately:

```typescript
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { AccountForm } from '@/components/auth/account-form'
import { VerificationPage } from '@/components/auth/verification-page'
import { StoreForm } from '@/components/auth/store-form'

// Use in your own layouts
<AuthLayout showFooter={true}>
  <LoginForm />
</AuthLayout>
```

---

## 📱 Responsive Design

All components are mobile-first and responsive:

- **Mobile**: Full width with padding (px-4)
- **Tablet**: Centered with max-width constraint
- **Desktop**: Centered container, full-featured layout

Key responsive elements:
- Store form: Two-column layout for name inputs
- All inputs: Full width on mobile, constrained on desktop
- Buttons: Full width, consistent sizing across breakpoints

---

## ♿ Accessibility Features

Components include:

- ✅ Form labels connected via `htmlFor`
- ✅ Error messages linked to inputs
- ✅ Semantic HTML elements
- ✅ ARIA roles and attributes
- ✅ Focus states on interactive elements
- ✅ Disabled states properly styled
- ✅ Color contrast compliance
- ✅ Keyboard navigation support

---

## 🔧 Customization Guide

### Change Primary Color
Update button classNames from `bg-blue-600` to your color.

### Change Input Style
Modify `className="bg-gray-100 border-0"` in Input components.

### Add New Fields
1. Add to Zod schema
2. Add FormField to form
3. Add to localStorage/data structure

### Add New Business Types
Edit `StoreForm` SelectItem options array.

### Change Form Delays
Adjust `setTimeout` values in submit handlers (currently 300-500ms).

---

## 🚀 For Backend Integration

When connecting to real backend:

1. **Replace localStorage** with API calls
2. **Remove setTimeout delays** (artificial delays for UX demo)
3. **Add error handling** for network failures
4. **Implement real OAuth** instead of placeholders
5. **Add loading states** for real API calls
6. **Implement proper error messages** from server

Example migration:
```typescript
// Before: localStorage
localStorage.setItem('registerEmail', values.emailOrPhone)
router.push('/register/form')

// After: API call
const response = await fetch('/api/register/email', {
  method: 'POST',
  body: JSON.stringify({ emailOrPhone: values.emailOrPhone })
})
if (response.ok) router.push('/register/form')
```

---

## 📚 Related Documentation

- `AUTH_FLOW.md` - Detailed authentication flow
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `QUICK_START.md` - Testing guide
