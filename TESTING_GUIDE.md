# Testing Guide - Click & Collect Integration

## 🚀 Dev Server Started

The development server should now be running at: **http://localhost:3000**

## ✅ Testing Checklist

### 1. Check Environment Variables

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

**If variables are missing:**

- The toggle won't appear
- Check browser console for warnings

### 2. Visual Check

1. **Open http://localhost:3000**
2. **Look at the header:**
   - Should see "Click & Collect" toggle button
   - Button should be on the left side of navigation

### 3. Test Toggle Functionality

1. **Click the "Click & Collect" toggle**

   - Modal should open
   - Should show location picker

2. **Test Location Access:**

   - Click "Use My Location"
   - Allow location permission
   - Warehouses should appear

3. **Test Warehouse Selection:**

   - Select a warehouse from the list
   - Modal should close
   - Warehouse name should appear in header
   - Toggle should be enabled (highlighted)

4. **Test Toggle Off:**
   - Click toggle again to disable
   - Warehouse name should disappear
   - Toggle should be disabled

### 4. Test Persistence

1. **Select a warehouse**
2. **Refresh the page**
3. **Warehouse should still be selected** (stored in localStorage)

### 5. Check Browser Console

Open DevTools (F12) and check for:

- ✅ No errors related to pickup-service
- ⚠️ Warnings about missing env vars (if not set)
- ✅ Network requests to pickup service when enabled

## 🐛 Troubleshooting

### Toggle Not Appearing

**Possible causes:**

1. Environment variables not set

   - Check `.env.local` file
   - Restart dev server after adding variables

2. Pickup service URL incorrect

   - Verify service is running: `https://pickup-service-production.up.railway.app/health`
   - Check Railway dashboard

3. Build errors
   - Check terminal for TypeScript/import errors
   - Run `npm run build` to see full errors

### Modal Not Opening

**Possible causes:**

1. JavaScript errors

   - Check browser console
   - Look for React errors

2. Component not rendering
   - Check if `PickupHeaderContent` is imported correctly
   - Verify `pickupService` is not null

### No Warehouses Found

**Possible causes:**

1. No warehouses with pickup enabled

   - Check Saleor dashboard
   - Verify warehouse metadata (lat/lng)

2. Location not accessible

   - Check browser location permissions
   - Try manual address entry

3. Pickup service not responding
   - Check service health endpoint
   - Verify OpenSearch is running

## 📊 Expected Behavior

### When Toggle is OFF:

- Regular product listing (from Saleor GraphQL)
- No warehouse filter
- Standard checkout flow

### When Toggle is ON:

- Products filtered by selected warehouse
- Only products available at warehouse shown
- Warehouse name displayed in header
- Checkout can use warehouse for pickup

## 🎯 Success Criteria

✅ Toggle appears in header  
✅ Modal opens on click  
✅ Location access works  
✅ Warehouses discovered  
✅ Warehouse selection works  
✅ State persists on refresh  
✅ Products update when enabled

## 📝 Next Steps After Testing

1. **If everything works:**

   - Deploy to production
   - Set environment variables in Railway
   - Test in production environment

2. **If issues found:**
   - Check error messages
   - Verify environment variables
   - Check pickup service logs
   - See troubleshooting section above

## 🔗 Useful Links

- Pickup Service Health: https://pickup-service-production.up.railway.app/health
- Railway Dashboard: https://railway.app
- Saleor Dashboard: Your Saleor instance
