# Complete Storefront Fix Guide

## Problem

1. Storefront deployment is failing
2. Redirect loop when accessing the storefront

## Root Causes

1. Missing environment variables (required at build time for Next.js)
2. Build arguments not configured in Railway
3. Environment variables not passed correctly to Docker build

## Solution

### Step 1: Create railway.toml (Already Created)

A `railway.toml` file has been created in the storefront directory. This ensures Railway passes build arguments correctly to the Dockerfile.

### Step 2: Set Environment Variables in Railway

Go to **Railway Dashboard → Storefront Service → Variables**

Set these three variables:

```
NEXT_PUBLIC_SALEOR_API_URL=https://web-production-82856.up.railway.app/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

**Important:**

- `NEXT_PUBLIC_SALEOR_API_URL` must end with `/graphql/` (with trailing slash)
- `NEXT_PUBLIC_STOREFRONT_URL` must NOT have trailing slash
- Both must use `https://` not `http://`

### Step 3: Commit and Push railway.toml

The `railway.toml` file needs to be committed to your repository:

```bash
cd /Users/apple/Desktop/saleor-storefront-src
git add railway.toml
git commit -m "Add railway.toml for build arguments"
git push
```

### Step 4: Redeploy

After committing `railway.toml` and setting environment variables:

1. Railway will automatically detect the new `railway.toml` file
2. It will use the build arguments specified
3. The build will have access to `NEXT_PUBLIC_*` variables
4. Next.js will embed these in the client bundle

### Step 5: Verify

1. Check deployment logs for successful build
2. Visit: https://neo-storefront-production.up.railway.app
3. Should load without redirect loop
4. Should redirect to `/{channel-slug}` route

## How railway.toml Works

The `railway.toml` file tells Railway to:

- Use Dockerfile builder
- Pass environment variables as build arguments (`ARG`) to the Dockerfile
- Next.js needs these at build time because `NEXT_PUBLIC_*` variables are embedded in the JavaScript bundle

## Troubleshooting

### Issue: Build still fails

- Ensure `railway.toml` is committed and pushed
- Verify environment variables are set BEFORE the build
- Check build logs for specific error messages

### Issue: Variables not available at runtime

- Next.js `NEXT_PUBLIC_*` variables are embedded at build time
- They should work at runtime once embedded correctly
- If needed, you can also set them as runtime environment variables (though build-time is required)

### Issue: Redirect loop persists

- Verify `NEXT_PUBLIC_STOREFRONT_URL` has NO trailing slash
- Verify it matches the actual Railway domain exactly
- Check that the channel slug exists in your backend

## Alternative: Without railway.toml

If you can't commit `railway.toml`, Railway should still work with environment variables, but you may need to:

1. Set variables in Railway Dashboard
2. Railway will pass them as environment variables
3. The Dockerfile should also set them as ENV (not just ARG) for runtime

But using `railway.toml` with build arguments is the recommended approach.
