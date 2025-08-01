import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingLyraAvatar } from '../FloatingLyraAvatar';
import { type LessonContext } from '@/types/ContextualChat';

// Example usage component demonstrating the ContextualLyraChat system
export const ContextualLyraChatExample: React.FC = () => {
  // Example lesson context for Chapter 1, Lesson 1
  const lessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: "AI Foundations & Introduction",
    phase: "introduction",
    content: "This lesson introduces AI concepts for nonprofits, covering basic terminology, ethical considerations, and practical applications. Students learn about AI's potential to amplify their mission-driven work while maintaining human-centered values.",
    chapterTitle: "AI Foundations",
    objectives: [
      "Understand basic AI terminology and concepts",
      "Identify ethical considerations for nonprofit AI use",
      "Recognize practical AI applications in nonprofit work",
      "Develop confidence in AI literacy"
    ],
    keyTerms: [
      "Artificial Intelligence",
      "Machine Learning",
      "Natural Language Processing",
      "Prompt Engineering",
      "AI Ethics"
    ],
    difficulty: "beginner"
  };

  // Handler for engagement changes
  const handleEngagementChange = (isEngaged: boolean, exchangeCount: number) => {
    console.log(`Engagement status: ${isEngaged ? 'engaged' : 'not engaged'}, Messages: ${exchangeCount}`);
  };

  // Handler for narrative pause/resume
  const handleNarrativePause = () => {
    console.log('Narrative paused for chat interaction');
  };

  const handleNarrativeResume = () => {
    console.log('Narrative resumed after chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Example Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold brand-gradient-text">
            ContextualLyraChat System Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This demonstrates the lesson-aware chat system that provides contextual starting questions 
            and integrates with the existing Edge Function for AI responses.
          </p>
        </div>

        {/* Lesson Context Display */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Lesson Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Lesson Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chapter:</span>
                    <Badge variant="outline">{lessonContext.chapterNumber}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{lessonContext.lessonTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phase:</span>
                    <Badge variant="secondary">{lessonContext.phase}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant="outline">{lessonContext.difficulty}</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Learning Objectives</h3>
                <ul className="text-sm space-y-1">
                  {lessonContext.objectives?.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-brand-cyan">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Contextual Questions",
                  description: "Starting questions tailored to the specific lesson content",
                  icon: "🎯"
                },
                {
                  title: "Floating Interface",
                  description: "Expandable avatar that doesn't interfere with lesson flow",
                  icon: "💬"
                },
                {
                  title: "Progress Tracking",
                  description: "Monitors engagement and message exchanges",
                  icon: "📈"
                },
                {
                  title: "Mobile Responsive",
                  description: "Optimized for phone, tablet, and desktop interactions",
                  icon: "📱"
                },
                {
                  title: "Narrative Integration",
                  description: "Pauses/resumes lesson content during chat",
                  icon: "⏸️"
                },
                {
                  title: "Edge Function Ready",
                  description: "Integrates with existing OpenRouter AI backend",
                  icon: "🔗"
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <p className="font-medium">Click the floating Lyra avatar</p>
                  <p className="text-muted-foreground">The avatar appears in the bottom-right corner and expands into a chat interface</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <p className="font-medium">Choose a contextual question</p>
                  <p className="text-muted-foreground">Select from lesson-specific starting questions or type your own</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <p className="font-medium">Engage in conversation</p>
                  <p className="text-muted-foreground">Chat with Lyra about the lesson content, ask questions, or seek clarification</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <div>
                  <p className="font-medium">Minimize or close when done</p>
                  <p className="text-muted-foreground">The chat can be minimized to continue the lesson or closed entirely</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Code Example */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Example</h2>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              <pre>{`import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';

// In your lesson component:
<FloatingLyraAvatar
  lessonContext={{
    chapterNumber: 1,
    lessonTitle: "AI Foundations & Introduction",
    phase: "introduction",
    content: "Lesson content here...",
    objectives: ["Learn AI basics", "..."],
    difficulty: "beginner"
  }}
  onEngagementChange={(isEngaged, count) => {
    // Track student engagement
    console.log(\`Engaged: \${isEngaged}, Messages: \${count}\`);
  }}
  onNarrativePause={() => {
    // Pause lesson content during chat
    pauseNarrative();
  }}
  onNarrativeResume={() => {
    // Resume lesson content after chat
    resumeNarrative();
  }}
/>`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The actual FloatingLyraAvatar component */}
      <FloatingLyraAvatar
        lessonContext={lessonContext}
        onEngagementChange={handleEngagementChange}
        onNarrativePause={handleNarrativePause}
        onNarrativeResume={handleNarrativeResume}
        position="bottom-right"
      />
    </div>
  );
};

export default ContextualLyraChatExample;