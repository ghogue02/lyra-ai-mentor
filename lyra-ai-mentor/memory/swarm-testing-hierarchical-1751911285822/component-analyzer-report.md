# Maya Blur Functionality Analysis Report

## Executive Summary
The Component Analyzer Agent has completed a comprehensive analysis of the Maya blur functionality issue. The blur mechanism is controlled by a state variable `panelBlurLevel` with three states: 'full', 'partial', and 'clear'. The issue appears to be related to timing and React state update batching when narrative completion occurs.

## Blur Mechanism Overview

### State Management
- **Variable**: `panelBlurLevel`
- **Values**: `'full'` | `'partial'` | `'clear'`
- **Initial State**: `'full'` (heavily blurred)
- **Location**: `LyraNarratedMayaSideBySideComplete.tsx:30`

### Blur Control Points

1. **Stage Configuration**
   - Each stage defines initial blur via `panelBlurState` property
   - Example: `stages.tsx:39 - panelBlurState: 'full'`
   - Affected stages: intro, pace-purpose, pace-audience, pace-connection, tone-mastery

2. **Message Triggers**
   - Messages can trigger blur changes via `trigger: 'blur-clear'`
   - Implementation in `hooks.ts:58-60`
   - Example: `stages.tsx:102`

3. **Narrative Completion**
   - Completion callback ensures panel is unblurred
   - Location: `LyraNarratedMayaSideBySideComplete.tsx:135-143`
   - Sets `isNarrativeComplete(true)` and `setPanelBlurLevel('clear')`

4. **Fast Forward**
   - Immediately clears blur and marks narrative complete
   - Location: `LyraNarratedMayaSideBySideComplete.tsx:177-179`

## Identified Issues

### 1. Stale Closure Risk (Medium Severity)
- `panelBlurLevel` passed as function to stages might capture stale values
- Location: `stages.tsx:24`

### 2. Completion Timing (High Severity)
- 500ms delay before completion callback might conflict with React updates
- Locations: `hooks.ts:104-108`, `hooks.ts:128-133`

### 3. Empty Messages Handling (Medium Severity)
- When stage has no narrative messages, completion might not trigger blur clear
- Location: `LyraNarratedMayaSideBySideComplete.tsx:144-147`

### 4. State Update Batching (High Severity)
- Multiple state updates in completion callback might batch incorrectly
- Location: `LyraNarratedMayaSideBySideComplete.tsx:137-142`

## Test Scenarios Identified

1. **Empty narrative messages** - Test stage with no narrativeMessages array
2. **Messages without blur triggers** - Test messages without `trigger: 'blur-clear'`
3. **Fast-forward during typing** - Click fast-forward while message is being typed
4. **Rapid stage transitions** - Quickly navigate between stages
5. **React 18 batching** - Test with React 18's automatic batching
6. **Concurrent features** - Test with React concurrent features enabled
7. **Component unmount during typing** - Navigate away while narrative is typing
8. **Multiple completion callbacks** - Test if completion callback fires multiple times

## Key Files Analyzed

1. `src/components/lesson/chat/lyra/maya/LyraNarratedMayaSideBySideComplete.tsx` - Main component
2. `src/components/lesson/chat/lyra/maya/stages.tsx` - Stage configurations
3. `src/components/lesson/chat/lyra/maya/hooks.ts` - Processing logic
4. `src/components/interactive/MayaEmailComposer.tsx` - Interactive component

## Recommended Fixes

### High Priority
1. Use `useCallback` for panelBlurLevel getter or pass value directly to prevent stale closures
2. Ensure completion callback runs in `useEffect` to avoid batching issues with React 18

### Medium Priority
1. Add explicit blur clear for empty narrative stages

### Low Priority
1. Add debug logging for blur state transitions

## Why the Interactive Element Doesn't Unblur

The primary issue appears to be a race condition between:
1. The narrative completion callback that tries to clear the blur
2. React's state update batching mechanism
3. The timing delays (500ms) in the completion callbacks

When narrative messages finish typing, the completion callback should set `panelBlurLevel` to 'clear', but the state update might be:
- Batched with other updates and delayed
- Overridden by stage configuration
- Lost due to stale closure references

## Next Steps
The Test Writer Agent should create tests focusing on the timing and state update scenarios identified in this analysis.