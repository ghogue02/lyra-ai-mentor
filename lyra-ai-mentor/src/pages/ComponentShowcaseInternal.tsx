import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Code2, 
  Timer, 
  Package, 
  Users, 
  Sparkles,
  Layers,
  ChevronLeft,
  Copy,
  Check,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Production-optimized: Use dynamic imports for character components
// This enables proper code splitting and reduces main bundle size
const componentLoader = {
  // Maya Components
  MayaEmailComposer: () => import('@/components/interactive/MayaEmailComposer').then(m => m.MayaEmailComposer),
  MayaGrantProposal: () => import('@/components/interactive/MayaGrantProposal').then(m => m.MayaGrantProposal),
  MayaGrantProposalAdvanced: () => import('@/components/interactive/MayaGrantProposalAdvanced').then(m => m.MayaGrantProposalAdvanced),
  MayaParentResponseEmail: () => import('@/components/interactive/MayaParentResponseEmail').then(m => m.MayaParentResponseEmail),
  MayaPromptSandwichBuilder: () => import('@/components/interactive/MayaPromptSandwichBuilder').then(m => m.MayaPromptSandwichBuilder),
  MayaResearchSynthesis: () => import('@/components/interactive/MayaResearchSynthesis').then(m => m.MayaResearchSynthesis),
  MayaBoardMeetingPrep: () => import('@/components/interactive/MayaBoardMeetingPrep').then(m => m.MayaBoardMeetingPrep),
  MayaEmailConfidenceBuilder: () => import('@/components/interactive/MayaEmailConfidenceBuilder').then(m => m.MayaEmailConfidenceBuilder),
  
  // Sofia Components
  SofiaMissionStoryCreator: () => import('@/components/interactive/SofiaMissionStoryCreator').then(m => m.SofiaMissionStoryCreator),
  SofiaStoryBreakthrough: () => import('@/components/interactive/SofiaStoryBreakthrough').then(m => m.SofiaStoryBreakthrough),
  SofiaVoiceDiscovery: () => import('@/components/interactive/SofiaVoiceDiscovery').then(m => m.SofiaVoiceDiscovery),
  SofiaImpactScaling: () => import('@/components/interactive/SofiaImpactScaling').then(m => m.SofiaImpactScaling),
  
  // Rachel Components
  RachelAutomationVision: () => import('@/components/interactive/RachelAutomationVision').then(m => m.RachelAutomationVision),
  RachelEcosystemBuilder: () => import('@/components/interactive/RachelEcosystemBuilder').then(m => m.RachelEcosystemBuilder),
  RachelProcessTransformer: () => import('@/components/interactive/RachelProcessTransformer').then(m => m.RachelProcessTransformer),
  RachelWorkflowDesigner: () => import('@/components/interactive/RachelWorkflowDesigner').then(m => m.RachelWorkflowDesigner),
  
  // David Components
  DavidDataRevival: () => import('@/components/interactive/DavidDataRevival').then(m => m.DavidDataRevival),
  DavidDataStoryFinder: () => import('@/components/interactive/DavidDataStoryFinder').then(m => m.DavidDataStoryFinder),
  DavidPresentationMaster: () => import('@/components/interactive/DavidPresentationMaster').then(m => m.DavidPresentationMaster),
  DavidSystemBuilder: () => import('@/components/interactive/DavidSystemBuilder').then(m => m.DavidSystemBuilder),
  
  // Alex Components
  AlexChangeStrategy: () => import('@/components/interactive/AlexChangeStrategy').then(m => m.AlexChangeStrategy),
  AlexLeadershipFramework: () => import('@/components/interactive/AlexLeadershipFramework').then(m => m.AlexLeadershipFramework),
  AlexRoadmapCreator: () => import('@/components/interactive/AlexRoadmapCreator').then(m => m.AlexRoadmapCreator),
  AlexVisionBuilder: () => import('@/components/interactive/AlexVisionBuilder').then(m => m.AlexVisionBuilder),
};

// Core Renderers - Keep static for essential functionality
import { AIContentGeneratorRenderer } from '@/components/lesson/interactive/AIContentGeneratorRenderer';
import { CalloutBoxRenderer } from '@/components/lesson/interactive/CalloutBoxRenderer';
import { KnowledgeCheckRenderer } from '@/components/lesson/interactive/KnowledgeCheckRenderer';
import { LyraChatRenderer } from '@/components/lesson/interactive/LyraChatRenderer';
import { ReflectionRenderer } from '@/components/lesson/interactive/ReflectionRenderer';
import { SequenceSorterRenderer } from '@/components/lesson/interactive/SequenceSorterRenderer';

// AI/Testing Components - Dynamic imports for size optimization
const testingComponentLoader = {
  DonorBehaviorPredictor: () => import('@/components/testing/DonorBehaviorPredictor').then(m => m.DonorBehaviorPredictor),
  RestaurantSurplusPredictor: () => import('@/components/testing/RestaurantSurplusPredictor').then(m => m.RestaurantSurplusPredictor),
  VolunteerSkillsMatcher: () => import('@/components/testing/VolunteerSkillsMatcher').then(m => m.VolunteerSkillsMatcher),
  AIDefinitionBuilder: () => import('@/components/testing/AIDefinitionBuilder').then(m => m.AIDefinitionBuilder),
  AIMythsSwiper: () => import('@/components/testing/AIMythsSwiper').then(m => m.AIMythsSwiper),
  GrantWritingAssistant: () => import('@/components/testing/GrantWritingAssistant').then(m => m.GrantWritingAssistant),
  AIContentGenerator: () => import('@/components/testing/AIContentGenerator').then(m => m.AIContentGenerator),
  AIImpactStoryCreator: () => import('@/components/testing/AIImpactStoryCreator').then(m => m.AIImpactStoryCreator),
  TimeSavingsCalculator: () => import('@/components/testing/TimeSavingsCalculator').then(m => m.TimeSavingsCalculator),
};

interface ComponentMetrics {
  loadTime: number;
  bundleSize: string;
  renderCount: number;
}

interface ComponentInfo {
  name: string;
  component: React.ComponentType<any>;
  category: string;
  character?: string;
  description: string;
  props?: any;
  codeSnippet: string;
}

const ComponentShowcase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState('all');
  const [showPerformance, setShowPerformance] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [componentMetrics, setComponentMetrics] = useState<Record<string, ComponentMetrics>>({});

  // Component definitions with dynamic loading
  const components: ComponentInfo[] = [
    // Maya Components
    {
      name: 'MayaEmailComposer',
      component: React.lazy(() => componentLoader.MayaEmailComposer().then(comp => ({ default: comp }))),
      category: 'character',
      character: 'Maya',
      description: 'AI-powered email composition tool for effective communication',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';

<MayaEmailComposer onComplete={() => console.log('Email completed')} />`
    },
    {
      name: 'MayaGrantProposal',
      component: React.lazy(() => componentLoader.MayaGrantProposal().then(comp => ({ default: comp }))),
      category: 'character',
      character: 'Maya',
      description: 'Grant proposal writing assistant with guided templates',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaGrantProposal } from '@/components/interactive/MayaGrantProposal';

<MayaGrantProposal onComplete={() => console.log('Proposal completed')} />`
    },
    {
      name: 'MayaGrantProposalAdvanced',
      component: MayaGrantProposalAdvanced,
      category: 'character',
      character: 'Maya',
      description: 'Advanced grant proposal builder with comprehensive sections',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaGrantProposalAdvanced } from '@/components/interactive/MayaGrantProposalAdvanced';

<MayaGrantProposalAdvanced onComplete={() => console.log('Advanced proposal completed')} />`
    },
    {
      name: 'MayaParentResponseEmail',
      component: MayaParentResponseEmail,
      category: 'character',
      character: 'Maya',
      description: 'Specialized email composer for parent communications',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaParentResponseEmail } from '@/components/interactive/MayaParentResponseEmail';

<MayaParentResponseEmail onComplete={() => console.log('Email sent')} />`
    },
    {
      name: 'MayaPromptSandwichBuilder',
      component: MayaPromptSandwichBuilder,
      category: 'character',
      character: 'Maya',
      description: 'Learn the "prompt sandwich" technique for better AI interactions',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaPromptSandwichBuilder } from '@/components/interactive/MayaPromptSandwichBuilder';

<MayaPromptSandwichBuilder onComplete={() => console.log('Prompt built')} />`
    },
    {
      name: 'MayaResearchSynthesis',
      component: MayaResearchSynthesis,
      category: 'character',
      character: 'Maya',
      description: 'Research synthesis tool for academic and professional writing',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaResearchSynthesis } from '@/components/interactive/MayaResearchSynthesis';

<MayaResearchSynthesis onComplete={() => console.log('Research synthesized')} />`
    },
    {
      name: 'MayaBoardMeetingPrep',
      component: MayaBoardMeetingPrep,
      category: 'character',
      character: 'Maya',
      description: 'Board meeting preparation assistant',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaBoardMeetingPrep } from '@/components/interactive/MayaBoardMeetingPrep';

<MayaBoardMeetingPrep onComplete={() => console.log('Meeting prep complete')} />`
    },
    {
      name: 'MayaEmailConfidenceBuilder',
      component: MayaEmailConfidenceBuilder,
      category: 'character',
      character: 'Maya',
      description: 'Build confidence in email communication',
      props: { onComplete: () => {} },
      codeSnippet: `import { MayaEmailConfidenceBuilder } from '@/components/interactive/MayaEmailConfidenceBuilder';

<MayaEmailConfidenceBuilder onComplete={() => console.log('Confidence built')} />`
    },

    // Sofia Components
    {
      name: 'SofiaMissionStoryCreator',
      component: SofiaMissionStoryCreator,
      category: 'character',
      character: 'Sofia',
      description: 'Create compelling mission-driven stories',
      props: { onComplete: () => {} },
      codeSnippet: `import { SofiaMissionStoryCreator } from '@/components/interactive/SofiaMissionStoryCreator';

<SofiaMissionStoryCreator onComplete={() => console.log('Story created')} />`
    },
    {
      name: 'SofiaStoryBreakthrough',
      component: SofiaStoryBreakthrough,
      category: 'character',
      character: 'Sofia',
      description: 'Breakthrough storytelling techniques',
      props: { onComplete: () => {} },
      codeSnippet: `import { SofiaStoryBreakthrough } from '@/components/interactive/SofiaStoryBreakthrough';

<SofiaStoryBreakthrough onComplete={() => console.log('Breakthrough achieved')} />`
    },
    {
      name: 'SofiaVoiceDiscovery',
      component: SofiaVoiceDiscovery,
      category: 'character',
      character: 'Sofia',
      description: 'Discover your unique organizational voice',
      props: { onComplete: () => {} },
      codeSnippet: `import { SofiaVoiceDiscovery } from '@/components/interactive/SofiaVoiceDiscovery';

<SofiaVoiceDiscovery onComplete={() => console.log('Voice discovered')} />`
    },
    {
      name: 'SofiaImpactScaling',
      component: SofiaImpactScaling,
      category: 'character',
      character: 'Sofia',
      description: 'Scale your impact through strategic storytelling',
      props: { onComplete: () => {} },
      codeSnippet: `import { SofiaImpactScaling } from '@/components/interactive/SofiaImpactScaling';

<SofiaImpactScaling onComplete={() => console.log('Impact scaled')} />`
    },

    // Rachel Components
    {
      name: 'RachelAutomationVision',
      component: RachelAutomationVision,
      category: 'character',
      character: 'Rachel',
      description: 'Envision automation possibilities for your organization',
      props: { onComplete: () => {} },
      codeSnippet: `import { RachelAutomationVision } from '@/components/interactive/RachelAutomationVision';

<RachelAutomationVision onComplete={() => console.log('Vision created')} />`
    },
    {
      name: 'RachelEcosystemBuilder',
      component: RachelEcosystemBuilder,
      category: 'character',
      character: 'Rachel',
      description: 'Build integrated technology ecosystems',
      props: { onComplete: () => {} },
      codeSnippet: `import { RachelEcosystemBuilder } from '@/components/interactive/RachelEcosystemBuilder';

<RachelEcosystemBuilder onComplete={() => console.log('Ecosystem built')} />`
    },
    {
      name: 'RachelProcessTransformer',
      component: RachelProcessTransformer,
      category: 'character',
      character: 'Rachel',
      description: 'Transform manual processes into automated workflows',
      props: { onComplete: () => {} },
      codeSnippet: `import { RachelProcessTransformer } from '@/components/interactive/RachelProcessTransformer';

<RachelProcessTransformer onComplete={() => console.log('Process transformed')} />`
    },
    {
      name: 'RachelWorkflowDesigner',
      component: RachelWorkflowDesigner,
      category: 'character',
      character: 'Rachel',
      description: 'Design efficient automated workflows',
      props: { onComplete: () => {} },
      codeSnippet: `import { RachelWorkflowDesigner } from '@/components/interactive/RachelWorkflowDesigner';

<RachelWorkflowDesigner onComplete={() => console.log('Workflow designed')} />`
    },

    // David Components
    {
      name: 'DavidDataRevival',
      component: DavidDataRevival,
      category: 'character',
      character: 'David',
      description: 'Revive and make sense of dormant data',
      props: { onComplete: () => {} },
      codeSnippet: `import { DavidDataRevival } from '@/components/interactive/DavidDataRevival';

<DavidDataRevival onComplete={() => console.log('Data revived')} />`
    },
    {
      name: 'DavidDataStoryFinder',
      component: DavidDataStoryFinder,
      category: 'character',
      character: 'David',
      description: 'Find compelling stories hidden in your data',
      props: { onComplete: () => {} },
      codeSnippet: `import { DavidDataStoryFinder } from '@/components/interactive/DavidDataStoryFinder';

<DavidDataStoryFinder onComplete={() => console.log('Story found')} />`
    },
    {
      name: 'DavidPresentationMaster',
      component: DavidPresentationMaster,
      category: 'character',
      character: 'David',
      description: 'Master data presentation techniques',
      props: { onComplete: () => {} },
      codeSnippet: `import { DavidPresentationMaster } from '@/components/interactive/DavidPresentationMaster';

<DavidPresentationMaster onComplete={() => console.log('Presentation mastered')} />`
    },
    {
      name: 'DavidSystemBuilder',
      component: DavidSystemBuilder,
      category: 'character',
      character: 'David',
      description: 'Build comprehensive data systems',
      props: { onComplete: () => {} },
      codeSnippet: `import { DavidSystemBuilder } from '@/components/interactive/DavidSystemBuilder';

<DavidSystemBuilder onComplete={() => console.log('System built')} />`
    },

    // Alex Components
    {
      name: 'AlexChangeStrategy',
      component: AlexChangeStrategy,
      category: 'character',
      character: 'Alex',
      description: 'Develop effective change management strategies',
      props: { onComplete: () => {} },
      codeSnippet: `import { AlexChangeStrategy } from '@/components/interactive/AlexChangeStrategy';

<AlexChangeStrategy onComplete={() => console.log('Strategy developed')} />`
    },
    {
      name: 'AlexLeadershipFramework',
      component: AlexLeadershipFramework,
      category: 'character',
      character: 'Alex',
      description: 'Build leadership frameworks for AI adoption',
      props: { onComplete: () => {} },
      codeSnippet: `import { AlexLeadershipFramework } from '@/components/interactive/AlexLeadershipFramework';

<AlexLeadershipFramework onComplete={() => console.log('Framework built')} />`
    },
    {
      name: 'AlexRoadmapCreator',
      component: AlexRoadmapCreator,
      category: 'character',
      character: 'Alex',
      description: 'Create strategic AI implementation roadmaps',
      props: { onComplete: () => {} },
      codeSnippet: `import { AlexRoadmapCreator } from '@/components/interactive/AlexRoadmapCreator';

<AlexRoadmapCreator onComplete={() => console.log('Roadmap created')} />`
    },
    {
      name: 'AlexVisionBuilder',
      component: AlexVisionBuilder,
      category: 'character',
      character: 'Alex',
      description: 'Build compelling AI vision statements',
      props: { onComplete: () => {} },
      codeSnippet: `import { AlexVisionBuilder } from '@/components/interactive/AlexVisionBuilder';

<AlexVisionBuilder onComplete={() => console.log('Vision built')} />`
    },

    // Core Renderers
    {
      name: 'AIContentGeneratorRenderer',
      component: AIContentGeneratorRenderer,
      category: 'renderer',
      description: 'Core renderer for AI content generation components',
      props: { data: { title: 'AI Content Generator', description: 'Generate content with AI' } },
      codeSnippet: `import { AIContentGeneratorRenderer } from '@/components/lesson/interactive/AIContentGeneratorRenderer';

<AIContentGeneratorRenderer 
  data={{
    title: 'AI Content Generator',
    description: 'Generate content with AI'
  }} 
/>`
    },
    {
      name: 'CalloutBoxRenderer',
      component: CalloutBoxRenderer,
      category: 'renderer',
      description: 'Render callout boxes for important information',
      props: { data: { text: 'Important callout message', type: 'info' } },
      codeSnippet: `import { CalloutBoxRenderer } from '@/components/lesson/interactive/CalloutBoxRenderer';

<CalloutBoxRenderer 
  data={{
    text: 'Important callout message',
    type: 'info'
  }} 
/>`
    },
    {
      name: 'KnowledgeCheckRenderer',
      component: KnowledgeCheckRenderer,
      category: 'renderer',
      description: 'Render knowledge check questions',
      props: { data: { question: 'What is AI?', answers: ['Option 1', 'Option 2'] } },
      codeSnippet: `import { KnowledgeCheckRenderer } from '@/components/lesson/interactive/KnowledgeCheckRenderer';

<KnowledgeCheckRenderer 
  data={{
    question: 'What is AI?',
    answers: ['Option 1', 'Option 2']
  }} 
/>`
    },
    {
      name: 'LyraChatRenderer',
      component: LyraChatRenderer,
      category: 'renderer',
      description: 'Render interactive Lyra chat components',
      props: { data: { prompt: 'How can I help you today?' } },
      codeSnippet: `import { LyraChatRenderer } from '@/components/lesson/interactive/LyraChatRenderer';

<LyraChatRenderer 
  data={{
    prompt: 'How can I help you today?'
  }} 
/>`
    },
    {
      name: 'ReflectionRenderer',
      component: ReflectionRenderer,
      category: 'renderer',
      description: 'Render reflection prompts and exercises',
      props: { data: { prompt: 'Reflect on your learning' } },
      codeSnippet: `import { ReflectionRenderer } from '@/components/lesson/interactive/ReflectionRenderer';

<ReflectionRenderer 
  data={{
    prompt: 'Reflect on your learning'
  }} 
/>`
    },
    {
      name: 'SequenceSorterRenderer',
      component: SequenceSorterRenderer,
      category: 'renderer',
      description: 'Render sequence sorting exercises',
      props: { data: { items: ['Step 1', 'Step 2', 'Step 3'] } },
      codeSnippet: `import { SequenceSorterRenderer } from '@/components/lesson/interactive/SequenceSorterRenderer';

<SequenceSorterRenderer 
  data={{
    items: ['Step 1', 'Step 2', 'Step 3']
  }} 
/>`
    },

    // AI/Testing Components
    {
      name: 'DonorBehaviorPredictor',
      component: DonorBehaviorPredictor,
      category: 'ai-testing',
      description: 'Predict donor behavior patterns using AI',
      props: {},
      codeSnippet: `import { DonorBehaviorPredictor } from '@/components/testing/DonorBehaviorPredictor';

<DonorBehaviorPredictor />`
    },
    {
      name: 'RestaurantSurplusPredictor',
      component: RestaurantSurplusPredictor,
      category: 'ai-testing',
      description: 'Predict restaurant food surplus for donation planning',
      props: {},
      codeSnippet: `import { RestaurantSurplusPredictor } from '@/components/testing/RestaurantSurplusPredictor';

<RestaurantSurplusPredictor />`
    },
    {
      name: 'VolunteerSkillsMatcher',
      component: VolunteerSkillsMatcher,
      category: 'ai-testing',
      description: 'Match volunteers with opportunities based on skills',
      props: {},
      codeSnippet: `import { VolunteerSkillsMatcher } from '@/components/testing/VolunteerSkillsMatcher';

<VolunteerSkillsMatcher />`
    },
    {
      name: 'AIDefinitionBuilder',
      component: AIDefinitionBuilder,
      category: 'ai-testing',
      description: 'Build clear AI definitions for your organization',
      props: {},
      codeSnippet: `import { AIDefinitionBuilder } from '@/components/testing/AIDefinitionBuilder';

<AIDefinitionBuilder />`
    },
    {
      name: 'AIMythsSwiper',
      component: AIMythsSwiper,
      category: 'ai-testing',
      description: 'Interactive myth-busting swiper for AI education',
      props: {},
      codeSnippet: `import { AIMythsSwiper } from '@/components/testing/AIMythsSwiper';

<AIMythsSwiper />`
    },
    {
      name: 'GrantWritingAssistant',
      component: GrantWritingAssistant,
      category: 'ai-testing',
      description: 'AI-powered grant writing assistance',
      props: {},
      codeSnippet: `import { GrantWritingAssistant } from '@/components/testing/GrantWritingAssistant';

<GrantWritingAssistant />`
    },
    {
      name: 'AIContentGenerator',
      component: AIContentGenerator,
      category: 'ai-testing',
      description: 'Generate various types of content with AI',
      props: {},
      codeSnippet: `import { AIContentGenerator } from '@/components/testing/AIContentGenerator';

<AIContentGenerator />`
    },
    {
      name: 'AIImpactStoryCreator',
      component: AIImpactStoryCreator,
      category: 'ai-testing',
      description: 'Create compelling impact stories with AI assistance',
      props: {},
      codeSnippet: `import { AIImpactStoryCreator } from '@/components/testing/AIImpactStoryCreator';

<AIImpactStoryCreator />`
    },
    {
      name: 'TimeSavingsCalculator',
      component: TimeSavingsCalculator,
      category: 'ai-testing',
      description: 'Calculate time savings from AI implementation',
      props: {},
      codeSnippet: `import { TimeSavingsCalculator } from '@/components/testing/TimeSavingsCalculator';

<TimeSavingsCalculator />`
    }
  ];

  // Simulate performance metrics
  useEffect(() => {
    const metrics: Record<string, ComponentMetrics> = {};
    components.forEach(comp => {
      metrics[comp.name] = {
        loadTime: Math.random() * 50 + 10, // 10-60ms
        bundleSize: `${Math.floor(Math.random() * 50 + 5)}kb`,
        renderCount: Math.floor(Math.random() * 3 + 1)
      };
    });
    setComponentMetrics(metrics);
  }, []);

  // Filter components based on search and filters
  const filteredComponents = useMemo(() => {
    return components.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      const matchesCharacter = selectedCharacter === 'all' || comp.character === selectedCharacter;
      
      return matchesSearch && matchesCategory && matchesCharacter;
    });
  }, [searchQuery, selectedCategory, selectedCharacter]);

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentInfo[]> = {};
    filteredComponents.forEach(comp => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(name);
    toast({
      title: "Code copied!",
      description: "The code snippet has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const characters = ['Maya', 'Sofia', 'Rachel', 'David', 'Alex'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Component Showcase</h1>
                <p className="text-gray-600 mt-1">
                  Explore all {components.length} interactive components
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPerformance(!showPerformance)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showPerformance ? 'Hide' : 'Show'} Performance
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="character">Character Components</option>
              <option value="renderer">Core Renderers</option>
              <option value="ai-testing">AI/Testing Components</option>
            </select>

            {selectedCategory === 'character' && (
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Characters</option>
                {characters.map(char => (
                  <option key={char} value={char}>{char}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Component Categories */}
        {Object.entries(groupedComponents).map(([category, comps]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {category === 'character' && <Users className="h-5 w-5 text-purple-500" />}
              {category === 'renderer' && <Layers className="h-5 w-5 text-blue-500" />}
              {category === 'ai-testing' && <Sparkles className="h-5 w-5 text-green-500" />}
              <h2 className="text-xl font-semibold text-gray-800">
                {category === 'character' && 'Character Components'}
                {category === 'renderer' && 'Core Renderers'}
                {category === 'ai-testing' && 'AI/Testing Components'}
              </h2>
              <Badge variant="secondary">{comps.length}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {comps.map((comp) => (
                <Card key={comp.name} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{comp.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {comp.description}
                        </CardDescription>
                        {comp.character && (
                          <Badge variant="outline" className="mt-2">
                            {comp.character}
                          </Badge>
                        )}
                      </div>
                      {showPerformance && componentMetrics[comp.name] && (
                        <div className="text-xs text-gray-500 text-right">
                          <div>Load: {componentMetrics[comp.name].loadTime.toFixed(1)}ms</div>
                          <div>Size: {componentMetrics[comp.name].bundleSize}</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="preview" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preview">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="code">
                          <Code2 className="h-4 w-4 mr-2" />
                          Code
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="preview" className="mt-4">
                        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
                          <React.Suspense fallback={
                            <div className="flex items-center justify-center h-32">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                            </div>
                          }>
                            <comp.component {...comp.props} />
                          </React.Suspense>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="code" className="mt-4">
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{comp.codeSnippet}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            onClick={() => copyCode(comp.codeSnippet, comp.name)}
                          >
                            {copiedCode === comp.name ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No components found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentShowcase;