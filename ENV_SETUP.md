# Environment Variables Setup

## Required Variables

Add these to your `.env.local` file or Railway environment variables:

```env
# Pickup Service URL
NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app

# Channel Slug (should match your Saleor channel)
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel

# Optional: Google Maps API Key (for address geocoding)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Current Values

Based on your setup:

- **Pickup Service URL:** `https://pickup-service-production.up.railway.app`
- **Channel Slug:** Check your Saleor dashboard or use `default-channel`

## Setting in Railway

If deploying to Railway:

1. Go to Railway Dashboard
2. Select your storefront service
3. Go to **Variables** tab
4. Add each variable:
   - `NEXT_PUBLIC_PICKUP_SERVICE_URL`
   - `NEXT_PUBLIC_DEFAULT_CHANNEL`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)

## Verification

After setting variables, restart your dev server:

```bash
npm run dev
# or
pnpm dev
```

The Click & Collect toggle should now appear in the header!
