# UseInSuggestions Manual Test Checklist

## Pre-Test Setup
1. [ ] Ensure development server is running (`npm run dev`)
2. [ ] Clear browser localStorage
3. [ ] Open browser DevTools Console
4. [ ] Navigate to a component that uses UseInSuggestions (e.g., Maya Email Composer)

## Test Execution

### 1. Basic Click Flow
- [ ] **Verify Component Renders**
  - Confirm "Use This Content In..." card appears
  - Check that up to 3 suggestion buttons are visible
  - Verify Sparkles icon present

- [ ] **Click First Suggestion**
  - Click on first suggestion button
  - Verify toast notification appears immediately
  - Check toast message shows "Content ready for [Component Name]"
  - Verify benefit description in toast

- [ ] **Check localStorage**
  - In DevTools Console, run: `localStorage.getItem('shared-content-[component-name]')`
  - Verify stored data structure contains:
    - data (the content)
    - fromCharacter
    - toComponent
    - timestamp
    - type

### 2. Navigation Testing
- [ ] **Click Suggestion with Route**
  - Find suggestion that includes navigation (e.g., to Analytics)
  - Click the suggestion
  - Check if toast shows "Go there" action button
  - Click "Go there"
  - Verify navigation to correct route

### 3. Multiple Clicks
- [ ] **Rapid Sequential Clicks**
  - Click different suggestions quickly
  - Verify each generates separate toast
  - Check localStorage has different entries
  - Confirm no UI freezing or errors

### 4. Edge Cases
- [ ] **Component Without Suggestions**
  - Navigate to component with unknown type
  - Verify UseInSuggestions doesn't render
  - Check no console errors

- [ ] **Large Content Test**
  - Create content with lots of data
  - Click suggestion
  - Monitor performance (no lag)
  - Verify localStorage handles it

### 5. Integration Flow
- [ ] **End-to-End Sharing**
  1. In Maya Email Composer, create email content
  2. Click "Use in David Data Visualizer"
  3. Navigate to David's component
  4. Verify shared content is available
  5. Confirm content cleared after use

### 6. Visual & UX
- [ ] **Hover States**
  - Hover over suggestion buttons
  - Verify hover background changes to white
  - Check border color changes to blue

- [ ] **Responsive Design**
  - Resize browser window
  - Verify layout adapts properly
  - Check text remains readable
  - Confirm buttons stay clickable

### 7. Error Scenarios
- [ ] **Fill localStorage**
  - Run: `for(let i=0; i<1000; i++) localStorage.setItem('test'+i, 'x'.repeat(10000))`
  - Try clicking suggestion
  - Verify graceful handling (no crash)

- [ ] **Interrupt Navigation**
  - Click suggestion with route
  - Quickly navigate elsewhere before toast action
  - Verify no errors occur

### 8. Accessibility
- [ ] **Keyboard Navigation**
  - Tab to suggestion buttons
  - Verify focus indicators visible
  - Press Enter/Space to activate
  - Confirm same behavior as click

- [ ] **Screen Reader**
  - Enable screen reader
  - Verify buttons announced properly
  - Check component purpose is clear

## Expected Results Summary

### ✅ Success Criteria
- All suggestion buttons are clickable
- Toast notifications appear for every click
- Content is stored in localStorage correctly
- Navigation works when routes are provided
- No console errors during any interaction
- Component handles edge cases gracefully
- Visual feedback is appropriate
- Accessibility features work correctly

### ❌ Failure Indicators
- JavaScript errors in console
- Buttons not responding to clicks
- Toast notifications not appearing
- localStorage not containing shared data
- Navigation failing or going to wrong route
- UI freezing or becoming unresponsive
- Missing hover states or visual feedback
- Keyboard navigation not working

## Bug Report Template
If issues found, document:
```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Console Errors**: [Any errors]
**Browser**: [Chrome/Firefox/Safari version]
```

## Performance Metrics
Record these metrics during testing:
- [ ] Time from click to toast appearance: ____ms
- [ ] localStorage write time: ____ms  
- [ ] Navigation delay (if applicable): ____ms
- [ ] Memory usage before/after multiple clicks: ____MB

## Notes Section
_Record any observations, unexpected behaviors, or improvement suggestions below:_

---

**Test Date**: ___________
**Tester**: ___________
**Version**: ___________
**Result**: [ ] PASS [ ] FAIL [ ] PARTIAL