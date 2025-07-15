import { toast } from 'sonner';

export interface SharedContent {
  data: any;
  fromCharacter: string;
  toComponent?: string;
  timestamp: string;
  type: 'email' | 'story' | 'data' | 'workflow' | 'strategy';
}

export interface IntegrationSuggestion {
  fromComponent: string;
  toComponent: string;
  description: string;
  benefit: string;
}

class ComponentIntegrationService {
  private static instance: ComponentIntegrationService;
  
  // Integration mappings for smart suggestions
  private integrationMap = {
    // Maya's integrations
    'maya-email': {
      suggestedTargets: [
        { component: 'David Data Visualizer', benefit: 'Add data-driven insights to emails' },
        { component: 'Sofia Story Creator', benefit: 'Enhance emails with compelling narratives' },
        { component: 'Communication Metrics', benefit: 'Track email effectiveness' }
      ]
    },
    'maya-grant': {
      suggestedTargets: [
        { component: 'David Analytics', benefit: 'Support proposals with data' },
        { component: 'Alex Strategy', benefit: 'Align with strategic goals' },
        { component: 'Rachel Workflow', benefit: 'Create grant process workflows' }
      ]
    },
    
    // Sofia's integrations
    'sofia-story': {
      suggestedTargets: [
        { component: 'Maya Email Composer', benefit: 'Use stories in communications' },
        { component: 'David Presentation', benefit: 'Add narrative to data presentations' },
        { component: 'Social Media Posts', benefit: 'Create engaging social content' }
      ]
    },
    'sofia-voice': {
      suggestedTargets: [
        { component: 'All Communications', benefit: 'Maintain consistent voice' },
        { component: 'Brand Guidelines', benefit: 'Define organizational voice' },
        { component: 'Training Materials', benefit: 'Teach authentic communication' }
      ]
    },
    
    // David's integrations
    'david-insights': {
      suggestedTargets: [
        { component: 'Alex Strategy Planning', benefit: 'Data-driven decision making' },
        { component: 'Maya Grant Proposals', benefit: 'Support funding requests' },
        { component: 'Board Reports', benefit: 'Clear impact visualization' }
      ]
    },
    'david-charts': {
      suggestedTargets: [
        { component: 'Presentations', benefit: 'Visual data storytelling' },
        { component: 'Reports', benefit: 'Enhanced visual communication' },
        { component: 'Sofia Stories', benefit: 'Combine data with narrative' }
      ]
    },
    
    // Rachel's integrations
    'rachel-workflow': {
      suggestedTargets: [
        { component: 'All Processes', benefit: 'Streamline operations' },
        { component: 'Team Training', benefit: 'Document best practices' },
        { component: 'Alex Change Management', benefit: 'Support transformation' }
      ]
    },
    'rachel-automation': {
      suggestedTargets: [
        { component: 'Maya Email Templates', benefit: 'Automate communications' },
        { component: 'David Data Collection', benefit: 'Automate reporting' },
        { component: 'Task Management', benefit: 'Reduce manual work' }
      ]
    },
    
    // Alex's integrations
    'alex-strategy': {
      suggestedTargets: [
        { component: 'All Planning Tools', benefit: 'Align with vision' },
        { component: 'David Metrics', benefit: 'Track strategic progress' },
        { component: 'Team Goals', benefit: 'Cascade objectives' }
      ]
    },
    'alex-change': {
      suggestedTargets: [
        { component: 'Rachel Workflows', benefit: 'Implement new processes' },
        { component: 'Sofia Communications', benefit: 'Change messaging' },
        { component: 'Training Programs', benefit: 'Support adoption' }
      ]
    }
  };

  static getInstance(): ComponentIntegrationService {
    if (!ComponentIntegrationService.instance) {
      ComponentIntegrationService.instance = new ComponentIntegrationService();
    }
    return ComponentIntegrationService.instance;
  }

  // Share content between components
  shareContent(content: SharedContent): void {
    const key = this.getShareKey(content.toComponent || 'general');
    localStorage.setItem(key, JSON.stringify(content));
    
    // Notify about the share
    toast.success('Content shared successfully', {
      description: content.toComponent 
        ? `Ready to use in ${content.toComponent}`
        : 'Content saved for later use'
    });
    
    // Track integration usage
    this.trackIntegration(content);
  }

  // Retrieve shared content
  getSharedContent(componentName: string): SharedContent | null {
    const key = this.getShareKey(componentName);
    const stored = localStorage.getItem(key);
    
    if (stored) {
      try {
        const content = JSON.parse(stored);
        // Clear after retrieval (one-time use)
        localStorage.removeItem(key);
        return content;
      } catch (error) {
        console.error('Failed to parse shared content:', error);
        return null;
      }
    }
    
    return null;
  }

  // Check for any available shared content
  hasSharedContent(componentName: string): boolean {
    const key = this.getShareKey(componentName);
    return localStorage.getItem(key) !== null;
  }

  // Get integration suggestions based on current component
  getSuggestions(componentType: string): IntegrationSuggestion[] {
    const suggestions = this.integrationMap[componentType];
    if (!suggestions) return [];
    
    return suggestions.suggestedTargets.map(target => ({
      fromComponent: componentType,
      toComponent: target.component,
      description: `Share with ${target.component}`,
      benefit: target.benefit
    }));
  }

  // Smart content transformation between component types
  transformContent(content: any, fromType: string, toType: string): any {
    // Email to Story
    if (fromType === 'email' && toType === 'story') {
      return {
        title: 'Email Communication Story',
        narrative: content.content,
        context: 'Transform this email into a compelling story',
        suggestions: [
          'Add personal anecdotes',
          'Highlight emotional moments',
          'Include specific outcomes'
        ]
      };
    }
    
    // Data to Email
    if (fromType === 'data' && toType === 'email') {
      return {
        dataPoints: content,
        template: 'Include these key insights in your email',
        suggestions: [
          'Lead with the most impactful number',
          'Explain what the data means',
          'Connect to recipient\'s interests'
        ]
      };
    }
    
    // Story to Presentation
    if (fromType === 'story' && toType === 'presentation') {
      return {
        slides: this.storyToSlides(content),
        notes: 'Use this narrative structure for your presentation',
        visualSuggestions: [
          'Add images that support the narrative',
          'Use data to validate story points',
          'Include call-to-action slide'
        ]
      };
    }
    
    // Workflow to Strategy
    if (fromType === 'workflow' && toType === 'strategy') {
      return {
        processes: content,
        strategicAlignment: 'How this workflow supports strategic goals',
        improvements: [
          'Identify bottlenecks to address',
          'Find automation opportunities',
          'Measure impact on objectives'
        ]
      };
    }
    
    // Default: return content with generic transformation hints
    return {
      originalContent: content,
      transformationHints: [
        `Adapt this ${fromType} content for ${toType} use`,
        'Consider the audience and purpose',
        'Maintain key messages while changing format'
      ]
    };
  }

  // Helper: Convert story to presentation slides
  private storyToSlides(story: any): any[] {
    const slides = [];
    
    // Title slide
    slides.push({
      type: 'title',
      content: story.title || 'Our Story',
      subtitle: 'A journey of impact and transformation'
    });
    
    // Context slide
    slides.push({
      type: 'context',
      title: 'The Challenge',
      content: story.challenge || story.context || 'Setting the scene'
    });
    
    // Journey slides (break up long content)
    if (story.narrative) {
      const paragraphs = story.narrative.split('\n\n');
      paragraphs.forEach((para, index) => {
        if (para.trim()) {
          slides.push({
            type: 'content',
            title: `Part ${index + 1}`,
            content: para
          });
        }
      });
    }
    
    // Impact slide
    slides.push({
      type: 'impact',
      title: 'The Impact',
      content: story.outcome || 'Measurable results and transformation'
    });
    
    // Call to action
    slides.push({
      type: 'cta',
      title: 'Join Our Journey',
      content: 'How you can be part of this story'
    });
    
    return slides;
  }

  // Track integration usage for analytics
  private trackIntegration(content: SharedContent): void {
    const integrationHistory = this.getIntegrationHistory();
    integrationHistory.push({
      from: content.fromCharacter,
      to: content.toComponent || 'unknown',
      type: content.type,
      timestamp: content.timestamp
    });
    
    // Keep only last 100 integrations
    if (integrationHistory.length > 100) {
      integrationHistory.shift();
    }
    
    localStorage.setItem('integration-history', JSON.stringify(integrationHistory));
  }

  // Get integration history
  getIntegrationHistory(): any[] {
    const stored = localStorage.getItem('integration-history');
    return stored ? JSON.parse(stored) : [];
  }

  // Get most used integrations
  getMostUsedIntegrations(): { pattern: string; count: number }[] {
    const history = this.getIntegrationHistory();
    const patterns: { [key: string]: number } = {};
    
    history.forEach(item => {
      const pattern = `${item.from} → ${item.to}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });
    
    return Object.entries(patterns)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Generate share key
  private getShareKey(component: string): string {
    return `shared-content-${component.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Clear all shared content
  clearAllSharedContent(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('shared-content-')
    );
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const componentIntegrationService = ComponentIntegrationService.getInstance();