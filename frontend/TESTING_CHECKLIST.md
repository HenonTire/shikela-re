# Testing Checklist - Shikela Authentication

Complete this checklist to ensure all authentication features are working correctly.

## 🧪 Pre-Testing Setup

- [ ] Click "Preview" button to start the app
- [ ] Open DevTools (F12)
- [ ] Go to Application → LocalStorage → Your Domain
- [ ] Have browser ready for testing

## 🔑 Login Flow Tests

### Login Form Display
- [ ] `/login` route loads without errors
- [ ] "Shikela" header visible
- [ ] "Login to your account" title shown
- [ ] "Login to access your shikela account" subtitle shown
- [ ] Email/phone input field visible
- [ ] Password input field visible
- [ ] "Continue with email" button visible (blue)
- [ ] "Continue with Google" button visible
- [ ] "Don't have an account?" link visible
- [ ] "Sign Up" link is clickable and blue
- [ ] Terms & Privacy footer is visible with links

### Login Form Validation
- [ ] Click "Continue with email" without filling form
- [ ] Error: "Email or phone is required" appears
- [ ] Error: "Password is required" appears
- [ ] Enter email without password, click continue
- [ ] Error: "Password is required" appears
- [ ] Errors disappear as user types in fields
- [ ] Error styling is red/clear

### Login Form Submission
- [ ] Enter valid email: `test@example.com`
- [ ] Enter valid password: `TestPassword123`
- [ ] Click "Continue with email"
- [ ] Button shows loading state (optional)
- [ ] After ~500ms delay, redirects to `/dashboard`
- [ ] No errors on dashboard load

## 📝 Registration Step 1 - Email Entry

### Form Display
- [ ] `/register` route loads without errors
- [ ] "Shikela" header visible
- [ ] "Create a new account" title shown
- [ ] "Create an account to start using shikela" subtitle shown
- [ ] Email/phone input visible
- [ ] "Continue with email" button visible (blue)
- [ ] "Continue with Google" button visible
- [ ] "Continue with Facebook" button visible
- [ ] "Already have an account?" link visible
- [ ] "Sign In" link is blue and clickable
- [ ] Terms & Privacy footer visible

### Form Validation
- [ ] Click "Continue with email" without input
- [ ] Error: "Email or phone is required" appears
- [ ] Error disappears as user types
- [ ] Cannot submit empty form

### Form Submission
- [ ] Enter email: `register@example.com`
- [ ] Click "Continue with email"
- [ ] After ~300ms, redirects to `/register/form`
- [ ] Email stored in localStorage (`registerEmail`)
- [ ] Check DevTools → Application → LocalStorage
- [ ] Should see: `registerEmail: "register@example.com"`

### Navigation to Login
- [ ] Click "Sign In" link
- [ ] Redirects to `/login`
- [ ] Can go back to login form

## 📋 Registration Step 2 - Account Details

### Form Display
- [ ] `/register/form` loads without errors
- [ ] "Shikela" header visible
- [ ] "Create a new account" title shown
- [ ] "Create an account to start using shikela" subtitle shown
- [ ] First Name field visible with label
- [ ] Last Name field visible with label
- [ ] Phone Number field visible with label
- [ ] Password field visible with label
- [ ] Terms checkbox visible
- [ ] "Create Account" button visible (blue)
- [ ] Terms & Privacy footer visible

### Form Validation - Required Fields
- [ ] Leave First Name empty, submit
- [ ] Error: "First name is required"
- [ ] Leave Last Name empty, submit
- [ ] Error: "Last name is required"
- [ ] Leave Phone empty, submit
- [ ] Error: "Phone number is required"
- [ ] Leave Password empty, submit
- [ ] Error: "Password is required"
- [ ] Uncheck terms, submit
- [ ] Error: "You must agree..."

### Form Validation - Password Requirements
- [ ] Enter password: `short`
- [ ] Error: "Password must be at least 8 characters"
- [ ] Enter password: `alllowercase123`
- [ ] Error: "Password must contain an uppercase letter"
- [ ] Enter password: `NODIGITS`
- [ ] Error: "Password must contain a number"
- [ ] Enter password: `ValidPass123`
- [ ] No error, valid password

### Form Validation - Phone Number
- [ ] Enter phone: `+251 911234567` (Ethiopian)
- [ ] Accepts input without error
- [ ] Can use different formats
- [ ] Placeholder shows: `+251 9XX XXX XXX`

### Form Layout - Responsive
- [ ] First Name and Last Name on same row (desktop)
- [ ] Stack vertically on mobile
- [ ] All fields same width
- [ ] Proper spacing between fields

### Form Submission
- [ ] Fill all fields correctly:
  - First Name: `John`
  - Last Name: `Doe`
  - Phone: `+251 911234567`
  - Password: `ValidPass123`
  - Check terms agreement
- [ ] Click "Create Account"
- [ ] Button shows loading state
- [ ] After ~300ms, redirects to `/register/verify`
- [ ] Check localStorage for `registerData`
- [ ] Should contain: email, firstName, lastName, phone, password

## ✉️ Registration Step 3 - Email Verification

### Form Display
- [ ] `/register/verify` loads without errors
- [ ] "Shikela" header visible
- [ ] "Verify your account" title shown
- [ ] Verification message shown
- [ ] Email address displayed (from Step 1)
- [ ] "Resend email" button visible
- [ ] No Terms/Privacy footer (showFooter={false})

### Email Display
- [ ] Shows: "Please verify your email address by following the link sent to..."
- [ ] Shows actual email: `register@example.com`
- [ ] Email is highlighted in blue
- [ ] Email text is correct

### Resend Email Button
- [ ] "Resend email" button is clickable
- [ ] Click button
- [ ] Button shows loading state (`isResending`)
- [ ] After ~500ms, button returns to normal
- [ ] No actual email sent (this is frontend mock)

### Navigation to Store Creation
- [ ] Manually navigate to `/register/store`
- [ ] Page loads successfully
- [ ] OR wait for user to click email link (in production)

### Helpful Text
- [ ] Shows: "Didn't receive the email? Check your spam folder..."
- [ ] Shows: "or try another email" link (placeholder)

## 🏪 Registration Step 4 - Store Creation

### Form Display
- [ ] `/register/store` loads without errors
- [ ] "Shikela" header visible
- [ ] "Create a new store" title shown
- [ ] Store Name field visible with label
- [ ] Business Type dropdown visible with label
- [ ] Store Logo upload area visible with label
- [ ] "Create Store" button visible (blue)
- [ ] Terms & Privacy footer visible

### Store Name Validation
- [ ] Leave empty and submit
- [ ] Error: "Store name is required"
- [ ] Enter: `AB` and submit
- [ ] Error: "Store name must be at least 3 characters"
- [ ] Enter: `My Shop` and no error

### Business Type Validation
- [ ] Click dropdown before selection
- [ ] Shows placeholder: "Select a type"
- [ ] Click dropdown to open
- [ ] Shows all 8 categories:
  - [ ] Clothing & Fashion
  - [ ] Electronics
  - [ ] Food & Beverage
  - [ ] Home & Garden
  - [ ] Beauty & Personal Care
  - [ ] Sports & Outdoors
  - [ ] Books & Media
  - [ ] Other
- [ ] Can select any option
- [ ] Selected option displays in field
- [ ] Don't submit without selection
- [ ] Error: "Business type is required"

### Logo Upload - Drag & Drop
- [ ] Logo area shows dashed border
- [ ] Logo area shows upload icon
- [ ] Logo area shows text: "Upload your store logo"
- [ ] Logo area shows: "PNG or SVG recommended"
- [ ] Hover over area → visual feedback
- [ ] Drag image file over area
- [ ] Border changes color (highlight)
- [ ] Drop image → preview appears
- [ ] Preview shows image thumbnail
- [ ] Preview shows: "Click or drag to replace"

### Logo Upload - Click to Upload
- [ ] Click on upload area
- [ ] File browser opens
- [ ] Can select image file (PNG, JPG, SVG, etc.)
- [ ] Selected image appears as preview
- [ ] Non-image files are rejected
- [ ] Image preview is 80px square

### Logo Upload - Optional
- [ ] Submit form without logo
- [ ] No error
- [ ] Form accepts submission
- [ ] Logo is optional (not required)

### Form Submission - Valid Data
- [ ] Fill:
  - Store Name: `My Clothing Shop`
  - Business Type: `Clothing & Fashion`
  - Logo: (optional) Upload image or skip
- [ ] Click "Create Store"
- [ ] Button shows loading state
- [ ] After ~500ms, redirects to `/dashboard`

### LocalStorage Final State
- [ ] Check localStorage
- [ ] Key `storeData` exists
- [ ] Contains all fields: email, firstName, lastName, phone, password, storeName, businessType, logo
- [ ] Keys `registerEmail` and `registerData` are cleared
- [ ] Only `storeData` remains for dashboard

## 📊 Dashboard Tests

### Dashboard Display
- [ ] `/dashboard` loads without errors
- [ ] "Shikela" header visible in top-left
- [ ] Page title: "Welcome, John!"
- [ ] Shows: "Your account has been successfully created..."
- [ ] Card shows store info:
  - [ ] "Your Store: My Clothing Shop"
  - [ ] Business Type: Clothing & Fashion
  - [ ] Owner: John Doe
  - [ ] Email: register@example.com
- [ ] "Quick Actions" section visible
- [ ] Action buttons: Add Products, Manage Store, View Analytics
- [ ] Footer with support link

### Dashboard Data Display
- [ ] First name from Step 2 displays: `John`
- [ ] Last name from Step 2 displays: `Doe`
- [ ] Store name from Step 4 displays: `My Clothing Shop`
- [ ] Business type from Step 4 displays: `Clothing & Fashion`
- [ ] Email from Step 1 displays: `register@example.com`
- [ ] All data is read from localStorage

### Logout Functionality
- [ ] "Logout" button visible in header
- [ ] Click "Logout"
- [ ] Confirmation or immediate redirect
- [ ] Redirects to `/login`
- [ ] localStorage is completely cleared
- [ ] Check DevTools → LocalStorage is empty
- [ ] All previous data is gone

### Dashboard - After Logout & New Registration
- [ ] Can register new account
- [ ] Previous data doesn't appear
- [ ] Each registration is independent
- [ ] localStorage is fresh for each user

## 🔄 Navigation & Routing Tests

### Route Accessibility
- [ ] `/login` - accessible
- [ ] `/` - redirects to `/login`
- [ ] `/register` - accessible
- [ ] `/register/form` - accessible
- [ ] `/register/verify` - accessible
- [ ] `/register/store` - accessible
- [ ] `/dashboard` - accessible

### Back Button Navigation
- [ ] Login page → Click "Sign Up" → `/register`
- [ ] Register page → Click "Sign In" → `/login`
- [ ] Browser back button works
- [ ] Previous page data restored (if cached)

### Direct Route Access
- [ ] Type `/login` directly → loads correctly
- [ ] Type `/register` directly → loads correctly
- [ ] Type `/dashboard` directly → loads (if no auth check)
- [ ] All routes are accessible

## 📱 Responsive Design Tests

### Mobile (375px width)
- [ ] All inputs are full width
- [ ] Text is readable
- [ ] Buttons are full width
- [ ] Touch targets > 44px height
- [ ] First/Last name stack vertically
- [ ] Inputs are tappable
- [ ] Keyboard opens for text fields

### Tablet (768px width)
- [ ] Layout is centered
- [ ] Forms are readable
- [ ] Proper spacing maintained
- [ ] Two-column layouts appear
- [ ] Button hover states work

### Desktop (1440px width)
- [ ] Layout is centered with max-width
- [ ] Proper spacing on both sides
- [ ] Form is centered on page
- [ ] Hover effects visible
- [ ] Cursor changes on interactive elements

## ♿ Accessibility Tests

### Keyboard Navigation
- [ ] Tab through form fields
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Enter key submits form
- [ ] Escape key works if implemented
- [ ] Can reach all interactive elements

### Screen Reader (Optional)
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Button purpose is clear
- [ ] Links have descriptive text

### Color Contrast
- [ ] Text is readable on background
- [ ] Error text has sufficient contrast
- [ ] Links are distinguishable
- [ ] No information conveyed by color alone

## 🎨 Visual Design Tests

### Colors
- [ ] Buttons are blue (#2563EB)
- [ ] Input backgrounds are light gray
- [ ] Text is dark gray/black
- [ ] Links are blue
- [ ] Error text is red/noticeable

### Typography
- [ ] Headings are large and bold
- [ ] Body text is readable
- [ ] Labels are visible
- [ ] Placeholders are subtle
- [ ] Consistent font family throughout

### Spacing
- [ ] No overlapping elements
- [ ] Proper padding around inputs
- [ ] Adequate button height (48px+)
- [ ] Good spacing between form sections

### Components
- [ ] Buttons have clear active states
- [ ] Inputs have visible focus states
- [ ] Checkboxes are clearly checkbox-like
- [ ] Dropdowns show selected value
- [ ] Upload area is clearly interactive

## 🔐 Security & Data Tests

### Password Security
- [ ] Password field is type="password"
- [ ] Password is not logged in console
- [ ] Password is in localStorage (note: temporary only)
- [ ] Password requirements enforced
- [ ] Cannot see password in input

### Email Validation
- [ ] Accepts email format
- [ ] Accepts phone format
- [ ] Doesn't validate format strictly (frontend only)

### Data Persistence
- [ ] Data survives page refresh (F5)
- [ ] Data persists between form steps
- [ ] Data can be cleared on logout
- [ ] No sensitive data in URLs
- [ ] No data in cookies (unless set)

## 🚨 Error Handling Tests

### Form Errors
- [ ] Error messages appear below fields
- [ ] Error text is red and clear
- [ ] Errors prevent submission
- [ ] Multiple errors can show
- [ ] Errors clear when field is fixed

### Network Errors (Future)
- [ ] Test with offline mode (DevTools)
- [ ] Graceful error handling needed
- [ ] User is informed of errors
- [ ] Can retry failed submissions

## 🎯 Integration Tests

### Complete User Flow - Login
- [ ] Start at `/login`
- [ ] Enter credentials
- [ ] Reach `/dashboard`
- [ ] No errors throughout
- [ ] Data is consistent

### Complete User Flow - Registration
- [ ] Start at `/register`
- [ ] Complete all 4 steps
- [ ] Reach `/dashboard`
- [ ] Dashboard shows all data correctly
- [ ] Data matches what was entered
- [ ] No data loss between steps

### Data Consistency
- [ ] All entered data appears on dashboard
- [ ] No data is truncated
- [ ] Special characters are preserved
- [ ] Unicode/emoji handled correctly

## 📊 Performance Tests

### Page Load Time
- [ ] Pages load in < 2 seconds
- [ ] Forms are interactive immediately
- [ ] Buttons respond immediately to clicks

### Form Performance
- [ ] Validation is instant (< 100ms)
- [ ] Typing doesn't lag
- [ ] Dropdown opens quickly
- [ ] File preview is quick

### Network Requests (DevTools)
- [ ] Minimal requests to load pages
- [ ] No unnecessary API calls
- [ ] CSS/JS are optimized

## 🔄 Cross-Browser Tests

- [ ] Chrome - Full test suite
- [ ] Firefox - Full test suite
- [ ] Safari - Full test suite
- [ ] Edge - Full test suite
- [ ] Mobile Safari (iOS) - Mobile tests
- [ ] Chrome Mobile (Android) - Mobile tests

## ✅ Final Sign-Off

After completing all tests above, mark these:

- [ ] All login tests passed
- [ ] All registration tests passed
- [ ] All dashboard tests passed
- [ ] All navigation tests passed
- [ ] All responsive design tests passed
- [ ] All accessibility tests passed
- [ ] All visual design tests passed
- [ ] All data persistence tests passed
- [ ] All error handling tests passed
- [ ] All integration tests passed
- [ ] All performance tests passed
- [ ] All cross-browser tests passed

## 📝 Notes & Issues Found

Use this space to document any issues:

```
Issue 1:
- Description:
- Steps to reproduce:
- Expected:
- Actual:
- Severity: (Critical/High/Medium/Low)

Issue 2:
...
```

---

## 🎉 Testing Complete!

All tests passed? Congratulations! Your Shikela authentication is production-ready! 🚀
