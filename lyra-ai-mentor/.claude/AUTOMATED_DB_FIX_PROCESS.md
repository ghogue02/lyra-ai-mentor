# 🤖 Automated Database Fix Process (MCP-Integrated)

## Overview

This document describes the fully automated process for fixing database schema issues using MCP tools and swarm coordination. The system can detect, diagnose, and fix database issues without manual intervention.

## Architecture

```mermaid
graph TD
    A[Error Detection] --> B[MCP Workflow Trigger]
    B --> C[Generate SQL Fix]
    C --> D{Environment Check}
    D -->|Has DB URL| E[Apply Fix Automatically]
    D -->|No DB URL| F[Generate Manual Instructions]
    E --> G[Verify Fix]
    F --> H[Store in MCP Memory]
    G --> I[Update TypeScript Types]
    H --> J[Alert User]
```

## Automated Components

### 1. **MCP Database Fix Generator** (`scripts/mcp-db-fix.js`)
- Generates complete SQL fix with DROP/CREATE statements
- Creates automation shell script
- Integrates with MCP memory storage
- Provides multiple execution paths

### 2. **MCP Workflow** (`.claude/workflows/db-fix-automation-v2.json`)
- Auto-triggers on database errors
- Executes fix sequence
- Handles fallback scenarios
- Stores results in memory

### 3. **Automation Scripts**
- `apply-mcp-fix.sh` - Applies fix if DATABASE_URL available
- `verify-toolkit-fix.js` - Validates database state
- `validate-and-fix.js` - Combined validation and fix

## Usage Methods

### Method 1: Fully Automated (With DATABASE_URL)

```bash
# Set environment variable (get from Supabase dashboard)
export DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Run automated fix
npm run db:fix:apply
```

### Method 2: MCP Tool Trigger

```javascript
// In Claude Code with MCP tools
mcp__claude-flow__workflow_execute({ 
  workflowId: "db-fix-automation-v2" 
})
```

### Method 3: NPM Scripts

```bash
# Generate fix files
npm run db:fix

# Apply fix (requires DATABASE_URL)
npm run db:fix:apply

# Check database state
npm run db:check

# Validate and attempt auto-fix
npm run db:validate
```

### Method 4: Manual Fallback

1. Run `npm run db:fix` to generate SQL
2. Copy contents of `scripts/mcp-toolkit-fix.sql`
3. Paste in Supabase SQL Editor
4. Run the script
5. Verify with `npm run db:check`

## Environment Configuration

### Required for Full Automation

```env
# Supabase connection
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# OR using individual components
SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Optional but recommended
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Finding Your DATABASE_URL

1. Go to Supabase Dashboard
2. Navigate to Settings → Database
3. Copy "Connection string" (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password

## Error Patterns Handled

The system automatically detects and fixes:

1. **Missing Tables**
   - `404 (Not Found)` on table queries
   - `relation "toolkit_categories" does not exist`

2. **Missing Data**
   - `Could not find email category`
   - Empty category results

3. **Permission Issues**
   - RLS policy violations
   - Missing grants

## MCP Memory Integration

The system stores state in MCP memory:

```javascript
// Stored keys
"db-fix/issue-detected" - When error is detected
"db-fix/sql-generated" - SQL fix file location
"db-fix/manual-required" - When manual intervention needed
"db-fix/fix-applied" - Success confirmation
"db-validation/{timestamp}" - Validation results
```

## Swarm Coordination

When using swarms for database fixes:

```javascript
// Initialize database fix swarm
mcp__claude-flow__swarm_init({ 
  topology: "hierarchical",
  maxAgents: 3,
  strategy: "specialized"
});

// Spawn specialized agents
mcp__claude-flow__agent_spawn({ type: "analyst", name: "DB Schema Checker" });
mcp__claude-flow__agent_spawn({ type: "coder", name: "SQL Generator" });
mcp__claude-flow__agent_spawn({ type: "tester", name: "Fix Verifier" });

// Orchestrate fix
mcp__claude-flow__task_orchestrate({ 
  task: "Fix missing toolkit tables",
  strategy: "sequential"
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Database Health Check
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours

jobs:
  db-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Check database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          npm run db:check || npm run db:fix:apply
          
      - name: Verify fix
        run: npm run db:check
```

## Monitoring & Alerts

### Check Logs

```bash
# View recent fix attempts
ls -la scripts/logs/db-fix-report-*.json

# Check MCP memory
npx claude-flow memory list --pattern "db-"
```

### Health Status

```javascript
// Quick health check
import { verifyToolkitData } from './src/utils/ensureToolkitData.js';
const health = await verifyToolkitData(supabase);
console.log('Database healthy:', health.isValid);
```

## Troubleshooting

### Common Issues

1. **"psql not found"**
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   ```

2. **"Permission denied"**
   ```bash
   chmod +x scripts/apply-mcp-fix.sh
   ```

3. **"Cannot connect to database"**
   - Verify DATABASE_URL is correct
   - Check Supabase service status
   - Ensure IP is whitelisted

### Manual Override

If automation fails completely:

1. Get SQL from `scripts/mcp-toolkit-fix.sql`
2. Go to https://supabase.com/dashboard
3. Select your project → SQL Editor
4. Paste and run the SQL
5. Verify with `npm run db:check`

## Best Practices

1. **Always verify after fixes**
   ```bash
   npm run db:check
   ```

2. **Store DATABASE_URL securely**
   - Use `.env` file (git-ignored)
   - Or environment variables
   - Never commit credentials

3. **Regular health checks**
   ```bash
   # Add to daily routine
   npm run db:validate
   ```

4. **Monitor MCP memory**
   ```bash
   # Check for repeated issues
   npx claude-flow memory search --query "db-fix"
   ```

## Summary

This automated system eliminates manual database fix processes by:

- ✅ Auto-detecting schema issues
- ✅ Generating fixes dynamically
- ✅ Applying fixes when possible
- ✅ Providing clear fallback instructions
- ✅ Integrating with MCP tools
- ✅ Storing state for analysis
- ✅ Supporting multiple execution methods

The system ensures database issues are resolved quickly and consistently, reducing downtime and manual intervention.