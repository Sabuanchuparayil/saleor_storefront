# Debug Storefront Deployment Failure

## How to Check Deployment Logs

1. Go to **Railway Dashboard**
2. Select your **Saleor Commerce** project
3. Click on the **Storefront** service
4. Go to the **Deployments** tab
5. Click on the **latest failed deployment**
6. Check the **Build Logs** and **Deploy Logs**

## Common Deployment Failures & Fixes

### 1. Missing Environment Variables at Build Time

**Error looks like:**

```
Error: Missing NEXT_PUBLIC_SALEOR_API_URL
```

or

```
Error: NEXT_PUBLIC_SALEOR_API_URL is not defined
```

**Fix:**

- Ensure variables are set in Railway Dashboard → Storefront Service → Variables
- Variables must be set BEFORE the build runs
- Trigger a new deployment after setting variables

### 2. Build Fails - Next.js Build Error

**Error looks like:**

```
Failed to compile
Error: NEXT_PUBLIC_SALEOR_API_URL must be defined
```

**Fix:**

- Verify all three variables are set:
  - `NEXT_PUBLIC_SALEOR_API_URL`
  - `NEXT_PUBLIC_STOREFRONT_URL`
  - `NEXT_PUBLIC_DEFAULT_CHANNEL`
- Ensure no typos in variable names (case-sensitive)
- Ensure URLs are correct format (https://, correct paths)

### 3. Docker Build Fails

**Error looks like:**

```
The command '/bin/sh -c pnpm build' returned a non-zero code: 1
```

**Fix:**

- Check build logs for specific Next.js errors
- Usually means environment variables are missing
- Ensure variables are set in Railway before deployment

### 4. Runtime Error After Successful Build

**Error looks like:**

```
Application error: a client-side exception has occurred
```

**Fix:**

- Check if `NEXT_PUBLIC_STOREFRONT_URL` has trailing slash (should NOT have one)
- Verify `NEXT_PUBLIC_SALEOR_API_URL` ends with `/graphql/` (should have trailing slash)

### 5. Port/Healthcheck Issues

**Error looks like:**

```
Health check failed
Port not listening
```

**Fix:**

- Next.js standalone mode should listen on PORT environment variable
- Railway automatically sets PORT, Next.js should pick it up
- Check if `server.js` is correctly starting the server

## Verification Checklist

After setting variables, verify:

- [ ] All three variables are set in Railway Dashboard
- [ ] `NEXT_PUBLIC_SALEOR_API_URL` ends with `/graphql/`
- [ ] `NEXT_PUBLIC_STOREFRONT_URL` has NO trailing slash
- [ ] Both URLs use `https://` not `http://`
- [ ] Variables are set before triggering deployment
- [ ] New deployment is triggered after setting variables

## Quick Fix Steps

1. **Double-check Variables:**

   ```
   NEXT_PUBLIC_SALEOR_API_URL=https://web-production-82856.up.railway.app/graphql/
   NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
   NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
   ```

2. **Delete and Re-add Variables:**

   - Sometimes Railway caches old values
   - Delete each variable
   - Re-add with correct values
   - Save each one

3. **Trigger Clean Deployment:**
   - Go to Deployments tab
   - Click "Redeploy" or create a new deployment
   - This ensures variables are picked up fresh

## What to Share for Debugging

If deployment still fails, check logs and share:

1. **Exact error message** from build logs
2. **Which step failed** (build, deploy, runtime)
3. **First 50 lines** of error output
4. **Variable names** you set (to verify no typos)
