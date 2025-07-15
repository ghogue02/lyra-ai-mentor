# Visual Layout Diagram - LyraNarratedMayaSideBySideComplete

## Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           VIEWPORT (e.g., 1920x1080)                     │
├─────────────────────┬───────────────────────────────────────────────────┤
│                     │                                                     │
│   SUMMARY PANEL     │                 MAIN CONTENT AREA                  │
│     (320px)         │              (remaining width)                     │
│                     │                                                     │
│  ┌───────────────┐  │  ┌───────────────────────────────────────────────┐│
│  │               │  │  │                   HEADER                       ││
│  │ Maya's        │  │  │  ┌─────┐ ┌────────────────┐ ┌──────────────┐ ││
│  │ Journey       │  │  │  │Lyra │ │Title & Subtitle│ │ Controls     │ ││
│  │               │  │  │  │Avatar│ │                │ │ FF|Level|1/9 │ ││
│  │ ○ Progress    │  │  │  └─────┘ └────────────────┘ └──────────────┘ ││
│  │   ████░░░     │  │  └───────────────────────────────────────────────┘│
│  │               │  │                                                     │
│  │ Skills:       │  │  ┌────────────────────┬──────────────────────────┐│
│  │ ✓ PACE        │  │  │                    │                          ││
│  │ ✓ Tone        │  │  │   NARRATIVE PANEL  │   INTERACTIVE PANEL      ││
│  │ ░ Templates   │  │  │      (50%)         │        (50%)             ││
│  │ ░ Difficult   │  │  │                    │                          ││
│  │ ░ Subject     │  │  │  ┌──────────────┐  │  ┌────────────────────┐ ││
│  │               │  │  │  │ Lyra Avatar  │  │  │                    │ ││
│  │ Current:      │  │  │  │ + Messages   │  │  │  Stage Content     │ ││
│  │ Stage 3/9     │  │  │  │              │  │  │  (May blur)        │ ││
│  │               │  │  │  │ [Scrollable] │  │  │                    │ ││
│  └───────────────┘  │  │  │              │  │  │  [Scrollable]      │ ││
│                     │  │  └──────────────┘  │  └────────────────────┘ ││
│   [Scrollable]      │  │                    │                          ││
│                     │  └────────────────────┴──────────────────────────┘│
│                     │  ┌───────────────────────────────────────────────┐│
│                     │  │               PROGRESS BAR                     ││
│                     │  │  ████████████████████░░░░░░░░░░░░░░░  (3/9)  ││
│                     │  └───────────────────────────────────────────────┘│
└─────────────────────┴───────────────────────────────────────────────────┘
```

## Tablet Layout (768px - 1023px)

```
┌───────────────────────────────────────────────────┐
│                VIEWPORT (e.g., 768x1024)          │
├──────────────┬────────────────────────────────────┤
│              │                                    │
│   SUMMARY    │        MAIN CONTENT AREA          │
│   (240px)    │         (remaining width)         │
│              │                                    │
│ ┌──────────┐ │ ┌────────────────────────────────┐│
│ │ Maya's   │ │ │           HEADER               ││
│ │ Journey  │ │ │ [Lyra] [Title] [Controls]     ││
│ │          │ │ └────────────────────────────────┘│
│ │ Progress │ │                                    │
│ │ ███░░    │ │ ┌──────────────┬─────────────────┐│
│ │          │ │ │  NARRATIVE   │  INTERACTIVE    ││
│ │ Skills:  │ │ │    (50%)     │     (50%)       ││
│ │ ✓ PACE   │ │ │              │                 ││
│ │ ░ Tone   │ │ │ [Scrollable] │  [Scrollable]   ││
│ └──────────┘ │ │              │                 ││
│              │ └──────────────┴─────────────────┘│
│              │ ┌────────────────────────────────┐│
│              │ │         PROGRESS BAR           ││
│              │ └────────────────────────────────┘│
└──────────────┴────────────────────────────────────┘
```

## Mobile Layout (<768px)

```
┌─────────────────────────┐
│   VIEWPORT (375x667)    │
├─────────────────────────┤
│  ┌───┐                  │
│  │ ≡ │ Maya's Journey   │  <- Mobile menu button
│  └───┘                  │
├─────────────────────────┤
│        HEADER           │
│  [Lyra] [Title]         │
│  [FF] [L] [1/9]         │  <- Compact controls
├─────────────────────────┤
│                         │
│    NARRATIVE PANEL      │
│      (Full width)       │
│                         │
│    ┌──────────────┐     │
│    │ Lyra Avatar  │     │
│    │ + Messages   │     │
│    │              │     │
│    │ [Scrollable] │     │
│    └──────────────┘     │
│                         │
├─────────────────────────┤
│                         │
│   INTERACTIVE PANEL     │
│     (Full width)        │
│                         │
│    ┌──────────────┐     │
│    │Stage Content │     │
│    │              │     │
│    │ [Scrollable] │     │
│    └──────────────┘     │
│                         │
├─────────────────────────┤
│     PROGRESS BAR        │
│   ████████░░░░ (3/9)    │
└─────────────────────────┘

Mobile Overlay (when menu opened):
┌─────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░│  <- Dark overlay
│┌───────────────┐░░░░░░░░│
││               │░░░░░░░░│
││ SUMMARY PANEL │░░░░░░░░│
││   (288px)     │░░░░░░░░│
││               │░░░░░░░░│
││ ┌───────────┐ │░░░░░░░░│
││ │ Maya's    │ │░░░░░░░░│
││ │ Journey   │ │░░░░░░░░│
││ │           │ │░░░░░░░░│
││ │ Progress  │ │░░░░░░░░│
││ │ ███░░     │ │░░░░░░░░│
││ └───────────┘ │░░░░░░░░│
││               │░░░░░░░░│
│└───────────────┘░░░░░░░░│
└─────────────────────────┘
```

## Dimension Specifications

### Desktop Dimensions
- **Viewport**: 1024px+ width
- **Summary Panel**: 320px fixed width
- **Main Content**: calc(100% - 320px)
- **Narrative Panel**: 50% of main content
- **Interactive Panel**: 50% of main content
- **Gap between panels**: 8px (0.5rem)
- **Header Height**: 64px
- **Progress Bar Height**: 12px

### Tablet Dimensions
- **Viewport**: 768px - 1023px width
- **Summary Panel**: 240px fixed width
- **Main Content**: calc(100% - 240px)
- **Narrative Panel**: 50% of main content
- **Interactive Panel**: 50% of main content
- **Gap between panels**: 4px (0.25rem)

### Mobile Dimensions
- **Viewport**: <768px width
- **Summary Panel**: 288px (overlay)
- **Main Content**: 100% width
- **Narrative Panel**: 100% width, 50vh min-height
- **Interactive Panel**: 100% width, 50vh min-height
- **Mobile Menu Button**: 44x44px touch target

## Layout Behavior Rules

### Desktop Behavior
1. Summary panel always visible
2. Two-column split for content
3. Horizontal layout flow
4. No overlays or modals for navigation

### Tablet Behavior
1. Narrower summary panel
2. Maintain two-column split
3. Slightly reduced spacing
4. Touch-optimized controls

### Mobile Behavior
1. Summary panel hidden by default
2. Slide-in overlay for summary
3. Vertical stacking of content
4. Full-width panels
5. Touch gestures enabled

## Z-Index Layers

```
┌─────────────────────────────────┐ z-50: Mobile Panel
│  ┌──────────────────────────┐   │
│  │                          │   │ z-40: Mobile Overlay
│  │  ┌───────────────────┐   │   │
│  │  │                   │   │   │ z-10: Summary Panel
│  │  │  ┌────────────┐   │   │   │
│  │  │  │            │   │   │   │ z-0: Main Content
└──┴──┴──┴────────────┴───┴───┴───┘
```

## Responsive Breakpoint Transitions

### 1024px Breakpoint
- Summary panel: Inline → Fixed overlay
- Content split: Side-by-side → Stacked
- Controls: Full labels → Abbreviated

### 768px Breakpoint
- Summary width: 320px → 240px
- Content gap: 8px → 4px
- Font sizes: Slight reduction

### Animation Specifications

```css
/* Panel slide animation */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Blur transition */
@keyframes blurTransition {
  0% { backdrop-filter: blur(40px); }
  100% { backdrop-filter: blur(0px); }
}

/* Progress bar fill */
@keyframes progressFill {
  from { width: 0%; }
  to { width: var(--progress-percent); }
}
```

## Accessibility Landmarks

```
<body>
  <div role="application" aria-label="Maya's Communication Journey">
    <aside role="navigation" aria-label="Journey Progress">
      <!-- Summary Panel -->
    </aside>
    <main role="main">
      <header role="banner">
        <!-- Header -->
      </header>
      <div role="region" aria-label="Content Area">
        <section aria-label="Lyra's Narrative">
          <!-- Narrative Panel -->
        </section>
        <section aria-label="Interactive Exercises">
          <!-- Interactive Panel -->
        </section>
      </div>
      <div role="progressbar" aria-valuenow="3" aria-valuemax="9">
        <!-- Progress Bar -->
      </div>
    </main>
  </div>
</body>
```

This visual diagram provides a complete specification for implementing the two-column layout with all responsive states and dimensional requirements.