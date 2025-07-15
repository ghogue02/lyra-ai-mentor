#!/bin/bash

# Fix for /lyra-maya-demo route 504 Outdated Optimize Dep error

echo "🔧 Fixing /lyra-maya-demo route optimization issue..."

# Step 1: Clear Vite cache
echo "📦 Clearing Vite cache..."
rm -rf node_modules/.vite

# Step 2: Clear browser cache (instructions)
echo ""
echo "🌐 Please clear your browser cache:"
echo "   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "   - Or open DevTools > Network tab > check 'Disable cache'"
echo ""

# Step 3: Restart the development server
echo "🚀 Please restart your development server:"
echo "   1. Stop the current server (Ctrl+C)"
echo "   2. Run: npm run dev"
echo ""

echo "✅ Configuration has been updated in vite.config.ts"
echo "✅ Added the following to optimizeDeps.include:"
echo "   - @/services/mayaAIEmailService"
echo "   - @/services/aiService"
echo "   - @/components/lesson/chat/lyra/LyraNarratedMayaSideBySide"
echo "   - @/components/lesson/chat/lyra/LyraNarratedMayaSideBySide-helpers"
echo ""
echo "📝 If the issue persists:"
echo "   1. Run: rm -rf node_modules package-lock.json"
echo "   2. Run: npm install"
echo "   3. Run: npm run dev"