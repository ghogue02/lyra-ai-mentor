# 🔑 Get Your Database Connection String

To apply the database fix automatically via terminal, I need your Supabase database connection string.

## Step 1: Get Your Connection String

1. **Go to**: https://supabase.com/dashboard/projects
2. **Click** on your project (`hfkzwjnlxrwynactcmpe`)
3. **Navigate to**: Settings → Database
4. **Scroll down** to "Connection string"
5. **Select**: "URI" tab
6. **Copy** the connection string (looks like this):

```
postgresql://postgres:[YOUR-PASSWORD]@db.hfkzwjnlxrwynactcmpe.supabase.co:5432/postgres
```

## Step 2: Provide the Information

**Option A: Set Environment Variable (Recommended)**
```bash
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hfkzwjnlxrwynactcmpe.supabase.co:5432/postgres"
```

**Option B: Add to .env File**
```bash
echo 'DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hfkzwjnlxrwynactcmpe.supabase.co:5432/postgres"' >> .env
```

**Option C: Just Give Me the Password**
If you just tell me your database password, I can construct the full URL since I already know:
- Host: `db.hfkzwjnlxrwynactcmpe.supabase.co`
- User: `postgres`
- Database: `postgres`
- Port: `5432`

## What I Need From You

Just paste ONE of these:

1. **Full connection string**: `postgresql://postgres:[password]@db.hfkzwjnlxrwynactcmpe.supabase.co:5432/postgres`

2. **Just the password**: `your_database_password_here`

3. **Or just say**: "I've set the DATABASE_URL environment variable"

## Security Note

- The password will only be used to fix the database
- I won't store or log the credentials
- You can change the password afterward if desired
- The connection is encrypted (uses SSL)

## After You Provide the Info

I'll run:
```bash
export DATABASE_URL="your-connection-string"
./scripts/apply-mcp-fix.sh
npm run db:check
```

And your database will be fixed in seconds!

## Alternative: No Password Needed

If you prefer not to share credentials, just:
1. Copy the SQL from `scripts/mcp-toolkit-fix.sql`
2. Paste it in Supabase SQL Editor
3. Click Run

Both methods will achieve the same result.