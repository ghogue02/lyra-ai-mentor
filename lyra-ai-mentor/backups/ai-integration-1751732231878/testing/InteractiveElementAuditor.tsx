import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InteractiveElementAuditorProps {
  onComplete?: () => void;
}

interface ElementAnalysis {
  element_id: number;
  lesson_id: number;
  chapter_id: number;
  type: string;
  title: string;
  content: string;
  story_integration_score: number;
  learning_objective_alignment: number;
  ai_connectivity_status: string;
  engagement_potential: number;
  content_relevance_score: number;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  action_needed: 'update' | 'replace' | 'enhance' | 'keep';
}

export const InteractiveElementAuditor: React.FC<InteractiveElementAuditorProps> = ({ onComplete }) => {
  const [auditResults, setAuditResults] = useState<ElementAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('ready');
  const [auditSummary, setAuditSummary] = useState<any>(null);

  const runComprehensiveAudit = async () => {
    setLoading(true);
    setCurrentPhase('fetching_elements');
    
    try {
      // Fetch all interactive elements with lesson/chapter context
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
            subtitle,
            chapter_id,
            chapters!inner(
              id,
              title,
              description
            )
          )
        `)
        .order('lesson_id')
        .order('order_index');

      if (error) throw error;

      setCurrentPhase('analyzing_elements');
      
      const analyses: ElementAnalysis[] = [];
      
      for (const element of elements || []) {
        const analysis = await analyzeElement(element);
        analyses.push(analysis);
        
        // Update progress
        setAuditResults([...analyses]);
      }

      setCurrentPhase('generating_summary');
      const summary = generateAuditSummary(analyses);
      setAuditSummary(summary);
      
      setCurrentPhase('complete');

    } catch (error) {
      console.error('Audit error:', error);
      setCurrentPhase('error');
    } finally {
      setLoading(false);
    }
  };

  const analyzeElement = async (element: any): Promise<ElementAnalysis> => {
    const lesson = element.lessons;
    const chapter = lesson.chapters;
    
    // AI-powered analysis of the element
    const prompt = `
    Analyze this interactive element for a nonprofit AI learning platform:
    
    CONTEXT:
    Chapter: ${chapter.title} - ${chapter.description}
    Lesson: ${lesson.title} - ${lesson.subtitle}
    
    ELEMENT:
    Type: ${element.type}
    Title: ${element.title}
    Content: ${element.content}
    Configuration: ${JSON.stringify(element.configuration)}
    
    EVALUATE:
    1. Story Integration (0-10): How well does this element integrate with the character-driven narrative?
    2. Learning Objective Alignment (0-10): How effectively does this support the lesson's learning goals?
    3. AI Connectivity Status: Is this properly connected to AI/LLM functionality?
    4. Engagement Potential (0-10): How engaging and interactive is this for users?
    5. Content Relevance (0-10): How relevant is the content to nonprofit professionals?
    
    PROVIDE:
    - Specific recommendations for improvement
    - Priority level (high/medium/low) 
    - Action needed (update/replace/enhance/keep)
    
    Respond in JSON format with numerical scores and string arrays for recommendations.
    `;

    // For demo purposes, using rule-based analysis
    // In production, this would call OpenAI API
    const analysis = analyzeElementRuleBased(element, lesson, chapter);
    
    return analysis;
  };

  const analyzeElementRuleBased = (element: any, lesson: any, chapter: any): ElementAnalysis => {
    const characterNames = ['Maya', 'James', 'Sofia', 'David', 'Rachel', 'Alex'];
    const aiTypes = [
      'ai_email_composer', 'document_generator', 'ai_content_generator',
      'data_storyteller', 'workflow_automator', 'ai_governance_builder',
      'chapter_builder_agent', 'content_audit_agent'
    ];
    
    // Story integration analysis
    const hasCharacterReference = characterNames.some(name => 
      element.content.toLowerCase().includes(name.toLowerCase())
    );
    const hasNarrativeStructure = element.content.length > 100 && 
      (element.content.includes('story') || element.content.includes('journey'));
    const storyIntegrationScore = (hasCharacterReference ? 5 : 0) + 
                                  (hasNarrativeStructure ? 4 : 2) + 
                                  (element.content.includes('help') ? 1 : 0);

    // Learning objective alignment
    const hasLearningContext = element.content.includes('learn') || 
                               element.content.includes('practice') ||
                               element.content.includes('apply');
    const hasNonprofitContext = element.content.toLowerCase().includes('nonprofit') ||
                                element.content.toLowerCase().includes('donor') ||
                                element.content.toLowerCase().includes('volunteer');
    const learningAlignment = (hasLearningContext ? 5 : 2) + 
                              (hasNonprofitContext ? 4 : 1) + 
                              (element.title.includes('Help') ? 1 : 0);

    // AI connectivity status
    const isAIType = aiTypes.includes(element.type);
    const aiConnectivity = isAIType ? 'connected' : 'needs_integration';

    // Engagement potential
    const isInteractive = element.type !== 'callout_box' && element.type !== 'text_block';
    const hasScenario = element.content.includes('scenario') || 
                        element.content.includes('situation');
    const engagementScore = (isInteractive ? 5 : 1) + 
                            (hasScenario ? 3 : 0) + 
                            (element.content.length > 200 ? 2 : 0);

    // Content relevance
    const nonprofitTerms = ['nonprofit', 'donor', 'volunteer', 'mission', 'impact', 'community'];
    const relevantTerms = nonprofitTerms.filter(term => 
      element.content.toLowerCase().includes(term)
    ).length;
    const contentRelevance = Math.min(10, relevantTerms * 2 + (hasNonprofitContext ? 3 : 0));

    // Generate recommendations
    const recommendations: string[] = [];
    let priority: 'high' | 'medium' | 'low' = 'low';
    let actionNeeded: 'update' | 'replace' | 'enhance' | 'keep' = 'keep';

    if (storyIntegrationScore < 5) {
      recommendations.push('Integrate character storyline references for better narrative flow');
      priority = 'high';
      actionNeeded = 'update';
    }

    if (learningAlignment < 6) {
      recommendations.push('Strengthen connection to lesson learning objectives');
      if (priority !== 'high') priority = 'medium';
      if (actionNeeded === 'keep') actionNeeded = 'enhance';
    }

    if (aiConnectivity === 'needs_integration') {
      recommendations.push('Convert to AI-powered interactive component with LLM integration');
      priority = 'high';
      actionNeeded = 'replace';
    }

    if (engagementScore < 5) {
      recommendations.push('Increase interactivity and scenario-based learning');
      if (priority === 'low') priority = 'medium';
      if (actionNeeded === 'keep') actionNeeded = 'enhance';
    }

    if (contentRelevance < 6) {
      recommendations.push('Add more nonprofit-specific context and terminology');
      if (priority === 'low') priority = 'medium';
      if (actionNeeded === 'keep') actionNeeded = 'update';
    }

    if (recommendations.length === 0) {
      recommendations.push('Element meets quality standards - consider minor enhancements');
    }

    return {
      element_id: element.id,
      lesson_id: element.lesson_id,
      chapter_id: lesson.chapter_id,
      type: element.type,
      title: element.title,
      content: element.content,
      story_integration_score: storyIntegrationScore,
      learning_objective_alignment: learningAlignment,
      ai_connectivity_status: aiConnectivity,
      engagement_potential: engagementScore,
      content_relevance_score: contentRelevance,
      recommendations,
      priority,
      action_needed: actionNeeded
    };
  };

  const generateAuditSummary = (analyses: ElementAnalysis[]) => {
    const totalElements = analyses.length;
    const highPriority = analyses.filter(a => a.priority === 'high').length;
    const needsReplacement = analyses.filter(a => a.action_needed === 'replace').length;
    const aiConnected = analyses.filter(a => a.ai_connectivity_status === 'connected').length;
    
    const avgScores = {
      storyIntegration: analyses.reduce((sum, a) => sum + a.story_integration_score, 0) / totalElements,
      learningAlignment: analyses.reduce((sum, a) => sum + a.learning_objective_alignment, 0) / totalElements,
      engagement: analyses.reduce((sum, a) => sum + a.engagement_potential, 0) / totalElements,
      contentRelevance: analyses.reduce((sum, a) => sum + a.content_relevance_score, 0) / totalElements
    };

    return {
      totalElements,
      highPriority,
      needsReplacement,
      aiConnected,
      aiConnectedPercentage: Math.round((aiConnected / totalElements) * 100),
      avgScores,
      topRecommendations: [
        'Integrate more character storyline references',
        'Convert static elements to AI-powered interactions',
        'Strengthen nonprofit context and terminology',
        'Add scenario-based learning opportunities'
      ]
    };
  };

  const exportRecommendations = () => {
    const exportData = {
      audit_date: new Date().toISOString(),
      summary: auditSummary,
      detailed_analysis: auditResults
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interactive_elements_audit.json';
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Interactive Element Auditor</h2>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Audit Overview</h3>
          <p className="text-sm text-gray-700">
            This agent analyzes all interactive elements across chapters 1-6, evaluating story integration, 
            learning alignment, AI connectivity, engagement potential, and content relevance.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={runComprehensiveAudit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Audit...' : 'Start Comprehensive Audit'}
          </button>
          
          {auditResults.length > 0 && (
            <button
              onClick={exportRecommendations}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              Export Recommendations
            </button>
          )}
        </div>

        {loading && (
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Current Phase: {currentPhase}</span>
            </div>
            <div className="text-sm text-gray-600">
              Analyzed {auditResults.length} elements...
            </div>
          </div>
        )}

        {auditSummary && (
          <div className="bg-gray-50 p-6 rounded border">
            <h3 className="font-semibold mb-4">Audit Summary</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-blue-600">{auditSummary.totalElements}</div>
                <div className="text-sm text-gray-600">Total Elements</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-red-600">{auditSummary.highPriority}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-orange-600">{auditSummary.needsReplacement}</div>
                <div className="text-sm text-gray-600">Need Replacement</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-2xl font-bold text-green-600">{auditSummary.aiConnectedPercentage}%</div>
                <div className="text-sm text-gray-600">AI Connected</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Average Scores</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Story Integration:</span>
                    <span className={getScoreColor(auditSummary.avgScores.storyIntegration)}>
                      {auditSummary.avgScores.storyIntegration.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Alignment:</span>
                    <span className={getScoreColor(auditSummary.avgScores.learningAlignment)}>
                      {auditSummary.avgScores.learningAlignment.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement:</span>
                    <span className={getScoreColor(auditSummary.avgScores.engagement)}>
                      {auditSummary.avgScores.engagement.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Relevance:</span>
                    <span className={getScoreColor(auditSummary.avgScores.contentRelevance)}>
                      {auditSummary.avgScores.contentRelevance.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Top Recommendations</h4>
                <ul className="text-sm space-y-1">
                  {auditSummary.topRecommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {auditResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Detailed Analysis</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {auditResults.map((analysis) => (
                <div key={analysis.element_id} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{analysis.title}</h4>
                      <div className="text-sm text-gray-600">
                        Chapter {analysis.chapter_id} • Lesson {analysis.lesson_id} • {analysis.type}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(analysis.priority)}`}>
                        {analysis.priority}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {analysis.action_needed}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 text-xs mb-3">
                    <div className="text-center">
                      <div className={`font-bold ${getScoreColor(analysis.story_integration_score)}`}>
                        {analysis.story_integration_score}
                      </div>
                      <div className="text-gray-600">Story</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${getScoreColor(analysis.learning_objective_alignment)}`}>
                        {analysis.learning_objective_alignment}
                      </div>
                      <div className="text-gray-600">Learning</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${analysis.ai_connectivity_status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.ai_connectivity_status === 'connected' ? '✓' : '✗'}
                      </div>
                      <div className="text-gray-600">AI</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${getScoreColor(analysis.engagement_potential)}`}>
                        {analysis.engagement_potential}
                      </div>
                      <div className="text-gray-600">Engage</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${getScoreColor(analysis.content_relevance_score)}`}>
                        {analysis.content_relevance_score}
                      </div>
                      <div className="text-gray-600">Relevant</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPhase === 'complete' && (
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Audit Complete!</h3>
            <p className="text-sm text-green-700 mb-3">
              Analysis finished. Use the Interactive Element Builder Agent to implement these recommendations.
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
      </div>
    </div>
  );
};