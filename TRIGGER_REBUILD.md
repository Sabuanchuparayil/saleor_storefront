# Trigger Rebuild to Apply Environment Variables

## The Problem

Next.js embeds `NEXT_PUBLIC_*` environment variables **at BUILD time**, not runtime. This means:

- If you set variables **after** the last build, they won't be available
- You need to **trigger a new build** for the variables to be embedded

## Solution: Trigger a New Build

### Option 1: Manual Redeploy (Easiest)

1. Go to **Railway Dashboard** → **Storefront Service** → **Deployments** tab
2. Find the latest deployment
3. Click **"Redeploy"** or **"Redeploy Latest"** button
4. This will trigger a new build with the current environment variables

### Option 2: Make a Small Change

Make a small change to trigger a new build:

```bash
# Add a comment to any file
echo "# Rebuild trigger" >> README.md
git add README.md
git commit -m "Trigger rebuild for environment variables"
git push origin main
```

### Option 3: Update a Variable

Updating any variable in Railway will trigger a redeploy:

1. Railway Dashboard → Storefront Service → Variables
2. Click the `⋮` menu on any variable
3. Click "Edit"
4. Make a small change (add/remove a space) or update the value
5. Save - this will trigger a redeploy

## Verify Variables Are Correct

Before rebuilding, verify the values are correct:

```bash
# Using Railway CLI
railway service
# Select storefront service
railway variables | grep NEXT_PUBLIC
```

Expected values:
- `NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBdLp3Ivz6GCw-x4IasNDHIZEnT1pxMbLg`
- `NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel`
- `NEXT_PUBLIC_SALEOR_API_URL=https://saleor-production-0b1b.up.railway.app/graphql/`

## After Rebuild

1. Wait for the deployment to complete
2. **Clear browser cache** or use incognito mode
3. Check the frontend - features should now be visible:
   - Click & Collect toggle in header
   - Registration link in login page
   - Location picker modal

## Troubleshooting

### Features Still Not Showing After Rebuild

1. **Check browser console** (F12) for errors
2. **Verify build logs** - check if variables were embedded correctly
3. **Check network tab** - see if API calls are being made
4. **Verify component is rendering** - check page source for PickupHeaderContent

### Click & Collect Toggle Not Visible

- Check browser console for: `NEXT_PUBLIC_PICKUP_SERVICE_URL is not set`
- Verify the variable value is correct (no trailing slashes)
- Check if PickupHeaderContent component is in the DOM (inspect element)

### Registration Not Working

- Check browser console for API errors
- Verify `NEXT_PUBLIC_SALEOR_API_URL` ends with `/graphql/`
- Check network tab for failed GraphQL requests

