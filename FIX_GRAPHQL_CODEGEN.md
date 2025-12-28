# Fix GraphQL Code Generation Failure

## Problem

The build fails because GraphQL Code Generator tries to introspect the schema from the backend API, but it returns 404:

```
Failed to load schema from https://web-production-82856.up.railway.app/graphql/
```

## Root Cause

The backend API isn't accessible at that URL during build time. This could be because:

1. The backend service isn't publicly exposed in Railway
2. The backend URL is incorrect
3. The backend requires authentication for introspection

## Solutions

### Solution 1: Make Backend Publicly Accessible (Recommended)

1. Go to **Railway Dashboard → Saleor Service (Backend)**
2. Go to the **Settings** tab
3. Check **"Public Networking"** or **"Generate Domain"**
4. Ensure the service has a public domain
5. Update `NEXT_PUBLIC_SALEOR_API_URL` in the storefront service with the correct public URL

### Solution 2: Check Correct Backend URL

The backend might be using a different public domain. Check:

1. **Railway Dashboard → Saleor Service → Settings → Networking**
2. Look for the **Public Domain** or **Custom Domain**
3. Update `NEXT_PUBLIC_SALEOR_API_URL` to match the actual public domain

### Solution 3: Use Generated Types (Temporary Workaround)

If the types are already generated in `src/gql/`, you can modify the build to skip code generation:

1. **Option A:** Comment out the `prebuild` script temporarily:

   ```json
   // In package.json, change:
   "prebuild": "pnpm run generate",
   // To:
   // "prebuild": "pnpm run generate",
   ```

2. **Option B:** Generate types locally first, then commit them:
   ```bash
   # Set NEXT_PUBLIC_SALEOR_API_URL locally
   export NEXT_PUBLIC_SALEOR_API_URL=https://your-backend-url/graphql/
   pnpm run generate
   git add src/gql/
   git commit -m "Add generated GraphQL types"
   git push
   ```

### Solution 4: Use Local Schema File

If you have a `schema.graphql` file:

1. Place it in the storefront root directory
2. The config already supports this via `GITHUB_ACTION=generate-schema-from-file`
3. You can modify the config to use the local file

## Recommended Fix

**Best approach:** Ensure the backend is publicly accessible and use the correct public URL.

1. Check Railway Dashboard → Backend Service → Settings → Networking
2. Note the public domain (or generate one)
3. Update storefront's `NEXT_PUBLIC_SALEOR_API_URL` to: `https://{public-domain}/graphql/`
4. Redeploy storefront

## Verification

After fixing, the build should:

- Successfully introspect the GraphQL schema
- Generate types in `src/gql/`
- Complete the Next.js build
- Deploy successfully
