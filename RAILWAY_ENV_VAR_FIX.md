# Railway Environment Variable Fix

## Root Cause Identified ✅

Build logs confirm that Railway is **NOT** passing these variables to the build phase:
- ❌ `NEXT_PUBLIC_PICKUP_SERVICE_URL` - MISSING
- ❌ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - MISSING

**Present variables (working):**
- ✅ `NEXT_PUBLIC_DEFAULT_CHANNEL`
- ✅ `NEXT_PUBLIC_STOREFRONT_URL`
- ✅ `NEXT_PUBLIC_SALEOR_API_URL`

## Why This Happens

Railway may not pass all environment variables to the build phase if:
1. Variables are set at the wrong scope (project vs service)
2. Variables were set after the service was created
3. Variables need to be explicitly marked for build-time access

## Solution: Verify and Re-set Variables

### Step 1: Check Current Variables

Using Railway CLI:
```bash
railway service
# Select "saleor-storefront" or your storefront service name
railway variables | grep NEXT_PUBLIC
```

### Step 2: Verify Variable Scope

Variables should be set at the **SERVICE level**, not project level.

**Using Railway Dashboard:**
1. Go to Railway Dashboard → Your Storefront Service
2. Click "Variables" tab
3. Ensure variables are listed under the **service**, not the project

### Step 3: Re-set Missing Variables

**Option A: Using Railway CLI (Recommended)**

```bash
# Link to storefront service
railway service
# Select your storefront service

# Set the missing variables
railway variables --set "NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app"
railway variables --set "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBdLp3Ivz6GCw-x4IasNDHIZEnT1pxMbLg"

# Verify they're set
railway variables | grep NEXT_PUBLIC
```

**Option B: Using Railway Dashboard**

1. Go to Railway Dashboard → Storefront Service → Variables
2. Click "+ New Variable"
3. Add:
   - Name: `NEXT_PUBLIC_PICKUP_SERVICE_URL`
   - Value: `https://pickup-service-production.up.railway.app`
4. Click "+ New Variable" again
5. Add:
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: `AIzaSyBdLp3Ivz6GCw-x4IasNDHIZEnT1pxMbLg`
6. Save both variables

### Step 4: Trigger a New Build

After setting variables, trigger a new build:

**Option A: Via Git Push**
```bash
echo "# Rebuild after env var fix - $(date)" >> .rebuild-trigger
git add .rebuild-trigger
git commit -m "chore: Trigger rebuild after setting env vars"
git push origin main
```

**Option B: Via Railway Dashboard**
1. Go to Railway Dashboard → Storefront Service → Deployments
2. Click "Redeploy" on the latest deployment

### Step 5: Verify Build Logs

After the build starts, check the build logs for:
```
[ENV CHECK] All NEXT_PUBLIC_* variables during build: {
  "count": 5,  // Should be 5, not 3
  "variables": {
    "NEXT_PUBLIC_DEFAULT_CHANNEL": "default-channel",
    "NEXT_PUBLIC_STOREFRONT_URL": "...",
    "NEXT_PUBLIC_SALEOR_API_URL": "...",
    "NEXT_PUBLIC_PICKUP_SERVICE_URL": "https://pickup-service-production.up.railway.app",  // ✅ Should appear
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "AIzaSy..."  // ✅ Should appear
  }
}
```

## Troubleshooting

### If Variables Still Don't Appear in Build

1. **Check Variable Names**: Ensure no typos (case-sensitive)
2. **Check Service Selection**: Make sure you're setting variables on the correct service
3. **Try Deleting and Re-adding**: Sometimes Railway needs variables to be re-added
4. **Check Railway Plan**: Some Railway plans have limitations on environment variables

### Alternative: Use Railway's Build Args

If variables still don't work, you can try using `railway.toml` to pass build arguments:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "NEXT_PUBLIC_PICKUP_SERVICE_URL=$NEXT_PUBLIC_PICKUP_SERVICE_URL NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY pnpm build"
```

However, this is a workaround - the proper solution is to ensure Railway passes variables to the build phase.

## Expected Result

After fixing:
- ✅ Build logs show all 5 NEXT_PUBLIC_* variables
- ✅ No warnings about missing variables
- ✅ Build succeeds
- ✅ Frontend features appear (Click & Collect toggle, etc.)

