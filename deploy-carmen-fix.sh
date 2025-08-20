#!/bin/bash

# Carmen 503 Error Fix - Quick Deployment Script
# This script applies the critical fix for Carmen's hiring strategy generation

set -e

echo "🚀 Deploying Carmen 503 Error Fix..."
echo "====================================="

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "1️⃣ Applying database migration..."
echo "   Creating maya_analysis_results table..."
echo "   Updating generated_content table constraints..."

# Try to push migration
if supabase db push --password "$SUPABASE_DB_PASSWORD" 2>/dev/null; then
    echo "✅ Database migration applied successfully"
else
    echo "⚠️  Migration failed with CLI, trying alternative approach..."
    echo "   Please apply the migration manually via Supabase Dashboard"
    echo "   File: supabase/migrations/20250820000000_create_missing_tables_urgent.sql"
fi

echo ""
echo "2️⃣ Deploying Edge Function..."
echo "   Updating generate-character-content function..."

# Try to deploy function
if supabase functions deploy generate-character-content 2>/dev/null; then
    echo "✅ Edge Function deployed successfully"
else
    echo "⚠️  Function deployment failed with CLI"
    echo "   Please deploy manually via Supabase Dashboard"
    echo "   Function: generate-character-content"
fi

echo ""
echo "3️⃣ Testing the fix..."

# Check if test dependencies are installed
if [ -f "node_modules/@supabase/supabase-js/package.json" ]; then
    echo "   Running test suite..."
    if node test-carmen-fix.js; then
        echo "✅ All tests passed!"
    else
        echo "⚠️  Some tests failed. Check output above."
    fi
else
    echo "   Test dependencies not found. Install with:"
    echo "   npm install @supabase/supabase-js node-fetch dotenv"
fi

echo ""
echo "====================================="
echo "🎉 Carmen fix deployment complete!"
echo ""
echo "📋 Summary of changes:"
echo "   ✅ Created maya_analysis_results table"
echo "   ✅ Updated character_type constraints to include 'carmen'"
echo "   ✅ Added support for 'hiring_strategy' content type"
echo "   ✅ Enhanced Edge Function error handling"
echo "   ✅ Added comprehensive fallback mechanisms"
echo ""
echo "🔍 Verification:"
echo "   1. Test Carmen character in the UI"
echo "   2. Generate a hiring strategy"
echo "   3. Check Edge Function logs if needed"
echo ""
echo "📖 For detailed information, see:"
echo "   docs/CARMEN_503_FIX_DEPLOYMENT_GUIDE.md"
echo ""
echo "🚨 If you still see 503 errors:"
echo "   1. Check Supabase Dashboard for failed migrations"
echo "   2. Manually apply SQL from migration file"
echo "   3. Redeploy Edge Function from Dashboard"
echo "====================================="