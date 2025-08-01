import React from 'react';
import { FloatingLyraAvatar } from './FloatingLyraAvatar';
import { LessonContext } from '@/types/ContextualChat';

/**
 * Simple test component to verify FloatingLyraAvatar functionality
 * This can be used for development and debugging
 */
export const FloatingLyraAvatarTest: React.FC = () => {
  const testLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: "AI Foundations Test",
    phase: "introduction",
    content: "This is a test lesson to verify the FloatingLyraAvatar component works correctly.",
    chapterTitle: "Test Chapter",
    objectives: [
      "Test the floating avatar functionality",
      "Verify visual states work properly",
      "Ensure chat interface opens correctly"
    ],
    keyTerms: ["Test", "Avatar", "Chat"],
    difficulty: "beginner"
  };

  const handleEngagementChange = (isEngaged: boolean, exchangeCount: number) => {
    console.log(`[Test] Engagement: ${isEngaged}, Messages: ${exchangeCount}`);
  };

  const handleNarrativePause = () => {
    console.log('[Test] Narrative paused');
  };

  const handleNarrativeResume = () => {
    console.log('[Test] Narrative resumed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">FloatingLyraAvatar Test</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Look for the floating avatar in the bottom-right corner</li>
            <li>Wait 3 seconds to see it start pulsing (if in appropriate phase)</li>
            <li>Click the avatar to open the chat interface</li>
            <li>Try asking a question or selecting a quick question</li>
            <li>Test the minimize and close buttons</li>
            <li>Check the browser console for engagement logs</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Idle State:</strong> Subtle breathing animation with heart icon</li>
            <li><strong>Pulsing State:</strong> Gentle glow and scale animation with tooltip</li>
            <li><strong>Active State:</strong> Slightly scaled up during chat interaction</li>
            <li><strong>Chat Interface:</strong> Expandable card with contextual questions</li>
            <li><strong>Minimize/Close:</strong> Chat can be minimized or closed completely</li>
          </ul>
        </div>
      </div>

      {/* The FloatingLyraAvatar component being tested */}
      <FloatingLyraAvatar
        lessonContext={testLessonContext}
        position="bottom-right"
        onEngagementChange={handleEngagementChange}
        onNarrativePause={handleNarrativePause}
        onNarrativeResume={handleNarrativeResume}
      />
    </div>
  );
};

export default FloatingLyraAvatarTest;