# Storefront Fix Summary

## ✅ What You Need to Do

### Step 1: Set Environment Variables in Railway

Go to **Railway Dashboard → Your Storefront Service → Variables**

Set these three variables:

1. **NEXT_PUBLIC_SALEOR_API_URL**

   ```
   Value: https://web-production-82856.up.railway.app/graphql/
   ```

   ⚠️ Must end with `/graphql/` (trailing slash required)

2. **NEXT_PUBLIC_STOREFRONT_URL**

   ```
   Value: https://neo-storefront-production.up.railway.app
   ```

   ⚠️ Must NOT have trailing slash

3. **NEXT_PUBLIC_DEFAULT_CHANNEL**
   ```
   Value: default-channel
   ```
   (If this doesn't work, see troubleshooting below)

### Step 2: Redeploy

After setting variables, Railway will auto-redeploy or you can manually trigger a redeploy.

### Step 3: Verify

Visit: https://neo-storefront-production.up.railway.app

- Should load without redirect loop
- Should show the storefront

## 📝 Notes

- Railway automatically passes environment variables to Docker builds
- Next.js needs `NEXT_PUBLIC_*` variables at build time (they're embedded in the JavaScript bundle)
- The Dockerfile already handles converting ARG to ENV correctly

## 🔍 Troubleshooting

### If channel doesn't work:

Find the correct channel slug by querying your backend GraphQL API at:
`https://web-production-82856.up.railway.app/graphql/`

Run this query:

```graphql
query {
	channels {
		slug
		isActive
		isDefault
	}
}
```

Then update `NEXT_PUBLIC_DEFAULT_CHANNEL` with the correct slug.
