# Bundle Size Analysis Report

## Current State (Critical Issues)
- **Total Bundle Size**: 2.41 MB (minified)
- **Gzipped Size**: 613 KB
- **Target Reduction**: 60%+ (down to <1MB)
- **Critical threshold exceeded**: 500KB warning triggered

## Heavy Dependencies Analysis

### Major Dependencies by Import Count:
1. **Lucide React Icons**: 202 imports across codebase
2. **Framer Motion**: 103 imports (animations)
3. **Radix UI**: 34+ components imported

### Largest Source Files (by line count):
1. `src/integrations/supabase/types.ts` - 1,190 lines
2. `src/components/lesson/carmen/CarmenTalentAcquisition.tsx` - 970 lines
3. `src/components/ui/interaction-patterns/PriorityCardSystem.tsx` - 787 lines
4. `src/hooks/usePageContext.ts` - 783 lines
5. `src/components/ui/interaction-patterns/PreferenceSliderGrid.tsx` - 782 lines

### Bundle Composition Issues:
1. **All Routes Loaded Eagerly**: 185+ route components loaded at startup
2. **Interactive Journey Registry**: 352+ lines of static imports
3. **Carmen Components**: 8 heavy components (600-970 lines each)
4. **Chapter Hubs**: 7 individual hub components
5. **UI Pattern Library**: 5 large interaction pattern components

## Critical Problem Areas

### 1. InteractiveJourney.tsx (Major Bloat)
- **Static imports**: 57 different lesson components
- **Journey registry**: All components loaded regardless of use
- **Bundle impact**: ~40% of total bundle size

### 2. Carmen Components (Chapter 7)
- 8 components averaging 700+ lines each
- Heavy UI interaction patterns
- Framer Motion animations throughout

### 3. UI Interaction Patterns
- 5 large pattern components (700+ lines each)
- Complex state management
- Heavy animation libraries

### 4. App.tsx Route Loading
- 15+ chapter hub components
- All routes imported statically
- No lazy loading implemented

## Optimization Strategy

### Phase 1: Critical Code Splitting (60% reduction target)
1. **Lazy load all route components**
2. **Dynamic imports for InteractiveJourney registry**
3. **Carmen component chunking**
4. **UI pattern lazy loading**

### Phase 2: Dependency Optimization
1. **Tree shake unused Radix components**
2. **Selective Lucide icon imports**
3. **Conditional Framer Motion loading**

### Phase 3: Asset Optimization
1. **CSS code splitting**
2. **Dynamic import chunks**
3. **Preload critical paths only**

## Implementation Priority

### High Priority (Immediate 40-50% reduction):
- [ ] Lazy load InteractiveJourney components
- [ ] Dynamic Carmen component imports
- [ ] Route-level code splitting

### Medium Priority (Additional 10-15% reduction):
- [ ] UI interaction pattern splitting
- [ ] Icon tree shaking
- [ ] Animation conditional loading

### Low Priority (Final 5-10% optimization):
- [ ] CSS optimization
- [ ] Vendor chunk optimization
- [ ] Preload strategy implementation

## Expected Results
- **Phase 1**: 2.41MB → 1.2MB (~50% reduction)
- **Phase 2**: 1.2MB → 0.9MB (~25% additional reduction)
- **Phase 3**: 0.9MB → 0.8MB (~10% final optimization)

**Total Expected Reduction**: 67% (2.41MB → 0.8MB)