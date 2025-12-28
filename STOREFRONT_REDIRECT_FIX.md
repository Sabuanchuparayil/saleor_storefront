# Storefront Redirect Loop Fix

## Problem

`ERR_TOO_MANY_REDIRECTS` on `neo-storefront-production.up.railway.app`

## Common Causes

### 1. NEXT_PUBLIC_STOREFRONT_URL Mismatch

The most common cause is when `NEXT_PUBLIC_STOREFRONT_URL` doesn't match the actual Railway URL.

**Fix:**

- In Railway Dashboard → Storefront Service → Variables
- Set `NEXT_PUBLIC_STOREFRONT_URL` to: `https://neo-storefront-production.up.railway.app`
- Make sure there's no trailing slash

### 2. Channel Slug Mismatch

If `NEXT_PUBLIC_DEFAULT_CHANNEL` doesn't match an active channel in your Saleor backend.

**Fix:**

- Check your Saleor backend for active channels
- Set `NEXT_PUBLIC_DEFAULT_CHANNEL` to match an active channel slug
- Common values: `default-channel`, `channel-pln`, `channel-usd`

### 3. Required Environment Variables

**In Railway Dashboard → Storefront Service → Variables, ensure these are set:**

```
NEXT_PUBLIC_SALEOR_API_URL=https://your-backend-url.up.railway.app/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

Replace `your-backend-url.up.railway.app` with your actual Saleor backend URL.

## Verification Steps

1. Check Railway logs for the storefront service
2. Verify environment variables match your actual URLs
3. Ensure the channel slug exists in your Saleor backend
4. Redeploy after changing environment variables
