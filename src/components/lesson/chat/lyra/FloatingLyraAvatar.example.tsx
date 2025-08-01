import React, { useState } from 'react';
import { FloatingLyraAvatar } from './FloatingLyraAvatar';

/**
 * Example usage of FloatingLyraAvatar component
 * This demonstrates the three states and integration patterns
 */
export const FloatingLyraAvatarExample: React.FC = () => {
  const [avatarState, setAvatarState] = useState<'idle' | 'pulsing' | 'active'>('idle');
  const [chatOpen, setChatOpen] = useState(false);

  const handleAvatarClick = () => {
    if (avatarState === 'idle') {
      setAvatarState('pulsing');
      // Simulate context-aware pulsing trigger
      setTimeout(() => setAvatarState('active'), 2000);
    } else if (avatarState === 'pulsing') {
      setAvatarState('active');
      setChatOpen(true);
    } else {
      // Toggle chat open/close when active
      setChatOpen(!chatOpen);
    }
  };

  const resetDemo = () => {
    setAvatarState('idle');
    setChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">FloatingLyraAvatar Demo</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Current State: {avatarState}</h2>
          <p className="text-gray-600 mb-6">
            Click the floating avatar in the bottom-right corner to see state transitions.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAvatarState('idle')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Set Idle
            </button>
            <button
              onClick={() => setAvatarState('pulsing')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Set Pulsing
            </button>
            <button
              onClick={() => setAvatarState('active')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Set Active
            </button>
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Reset Demo
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">State Descriptions:</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Idle:</strong> Standard avatar with subtle breathing animation</li>
              <li><strong>Pulsing:</strong> Gentle glow effect with tooltip to encourage interaction</li>
              <li><strong>Active:</strong> Scaled up with brightness increase during chat</li>
            </ul>
          </div>
        </div>

        {chatOpen && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Chat Interface (Mock)</h2>
            <p className="text-gray-600">
              This would be where your chat interface appears when the avatar is clicked.
              The avatar remains visible and in 'active' state during chat.
            </p>
          </div>
        )}
      </div>

      {/* FloatingLyraAvatar - positioned as overlay */}
      <FloatingLyraAvatar
        state={avatarState}
        onAvatarClick={handleAvatarClick}
        lessonContext={{
          lessonId: 'demo-lesson',
          currentStep: 1,
          totalSteps: 5,
          hasActiveChat: chatOpen
        }}
      />
    </div>
  );
};