/**
 * RULES ENGINE CONFIGURATOR
 * Interactive Q&A system for capturing Greg's preferences
 * 
 * This component walks through all the decision points needed
 * to build the perfect lesson generation rules engine.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RulesEngineManager, type RulesEngineConfig } from '@/config/rulesEngine';

interface ConfigurationQuestion {
  id: string;
  category: keyof RulesEngineConfig;
  subcategory?: string;
  question: string;
  description?: string;
  type: 'single-choice' | 'multiple-choice' | 'scale' | 'text' | 'boolean';
  options?: Array<{
    value: string;
    label: string;
    description?: string;
    preview?: React.ReactNode;
  }>;
  validation?: (value: any) => boolean;
  dependencies?: string[]; // IDs of questions that must be answered first
}

// COMPREHENSIVE QUESTION SET
const CONFIGURATION_QUESTIONS: ConfigurationQuestion[] = [
  // === CHARACTER DEVELOPMENT ===
  {
    id: 'character-sofia-personality',
    category: 'characters',
    subcategory: 'Sofia',
    question: 'How should Sofia Chen (Voice/Audio Expert) communicate?',
    description: 'Sofia helps users discover AI voice tools and audio processing',
    type: 'single-choice',
    options: [
      {
        value: 'technical-enthusiast',
        label: 'Technical Enthusiast',
        description: 'Excited about technology, uses audio/voice metaphors, loves showing cool features'
      },
      {
        value: 'creative-collaborator', 
        label: 'Creative Collaborator',
        description: 'Artistic approach, focuses on creative possibilities, storytelling through voice'
      },
      {
        value: 'accessibility-advocate',
        label: 'Accessibility Advocate', 
        description: 'Emphasizes inclusive design, voice as tool for reaching more people'
      },
      {
        value: 'efficiency-expert',
        label: 'Efficiency Expert',
        description: 'Practical focus on saving time, streamlining communications through voice'
      }
    ]
  },

  {
    id: 'character-david-approach',
    category: 'characters',
    subcategory: 'David',
    question: 'How should David Kim (Data Analysis Expert) teach data concepts?',
    description: 'David helps non-profits understand and use data for decision making',
    type: 'single-choice',
    options: [
      {
        value: 'story-driven-data',
        label: 'Story-Driven Data',
        description: 'Every chart tells a story, data reveals human impact, narrative approach'
      },
      {
        value: 'simple-practical',
        label: 'Simple & Practical',
        description: 'Focus on actionable insights, avoid complex statistics, immediate utility'
      },
      {
        value: 'visual-intuitive',
        label: 'Visual & Intuitive', 
        description: 'Heavy use of charts/graphs, visual pattern recognition, "show don\'t tell"'
      },
      {
        value: 'detective-mystery',
        label: 'Detective/Mystery',
        description: 'Data as clues to solve puzzles, investigation approach, discovery journey'
      }
    ]
  },

  {
    id: 'character-rachel-style',
    category: 'characters', 
    subcategory: 'Rachel',
    question: 'How should Rachel Thompson (Automation Builder) approach workflow automation?',
    description: 'Rachel teaches non-profits to automate repetitive tasks and build systems',
    type: 'single-choice',
    options: [
      {
        value: 'step-by-step-builder',
        label: 'Step-by-Step Builder',
        description: 'Methodical approach, breaking complex automation into simple steps'
      },
      {
        value: 'time-saving-hero',
        label: 'Time-Saving Hero',
        description: 'Focus on freeing up time for mission work, efficiency as superpower'
      },
      {
        value: 'systems-thinker',
        label: 'Systems Thinker',
        description: 'Big picture view, how automations connect, organizational transformation'
      },
      {
        value: 'hands-on-experimenter',
        label: 'Hands-On Experimenter',
        description: 'Learn by doing, trial and error approach, iterative improvement'
      }
    ]
  },

  {
    id: 'character-alex-leadership',
    category: 'characters',
    subcategory: 'Alex', 
    question: 'How should Alex Rivera (Change Management Leader) handle organizational change?',
    description: 'Alex helps organizations adopt AI tools and manage technology transitions',
    type: 'single-choice',
    options: [
      {
        value: 'empathetic-guide',
        label: 'Empathetic Guide',
        description: 'Understanding resistance, addressing fears, gentle transformation'
      },
      {
        value: 'strategic-planner',
        label: 'Strategic Planner', 
        description: 'Structured approach, roadmaps, measurable milestones'
      },
      {
        value: 'culture-catalyst',
        label: 'Culture Catalyst',
        description: 'Focus on mindset shifts, building AI-positive culture, team dynamics'
      },
      {
        value: 'practical-implementer',
        label: 'Practical Implementer',
        description: 'Focus on concrete actions, quick wins, immediate benefits'
      }
    ]
  },

  // === NARRATIVE STYLE ===
  {
    id: 'narrative-conflict-style',
    category: 'contentGeneration',
    subcategory: 'narrativeStyle',
    question: 'How should characters face challenges in their stories?',
    description: 'The type of conflict/challenge that drives learning',
    type: 'single-choice',
    options: [
      {
        value: 'personal-struggle',
        label: 'Personal Struggle',
        description: 'Character faces internal doubts, skill gaps, confidence issues'
      },
      {
        value: 'external-pressure',
        label: 'External Pressure', 
        description: 'Time constraints, demanding situations, high-stakes scenarios'
      },
      {
        value: 'system-breakdown',
        label: 'System Breakdown',
        description: 'Current methods failing, need for new approaches, crisis-driven change'
      },
      {
        value: 'opportunity-discovery',
        label: 'Opportunity Discovery',
        description: 'Realizing potential, seeing possibilities, growth-oriented challenges'
      }
    ]
  },

  {
    id: 'emotional-journey-intensity',
    category: 'contentGeneration',
    subcategory: 'narrativeStyle',
    question: 'How intense should the emotional journey be?',
    description: 'The emotional range from struggle to success',
    type: 'scale',
    options: [
      { value: '1', label: 'Gentle', description: 'Mild concern → quiet satisfaction' },
      { value: '2', label: 'Moderate', description: 'Noticeable frustration → clear relief' },
      { value: '3', label: 'Engaging', description: 'Real struggle → genuine celebration' },
      { value: '4', label: 'Dramatic', description: 'Significant challenge → triumphant breakthrough' },
      { value: '5', label: 'Intense', description: 'Crisis level → transformational victory' }
    ]
  },

  // === INTERACTION DESIGN ===
  {
    id: 'user-choice-complexity',
    category: 'contentGeneration',
    subcategory: 'interactionRules',
    question: 'How complex should user decision points be?',
    description: 'The cognitive load when users make choices',
    type: 'single-choice',
    options: [
      {
        value: 'simple-binary',
        label: 'Simple Binary',
        description: 'Yes/No, This/That - clear right/wrong answers'
      },
      {
        value: 'guided-multiple',
        label: 'Guided Multiple Choice',
        description: '3-4 options with clear guidance on best choice'
      },
      {
        value: 'nuanced-decisions',
        label: 'Nuanced Decisions',
        description: 'Multiple valid approaches, each with trade-offs'
      },
      {
        value: 'open-exploration',
        label: 'Open Exploration',
        description: 'Freestyle input, multiple paths to success'
      }
    ]
  },

  {
    id: 'error-handling-philosophy',
    category: 'contentGeneration',
    subcategory: 'interactionRules',
    question: 'When users make mistakes, what should happen?',
    description: 'The approach to incorrect answers or suboptimal choices',
    type: 'single-choice',
    options: [
      {
        value: 'gentle-redirect',
        label: 'Gentle Redirect',
        description: '"Not quite! Let me help you think through this..." with hints'
      },
      {
        value: 'learning-opportunity',
        label: 'Learning Opportunity',
        description: '"Interesting choice! Here\'s what would happen..." then show better way'
      },
      {
        value: 'natural-consequences',
        label: 'Natural Consequences',
        description: 'Show realistic outcome, then ask "What would you do differently?"'
      },
      {
        value: 'no-wrong-answers',
        label: 'No Wrong Answers',
        description: 'All choices lead to valuable learning, just different paths'
      }
    ]
  },

  // === AI GENERATION STYLE ===
  {
    id: 'ai-content-personality',
    category: 'contentGeneration',
    subcategory: 'aiGenerationRules',
    question: 'What personality should AI-generated content have?',
    description: 'The voice and tone for all generated examples, emails, etc.',
    type: 'single-choice',
    options: [
      {
        value: 'warm-professional',
        label: 'Warm Professional',
        description: 'Friendly but competent, approachable expertise'
      },
      {
        value: 'enthusiastic-helpful',
        label: 'Enthusiastic Helpful',
        description: 'Excited to help, positive energy, encouraging tone'
      },
      {
        value: 'calm-confident',
        label: 'Calm Confident',
        description: 'Steady assurance, quiet expertise, reliable guidance'
      },
      {
        value: 'collaborative-supportive',
        label: 'Collaborative Supportive',
        description: '"We\'re in this together" approach, team feeling'
      }
    ]
  },

  {
    id: 'ai-example-realism',
    category: 'contentGeneration', 
    subcategory: 'aiGenerationRules',
    question: 'How realistic should AI-generated examples be?',
    description: 'The level of authenticity in scenarios and examples',
    type: 'single-choice',
    options: [
      {
        value: 'hyperrealistic',
        label: 'Hyper-Realistic',
        description: 'Actual nonprofit challenges, messy real-world details'
      },
      {
        value: 'realistic-simplified',
        label: 'Realistic but Simplified',
        description: 'True to life but streamlined for learning'
      },
      {
        value: 'idealized-examples',
        label: 'Idealized Examples', 
        description: 'Best-case scenarios that inspire and motivate'
      },
      {
        value: 'mixed-approach',
        label: 'Mixed Approach',
        description: 'Some challenges realistic, some aspirational'
      }
    ]
  },

  // === VISUAL DESIGN ===
  {
    id: 'visual-consistency-level',
    category: 'designSystem',
    subcategory: 'visualIdentity',
    question: 'How consistent should visual design be across characters?',
    description: 'Balance between character uniqueness and brand consistency',
    type: 'single-choice',
    options: [
      {
        value: 'unified-brand',
        label: 'Unified Brand',
        description: 'Same layout, colors, only content changes'
      },
      {
        value: 'character-themes',
        label: 'Character Themes',
        description: 'Each character has color palette, but same overall structure'
      },
      {
        value: 'personality-expression',
        label: 'Personality Expression',
        description: 'Layout adapts to character - Maya warm curves, David clean lines'
      },
      {
        value: 'unique-experiences',
        label: 'Unique Experiences', 
        description: 'Each character lesson feels completely different'
      }
    ]
  },

  {
    id: 'animation-preference',
    category: 'designSystem',
    subcategory: 'visualIdentity',
    question: 'How much animation should enhance the experience?',
    description: 'Motion and transitions throughout lessons',
    type: 'single-choice',
    options: [
      {
        value: 'minimal-functional',
        label: 'Minimal & Functional',
        description: 'Only when needed for usability, focus on content'
      },
      {
        value: 'polished-professional',
        label: 'Polished Professional',
        description: 'Smooth transitions, subtle enhancement, feels premium'
      },
      {
        value: 'engaging-dynamic',
        label: 'Engaging & Dynamic',
        description: 'Attention-grabbing, celebratory, high energy'
      },
      {
        value: 'character-specific',
        label: 'Character-Specific',
        description: 'Animation style matches character personality'
      }
    ]
  },

  // === DIFFICULTY & PROGRESSION ===
  {
    id: 'difficulty-assumption',
    category: 'contentGeneration',
    subcategory: 'progressionRules',
    question: 'What should we assume about users\' AI knowledge?',
    description: 'Starting point for all lessons',
    type: 'single-choice',
    options: [
      {
        value: 'complete-beginner',
        label: 'Complete Beginner',
        description: 'Never used AI tools, might be intimidated by technology'
      },
      {
        value: 'curious-novice', 
        label: 'Curious Novice',
        description: 'Heard of ChatGPT, maybe tried it once, wants to learn'
      },
      {
        value: 'basic-familiarity',
        label: 'Basic Familiarity',
        description: 'Uses AI occasionally, understands basics, wants to improve'
      },
      {
        value: 'mixed-levels',
        label: 'Mixed Levels',
        description: 'Adapt based on user responses and progress'
      }
    ]
  },

  {
    id: 'mastery-definition',
    category: 'contentGeneration',
    subcategory: 'progressionRules', 
    question: 'How do we know when someone has "mastered" a skill?',
    description: 'Success criteria for lesson completion',
    type: 'multiple-choice',
    options: [
      { value: 'demonstrates-skill', label: 'Successfully demonstrates the skill' },
      { value: 'explains-concept', label: 'Can explain the concept to someone else' },
      { value: 'applies-variation', label: 'Applies skill to a new variation' },
      { value: 'saves-reference', label: 'Saves useful reference to toolkit' },
      { value: 'confidence-expressed', label: 'Expresses confidence in using skill' }
    ]
  },

  // === GAMIFICATION ===
  {
    id: 'motivation-approach',
    category: 'integrations',
    subcategory: 'gamificationRules',
    question: 'What motivates non-profit workers most?',
    description: 'Primary driver for engagement and completion',
    type: 'single-choice',
    options: [
      {
        value: 'mission-impact',
        label: 'Mission Impact',
        description: 'Showing how skills help their cause, beneficiary focus'
      },
      {
        value: 'personal-growth',
        label: 'Personal Growth',
        description: 'Professional development, career advancement, skill building'
      },
      {
        value: 'time-savings',
        label: 'Time Savings',
        description: 'Efficiency gains, work-life balance, doing more with less'
      },
      {
        value: 'community-connection',
        label: 'Community Connection',
        description: 'Shared learning, helping colleagues, organizational improvement'
      }
    ]
  },

  {
    id: 'celebration-style',
    category: 'integrations',
    subcategory: 'gamificationRules',
    question: 'How should achievements be celebrated?',
    description: 'Recognition style for completed lessons and milestones',
    type: 'single-choice',
    options: [
      {
        value: 'quiet-acknowledgment',
        label: 'Quiet Acknowledgment',
        description: 'Simple checkmark, brief "Well done!", professional'
      },
      {
        value: 'meaningful-reflection',
        label: 'Meaningful Reflection',
        description: 'Moment to appreciate growth, impact on work, personal note'
      },
      {
        value: 'enthusiastic-praise',
        label: 'Enthusiastic Praise', 
        description: 'Excited celebration, confetti, "You did it!" energy'
      },
      {
        value: 'progress-showcase',
        label: 'Progress Showcase',
        description: 'Visual progress, skills unlocked, journey visualization'
      }
    ]
  }
];

const QUESTION_CATEGORIES = [
  { id: 'characters', label: 'Character Development', icon: '👥' },
  { id: 'content', label: 'Content & Narrative', icon: '📚' },
  { id: 'interaction', label: 'User Experience', icon: '🎯' },
  { id: 'visual', label: 'Visual Design', icon: '🎨' },
  { id: 'progression', label: 'Learning & Progress', icon: '📈' },
  { id: 'gamification', label: 'Motivation & Rewards', icon: '🏆' }
];

interface RulesEngineConfiguratorProps {
  onComplete?: (rules: RulesEngineConfig) => void;
}

export const RulesEngineConfigurator: React.FC<RulesEngineConfiguratorProps> = ({
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [rulesManager] = useState(() => RulesEngineManager.getInstance());
  const [activeCategory, setActiveCategory] = useState('characters');

  const currentQuestion = CONFIGURATION_QUESTIONS[currentQuestionIndex];
  const totalQuestions = CONFIGURATION_QUESTIONS.length;
  const progress = (completedQuestions.size / totalQuestions) * 100;

  // Filter questions by category
  const questionsByCategory = QUESTION_CATEGORIES.map(category => ({
    ...category,
    questions: CONFIGURATION_QUESTIONS.filter(q => {
      if (category.id === 'characters') return q.category === 'characters';
      if (category.id === 'content') return q.category === 'contentGeneration' && q.subcategory?.includes('narrative');
      if (category.id === 'interaction') return q.category === 'contentGeneration' && q.subcategory?.includes('interaction');
      if (category.id === 'visual') return q.category === 'designSystem';
      if (category.id === 'progression') return q.category === 'contentGeneration' && q.subcategory?.includes('progression');
      if (category.id === 'gamification') return q.category === 'integrations';
      return false;
    })
  }));

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setCompletedQuestions(prev => new Set([...prev, questionId]));
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const saveConfiguration = () => {
    // Convert answers to rules format and save
    const rules = rulesManager.getRules();
    
    // Apply answers to rules (this would need detailed mapping logic)
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = CONFIGURATION_QUESTIONS.find(q => q.id === questionId);
      if (question) {
        // Update rules based on question category and answer
        // This is where we'd map Q&A answers to the rules structure
      }
    });

    // Save updated rules
    const rulesJson = rulesManager.exportRules();
    
    // You could save to localStorage, file, or database here
    localStorage.setItem('lyra-rules-config', rulesJson);
    
    onComplete?.(rules);
  };

  const downloadConfiguration = () => {
    const config = {
      timestamp: new Date().toISOString(),
      answers,
      completedQuestions: Array.from(completedQuestions),
      rulesSnapshot: rulesManager.getRules()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyra-rules-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderQuestionInput = (question: ConfigurationQuestion) => {
    const currentValue = answers[question.id];

    switch (question.type) {
      case 'single-choice':
        return (
          <div className="space-y-3">
            {question.options?.map(option => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  currentValue === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  {currentValue === option.value ? (
                    <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map(option => {
              const selected = Array.isArray(currentValue) && currentValue.includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    const current = Array.isArray(currentValue) ? currentValue : [];
                    const updated = selected 
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value];
                    handleAnswer(question.id, updated);
                  }}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-3">
                    {selected ? (
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {question.options?.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                    currentValue === option.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold">{option.value}</div>
                  <div className="text-xs text-center">{option.label}</div>
                </button>
              ))}
            </div>
            {currentValue && (
              <div className="text-center text-sm text-gray-600">
                {question.options?.find(o => o.value === currentValue)?.description}
              </div>
            )}
          </div>
        );

      default:
        return <div>Question type not implemented</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lesson Generation Rules Configuration</span>
            <Badge variant="outline">
              {completedQuestions.size} / {totalQuestions} Complete
            </Badge>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {QUESTION_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              <span className="mr-1">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {QUESTION_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-6">
              {questionsByCategory
                .find(c => c.id === category.id)
                ?.questions.map(question => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{question.question}</span>
                        {completedQuestions.has(question.id) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </CardTitle>
                      {question.description && (
                        <p className="text-gray-600">{question.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {renderQuestionInput(question)}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Configuration Progress: {Math.round(progress)}% complete
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={downloadConfiguration}
                variant="outline"
                disabled={completedQuestions.size === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Config
              </Button>
              <Button 
                onClick={saveConfiguration}
                disabled={completedQuestions.size < totalQuestions * 0.8} // Need 80% complete
              >
                <Save className="w-4 h-4 mr-2" />
                Save Rules Engine
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesEngineConfigurator;