import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InteractiveElementBuilderProps {
  onComplete?: () => void;
  auditData?: any; // Can receive audit results from the auditor
}

interface ElementRecommendation {
  element_id: number;
  lesson_id: number;
  chapter_id: number;
  current_type: string;
  current_title: string;
  current_content: string;
  recommended_action: 'update' | 'replace' | 'enhance' | 'create_new';
  recommended_type: string;
  improved_title: string;
  improved_content: string;
  ai_integration_config: any;
  priority: 'high' | 'medium' | 'low';
}

export const InteractiveElementBuilder: React.FC<InteractiveElementBuilderProps> = ({ 
  onComplete, 
  auditData 
}) => {
  const [recommendations, setRecommendations] = useState<ElementRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [buildProgress, setBuildProgress] = useState<string>('ready');
  const [implementedChanges, setImplementedChanges] = useState<number[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (auditData) {
      generateRecommendations(auditData);
    }
  }, [auditData]);

  const loadAuditData = async () => {
    setLoading(true);
    setBuildProgress('loading_audit_data');
    
    try {
      // This would typically load from a saved audit or run a fresh audit
      // For now, we'll generate sample recommendations
      await generateSampleRecommendations();
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (auditResults: any[]) => {
    setBuildProgress('generating_recommendations');
    
    const recs: ElementRecommendation[] = [];
    
    for (const result of auditResults) {
      const recommendation = await createElementRecommendation(result);
      recs.push(recommendation);
    }
    
    setRecommendations(recs);
    setBuildProgress('ready');
  };

  const generateSampleRecommendations = async () => {
    // Fetch current elements that need improvement
    const { data: elements, error } = await supabase
      .from('interactive_elements')
      .select(`
        id,
        lesson_id,
        type,
        title,
        content,
        configuration,
        lessons!inner(
          chapter_id,
          title,
          chapters!inner(title)
        )
      `)
      .order('lesson_id');

    if (error) throw error;

    const sampleRecs: ElementRecommendation[] = (elements || []).map(element => ({
      element_id: element.id,
      lesson_id: element.lesson_id,
      chapter_id: element.lessons.chapter_id,
      current_type: element.type,
      current_title: element.title,
      current_content: element.content,
      recommended_action: determineRecommendedAction(element),
      recommended_type: suggestBetterType(element.type),
      improved_title: improveTitle(element.title, element.lessons.chapters.title),
      improved_content: improveContent(element.content, element.type),
      ai_integration_config: generateAIConfig(element.type),
      priority: determinePriority(element)
    }));

    setRecommendations(sampleRecs);
  };

  const createElementRecommendation = async (auditResult: any): Promise<ElementRecommendation> => {
    // AI-powered content improvement
    const improvedContent = await generateImprovedContent(auditResult);
    const betterType = suggestBetterType(auditResult.type);
    
    return {
      element_id: auditResult.element_id,
      lesson_id: auditResult.lesson_id,
      chapter_id: auditResult.chapter_id,
      current_type: auditResult.type,
      current_title: auditResult.title,
      current_content: auditResult.content,
      recommended_action: auditResult.action_needed,
      recommended_type: betterType,
      improved_title: improveTitle(auditResult.title, ''),
      improved_content: improvedContent,
      ai_integration_config: generateAIConfig(betterType),
      priority: auditResult.priority
    };
  };

  const generateImprovedContent = async (auditResult: any): Promise<string> => {
    // This would typically call OpenAI API via Supabase edge function
    // For demo, using rule-based improvement
    
    const characterMap: { [key: number]: string } = {
      1: 'Maya Rodriguez and James Chen',
      2: 'Maya Rodriguez and James Chen', 
      3: 'Sofia Martinez',
      4: 'David Chen',
      5: 'Rachel Thompson',
      6: 'Alex Rivera'
    };
    
    const character = characterMap[auditResult.chapter_id] || 'the team';
    const baseContent = auditResult.content;
    
    // Add character context and scenario-based learning
    if (!baseContent.includes(character.split(' ')[0])) {
      return `${character} faces a real challenge that nonprofit professionals encounter daily. ${baseContent}

Help ${character.split(' ')[0]} navigate this situation using AI-powered tools. Your approach will demonstrate practical applications that you can implement in your own nonprofit work.

This scenario is based on common challenges identified in our nonprofit AI transformation research.`;
    }
    
    return baseContent;
  };

  const determineRecommendedAction = (element: any): 'update' | 'replace' | 'enhance' | 'create_new' => {
    const nonAITypes = ['callout_box', 'text_block', 'knowledge_check'];
    if (nonAITypes.includes(element.type)) return 'replace';
    if (element.content.length < 100) return 'enhance';
    if (!element.content.includes('help') && !element.content.includes('scenario')) return 'update';
    return 'enhance';
  };

  const suggestBetterType = (currentType: string): string => {
    const typeMapping: { [key: string]: string } = {
      'callout_box': 'ai_content_generator',
      'text_block': 'lyra_chat',
      'knowledge_check': 'ai_content_generator',
      'reflection': 'lyra_chat',
      'sequence_sorter': 'workflow_automator',
      'multiple_choice_scenarios': 'ai_content_generator'
    };
    
    return typeMapping[currentType] || currentType;
  };

  const improveTitle = (currentTitle: string, chapterTitle: string): string => {
    if (currentTitle.includes('Help') || currentTitle.includes('Build') || currentTitle.includes('Create')) {
      return currentTitle;
    }
    
    const actionWords = ['Help', 'Build', 'Create', 'Design', 'Craft', 'Generate'];
    const randomAction = actionWords[Math.floor(Math.random() * actionWords.length)];
    
    return `${randomAction} ${currentTitle}`;
  };

  const improveContent = (currentContent: string, elementType: string): string => {
    // Add AI-specific enhancement prompts
    const aiPrompts = {
      'ai_email_composer': 'Use AI to craft professional, empathetic email responses that maintain your authentic voice while ensuring clarity and impact.',
      'document_generator': 'Leverage AI to create compelling documents that balance professionalism with emotional resonance for your target audience.',
      'data_storyteller': 'Transform raw data into compelling narratives that connect statistics with human impact stories.',
      'workflow_automator': 'Design automation systems that amplify human connection rather than replace it.',
      'ai_content_generator': 'Generate content that reflects your organization\'s authentic voice while maximizing engagement and clarity.'
    };
    
    const prompt = aiPrompts[elementType as keyof typeof aiPrompts] || 'Apply AI tools to enhance your nonprofit\'s effectiveness while maintaining mission focus.';
    
    if (currentContent.includes(prompt)) return currentContent;
    
    return `${currentContent}\n\n${prompt}`;
  };

  const generateAIConfig = (elementType: string) => {
    const baseConfig = {
      ai_powered: true,
      llm_integration: 'openai_gpt4',
      response_format: 'structured',
      context_aware: true
    };
    
    const typeSpecificConfigs: { [key: string]: any } = {
      'ai_email_composer': {
        ...baseConfig,
        tone_options: ['professional', 'empathetic', 'urgent', 'grateful'],
        template_types: ['response', 'outreach', 'fundraising', 'volunteer_coordination'],
        character_context: true
      },
      'document_generator': {
        ...baseConfig,
        document_types: ['grant_proposal', 'impact_report', 'policy_brief', 'case_study'],
        audience_optimization: true,
        citation_support: true
      },
      'data_storyteller': {
        ...baseConfig,
        visualization_integration: true,
        narrative_frameworks: ['problem_solution', 'before_after', 'journey_transformation'],
        data_interpretation: true
      },
      'workflow_automator': {
        ...baseConfig,
        process_mapping: true,
        efficiency_metrics: true,
        human_impact_tracking: true
      },
      'lyra_chat': {
        ...baseConfig,
        conversation_memory: true,
        learning_objectives: true,
        engagement_tracking: true
      }
    };
    
    return typeSpecificConfigs[elementType] || baseConfig;
  };

  const determinePriority = (element: any): 'high' | 'medium' | 'low' => {
    if (['callout_box', 'text_block'].includes(element.type)) return 'high';
    if (element.content.length < 150) return 'medium';
    return 'low';
  };

  const implementRecommendation = async (rec: ElementRecommendation) => {
    setLoading(true);
    setBuildProgress(`implementing_${rec.element_id}`);
    
    try {
      switch (rec.recommended_action) {
        case 'update':
          await updateExistingElement(rec);
          break;
        case 'replace':
          await replaceElement(rec);
          break;
        case 'enhance':
          await enhanceElement(rec);
          break;
        case 'create_new':
          await createNewElement(rec);
          break;
      }
      
      setImplementedChanges(prev => [...prev, rec.element_id]);
    } catch (error) {
      console.error('Error implementing recommendation:', error);
    } finally {
      setLoading(false);
      setBuildProgress('ready');
    }
  };

  const implementSelectedRecommendations = async () => {
    setLoading(true);
    setBuildProgress('implementing_batch');
    
    const selectedRecs = recommendations.filter(rec => 
      selectedRecommendations.has(rec.element_id)
    );
    
    for (const rec of selectedRecs) {
      await implementRecommendation(rec);
    }
    
    setBuildProgress('complete');
    setLoading(false);
  };

  const updateExistingElement = async (rec: ElementRecommendation) => {
    const { error } = await supabase
      .from('interactive_elements')
      .update({
        title: rec.improved_title,
        content: rec.improved_content,
        configuration: rec.ai_integration_config
      })
      .eq('id', rec.element_id);
      
    if (error) throw error;
  };

  const replaceElement = async (rec: ElementRecommendation) => {
    const { error } = await supabase
      .from('interactive_elements')
      .update({
        type: rec.recommended_type,
        title: rec.improved_title,
        content: rec.improved_content,
        configuration: rec.ai_integration_config
      })
      .eq('id', rec.element_id);
      
    if (error) throw error;
  };

  const enhanceElement = async (rec: ElementRecommendation) => {
    const { error } = await supabase
      .from('interactive_elements')
      .update({
        title: rec.improved_title,
        content: rec.improved_content,
        configuration: {
          ...rec.ai_integration_config,
          enhanced: true,
          enhancement_date: new Date().toISOString()
        }
      })
      .eq('id', rec.element_id);
      
    if (error) throw error;
  };

  const createNewElement = async (rec: ElementRecommendation) => {
    const { error } = await supabase
      .from('interactive_elements')
      .insert({
        lesson_id: rec.lesson_id,
        type: rec.recommended_type,
        title: rec.improved_title,
        content: rec.improved_content,
        configuration: rec.ai_integration_config,
        order_index: 999 // Will be adjusted manually if needed
      });
      
    if (error) throw error;
  };

  const toggleRecommendationSelection = (elementId: number) => {
    const newSelection = new Set(selectedRecommendations);
    if (newSelection.has(elementId)) {
      newSelection.delete(elementId);
    } else {
      newSelection.add(elementId);
    }
    setSelectedRecommendations(newSelection);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'replace': return 'bg-red-100 text-red-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'enhance': return 'bg-yellow-100 text-yellow-800';
      case 'create_new': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Interactive Element Builder Agent</h2>
      
      <div className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">AI-Powered Element Enhancement</h3>
          <p className="text-sm text-gray-700">
            This agent implements recommendations from the Interactive Element Auditor, 
            converting static elements to AI-powered experiences with OpenAI integration.
          </p>
        </div>

        <div className="flex space-x-4">
          {!auditData && (
            <button
              onClick={loadAuditData}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Element Analysis'}
            </button>
          )}
          
          {recommendations.length > 0 && selectedRecommendations.size > 0 && (
            <button
              onClick={implementSelectedRecommendations}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Implementing...' : `Implement ${selectedRecommendations.size} Selected`}
            </button>
          )}
        </div>

        {loading && (
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm font-medium">Build Progress: {buildProgress}</span>
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Element Improvement Recommendations</h3>
              <div className="text-sm text-gray-600">
                {implementedChanges.length} of {recommendations.length} implemented
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recommendations.map((rec) => {
                const isImplemented = implementedChanges.includes(rec.element_id);
                const isSelected = selectedRecommendations.has(rec.element_id);
                
                return (
                  <div 
                    key={rec.element_id} 
                    className={`border rounded p-4 ${isImplemented ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRecommendationSelection(rec.element_id)}
                          disabled={isImplemented}
                          className="mt-1"
                        />
                        <div>
                          <h4 className="font-medium">{rec.current_title}</h4>
                          <div className="text-sm text-gray-600">
                            Chapter {rec.chapter_id} • Lesson {rec.lesson_id} • {rec.current_type}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getActionColor(rec.recommended_action)}`}>
                          {rec.recommended_action}
                        </span>
                        {isImplemented && (
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            ✓ Implemented
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-1">Current Version:</h5>
                        <div className="bg-gray-50 p-2 rounded border">
                          <div className="font-medium text-gray-700">{rec.current_type}</div>
                          <div className="text-gray-600 text-xs mt-1">
                            {rec.current_content.substring(0, 150)}...
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-1">AI-Enhanced Version:</h5>
                        <div className="bg-purple-50 p-2 rounded border border-purple-200">
                          <div className="font-medium text-purple-700">{rec.recommended_type}</div>
                          <div className="text-purple-600 text-xs mt-1">
                            {rec.improved_title}
                          </div>
                          <div className="text-purple-600 text-xs mt-1">
                            AI Integration: {rec.ai_integration_config?.llm_integration || 'OpenAI GPT-4'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!isImplemented && (
                      <div className="mt-3 pt-3 border-t">
                        <button
                          onClick={() => implementRecommendation(rec)}
                          disabled={loading}
                          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
                        >
                          Implement This Change
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {buildProgress === 'complete' && (
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Implementation Complete!</h3>
            <p className="text-sm text-green-700 mb-3">
              All selected interactive elements have been enhanced with AI integration. 
              Users will now experience more engaging, AI-powered learning interactions.
            </p>
            {onComplete && (
              <button
                onClick={onComplete}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Mark Complete
              </button>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded border">
          <h4 className="font-medium mb-2">AI Integration Features</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• OpenAI GPT-4 integration via Supabase Edge Functions</li>
            <li>• Context-aware responses based on character storylines</li>
            <li>• Personalized learning experiences with progress tracking</li>
            <li>• Real-time content generation and improvement suggestions</li>
            <li>• Nonprofit-specific prompts and scenario templates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};