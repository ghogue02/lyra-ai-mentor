# Carmen Component Icon Mapping

## Overview
This document outlines the replacement of generic Lucide icons with professional Lyra app icons from Supabase storage across all Carmen component intro phases.

## Icon Replacements Summary

### CarmenEngagementBuilder
- **Main Avatar**: `Sparkles` → `engagementSatisfied`
- **Crisis Step**: `Heart` → `engagementMask`
- **Discovery Step**: `Sparkles` → `engagementShining`
- **Success Step**: `TrendingUp` → `engagementRocket`

### CarmenPerformanceInsights
- **Main Avatar**: `BarChart3` → `performanceMetrics`
- **Anxiety Step**: `BarChart3` → `performanceBalance`
- **Discovery Step**: `Heart` → `performanceFeedback`
- **Growth Step**: `TrendingUp` → `performanceGrowth`

### CarmenRetentionMastery
- **Main Avatar**: `Shield` → `retentionHandshake`
- **Crisis Step**: `Heart` → `retentionDecline`
- **Predictive Step**: `TrendingUp` → `retentionCrystalBall`
- **Success Step**: `Award` → `retentionUp`

### CarmenTalentAcquisition
- **Main Avatar**: `Users` → `teamMedium`
- **Frustration Step**: `Heart` → `performanceUniform`
- **Framework Step**: `Users` → `performanceBalance`
- **Transformation Step**: `TrendingUp` → `retentionTeam`

### CarmenCulturalIntelligence
- **All Steps**: Generic fallbacks → `retentionCulture`

### CarmenLeadershipDevelopment
- **All Steps**: Generic fallbacks → `retentionLeadership`

### CarmenTeamDynamics
- **All Steps**: Generic fallbacks → `teamMedium`

## Icon Categories Used

### Engagement Icons
- `engagementSatisfied` - Main engagement representation
- `engagementMask` - Crisis/challenge scenarios
- `engagementShining` - Discovery/insight moments
- `engagementRocket` - Success/transformation

### Performance Icons
- `performanceMetrics` - Data-driven approaches
- `performanceBalance` - Balanced/fair processes
- `performanceFeedback` - Communication/empathy
- `performanceGrowth` - Development/improvement

### Retention Icons
- `retentionHandshake` - Relationship building
- `retentionDecline` - Problem identification
- `retentionCrystalBall` - Predictive insights
- `retentionUp` - Positive outcomes
- `retentionCulture` - Cultural aspects
- `retentionLeadership` - Leadership development
- `retentionTeam` - Team collaboration

### Team Icons
- `teamMedium` - General team representation

## Technical Implementation

### Import Changes
All Carmen components now import:
```typescript
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
```

### Fallback Icon Pattern
```typescript
fallbackIcon={<img src={getCarmenManagementIconUrl('iconName')} alt="Description" className="w-8 h-8" />}
```

## Benefits

1. **Professional Branding**: Consistent Lyra app iconography
2. **Contextual Relevance**: Icons match specific management concepts
3. **Visual Hierarchy**: Clear progression through journey steps
4. **Accessibility**: Proper alt text for screen readers
5. **Performance**: Optimized icon loading from Supabase CDN

## Testing Status

- ✅ TypeScript compilation successful
- ✅ Build process completed without errors
- ✅ Icon sizing and styling consistent across components
- ✅ Proper fallback behavior maintained

## Future Considerations

- Monitor icon loading performance
- Consider lazy loading for better initial page load
- Add icon preloading for critical path components
- Implement icon error boundaries for graceful fallbacks