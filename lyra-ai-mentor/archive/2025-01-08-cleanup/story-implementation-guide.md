# Maya Story Implementation Guide
## Technical Integration for Story Engineers

### Overview
This guide provides specific implementation details for integrating Maya's story arc into the /lyra-maya-demo route using the existing dynamic stages system.

---

## Stage-by-Stage Implementation

### Stage 1: Introduction - The Overwhelm

**Key Story Beats:**
1. Maya at her desk, late evening, struggling with email
2. Multiple draft attempts showing frustration
3. Post-it notes and disorganization
4. Lyra's gentle introduction

**Implementation Code Structure:**
```typescript
narrativeMessages: [
  {
    id: 'intro-maya-overwhelm',
    content: "It's 7 PM on a Thursday. Maya Rodriguez sits at her desk at Hope Gardens Community Center, staring at a blank email to the board. She's been here for three hours, and the cursor is still blinking...",
    type: 'lyra-unified',
    context: 'story',
    emotion: 'empathetic',
    delay: 500
  },
  {
    id: 'intro-maya-struggle',
    content: "Sound familiar? Maya's draft folder has three versions of the same message. Her desk is covered in Post-it notes. The summer program launch was amazing, but somehow... the words won't come.",
    type: 'lyra-unified',
    context: 'story',
    emotion: 'understanding',
    delay: 4000
  },
  {
    id: 'intro-maya-hope',
    content: "Maya's journey from overwhelmed to confident changed everything - not just her emails, but her entire relationship with communication. Let me show you how she discovered the PACE approach...",
    type: 'lyra-unified',
    context: 'guidance',
    emotion: 'encouraging',
    delay: 8000
  }
]
```

**Visual Component Enhancement:**
```typescript
// Add to Stage 1 component
<motion.div className="absolute top-4 right-4 opacity-30">
  <div className="flex flex-col gap-2">
    <div className="w-16 h-20 bg-yellow-200 rounded shadow-sm transform rotate-3" />
    <div className="w-16 h-20 bg-pink-200 rounded shadow-sm transform -rotate-2" />
    <div className="w-16 h-20 bg-blue-200 rounded shadow-sm transform rotate-6" />
  </div>
</motion.div>
// Post-it notes visual
```

---

### Stage 2: Purpose - The First Breakthrough

**Key Story Beats:**
1. Elena's pivotal question
2. Maya's realization about WHY vs WHAT
3. Before/after email comparison
4. First success with grant approval

**Dynamic Purpose Integration:**
Update the purpose options to include Maya's specific insights:

```typescript
const dynamicPurposes = [
  {
    id: 'inform_educate',
    label: 'Share important news',
    description: 'You have updates that will help people understand what\'s happening',
    icon: <Lightbulb className="w-5 h-5" />,
    contextHint: 'Perfect for program updates, policy changes, or helpful information',
    mayaStory: 'I learned to stop listing facts and start painting pictures. When families understand what\'s happening, they feel more connected.',
    mayaExample: 'Instead of "Q3 program metrics attached", I write "Three moments from this quarter that show why our work matters..."'
  },
  // ... other purposes with Maya's specific examples
];
```

**Narrative Enhancement:**
```typescript
narrativeMessages: [
  {
    id: 'purpose-maya-mentor',
    content: "Maya's breakthrough came from her mentor Elena's simple question: 'Why does this grant matter to YOU personally?' That question changed everything.",
    type: 'lyra-unified',
    context: 'story',
    emotion: 'thoughtful',
    delay: 500
  },
  {
    id: 'purpose-maya-shift',
    content: "Watch what happened when Maya stopped starting with WHAT and started with WHY. Her grant proposal went from 'Hope Gardens requests $50,000...' to 'Last week, 12-year-old Carlos told me he finally understands why his mom works two jobs...'",
    type: 'lyra-unified',
    context: 'story',
    emotion: 'warm',
    delay: 4000,
    animation: 'lyra-brightidea.mp4' // Trigger animation
  }
]
```

---

### Stage 3: Audience - Learning to Listen

**Key Story Beats:**
1. Realization about one-size-fits-all messaging
2. Near loss of major donor
3. Creation of audience personas
4. Transformation in response rates

**Audience Profile Enhancement:**
Add Maya's insights to each audience profile:

```typescript
// In the audience selection component
<div className="mt-4 p-3 bg-purple-50 rounded-lg">
  <p className="text-sm text-purple-700 italic">
    <strong>Maya's Discovery:</strong> "I used to send the same message to everyone. 
    Then I lost a major donor who felt 'out of touch.' That's when I learned - 
    a busy board member needs different information than a worried parent."
  </p>
</div>
```

**Interactive Element:**
```typescript
// Add comparison view
<div className="grid grid-cols-2 gap-4 mt-4">
  <div className="p-3 bg-red-50 rounded">
    <h5 className="text-sm font-medium text-red-700">Before</h5>
    <p className="text-xs mt-1">
      "Please find attached our 47-page quarterly report..."
    </p>
  </div>
  <div className="p-3 bg-green-50 rounded">
    <h5 className="text-sm font-medium text-green-700">After</h5>
    <p className="text-xs mt-1">
      "Three numbers that matter this quarter: 94% graduation rate..."
    </p>
  </div>
</div>
```

---

### Stage 4: Content - Finding Her Voice

**Key Story Beats:**
1. Dropping corporate speak
2. Embracing authentic voice
3. Learning content frameworks
4. Real email examples

**Voice Evolution Display:**
```typescript
// Add toggle to show Maya's voice transformation
const [showVoiceEvolution, setShowVoiceEvolution] = useState(false);

<Button
  variant="ghost"
  size="sm"
  onClick={() => setShowVoiceEvolution(!showVoiceEvolution)}
  className="mb-4"
>
  <Eye className="w-4 h-4 mr-2" />
  See Maya's Voice Evolution
</Button>

{showVoiceEvolution && (
  <motion.div 
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
  >
    <div className="space-y-3">
      <div>
        <Badge variant="outline" className="mb-1">Corporate Maya</Badge>
        <p className="text-sm text-gray-600">
          "We are pleased to announce the implementation of our strategic initiative..."
        </p>
      </div>
      <div>
        <Badge className="mb-1">Authentic Maya</Badge>
        <p className="text-sm text-gray-700 font-medium">
          "Something beautiful happened yesterday. Let me paint you a picture..."
        </p>
      </div>
    </div>
  </motion.div>
)}
```

---

### Stage 5: Execute - Bringing It All Together

**Key Story Beats:**
1. Development of signature approach
2. Time-saving systems
3. Consistent communication rhythm
4. Template library with personality

**System Showcase:**
```typescript
// Maya's execution strategies as interactive cards
const executionStrategies = [
  {
    title: "The 15-Minute Friday",
    description: "Every Friday at 3 PM: One story, one impact, one invitation",
    icon: <Clock className="w-5 h-5" />,
    benefit: "Consistent timing builds anticipation"
  },
  {
    title: "The Response System", 
    description: "Prioritized response times for each audience type",
    icon: <Users className="w-5 h-5" />,
    benefit: "Everyone feels valued and heard"
  },
  {
    title: "The Story Bank",
    description: "Collect stories all week, refine on Fridays",
    icon: <FileText className="w-5 h-5" />,
    benefit: "Never struggle for content again"
  }
];

// Render as interactive cards
{executionStrategies.map((strategy, idx) => (
  <motion.div
    key={idx}
    whileHover={{ scale: 1.02 }}
    className="p-4 border rounded-lg cursor-pointer"
    onClick={() => setSelectedStrategy(strategy)}
  >
    {/* Strategy content */}
  </motion.div>
))}
```

---

### Stage 6: Results - The Transformation

**Key Story Beats:**
1. Measurable impact metrics
2. Personal transformation
3. Mentoring others
4. Full circle moment

**Results Visualization:**
```typescript
// Animated metrics display
const impactMetrics = [
  { label: "Volunteer Retention", before: "60%", after: "84%", change: "+40%" },
  { label: "Donor Engagement", before: "23%", after: "65%", change: "+183%" },
  { label: "Email Time", before: "3 hours", after: "30 min", change: "-83%" },
  { label: "Grant Success", before: "10%", after: "70%", change: "+600%" }
];

<div className="grid grid-cols-2 gap-4">
  {impactMetrics.map((metric, idx) => (
    <motion.div
      key={idx}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: idx * 0.2 }}
      className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg"
    >
      <h4 className="font-medium text-sm">{metric.label}</h4>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-green-600">{metric.after}</span>
        <span className="text-sm text-green-500">{metric.change}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">was {metric.before}</p>
    </motion.div>
  ))}
</div>
```

---

## Animation Triggers

### Lyra Animation Integration Points

```typescript
// Animation mapping
const storyAnimations = {
  'intro-maya-struggle': null, // No animation, building empathy
  'purpose-maya-shift': 'lyra-brightidea.mp4',
  'audience-maya-personas': 'lyra-magnifying-glass.mp4',
  'content-maya-voice': 'lyra-puzzle-piece.mp4',
  'execute-maya-system': 'lyra-smile-circle-handshake.mp4',
  'results-maya-impact': 'lyra-celebration.mp4',
  'results-maya-future': 'lyra-telescope.mp4'
};

// In narrative message handler
useEffect(() => {
  const currentMessage = narrativeMessages[currentMessageIndex];
  if (currentMessage && storyAnimations[currentMessage.id]) {
    setLyraAnimation(storyAnimations[currentMessage.id]);
  }
}, [currentMessageIndex]);
```

---

## User Interaction Points

### Mirror Moment Implementations

1. **Blank Page Recognition**
```typescript
// In Stage 1
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <p className="text-sm text-gray-600">
    Have you ever stared at a blank email for hours, knowing exactly what you 
    want to say but unable to find the words? 
    <button className="text-purple-600 ml-1 underline">Me too →</button>
  </p>
</div>
```

2. **Time Tracking Interaction**
```typescript
// In Stage 5
const [userTimeEstimate, setUserTimeEstimate] = useState('');

<div className="mt-4">
  <p className="text-sm mb-2">How long does a typical email take you?</p>
  <Slider
    value={[userTimeEstimate]}
    onValueChange={setUserTimeEstimate}
    max={180}
    step={15}
    className="w-full"
  />
  <p className="text-xs text-gray-500 mt-1">
    Maya went from {userTimeEstimate > 90 ? 'your range' : userTimeEstimate + ' minutes'} to just 30 minutes
  </p>
</div>
```

---

## Emotional Pacing

### Narrative Rhythm Guidelines

1. **Build Empathy First** (Stage 1)
   - Slower pace, longer delays between messages
   - Let users sit with the recognition
   - No quick fixes offered yet

2. **Accelerate at Breakthrough** (Stage 2)
   - Faster message transitions
   - Excitement building
   - Quick examples of transformation

3. **Deepen Understanding** (Stage 3-4)
   - Medium pace
   - Time for reflection
   - Interactive elements for engagement

4. **Sprint to Success** (Stage 5-6)
   - Rapid-fire benefits
   - Building momentum
   - Celebration energy

---

## Testing Considerations

### Story Coherence Checks
1. Each stage should reference previous learnings
2. Maya's voice should evolve consistently
3. Examples should build in complexity
4. Emotional arc should feel natural

### User Engagement Metrics
- Time spent on each stage
- Interaction with mirror moments
- Completion rates
- Example selection patterns

### Accessibility Notes
- Ensure all animations have text alternatives
- Story content readable at all zoom levels
- Interactive elements keyboard navigable
- Emotional content appropriately paced

---

## Content Variations

### Audience-Specific Examples
Based on user's selected purpose and audience, show different Maya examples:

```typescript
const contextualExamples = {
  'inform_educate': {
    'board_members': "Maya's board update that got a standing ovation...",
    'parents': "Maya's safety update that calmed worried families...",
    'volunteers': "Maya's training email that inspired action..."
  },
  // ... more mappings
};
```

### Progressive Disclosure
- Start with simple examples
- Layer in complexity based on user engagement
- Offer "deep dive" options for advanced users

---

## Performance Optimization

### Lazy Loading Story Content
```typescript
const storyChunks = {
  'stage1': () => import('./story-chunks/stage1-overwhelm'),
  'stage2': () => import('./story-chunks/stage2-purpose'),
  // ... etc
};
```

### Animation Preloading
```typescript
// Preload next stage's animation
useEffect(() => {
  if (currentStageIndex < stages.length - 1) {
    const nextStage = stages[currentStageIndex + 1];
    const nextAnimation = getAnimationForStage(nextStage.id);
    if (nextAnimation) {
      preloadAnimation(nextAnimation);
    }
  }
}, [currentStageIndex]);
```

---

This implementation guide provides the technical framework for bringing Maya's story to life while maintaining the interactive, personalized nature of the PACE journey.