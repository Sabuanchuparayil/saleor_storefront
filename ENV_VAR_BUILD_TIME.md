# Environment Variables Not Embedded at Build Time

## Problem

Console shows:
```
[PickupHeaderContent] Not rendering: {
  mounted: true, 
  hasPickupServiceUrl: false, 
  pickupServiceUrl: undefined
}
```

## Root Cause

**Next.js embeds `NEXT_PUBLIC_*` environment variables at BUILD TIME, not runtime.**

If the variables weren't available during the build process, they become `undefined` in the JavaScript bundle, even if they're set in Railway.

## Why This Happens

1. Variables were set in Railway **after** the build completed
2. Variables weren't available during the build process
3. Next.js replaces `process.env.NEXT_PUBLIC_*` during compilation
4. If variable is missing, it becomes `undefined` in the bundle

## Solution

### Step 1: Verify Variables Are Set

```bash
railway service
# Select storefront service
railway variables | grep NEXT_PUBLIC
```

Ensure these are set:
- `NEXT_PUBLIC_PICKUP_SERVICE_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_DEFAULT_CHANNEL`
- `NEXT_PUBLIC_SALEOR_API_URL`

### Step 2: Trigger a New Build

**Option A: Via Git Push (Recommended)**
```bash
# Make any small change
echo "# Rebuild $(date)" >> .rebuild-trigger
git add .rebuild-trigger
git commit -m "chore: Trigger rebuild"
git push origin main
```

**Option B: Via Railway Dashboard**
1. Go to Railway Dashboard → Storefront Service
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

### Step 3: Verify After Deployment

1. Wait for build to complete (1-3 minutes)
2. Clear browser cache or use incognito mode
3. Open browser console (F12)
4. Check for:
   - `pickupServiceUrl` should have a value (not `undefined`)
   - No `[PickupHeaderContent] Not rendering` warnings
   - Click & Collect toggle should appear in header

## How Next.js Handles Environment Variables

### Build Time (Embedded)
- `NEXT_PUBLIC_*` variables are replaced during build
- Values are embedded directly into JavaScript bundle
- Available in both server and client code
- **Must be set before build starts**

### Runtime (Not Embedded)
- Regular environment variables (without `NEXT_PUBLIC_`)
- Only available in server-side code
- Not accessible in client-side JavaScript

## Verification

After rebuild, check the built JavaScript:

1. Open browser DevTools → Sources tab
2. Navigate to `_next/static/chunks/`
3. Search for `NEXT_PUBLIC_PICKUP_SERVICE_URL`
4. If found with a value → Variables are embedded ✅
5. If not found or `undefined` → Variables not embedded ❌

## Prevention

Always ensure environment variables are set **before** triggering a build:

1. Set variables in Railway first
2. Then trigger build/deployment
3. Verify variables are embedded in build logs

## Troubleshooting

### Variables Set But Still Undefined

1. **Check build logs** - Look for environment variable values
2. **Verify variable names** - Must start with `NEXT_PUBLIC_`
3. **Check for typos** - Variable names are case-sensitive
4. **Trigger new build** - Variables must be available during build

### Build Succeeds But Variables Missing

1. Variables might be set at service level but not environment level
2. Check Railway Dashboard → Variables → Ensure they're set for the correct environment
3. Some Railway plans have variable limits - check if you've hit the limit

### Variables Visible in Railway But Not in Build

1. Variables might be set after build started
2. Railway might cache old builds
3. Solution: Trigger a fresh build after setting variables

