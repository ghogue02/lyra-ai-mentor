import { vi } from 'vitest';

/**
 * AI Component Test Configuration
 * Centralized configuration for testing AI-powered components
 */

/**
 * Test environment configuration
 */
export const AI_TEST_CONFIG = {
  // API timeouts
  AI_RESPONSE_TIMEOUT: 10000,
  VOICE_PROCESSING_TIMEOUT: 5000,
  DATABASE_QUERY_TIMEOUT: 3000,
  
  // Performance thresholds
  MAX_RENDER_TIME: 100,
  MAX_INTERACTION_TIME: 50,
  MAX_MEMORY_USAGE: 52428800, // 50MB
  MAX_AI_RESPONSE_TIME: 5000,
  
  // Accessibility requirements
  MIN_COLOR_CONTRAST: 4.5,
  MAX_TAB_STOPS: 20,
  REQUIRED_ARIA_LABELS: true,
  
  // AI service configuration
  AI_SERVICE_RETRY_ATTEMPTS: 3,
  AI_SERVICE_RETRY_DELAY: 1000,
  AI_MOCK_RESPONSE_DELAY: 100,
  
  // Voice service configuration
  VOICE_SAMPLE_RATE: 16000,
  VOICE_CHANNELS: 1,
  VOICE_FORMAT: 'wav',
  
  // Analytics configuration
  ANALYTICS_BATCH_SIZE: 10,
  ANALYTICS_FLUSH_INTERVAL: 5000
};

/**
 * Mock AI responses for different component types
 */
export const AI_MOCK_RESPONSES = {
  // Email composition responses
  EMAIL_COMPOSER: {
    subject_suggestions: [
      'Important Update on Our Project',
      'Next Steps for Our Initiative',
      'Follow-up on Our Recent Discussion'
    ],
    body_content: 'Dear [Recipient],\n\nI hope this email finds you well. I wanted to follow up on our recent discussion about [Topic].\n\nBest regards,\n[Your Name]',
    tone_analysis: {
      current_tone: 'professional',
      suggestions: ['more casual', 'more formal', 'more urgent']
    }
  },
  
  // Data analysis responses
  DATA_ANALYZER: {
    insights: [
      'Your data shows a 15% increase in engagement over the past month',
      'Peak activity occurs between 2-4 PM on weekdays',
      'Mobile users represent 65% of your total traffic'
    ],
    visualizations: [
      { type: 'line', title: 'Engagement Trend', data: [1, 2, 3, 4, 5] },
      { type: 'bar', title: 'User Demographics', data: [10, 20, 30, 40] }
    ],
    recommendations: [
      'Consider scheduling content during peak hours',
      'Optimize mobile experience',
      'Develop targeted campaigns for high-engagement segments'
    ]
  },
  
  // Automation workflow responses
  AUTOMATION_BUILDER: {
    workflow_suggestions: [
      'Automated email responses for inquiries',
      'Social media post scheduling',
      'Data backup and synchronization'
    ],
    efficiency_analysis: {
      time_saved: '2.5 hours per week',
      cost_reduction: '$500 per month',
      error_reduction: '85%'
    },
    process_optimization: [
      'Combine similar tasks into batches',
      'Add approval gates for sensitive operations',
      'Implement error handling and retry logic'
    ]
  },
  
  // Story creation responses
  STORY_CREATOR: {
    story_outline: {
      introduction: 'Hook the audience with a compelling opening',
      body: 'Develop the narrative with supporting details',
      conclusion: 'End with a clear call to action'
    },
    content_suggestions: [
      'Start with a personal anecdote',
      'Include specific data points',
      'Use emotional language to connect with readers'
    ],
    voice_analysis: {
      authenticity_score: 85,
      clarity_score: 92,
      engagement_score: 78
    }
  },
  
  // Change management responses
  CHANGE_STRATEGY: {
    stakeholder_analysis: [
      { group: 'Leadership', influence: 'high', support: 'strong' },
      { group: 'IT Team', influence: 'medium', support: 'neutral' },
      { group: 'End Users', influence: 'low', support: 'resistant' }
    ],
    implementation_plan: [
      { phase: 'Planning', duration: '2 weeks', key_activities: ['Requirements gathering', 'Risk assessment'] },
      { phase: 'Execution', duration: '8 weeks', key_activities: ['System implementation', 'Training delivery'] },
      { phase: 'Monitoring', duration: '4 weeks', key_activities: ['Performance tracking', 'Issue resolution'] }
    ],
    risk_mitigation: [
      'Develop comprehensive training programs',
      'Establish clear communication channels',
      'Create feedback loops for continuous improvement'
    ]
  }
};

/**
 * Test scenarios for different AI component types
 */
export const AI_TEST_SCENARIOS = {
  // Email composer scenarios
  EMAIL_COMPOSER_SCENARIOS: [
    {
      name: 'Professional Email Generation',
      input: { recipient: 'CEO', context: 'quarterly report', tone: 'formal' },
      expected_elements: ['subject line', 'greeting', 'body content', 'closing']
    },
    {
      name: 'Casual Team Communication',
      input: { recipient: 'team member', context: 'project update', tone: 'casual' },
      expected_elements: ['friendly greeting', 'project details', 'next steps']
    },
    {
      name: 'Urgent Response',
      input: { recipient: 'client', context: 'issue resolution', tone: 'urgent' },
      expected_elements: ['immediate attention', 'solution details', 'contact information']
    }
  ],
  
  // Data analyzer scenarios
  DATA_ANALYZER_SCENARIOS: [
    {
      name: 'Website Traffic Analysis',
      input: { data_type: 'web_analytics', time_period: '30_days' },
      expected_insights: ['traffic trends', 'user behavior', 'conversion rates']
    },
    {
      name: 'Social Media Performance',
      input: { data_type: 'social_media', platforms: ['facebook', 'twitter'] },
      expected_insights: ['engagement rates', 'reach analysis', 'content performance']
    },
    {
      name: 'Sales Performance Review',
      input: { data_type: 'sales_data', metrics: ['revenue', 'conversion'] },
      expected_insights: ['sales trends', 'top performers', 'growth opportunities']
    }
  ],
  
  // Automation builder scenarios
  AUTOMATION_SCENARIOS: [
    {
      name: 'Email Campaign Automation',
      input: { trigger: 'new_subscriber', action: 'send_welcome_series' },
      expected_workflow: ['trigger setup', 'email sequence', 'follow-up actions']
    },
    {
      name: 'Data Processing Pipeline',
      input: { source: 'csv_upload', processing: 'data_cleaning', output: 'database' },
      expected_workflow: ['data validation', 'transformation', 'storage']
    },
    {
      name: 'Social Media Scheduling',
      input: { content_type: 'posts', schedule: 'weekly', platforms: ['twitter', 'linkedin'] },
      expected_workflow: ['content creation', 'scheduling', 'performance tracking']
    }
  ],
  
  // Story creator scenarios
  STORY_SCENARIOS: [
    {
      name: 'Impact Story Creation',
      input: { theme: 'community_impact', audience: 'donors', length: 'short' },
      expected_elements: ['compelling opening', 'beneficiary story', 'outcome metrics']
    },
    {
      name: 'Innovation Narrative',
      input: { theme: 'technology_adoption', audience: 'staff', length: 'medium' },
      expected_elements: ['challenge description', 'solution implementation', 'lessons learned']
    },
    {
      name: 'Vision Communication',
      input: { theme: 'organizational_vision', audience: 'stakeholders', length: 'long' },
      expected_elements: ['current state', 'future vision', 'implementation roadmap']
    }
  ],
  
  // Change strategy scenarios
  CHANGE_SCENARIOS: [
    {
      name: 'Digital Transformation',
      input: { initiative: 'cloud_migration', timeline: '6_months', budget: 'medium' },
      expected_deliverables: ['migration plan', 'training program', 'risk assessment']
    },
    {
      name: 'Process Improvement',
      input: { initiative: 'workflow_optimization', timeline: '3_months', budget: 'low' },
      expected_deliverables: ['process mapping', 'optimization recommendations', 'implementation guide']
    },
    {
      name: 'Cultural Change',
      input: { initiative: 'remote_work_adoption', timeline: '12_months', budget: 'high' },
      expected_deliverables: ['culture assessment', 'change strategy', 'communication plan']
    }
  ]
};

/**
 * Error simulation configurations for testing error handling
 */
export const AI_ERROR_SCENARIOS = {
  // API errors
  API_ERRORS: [
    { type: 'network_error', message: 'Failed to connect to AI service' },
    { type: 'timeout_error', message: 'Request timed out' },
    { type: 'rate_limit_error', message: 'API rate limit exceeded' },
    { type: 'invalid_request', message: 'Invalid request parameters' },
    { type: 'server_error', message: 'Internal server error' }
  ],
  
  // Voice processing errors
  VOICE_ERRORS: [
    { type: 'microphone_error', message: 'Unable to access microphone' },
    { type: 'audio_processing_error', message: 'Failed to process audio' },
    { type: 'transcription_error', message: 'Could not transcribe audio' },
    { type: 'synthesis_error', message: 'Text-to-speech conversion failed' }
  ],
  
  // Database errors
  DATABASE_ERRORS: [
    { type: 'connection_error', message: 'Database connection failed' },
    { type: 'query_error', message: 'Invalid query syntax' },
    { type: 'permission_error', message: 'Insufficient permissions' },
    { type: 'data_validation_error', message: 'Data validation failed' }
  ]
};

/**
 * Performance benchmarks for AI components
 */
export const AI_PERFORMANCE_BENCHMARKS = {
  // Component render times (milliseconds)
  RENDER_TIMES: {
    EMAIL_COMPOSER: 150,
    DATA_ANALYZER: 200,
    AUTOMATION_BUILDER: 250,
    STORY_CREATOR: 180,
    CHANGE_STRATEGY: 220
  },
  
  // AI response times (milliseconds)
  AI_RESPONSE_TIMES: {
    TEXT_GENERATION: 2000,
    DATA_ANALYSIS: 3000,
    WORKFLOW_CREATION: 1500,
    STORY_GENERATION: 2500,
    STRATEGY_DEVELOPMENT: 4000
  },
  
  // Memory usage (bytes)
  MEMORY_USAGE: {
    BASELINE: 10485760,  // 10MB
    EMAIL_COMPOSER: 5242880,   // 5MB
    DATA_ANALYZER: 15728640,   // 15MB
    AUTOMATION_BUILDER: 8388608,   // 8MB
    STORY_CREATOR: 7340032,   // 7MB
    CHANGE_STRATEGY: 12582912   // 12MB
  }
};

/**
 * Accessibility test configurations
 */
export const AI_ACCESSIBILITY_CONFIG = {
  // ARIA requirements
  REQUIRED_ARIA_ATTRIBUTES: [
    'aria-label',
    'aria-describedby',
    'aria-expanded',
    'aria-live',
    'role'
  ],
  
  // Keyboard navigation requirements
  KEYBOARD_NAVIGATION: {
    tab_order: true,
    escape_key: true,
    enter_key: true,
    arrow_keys: true
  },
  
  // Screen reader compatibility
  SCREEN_READER: {
    announcements: true,
    status_updates: true,
    error_messages: true,
    progress_indicators: true
  },
  
  // Visual accessibility
  VISUAL_ACCESSIBILITY: {
    color_contrast: 4.5,
    font_size: 16,
    focus_indicators: true,
    high_contrast_mode: true
  }
};

/**
 * Integration test configurations
 */
export const AI_INTEGRATION_CONFIG = {
  // External service integrations
  EXTERNAL_SERVICES: [
    'openai_api',
    'supabase_database',
    'voice_service',
    'analytics_service'
  ],
  
  // Data flow testing
  DATA_FLOWS: [
    'user_input -> ai_processing -> display_results',
    'voice_input -> transcription -> ai_response -> voice_output',
    'data_upload -> analysis -> insights -> export',
    'workflow_design -> validation -> deployment -> monitoring'
  ],
  
  // Cross-component interactions
  COMPONENT_INTERACTIONS: [
    'email_composer -> template_library',
    'data_analyzer -> visualization_engine',
    'automation_builder -> workflow_executor',
    'story_creator -> content_optimizer',
    'change_strategy -> stakeholder_manager'
  ]
};

export default {
  AI_TEST_CONFIG,
  AI_MOCK_RESPONSES,
  AI_TEST_SCENARIOS,
  AI_ERROR_SCENARIOS,
  AI_PERFORMANCE_BENCHMARKS,
  AI_ACCESSIBILITY_CONFIG,
  AI_INTEGRATION_CONFIG
};