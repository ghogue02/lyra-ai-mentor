# Vite Error Quick Reference Card

## 504 Outdated Optimize Dep - Quick Fix

### Immediate Actions (90% Success Rate)
```bash
# 1. Kill all Vite processes
pkill -f vite

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Restart dev server
npm run dev
```

### If That Doesn't Work (99% Success Rate)
```bash
# 1. Full cleanup
rm -rf node_modules/.vite
rm -rf node_modules
rm package-lock.json

# 2. Fresh install
npm install

# 3. Force start
npm run dev -- --force
```

## Common Vite Errors & Solutions

### Error: "Failed to resolve import"
```bash
# Add to vite.config.ts optimizeDeps.include
optimizeDeps: {
  include: ['problematic-package']
}
```

### Error: "Cannot find module" (ESM issues)
```bash
# Ensure package is included for pre-bundling
optimizeDeps: {
  include: ['@some/commonjs-package']
}
```

### Error: Browser refresh loop
```bash
# Clear browser cache
# Chrome: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
# Then restart Vite
```

### Error: Port already in use
```bash
# Find and kill process on port 8080
lsof -i :8080
kill -9 [PID]

# Or use different port
npm run dev -- --port 3001
```

## Prevention Commands

Add to package.json:
```json
{
  "scripts": {
    "dev:clean": "rm -rf node_modules/.vite && vite",
    "dev:force": "vite --force",
    "clean:all": "rm -rf node_modules/.vite node_modules package-lock.json && npm install"
  }
}
```

## When to Use Each Command

| Situation | Command | Why |
|-----------|---------|-----|
| After `npm install` | `npm run dev:clean` | Clears potentially stale cache |
| After git branch switch | `npm run dev:clean` | Dependencies might have changed |
| Random 504 errors | `pkill -f vite && npm run dev` | Process might be stuck |
| Persistent issues | `npm run clean:all` | Full reset |
| CI/CD environments | `npm ci && npm run dev:force` | Ensures clean state |

## Emergency Contacts
- Check `docs/VITE_504_ERROR_FIX_GUIDE.md` for detailed explanations
- Run diagnostics: `npx vite --debug`
- Check Vite version: `npm list vite`