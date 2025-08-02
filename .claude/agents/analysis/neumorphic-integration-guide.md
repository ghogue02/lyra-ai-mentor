# Neumorphic Design Integration Guide for Unified Chat System

## Overview

This guide details how to properly integrate the existing neumorphic design system (`nm-*` classes) with the new unified ChatSystem architecture, ensuring consistent 2025 world-class design standards.

## Current Neumorphic System Analysis

### Available Design Tokens
```css
/* Core Variables from neumorphic.css */
--nm-background: hsl(220, 16%, 96%);
--nm-surface: hsl(220, 16%, 94%);
--nm-surface-elevated: hsl(220, 16%, 98%);
--nm-surface-sunken: hsl(220, 16%, 92%);

/* Shadow System */
--nm-shadow-raised: 8px 8px 16px var(--nm-shadow-dark), -8px -8px 16px var(--nm-shadow-light);
--nm-shadow-pressed: inset 4px 4px 8px var(--nm-shadow-dark), inset -4px -4px 8px var(--nm-shadow-light);
--nm-shadow-floating: 12px 12px 24px var(--nm-shadow-dark), -12px -12px 24px var(--nm-shadow-light);

/* Brand Integration */
--nm-brand-purple: hsl(262, 83%, 58%);
--nm-brand-cyan: hsl(187, 85%, 53%);
```

### Existing Component Classes
```css
.nm-card           /* Base card styling */
.nm-button         /* Interactive button */
.nm-input          /* Form input */
.nm-shadow-*       /* Shadow variations */
.nm-interactive    /* Hover/active states */
.nm-animate-float  /* Floating animation */
```

## ChatSystem Neumorphic Design Specification

### 1. Component Hierarchy Styling

#### A. ChatSystem Root
```css
.chat-system {
  /* Base positioning and z-index */
  position: fixed;
  z-index: var(--nm-z-floating);
  
  /* Responsive positioning */
  &--bottom-right {
    bottom: var(--nm-space-xl);
    right: var(--nm-space-xl);
  }
  
  &--bottom-left {
    bottom: var(--nm-space-xl);
    left: var(--nm-space-xl);
  }
  
  /* Theme variants */
  &--neumorphic {
    /* Default neumorphic styling */
  }
  
  &--glass {
    @apply nm-glass;
  }
}
```

#### B. ChatAvatar (Floating State)
```css
.chat-avatar {
  /* Neumorphic button base */
  @apply nm-button nm-rounded-full nm-shadow-floating;
  @apply nm-interactive nm-animate-float;
  
  /* Size variants */
  width: 64px;
  height: 64px;
  padding: 0;
  
  /* Hover enhancement */
  &:hover {
    @apply nm-shadow-accent;
    transform: translateY(-2px) scale(1.05);
  }
  
  /* Active state */
  &:active {
    @apply nm-shadow-pressed;
    transform: translateY(1px) scale(0.95);
  }
  
  /* Avatar image container */
  .avatar-container {
    @apply nm-rounded-full;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  /* Notification indicator */
  .notification-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    @apply nm-gradient-primary nm-rounded-full;
    @apply nm-shadow-subtle;
    
    &.animate {
      animation: nm-pulse 2s infinite;
    }
  }
  
  /* Tooltip */
  .chat-avatar-tooltip {
    @apply nm-card nm-shadow-subtle nm-p-sm nm-rounded-md;
    @apply nm-text-primary;
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--nm-transition-normal);
    white-space: nowrap;
    font-size: 0.75rem;
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 12px;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid var(--nm-surface);
    }
    
    .chat-avatar:hover & {
      opacity: 1;
    }
  }
}
```

#### C. ChatContainer (Expanded State)
```css
.chat-container {
  /* Base card styling with elevation */
  @apply nm-card-elevated nm-shadow-floating;
  @apply nm-rounded-xl;
  
  /* Dimensions */
  width: 384px;
  height: 500px;
  max-height: 80vh;
  
  /* Layout */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Background with subtle gradient */
  background: var(--nm-gradient-surface);
  
  /* Enhanced glow effect */
  &.focused {
    @apply nm-shadow-accent;
  }
  
  /* Minimized state */
  &--minimized {
    height: 48px;
    
    .chat-container__content {
      display: none;
    }
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    @apply nm-rounded-none;
  }
}
```

#### D. ChatHeader
```css
.chat-header {
  /* Base styling */
  @apply nm-surface nm-p-md;
  border-bottom: 1px solid var(--nm-shadow-light);
  border-radius: var(--nm-radius-xl) var(--nm-radius-xl) 0 0;
  
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  
  /* Background gradient */
  background: linear-gradient(135deg, 
    var(--nm-surface-elevated) 0%, 
    var(--nm-surface) 100%
  );
  
  /* Avatar section */
  .chat-header__avatar {
    @apply nm-avatar nm-shadow-subtle;
    width: 32px;
    height: 32px;
  }
  
  /* Title section */
  .chat-header__title {
    @apply nm-text-primary;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .chat-header__subtitle {
    @apply nm-text-secondary;
    font-size: 0.75rem;
  }
  
  /* Controls */
  .chat-header__controls {
    display: flex;
    align-items: center;
    gap: var(--nm-space-sm);
  }
  
  .chat-header__button {
    @apply nm-button nm-button-ghost;
    width: 32px;
    height: 32px;
    padding: 0;
    @apply nm-rounded-md;
  }
}
```

#### E. ChatContent (Message Area)
```css
.chat-content {
  /* Layout */
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  /* Contextual Questions */
  .contextual-questions {
    @apply nm-p-lg;
    display: flex;
    flex-direction: column;
    gap: var(--nm-space-sm);
  }
  
  .contextual-question {
    @apply nm-button nm-interactive nm-rounded-md nm-p-md;
    @apply nm-text-left;
    background: var(--nm-surface);
    
    &:hover {
      @apply nm-shadow-floating nm-surface-elevated;
    }
    
    /* Question icon */
    .question-icon {
      @apply nm-gradient-primary nm-rounded-md;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        width: 12px;
        height: 12px;
        color: white;
      }
    }
    
    /* Question text */
    .question-text {
      @apply nm-text-primary;
      font-weight: 500;
      flex: 1;
    }
    
    /* Category badge */
    .question-category {
      @apply nm-badge nm-badge-accent;
    }
  }
  
  /* Messages container */
  .messages-container {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  /* Scroll area */
  .messages-scroll {
    height: 100%;
    @apply nm-p-lg;
  }
}
```

#### F. Message Styling
```css
.chat-message {
  display: flex;
  margin-bottom: var(--nm-space-md);
  
  &--user {
    justify-content: flex-end;
    
    .message-bubble {
      @apply nm-gradient-primary nm-rounded-lg nm-p-md;
      @apply nm-shadow-raised;
      color: white;
      max-width: 80%;
      
      /* Enhanced user message styling */
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: var(--nm-radius-lg) var(--nm-radius-lg) 0 0;
      }
    }
  }
  
  &--ai {
    justify-content: flex-start;
    
    .message-avatar {
      @apply nm-avatar nm-shadow-subtle;
      width: 32px;
      height: 32px;
      margin-right: var(--nm-space-sm);
      flex-shrink: 0;
    }
    
    .message-bubble {
      @apply nm-card nm-rounded-lg nm-p-md;
      @apply nm-shadow-raised;
      background: var(--nm-surface);
      max-width: 80%;
      
      /* AI message enhancement */
      border: 1px solid var(--nm-shadow-light);
    }
  }
  
  /* Message content */
  .message-content {
    @apply nm-text-primary;
    font-size: 0.875rem;
    line-height: 1.5;
    
    /* Format different content types */
    code {
      @apply nm-surface-sunken nm-rounded-sm;
      padding: 2px 4px;
      font-family: monospace;
      font-size: 0.8em;
    }
    
    pre {
      @apply nm-surface-sunken nm-rounded-md nm-p-sm;
      overflow-x: auto;
      margin: var(--nm-space-sm) 0;
    }
  }
  
  /* Timestamp */
  .message-timestamp {
    @apply nm-text-muted;
    font-size: 0.7rem;
    margin-top: var(--nm-space-xs);
  }
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  margin: var(--nm-space-md) 0;
  
  .typing-avatar {
    @apply nm-avatar nm-shadow-subtle;
    width: 32px;
    height: 32px;
    margin-right: var(--nm-space-sm);
  }
  
  .typing-bubble {
    @apply nm-card nm-rounded-lg nm-p-md;
    background: var(--nm-surface);
    
    .typing-dots {
      display: flex;
      gap: 4px;
      
      .dot {
        width: 6px;
        height: 6px;
        background: var(--nm-text-muted);
        border-radius: 50%;
        animation: typing-bounce 1.4s ease-in-out infinite both;
        
        &:nth-child(2) { animation-delay: 0.16s; }
        &:nth-child(3) { animation-delay: 0.32s; }
      }
    }
  }
}

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
```

#### G. ChatInput (Input Area)
```css
.chat-input {
  /* Container */
  @apply nm-p-lg;
  background: var(--nm-surface-elevated);
  border-top: 1px solid var(--nm-shadow-light);
  border-radius: 0 0 var(--nm-radius-xl) var(--nm-radius-xl);
  flex-shrink: 0;
  
  /* Input form */
  .input-form {
    display: flex;
    gap: var(--nm-space-sm);
    align-items: flex-end;
  }
  
  /* Text input */
  .input-field {
    @apply nm-input nm-rounded-md;
    flex: 1;
    background: var(--nm-surface-sunken);
    box-shadow: var(--nm-shadow-pressed);
    border: 1px solid var(--nm-shadow-dark);
    min-height: 40px;
    max-height: 120px;
    resize: none;
    
    &:focus {
      @apply nm-focus-ring;
      background: var(--nm-surface);
      box-shadow: 
        var(--nm-shadow-pressed),
        0 0 0 3px var(--nm-focus-ring);
    }
    
    &::placeholder {
      @apply nm-text-muted;
    }
  }
  
  /* Send button */
  .send-button {
    @apply nm-button-primary nm-rounded-md;
    width: 40px;
    height: 40px;
    padding: 0;
    flex-shrink: 0;
    
    &:disabled {
      opacity: 0.5;
      @apply nm-shadow-subtle;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  /* Helper text */
  .input-helper {
    @apply nm-text-muted;
    font-size: 0.7rem;
    margin-top: var(--nm-space-xs);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Quick actions */
  .quick-actions {
    display: flex;
    gap: var(--nm-space-xs);
    margin-top: var(--nm-space-sm);
  }
  
  .quick-action {
    @apply nm-button nm-button-ghost nm-rounded-sm;
    padding: var(--nm-space-xs) var(--nm-space-sm);
    font-size: 0.7rem;
  }
}
```

### 2. Animation Integration

#### A. Entrance Animations
```css
.chat-system-enter {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.chat-system-enter-active {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: all var(--nm-transition-normal);
}

.chat-system-exit {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.chat-system-exit-active {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transition: all var(--nm-transition-normal);
}

/* Avatar breathing animation */
.chat-avatar {
  animation: avatar-breathe 4s ease-in-out infinite;
}

@keyframes avatar-breathe {
  0%, 100% { 
    transform: scale(1);
    box-shadow: var(--nm-shadow-floating);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: var(--nm-shadow-accent);
  }
}
```

#### B. Interaction Animations
```css
/* Button ripple effect */
.nm-ripple {
  position: relative;
  overflow: hidden;
}

.nm-ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.nm-ripple:active::before {
  width: 300px;
  height: 300px;
}

/* Message slide-in animation */
.message-enter {
  opacity: 0;
  transform: translateY(10px);
}

.message-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

### 3. Responsive Design

#### A. Mobile Optimizations
```css
@media (max-width: 768px) {
  .chat-system {
    /* Mobile-specific adjustments */
    --nm-shadow-raised: 
      4px 4px 8px var(--nm-shadow-dark),
      -4px -4px 8px var(--nm-shadow-light);
  }
  
  .chat-container {
    /* Full screen on mobile */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    @apply nm-rounded-none;
  }
  
  .chat-avatar {
    /* Larger touch target */
    width: 72px;
    height: 72px;
  }
  
  .contextual-question {
    /* Better mobile interaction */
    min-height: 48px;
    padding: var(--nm-space-md);
  }
  
  .input-field {
    /* Mobile keyboard handling */
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

#### B. Dark Mode Support
```css
.dark .chat-system {
  /* Dark mode neumorphic adjustments */
  
  .chat-container {
    background: var(--nm-gradient-surface);
  }
  
  .chat-message--ai .message-bubble {
    background: var(--nm-surface);
    border-color: var(--nm-shadow-light);
  }
  
  .input-field {
    background: var(--nm-surface-sunken);
    color: var(--nm-text-primary);
  }
}
```

### 4. Implementation Guidelines

#### A. Component Integration Pattern
```typescript
// Standard pattern for neumorphic components
const ChatComponent: React.FC = ({ className, ...props }) => {
  return (
    <div className={cn(
      // Base neumorphic classes
      'nm-card nm-shadow-raised nm-rounded-lg',
      // Interactive classes if applicable
      'nm-interactive',
      // Custom classes
      className
    )}>
      {/* Component content */}
    </div>
  );
};
```

#### B. CSS Custom Properties Usage
```typescript
// Dynamic styling with CSS variables
const ChatAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: '48px',
    md: '64px', 
    lg: '80px'
  };
  
  const style = {
    '--avatar-size': sizeMap[size],
    '--avatar-shadow': size === 'lg' ? 'var(--nm-shadow-floating)' : 'var(--nm-shadow-raised)'
  } as React.CSSProperties;
  
  return (
    <div 
      className="chat-avatar"
      style={style}
    >
      {/* Avatar content */}
    </div>
  );
};
```

### 5. Quality Assurance

#### A. Design System Compliance Checklist
- [ ] All components use `nm-*` utility classes
- [ ] Consistent shadow depths across states
- [ ] Proper color token usage
- [ ] Responsive behavior implemented
- [ ] Dark mode support included
- [ ] Animation timing matches system
- [ ] Touch targets meet 44px minimum
- [ ] Focus indicators are visible

#### B. Performance Considerations
- [ ] CSS-in-JS minimal usage (prefer utility classes)
- [ ] Animation performance optimized (transform/opacity only)
- [ ] Bundle size impact measured
- [ ] Critical CSS identified
- [ ] Unused styles eliminated

This integration guide ensures the unified ChatSystem maintains the highest quality neumorphic design standards while providing a cohesive user experience across all states and interactions.