# Verify Storefront Environment Variables

## Required Variables in Railway Dashboard

Go to: **Railway Dashboard → Storefront Service → Variables**

Verify these three variables are set EXACTLY as shown:

### ✅ Variable 1: NEXT_PUBLIC_SALEOR_API_URL

```
Name: NEXT_PUBLIC_SALEOR_API_URL
Value: https://web-production-82856.up.railway.app/graphql/
```

⚠️ Must end with `/graphql/` (trailing slash required)

### ✅ Variable 2: NEXT_PUBLIC_STOREFRONT_URL

```
Name: NEXT_PUBLIC_STOREFRONT_URL
Value: https://neo-storefront-production.up.railway.app
```

⚠️ Must NOT have trailing slash

### ✅ Variable 3: NEXT_PUBLIC_DEFAULT_CHANNEL

```
Name: NEXT_PUBLIC_DEFAULT_CHANNEL
Value: default-channel
```

## Common Mistakes to Avoid

1. ❌ Wrong variable name (case-sensitive):

   - `NEXT_PUBLIC_SALEOR_API` ❌ (missing \_URL)
   - `next_public_saleor_api_url` ❌ (lowercase)
   - ✅ `NEXT_PUBLIC_SALEOR_API_URL` ✅ (correct)

2. ❌ Wrong URL format:

   - `http://web-production-82856.up.railway.app/graphql/` ❌ (http instead of https)
   - `https://web-production-82856.up.railway.app/graphql` ❌ (missing trailing slash)
   - ✅ `https://web-production-82856.up.railway.app/graphql/` ✅ (correct)

3. ❌ Storefront URL with trailing slash:

   - `https://neo-storefront-production.up.railway.app/` ❌ (has trailing slash)
   - ✅ `https://neo-storefront-production.up.railway.app` ✅ (correct)

4. ❌ Variables set after build started:
   - Variables must be set BEFORE triggering deployment
   - Set them, save, THEN trigger new deployment

## Verification Steps

1. **Check Railway Dashboard:**

   - Go to Storefront Service → Variables
   - Count: Should see exactly 3 variables with NEXT*PUBLIC* prefix
   - Verify each one matches the format above

2. **Trigger New Deployment:**

   - After setting/updating variables
   - Go to Deployments tab
   - Click "Redeploy" or wait for auto-redeploy

3. **Check Build Logs:**
   - Open the deployment
   - Check Build Logs section
   - Look for errors about missing variables
   - Look for successful Next.js build completion

## What Error Message Did You See?

Share the exact error from Railway logs so we can fix it:

- "Missing NEXT_PUBLIC_SALEOR_API_URL" → Variable not set or wrong name
- "Build failed" → Check build logs for specific error
- "Docker build error" → Usually means ARG variables not passed correctly
- "Runtime error" → Variables embedded incorrectly in build
