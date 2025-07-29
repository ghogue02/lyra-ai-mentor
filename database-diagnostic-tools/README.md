# Database Constraint Diagnostic Tools

## 🚨 Critical Issue Analysis

Based on the edge function test report, **94% of tests are failing** due to database constraint violations on the `generated_content` table. The issue is that the check constraints are rejecting valid values for:

- **Character Types**: `rachel`, `sofia`, `david` (only `maya` works)  
- **Content Types**: `email`, `article` (only `lesson` works)

## 🔧 Diagnostic Tools Created

### 1. `check-current-constraints.sql`
**Purpose**: Analyze the current state of database constraints

**What it does**:
- Checks if `generated_content` table exists
- Shows all column definitions and constraints
- Tests which character/content type values would be accepted/rejected
- Provides comprehensive constraint definition analysis

**Usage**:
```bash
psql [your-database-connection] -f check-current-constraints.sql
```

### 2. `test-constraint-violations.sql` 
**Purpose**: Safely reproduce the 503 constraint violation errors

**What it does**:
- Tests the exact character/content combinations that failed in production
- Uses safe prepared statements and rollbacks (no data is persisted)
- Shows exact error messages for constraint violations
- Verifies which combinations currently work vs fail

**Usage**:
```bash
psql [your-database-connection] -f test-constraint-violations.sql
```

### 3. `fix-database-constraints.sql`
**Purpose**: Apply the constraint fixes to resolve 503 errors

**What it does**:
- Backs up current constraint definitions
- Drops and recreates `character_type` constraint with all required values
- Drops and recreates `content_type` constraint with all required values  
- Tests previously failing combinations to verify fixes
- Provides success rate analysis

**Constraint Updates**:
- **Character Types**: `maya`, `sofia`, `david`, `rachel`, `alex`, `lyra`
- **Content Types**: `email`, `lesson`, `article`, `social_post`, `newsletter`, `blog_post`, `ecosystem-blueprint`

**Usage**:
```bash
psql [your-database-connection] -f fix-database-constraints.sql
```

### 4. `verify-constraint-fixes.sql`
**Purpose**: Comprehensive verification that all fixes work correctly

**What it does**:
- Tests all individual character and content types
- Reproduces original failing combinations from test report
- Runs comprehensive matrix testing (all combinations)
- Tests edge cases (anonymous usage, complex metadata)
- Verifies invalid values are still properly rejected
- Provides detailed success rate analysis

**Usage**:
```bash
psql [your-database-connection] -f verify-constraint-fixes.sql
```

## 🎯 Recommended Execution Order

1. **Diagnose Current State**:
   ```bash
   psql [connection] -f check-current-constraints.sql
   ```

2. **Reproduce Issues** (optional):
   ```bash
   psql [connection] -f test-constraint-violations.sql
   ```

3. **Apply Fixes**:
   ```bash
   psql [connection] -f fix-database-constraints.sql
   ```

4. **Verify Success**:
   ```bash
   psql [connection] -f verify-constraint-fixes.sql
   ```

5. **Re-test Edge Function**:
   ```bash
   node comprehensive-edge-function-test.js
   ```

## 📊 Expected Results After Fix

- **Success Rate**: Should improve from 6% to ~100%
- **Working Combinations**: All character + content type combinations should work
- **503 Errors**: Should be eliminated 
- **Edge Function**: All 16 test cases should pass

## 🔍 Root Cause Analysis

The issue appears to be that the database constraints were either:

1. **Never updated** to include all required values from the schema migration
2. **Partially applied** but missing some character/content types
3. **Overwritten** by a subsequent migration that narrowed the allowed values

The original schema file shows the correct constraint definitions, but production may not have the complete set of allowed values.

## 🛡️ Safety Features

- **Backup**: All scripts create backups before making changes
- **Rollback Safe**: Test scripts use transactions that rollback
- **Non-destructive**: No existing data is modified, only constraints
- **Verification**: Comprehensive testing ensures fixes work correctly

## 📝 Notes for Production

- Run during maintenance window if possible
- Monitor application logs after applying fixes
- Consider running verification script periodically
- The constraint backup table `constraint_backup_20250729` will preserve original definitions

## 🚀 Next Steps After Database Fix

1. Re-run the comprehensive Edge Function tests
2. Verify frontend integration works for all character/content combinations  
3. Monitor production for any remaining issues
4. Update documentation to prevent similar constraint issues
5. Consider automated constraint validation in CI/CD pipeline