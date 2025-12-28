# Debug Frontend Features Not Showing

## Current Status

- ✅ All code is integrated correctly
- ✅ Components exist and are imported
- ✅ Environment variables are set in Railway
- ❌ Features are not visible in the frontend

## Debugging Steps

### Step 1: Check Browser Console

Open the browser console (F12) and look for:

1. **Debug messages from PickupHeaderContent:**
   ```
   [PickupHeaderContent] Not rendering: { mounted: true, hasPickupServiceUrl: false, ... }
   ```
   This will tell us if the environment variable is available at runtime.

2. **Any JavaScript errors:**
   - Import errors
   - Component errors
   - API errors

### Step 2: Verify Environment Variables in Build

Next.js embeds `NEXT_PUBLIC_*` variables at **build time**. To verify they're embedded:

1. **Check Railway build logs:**
   - Railway Dashboard → Storefront Service → Latest Deployment → Build Logs
   - Look for the build process
   - Check if variables are being read

2. **Check the built JavaScript:**
   - Open browser DevTools → Sources tab
   - Look for `_next/static/chunks/` files
   - Search for `NEXT_PUBLIC_PICKUP_SERVICE_URL`
   - If found, the variable is embedded
   - If not found, the variable wasn't available during build

### Step 3: Verify Component is in DOM

1. Open browser DevTools → Elements/Inspector
2. Search for `PickupHeaderContent` or `click-collect-toggle`
3. If not found, the component is returning `null`
4. Check the Header component - it should contain PickupHeaderContent

### Step 4: Check Network Requests

1. Open browser DevTools → Network tab
2. Reload the page
3. Look for requests to:
   - `/api/health` (health check)
   - Pickup service API calls
   - If no requests, the component isn't initializing

## Common Issues and Solutions

### Issue 1: Variables Not Embedded at Build Time

**Symptom:** Browser console shows `hasPickupServiceUrl: false`

**Solution:**
1. Verify variables are set BEFORE build
2. Trigger a new build after setting variables
3. Check build logs to confirm variables are read

### Issue 2: Component Returns Null Silently

**Symptom:** No errors, but component not visible

**Solution:**
- Check browser console for debug message
- Verify `NEXT_PUBLIC_PICKUP_SERVICE_URL` is set correctly
- Check if component is conditionally hidden

### Issue 3: Build Succeeded But Features Missing

**Symptom:** Deployment successful, but no features visible

**Possible Causes:**
1. Browser cache - clear cache or use incognito
2. Variables set after build - trigger rebuild
3. Component error - check browser console
4. CSS hiding component - check computed styles

## Quick Verification Commands

### Check Variables in Railway
```bash
railway service
# Select storefront service
railway variables | grep NEXT_PUBLIC
```

### Check Component Files Exist
```bash
ls -la src/ui/components/PickupHeaderContent.tsx
ls -la src/pickup-service/components/PickupModeModal.tsx
ls -la src/pickup-service/styles.css
```

### Check Integration
```bash
grep -r "PickupHeaderContent" src/ui/components/Header.tsx
grep -r "pickup-service/styles" src/app/layout.tsx
```

## Expected Behavior

After a successful build with variables embedded:

1. **Header should contain:**
   - Click & Collect toggle button
   - Warehouse name (if selected)

2. **Login page should contain:**
   - "Create one" link to registration page

3. **Registration page should contain:**
   - Registration form with all fields
   - Password strength indicator

4. **Clicking toggle should:**
   - Open location picker modal
   - Allow selecting location
   - Show nearby warehouses

## Next Steps

1. **Check browser console** for debug messages
2. **Verify variables in build** (check built JS files)
3. **Check component in DOM** (inspect element)
4. **Share findings** so we can fix the specific issue

