# Fix Storefront Redirect Loop (ERR_TOO_MANY_REDIRECTS)

## Root Cause

The redirect loop is typically caused by incorrect environment variable configuration in Railway.

## Step-by-Step Fix

### 1. Set Environment Variables in Railway Dashboard

Go to: **Railway Dashboard → Your Storefront Service → Variables**

Set these variables:

```
NEXT_PUBLIC_SALEOR_API_URL=https://web-production-82856.up.railway.app/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://neo-storefront-production.up.railway.app
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

**Important:**

- No trailing slashes (except `/graphql/` which should have one)
- Use `https://` not `http://`
- The storefront URL must match your actual Railway domain exactly

### 2. Find the Correct Channel Slug

The default channel slug might not be "default-channel". To find the correct one:

**Option A: Via Railway CLI (if linked)**

```bash
cd saleor-storefront-src
railway ssh --service Saleor
python3 manage.py shell
>>> from saleor.channel.models import Channel
>>> Channel.objects.filter(is_active=True).values_list('slug', flat=True)
```

**Option B: Check via GraphQL**
Visit: `https://web-production-82856.up.railway.app/graphql/`

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

Use the `slug` of an active channel (preferably the default one) for `NEXT_PUBLIC_DEFAULT_CHANNEL`.

### 3. Redeploy

After setting the variables:

- Railway will automatically redeploy
- OR manually trigger a redeploy from the Railway Dashboard

### 4. Verify

1. Check Railway logs for any errors
2. Visit `https://neo-storefront-production.up.railway.app`
3. It should redirect to `https://neo-storefront-production.up.railway.app/{channel-slug}` without looping

## Common Issues

### Issue: Still getting redirect loop

- **Check:** Does `NEXT_PUBLIC_STOREFRONT_URL` exactly match your Railway domain?
- **Check:** Is there a trailing slash in `NEXT_PUBLIC_STOREFRONT_URL`? (should NOT have one)
- **Check:** Is the channel slug correct and active?

### Issue: 404 or channel not found

- The channel slug in `NEXT_PUBLIC_DEFAULT_CHANNEL` doesn't exist
- Check your Saleor backend for active channels

### Issue: API connection errors

- Verify `NEXT_PUBLIC_SALEOR_API_URL` is correct
- Should end with `/graphql/` (with trailing slash)
- Check if backend is accessible
