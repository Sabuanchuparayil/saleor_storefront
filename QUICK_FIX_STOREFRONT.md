# Quick Fix: Storefront Deployment Failure & Redirect Loop

## ✅ Environment Variables to Set in Railway Dashboard

Go to: **Railway Dashboard → Storefront Service → Variables**

Set these exactly as shown:

```
NEXT_PUBLIC_SALEOR_API_URL=https://web-production-82856.up.railway.app/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

## 📋 Step-by-Step Instructions

1. **Open Railway Dashboard**

   - Go to https://railway.com/dashboard
   - Select your "Saleor Commerce" project
   - Click on the **Storefront** service (or the service that shows the failed deployment)

2. **Go to Variables Tab**

   - Click the "Variables" tab
   - Look for the three variables above

3. **Set Each Variable**

   - If the variable exists, click "Edit" and update it
   - If it doesn't exist, click "New Variable" and add it
   - Use the exact values shown above
   - **Important Notes:**
     - `NEXT_PUBLIC_SALEOR_API_URL` must have trailing slash: `/graphql/`
     - `NEXT_PUBLIC_STOREFRONT_URL` must NOT have trailing slash
     - Both must use `https://` not `http://`

4. **Save and Redeploy**

   - Click "Save" for each variable
   - Railway will automatically trigger a new deployment
   - OR go to "Deployments" tab and click "Redeploy"

5. **Verify**
   - Wait for deployment to complete
   - Check deployment logs for any errors
   - Visit: https://neo-storefront-production.up.railway.app
   - Should load without redirect loop

## 🔍 If Channel Slug is Wrong

If `default-channel` doesn't work, you can find the correct channel:

1. Visit: https://web-production-82856.up.railway.app/graphql/
2. Run this query (you may need to authenticate first):

```graphql
query {
	channels {
		slug
		isActive
		isDefault
	}
}
```

3. Use the `slug` of an active channel for `NEXT_PUBLIC_DEFAULT_CHANNEL`

## ✅ Verification Checklist

After setting variables and redeploying:

- [ ] Deployment shows "SUCCESS" status
- [ ] No build errors in logs
- [ ] Storefront URL loads without redirect loop
- [ ] Storefront redirects to `/{channel-slug}` route
- [ ] No console errors in browser

## 🐛 Common Issues

**Build fails:** Variables must be set BEFORE the build. Set them, then trigger a new deployment.

**Redirect loop persists:** Double-check `NEXT_PUBLIC_STOREFRONT_URL` has NO trailing slash.

**404 on channel:** The channel slug doesn't exist. Find the correct slug using the GraphQL query above.
