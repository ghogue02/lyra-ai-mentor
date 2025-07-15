# Testing Quick Reference Card

## 🚀 Before You Code

```bash
# Check if required data exists
npm run validate:quick

# Ensure database is seeded
npm run db:seed
```

## 🏗️ Component Template with Validation

```typescript
import { EnsureToolkitData } from '@/hooks/useEnsureToolkitData';

export function MyFeature() {
  return (
    <EnsureToolkitData>
      {/* Your component code */}
    </EnsureToolkitData>
  );
}
```

## ✅ Required Imports Checklist

```typescript
// For toolkit features
import { ToolkitService } from '@/services/toolkitService';
import { useEnsureToolkitData } from '@/hooks/useEnsureToolkitData';

// For icons (list ALL used)
import { Mail, Check, Star, ChevronRight } from 'lucide-react';
```

## 🧪 Test Commands

```bash
# Quick validation (30 seconds)
npm run validate:quick

# Full validation (2-3 minutes)
npm run validate:all

# Run before committing
npm run pre-commit

# Test specific feature
npm test -- SaveToToolkit

# Run BDD tests
npm run test:bdd
```

## 🔍 Common Issues & Fixes

| Error | Quick Fix |
|-------|-----------|
| "Missing Mail icon" | Add to lucide-react imports |
| "Category not found" | Run `npm run db:seed` |
| "Cannot find module" | Check import path uses @ alias |
| "toolkitService undefined" | Instantiate: `new ToolkitService()` |

## 📝 Database Dependency Pattern

```typescript
// Always validate before using
const category = await getCategory('email');
if (!category) {
  // Auto-create or show error
  await ensureToolkitData(supabase);
}
```

## 🚨 Red Flags in Code Review

- Direct database queries without validation
- Missing loading states
- No error boundaries
- Hard-coded IDs instead of key lookups
- Console.log statements
- Missing TypeScript types

## 🎯 Copy-Paste Templates

### Service with Validation
```typescript
export class MyService {
  async saveItem(data: ItemData) {
    // Validate dependencies first
    const validation = await verifyToolkitData(supabase);
    if (!validation.isValid) {
      throw new Error('Required data missing');
    }
    
    // Proceed with operation
    return await this.performSave(data);
  }
}
```

### Component with Error Handling
```typescript
export function MyComponent() {
  const { isLoading, error, retry } = useEnsureToolkitData();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} onRetry={retry} />;
  
  return <ComponentContent />;
}
```