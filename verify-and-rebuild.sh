#!/bin/bash

echo "🔍 Verifying Environment Variables"
echo "==================================="
echo ""

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first."
    exit 1
fi

echo "Checking Railway variables..."
railway variables 2>&1 | grep -i "NEXT_PUBLIC" || echo "No NEXT_PUBLIC variables found"

echo ""
echo "📝 Required Variables:"
echo "  - NEXT_PUBLIC_PICKUP_SERVICE_URL"
echo "  - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
echo "  - NEXT_PUBLIC_DEFAULT_CHANNEL"
echo "  - NEXT_PUBLIC_SALEOR_API_URL"
echo ""

echo "✅ If variables are set, trigger a rebuild by:"
echo "   1. Making a small change to trigger deployment"
echo "   2. OR manually redeploy in Railway Dashboard"
echo ""

echo "🚀 Triggering rebuild by making a small change..."
echo "# Rebuild triggered at $(date)" >> .rebuild-trigger
git add .rebuild-trigger
git commit -m "chore: Trigger rebuild to embed environment variables" --no-verify
git push origin main

echo ""
echo "✅ Rebuild triggered! Wait for deployment to complete."

