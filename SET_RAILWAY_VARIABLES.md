# Set Railway Environment Variables for Storefront

## Required Variables for New Features

The following environment variables must be set in Railway for the new features to work:

### Click & Collect Features

```bash
NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBdLp3Ivz6GCw-x4IasNDHIZEnT1pxMbLg
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

### Registration Feature

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://saleor-production-0b1b.up.railway.app/graphql/
```

## How to Set Variables in Railway

### Option 1: Railway Dashboard (Recommended)

1. Go to **Railway Dashboard** → **Your Storefront Service** → **Variables** tab
2. Click **"+ New Variable"** for each variable
3. Add the variables listed above
4. **Save** and **Redeploy** the service

### Option 2: Railway CLI

```bash
# Link to your storefront service
railway service
# Select your storefront service

# Set variables
railway variables --set "NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app"
railway variables --set "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBdLp3Ivz6GCw-x4IasNDHIZEnT1pxMbLg"
railway variables --set "NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel"
railway variables --set "NEXT_PUBLIC_SALEOR_API_URL=https://saleor-production-0b1b.up.railway.app/graphql/"

# Verify
railway variables
```

## Verify Variables Are Set

After setting variables, verify they're correct:

```bash
railway variables | grep NEXT_PUBLIC
```

## After Setting Variables

1. **Redeploy** the storefront service (Railway will auto-redeploy, or manually trigger)
2. **Clear browser cache** or use incognito mode
3. **Check the frontend** - you should see:
   - Click & Collect toggle in the header
   - Registration link in login page
   - Location picker modal when clicking the toggle

## Troubleshooting

### Features Not Showing

1. **Check browser console** for errors
2. **Verify variables are set** in Railway Dashboard
3. **Check deployment logs** for build errors
4. **Clear browser cache** - Next.js caches environment variables at build time

### Click & Collect Toggle Not Visible

- Check `NEXT_PUBLIC_PICKUP_SERVICE_URL` is set
- Check browser console for errors
- Verify the PickupHeaderContent component is rendering (check page source)

### Registration Not Working

- Check `NEXT_PUBLIC_SALEOR_API_URL` is set correctly
- Verify the URL ends with `/graphql/`
- Check browser network tab for API errors

