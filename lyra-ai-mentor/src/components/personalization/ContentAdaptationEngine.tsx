import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  Users, 
  ArrowRight, 
  Settings, 
  Brain,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIService } from '@/services/aiService';

// Types for content adaptation
interface ContentPath {
  id: string;
  purpose: 'fundraising' | 'programs' | 'operations' | 'marketing' | 'engagement' | 'stewardship';
  audience: 'donors' | 'volunteers' | 'staff' | 'board' | 'beneficiaries' | 'partners';
  goal: 'acquire' | 'retain' | 'upgrade' | 'engage' | 'inform' | 'thank';
  context: 'urgent' | 'routine' | 'celebration' | 'appeal' | 'update' | 'invitation';
  weight: number;
}

interface ContentVariation {
  id: string;
  pathId: string;
  template: string;
  tone: 'professional' | 'warm' | 'urgent' | 'celebratory' | 'informative' | 'personal';
  length: 'short' | 'medium' | 'long';
  personalizationFields: string[];
  examples: Record<string, string>;
  effectivenessScore: number;
}

interface AdaptationRule {
  id: string;
  trigger: string;
  action: 'switchTemplate' | 'adjustTone' | 'addPersonalization' | 'changeLength';
  parameters: Record<string, any>;
  priority: number;
}

interface ContentAdaptationEngineProps {
  onComplete?: (adaptedContent: ContentVariation) => void;
  initialPath?: ContentPath;
  enableRealTimeAdaptation?: boolean;
}

// Default content paths based on common nonprofit scenarios
const defaultContentPaths: ContentPath[] = [
  {
    id: 'donor-acquisition',
    purpose: 'fundraising',
    audience: 'donors',
    goal: 'acquire',
    context: 'appeal',
    weight: 1.0
  },
  {
    id: 'donor-retention',
    purpose: 'fundraising',
    audience: 'donors',
    goal: 'retain',
    context: 'routine',
    weight: 0.9
  },
  {
    id: 'volunteer-engagement',
    purpose: 'programs',
    audience: 'volunteers',
    goal: 'engage',
    context: 'invitation',
    weight: 0.8
  },
  {
    id: 'stewardship-thank-you',
    purpose: 'stewardship',
    audience: 'donors',
    goal: 'thank',
    context: 'celebration',
    weight: 0.95
  },
  {
    id: 'program-update',
    purpose: 'programs',
    audience: 'beneficiaries',
    goal: 'inform',
    context: 'update',
    weight: 0.7
  },
  {
    id: 'board-reporting',
    purpose: 'operations',
    audience: 'board',
    goal: 'inform',
    context: 'routine',
    weight: 0.85
  }
];

// Template library with path-specific content
const templateLibrary: ContentVariation[] = [
  {
    id: 'donor-acquisition-warm',
    pathId: 'donor-acquisition',
    template: `Dear {{firstName}},

I hope this message finds you well in {{location}}. I'm reaching out because I believe you care deeply about {{cause}}, and I'd love to share an exciting opportunity to make a difference.

At {{organizationName}}, we're working to {{mission}}. Right now, we have a specific need that I think would resonate with you: {{currentNeed}}.

Your support of {{giftAmount}} would directly {{impact}}. For example, {{specificExample}}.

Would you consider joining our community of changemakers? Every contribution, no matter the size, creates ripple effects of positive change.

With gratitude,
{{senderName}}`,
    tone: 'warm',
    length: 'medium',
    personalizationFields: ['firstName', 'location', 'cause', 'organizationName', 'mission', 'currentNeed', 'giftAmount', 'impact', 'specificExample', 'senderName'],
    examples: {
      firstName: 'Sarah',
      location: 'Portland',
      cause: 'education equity',
      organizationName: 'Future Leaders Academy',
      mission: 'ensure every child has access to quality education',
      currentNeed: 'funding for after-school tutoring programs',
      giftAmount: '$50',
      impact: 'provide 10 hours of one-on-one tutoring',
      specificExample: 'last month, Maria improved her math scores by 40% through our program',
      senderName: 'Jennifer Martinez, Development Director'
    },
    effectivenessScore: 85
  },
  {
    id: 'donor-retention-grateful',
    pathId: 'donor-retention',
    template: `Dear {{firstName}},

I'm writing to thank you for your continued support of {{organizationName}}. Your gift of {{lastGiftAmount}} {{lastGiftDate}} has made a real difference.

Because of supporters like you, we've been able to {{recentAccomplishment}}. Your contribution specifically {{personalImpact}}.

I wanted to share a quick update on {{favoriteProgram}}: {{programUpdate}}.

Looking ahead, we're excited about {{upcomingInitiative}}. I'll keep you updated on our progress.

Thank you for being part of our mission. Your partnership means everything to us.

Warmly,
{{senderName}}`,
    tone: 'warm',
    length: 'short',
    personalizationFields: ['firstName', 'organizationName', 'lastGiftAmount', 'lastGiftDate', 'recentAccomplishment', 'personalImpact', 'favoriteProgram', 'programUpdate', 'upcomingInitiative', 'senderName'],
    examples: {
      firstName: 'Michael',
      organizationName: 'Community Food Bank',
      lastGiftAmount: '$100',
      lastGiftDate: '3 months ago',
      recentAccomplishment: 'serve 500 more families per month',
      personalImpact: 'provided 200 meals to families in need',
      favoriteProgram: 'Weekend Backpack Program',
      programUpdate: 'we now serve 12 elementary schools',
      upcomingInitiative: 'launching a mobile food pantry',
      senderName: 'David Chen, Executive Director'
    },
    effectivenessScore: 90
  },
  {
    id: 'volunteer-engagement-inspiring',
    pathId: 'volunteer-engagement',
    template: `Hi {{firstName}},

I hope you're doing well! I'm excited to share a new volunteer opportunity that I think would be perfect for you.

Based on your interest in {{volunteerInterest}} and your skills in {{skills}}, we have an upcoming event that could really benefit from your expertise.

{{eventName}} is happening {{eventDate}} at {{eventLocation}}. We're looking for volunteers to help with {{volunteerRole}}. The time commitment is {{timeCommitment}}, and we'll provide {{support}}.

This is a great opportunity to {{benefit}} while {{impact}}.

Would you be interested in joining us? I'd love to hear from you by {{responseDeadline}}.

Thanks for all you do for our community!

Best,
{{senderName}}`,
    tone: 'warm',
    length: 'medium',
    personalizationFields: ['firstName', 'volunteerInterest', 'skills', 'eventName', 'eventDate', 'eventLocation', 'volunteerRole', 'timeCommitment', 'support', 'benefit', 'impact', 'responseDeadline', 'senderName'],
    examples: {
      firstName: 'Amanda',
      volunteerInterest: 'youth mentorship',
      skills: 'teaching and coaching',
      eventName: 'Summer Skills Camp',
      eventDate: 'July 15-19',
      eventLocation: 'Community Center',
      volunteerRole: 'lead workshop sessions',
      timeCommitment: '4 hours per day',
      support: 'training materials and snacks',
      benefit: 'develop leadership skills',
      impact: 'helping 30 teens build confidence',
      responseDeadline: 'June 1st',
      senderName: 'Lisa Chen, Volunteer Coordinator'
    },
    effectivenessScore: 88
  }
];

// Adaptation rules for dynamic content adjustment
const adaptationRules: AdaptationRule[] = [
  {
    id: 'high-value-donor',
    trigger: 'lastGiftAmount > 1000',
    action: 'adjustTone',
    parameters: { tone: 'professional', addPersonalization: ['lastGiftAmount', 'personalImpact'] },
    priority: 1
  },
  {
    id: 'new-donor',
    trigger: 'donorTenure < 1',
    action: 'switchTemplate',
    parameters: { templateType: 'acquisition', tone: 'warm' },
    priority: 2
  },
  {
    id: 'lapsed-donor',
    trigger: 'daysSinceLastGift > 180',
    action: 'addPersonalization',
    parameters: { fields: ['lastGiftDate', 'personalImpact'], tone: 'personal' },
    priority: 1
  },
  {
    id: 'urgent-campaign',
    trigger: 'context == urgent',
    action: 'adjustTone',
    parameters: { tone: 'urgent', length: 'short' },
    priority: 3
  }
];

export const ContentAdaptationEngine: React.FC<ContentAdaptationEngineProps> = ({
  onComplete,
  initialPath,
  enableRealTimeAdaptation = true
}) => {
  const [currentPath, setCurrentPath] = useState<ContentPath>(initialPath || defaultContentPaths[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentVariation | null>(null);
  const [adaptationHistory, setAdaptationHistory] = useState<string[]>([]);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationScore, setAdaptationScore] = useState(0);
  const [realTimeEnabled, setRealTimeEnabled] = useState(enableRealTimeAdaptation);
  const [userPreferences, setUserPreferences] = useState<Record<string, any>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, number>>({});

  const aiService = AIService.getInstance();

  // Get available templates for current path
  const availableTemplates = useMemo(() => {
    return templateLibrary.filter(template => template.pathId === currentPath.id);
  }, [currentPath.id]);

  // Calculate adaptation score based on current configuration
  const calculateAdaptationScore = useCallback(() => {
    if (!selectedTemplate) return 0;
    
    let score = selectedTemplate.effectivenessScore;
    
    // Adjust based on path relevance
    if (selectedTemplate.pathId === currentPath.id) {
      score += 10;
    }
    
    // Adjust based on personalization fields
    score += Math.min(selectedTemplate.personalizationFields.length * 2, 20);
    
    // Adjust based on adaptation rules applied
    score += adaptationHistory.length * 3;
    
    return Math.min(score, 100);
  }, [selectedTemplate, currentPath, adaptationHistory]);

  // Apply adaptation rules
  const applyAdaptationRules = useCallback(async (template: ContentVariation, userData: Record<string, any>) => {
    if (!realTimeEnabled) return template;
    
    setIsAdapting(true);
    let adaptedTemplate = { ...template };
    const newHistory = [...adaptationHistory];
    
    // Sort rules by priority
    const sortedRules = adaptationRules.sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      // Simple rule evaluation (in a real app, this would be more sophisticated)
      let shouldApply = false;
      
      if (rule.trigger.includes('lastGiftAmount')) {
        const amount = parseFloat(userData.lastGiftAmount?.replace('$', '').replace(',', '') || '0');
        if (rule.trigger.includes('> 1000') && amount > 1000) {
          shouldApply = true;
        }
      }
      
      if (rule.trigger.includes('context')) {
        if (rule.trigger.includes(currentPath.context)) {
          shouldApply = true;
        }
      }
      
      if (shouldApply) {
        switch (rule.action) {
          case 'adjustTone':
            adaptedTemplate.tone = rule.parameters.tone;
            newHistory.push(`Applied tone adjustment: ${rule.parameters.tone}`);
            break;
          case 'addPersonalization':
            adaptedTemplate.personalizationFields = [
              ...adaptedTemplate.personalizationFields,
              ...rule.parameters.fields
            ];
            newHistory.push(`Added personalization fields: ${rule.parameters.fields.join(', ')}`);
            break;
          case 'switchTemplate':
            // Find alternative template
            const alternativeTemplate = templateLibrary.find(t => 
              t.pathId === currentPath.id && t.tone === rule.parameters.tone
            );
            if (alternativeTemplate) {
              adaptedTemplate = { ...alternativeTemplate };
              newHistory.push(`Switched to ${rule.parameters.tone} template`);
            }
            break;
          case 'changeLength':
            adaptedTemplate.length = rule.parameters.length;
            newHistory.push(`Changed length to ${rule.parameters.length}`);
            break;
        }
      }
    }
    
    setAdaptationHistory(newHistory);
    setIsAdapting(false);
    return adaptedTemplate;
  }, [currentPath, adaptationHistory, realTimeEnabled]);

  // Generate context-aware examples
  const generateContextAwareExamples = useCallback(async (template: ContentVariation) => {
    try {
      const prompt = `Generate realistic examples for these personalization fields in a ${currentPath.purpose} context for ${currentPath.audience}:
      
      Fields: ${template.personalizationFields.join(', ')}
      Purpose: ${currentPath.purpose}
      Audience: ${currentPath.audience}
      Goal: ${currentPath.goal}
      Context: ${currentPath.context}
      
      Return a JSON object with field names as keys and realistic examples as values.`;
      
      const response = await aiService.generateResponse({
        prompt,
        context: "You are an expert in nonprofit communications and personalization.",
        temperature: 0.7
      });
      
      // Parse the response and update examples
      try {
        const newExamples = JSON.parse(response.content);
        return { ...template, examples: { ...template.examples, ...newExamples } };
      } catch (e) {
        console.warn('Failed to parse AI-generated examples, using defaults');
        return template;
      }
    } catch (error) {
      console.error('Error generating context-aware examples:', error);
      return template;
    }
  }, [currentPath, aiService]);

  // Initialize with first template
  useEffect(() => {
    if (availableTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(availableTemplates[0]);
    }
  }, [availableTemplates, selectedTemplate]);

  // Update adaptation score when relevant data changes
  useEffect(() => {
    setAdaptationScore(calculateAdaptationScore());
  }, [calculateAdaptationScore]);

  // Handle path change
  const handlePathChange = useCallback((newPath: ContentPath) => {
    setCurrentPath(newPath);
    setSelectedTemplate(null);
    setAdaptationHistory([]);
    setAdaptationScore(0);
  }, []);

  // Handle template selection
  const handleTemplateSelection = useCallback(async (template: ContentVariation) => {
    setSelectedTemplate(template);
    
    // Apply adaptation rules if enabled
    if (realTimeEnabled) {
      const adaptedTemplate = await applyAdaptationRules(template, template.examples);
      setSelectedTemplate(adaptedTemplate);
    }
    
    // Generate context-aware examples
    const enhancedTemplate = await generateContextAwareExamples(template);
    setSelectedTemplate(enhancedTemplate);
  }, [realTimeEnabled, applyAdaptationRules, generateContextAwareExamples]);

  // Handle completion
  const handleComplete = useCallback(() => {
    if (selectedTemplate && onComplete) {
      onComplete(selectedTemplate);
    }
  }, [selectedTemplate, onComplete]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Content Adaptation Engine</h1>
            <p className="text-muted-foreground">Dynamic, personalized content generation</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Adaptation Score: {adaptationScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>{templateLibrary.length} Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>{adaptationRules.length} Rules Active</span>
          </div>
        </div>
      </motion.div>

      {/* Real-time Adaptation Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Adaptation Settings</CardTitle>
              <CardDescription>Configure how content adapts to user preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="real-time-toggle">Real-time Adaptation</Label>
              <Switch
                id="real-time-toggle"
                checked={realTimeEnabled}
                onCheckedChange={setRealTimeEnabled}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Path Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Path</CardTitle>
          <CardDescription>Choose the type of content you want to create</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultContentPaths.map((path) => (
              <motion.button
                key={path.id}
                onClick={() => handlePathChange(path)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  currentPath.id === path.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-muted-foreground hover:bg-muted/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={currentPath.id === path.id ? 'default' : 'secondary'}>
                    {path.purpose}
                  </Badge>
                  {currentPath.id === path.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-sm font-medium mb-1">
                  {path.audience} • {path.goal}
                </p>
                <p className="text-xs text-muted-foreground">
                  {path.context} context
                </p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Templates</CardTitle>
          <CardDescription>Choose a template that matches your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableTemplates.map((template) => (
              <motion.div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-muted-foreground hover:bg-muted/50'
                }`}
                onClick={() => handleTemplateSelection(template)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{template.tone}</Badge>
                    <Badge variant="outline">{template.length}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.personalizationFields.length} fields
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {template.effectivenessScore}%
                    </span>
                    {selectedTemplate?.id === template.id && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.template.substring(0, 150)}...
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Preview and Adaptation */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Template Preview</CardTitle>
                <CardDescription>See how your content will look with sample data</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isAdapting && (
                  <div className="flex items-center gap-2 text-primary">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Adapting...</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelection(selectedTemplate)}
                  disabled={isAdapting}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Re-adapt
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm whitespace-pre-line">
                    {selectedTemplate.template.replace(/\{\{(\w+)\}\}/g, (match, field) => {
                      return selectedTemplate.examples[field] || match;
                    })}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Personalization Fields</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.personalizationFields.map((field) => (
                        <Badge key={field} variant="secondary">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Template Properties</h4>
                    <div className="space-y-1 text-sm">
                      <p>Tone: <span className="font-medium">{selectedTemplate.tone}</span></p>
                      <p>Length: <span className="font-medium">{selectedTemplate.length}</span></p>
                      <p>Effectiveness: <span className="font-medium">{selectedTemplate.effectivenessScore}%</span></p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="template" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono whitespace-pre-line">
                    {selectedTemplate.template}
                  </p>
                </div>
                
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    Personalization fields like <code>{'{firstName}'}</code> will be replaced with actual data when the template is used.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{adaptationScore}%</div>
                  <Progress value={adaptationScore} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">Overall Adaptation Score</p>
                </div>
                
                {adaptationHistory.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Adaptations Applied</h4>
                    {adaptationHistory.map((adaptation, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>{adaptation}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimization Tip:</strong> This template scores {adaptationScore}% effectiveness. 
                    {adaptationScore >= 80 ? ' Excellent personalization!' : ' Consider adding more personalization fields for better engagement.'}
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reset Engine
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!selectedTemplate}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
        >
          Use This Template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ContentAdaptationEngine;