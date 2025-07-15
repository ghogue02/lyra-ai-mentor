import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, Users, Zap, BarChart3, MessageSquare, Database, GitBranch, Target } from 'lucide-react';

// Import all micro-learning elements
import * as MayaElements from '../maya';
import * as SofiaElements from '../sofia';
import * as DavidElements from '../david';
import * as RachelElements from '../rachel';
import * as AlexElements from '../alex';

interface MicroLearningElement {
  id: string;
  name: string;
  character: 'Maya' | 'Sofia' | 'David' | 'Rachel' | 'Alex';
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  component: React.ComponentType<any>;
  description: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  exports: string[];
}

const MICRO_LEARNING_ELEMENTS: MicroLearningElement[] = [
  // Maya (Email Mastery) - 10 elements
  {
    id: 'maya-subject-line',
    name: 'Subject Line Workshop',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Beginner',
    duration: 8,
    component: MayaElements.SubjectLineWorkshop,
    description: 'Master the art of compelling subject lines that get opened',
    learningOutcomes: ['Write attention-grabbing subject lines', 'A/B test subject line variations', 'Understand open rate psychology'],
    exports: ['Subject line templates', 'A/B testing framework', 'Open rate predictions']
  },
  {
    id: 'maya-opening-hook',
    name: 'Opening Hook Builder',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Beginner',
    duration: 7,
    component: MayaElements.OpeningHookBuilder,
    description: 'Create compelling email openings that capture attention',
    learningOutcomes: ['Write engaging opening lines', 'Use storytelling techniques', 'Build immediate connection'],
    exports: ['Hook templates', 'Story frameworks', 'Engagement metrics']
  },
  {
    id: 'maya-storytelling',
    name: 'Storytelling Basics',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Beginner',
    duration: 10,
    component: MayaElements.StorytellingBasics,
    description: 'Learn fundamental storytelling techniques for emails',
    learningOutcomes: ['Structure compelling narratives', 'Use emotional triggers', 'Connect stories to calls-to-action'],
    exports: ['Story templates', 'Emotional mapping', 'Narrative structures']
  },
  {
    id: 'maya-cta-designer',
    name: 'Call-to-Action Designer',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Intermediate',
    duration: 6,
    component: MayaElements.CallToActionDesigner,
    description: 'Design high-converting call-to-action buttons and text',
    learningOutcomes: ['Create compelling CTAs', 'Optimize button placement', 'Test CTA variations'],
    exports: ['CTA templates', 'Button designs', 'Conversion tracking']
  },
  {
    id: 'maya-personalization',
    name: 'Personalization Engine',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Advanced',
    duration: 9,
    component: MayaElements.PersonalizationEngine,
    description: 'Build personalized email experiences at scale',
    learningOutcomes: ['Segment audiences effectively', 'Create dynamic content', 'Automate personalization'],
    exports: ['Segmentation rules', 'Dynamic templates', 'Automation workflows']
  },
  {
    id: 'maya-sequence-planner',
    name: 'Email Sequence Planner',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Advanced',
    duration: 12,
    component: MayaElements.EmailSequencePlanner,
    description: 'Plan and optimize multi-email sequences',
    learningOutcomes: ['Design email sequences', 'Optimize timing', 'Track sequence performance'],
    exports: ['Sequence templates', 'Timing optimization', 'Performance dashboards']
  },
  {
    id: 'maya-ab-testing',
    name: 'A/B Test Creator',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Intermediate',
    duration: 8,
    component: MayaElements.ABTestCreator,
    description: 'Set up and analyze A/B tests for email campaigns',
    learningOutcomes: ['Design A/B tests', 'Analyze results', 'Implement winning variations'],
    exports: ['Test frameworks', 'Statistical analysis', 'Implementation guides']
  },
  {
    id: 'maya-segmentation',
    name: 'Donor Segmentation',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Advanced',
    duration: 10,
    component: MayaElements.DonorSegmentation,
    description: 'Segment donors for targeted email campaigns',
    learningOutcomes: ['Create donor segments', 'Analyze giving patterns', 'Customize messaging'],
    exports: ['Segmentation models', 'Donor profiles', 'Targeted campaigns']
  },
  {
    id: 'maya-urgency-tone',
    name: 'Urgency Tone Balancer',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Intermediate',
    duration: 7,
    component: MayaElements.UrgencyToneBalancer,
    description: 'Balance urgency and authenticity in email tone',
    learningOutcomes: ['Create appropriate urgency', 'Maintain authentic voice', 'Avoid donor fatigue'],
    exports: ['Tone guidelines', 'Urgency frameworks', 'Voice consistency tools']
  },
  {
    id: 'maya-analytics',
    name: 'Email Analytics',
    character: 'Maya',
    category: 'Email Mastery',
    difficulty: 'Advanced',
    duration: 11,
    component: MayaElements.EmailAnalytics,
    description: 'Analyze and optimize email performance metrics',
    learningOutcomes: ['Track key metrics', 'Identify improvement areas', 'Generate actionable insights'],
    exports: ['Analytics dashboards', 'Performance reports', 'Optimization recommendations']
  }
];

interface ComponentFactoryProps {
  selectedCharacter?: 'Maya' | 'Sofia' | 'David' | 'Rachel' | 'Alex';
  onElementSelect?: (element: MicroLearningElement) => void;
}

const ComponentFactory: React.FC<ComponentFactoryProps> = ({ 
  selectedCharacter = 'Maya',
  onElementSelect 
}) => {
  const [completedElements, setCompletedElements] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState({
    totalElements: 50,
    completedElements: 0,
    averageRating: 4.7,
    totalExports: 0
  });

  const characterElements = MICRO_LEARNING_ELEMENTS.filter(
    el => el.character === selectedCharacter
  );

  const characterIcons = {
    Maya: MessageSquare,
    Sofia: Users,
    David: BarChart3,
    Rachel: Zap,
    Alex: Target
  };

  const characterColors = {
    Maya: 'bg-blue-50 border-blue-200',
    Sofia: 'bg-purple-50 border-purple-200',
    David: 'bg-green-50 border-green-200',
    Rachel: 'bg-orange-50 border-orange-200',
    Alex: 'bg-red-50 border-red-200'
  };

  const handleElementComplete = (elementId: string) => {
    setCompletedElements(prev => [...prev, elementId]);
  };

  const CharacterIcon = characterIcons[selectedCharacter];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Factory Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className={`p-3 rounded-full ${characterColors[selectedCharacter]}`}>
            <CharacterIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">
            {selectedCharacter}'s Micro-Learning Factory
          </h1>
        </div>
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Build your expertise with {selectedCharacter}'s specialized micro-learning elements. 
            Each element takes 5-10 minutes and generates real, exportable outputs.
          </AlertDescription>
        </Alert>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{characterElements.length}</div>
            <p className="text-xs text-muted-foreground">Available to complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedElements.length}</div>
            <Progress value={(completedElements.length / characterElements.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {characterElements.reduce((acc, el) => acc + el.duration, 0)} min
            </div>
            <p className="text-xs text-muted-foreground">Learning time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exports Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {characterElements.reduce((acc, el) => acc + el.exports.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tools & templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Element Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characterElements.map((element) => {
          const isCompleted = completedElements.includes(element.id);
          
          return (
            <Card 
              key={element.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isCompleted ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => onElementSelect?.(element)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={isCompleted ? 'default' : 'outline'}>
                    {isCompleted ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {element.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {element.duration} min
                  </span>
                </div>
                
                <CardTitle className="text-lg">{element.name}</CardTitle>
                <CardDescription className="text-sm">
                  {element.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Learning Outcomes:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {element.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Exports:</h4>
                    <div className="flex flex-wrap gap-1">
                      {element.exports.map((export_item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {export_item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant={isCompleted ? 'outline' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCompleted) {
                      handleElementComplete(element.id);
                    }
                  }}
                >
                  {isCompleted ? 'Completed' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Character Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CharacterIcon className="h-5 w-5" />
            {selectedCharacter} Specialization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Core Focus</h4>
              <p className="text-sm text-muted-foreground">
                {selectedCharacter === 'Maya' && 'Email mastery and donor communication'}
                {selectedCharacter === 'Sofia' && 'Voice, storytelling, and communication'}
                {selectedCharacter === 'David' && 'Data visualization and analytics'}
                {selectedCharacter === 'Rachel' && 'Automation and workflow optimization'}
                {selectedCharacter === 'Alex' && 'Change management and leadership'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-1">
                {selectedCharacter === 'Maya' && [
                  'Subject Lines', 'Personalization', 'A/B Testing', 'Segmentation'
                ].map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                ))}
                {/* Add similar arrays for other characters */}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Outcomes</h4>
              <p className="text-sm text-muted-foreground">
                Master {selectedCharacter}'s toolkit to become proficient in their specialized domain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentFactory;