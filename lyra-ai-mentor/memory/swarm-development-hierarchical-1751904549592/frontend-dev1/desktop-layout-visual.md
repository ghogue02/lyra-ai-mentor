# Desktop Three-Column Layout Visual Representation

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VIEWPORT (100%)                                 │
├─────────────────┬───────────────────────┬───────────────────────────────┤
│                 │                       │                               │
│    Summary      │    Lyra Narrative     │    Interactive Panel          │
│    Panel        │       Panel           │                               │
│                 │                       │                               │
│     (25%)       │      (37.5%)          │       (37.5%)                │
│                 │                       │                               │
│  ┌───────────┐  │  ┌─────────────────┐  │  ┌─────────────────────────┐  │
│  │ Progress  │  │  │ Lyra Avatar    │  │  │ Current Stage Title    │  │
│  │ Tracking  │  │  │                │  │  │                        │  │
│  ├───────────┤  │  ├─────────────────┤  │  ├─────────────────────────┤  │
│  │           │  │  │                │  │  │                        │  │
│  │ Skill     │  │  │ Story Content  │  │  │ Interactive Content    │  │
│  │ Areas     │  │  │                │  │  │                        │  │
│  │           │  │  │ • Story        │  │  │ • Forms                │  │
│  │ ✓ PACE    │  │  │ • Guidance     │  │  │ • Buttons              │  │
│  │ ✓ Tone    │  │  │ • Celebration  │  │  │ • Options              │  │
│  │ ○ Template│  │  │                │  │  │                        │  │
│  │ ○ Difficult│ │  │ Typing Effect  │  │  │ Blur States:           │  │
│  │ ○ Subject │  │  │ Animation      │  │  │ • Full                 │  │
│  │           │  │  │                │  │  │ • Partial              │  │
│  └───────────┘  │  └─────────────────┘  │  │ • Clear                │  │
│                 │                       │  └─────────────────────────┘  │
│                 │                       │                               │
└─────────────────┴───────────────────────┴───────────────────────────────┘
                  ▲                       ▲
                  │                       │
           2px border               2px border
```

## CSS Grid Configuration

```css
.container {
  display: grid;
  grid-template-columns: 25% 37.5% 37.5%;
  gap: 0;
  height: 100vh;
}
```

## Color Scheme

- **Summary Panel**: Light gray background (#f9fafb)
- **Narrative Panel**: White background
- **Interactive Panel**: Purple/pink gradient overlay
- **Borders**: Gray (#e5e7eb) 2px solid

## Responsive Behavior

### Desktop (≥1024px)
```
[  25%  ][    37.5%    ][    37.5%    ]
```

### Tablet (768px-1023px)
```
[Overlay][        100% Main Content        ]
         [   50% Narrative  ][  50% Inter  ]
```

### Mobile (<768px)
```
[Overlay]
[      100% Narrative      ]
[      100% Interactive    ]
```

## Key Features
- No overlapping between panels
- Clean 2px borders for visual separation
- Proper spacing with no gaps
- Smooth transitions between states
- Accessibility-first design