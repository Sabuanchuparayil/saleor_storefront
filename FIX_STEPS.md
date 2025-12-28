# Storefront Fix - Quick Steps

## ✅ Action Items

### 1. Set Environment Variables in Railway Dashboard

Go to: **Railway Dashboard → Storefront Service → Variables**

Add/Update these three variables:

```
NEXT_PUBLIC_SALEOR_API_URL=https://web-production-82856.up.railway.app/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

**Critical Details:**

- `NEXT_PUBLIC_SALEOR_API_URL` MUST end with `/graphql/` (trailing slash required)
- `NEXT_PUBLIC_STOREFRONT_URL` MUST NOT have trailing slash
- Both must use `https://` (not `http://`)
- Variable names are case-sensitive

### 2. Commit railway.toml (Optional but Recommended)

The `railway.toml` file has been created. Railway should work without it, but it helps ensure proper configuration:

```bash
cd /Users/apple/Desktop/saleor-storefront-src
git add railway.toml
git commit -m "Add Railway configuration for build arguments"
git push
```

**Note:** Railway automatically passes environment variables to Docker builds, so this step is optional. But having `railway.toml` ensures consistent behavior.

### 3. Trigger New Deployment

After setting variables:

- Railway will auto-redeploy on variable change
- OR manually redeploy from Railway Dashboard → Deployments → Redeploy

### 4. Verify

1. **Check Deployment Status**

   - Should show "SUCCESS" after build completes

2. **Check Build Logs**

   - Look for successful Next.js build
   - Should not see "Missing NEXT_PUBLIC_SALEOR_API_URL" errors

3. **Visit Storefront**
   - URL: https://neo-storefront-production.up.railway.app
   - Should load without redirect loop
   - Should redirect to `/{channel-slug}` route

## 🔍 If Issues Persist

### Build Fails

- Verify variables are set BEFORE deployment starts
- Check build logs for specific error messages
- Ensure variable names are exactly as shown (case-sensitive)

### Redirect Loop Continues

- Double-check `NEXT_PUBLIC_STOREFRONT_URL` has NO trailing slash
- Verify the URL exactly matches your Railway domain
- Check browser console for errors

### Channel Not Found

- The `default-channel` slug might not exist in your backend
- Find correct channel slug (see troubleshooting section below)

## 🔧 Finding Correct Channel Slug

If `default-channel` doesn't work, find the correct one:

1. **Via GraphQL Playground:**

   - Visit: https://web-production-82856.up.railway.app/graphql/
   - Run query:

   ```graphql
   query {
   	channels {
   		slug
   		isActive
   		isDefault
   	}
   }
   ```

   - Use the `slug` of an active channel

2. **Update Variable:**
   - Set `NEXT_PUBLIC_DEFAULT_CHANNEL` to the correct slug
   - Redeploy
