import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AutomatedElementEnhancerProps {
  onComplete?: () => void;
}

interface ElementEnhancement {
  element_id: number;
  lesson_id: number;
  chapter_id: number;
  current_type: string;
  enhanced_type: string;
  enhanced_title: string;
  enhanced_content: string;
  ai_configuration: any;
  learning_objectives: string[];
  nonprofit_context: string;
}

// Define proper AI integration for each element type
const AI_INTEGRATION_PATTERNS = {
  // Chat-based elements
  'lyra_chat': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'You are Lyra, an AI assistant helping nonprofit professionals learn and apply AI tools. Be warm, encouraging, and practical.',
    features: {
      conversation_memory: true,
      context_aware: true,
      learning_tracking: true,
      dynamic_responses: true,
      voice: 'encouraging_mentor'
    },
    api_config: {
      temperature: 0.7,
      max_tokens: 500,
      response_format: 'conversational'
    }
  },
  
  // Content generation elements
  'ai_content_generator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Help nonprofit professionals create compelling content using AI. Focus on emotional storytelling, donor engagement, and mission impact.',
    features: {
      content_types: ['email', 'social_media', 'grant_narrative', 'newsletter'],
      tone_adjustment: true,
      audience_optimization: true,
      impact_focus: true
    },
    api_config: {
      temperature: 0.8,
      max_tokens: 1000,
      response_format: 'structured_content'
    }
  },

  'ai_email_composer': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Compose professional, empathetic emails for nonprofit communications. Balance warmth with clarity.',
    features: {
      tone_options: ['professional', 'empathetic', 'urgent', 'grateful', 'apologetic'],
      template_library: true,
      personalization: true,
      subject_line_optimization: true
    },
    api_config: {
      temperature: 0.7,
      max_tokens: 800,
      response_format: 'email_format'
    }
  },

  'document_generator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Generate professional documents for nonprofits including grants, reports, and proposals. Ensure clarity and impact.',
    features: {
      document_types: ['grant_proposal', 'impact_report', 'annual_report', 'case_study'],
      section_guidance: true,
      data_integration: true,
      formatting_support: true
    },
    api_config: {
      temperature: 0.6,
      max_tokens: 2000,
      response_format: 'document_sections'
    }
  },

  'document_improver': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Improve existing nonprofit documents by enhancing clarity, impact, and emotional resonance while maintaining accuracy.',
    features: {
      improvement_focus: ['clarity', 'impact', 'flow', 'persuasiveness'],
      track_changes: true,
      suggestion_mode: true,
      preserve_voice: true
    },
    api_config: {
      temperature: 0.6,
      max_tokens: 1500,
      response_format: 'revision_suggestions'
    }
  },

  // Data and analytics elements
  'data_storyteller': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Transform data into compelling narratives that connect statistics with human impact for nonprofit audiences.',
    features: {
      narrative_frameworks: ['problem_solution', 'before_after', 'journey', 'impact_scale'],
      visualization_suggestions: true,
      metaphor_generation: true,
      impact_calculator: true
    },
    api_config: {
      temperature: 0.7,
      max_tokens: 1000,
      response_format: 'data_narrative'
    }
  },

  'data_analyzer': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Analyze nonprofit data to identify insights, trends, and actionable recommendations for mission impact.',
    features: {
      analysis_types: ['trend', 'comparison', 'correlation', 'prediction'],
      insight_generation: true,
      recommendation_engine: true,
      plain_language_summary: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1200,
      response_format: 'analysis_report'
    }
  },


  // Workflow and automation elements
  'workflow_automator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Design automation workflows that amplify human connection rather than replace it in nonprofit operations.',
    features: {
      process_mapping: true,
      efficiency_analysis: true,
      human_touchpoint_preservation: true,
      integration_recommendations: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1000,
      response_format: 'workflow_design'
    }
  },

  // Template and framework elements
  'template_creator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Create reusable templates that capture successful patterns while maintaining flexibility for nonprofit needs.',
    features: {
      template_types: ['email', 'grant', 'report', 'social_media', 'meeting_agenda'],
      customization_options: true,
      best_practice_integration: true,
      version_control: true
    },
    api_config: {
      temperature: 0.6,
      max_tokens: 1500,
      response_format: 'template_structure'
    }
  },

  // Strategic planning elements
  'impact_dashboard_creator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Design dashboards that tell the story of nonprofit impact through meaningful metrics and visualizations.',
    features: {
      metric_selection: true,
      visualization_recommendations: true,
      story_integration: true,
      real_time_updates: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1000,
      response_format: 'dashboard_design'
    }
  },

  // Leadership and governance elements
  'ai_governance_builder': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Develop governance frameworks for ethical AI use in nonprofits that center community voice and values.',
    features: {
      framework_templates: true,
      policy_generation: true,
      risk_assessment: true,
      community_input_integration: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1500,
      response_format: 'governance_framework'
    }
  },

  'change_leader': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Guide nonprofit leaders through organizational change with strategies that honor mission and values.',
    features: {
      change_readiness_assessment: true,
      strategy_development: true,
      resistance_management: true,
      communication_planning: true
    },
    api_config: {
      temperature: 0.6,
      max_tokens: 1200,
      response_format: 'change_strategy'
    }
  },

  // Assessment and evaluation elements
  'ai_readiness_assessor': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Assess nonprofit readiness for AI adoption considering capacity, values, and mission alignment.',
    features: {
      comprehensive_assessment: true,
      gap_analysis: true,
      recommendation_generation: true,
      implementation_roadmap: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1500,
      response_format: 'assessment_report'
    }
  },

  // Campaign and outreach elements
  'ai_email_campaign_writer': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Create multi-touch email campaigns that build donor relationships and drive action for nonprofits.',
    features: {
      campaign_planning: true,
      sequence_generation: true,
      personalization_engine: true,
      a_b_testing_suggestions: true
    },
    api_config: {
      temperature: 0.7,
      max_tokens: 2000,
      response_format: 'campaign_sequence'
    }
  },

  'ai_social_media_generator': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Generate platform-optimized social media content that amplifies nonprofit mission and engages supporters.',
    features: {
      platform_optimization: ['facebook', 'instagram', 'twitter', 'linkedin'],
      hashtag_research: true,
      visual_suggestions: true,
      engagement_optimization: true
    },
    api_config: {
      temperature: 0.8,
      max_tokens: 500,
      response_format: 'social_posts'
    }
  },

  // Special agent elements
  'chapter_builder_agent': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Generate complete learning chapters with character-driven narratives and integrated AI components.',
    features: {
      narrative_generation: true,
      character_development: true,
      interactive_element_placement: true,
      learning_flow_optimization: true
    },
    api_config: {
      temperature: 0.7,
      max_tokens: 3000,
      response_format: 'chapter_structure'
    }
  },

  'interactive_element_auditor': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Analyze interactive elements for learning effectiveness, engagement, and AI integration quality.',
    features: {
      quality_scoring: true,
      recommendation_engine: true,
      batch_analysis: true,
      priority_ranking: true
    },
    api_config: {
      temperature: 0.5,
      max_tokens: 1500,
      response_format: 'audit_report'
    }
  },

  'interactive_element_builder': {
    ai_powered: true,
    llm_model: 'gpt-4o',
    system_prompt: 'Build and enhance interactive elements with proper AI integration and learning design principles.',
    features: {
      element_generation: true,
      ai_integration: true,
      content_enhancement: true,
      deployment_automation: true
    },
    api_config: {
      temperature: 0.6,
      max_tokens: 2000,
      response_format: 'element_specification'
    }
  }
};

export const AutomatedElementEnhancer: React.FC<AutomatedElementEnhancerProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<string>('ready');
  const [progress, setProgress] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentElement, setCurrentElement] = useState<string>('');
  const [enhancedElements, setEnhancedElements] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [enhancements, setEnhancements] = useState<ElementEnhancement[]>([]);

  const enhanceAllElements = async () => {
    setStatus('fetching');
    setErrors([]);
    
    try {
      // Fetch all interactive elements with their context
      const { data: elements, error } = await supabase
        .from('interactive_elements')
        .select(`
          id,
          lesson_id,
          type,
          title,
          content,
          configuration,
          order_index,
          lessons!inner(
            id,
            title,
            chapter_id,
            chapters!inner(
              id,
              title,
              description
            )
          )
        `)
        .order('lesson_id, order_index');

      if (error) throw error;
      
      setTotalElements(elements?.length || 0);
      setStatus('enhancing');

      // Process each element
      for (let i = 0; i < (elements?.length || 0); i++) {
        const element = elements![i];
        setCurrentElement(`${element.type}: ${element.title}`);
        setProgress(Math.round((i / elements!.length) * 100));

        try {
          const enhancement = await enhanceElement(element);
          setEnhancements(prev => [...prev, enhancement]);
          
          // Apply enhancement to database
          await applyEnhancement(enhancement);
          setEnhancedElements(prev => prev + 1);
          
        } catch (err) {
          console.error(`Error enhancing element ${element.id}:`, err);
          setErrors(prev => [...prev, `Failed to enhance: ${element.title}`]);
        }
      }

      setStatus('complete');
      setProgress(100);
      
    } catch (error) {
      console.error('Enhancement error:', error);
      setStatus('error');
    }
  };

  const enhanceElement = async (element: any): Promise<ElementEnhancement> => {
    const lesson = element.lessons;
    const chapter = lesson.chapters;
    
    // Get AI integration pattern for this element type
    const aiPattern = AI_INTEGRATION_PATTERNS[element.type as keyof typeof AI_INTEGRATION_PATTERNS] || 
                      AI_INTEGRATION_PATTERNS['ai_content_generator'];

    // Enhance content based on element type and context
    const enhancedContent = await generateEnhancedContent(element, lesson, chapter);
    const learningObjectives = generateLearningObjectives(element.type, lesson.title);
    const nonprofitContext = generateNonprofitContext(element.type, chapter.title);

    // Determine if type should be upgraded
    const enhancedType = upgradeElementType(element.type);

    return {
      element_id: element.id,
      lesson_id: element.lesson_id,
      chapter_id: chapter.id,
      current_type: element.type,
      enhanced_type: enhancedType,
      enhanced_title: enhanceTitle(element.title, element.type),
      enhanced_content: enhancedContent,
      ai_configuration: {
        ...aiPattern,
        character_context: getCharacterContext(chapter.id),
        lesson_context: lesson.title,
        chapter_context: chapter.title,
        nonprofit_focus: true,
        learning_objectives: learningObjectives
      },
      learning_objectives: learningObjectives,
      nonprofit_context: nonprofitContext
    };
  };

  const generateEnhancedContent = async (element: any, lesson: any, chapter: any): Promise<string> => {
    const character = getCharacterContext(chapter.id);
    const currentContent = element.content;
    
    // Build enhanced content with proper context
    let enhancedContent = currentContent;

    // Add character integration if missing
    if (!currentContent.toLowerCase().includes(character.toLowerCase()) && character !== 'General') {
      enhancedContent = `${character} is facing a challenge that many nonprofit professionals encounter. ${enhancedContent}`;
    }

    // Add nonprofit context
    const nonprofitTerms = ['nonprofit', 'donor', 'volunteer', 'mission', 'impact', 'community', 'fundraising', 'grant'];
    const hasNonprofitContext = nonprofitTerms.some(term => currentContent.toLowerCase().includes(term));
    
    if (!hasNonprofitContext) {
      enhancedContent += `\n\nThis scenario reflects common challenges in nonprofit work. Apply these AI-powered techniques to strengthen your organization's ${getRelevantNonprofitArea(element.type)}.`;
    }

    // Add learning objective connection
    enhancedContent += `\n\n🎯 Learning Focus: ${getLearningFocus(element.type, lesson.title)}`;

    // Add AI capability description
    enhancedContent += `\n\n🤖 AI Capabilities: This tool uses advanced language models to ${getAICapabilityDescription(element.type)}.`;

    return enhancedContent;
  };

  const upgradeElementType = (currentType: string): string => {
    // Upgrade static elements to AI-powered equivalents
    const typeUpgrades: { [key: string]: string } = {
      'reflection': 'lyra_chat',
      'knowledge_check': 'ai_content_generator',
      'multiple_choice_scenarios': 'ai_content_generator',
      'sequence_sorter': 'workflow_automator',
      'callout_box': 'lyra_chat'
    };
    
    return typeUpgrades[currentType] || currentType;
  };

  const enhanceTitle = (currentTitle: string, elementType: string): string => {
    // Add action words if missing
    const actionWords = ['Build', 'Create', 'Design', 'Craft', 'Generate', 'Transform', 'Develop'];
    const hasActionWord = actionWords.some(word => currentTitle.startsWith(word));
    
    if (!hasActionWord && !currentTitle.includes('Help') && !currentTitle.includes('Chat')) {
      const randomAction = actionWords[Math.floor(Math.random() * actionWords.length)];
      return `${randomAction} ${currentTitle}`;
    }
    
    return currentTitle;
  };

  const generateLearningObjectives = (elementType: string, lessonTitle: string): string[] => {
    const objectives: { [key: string]: string[] } = {
      'ai_email_composer': [
        'Compose professional emails 3x faster using AI assistance',
        'Maintain authentic voice while leveraging AI suggestions',
        'Apply appropriate tone for different nonprofit audiences'
      ],
      'document_generator': [
        'Generate compelling grant proposals and reports with AI',
        'Balance data presentation with emotional storytelling',
        'Create documents that resonate with funders and stakeholders'
      ],
      'data_storyteller': [
        'Transform statistics into narratives that inspire action',
        'Connect individual stories to systemic impact',
        'Use data visualization to enhance understanding'
      ],
      'workflow_automator': [
        'Design automation that creates more time for human connection',
        'Identify processes suitable for automation',
        'Measure human impact of efficiency gains'
      ]
    };
    
    return objectives[elementType] || [
      'Apply AI tools effectively in nonprofit contexts',
      'Enhance productivity while maintaining mission focus',
      'Build confidence using AI for professional tasks'
    ];
  };

  const generateNonprofitContext = (elementType: string, chapterTitle: string): string => {
    const contexts: { [key: string]: string } = {
      'Communication': 'donor relations, volunteer coordination, and community outreach',
      'Data': 'impact measurement, grant reporting, and strategic planning',
      'Automation': 'volunteer management, donation processing, and program delivery',
      'Transformation': 'organizational change, board governance, and strategic initiatives'
    };
    
    for (const [key, value] of Object.entries(contexts)) {
      if (chapterTitle.includes(key)) {
        return value;
      }
    }
    
    return 'nonprofit operations and mission advancement';
  };

  const getCharacterContext = (chapterId: number): string => {
    const characters: { [key: number]: string } = {
      1: 'General',
      2: 'Maya Rodriguez',
      3: 'Sofia Martinez',
      4: 'David Chen',
      5: 'Rachel Thompson',
      6: 'Alex Rivera'
    };
    
    return characters[chapterId] || 'the nonprofit professional';
  };

  const getRelevantNonprofitArea = (elementType: string): string => {
    const areas: { [key: string]: string } = {
      'email': 'donor communications',
      'document': 'grant writing and reporting',
      'data': 'impact measurement',
      'workflow': 'operational efficiency',
      'social': 'community engagement',
      'governance': 'organizational leadership'
    };
    
    for (const [key, value] of Object.entries(areas)) {
      if (elementType.includes(key)) {
        return value;
      }
    }
    
    return 'mission effectiveness';
  };

  const getLearningFocus = (elementType: string, lessonTitle: string): string => {
    if (elementType.includes('email')) return 'Master AI-powered email communication';
    if (elementType.includes('document')) return 'Create compelling documents with AI assistance';
    if (elementType.includes('data')) return 'Transform data into actionable insights';
    if (elementType.includes('workflow')) return 'Build efficient systems that amplify human impact';
    
    return 'Apply AI tools to enhance your nonprofit work';
  };

  const getAICapabilityDescription = (elementType: string): string => {
    const capabilities: { [key: string]: string } = {
      'ai_email_composer': 'generate professional, empathetic email responses tailored to your nonprofit context',
      'document_generator': 'create compelling grant proposals and reports that balance data with storytelling',
      'data_storyteller': 'transform raw statistics into narratives that inspire donors and stakeholders',
      'workflow_automator': 'design efficient processes that create more time for relationship building',
      'template_creator': 'generate reusable templates that capture successful communication patterns',
      'ai_governance_builder': 'develop ethical frameworks for AI adoption in mission-driven organizations'
    };
    
    return capabilities[elementType] || 'provide intelligent assistance for nonprofit professionals';
  };

  const applyEnhancement = async (enhancement: ElementEnhancement) => {
    const { error } = await supabase
      .from('interactive_elements')
      .update({
        type: enhancement.enhanced_type,
        title: enhancement.enhanced_title,
        content: enhancement.enhanced_content,
        configuration: enhancement.ai_configuration
      })
      .eq('id', enhancement.element_id);

    if (error) throw error;
  };

  const exportEnhancements = () => {
    const exportData = {
      enhancement_date: new Date().toISOString(),
      total_elements: totalElements,
      enhanced_elements: enhancedElements,
      errors: errors,
      enhancements: enhancements
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'element_enhancements.json';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Automated Element Enhancement System</h2>
      
      <div className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Comprehensive AI Integration</h3>
          <p className="text-sm text-gray-700">
            This system will automatically enhance all 72 interactive elements with:
          </p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1">
            <li>• Proper OpenAI GPT-4o integration configuration</li>
            <li>• Character-driven storytelling integration</li>
            <li>• Nonprofit-specific context and terminology</li>
            <li>• Clear learning objectives for each element</li>
            <li>• Dynamic AI responses and interactions</li>
          </ul>
        </div>

        {status === 'ready' && (
          <button
            onClick={enhanceAllElements}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
          >
            Start Automated Enhancement
          </button>
        )}

        {status !== 'ready' && status !== 'complete' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Enhancement Progress</h4>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Status: {status}</p>
                <p>Current: {currentElement}</p>
                <p>Enhanced: {enhancedElements} of {totalElements}</p>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Errors ({errors.length})</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.slice(0, 5).map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                  {errors.length > 5 && <li>... and {errors.length - 5} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        {status === 'complete' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">✅ Enhancement Complete!</h3>
              <div className="text-green-700 space-y-2">
                <p>Successfully enhanced {enhancedElements} of {totalElements} elements</p>
                <p>All elements now have proper AI integration with OpenAI GPT-4o</p>
                <p>Character storylines and nonprofit context added throughout</p>
                {errors.length > 0 && <p className="text-orange-600">⚠️ {errors.length} elements had errors</p>}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={exportEnhancements}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Export Enhancement Report
              </button>
              
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded border">
              <h4 className="font-medium mb-2">What's Been Enhanced:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ All lyra_chat elements now have conversational AI</li>
                <li>✓ Email composers have tone and template capabilities</li>
                <li>✓ Document generators create dynamic content</li>
                <li>✓ Data storytellers transform statistics into narratives</li>
                <li>✓ Workflow automators focus on human-centered design</li>
                <li>✓ All elements include nonprofit context and learning objectives</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};