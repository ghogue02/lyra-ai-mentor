# Vite Dependency Optimization Test Plan for /lyra-maya-demo Route

## Overview
This test plan validates the Vite dependency optimization fixes for the `/lyra-maya-demo` route to prevent 504 Gateway Timeout errors during development.

## Test Objectives
1. Verify React dependencies are properly pre-bundled
2. Validate lazy-loaded components are optimized correctly
3. Ensure no circular dependency issues exist
4. Monitor bundle size and load performance
5. Test error recovery mechanisms

## Prerequisites
- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Development server not running initially
- Chrome DevTools or similar browser tools available

## Test Environment Setup
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Set up monitoring environment
export VITE_DEBUG=true
export NODE_ENV=development
```

## Test Cases

### TC1: Clean Build Test
**Objective**: Verify clean build without dependency optimization issues

**Steps**:
1. Clear all caches: `rm -rf node_modules/.vite dist`
2. Start dev server: `npm run dev`
3. Navigate to http://localhost:8080/lyra-maya-demo
4. Monitor console for optimization warnings

**Expected Results**:
- No "optimizing dependencies" warnings after initial load
- Page loads within 3 seconds
- No 504 errors

### TC2: React Dependency Pre-bundling
**Objective**: Ensure React and related dependencies are properly pre-bundled

**Steps**:
1. Inspect `node_modules/.vite/deps` directory
2. Verify presence of:
   - react.js
   - react-dom.js
   - react-router-dom.js
3. Check file sizes are reasonable (< 500KB each)

**Expected Results**:
- All React dependencies present in .vite/deps
- No duplicate React instances
- Consistent module format (ESM)

### TC3: Lazy Loading Performance
**Objective**: Test lazy-loaded component optimization

**Steps**:
1. Clear browser cache
2. Open Network tab in DevTools
3. Navigate to /lyra-maya-demo
4. Monitor chunk loading

**Expected Results**:
- Initial bundle < 250KB
- Lazy chunks load on demand
- No duplicate module loading

### TC4: Dependency Tree Analysis
**Objective**: Identify circular dependencies or problematic imports

**Steps**:
1. Run dependency analysis script (see scripts/analyze-deps.js)
2. Check for circular dependencies
3. Validate import paths

**Expected Results**:
- No circular dependencies detected
- All imports resolve correctly
- No missing dependencies

### TC5: Hot Module Replacement (HMR)
**Objective**: Ensure HMR works without triggering re-optimization

**Steps**:
1. Start dev server
2. Navigate to /lyra-maya-demo
3. Modify a component file
4. Check for HMR update

**Expected Results**:
- HMR updates apply without full reload
- No "optimizing dependencies" message
- Changes reflect immediately

### TC6: Stress Test
**Objective**: Test under load conditions

**Steps**:
1. Open 5 browser tabs to /lyra-maya-demo
2. Rapidly navigate between routes
3. Monitor server memory usage
4. Check for 504 errors

**Expected Results**:
- No 504 errors
- Memory usage stable
- All tabs responsive

### TC7: Error Recovery
**Objective**: Test error recovery mechanisms

**Steps**:
1. Intentionally corrupt a dependency
2. Start dev server
3. Fix the corruption
4. Verify recovery

**Expected Results**:
- Clear error messages
- Graceful recovery after fix
- No lingering optimization issues

## Performance Metrics

### Key Metrics to Track:
1. **Time to First Byte (TTFB)**: < 200ms
2. **First Contentful Paint (FCP)**: < 1.5s
3. **Time to Interactive (TTI)**: < 3s
4. **Bundle Size**: Initial < 250KB, Total < 1MB
5. **Memory Usage**: < 100MB increase per tab

### Monitoring Tools:
- Chrome DevTools Performance tab
- Lighthouse CI
- Vite's built-in profiler
- Custom performance monitoring (see scripts/monitor-performance.js)

## Validation Checklist

- [ ] All test cases pass
- [ ] No console errors or warnings
- [ ] Performance metrics within acceptable ranges
- [ ] No 504 errors during normal usage
- [ ] HMR works consistently
- [ ] Bundle sizes optimized
- [ ] Dependencies properly cached
- [ ] Error recovery mechanisms functional

## Continuous Monitoring

### Automated Checks:
1. Pre-commit hook to verify deps
2. CI pipeline performance tests
3. Dependency update monitoring
4. Bundle size tracking

### Manual Checks:
1. Weekly performance review
2. User feedback monitoring
3. Error log analysis
4. Dependency audit

## Issue Reporting

If issues are found:
1. Document exact steps to reproduce
2. Capture console logs
3. Note system specifications
4. Create GitHub issue with:
   - Error messages
   - Network waterfall
   - Performance timeline
   - Suggested fixes

## Success Criteria

The fix is considered successful when:
1. No 504 errors in 100 consecutive page loads
2. All performance metrics meet targets
3. HMR works without re-optimization
4. User reports confirm improved experience
5. CI/CD pipeline passes all tests