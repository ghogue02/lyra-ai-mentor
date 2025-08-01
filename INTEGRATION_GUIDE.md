# New ChatSystem Integration Guide

## 🔄 How to Replace the Old Chat System

### Step 1: Import the New ChatSystem

Replace this old import:
```typescript
import FloatingLyraAvatar from '@/components/lesson/FloatingLyraAvatar';
```

With this new import:
```typescript
import { ChatSystem } from '@/components/chat-system/ChatSystem';
```

### Step 2: Update the Component Usage

Replace this old usage:
```tsx
<FloatingLyraAvatar
  lessonContext={{
    chapterNumber: 1,
    lessonTitle: "Meet Lyra & AI Foundations",
    phase: "introduction",
    content: "lesson content here",
    chapterTitle: "Chapter 1"
  }}
  onEngagementChange={handleEngagementChange}
  onNarrativePause={handleNarrativePause}
  onNarrativeResume={handleNarrativeResume}
  position="bottom-right"
/>
```

With this new usage:
```tsx
<ChatSystem
  lessonModule={{
    chapterNumber: 1,
    title: "Meet Lyra & AI Foundations",
    phase: "introduction", 
    content: "lesson content here",
    chapterTitle: "Chapter 1"
  }}
  onEngagementChange={handleEngagementChange}
  onNarrativePause={handleNarrativePause}
  onNarrativeResume={handleNarrativeResume}
  position="bottom-right"
/>
```

### Step 3: Update Props Interface

The new `lessonModule` prop uses this interface:

```typescript
interface LessonModule {
  chapterNumber: number;
  title: string;           // was: lessonTitle
  phase: string;
  content: string;
  chapterTitle?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
```

### Step 4: Test the Integration

1. Start the development server
2. Navigate to Chapter 1, Lesson 1  
3. Test the new chat functionality:
   - Click avatar to expand/collapse
   - Try the quick questions
   - Send custom messages
   - Verify narrative pause/resume works
   - Test scroll behavior

## 🎯 Chapter 1 Specific Features

The new system includes tailored quick questions for Chapter 1:

- "I'm new to AI - where should I start?"
- "How can AI help my nonprofit's daily work?"  
- "What are the most important AI concepts?"
- "I'm worried about AI ethics - can you help?"

## 🔧 Benefits of the New System

1. **No More State Conflicts** - Single source of truth
2. **Smooth Typewriter** - RAF-based animation that doesn't break
3. **Better Performance** - Optimized rendering with React.memo
4. **Cleaner Design** - Removed corporate styling
5. **Modular Architecture** - Easy to extend for future chapters

## 🐛 If You Encounter Issues

1. **TypeScript errors** - Make sure to update import paths
2. **Styling issues** - The new system uses Tailwind, ensure classes are available
3. **State issues** - Clear browser storage if old state persists
4. **Hook errors** - Ensure ChatSystem is not nested inside other providers

## 📦 Files You Can Archive/Delete After Integration

Once the new system is working:

- `src/components/lesson/FloatingLyraAvatar.tsx`
- `src/components/lesson/chat/lyra/ContextualLyraChat.tsx`  
- `src/components/lesson/chat/lyra/maya/NarrativeManager.tsx` (if not used elsewhere)

Keep these files temporarily until integration is fully tested.