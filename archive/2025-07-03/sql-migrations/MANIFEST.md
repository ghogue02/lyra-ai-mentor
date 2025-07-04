# SQL Migrations Archive Manifest

**Archive Date:** July 3, 2025  
**Reason for Archiving:** Outdated SQL migration files that no longer reflect current database state

## Why These Files Were Archived

These SQL migration files were archived because:

1. **Outdated Content**: The files contain references to outdated content structures (e.g., references to "James" in Chapter 2) that do not match the current live database state.

2. **Prevent Confusion**: Keeping these migration files in the active database directory was causing confusion as developers might mistakenly reference them instead of the actual database state.

3. **Historical Preservation**: While these files are outdated, they're preserved here for historical reference and to understand the evolution of the database schema.

## Archived Files

The following SQL migration files were moved from `/database/migrations/` to this archive:

- `add-database-content-viewer.sql` - Database viewer component migration
- `add-database-debugger.sql` - Database debugger component migration  
- `build-all-chapters-fixed.sql` - Fixed version of all chapters build
- `build-chapter-3-sofia-fixed.sql` - Fixed version of Chapter 3 (Sofia)
- `build-chapter-3-sofia.sql` - Original Chapter 3 (Sofia) build
- `build-chapter-4-david.sql` - Chapter 4 (David) build
- `build-chapter-5-rachel.sql` - Chapter 5 (Rachel) build
- `build-chapter-6-alex.sql` - Chapter 6 (Alex) build
- `chapter-2-final-audit.sql` - Final audit of Chapter 2
- `chapter-3-final-fixed.sql` - Final fixed version of Chapter 3
- `chapter-5-final-fixed.sql` - Final fixed version of Chapter 5

## Important Note

**DO NOT USE THESE FILES** for current database operations. These are archived for historical reference only. For current database state and operations, refer to:

1. The live Supabase database
2. Active migration files in `/supabase/migrations/`
3. Database management tools in the application

## Original Directory Structure

These files were originally located at:
```
/database/migrations/
```

And have been moved to:
```
/archive/2025-07-03/sql-migrations/database/migrations/
```

The directory structure has been preserved to maintain context about their original location.