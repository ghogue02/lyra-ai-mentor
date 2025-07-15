# Comprehensive Testing Guidelines for Lyra AI Mentor

## Overview
This document outlines testing best practices and patterns established during the MyToolkit PACE email implementation. These guidelines ensure database dependencies are validated, errors are caught early, and features work reliably across all lessons and chapters.

## Core Testing Principles

### 1. Database Dependency Validation
**Problem**: Features failing due to missing database data (e.g., "email category not found")
**Solution**: Implement three-layer validation:

#### Layer 1: Database Seeders
```sql
-- Example: toolkit-categories.sql
INSERT INTO toolkit_categories (category_key, name, description, icon, gradient, order_index)
VALUES 
  ('email', 'Email Templates', 'Professional email templates', 'Mail', 'from-blue-500 to-cyan-500', 1)
ON CONFLICT (category_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();
```

#### Layer 2: Runtime Validation Hook
```typescript
// Use in components that depend on database data
import { useEnsureToolkitData } from '@/hooks/useEnsureToolkitData';

function MyComponent() {
  const { isLoading, isVerified, error } = useEnsureToolkitData();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!isVerified) return <VerifyingData />;
  
  // Component logic here
}
```

#### Layer 3: Pre-Build Validation
```javascript
// scripts/pre-build-check.js
async function validateDatabaseDependencies() {
  const { verifyToolkitData } = require('../src/utils/ensureToolkitData');
  const result = await verifyToolkitData(supabase);
  
  if (!result.isValid) {
    console.error('Missing database data:', result.missingCategories);
    process.exit(1);
  }
}
```

## TDD (Test-Driven Development) Implementation

### 1. Service Layer Tests
```typescript
// src/services/__tests__/toolkitService.test.ts
describe('ToolkitService', () => {
  it('should validate required categories exist before operations', async () => {
    const service = new ToolkitService();
    const categories = await service.getCategories();
    
    expect(categories).toBeDefined();
    expect(categories.find(c => c.category_key === 'email')).toBeDefined();
  });

  it('should handle missing categories gracefully', async () => {
    const service = new ToolkitService();
    const result = await service.saveItem({ category_key: 'nonexistent' });
    
    expect(result.error).toContain('Category not found');
  });
});
```

### 2. Component Tests
```typescript
// src/components/__tests__/SaveToToolkit.test.tsx
describe('SaveToToolkit', () => {
  it('should ensure data exists before rendering', async () => {
    render(<SaveToToolkit {...props} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading toolkit data...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Save to MyToolkit')).toBeInTheDocument();
  });
});
```

## BDD (Behavior-Driven Development) Scenarios

### 1. Feature File Structure
```gherkin
# tests/bdd/features/save-to-toolkit.feature
Feature: Save PACE Email to MyToolkit
  As a user
  I want to save my generated PACE emails
  So that I can access them later

  Background:
    Given the required toolkit categories exist in the database
    And I am authenticated

  Scenario: Successfully save PACE email
    Given I have generated a PACE email
    When I click the "Save to MyToolkit" button
    Then the email should be saved with all metadata
    And I should see a success notification
```

### 2. Step Definitions
```typescript
// tests/bdd/step-definitions/toolkit.steps.ts
Given('the required toolkit categories exist in the database', async () => {
  const result = await ensureToolkitData(supabase);
  expect(result.success).toBe(true);
});
```

## Validation Scripts

### 1. Quick Validation (Development)
```bash
#!/bin/bash
# scripts/quick-validate.sh

echo "🔍 Running quick validation..."

# Check for missing imports
rg "lucide-react.*Mail" --type ts || echo "⚠️  Mail icon might be missing"

# Check for toolkit dependencies
rg "toolkitService" --type tsx | grep -v "import.*ToolkitService" && echo "⚠️  Missing ToolkitService import"

# Check for database hooks
rg "useEnsureToolkitData" --type tsx || echo "⚠️  Consider using data validation hook"
```

### 2. Comprehensive Validation (Pre-Deploy)
```javascript
// scripts/pre-build-check.js
const validations = [
  checkTypeScriptErrors,
  validateImports,
  checkDatabaseDependencies,
  validateReactPatterns,
  checkForConsoleStatements,
  validateToolkitIntegration
];

async function runValidations() {
  for (const validation of validations) {
    const result = await validation();
    if (!result.success) {
      console.error(`❌ ${validation.name} failed:`, result.errors);
      process.exit(1);
    }
  }
  console.log('✅ All validations passed!');
}
```

## Applying to Other Lessons and Chapters

### 1. Lesson Component Template
```typescript
// src/components/lesson/[chapter]/[lesson]/index.tsx
import { EnsureToolkitData } from '@/hooks/useEnsureToolkitData';

export function Lesson() {
  return (
    <EnsureToolkitData
      fallback={<LoadingLesson />}
      errorFallback={(error) => <LessonError error={error} />}
    >
      <LessonContent />
    </EnsureToolkitData>
  );
}
```

### 2. Chapter-Specific Data Requirements
```typescript
// src/data/chapter-requirements.ts
export const CHAPTER_REQUIREMENTS = {
  'chapter-3': {
    requiredCategories: ['email', 'social'],
    requiredAchievements: ['first_unlock'],
    customValidation: async (supabase) => {
      // Chapter-specific validation
    }
  },
  'chapter-4': {
    requiredCategories: ['data', 'reports'],
    requiredAchievements: ['category_explorer']
  }
};
```

### 3. Automated Testing Per Chapter
```typescript
// tests/chapters/chapter-validation.test.ts
import { CHAPTER_REQUIREMENTS } from '@/data/chapter-requirements';

describe.each(Object.entries(CHAPTER_REQUIREMENTS))(
  'Chapter %s requirements',
  (chapterKey, requirements) => {
    it('should have all required data available', async () => {
      const validation = await validateChapterRequirements(chapterKey);
      expect(validation.isValid).toBe(true);
    });
  }
);
```

## Error Prevention Patterns

### 1. Import Validation
```typescript
// Always use TypeScript path aliases with validation
import { Component } from '@/components/Component'; // ✅
import { Component } from '../../../components/Component'; // ❌

// Validate icon imports
import { Mail, Star, Check } from 'lucide-react'; // List all used icons
```

### 2. Service Integration Pattern
```typescript
// Always instantiate services, don't import instances
import { ToolkitService } from '@/services/toolkitService';
const toolkitService = new ToolkitService(); // ✅

// Avoid
import { toolkitService } from '@/services/toolkitService'; // ❌
```

### 3. Database Operation Pattern
```typescript
// Always check for data existence
async function saveToToolkit(data) {
  // Verify category exists
  const category = await getCategory(data.category_key);
  if (!category) {
    return { error: 'Category not found. Running data validation...' };
  }
  
  // Proceed with save
  return await toolkitService.saveItem(data);
}
```

## CI/CD Integration

### 1. Pre-Commit Hook
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate:quick"
    }
  }
}
```

### 2. GitHub Actions
```yaml
# .github/workflows/validate.yml
name: Validate Build
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run comprehensive validation
        run: npm run validate:all
      - name: Run tests
        run: npm test
```

## Monitoring and Maintenance

### 1. Error Tracking
```typescript
// Add to components that use database data
useEffect(() => {
  if (error) {
    console.error('[ToolkitError]', {
      component: 'SaveToToolkit',
      error,
      timestamp: new Date().toISOString()
    });
    
    // Send to monitoring service
    trackError('toolkit_data_missing', { error });
  }
}, [error]);
```

### 2. Regular Audits
- Weekly: Run `npm run validate:all`
- Before releases: Run full test suite including BDD scenarios
- Monthly: Review error logs for patterns

## Quick Reference Checklist

Before implementing any feature that uses database data:

- [ ] Identify all database dependencies
- [ ] Create/update database seeders
- [ ] Add runtime validation hook
- [ ] Write TDD tests for happy and error paths
- [ ] Create BDD scenarios for user flows
- [ ] Add to pre-build validation
- [ ] Update chapter requirements if needed
- [ ] Test with missing data scenarios
- [ ] Document any new patterns

## Common Pitfalls to Avoid

1. **Assuming data exists** - Always validate
2. **Hard-coding IDs** - Use key lookups
3. **Missing error boundaries** - Wrap database-dependent components
4. **Forgetting to test offline** - Test with no database connection
5. **Not handling loading states** - Show appropriate feedback
6. **Skipping validation in development** - Run checks regularly

## Conclusion

By following these guidelines, we ensure:
- Database dependencies are always satisfied
- Errors are caught before deployment
- Users have a reliable experience
- Development is faster with fewer runtime surprises
- Code is maintainable and testable

These patterns should be applied to ALL new features, especially those in lessons and chapters that depend on database data.