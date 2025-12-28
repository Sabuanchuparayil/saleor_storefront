# Geocoding Setup Guide

## Error: "Address geocoding is not configured"

This error appears when you try to use the address search feature in the Click & Collect modal, but the Google Maps API key is not configured.

## Solution Options

### Option 1: Configure Google Maps API Key (Recommended for Address Search)

If you want users to be able to search for addresses, you need to set up a Google Maps API key:

1. **Get a Google Maps API Key:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Geocoding API"
   - Create credentials (API Key)
   - Restrict the API key to "Geocoding API" for security

2. **Add to Environment Variables:**

   In your `.env.local` file (for local development):

   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
   ```

   For production (Railway/Vercel/etc.):

   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your environment variables
   - Set the value to your Google Maps API key

3. **Restart Development Server:**
   ```bash
   # Stop the dev server (Ctrl+C) and restart
   pnpm dev
   # or
   npm run dev
   ```

### Option 2: Use "Use My Location" Button (No API Key Required)

The Click & Collect feature works **without** geocoding! Users can:

- ✅ Click "Use My Location" button (uses browser geolocation)
- ✅ Find nearby warehouses
- ✅ Select a warehouse
- ✅ Browse products available at that warehouse

**Address search is optional** - the feature is fully functional without it.

## Current Behavior

- ✅ **"Use My Location" button**: Works without API key (uses browser geolocation)
- ⚠️ **Address search**: Shows warning if API key not configured
- ✅ **Warehouse selection**: Works regardless of geocoding configuration

## Quick Fix

If you don't need address search, you can ignore this error. The "Use My Location" button will work fine.

If you want address search:

1. Get Google Maps API key
2. Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key` to `.env.local`
3. Restart dev server

## Cost Considerations

- Google Maps Geocoding API has a free tier (first $200/month free)
- For most small to medium stores, this is sufficient
- You can set usage limits in Google Cloud Console

## Security Best Practices

1. **Restrict API Key:**

   - Restrict to "Geocoding API" only
   - Add HTTP referrer restrictions (your domain)
   - Set usage quotas

2. **Don't Commit API Keys:**
   - Never commit `.env.local` to git
   - Use environment variables in production
   - Rotate keys if accidentally exposed

## Testing

After setting up the API key:

1. Open Click & Collect modal
2. Try entering an address
3. Click "Search"
4. Should geocode the address and find nearby warehouses

If you see the error, check:

- ✅ API key is set in `.env.local`
- ✅ Dev server was restarted after adding the key
- ✅ API key has Geocoding API enabled
- ✅ API key restrictions allow your domain
