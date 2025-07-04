# Lyra AI Mentor Brand Guidelines

## Color System

### Primary Brand Colors
```css
/* Core Purple - Our signature color */
--purple-600: #9333ea  /* Primary actions, headings */
--purple-500: #a855f7  /* Secondary emphasis */
--purple-400: #c084fc  /* Accents */
--purple-50: #faf5ff   /* Light backgrounds */

/* Cyan - Secondary accent */
--cyan-500: #06b6d4    /* Gradient endpoints */
--cyan-600: #0891b2    /* Hover states */
```

### Gradient Patterns
```css
/* Primary CTA Gradient */
.primary-gradient {
  background: linear-gradient(to right, #9333ea, #06b6d4);
}

/* Hover State Gradient */
.primary-gradient-hover {
  background: linear-gradient(to right, #7c3aed, #0891b2);
}

/* Subtle Background Gradient */
.subtle-gradient {
  background: linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1));
}
```

### Functional Colors
```css
/* Success */
--green-700: #15803d   /* Success text */
--green-100: #dcfce7   /* Success backgrounds */

/* Neutral Scale */
--gray-900: #111827    /* Primary headings */
--gray-700: #374151    /* Body text */
--gray-600: #4b5563    /* Secondary text */
--gray-200: #e5e7eb    /* Borders */
--gray-50: #f9fafb     /* Light backgrounds */
```

## Typography

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
- **Headings**: `text-4xl font-bold` (2.25rem)
- **Subheadings**: `text-xl font-semibold` (1.25rem)
- **Body**: `text-base` (1rem)
- **Small**: `text-sm` (0.875rem)
- **Micro**: `text-xs` (0.75rem)

### Text Color Hierarchy
1. Primary text: `text-gray-900`
2. Body text: `text-gray-700`
3. Secondary text: `text-gray-600`
4. Muted text: `text-gray-500`

## Interactive Elements

### Button Styles
```jsx
/* Primary Button */
className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:from-purple-700 hover:to-cyan-600 hover:shadow-xl"

/* Secondary Button */
className="border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"

/* Disabled State */
className="opacity-50 cursor-not-allowed"
```

### Card Components
```jsx
className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
```

### Progress Indicators
```jsx
/* Progress Bar Container */
className="w-full bg-gray-200 rounded-full h-3"

/* Progress Bar Fill */
className="bg-gradient-to-r from-purple-600 to-cyan-500 h-3 rounded-full transition-all duration-500"
```

## Animation Standards

### Transition Durations
- **Fast**: 200ms (hover states, quick feedback)
- **Standard**: 300ms (most transitions)
- **Slow**: 500ms (progress bars, reveals)
- **Phase Changes**: 600ms (major state changes)

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Spacing System

### Base Unit: 4px (0.25rem)
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

### Common Patterns
- Section spacing: `mb-8` (32px)
- Element spacing: `mb-4` (16px)
- Inline spacing: `gap-2` (8px)

## Visual Effects

### Shadows
```css
/* Card Shadow */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)

/* Hover Shadow */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

/* Subtle Shadow */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
```

### Border Radius
- Small: `rounded` (0.25rem)
- Standard: `rounded-lg` (0.5rem)
- Large: `rounded-xl` (0.75rem)
- Full: `rounded-full` (9999px)

## Icon Guidelines

### Sizes
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)

### Colors
- Default: Same as text color
- Interactive: `text-purple-600`
- Success: `text-green-600`

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adjustments
- Increase touch targets to 44px minimum
- Stack horizontal layouts vertically
- Reduce padding on mobile: `p-4` instead of `p-6`

## Brand Voice in UI

### Success Messages
- Encouraging and celebratory
- Use achievement language
- Include metrics when possible

### Error Messages
- Helpful and constructive
- Suggest next steps
- Never blame the user

### Loading States
- Set expectations: "Creating your personalized..."
- Show progress when possible
- Keep messages brief and active

## Accessibility Requirements

### Color Contrast
- Text on backgrounds: WCAG AA (4.5:1)
- Large text: WCAG AA (3:1)
- Interactive elements: Clear focus states

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
```

### Motion Preferences
- Respect `prefers-reduced-motion`
- Provide alternatives to animation-based feedback
- Ensure content is accessible without animation