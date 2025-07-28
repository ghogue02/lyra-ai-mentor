# Neumorphic Design System Documentation

## Overview

This documentation outlines the complete neumorphic design system implementation for the Lyra AI Mentor platform. The system provides a comprehensive set of CSS variables, component classes, utilities, and responsive patterns for creating modern, accessible neumorphic interfaces.

## 🎨 Design Philosophy

**Neumorphism** (New Skeuomorphism) creates interfaces that appear to extrude from or be pressed into the background, using subtle shadows and highlights to achieve depth and tactile feel while maintaining modern aesthetics.

### Key Principles
- **Subtle depth**: Soft shadows that suggest gentle elevation
- **Consistent lighting**: Single light source from top-left
- **Accessible contrast**: Colors meet WCAG 2.1 AA standards
- **Progressive enhancement**: Works without CSS for core functionality
- **Mobile-first**: Optimized for touch interfaces

## 📁 File Structure

```
src/styles/
├── neumorphic.css           # Core system with variables and base components
├── neumorphic-utilities.css # Extended utilities and modifiers
└── README.md               # This documentation
```

## 🎛️ CSS Variables System

### Core Colors
```css
--nm-background: hsl(220, 16%, 96%)     /* Main background */
--nm-surface: hsl(220, 16%, 94%)        /* Component surfaces */
--nm-surface-elevated: hsl(220, 16%, 98%) /* Raised elements */
--nm-surface-sunken: hsl(220, 16%, 92%)   /* Pressed/input elements */
```

### Shadow System
```css
--nm-shadow-raised: 8px 8px 16px var(--nm-shadow-dark), -8px -8px 16px var(--nm-shadow-light)
--nm-shadow-pressed: inset 4px 4px 8px var(--nm-shadow-dark), inset -4px -4px 8px var(--nm-shadow-light)
--nm-shadow-floating: 12px 12px 24px var(--nm-shadow-dark), -12px -12px 24px var(--nm-shadow-light)
--nm-shadow-subtle: 4px 4px 8px var(--nm-shadow-dark), -4px -4px 8px var(--nm-shadow-light)
```

### Typography
```css
--nm-text-primary: hsl(220, 26%, 14%)   /* Main text */
--nm-text-secondary: hsl(220, 16%, 46%) /* Secondary text */
--nm-text-muted: hsl(220, 16%, 64%)     /* Muted text */
--nm-text-accent: hsl(262, 83%, 58%)    /* Brand purple text */
--nm-text-cyan: hsl(187, 85%, 53%)      /* Brand cyan text */
```

### Spacing Scale
```css
--nm-space-xs: 0.25rem  /* 4px */
--nm-space-sm: 0.5rem   /* 8px */
--nm-space-md: 0.75rem  /* 12px */
--nm-space-lg: 1rem     /* 16px */
--nm-space-xl: 1.5rem   /* 24px */
--nm-space-2xl: 2rem    /* 32px */
--nm-space-3xl: 3rem    /* 48px */
```

### Border Radius
```css
--nm-radius-xs: 4px
--nm-radius-sm: 8px
--nm-radius-md: 12px
--nm-radius-lg: 16px
--nm-radius-xl: 20px
--nm-radius-2xl: 24px
--nm-radius-full: 9999px
```

## 🧩 Base Components

### Cards
```html
<!-- Basic card -->
<div class="nm-card">Content</div>

<!-- Elevated card -->
<div class="nm-card-elevated">Important content</div>

<!-- Pressed/sunken card -->
<div class="nm-card-sunken">Input area</div>

<!-- Subtle card -->
<div class="nm-card-subtle">Minimal emphasis</div>
```

### Buttons
```html
<!-- Default button -->
<button class="nm-button">Click me</button>

<!-- Primary button with brand gradient -->
<button class="nm-button nm-button-primary">Primary Action</button>

<!-- Ghost button -->
<button class="nm-button nm-button-ghost">Secondary</button>

<!-- Size variants -->
<button class="nm-button nm-button-sm">Small</button>
<button class="nm-button nm-button-lg">Large</button>
```

### Inputs
```html
<!-- Neumorphic input -->
<input class="nm-input" type="text" placeholder="Enter text...">

<!-- With focus ring -->
<input class="nm-input nm-focus-ring" type="email" placeholder="Email">
```

### Containers & Panels
```html
<!-- Main container -->
<div class="nm-container">
  <h1>Page Content</h1>
</div>

<!-- Content panel -->
<div class="nm-panel">
  <h2>Section Title</h2>
  <p>Section content...</p>
</div>
```

## 🛠️ Utility Classes

### Shadow Utilities
```css
.nm-shadow-none      /* Remove shadows */
.nm-shadow-subtle    /* Minimal depth */
.nm-shadow-raised    /* Standard elevation */
.nm-shadow-pressed   /* Inset/pressed effect */
.nm-shadow-floating  /* High elevation */
.nm-shadow-accent    /* With brand color glow */
```

### Surface Utilities
```css
.nm-surface          /* Default surface */
.nm-surface-elevated /* Raised surface */
.nm-surface-sunken   /* Pressed surface */
.nm-surface-purple   /* Brand purple tinted */
.nm-surface-cyan     /* Brand cyan tinted */
```

### Text Utilities
```css
.nm-text-primary     /* Main text color */
.nm-text-secondary   /* Secondary text */
.nm-text-muted       /* Muted text */
.nm-text-accent      /* Brand purple */
.nm-text-cyan        /* Brand cyan */
```

### Interactive States
```css
.nm-interactive      /* Adds hover/active states */
.nm-focus-ring       /* Enhanced focus indicators */
```

### Spacing Utilities
```css
.nm-p-xs, .nm-p-sm, .nm-p-md, .nm-p-lg, .nm-p-xl, .nm-p-2xl, .nm-p-3xl
.nm-m-xs, .nm-m-sm, .nm-m-md, .nm-m-lg, .nm-m-xl, .nm-m-2xl, .nm-m-3xl
```

### Border Radius Utilities
```css
.nm-rounded-xs, .nm-rounded-sm, .nm-rounded-md, .nm-rounded-lg
.nm-rounded-xl, .nm-rounded-2xl, .nm-rounded-full
```

## 🌓 Dark Mode Support

Dark mode is automatically handled through CSS custom properties:

```css
.dark {
  --nm-background: hsl(220, 26%, 14%);
  --nm-surface: hsl(220, 26%, 16%);
  /* ... all variables automatically adjust */
}
```

Toggle dark mode by adding/removing the `dark` class to the `<html>` or `<body>` element.

## 📱 Responsive Design

### Mobile Optimizations (< 768px)
- Smaller shadows for better performance
- Larger touch targets (min 48px)
- Reduced spacing scale
- Smaller border radius

### Tablet (768px - 1024px)
- Balanced spacing and shadows
- Standard touch targets

### Desktop (> 1024px)
- Enhanced shadows and effects
- Hover animations enabled
- Larger spacing scale

## ♿ Accessibility Features

### Focus Management
- High contrast focus rings
- Keyboard navigation support
- Screen reader friendly markup

### Color Contrast
- WCAG 2.1 AA compliant text colors
- High contrast mode support
- Sufficient color differentiation

### Motion Preferences
- Respects `prefers-reduced-motion`
- Disables animations when requested
- Maintains functionality without motion

### Touch Targets
- Minimum 44px on mobile
- 48px for primary actions
- Adequate spacing between targets

## 🎭 Advanced Components

### Avatar
```html
<div class="nm-avatar">
  <img src="avatar.jpg" alt="User avatar">
</div>
```

### Badge
```html
<span class="nm-badge">Default</span>
<span class="nm-badge nm-badge-accent">Purple</span>
<span class="nm-badge nm-badge-cyan">Cyan</span>
```

### Progress Bar
```html
<div class="nm-progress">
  <div class="nm-progress-bar" style="width: 60%;"></div>
</div>
```

### Navigation
```html
<nav class="nm-nav">
  <button class="nm-nav-item active">Home</button>
  <button class="nm-nav-item">About</button>
  <button class="nm-nav-item">Contact</button>
</nav>
```

## ✨ Animation Classes

```css
.nm-animate-float    /* Gentle floating animation */
.nm-animate-pulse    /* Subtle pulse effect */
.nm-animate-glow     /* Glowing accent effect */
.nm-breathe          /* Breathing scale animation */
.nm-loading          /* Shimmer loading effect */
```

## 🎨 Special Effects

### Glass Effect
```html
<div class="nm-card nm-glass">
  Glassmorphic card with backdrop blur
</div>
```

### Metallic Effect
```html
<div class="nm-button nm-metallic">
  Metallic button with gradient
</div>
```

### Glow Effects
```html
<div class="nm-card nm-glow-soft">Soft purple glow</div>
<div class="nm-card nm-glow-cyan">Cyan glow</div>
```

## 🔧 Implementation Guidelines

### For Component Developers

1. **Use semantic HTML first**: Ensure accessibility before styling
2. **Apply base classes**: Start with `.nm-card`, `.nm-button`, etc.
3. **Add modifiers**: Use utility classes for variations
4. **Test responsiveness**: Verify on mobile, tablet, desktop
5. **Check accessibility**: Test with screen readers and keyboard

### Best Practices

```html
<!-- ✅ Good: Semantic, accessible, progressive -->
<button class="nm-button nm-button-primary nm-focus-ring" 
        type="submit" 
        aria-describedby="submit-help">
  Submit Form
</button>
<div id="submit-help" class="nm-sr-only">
  Submits your information for processing
</div>

<!-- ❌ Avoid: Non-semantic, inaccessible -->
<div class="nm-button nm-button-primary" onclick="submit()">
  Submit
</div>
```

### Integration with Existing Components

1. **Gradual adoption**: Apply to new components first
2. **Maintain compatibility**: Don't break existing styles
3. **Use CSS layers**: Ensure proper cascade order
4. **Test thoroughly**: Verify in all browsers and devices

## 🚀 Performance Considerations

### Optimizations Included
- Efficient CSS selectors
- Minimal box-shadow calculations
- Hardware acceleration for animations
- Reduced motion support
- Print-friendly styles

### Usage Tips
- Prefer utility classes over custom CSS
- Combine multiple shadows carefully
- Use `transform` for animations (GPU accelerated)
- Test on lower-end devices

## 🔍 Browser Support

- **Modern browsers**: Full support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- **Legacy browsers**: Graceful degradation (shadows may not appear)
- **Mobile browsers**: Optimized for touch interfaces
- **Print**: Clean, professional output

## 🐛 Troubleshooting

### Common Issues

**Shadows not appearing**
- Check browser support for multiple box-shadows
- Verify CSS custom property support
- Ensure proper light/dark mode setup

**Performance issues**
- Reduce shadow complexity on mobile
- Use `will-change` sparingly
- Enable hardware acceleration for animations

**Accessibility concerns**
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Ensure focus indicators are visible

### Debug Mode

Add this class to any element for debugging:

```css
.nm-debug {
  outline: 2px solid red !important;
  background: rgba(255, 0, 0, 0.1) !important;
}
```

## 📈 Future Enhancements

### Planned Features
- CSS logical properties for RTL support
- Color palette generator
- Component preview gallery
- Interactive documentation
- Design tokens export

### Contribution Guidelines
1. Follow existing naming conventions
2. Test across all breakpoints
3. Ensure accessibility compliance
4. Document new features
5. Maintain backwards compatibility

---

## Quick Reference

### Most Common Classes
```css
/* Cards */
.nm-card, .nm-card-elevated, .nm-card-sunken

/* Buttons */
.nm-button, .nm-button-primary, .nm-button-ghost

/* Inputs */
.nm-input

/* Containers */
.nm-container, .nm-panel

/* Utilities */
.nm-shadow-raised, .nm-shadow-pressed, .nm-interactive
```

### Color Variables
```css
var(--nm-background)
var(--nm-surface)
var(--nm-text-primary)
var(--nm-text-accent)
var(--nm-brand-purple)
var(--nm-brand-cyan)
```

For questions or contributions, please refer to the main project documentation or create an issue in the repository.