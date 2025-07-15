import { Tutorial } from '../../types/tutorial';

export const mayaEmailComposerTutorial: Tutorial = {
  id: 'maya-email-composer',
  name: 'Master Email Communication with Maya',
  description: 'Learn how to craft effective, empathetic emails that connect with your audience',
  category: 'communication',
  estimatedTime: 5,
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Email Mastery',
      content: 'Maya will guide you through creating emails that resonate with your recipients. Let\'s start by exploring the email composer interface.',
      position: 'center',
    },
    {
      id: 'recipient-field',
      title: 'Start with Your Recipient',
      content: 'Enter your recipient\'s email here. Maya can help you personalize your message based on who you\'re writing to.',
      target: '[data-tutorial="recipient-input"]',
      position: 'bottom',
      spotlightPadding: 12,
      allowInteraction: true,
    },
    {
      id: 'subject-line',
      title: 'Craft a Compelling Subject',
      content: 'Your subject line is the first impression. Make it clear, specific, and engaging. Try to keep it under 50 characters.',
      target: '[data-tutorial="subject-input"]',
      position: 'bottom',
      spotlightPadding: 12,
      allowInteraction: true,
    },
    {
      id: 'tone-selector',
      title: 'Choose Your Tone',
      content: 'Select the appropriate tone for your message. Maya adjusts her suggestions based on whether you\'re being formal, friendly, or urgent.',
      target: '[data-tutorial="tone-selector"]',
      position: 'right',
      mobilePosition: 'bottom',
      spotlightPadding: 16,
    },
    {
      id: 'email-body',
      title: 'Write with Purpose',
      content: 'Start with a warm greeting, state your purpose clearly, and end with a specific call to action. Maya will help you structure your thoughts.',
      target: '[data-tutorial="email-body"]',
      position: 'top',
      spotlightPadding: 12,
      allowInteraction: true,
    },
    {
      id: 'maya-suggestions',
      title: 'Get AI-Powered Suggestions',
      content: 'Click the "Get Suggestions" button to see Maya\'s recommendations for improving your email\'s clarity and impact.',
      target: '[data-tutorial="get-suggestions"]',
      position: 'left',
      mobilePosition: 'top',
      action: {
        label: 'Try It Now',
        handler: () => {
          const button = document.querySelector('[data-tutorial="get-suggestions"]') as HTMLButtonElement;
          button?.click();
        },
      },
    },
    {
      id: 'preview',
      title: 'Preview Before Sending',
      content: 'Always preview your email to see how it will appear to your recipient. Check for tone, clarity, and completeness.',
      target: '[data-tutorial="preview-button"]',
      position: 'left',
      mobilePosition: 'top',
    },
    {
      id: 'complete',
      title: 'You\'re Ready!',
      content: 'Great job! You\'ve learned the essentials of crafting effective emails with Maya. Remember: be clear, be kind, and be purposeful.',
      position: 'center',
    },
  ],
};