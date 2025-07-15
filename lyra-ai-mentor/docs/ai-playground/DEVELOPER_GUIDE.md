# AI Playground Test Environment - Developer Guide

## 🏗️ Architecture Overview

The AI Playground is built on a modern React/TypeScript stack with a focus on performance, scalability, and maintainability. This guide covers the technical implementation details for developers.

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Structure](#component-structure)
3. [Database Schema](#database-schema)
4. [API Integration](#api-integration)
5. [Development Setup](#development-setup)
6. [Testing Strategy](#testing-strategy)
7. [Performance Optimization](#performance-optimization)
8. [Deployment Guide](#deployment-guide)

## 🏛️ System Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **State Management**: React Query, Context API
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API
- **Testing**: Vitest, React Testing Library
- **Build Tools**: Vite, ESLint, TypeScript

### Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages/         Components/      Services/      Hooks/       │
│  AIPlayground   ai-playground/   aiService     useLyraChat  │
│  Dashboard      interactive/     analytics     useProgress  │
│  Lesson         lesson/          export        useAuth      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  Supabase Edge Functions                                   │
│  ├── chat-with-lyra/                                       │
│  ├── ai-testing-assistant/                                 │
│  └── content-manager/                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)      External APIs                  │
│  ├── User profiles          ├── OpenAI API                 │
│  ├── Progress tracking      ├── Analytics                  │
│  ├── Content management     └── Export services            │
│  └── Analytics data                                         │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Structure

### Core Components

#### AI Playground Components
```typescript
// Location: src/components/ai-playground/
├── AIImpactCalculator.tsx       // Impact measurement tool
├── AIPracticeSimulator.tsx      // Practice environment
├── AIPromptBuilder.tsx          // Prompt engineering tool
├── AIResponseAnalyzer.tsx       // Response analysis
├── AIWorkflowDesigner.tsx       // Workflow creation
├── LyraChat.tsx                 // Main chat interface
├── LyraChatDemo.tsx             // Demo version
├── SyntheticDataBuilder.tsx     // Data generation tool
└── index.ts                     // Component exports
```

#### Character-Specific Components
```typescript
// Location: src/components/interactive/
├── MayaEmailComposer.tsx        // Email writing tool
├── MayaEmailConfidenceBuilder.tsx // Confidence building
├── MayaPromptSandwichBuilder.tsx // Prompt framework
├── SofiaVoiceDiscovery.tsx      // Voice finding tool
├── SofiaStoryBreakthrough.tsx   // Story development
├── DavidDataStoryFinder.tsx     // Data storytelling
├── DavidPresentationMaster.tsx  // Presentation skills
├── RachelWorkflowDesigner.tsx   // Process automation
├── RachelProcessTransformer.tsx // Process improvement
├── AlexChangeStrategy.tsx       // Change management
└── AlexLeadershipFramework.tsx  // Leadership development
```

#### Playground Infrastructure
```typescript
// Location: src/components/playground/
├── PlaygroundNavigation.tsx     // Main navigation
├── MobilePlaygroundWrapper.tsx  // Mobile optimization
├── FloatingActionMenu.tsx       // Quick actions
├── ResponsivePlaygroundComponent.tsx // Responsive design
└── challenges/                  // Challenge components
    ├── MayaEmailChallenge.tsx
    ├── SofiaVoiceFinder.tsx
    ├── DavidDataStoryteller.tsx
    ├── RachelAutomationBuilder.tsx
    └── AlexChangeNavigator.tsx
```

### Component API Documentation

#### LyraChat Component
```typescript
interface LyraChatProps {
  initialContext?: string;
  characterPersona?: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
  enableVoice?: boolean;
  showAnalytics?: boolean;
}

// Usage
<LyraChat
  characterPersona="maya"
  initialContext="email writing challenge"
  onMessageSent={handleMessageSent}
  enableVoice={true}
  showAnalytics={true}
/>
```

#### Challenge Component Interface
```typescript
interface ChallengeProps {
  user: User;
  onComplete: (results: ChallengeResults) => void;
  onProgress: (progress: ProgressUpdate) => void;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
}

interface ChallengeResults {
  score: number;
  timeSpent: number;
  skillsImproved: string[];
  nextRecommendations: string[];
}
```

## 🗄️ Database Schema

### Core Tables

#### User Profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    display_name TEXT,
    role TEXT,
    organization TEXT,
    experience_level TEXT,
    learning_goals TEXT[],
    preferred_character TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### AI Playground Sessions
```sql
CREATE TABLE ai_playground_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    character_type TEXT NOT NULL,
    session_data JSONB,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    total_duration INTEGER,
    skills_practiced TEXT[],
    achievements_earned TEXT[]
);
```

#### Progress Tracking
```sql
CREATE TABLE ai_playground_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ai_playground_sessions(id),
    interaction_type TEXT NOT NULL,
    prompt TEXT,
    response TEXT,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5)
);
```

#### Analytics Tables
```sql
CREATE TABLE ai_playground_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    session_id UUID REFERENCES ai_playground_sessions(id)
);
```

### Database Views

#### User Progress Summary
```sql
CREATE VIEW user_progress_summary AS
SELECT 
    p.user_id,
    p.display_name,
    COUNT(DISTINCT s.id) as total_sessions,
    SUM(s.total_duration) as total_time_spent,
    ARRAY_AGG(DISTINCT unnest(s.skills_practiced)) as all_skills_practiced,
    COUNT(DISTINCT unnest(s.achievements_earned)) as total_achievements
FROM profiles p
LEFT JOIN ai_playground_sessions s ON p.user_id = s.user_id
GROUP BY p.user_id, p.display_name;
```

#### Popular Challenges
```sql
CREATE VIEW popular_challenges AS
SELECT 
    character_type,
    COUNT(*) as session_count,
    AVG(total_duration) as avg_duration,
    AVG(ARRAY_LENGTH(skills_practiced, 1)) as avg_skills_per_session
FROM ai_playground_sessions
WHERE completed_at IS NOT NULL
GROUP BY character_type
ORDER BY session_count DESC;
```

## 🔌 API Integration

### OpenAI Integration

#### Chat Service
```typescript
// Location: src/services/aiService.ts
interface ChatRequest {
  message: string;
  context?: string;
  persona?: string;
  temperature?: number;
}

interface ChatResponse {
  response: string;
  metadata: {
    model: string;
    tokens: number;
    responseTime: number;
  };
}

export const aiService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return response.json();
  },
  
  async generateContent(prompt: string, type: 'email' | 'story' | 'data'): Promise<string> {
    // Implementation details
  }
};
```

#### Edge Function Implementation
```typescript
// Location: supabase/functions/chat-with-lyra/index.ts
import { OpenAI } from 'openai';
import { corsHeaders } from './cors.ts';
import { getSystemMessage } from './system-message.ts';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { message, persona, context } = await req.json();
  
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });

  const systemMessage = getSystemMessage(persona, context);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return new Response(JSON.stringify({
    response: completion.choices[0].message.content,
    metadata: {
      model: completion.model,
      tokens: completion.usage?.total_tokens,
      responseTime: Date.now()
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

### Analytics Service

#### Event Tracking
```typescript
// Location: src/services/analyticsService.ts
interface AnalyticsEvent {
  eventType: string;
  userId: string;
  sessionId?: string;
  data: Record<string, any>;
}

export const analyticsService = {
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    await supabase
      .from('ai_playground_analytics')
      .insert({
        user_id: event.userId,
        event_type: event.eventType,
        event_data: event.data,
        session_id: event.sessionId
      });
  },
  
  async getUsageStats(userId: string): Promise<UsageStats> {
    // Implementation details
  }
};
```

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase CLI (for database management)

### Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd lyra-ai-mentor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Database Setup
```bash
# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Seed test data (optional)
npm run seed:test-data
```

### Development Server
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## 🧪 Testing Strategy

### Test Structure
```
tests/
├── integration/           # Integration tests
│   ├── components/       # Component integration
│   └── api/             # API integration
├── performance/          # Performance tests
│   ├── regression/      # Regression tests
│   └── load/           # Load testing
└── unit/                # Unit tests (co-located with components)
```

### Component Testing
```typescript
// Example: src/components/interactive/__tests__/MayaEmailComposer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MayaEmailComposer } from '../MayaEmailComposer';

describe('MayaEmailComposer', () => {
  it('should generate email content when form is submitted', async () => {
    render(<MayaEmailComposer />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Test Subject' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/generated email/i)).toBeInTheDocument();
    });
  });
});
```

### API Testing
```typescript
// Example: tests/integration/api/chat.test.ts
import { describe, it, expect } from 'vitest';
import { aiService } from '@/services/aiService';

describe('AI Service', () => {
  it('should return valid response for chat message', async () => {
    const response = await aiService.sendMessage({
      message: 'Hello, I need help with email writing',
      persona: 'maya',
      context: 'nonprofit communication'
    });
    
    expect(response.response).toBeDefined();
    expect(response.metadata.tokens).toBeGreaterThan(0);
  });
});
```

### Performance Testing
```typescript
// Example: tests/performance/bundle-size.test.ts
import { describe, it, expect } from 'vitest';
import { getBundleSize } from '../utils/bundleAnalyzer';

describe('Bundle Size', () => {
  it('should maintain bundle size under 500KB', async () => {
    const bundleSize = await getBundleSize();
    expect(bundleSize.compressed).toBeLessThan(500 * 1024);
  });
});
```

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Lazy loading for playground components
const MayaEmailChallenge = lazy(() => import('./challenges/MayaEmailChallenge'));
const SofiaVoiceFinder = lazy(() => import('./challenges/SofiaVoiceFinder'));

// Route-level code splitting
export const playgroundRoutes = [
  {
    path: '/ai-playground',
    element: <Suspense fallback={<LoadingSpinner />}><AIPlayground /></Suspense>
  }
];
```

### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
});

// Cache AI responses
const useCachedAIResponse = (prompt: string) => {
  return useQuery({
    queryKey: ['ai-response', prompt],
    queryFn: () => aiService.sendMessage({ message: prompt }),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
```

### Memory Management
```typescript
// Cleanup strategies
useEffect(() => {
  return () => {
    // Cleanup event listeners
    window.removeEventListener('resize', handleResize);
    
    // Cancel pending requests
    abortController.abort();
    
    // Clear timeouts
    clearTimeout(timeoutId);
  };
}, []);
```

## 🚀 Deployment Guide

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ai-playground': ['./src/components/ai-playground'],
          'interactive': ['./src/components/interactive'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
```

### Environment-Specific Configuration
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

### Database Migrations
```bash
# Create migration
supabase migration new add_playground_features

# Apply migrations
supabase db push

# Rollback if needed
supabase db reset
```

### Performance Monitoring
```typescript
// Performance tracking
const trackPerformance = () => {
  // Track Core Web Vitals
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

## 🔧 Development Tools

### VS Code Extensions
- TypeScript and JavaScript
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Import - ES6, TS, JSX, TSX

### Browser DevTools
- React Developer Tools
- Redux DevTools
- Lighthouse for performance auditing
- Network tab for API debugging

### Useful Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "db:generate-types": "supabase gen types typescript --local > src/types/database.ts"
  }
}
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Community
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.supabase.com/)
- [TypeScript Discord](https://discord.gg/typescript)

### Contributing
- Follow the existing code style
- Write tests for new features
- Update documentation
- Submit pull requests with clear descriptions

---

This developer guide provides the foundation for understanding and contributing to the AI Playground test environment. For specific implementation details, refer to the inline code documentation and individual component README files.