# Database Seeds

This directory contains SQL seed files to ensure required data exists in the database.

## Files

### toolkit-categories.sql
Contains all required toolkit categories and sample items:
- **Categories**: email, grants, data, automation, change, social, training, reports
- **Sample Items**: Basic toolkit items for each category
- **Achievements**: Basic achievement definitions

## Usage

### Manual Execution
Run the seed file directly in Supabase:
```bash
# Using Supabase CLI
supabase db seed -f supabase/seeds/toolkit-categories.sql

# Or run in SQL editor
# Copy contents of toolkit-categories.sql and run in Supabase dashboard
```

### Automatic Runtime Validation
The application includes utilities to automatically ensure data exists:

#### 1. Using the Hook (Recommended for Components)
```typescript
import { useEnsureToolkitData } from '@/hooks/useEnsureToolkitData';

function MyComponent() {
  const { isLoading, isVerified, error } = useEnsureToolkitData();
  
  if (isLoading) return <div>Loading toolkit data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isVerified) return <div>Verifying toolkit data...</div>;
  
  // Your component logic here
  return <div>Ready to use toolkit!</div>;
}
```

#### 2. Using the Wrapper Component
```typescript
import { EnsureToolkitData } from '@/hooks/useEnsureToolkitData';

function App() {
  return (
    <EnsureToolkitData
      fallback={<LoadingSpinner />}
      errorFallback={(error) => <ErrorMessage error={error} />}
    >
      <MyToolkitComponent />
    </EnsureToolkitData>
  );
}
```

#### 3. Direct Utility Usage
```typescript
import { ensureToolkitData, verifyToolkitData } from '@/utils/ensureToolkitData';
import { supabase } from '@/integrations/supabase/client';

// Verify data exists
const verification = await verifyToolkitData(supabase);
if (!verification.isValid) {
  console.log('Missing:', verification.missingCategories);
  
  // Create missing data
  const result = await ensureToolkitData(supabase);
  console.log('Created:', result.categoriesCreated);
}
```

## Features

### Idempotent Operations
- Safe to run multiple times
- Uses `ON CONFLICT` to prevent duplicates
- Only updates records if data has changed

### Error Handling
- Detailed error reporting
- Continues processing even if individual items fail
- Returns summary of operations performed

### Performance
- Hook only runs once per component lifecycle
- Automatic retry with exponential backoff
- Verification before creation to minimize database calls

## Troubleshooting

### Data Not Appearing
1. Check RLS policies are enabled for the tables
2. Ensure user has proper authentication
3. Check browser console for errors

### Duplicate Key Errors
- This is expected and handled by `ON CONFLICT`
- The seed file will update existing records if needed

### Performance Issues
- Use the wrapper component at app root level
- Consider caching verification results
- Enable connection pooling in Supabase