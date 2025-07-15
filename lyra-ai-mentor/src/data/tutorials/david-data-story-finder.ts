import { Tutorial } from '../../types/tutorial';

export const davidDataStoryFinderTutorial: Tutorial = {
  id: 'david-data-story-finder',
  name: 'Find Stories in Your Data with David',
  description: 'Learn to uncover compelling narratives hidden in your data and metrics',
  category: 'dataAnalysis',
  estimatedTime: 6,
  steps: [
    {
      id: 'intro',
      title: 'Data Tells Stories',
      content: 'David will show you how to find meaningful stories in your data. Every number has a narrative - let\'s discover yours.',
      position: 'center',
    },
    {
      id: 'upload-data',
      title: 'Start with Your Data',
      content: 'Upload a CSV file or paste your data here. David works with sales figures, survey results, or any numerical data.',
      target: '[data-tutorial="data-upload"]',
      position: 'bottom',
      spotlightPadding: 16,
      allowInteraction: true,
    },
    {
      id: 'data-preview',
      title: 'Review Your Data',
      content: 'Check that your data loaded correctly. David will automatically detect column types and suggest the best visualizations.',
      target: '[data-tutorial="data-preview"]',
      position: 'right',
      mobilePosition: 'bottom',
      spotlightPadding: 12,
    },
    {
      id: 'story-type',
      title: 'Choose Your Story Type',
      content: 'What story do you want to tell? Growth trends, comparisons, or correlations? Each type reveals different insights.',
      target: '[data-tutorial="story-type-selector"]',
      position: 'bottom',
      spotlightPadding: 16,
      allowInteraction: true,
    },
    {
      id: 'ai-insights',
      title: 'Discover Hidden Patterns',
      content: 'Click "Find Stories" to let David analyze your data for interesting patterns, anomalies, and trends you might have missed.',
      target: '[data-tutorial="find-stories-button"]',
      position: 'left',
      mobilePosition: 'top',
      action: {
        label: 'Find Stories Now',
        handler: () => {
          const button = document.querySelector('[data-tutorial="find-stories-button"]') as HTMLButtonElement;
          button?.click();
        },
      },
    },
    {
      id: 'story-suggestions',
      title: 'Explore Story Suggestions',
      content: 'David found several potential stories in your data. Each one highlights a different aspect of your information.',
      target: '[data-tutorial="story-suggestions"]',
      position: 'bottom',
      spotlightPadding: 16,
      allowInteraction: true,
    },
    {
      id: 'visualization',
      title: 'Visualize Your Story',
      content: 'Choose how to best visualize your story. David recommends chart types based on your data and narrative goals.',
      target: '[data-tutorial="chart-preview"]',
      position: 'top',
      spotlightPadding: 12,
    },
    {
      id: 'narrative-builder',
      title: 'Craft Your Narrative',
      content: 'Use David\'s narrative builder to add context, explanations, and key takeaways to your data story.',
      target: '[data-tutorial="narrative-editor"]',
      position: 'right',
      mobilePosition: 'bottom',
      allowInteraction: true,
    },
    {
      id: 'export-share',
      title: 'Share Your Story',
      content: 'Export your data story as a presentation, report, or interactive dashboard. Make your insights actionable!',
      target: '[data-tutorial="export-options"]',
      position: 'left',
      mobilePosition: 'top',
    },
    {
      id: 'complete',
      title: 'You\'re a Data Storyteller!',
      content: 'Great work! You\'ve learned to find and tell compelling stories with data. Remember: context and clarity make data meaningful.',
      position: 'center',
    },
  ],
};