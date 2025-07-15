import { Tutorial } from '../../types/tutorial';

export const sofiaVoiceDiscoveryTutorial: Tutorial = {
  id: 'sofia-voice-discovery',
  name: 'Discover Your Authentic Voice with Sofia',
  description: 'Uncover and develop your unique communication style through guided exercises',
  category: 'storytelling',
  estimatedTime: 7,
  steps: [
    {
      id: 'intro',
      title: 'Find Your Voice',
      content: 'Sofia will help you discover your authentic voice through storytelling exercises. Let\'s begin your journey to confident communication.',
      position: 'center',
    },
    {
      id: 'voice-type-quiz',
      title: 'Identify Your Voice Type',
      content: 'Start with this quick assessment to understand your natural communication style. Answer honestly - there are no wrong answers!',
      target: '[data-tutorial="voice-quiz-start"]',
      position: 'bottom',
      spotlightPadding: 16,
      action: {
        label: 'Start Assessment',
        handler: () => {
          const button = document.querySelector('[data-tutorial="voice-quiz-start"]') as HTMLButtonElement;
          button?.click();
        },
      },
    },
    {
      id: 'story-prompt',
      title: 'Choose a Story Prompt',
      content: 'Select a prompt that resonates with you. The best stories come from genuine experiences and emotions.',
      target: '[data-tutorial="story-prompts"]',
      position: 'right',
      mobilePosition: 'bottom',
      spotlightPadding: 12,
      allowInteraction: true,
    },
    {
      id: 'record-story',
      title: 'Record Your Story',
      content: 'Click the microphone to record your story. Speak naturally - Sofia will analyze your delivery style, not judge your content.',
      target: '[data-tutorial="record-button"]',
      position: 'bottom',
      spotlightPadding: 20,
    },
    {
      id: 'voice-analysis',
      title: 'Understand Your Patterns',
      content: 'Sofia analyzes your pace, tone, and energy. These insights help you understand your natural strengths.',
      target: '[data-tutorial="voice-analysis"]',
      position: 'left',
      mobilePosition: 'top',
    },
    {
      id: 'improvement-tips',
      title: 'Personalized Improvement Tips',
      content: 'Based on your voice analysis, Sofia provides specific exercises to enhance your storytelling impact.',
      target: '[data-tutorial="improvement-tips"]',
      position: 'bottom',
      spotlightPadding: 16,
    },
    {
      id: 'practice-exercises',
      title: 'Practice Makes Authentic',
      content: 'Try these voice exercises designed specifically for your communication style. Regular practice builds confidence.',
      target: '[data-tutorial="practice-exercises"]',
      position: 'right',
      mobilePosition: 'bottom',
      allowInteraction: true,
    },
    {
      id: 'track-progress',
      title: 'Track Your Journey',
      content: 'Your voice profile shows how you\'ve grown over time. Celebrate your progress and keep developing your unique style!',
      target: '[data-tutorial="voice-profile"]',
      position: 'top',
    },
    {
      id: 'complete',
      title: 'Your Voice Matters',
      content: 'You\'ve taken the first step in discovering your authentic voice. Keep practicing, and remember - your unique perspective is your greatest strength.',
      position: 'center',
    },
  ],
};