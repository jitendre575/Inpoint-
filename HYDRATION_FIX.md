# Hydration Mismatch Fix

## Issue
The Next.js application was experiencing a hydration mismatch error:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

The error showed a `__processed_45c8ff66-c873-4918-9b52-f4bc447e1b15__` attribute being added to the `<body>` tag, which was causing the mismatch.

## Root Cause
The hydration mismatch occurred because components were accessing browser-only APIs (`window`, `navigator`, `localStorage`) during the initial render. This caused the server-rendered HTML to differ from the client-rendered HTML:

1. **`app/page.tsx`**: Accessed `navigator.userAgent` and `window.innerWidth` immediately in a `useEffect` without waiting for client-side mounting
2. **`components/support-floating-button.tsx`**: Accessed `localStorage` and `window` immediately in a `useEffect` without waiting for client-side mounting

## Solution
Added a `mounted` state to both components to ensure they don't access browser APIs until after the component has mounted on the client side. This ensures:

1. **Server renders**: A loading state or null
2. **Client hydrates**: The same loading state or null
3. **After hydration**: The component can safely access browser APIs

### Changes Made

#### 1. `app/page.tsx`
- Added `mounted` state that starts as `false`
- Added a `useEffect` that sets `mounted` to `true` immediately after mount
- Modified the device detection `useEffect` to only run when `mounted` is `true`
- Added an early return to show a loading spinner until the component is mounted

#### 2. `components/support-floating-button.tsx`
- Added `mounted` state that starts as `false`
- Added a `useEffect` that sets `mounted` to `true` immediately after mount
- Modified the auth checking `useEffect` to only run when `mounted` is `true`

## Technical Details

### Why This Works
React's hydration process expects the server-rendered HTML to match the initial client render. By:
1. Not accessing browser APIs until after mount
2. Rendering the same content on server and initial client render
3. Only accessing browser APIs after the `mounted` state becomes `true`

We ensure that the server and client render identical HTML during hydration, preventing the mismatch error.

### Pattern Used
```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

useEffect(() => {
  if (!mounted) return
  // Safe to access browser APIs here
}, [mounted])

if (!mounted) {
  return <LoadingState />
}
```

## Verification
After these changes, the hydration mismatch error should no longer appear in the browser console. The application will:
1. Show a loading state briefly on initial load
2. Detect the device type after mounting
3. Redirect to appropriate pages without hydration errors

## Additional Notes
- The `__processed_*` attribute mentioned in the error is likely from a browser extension and is not part of your code
- These fixes follow Next.js best practices for client-side only code
- The pattern can be reused for any component that needs to access browser APIs during render

## Browser Extension Interference

### Issue: `bis_skin_checked` Attribute
Some browser extensions (particularly autofill, password managers, or form-filling extensions) add a `bis_skin_checked="1"` attribute to HTML elements. This can cause hydration mismatches because:
1. The server renders HTML without this attribute
2. The browser extension adds the attribute before React hydrates
3. React detects a mismatch between server and client HTML

### Solutions Implemented

#### 1. `suppressHydrationWarning` Attribute
Added to `<html>` and `<body>` tags in `app/layout.tsx`:
```tsx
<html lang="en" suppressHydrationWarning>
  <body className={`${geist.className} antialiased`} suppressHydrationWarning>
```

This tells React to ignore hydration mismatches on these specific elements.

#### 2. CSS Rule to Neutralize Extension Effects
Added to `app/globals.css`:
```css
[bis_skin_checked] {
  animation: none !important;
}
```

This prevents any animations or visual effects that the extension might apply.

### For End Users
If you continue to see hydration warnings in the console:
1. **Disable browser extensions** temporarily to verify they're the cause
2. **Common culprits**: LastPass, Dashlane, Grammarly, autofill extensions
3. **In production**: These warnings won't affect functionality and won't be visible to users
4. **For development**: The warnings are suppressed and won't impact the app's behavior
