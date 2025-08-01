# Manual Testing Checklist for ContextualLyraChat UX Improvements

## Overview
This checklist validates the chat window improvements including 400px height constraint, scroll behavior, outside click detection, narrative resume functionality, and mobile experience.

## Test Environment Setup
- [ ] Test on Chrome, Firefox, Safari, and Edge
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test with different screen resolutions (320px, 768px, 1200px, 1920px)
- [ ] Ensure dev tools console is open to catch any JavaScript errors

## 1. Height Validation Tests

### Desktop Testing (>= 768px width)
- [ ] **Fixed Height Constraint**: Verify chat window shows as 600px height maximum
  - Navigate to any lesson
  - Click Lyra avatar to expand chat
  - Measure chat height with browser dev tools
  - Expected: Chat container should be exactly 600px tall

- [ ] **Content Overflow Handling**: Test with long conversations
  - Send multiple messages (10+) to create content overflow
  - Expected: Chat content should scroll within the 600px container
  - Expected: Scroll area should be clearly defined within chat bounds

- [ ] **Screen Size Adaptation**: Test height behavior across screen sizes
  - Test on 1920x1080, 1366x768, 1024x768 screens
  - Expected: Height remains consistently 600px on all desktop sizes

### Mobile Testing (< 768px width)
- [ ] **Full Screen Mode**: Verify mobile uses full screen approach
  - Test on 375x667 (iPhone SE), 390x844 (iPhone 12), 768x1024 (iPad)
  - Expected: Chat should use `inset-4` spacing on mobile screens
  - Expected: Chat should not be constrained to 600px on mobile

## 2. Scroll Behavior Validation

### Long Conversation Testing
- [ ] **Auto-scroll to Bottom**: Test new message auto-scroll
  - Start conversation with Lyra
  - Send 5+ messages to create scrollable content
  - Expected: Each new message should auto-scroll to bottom
  - Expected: User should see the latest message without manual scrolling

- [ ] **Manual Scroll Behavior**: Test user-initiated scrolling
  - Create conversation with 10+ messages
  - Manually scroll up to view earlier messages
  - Expected: Scroll should work smoothly without jumping
  - Expected: User should be able to review message history

- [ ] **Scroll-to-Bottom Button**: Test scroll button appearance
  - Create long conversation (15+ messages)
  - Scroll up manually so bottom is not visible
  - Expected: Scroll-to-bottom button should appear
  - Click button
  - Expected: Should smoothly scroll to latest message

- [ ] **Performance with Many Messages**: Test scroll performance
  - Create conversation with 20+ messages
  - Scroll up and down rapidly
  - Expected: Scrolling should remain smooth, no lag or stuttering
  - Expected: No memory leaks or performance degradation

## 3. Outside Click Detection Tests

### Click Outside Scenarios
- [ ] **Page Background Clicks**: Test clicking outside chat area
  - Expand chat window
  - Click on lesson content, navigation, or page background
  - Expected: Chat should remain open (outside click should not close)
  - Note: Outside click handling is managed by parent component

- [ ] **Close Button Functionality**: Test explicit close actions
  - Expand chat window
  - Click the X (close) button in chat header
  - Expected: Chat should close immediately
  - Expected: No errors in console

- [ ] **Navigation During Chat**: Test navigation with open chat
  - Open chat and start conversation
  - Navigate to different lesson sections
  - Expected: Chat state should be preserved or appropriately managed
  - Expected: No broken UI states

### Event Propagation Testing
- [ ] **Internal Click Handling**: Test clicks within chat
  - Click on input field, buttons, messages within chat
  - Expected: All internal interactions should work normally
  - Expected: Chat should not close from internal clicks

- [ ] **Modal Overlay Behavior**: Test modal-like behavior
  - Open chat in floating mode
  - Try to interact with content behind chat
  - Expected: Interactions should work as designed by parent component

## 4. Narrative Resume Integration Tests

### Narrative Pause/Resume Flow
- [ ] **Chat Open → Narrative Pause**: Test narrative stops when chat opens
  - Start lesson with active narrative (audio/video)
  - Open chat window
  - Expected: `onNarrativePause` callback should be triggered
  - Expected: Any playing narrative should pause

- [ ] **Chat Close → Narrative Resume**: Test narrative resumes when chat closes
  - Have active chat conversation
  - Close chat window via X button or collapse
  - Expected: `onNarrativeResume` callback should be triggered
  - Expected: Paused narrative should resume from where it left off

- [ ] **Minimize vs Close**: Test minimize behavior with narrative
  - Open chat and minimize (not close)
  - Expected: Narrative should remain paused while minimized
  - Restore from minimize
  - Expected: Narrative should still be paused until chat is fully closed

### Edge Cases for Narrative Integration
- [ ] **Rapid Open/Close**: Test quick chat interactions
  - Rapidly open and close chat multiple times
  - Expected: Narrative pause/resume should handle rapid changes gracefully
  - Expected: No conflicting states or callback errors

- [ ] **Multiple Chat Instances**: Test if multiple chats could exist
  - Ensure only one chat can be open at a time
  - Expected: Narrative state should be consistent

## 5. Mobile Experience Validation

### Touch Interaction Testing
- [ ] **Avatar Touch Responsiveness**: Test mobile avatar interactions
  - Use actual mobile device or mobile dev tools
  - Tap floating Lyra avatar
  - Expected: Chat should expand with appropriate touch feedback
  - Expected: No delay or double-tap issues

- [ ] **Chat Input Mobile UX**: Test mobile input experience
  - Open chat on mobile device
  - Focus on input field
  - Expected: Virtual keyboard should appear appropriately
  - Expected: Chat layout should adjust for keyboard
  - Expected: Input should remain visible above keyboard

- [ ] **Scroll Performance on Mobile**: Test mobile scrolling
  - Create long conversation on mobile
  - Test scroll performance with touch gestures
  - Expected: Smooth scrolling with momentum
  - Expected: No lag or stuttering during scroll

### Mobile Layout Validation
- [ ] **Portrait Orientation**: Test mobile portrait layout
  - Test on iPhone (375x667), Android (360x640)
  - Expected: Chat should use full screen minus safe areas
  - Expected: All elements should be easily tappable (44px+ tap targets)

- [ ] **Landscape Orientation**: Test mobile landscape layout
  - Rotate device to landscape mode
  - Expected: Chat should adapt to landscape dimensions
  - Expected: Content should remain accessible

- [ ] **Safe Area Handling**: Test on devices with notches/safe areas
  - Test on iPhone X+, devices with notches
  - Expected: Chat should respect safe areas
  - Expected: No content should be hidden behind notches

### Cross-Device Consistency
- [ ] **iOS Safari**: Test on actual iPhone/iPad
  - Test all major interactions
  - Expected: Consistent behavior with desktop

- [ ] **Android Chrome**: Test on actual Android device
  - Test all major interactions
  - Expected: Consistent behavior with desktop

- [ ] **Progressive Web App (PWA) Mode**: If applicable
  - Test chat in PWA mode
  - Expected: Full functionality maintained

## 6. Performance and Edge Cases

### Performance Validation
- [ ] **Initial Load Performance**: Test first render speed
  - Measure time from avatar click to fully rendered chat
  - Expected: Chat should open within 300ms
  - Expected: No visible layout shifts during opening

- [ ] **Memory Usage**: Test for memory leaks
  - Open/close chat multiple times (20+ cycles)
  - Check browser memory usage in dev tools
  - Expected: Memory usage should remain stable
  - Expected: No significant memory growth over time

- [ ] **Large Conversation Performance**: Test with many messages
  - Create conversation with 50+ messages
  - Test scroll performance and responsiveness
  - Expected: Chat should remain responsive
  - Expected: Scroll performance should not degrade

### Error Handling
- [ ] **Network Errors**: Test chat behavior during network issues
  - Disable network, try to send message
  - Expected: Appropriate error handling and user feedback

- [ ] **Callback Errors**: Test missing callback scenarios
  - Ensure chat works when optional callbacks are not provided
  - Expected: No JavaScript errors, graceful degradation

- [ ] **State Corruption**: Test rapid state changes
  - Rapidly change expanded/collapsed states
  - Expected: UI should remain consistent, no broken states

## 7. Accessibility Validation

### Keyboard Navigation
- [ ] **Tab Order**: Test keyboard navigation through chat
  - Tab through all interactive elements
  - Expected: Logical tab order, all elements reachable

- [ ] **Escape Key**: Test escape key behavior
  - Press Escape when chat is open
  - Expected: Should close chat or have other appropriate behavior

### Screen Reader Compatibility
- [ ] **ARIA Labels**: Test with screen reader
  - Use NVDA, JAWS, or VoiceOver
  - Expected: All elements should be properly announced

- [ ] **Live Regions**: Test message announcements
  - Send messages and listen for announcements
  - Expected: New messages should be announced to screen readers

## Success Criteria

All tests should pass with:
- ✅ No JavaScript console errors
- ✅ Smooth animations and transitions
- ✅ Consistent behavior across devices/browsers
- ✅ Proper callback execution
- ✅ Responsive design working correctly
- ✅ Performance within acceptable ranges
- ✅ Accessibility standards met

## Test Results Template

```
Date: _______________
Tester: _____________
Browser: ____________
Device: _____________

□ Height Validation: PASS / FAIL
□ Scroll Behavior: PASS / FAIL  
□ Outside Click: PASS / FAIL
□ Narrative Resume: PASS / FAIL
□ Mobile Experience: PASS / FAIL
□ Performance: PASS / FAIL
□ Accessibility: PASS / FAIL

Issues Found:
1. ________________________
2. ________________________
3. ________________________

Overall Status: PASS / FAIL
```