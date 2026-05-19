# Shikela Authentication Flow

## Overview

This document describes the multi-step authentication system implemented for Shikela, an Ethiopian e-commerce platform.

## Routes & Flow

### 1. Login Flow (`/login`)
- **Page**: Email/phone + password login form
- **Features**:
  - Email or phone number input
  - Password input
  - Email authentication button
  - Google OAuth button (placeholder)
  - Link to registration page
- **On Submit**: Redirects to `/dashboard`

### 2. Registration Flow

#### Step 1: Initial Registration (`/register`)
- **Features**:
  - Email or phone number input
  - Email authentication button
  - Google OAuth button (placeholder)
  - Facebook OAuth button (placeholder)
  - Link to login page
- **On Submit**: Stores email/phone in localStorage and redirects to Step 2

#### Step 2: Account Details (`/register/form`)
- **Features**:
  - First Name input
  - Last Name input
  - Phone Number input (with Ethiopian +251 prefix format)
  - Password input (with strength requirements: 8+ chars, uppercase, number)
  - Terms & Privacy Policy checkbox
- **On Submit**: Stores complete account data in localStorage and redirects to Step 3

#### Step 3: Email Verification (`/register/verify`)
- **Features**:
  - Verification confirmation message
  - Email address display
  - Resend email button
  - Helpful text for spam folder
- **How it Works**: User clicks verification link in email (mocked for now)
- **Next**: Manual navigation to Step 4 (in production, clicking email link would redirect here)

#### Step 4: Store Creation (`/register/store`)
- **Features**:
  - Store Name input
  - Business Type dropdown selector
  - Store Logo upload (drag & drop, optional)
  - Logo preview
  - Create Store button
- **Business Types Available**:
  - Clothing & Fashion
  - Electronics
  - Food & Beverage
  - Home & Garden
  - Beauty & Personal Care
  - Sports & Outdoors
  - Books & Media
  - Other
- **On Submit**: Completes registration and redirects to `/dashboard`

## Data Flow

### LocalStorage Keys

During registration, data is stored in localStorage for multi-step persistence:

1. **Step 1**: `registerEmail` - Email/phone entered
2. **Step 2**: `registerData` - Full account details (email, firstName, lastName, phone, password)
3. **Step 4**: `storeData` - Complete profile with store information

**On Dashboard Load**: All data is read from localStorage and displayed

**On Logout**: All localStorage data is cleared

## Components

### Shared Components

#### `AuthLayout` (`components/auth/auth-layout.tsx`)
- Wraps all authentication pages
- Displays "Shikela" header
- Shows Terms & Privacy Policy footer
- Centered layout styling

### Form Components

#### `LoginForm` (`components/auth/login-form.tsx`)
- Email/phone + password authentication
- React Hook Form + Zod validation
- Simulates auth with 500ms delay

#### `RegisterForm` (`components/auth/register-form.tsx`)
- Initial email/phone entry
- OAuth button placeholders
- Stores email in localStorage

#### `AccountForm` (`components/auth/account-form.tsx`)
- Personal details collection
- Password strength validation
- Terms agreement checkbox
- Phone number formatting support

#### `VerificationPage` (`components/auth/verification-page.tsx`)
- Shows registered email
- Resend email functionality
- Helpful messaging

#### `StoreForm` (`components/auth/store-form.tsx`)
- Store information collection
- Logo upload with drag & drop
- Logo preview
- Business type selector

## Validation

### Using React Hook Form + Zod

All forms use **Zod** schemas for validation:

- **Login**: Email/phone and password required
- **Register**: Email/phone required
- **Account**: 
  - First/Last name required
  - Phone required
  - Password: 8+ chars, uppercase, number
  - Terms agreement required
- **Store**: 
  - Store name required (3+ chars)
  - Business type required
  - Logo optional

## Styling

### Design System
- **Primary Color**: Blue (#2563EB) for CTAs
- **Secondary Colors**: Gray (#6B7280) for text, (#F3F4F6) for inputs
- **Typography**: Geist font family, responsive sizes
- **Layout**: Centered auth layout, max-width container, mobile-first

### Component Styling
- Input fields: Gray background (#F3F4F6), no borders, rounded corners
- Buttons: Full-width, blue background, white text, 6rem padding
- Forms: 24px gap between fields
- Responsive: Mobile-friendly padding and spacing

## Future Enhancements

1. **Backend Integration**: Connect to actual authentication service
2. **OAuth**: Implement real Google/Facebook authentication
3. **Email Verification**: Send real verification emails
4. **Password Strength**: Add visual strength indicator
5. **Error Handling**: Implement comprehensive error handling
6. **Session Management**: Add proper session/JWT token handling
7. **Remember Me**: Add "remember me" functionality for login
8. **Forgot Password**: Add password reset flow

## Testing the Flow

### Manual Testing Steps

1. **Login Flow**:
   - Navigate to `/login`
   - Enter any email and password
   - Should redirect to `/dashboard`

2. **Complete Registration**:
   - Go to `/register`
   - Enter email/phone → Continue
   - Fill account details → Create Account
   - Review verification page
   - Manual navigation to store creation (in production, email would do this)
   - Fill store details → Create Store
   - Should see dashboard with store information

3. **Data Persistence**:
   - Open browser DevTools → Application → LocalStorage
   - Check keys: `registerEmail`, `registerData`, `storeData`
   - Data should be visible at each step

4. **Dashboard**:
   - After completing registration flow
   - Dashboard should display store name, owner name, business type
   - Logout button clears all localStorage data
