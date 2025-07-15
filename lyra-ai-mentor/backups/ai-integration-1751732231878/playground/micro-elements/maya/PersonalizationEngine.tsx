import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Target,
  Calendar,
  Heart,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trophy,
  Clock,
  Variable,
  Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AIService } from '@/services/aiService';

interface PersonalizationField {
  id: string;
  name: string;
  placeholder: string;
  example: string;
  icon: React.ReactNode;
  category: 'basic' | 'behavior' | 'relationship';
}

const personalizationFields: PersonalizationField[] = [
  {
    id: 'name',
    name: 'First Name',
    placeholder: '{{firstName}}',
    example: 'Sarah',
    icon: <User className="w-4 h-4" />,
    category: 'basic'
  },
  {
    id: 'lastGift',
    name: 'Last Gift Amount',
    placeholder: '{{lastGiftAmount}}',
    example: '$50',
    icon: <Heart className="w-4 h-4" />,
    category: 'behavior'
  },
  {
    id: 'lastGiftDate',
    name: 'Last Gift Date',
    placeholder: '{{lastGiftDate}}',
    example: '3 months ago',
    icon: <Calendar className="w-4 h-4" />,
    category: 'behavior'
  },
  {
    id: 'location',
    name: 'City/Region',
    placeholder: '{{location}}',
    example: 'Portland',
    icon: <MapPin className="w-4 h-4" />,
    category: 'basic'
  },
  {
    id: 'impact',
    name: 'Personal Impact',
    placeholder: '{{personalImpact}}',
    example: 'helped feed 25 families',
    icon: <Target className="w-4 h-4" />,
    category: 'relationship'
  },
  {
    id: 'program',
    name: 'Favorite Program',
    placeholder: '{{favoriteProgram}}',
    example: 'Youth Mentorship',
    icon: <Database className="w-4 h-4" />,
    category: 'relationship'
  }
];

interface PersonalizationScenario {
  context: string;
  audience: string;
  goal: string;
  sampleData: {[key: string]: string};
}

const scenarios: PersonalizationScenario[] = [
  {
    context: 'Monthly donor appreciation email',
    audience: 'Regular monthly donors',
    goal: 'Strengthen donor relationship',
    sampleData: {
      firstName: 'Michael',
      lastGiftAmount: '$25',
      lastGiftDate: 'last month',
      location: 'Seattle',
      personalImpact: 'provided 100 meals',
      favoriteProgram: 'Food Security'
    }
  },
  {
    context: 'Lapsed donor re-engagement',
    audience: 'Donors who haven\'t given in 6+ months',
    goal: 'Inspire renewed support',
    sampleData: {
      firstName: 'Jennifer',
      lastGiftAmount: '$100',
      lastGiftDate: '8 months ago',
      location: 'Austin',
      personalImpact: 'helped 2 students get tutoring',
      favoriteProgram: 'Education Support'
    }
  },
  {
    context: 'Major donor cultivation',
    audience: 'High-value supporters',
    goal: 'Deepen engagement for major gift',
    sampleData: {
      firstName: 'Robert',
      lastGiftAmount: '$5,000',
      lastGiftDate: '2 months ago',
      location: 'San Francisco',
      personalImpact: 'funded an entire classroom renovation',
      favoriteProgram: 'Capital Projects'
    }
  }
];

const PersonalizationEngine: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedTemplates, setSavedTemplates] = useState<{template: string, fields: string[]}[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const scenario = scenarios[currentScenario];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateTemplate = async () => {
    setIsGenerating(true);
    try {
      const selectedFieldsList = Array.from(selectedFields);
      const response = await aiService.generateResponse({
        prompt: `Create a personalized email template for:
        Context: ${scenario.context}
        Goal: ${scenario.goal}
        
        Include these personalization fields: ${selectedFieldsList.map(f => {
          const field = personalizationFields.find(pf => pf.id === f);
          return `${field?.placeholder} (${field?.name})`;
        }).join(', ')}
        
        Make it warm, personal, and compelling. Keep it under 200 words.
        Use the exact placeholder format provided.`,
        context: "You are an expert at creating highly personalized nonprofit communications.",
        temperature: 0.8
      });

      setAiSuggestion(response.content);
    } catch (error) {
      console.error('Error generating template:', error);
      setAiSuggestion(`Dear {{firstName}},

I hope this message finds you well in {{location}}. I wanted to reach out personally to thank you for your incredible support.

Your last gift of {{lastGiftAmount}} {{lastGiftDate}} made such a difference - it {{personalImpact}}. Because of supporters like you, our {{favoriteProgram}} program continues to thrive.

[Your main message here - update on impact, new needs, or invitation to engage]

Thank you for being part of our community. Your continued support means the world to us and to those we serve.

With gratitude,
[Your name]`);
    }
    setIsGenerating(false);
  };

  const insertField = (fieldId: string) => {
    const field = personalizationFields.find(f => f.id === fieldId);
    if (field) {
      setEmailTemplate(prev => prev + ' ' + field.placeholder);
      setSelectedFields(prev => new Set(prev).add(fieldId));
    }
  };

  const getPersonalizedPreview = () => {
    let preview = emailTemplate;
    personalizationFields.forEach(field => {
      const value = scenario.sampleData[field.id] || field.example;
      preview = preview.replace(new RegExp(field.placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    });
    return preview;
  };

  const analyzePersonalization = () => {
    setShowAnalysis(true);
    
    let currentScore = 0;
    
    // Uses personalization fields
    const fieldCount = selectedFields.size;
    if (fieldCount >= 3) currentScore += 30;
    else if (fieldCount >= 2) currentScore += 20;
    else if (fieldCount >= 1) currentScore += 10;
    
    // Has greeting with name
    if (emailTemplate.includes('{{firstName}}') && emailTemplate.toLowerCase().includes('dear')) {
      currentScore += 20;
    }
    
    // References past behavior
    if (emailTemplate.includes('{{lastGift') || emailTemplate.includes('{{personalImpact}}')) {
      currentScore += 20;
    }
    
    // Location or program relevance
    if (emailTemplate.includes('{{location}}') || emailTemplate.includes('{{favoriteProgram}}')) {
      currentScore += 15;
    }
    
    // Appropriate length
    const wordCount = emailTemplate.split(' ').length;
    if (wordCount >= 50 && wordCount <= 200) currentScore += 15;
    
    setScore(currentScore);
    setProgress(((currentScenario + 1) / scenarios.length) * 100);
    
    if (currentScore >= 60) {
      setSavedTemplates(prev => [...prev, {
        template: emailTemplate,
        fields: Array.from(selectedFields)
      }]);
    }
  };

  const moveToNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setEmailTemplate('');
      setSelectedFields(new Set());
      setPreviewMode(false);
      setAiSuggestion('');
      setShowAnalysis(false);
      setScore(0);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <Variable className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Personalization Engine</h2>
              <p className="text-sm text-muted-foreground">Add dynamic personalization to emails</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Template {currentScenario + 1} / {scenarios.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAnalysis ? (
          <motion.div
            key="engine"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Email Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Type:</span>
                    <p className="text-sm text-muted-foreground">{scenario.context}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Audience:</span>
                    <p className="text-sm text-muted-foreground">{scenario.audience}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Goal:</span>
                    <p className="text-sm text-muted-foreground">{scenario.goal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Personalization Fields</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="preview-mode" className="text-sm">Preview</Label>
                    <Switch
                      id="preview-mode"
                      checked={previewMode}
                      onCheckedChange={setPreviewMode}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="relationship">Relationship</TabsTrigger>
                  </TabsList>

                  {['basic', 'behavior', 'relationship'].map((category) => (
                    <TabsContent key={category} value={category} className="space-y-2">
                      {personalizationFields
                        .filter(field => field.category === category)
                        .map((field) => (
                          <motion.button
                            key={field.id}
                            onClick={() => insertField(field.id)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              selectedFields.has(field.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {field.icon}
                                <span className="font-medium">{field.name}</span>
                              </div>
                              {selectedFields.has(field.id) && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {previewMode ? field.example : field.placeholder}
                            </p>
                          </motion.button>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Template</CardTitle>
                <CardDescription>
                  Click fields above to insert, or type your template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Start typing your email... Click personalization fields above to insert them."
                  value={previewMode ? getPersonalizedPreview() : emailTemplate}
                  onChange={(e) => !previewMode && setEmailTemplate(e.target.value)}
                  className="min-h-[200px] font-mono"
                  disabled={previewMode}
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{emailTemplate.split(' ').length} words</span>
                  <span>Fields used: {selectedFields.size}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateTemplate}
                    variant="outline"
                    disabled={selectedFields.size === 0 || isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Template
                  </Button>
                  <Button
                    onClick={analyzePersonalization}
                    disabled={emailTemplate.length < 50}
                    className="flex-1"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                </div>

                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>AI-Generated Template:</strong>
                        <p className="mt-2 whitespace-pre-wrap">{aiSuggestion}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => {
                            setEmailTemplate(aiSuggestion);
                            // Extract fields from AI suggestion
                            const newFields = new Set<string>();
                            personalizationFields.forEach(field => {
                              if (aiSuggestion.includes(field.placeholder)) {
                                newFields.add(field.id);
                              }
                            });
                            setSelectedFields(newFields);
                          }}
                        >
                          Use This Template
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> The best personalization goes beyond just names. 
                    Reference past actions, local relevance, and personal impact to create truly 
                    compelling messages.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personalization Analysis</CardTitle>
                <CardDescription>
                  How effective is your personalized template?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Preview with Sample Data:</p>
                  <p className="text-sm whitespace-pre-wrap">{getPersonalizedPreview()}</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${selectedFields.size >= 3 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Uses multiple personalization fields ({selectedFields.size} fields)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${emailTemplate.includes('{{firstName}}') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Personal greeting with name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${emailTemplate.includes('{{lastGift') || emailTemplate.includes('{{personalImpact}}') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">References past behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${emailTemplate.includes('{{location}}') || emailTemplate.includes('{{favoriteProgram}}') ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Location or program relevance</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">Fields Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedFields).map(fieldId => {
                      const field = personalizationFields.find(f => f.id === fieldId);
                      return (
                        <Badge key={fieldId} variant="secondary">
                          {field?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {score >= 60 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent personalization! This template will create strong connections with recipients.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      Good start! Try adding more personalization fields to increase relevance and engagement.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Template
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Engine
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Template Library</CardTitle>
              <CardDescription>Personalized templates ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedTemplates.map((template, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <p className="text-sm line-clamp-2">{template.template}</p>
                    <div className="flex gap-1 mt-2">
                      {template.fields.map(fieldId => {
                        const field = personalizationFields.find(f => f.id === fieldId);
                        return (
                          <Badge key={fieldId} variant="outline" className="text-xs">
                            {field?.placeholder}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PersonalizationEngine;