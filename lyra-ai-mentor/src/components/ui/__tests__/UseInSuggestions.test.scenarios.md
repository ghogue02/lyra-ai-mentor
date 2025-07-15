# UseInSuggestions Click Flow Test Scenarios

## Test Suite Overview
This document outlines comprehensive test scenarios for the UseInSuggestions component click flow functionality.

## 1. Normal Flow Tests

### 1.1 Basic Click Interaction
**Scenario**: User clicks on a suggestion button
**Setup**:
```typescript
const props = {
  content: { message: "Test email content" },
  contentType: 'email',
  fromCharacter: 'Maya',
  componentType: 'maya-email'
};
```
**Expected Behavior**:
- Button click triggers `handleUseIn` function
- SharedContent object created with correct structure
- `componentIntegrationService.shareContent` called with proper data
- Success toast displayed with correct message
- Navigation offered if route exists in suggestion

### 1.2 Multiple Suggestions Display
**Scenario**: Component renders with multiple suggestions
**Setup**:
```typescript
const suggestions = [
  { toComponent: 'David Data Visualizer', benefit: 'Add data-driven insights' },
  { toComponent: 'Sofia Story Creator', benefit: 'Enhance with narratives' },
  { toComponent: 'Communication Metrics', benefit: 'Track effectiveness' }
];
```
**Expected Behavior**:
- Maximum 3 suggestions displayed (slice(0, 3))
- Each button shows correct component name
- Sparkles icon rendered for each button
- Benefit text shown below buttons

### 1.3 Navigation Flow
**Scenario**: Click suggestion with route defined
**Setup**:
```typescript
const suggestion = {
  toComponent: 'David Analytics',
  benefit: 'Support with data',
  route: '/analytics/dashboard'
};
```
**Expected Behavior**:
- Toast shows "Go there" action button
- Clicking action navigates to specified route
- Navigation uses React Router navigate function

## 2. Edge Case Tests

### 2.1 Empty Suggestions
**Scenario**: No suggestions available for component type
**Setup**:
```typescript
componentType: 'unknown-component'
// getSuggestions returns []
```
**Expected Behavior**:
- Component returns null (no render)
- No errors thrown
- No UI elements displayed

### 2.2 Null/Undefined Content
**Scenario**: Content prop is null or undefined
**Setup**:
```typescript
content: null // or undefined
```
**Expected Behavior**:
- SharedContent still created with null data
- localStorage stores null value properly
- Toast still shows success
- No JavaScript errors

### 2.3 Missing Component Type
**Scenario**: componentType not in integrationMap
**Setup**:
```typescript
componentType: 'non-existent-type'
```
**Expected Behavior**:
- getSuggestions returns empty array
- Component returns null
- No errors in console

### 2.4 Invalid Content Type
**Scenario**: contentType not in allowed values
**Setup**:
```typescript
contentType: 'invalid' as any
```
**Expected Behavior**:
- TypeScript should catch at compile time
- Runtime still processes (type stored as-is)
- SharedContent type field contains invalid value

## 3. Error Handling Tests

### 3.1 localStorage Full
**Scenario**: localStorage quota exceeded
**Setup**:
```typescript
// Fill localStorage to quota
// Then trigger shareContent
```
**Expected Behavior**:
- Try-catch in service should handle error
- Toast might still show success (current implementation)
- Console error logged
- Component continues to function

### 3.2 Navigation Failure
**Scenario**: React Router navigation fails
**Setup**:
```typescript
// Mock navigate to throw error
```
**Expected Behavior**:
- Toast action click doesn't crash app
- Error boundary (if exists) catches error
- User can still use other features

### 3.3 Service Method Failures
**Scenario**: componentIntegrationService methods fail
**Setup**:
```typescript
// Mock service methods to throw
```
**Expected Behavior**:
- Component handles gracefully
- Appropriate error messages shown
- UI remains interactive

## 4. Integration Tests

### 4.1 Cross-Component Sharing
**Scenario**: Share from Maya to David component
**Test Flow**:
1. Click suggestion in Maya Email Composer
2. Navigate to David Data Visualizer
3. Check if shared content available
**Expected Behavior**:
- localStorage contains shared content
- Other component can retrieve using getSharedContent
- Content cleared after retrieval (one-time use)

### 4.2 History Tracking
**Scenario**: Multiple shares create history
**Test Flow**:
1. Perform multiple shares
2. Check integration history
**Expected Behavior**:
- Each share tracked in history
- History limited to 100 entries
- getMostUsedIntegrations returns top patterns

### 4.3 Content Transformation
**Scenario**: Content transformed between types
**Test Flow**:
1. Share email content to story component
2. Check transformation applied
**Expected Behavior**:
- transformContent method called
- Appropriate transformation applied
- Suggestions included for new format

## 5. UI Behavior Tests

### 5.1 Visual Feedback
**Scenario**: Click provides immediate feedback
**Expected Behavior**:
- Button hover state activates (hover:bg-white)
- Click shows active state
- Toast appears immediately
- Loading state if async operations

### 5.2 Responsive Design
**Scenario**: Component adapts to screen sizes
**Expected Behavior**:
- Grid layout adjusts appropriately
- Text remains readable
- Buttons remain clickable
- Card padding consistent

### 5.3 Accessibility
**Scenario**: Keyboard navigation and screen readers
**Expected Behavior**:
- Buttons focusable via Tab
- Enter/Space triggers click
- Proper ARIA labels
- Screen reader announces actions

## 6. Performance Tests

### 6.1 Multiple Rapid Clicks
**Scenario**: User clicks multiple suggestions quickly
**Expected Behavior**:
- Each click processed separately
- No race conditions
- localStorage operations queued
- Toasts stack or replace appropriately

### 6.2 Large Content Handling
**Scenario**: Share very large content object
**Setup**:
```typescript
content: { data: 'x'.repeat(1000000) } // 1MB string
```
**Expected Behavior**:
- localStorage handles within quota
- No UI freezing
- Toast shows normally
- Performance remains acceptable

## Test Implementation Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UseInSuggestions } from '../UseInSuggestions';
import { componentIntegrationService } from '@/services/componentIntegrationService';
import { toast } from 'sonner';

jest.mock('sonner');
jest.mock('@/services/componentIntegrationService');

describe('UseInSuggestions Click Flow', () => {
  it('handles suggestion click correctly', async () => {
    const mockShareContent = jest.fn();
    componentIntegrationService.shareContent = mockShareContent;
    componentIntegrationService.getSuggestions = jest.fn().mockReturnValue([
      {
        toComponent: 'Test Component',
        benefit: 'Test benefit',
        fromComponent: 'maya-email',
        description: 'Test description'
      }
    ]);

    render(
      <UseInSuggestions
        content={{ test: 'data' }}
        contentType="email"
        fromCharacter="Maya"
        componentType="maya-email"
      />
    );

    const button = screen.getByText('Test Component');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockShareContent).toHaveBeenCalledWith({
        data: { test: 'data' },
        fromCharacter: 'Maya',
        toComponent: 'Test Component',
        timestamp: expect.any(String),
        type: 'email'
      });
      
      expect(toast.success).toHaveBeenCalledWith(
        'Content ready for Test Component',
        expect.objectContaining({
          description: 'Test benefit'
        })
      );
    });
  });
});
```

## Automation Script

```bash
#!/bin/bash
# Run all UseInSuggestions tests
npm test -- UseInSuggestions --coverage
npm test -- componentIntegrationService --coverage

# Run specific scenarios
npm test -- UseInSuggestions --testNamePattern="click flow"
npm test -- UseInSuggestions --testNamePattern="edge cases"
npm test -- UseInSuggestions --testNamePattern="error handling"
```

## Validation Checklist

- [ ] All suggestion buttons clickable
- [ ] Correct data shared to localStorage
- [ ] Toast notifications appear
- [ ] Navigation works when route provided
- [ ] No console errors during interactions
- [ ] Component handles missing data gracefully
- [ ] Integration with other components verified
- [ ] Performance acceptable with large data
- [ ] Accessibility requirements met
- [ ] Visual feedback appropriate