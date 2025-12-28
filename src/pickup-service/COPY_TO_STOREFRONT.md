# Copy Package to Your Storefront

## Quick Copy Command

Once you've located your storefront project, run:

```bash
# Navigate to your storefront project
cd /path/to/your/storefront

# Copy the package
cp -r /Users/apple/Desktop/saleor/src/pickup-service ./src/pickup-service
```

## Finding Your Storefront

### Option 1: Railway Storefront Service

If your storefront is deployed on Railway:

1. **Check Railway Dashboard:**

   - Go to: https://railway.app
   - Look for service named "neo-storefront" or similar
   - Check the service's source/repository

2. **If connected to GitHub:**
   - The repository URL will be shown in Railway
   - Clone that repository locally
   - Copy the package there

### Option 2: Local Storefront Project

Check common locations:

```bash
# Check Desktop
ls ~/Desktop | grep -i storefront

# Check common project directories
ls ~/Projects | grep -i storefront
ls ~/Documents | grep -i storefront

# Check if it's in the same parent directory
ls ~/Desktop | grep -i saleor
```

### Option 3: Create New Storefront

If you don't have a storefront yet, you can:

1. **Use Saleor Storefront:**

   ```bash
   git clone https://github.com/saleor/saleor-storefront.git
   cd saleor-storefront
   cp -r /Users/apple/Desktop/saleor/src/pickup-service ./src/pickup-service
   ```

2. **Or create a Next.js storefront:**
   ```bash
   npx create-next-app@latest my-storefront
   cd my-storefront
   cp -r /Users/apple/Desktop/saleor/src/pickup-service ./src/pickup-service
   ```

## After Copying

1. **Install dependencies:**

   ```bash
   npm install react react-dom
   # or
   yarn add react react-dom
   ```

2. **Set environment variables:**

   ```env
   NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app
   NEXT_PUBLIC_CHANNEL_SLUG=default-channel
   ```

3. **Start using components:**
   ```tsx
   import { ClickCollectToggle } from "./src/pickup-service";
   ```

## Verify Copy

Check that these files exist:

- ✅ `src/pickup-service/index.ts`
- ✅ `src/pickup-service/components/ClickCollectToggle.tsx`
- ✅ `src/pickup-service/README.md`

## Need Help?

If you can't find your storefront:

1. Check Railway Dashboard for storefront service
2. Check your GitHub repositories
3. Or create a new storefront project
