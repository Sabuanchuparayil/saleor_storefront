#!/usr/bin/env node

/**
 * Check environment variables during build
 * This script runs during the build process to verify NEXT_PUBLIC_* variables are available
 */

const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../../.cursor/debug.log');

function log(message, data) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    location: 'check-env-vars.js',
    message,
    data,
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'C'
  };
  
  // Write to log file
  try {
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    // Log file might not exist yet, that's okay
  }
  
  // Also log to console for Railway build logs
  console.log(`[ENV CHECK] ${message}:`, JSON.stringify(data, null, 2));
}

// Check all NEXT_PUBLIC_* variables
const nextPublicVars = Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_'))
  .reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {});

log('All NEXT_PUBLIC_* variables during build', {
  count: Object.keys(nextPublicVars).length,
  variables: nextPublicVars,
  hasPickupServiceUrl: !!process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL,
  pickupServiceUrl: process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL,
  hasGoogleMapsKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  hasDefaultChannel: !!process.env.NEXT_PUBLIC_DEFAULT_CHANNEL,
  hasSaleorApiUrl: !!process.env.NEXT_PUBLIC_SALEOR_API_URL,
});

// Check if required variables are missing
const requiredVars = [
  'NEXT_PUBLIC_PICKUP_SERVICE_URL',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_DEFAULT_CHANNEL',
  'NEXT_PUBLIC_SALEOR_API_URL',
];

const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  log('Missing required environment variables', {
    missing: missingVars,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('NEXT') || k.includes('PICKUP') || k.includes('GOOGLE')),
  });
  console.warn('⚠️  Missing required variables:', missingVars.join(', '));
  console.warn('⚠️  Build will continue, but features may not work correctly');
  // Don't exit - let build continue so we can see what happens
} else {
  log('All required variables present', {});
  console.log('✅ All required NEXT_PUBLIC_* variables are set');
}

