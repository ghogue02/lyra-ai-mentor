#!/bin/bash

# Quick validation script for common errors
# Run this before committing or when you encounter errors

echo "🚀 Quick Validation Check"
echo "========================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors_found=0

# 1. Check TypeScript compilation
echo -e "\n📋 TypeScript Check..."
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✓ TypeScript compilation OK${NC}"
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    echo "  Run: npx tsc --noEmit"
    errors_found=1
fi

# 2. Check for common import errors
echo -e "\n📦 Import Check..."
import_errors=$(grep -r "from.*toolkitService" src/ | grep -v "ToolkitService" | wc -l)
if [ $import_errors -eq 0 ]; then
    echo -e "${GREEN}✓ No incorrect toolkitService imports${NC}"
else
    echo -e "${RED}✗ Found incorrect toolkitService imports${NC}"
    echo "  Should be: import { ToolkitService } from '@/services/toolkitService';"
    grep -r "from.*toolkitService" src/ | grep -v "ToolkitService"
    errors_found=1
fi

# 3. Check for missing lucide-react icons
echo -e "\n🎨 Icon Import Check..."
icon_usage=$(grep -r "className=\"w-[0-9]" src/ | grep -E "(Mail|Copy|Share2|Download|Calendar|Target|Users|FileText|Check|Package|Loader2|Sparkles|Heart|ChevronRight|Volume2|MessageCircle|Star|Zap|Eye|RefreshCw|Lightbulb)" | wc -l)
if [ $icon_usage -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found icon usage - verify imports${NC}"
    echo "  Common missing icons: Mail, Users, FileText, Zap"
else
    echo -e "${GREEN}✓ Icon check passed${NC}"
fi

# 4. Check for useState/useEffect import
echo -e "\n⚛️  React Hooks Check..."
hook_errors=$(grep -r "useState\|useEffect\|useMemo\|useCallback" src/ | grep -v "import.*from 'react'" | grep -v "React\." | head -5)
if [ -z "$hook_errors" ]; then
    echo -e "${GREEN}✓ React hooks properly imported${NC}"
else
    echo -e "${YELLOW}⚠ Possible missing React imports${NC}"
    echo "$hook_errors" | head -3
fi

# 5. Check for console.log statements
echo -e "\n🚫 Console.log Check..."
console_count=$(grep -r "console\.\(log\|error\|warn\)" src/ --include="*.tsx" --include="*.ts" | grep -v "// console" | wc -l)
if [ $console_count -eq 0 ]; then
    echo -e "${GREEN}✓ No console statements${NC}"
else
    echo -e "${YELLOW}⚠ Found $console_count console statements${NC}"
fi

# 6. Quick build test
echo -e "\n🏗️  Quick Build Test..."
if npm run build -- --mode development 2>&1 | grep -q "error"; then
    echo -e "${RED}✗ Build errors detected${NC}"
    errors_found=1
else
    echo -e "${GREEN}✓ Build test passed${NC}"
fi

# Summary
echo -e "\n========================"
if [ $errors_found -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
else
    echo -e "${RED}❌ Errors found - please fix before committing${NC}"
    exit 1
fi