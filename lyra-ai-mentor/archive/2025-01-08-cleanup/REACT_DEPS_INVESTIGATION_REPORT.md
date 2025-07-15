# React Dependencies Investigation Report

## Issue Summary
504 Outdated Optimize Dep errors for:
- `react/jsx-dev-runtime`
- `react-dom/client`

Specifically occurring at route: `/lyra-maya-demo`

## Investigation Findings

### 1. React Version Analysis
- **React Version**: 18.3.1 (consistent across all dependencies)
- **React-DOM Version**: 18.3.1 (matching React version)
- **No version conflicts detected** - all dependencies properly deduped

### 2. TypeScript Configuration
- Using new JSX transform: `"jsx": "react-jsx"` in tsconfig.app.json
- This means files don't need explicit React imports
- Vite needs to know about jsx-runtime for optimization

### 3. Import Pattern Analysis
- No direct imports of `react/jsx-dev-runtime` found in codebase
- Only one file imports `react-dom/client`: `src/main.tsx`
- Route `/lyra-maya-demo` properly configured with lazy loading

### 4. Component Structure
```
/lyra-maya-demo → LyraNarratedMayaDemo → LyraNarratedMayaSideBySide
```
- Uses Suspense for lazy loading
- Imports React traditionally in component files
- Large component with complex dependencies (framer-motion, multiple UI components)

## Root Cause
The issue occurs because:
1. Vite's dependency pre-bundling doesn't include React's jsx-runtime
2. The new JSX transform requires jsx-runtime but it's not explicitly imported
3. Large components with many dependencies can trigger re-optimization during development

## Recommended Solution

### 1. Update vite.config.ts optimizeDeps
```typescript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    // ... existing includes
  ],
  // Force pre-bundling to avoid runtime discoveries
  force: true,
}
```

### 2. Alternative: Configure React plugin for classic runtime
If issues persist, switch to classic JSX runtime:
```typescript
plugins: [
  react({
    jsxRuntime: 'classic',
  }),
  // ... other plugins
]
```

### 3. Clear Vite cache and restart
```bash
rm -rf node_modules/.vite
npm run dev
```

## Additional Recommendations

1. **Pre-bundle heavy dependencies**: Add framer-motion and other heavy deps to optimizeDeps.include
2. **Check for circular dependencies**: Large components might have circular imports
3. **Monitor bundle size**: The LyraNarratedMayaSideBySide component is large and might benefit from code splitting

## Files to Update
1. `/Users/greghogue/Lyra New/lyra-ai-mentor/vite.config.ts` - Add jsx-runtime to optimizeDeps
2. Consider splitting `/src/components/lesson/chat/lyra/LyraNarratedMayaSideBySide.tsx` into smaller components