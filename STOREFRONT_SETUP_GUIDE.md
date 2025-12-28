# Storefront Setup & Fix Guide

## Current Configuration

- **Backend API URL**: `https://web-production-82856.up.railway.app/graphql/`
- **Storefront URL**: `https://neo-storefront-production.up.railway.app`

## Step 1: Set Required Environment Variables

Go to **Railway Dashboard → Your Storefront Service → Variables**

Set these three environment variables:

### 1. NEXT_PUBLIC_SALEOR_API_URL

```
Value: https://web-production-82856.up.railway.app/graphql/
```

**Important:** Must include the trailing slash `/`

### 2. NEXT_PUBLIC_STOREFRONT_URL

```
Value: https://neo-storefront-production.up.railway.app
```

**Important:**

- NO trailing slash
- Must match your actual Railway domain exactly
- Use `https://` not `http://`

### 3. NEXT_PUBLIC_DEFAULT_CHANNEL

```
Value: default-channel
```

**Note:** If this doesn't work, see Step 2 to find the correct channel slug.

## Step 2: Find the Correct Channel Slug (if needed)

If `default-channel` doesn't work, find the correct channel slug:

### Option A: Via GraphQL Playground

1. Visit: `https://web-production-82856.up.railway.app/graphql/`
2. Run this query:

```graphql
query {
	channels {
		slug
		isActive
		isDefault
	}
}
```

3. Use the `slug` of an active channel (preferably the default one)

### Option B: Via Railway CLI

```bash
cd /Users/apple/Desktop/saleor
railway ssh --service Saleor
python3 -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE','saleor.settings'); import django; django.setup(); from saleor.channel.models import Channel; channels = Channel.objects.filter(is_active=True); print('Active channels:'); [print(f\"  - {c.slug} (default: {c.is_default})\") for c in channels]"
```

## Step 3: Verify Build-Time Variables

Since Next.js requires `NEXT_PUBLIC_*` variables at build time, ensure they are set **before** the build runs.

If using Railway:

- Set variables in Railway Dashboard
- Trigger a new deployment (Railway will rebuild with the new variables)

## Step 4: Redeploy

After setting the variables:

- Railway should auto-redeploy
- OR manually trigger a redeploy from Railway Dashboard → Deployments

## Step 5: Verify Fix

1. Check deployment logs - should see successful build
2. Visit `https://neo-storefront-production.up.railway.app`
3. Should redirect to `https://neo-storefront-production.up.railway.app/{channel-slug}` without looping
4. Should see the storefront homepage

## Troubleshooting

### Issue: Build fails with "Missing NEXT_PUBLIC_SALEOR_API_URL"

- Ensure the variable is set in Railway **before** the build
- Variable name must be exactly `NEXT_PUBLIC_SALEOR_API_URL`

### Issue: Redirect loop persists

- Verify `NEXT_PUBLIC_STOREFRONT_URL` has NO trailing slash
- Verify it matches the actual Railway domain exactly
- Check that the channel slug exists and is active

### Issue: 404 on channel route

- The channel slug doesn't exist in your Saleor backend
- Find the correct channel slug using Step 2
- Update `NEXT_PUBLIC_DEFAULT_CHANNEL` with the correct slug

### Issue: API connection errors

- Verify backend is accessible: `https://web-production-82856.up.railway.app/graphql/`
- Check CORS settings in Saleor backend (should allow storefront domain)
