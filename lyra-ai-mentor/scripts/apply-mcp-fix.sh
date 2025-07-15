#!/bin/bash
# MCP Database Fix Automation Script
# Generated: 2025-07-09T13:10:20.192Z

echo "🚀 MCP Database Fix Automation"
echo "=============================="
echo ""

# Check if running in CI/CD or local
if [ -n "$SUPABASE_DB_URL" ]; then
  echo "✓ Using SUPABASE_DB_URL from environment"
  DB_URL="$SUPABASE_DB_URL"
elif [ -n "$DATABASE_URL" ]; then
  echo "✓ Using DATABASE_URL from environment"
  DB_URL="$DATABASE_URL"
else
  echo "❌ No database URL found in environment"
  echo ""
  echo "📝 Manual steps required:"
  echo "1. Go to Supabase dashboard > Settings > Database"
  echo "2. Copy the connection string"
  echo "3. Run: export DATABASE_URL='your-connection-string'"
  echo "4. Re-run this script"
  echo ""
  echo "Alternatively, copy the SQL from: /Users/greghogue/Lyra New/lyra-ai-mentor/scripts/mcp-toolkit-fix.sql"
  echo "And run it in Supabase SQL Editor"
  exit 1
fi

# Apply the fix
echo "📦 Applying database fix..."
if command -v psql &> /dev/null; then
  psql "$DB_URL" -f "/Users/greghogue/Lyra New/lyra-ai-mentor/scripts/mcp-toolkit-fix.sql" && echo "✓ Fix applied successfully!" || echo "❌ Fix failed"
else
  echo "❌ psql not found. Please install PostgreSQL client tools"
  echo "   On macOS: brew install postgresql"
  echo "   On Ubuntu: sudo apt-get install postgresql-client"
fi

# Notify MCP
npx claude-flow hook post-task --task-id "db-fix-applied" --analyze-performance true 2>/dev/null || true

echo ""
echo "🔍 Next step: Run verification"
echo "   node scripts/verify-toolkit-fix.js"
