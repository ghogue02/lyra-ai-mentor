import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  TestTube, 
  Database, 
  Mic, 
  Download, 
  Smartphone,
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useResponsive, useSwipeGestures } from '@/hooks/useResponsive';

// Lazy load all 50 AI components for optimal bundle performance
// Maya Rodriguez Components (10)
const LazyMayaEmailComposer = React.lazy(() => import('@/components/interactive/MayaEmailComposer'));
const LazyMayaCareFrameworkBuilder = React.lazy(() => import('@/components/interactive/MayaCareFrameworkBuilder'));
const LazyMayaTemplateLibrary = React.lazy(() => import('@/components/interactive/MayaTemplateLibrary'));
const LazyMayaVoiceEmailPractice = React.lazy(() => import('@/components/interactive/MayaVoiceEmailPractice'));
const LazyMayaCommunicationCoach = React.lazy(() => import('@/components/interactive/MayaCommunicationCoach'));
const LazyMayaSubjectLineWorkshop = React.lazy(() => import('@/components/interactive/MayaSubjectLineWorkshop'));
const LazyMayaToneChecker = React.lazy(() => import('@/components/interactive/MayaToneChecker'));
const LazyMayaConfidenceBuilder = React.lazy(() => import('@/components/interactive/MayaConfidenceBuilder'));
const LazyMayaMobileEmailDashboard = React.lazy(() => import('@/components/interactive/MayaMobileEmailDashboard'));
const LazyMayaCommunicationMetrics = React.lazy(() => import('@/components/interactive/MayaCommunicationMetrics'));

// Sofia Martinez Components (10)
const LazySofiaStoryCreator = React.lazy(() => import('@/components/interactive/SofiaStoryCreator'));
const LazySofiaVoiceDiscoveryEngine = React.lazy(() => import('@/components/interactive/SofiaVoiceDiscoveryEngine'));
const LazySofiaNarrativeBuilder = React.lazy(() => import('@/components/interactive/SofiaNarrativeBuilder'));
const LazySofiaVoiceRecorder = React.lazy(() => import('@/components/interactive/SofiaVoiceRecorder'));
const LazySofiaAuthenticityTrainer = React.lazy(() => import('@/components/interactive/SofiaAuthenticityTrainer'));
const LazySofiaStoryStarter = React.lazy(() => import('@/components/interactive/SofiaStoryStarter'));
const LazySofiaVoiceCoach = React.lazy(() => import('@/components/interactive/SofiaVoiceCoach'));
const LazySofiaAuthenticityChecker = React.lazy(() => import('@/components/interactive/SofiaAuthenticityChecker'));
const LazySofiaMobileStoryboard = React.lazy(() => import('@/components/interactive/SofiaMobileStoryboard'));
const LazySofiaVoiceAnalytics = React.lazy(() => import('@/components/interactive/SofiaVoiceAnalytics'));

// David Chen Components (10)
const LazyDavidDataVisualizer = React.lazy(() => import('@/components/interactive/DavidDataVisualizer'));
const LazyDavidInsightGenerator = React.lazy(() => import('@/components/interactive/DavidInsightGenerator'));
const LazyDavidDataStoryBuilder = React.lazy(() => import('@/components/interactive/DavidDataStoryBuilder'));
const LazyDavidPresentationCoach = React.lazy(() => import('@/components/interactive/DavidPresentationCoach'));
const LazyDavidDataNarrator = React.lazy(() => import('@/components/interactive/DavidDataNarrator'));
const LazyDavidQuickCharts = React.lazy(() => import('@/components/interactive/DavidQuickCharts'));
const LazyDavidDataCoach = React.lazy(() => import('@/components/interactive/DavidDataCoach'));
const LazyDavidInsightValidator = React.lazy(() => import('@/components/interactive/DavidInsightValidator'));
const LazyDavidMobileDashboard = React.lazy(() => import('@/components/interactive/DavidMobileDashboard'));
const LazyDavidAnalyticsMetrics = React.lazy(() => import('@/components/interactive/DavidAnalyticsMetrics'));

// Rachel Thompson Components (10)
const LazyRachelAutomationBuilder = React.lazy(() => import('@/components/interactive/RachelAutomationBuilder'));
const LazyRachelWorkflowOptimizer = React.lazy(() => import('@/components/interactive/RachelWorkflowOptimizer'));
const LazyRachelProcessMapper = React.lazy(() => import('@/components/interactive/RachelProcessMapper'));
const LazyRachelTaskAutomator = React.lazy(() => import('@/components/interactive/RachelTaskAutomator'));
const LazyRachelVoiceWorkflowCoach = React.lazy(() => import('@/components/interactive/RachelVoiceWorkflowCoach'));
const LazyRachelQuickAutomation = React.lazy(() => import('@/components/interactive/RachelQuickAutomation'));
const LazyRachelEfficiencyAnalyzer = React.lazy(() => import('@/components/interactive/RachelEfficiencyAnalyzer'));
const LazyRachelWorkflowValidator = React.lazy(() => import('@/components/interactive/RachelWorkflowValidator'));
const LazyRachelMobileTaskManager = React.lazy(() => import('@/components/interactive/RachelMobileTaskManager'));
const LazyRachelAutomationMetrics = React.lazy(() => import('@/components/interactive/RachelAutomationMetrics'));

// Alex Rivera Components (10)
const LazyAlexChangeStrategy = React.lazy(() => import('@/components/interactive/AlexChangeStrategy'));
const LazyAlexDecisionFramework = React.lazy(() => import('@/components/interactive/AlexDecisionFramework'));
const LazyAlexImpactMeasurement = React.lazy(() => import('@/components/interactive/AlexImpactMeasurement'));
const LazyAlexLeadershipDevelopment = React.lazy(() => import('@/components/interactive/AlexLeadershipDevelopment'));
const LazyAlexVoiceChangeCoach = React.lazy(() => import('@/components/interactive/AlexVoiceChangeCoach'));
const LazyAlexQuickStrategy = React.lazy(() => import('@/components/interactive/AlexQuickStrategy'));
const LazyAlexStrategicPlanning = React.lazy(() => import('@/components/interactive/AlexStrategicPlanning'));
const LazyAlexStrategyMetrics = React.lazy(() => import('@/components/interactive/AlexStrategyMetrics'));
const LazyAlexMobileStrategy = React.lazy(() => import('@/components/interactive/AlexMobileStrategy'));
const LazyAlexOrganizationalHealth = React.lazy(() => import('@/components/interactive/AlexOrganizationalHealth'));

interface TestComponent {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'voice' | 'micro' | 'mobile' | 'admin';
  status: 'ready' | 'testing' | 'issues';
  component: React.ComponentType<any>;
  props?: any;
}

const testComponents: TestComponent[] = [
  // Maya Rodriguez Components (10)
  {
    id: 'maya-email-composer',
    name: 'Maya Email Composer',
    description: 'Full email generation with CARE framework',
    category: 'core',
    status: 'ready',
    component: LazyMayaEmailComposer,
    props: { character: 'maya', mode: 'full' }
  },
  {
    id: 'maya-care-framework',
    name: 'Maya CARE Framework Builder',
    description: 'Interactive CARE structure creator',
    category: 'core',
    status: 'ready',
    component: LazyMayaCareFrameworkBuilder
  },
  {
    id: 'maya-template-library',
    name: 'Maya Template Library',
    description: 'Email template generator and manager',
    category: 'core',
    status: 'ready',
    component: LazyMayaTemplateLibrary
  },
  {
    id: 'maya-voice-email-practice',
    name: 'Maya Voice Email Practice',
    description: 'Practice email delivery with voice',
    category: 'voice',
    status: 'ready',
    component: LazyMayaVoiceEmailPractice
  },
  {
    id: 'maya-communication-coach',
    name: 'Maya Communication Coach',
    description: 'Voice-guided communication training',
    category: 'voice',
    status: 'ready',
    component: LazyMayaCommunicationCoach
  },
  {
    id: 'maya-subject-line-workshop',
    name: 'Maya Subject Line Workshop',
    description: 'Quick subject line optimization',
    category: 'micro',
    status: 'ready',
    component: LazyMayaSubjectLineWorkshop,
    props: { onComplete: (score: number) => console.log('Score:', score) }
  },
  {
    id: 'maya-tone-checker',
    name: 'Maya Tone Checker',
    description: 'Email tone analysis and suggestions',
    category: 'micro',
    status: 'ready',
    component: LazyMayaToneChecker
  },
  {
    id: 'maya-confidence-builder',
    name: 'Maya Confidence Builder',
    description: 'Micro-lessons for communication confidence',
    category: 'micro',
    status: 'ready',
    component: LazyMayaConfidenceBuilder
  },
  {
    id: 'maya-mobile-email-dashboard',
    name: 'Maya Mobile Email Dashboard',
    description: 'Mobile email management interface',
    category: 'mobile',
    status: 'ready',
    component: LazyMayaMobileEmailDashboard
  },
  {
    id: 'maya-communication-metrics',
    name: 'Maya Communication Metrics',
    description: 'Track communication improvement metrics',
    category: 'admin',
    status: 'ready',
    component: LazyMayaCommunicationMetrics
  },

  // Sofia Martinez Components (10)
  {
    id: 'sofia-story-creator',
    name: 'Sofia Story Creator',
    description: 'AI-powered story generation and editing',
    category: 'core',
    status: 'ready',
    component: LazySofiaStoryCreator
  },
  {
    id: 'sofia-voice-discovery-engine',
    name: 'Sofia Voice Discovery Engine',
    description: 'Find authentic voice through prompts',
    category: 'core',
    status: 'ready',
    component: LazySofiaVoiceDiscoveryEngine
  },
  {
    id: 'sofia-narrative-builder',
    name: 'Sofia Narrative Builder',
    description: 'Structure compelling narratives',
    category: 'core',
    status: 'ready',
    component: LazySofiaNarrativeBuilder
  },
  {
    id: 'sofia-voice-recorder',
    name: 'Sofia Voice Recorder',
    description: 'Record and analyze storytelling voice',
    category: 'voice',
    status: 'ready',
    component: LazySofiaVoiceRecorder
  },
  {
    id: 'sofia-authenticity-trainer',
    name: 'Sofia Authenticity Trainer',
    description: 'Voice authenticity coaching',
    category: 'voice',
    status: 'ready',
    component: LazySofiaAuthenticityTrainer
  },
  {
    id: 'sofia-story-starter',
    name: 'Sofia Story Starter',
    description: 'Quick story prompt generator',
    category: 'micro',
    status: 'ready',
    component: LazySofiaStoryStarter
  },
  {
    id: 'sofia-voice-coach',
    name: 'Sofia Voice Coach',
    description: 'Micro voice discovery sessions',
    category: 'micro',
    status: 'ready',
    component: LazySofiaVoiceCoach
  },
  {
    id: 'sofia-authenticity-checker',
    name: 'Sofia Authenticity Checker',
    description: 'Story authenticity validator',
    category: 'micro',
    status: 'ready',
    component: LazySofiaAuthenticityChecker
  },
  {
    id: 'sofia-mobile-storyboard',
    name: 'Sofia Mobile Storyboard',
    description: 'Mobile story creation interface',
    category: 'mobile',
    status: 'ready',
    component: LazySofiaMobileStoryboard
  },
  {
    id: 'sofia-voice-analytics',
    name: 'Sofia Voice Analytics',
    description: 'Track voice development progress',
    category: 'admin',
    status: 'ready',
    component: LazySofiaVoiceAnalytics
  },

  // David Chen Components (10)
  {
    id: 'david-data-visualizer',
    name: 'David Data Visualizer',
    description: 'AI-generated charts and graphs',
    category: 'core',
    status: 'ready',
    component: LazyDavidDataVisualizer
  },
  {
    id: 'david-insight-generator',
    name: 'David Insight Generator',
    description: 'Transform data into insights',
    category: 'core',
    status: 'ready',
    component: LazyDavidInsightGenerator
  },
  {
    id: 'david-data-story-builder',
    name: 'David Data Story Builder',
    description: 'Create narratives from data',
    category: 'core',
    status: 'ready',
    component: LazyDavidDataStoryBuilder
  },
  {
    id: 'david-presentation-coach',
    name: 'David Presentation Coach',
    description: 'Voice training for data presentations',
    category: 'voice',
    status: 'ready',
    component: LazyDavidPresentationCoach
  },
  {
    id: 'david-data-narrator',
    name: 'David Data Narrator',
    description: 'Voice-guided data storytelling',
    category: 'voice',
    status: 'ready',
    component: LazyDavidDataNarrator
  },
  {
    id: 'david-quick-charts',
    name: 'David Quick Charts',
    description: 'Rapid chart generation',
    category: 'micro',
    status: 'ready',
    component: LazyDavidQuickCharts
  },
  {
    id: 'david-data-coach',
    name: 'David Data Coach',
    description: 'Micro data analysis sessions',
    category: 'micro',
    status: 'ready',
    component: LazyDavidDataCoach
  },
  {
    id: 'david-insight-validator',
    name: 'David Insight Validator',
    description: 'Quick insight verification',
    category: 'micro',
    status: 'ready',
    component: LazyDavidInsightValidator
  },
  {
    id: 'david-mobile-dashboard',
    name: 'David Mobile Dashboard',
    description: 'Mobile data visualization interface',
    category: 'mobile',
    status: 'ready',
    component: LazyDavidMobileDashboard
  },
  {
    id: 'david-analytics-metrics',
    name: 'David Analytics Metrics',
    description: 'Track data storytelling improvement',
    category: 'admin',
    status: 'ready',
    component: LazyDavidAnalyticsMetrics
  },

  // Rachel Thompson Components (10)
  {
    id: 'rachel-automation-builder',
    name: 'Rachel Automation Builder',
    description: 'AI-powered process automation builder',
    category: 'core',
    status: 'ready',
    component: LazyRachelAutomationBuilder
  },
  {
    id: 'rachel-workflow-optimizer',
    name: 'Rachel Workflow Optimizer',
    description: 'Workflow efficiency analyzer and optimizer',
    category: 'core',
    status: 'ready',
    component: LazyRachelWorkflowOptimizer
  },
  {
    id: 'rachel-process-mapper',
    name: 'Rachel Process Mapper',
    description: 'Visual process mapping and analysis',
    category: 'core',
    status: 'ready',
    component: LazyRachelProcessMapper
  },
  {
    id: 'rachel-task-automator',
    name: 'Rachel Task Automator',
    description: 'Intelligent task automation system',
    category: 'core',
    status: 'ready',
    component: LazyRachelTaskAutomator
  },
  {
    id: 'rachel-voice-workflow-coach',
    name: 'Rachel Voice Workflow Coach',
    description: 'Voice-guided workflow coaching',
    category: 'voice',
    status: 'ready',
    component: LazyRachelVoiceWorkflowCoach
  },
  {
    id: 'rachel-quick-automation',
    name: 'Rachel Quick Automation',
    description: 'Rapid automation suggestions',
    category: 'micro',
    status: 'ready',
    component: LazyRachelQuickAutomation
  },
  {
    id: 'rachel-efficiency-analyzer',
    name: 'Rachel Efficiency Analyzer',
    description: 'Deep efficiency analysis and recommendations',
    category: 'micro',
    status: 'ready',
    component: LazyRachelEfficiencyAnalyzer
  },
  {
    id: 'rachel-workflow-validator',
    name: 'Rachel Workflow Validator',
    description: 'Workflow validation and optimization',
    category: 'micro',
    status: 'ready',
    component: LazyRachelWorkflowValidator
  },
  {
    id: 'rachel-mobile-task-manager',
    name: 'Rachel Mobile Task Manager',
    description: 'Mobile task and workflow management',
    category: 'mobile',
    status: 'ready',
    component: LazyRachelMobileTaskManager
  },
  {
    id: 'rachel-automation-metrics',
    name: 'Rachel Automation Metrics',
    description: 'Track automation effectiveness and ROI',
    category: 'admin',
    status: 'ready',
    component: LazyRachelAutomationMetrics
  },

  // Alex Rivera Components (10)
  {
    id: 'alex-change-strategy',
    name: 'Alex Change Strategy',
    description: 'AI-powered change management plans',
    category: 'core',
    status: 'ready',
    component: LazyAlexChangeStrategy
  },
  {
    id: 'alex-decision-framework',
    name: 'Alex Decision Framework',
    description: 'Strategic decision-making framework',
    category: 'core',
    status: 'ready',
    component: LazyAlexDecisionFramework
  },
  {
    id: 'alex-impact-measurement',
    name: 'Alex Impact Measurement',
    description: 'Measure and track transformation impact',
    category: 'core',
    status: 'ready',
    component: LazyAlexImpactMeasurement
  },
  {
    id: 'alex-leadership-development',
    name: 'Alex Leadership Development',
    description: 'Comprehensive leadership development',
    category: 'core',
    status: 'ready',
    component: LazyAlexLeadershipDevelopment
  },
  {
    id: 'alex-voice-change-coach',
    name: 'Alex Voice Change Coach',
    description: 'Voice-guided change management coaching',
    category: 'voice',
    status: 'ready',
    component: LazyAlexVoiceChangeCoach
  },
  {
    id: 'alex-quick-strategy',
    name: 'Alex Quick Strategy',
    description: 'Rapid strategic insights and planning',
    category: 'micro',
    status: 'ready',
    component: LazyAlexQuickStrategy
  },
  {
    id: 'alex-strategic-planning',
    name: 'Alex Strategic Planning',
    description: 'Comprehensive strategic planning tools',
    category: 'micro',
    status: 'ready',
    component: LazyAlexStrategicPlanning
  },
  {
    id: 'alex-strategy-metrics',
    name: 'Alex Strategy Metrics',
    description: 'Strategic performance measurement',
    category: 'micro',
    status: 'ready',
    component: LazyAlexStrategyMetrics
  },
  {
    id: 'alex-mobile-strategy',
    name: 'Alex Mobile Strategy',
    description: 'Mobile strategy development platform',
    category: 'mobile',
    status: 'ready',
    component: LazyAlexMobileStrategy
  },
  {
    id: 'alex-organizational-health',
    name: 'Alex Organizational Health',
    description: 'Organizational health assessment',
    category: 'admin',
    status: 'ready',
    component: LazyAlexOrganizationalHealth
  }
];

const categoryIcons = {
  core: Sparkles,
  voice: Mic,
  micro: Play,
  mobile: Smartphone,
  admin: BarChart3
};

const statusColors = {
  ready: 'bg-green-100 text-green-800',
  testing: 'bg-yellow-100 text-yellow-800',
  issues: 'bg-red-100 text-red-800'
};

const statusIcons = {
  ready: CheckCircle2,
  testing: TestTube,
  issues: AlertTriangle
};

const AIPlaygroundTest: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<TestComponent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const categories = ['all', 'core', 'voice', 'micro', 'mobile', 'admin'];
  
  const filteredComponents = selectedCategory === 'all' 
    ? testComponents 
    : testComponents.filter(c => c.category === selectedCategory);

  const renderTestComponent = (component: TestComponent) => {
    const Component = component.component;
    return (
      <div className="h-full overflow-auto">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Testing: {component.name}</h3>
          <p className="text-sm text-blue-700">{component.description}</p>
        </div>
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading {component.name}...</span>
          </div>
        }>
          <Component {...(component.props || {})} />
        </React.Suspense>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Playground Test Environment</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Testing enhanced AI Learning Playground components before production deployment
          </p>
          
          {/* Status Summary */}
          <div className="flex justify-center gap-4 mb-6">
            {Object.entries(
              testComponents.reduce((acc, comp) => {
                acc[comp.status] = (acc[comp.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => {
              const Icon = statusIcons[status as keyof typeof statusIcons];
              return (
                <Badge key={status} className={statusColors[status as keyof typeof statusColors]}>
                  <Icon className="w-4 h-4 mr-1" />
                  {count} {status}
                </Badge>
              );
            })}
          </div>
        </motion.div>

        {/* Category Filter - Mobile Optimized with Horizontal Scroll */}
        <div className="relative mb-8">
          <div 
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-4 -mx-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categories.map((category) => {
              const Icon = category === 'all' ? Database : categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize flex-shrink-0 min-h-[44px] px-4 md:px-3"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category}
                </Button>
              );
            })}
          </div>
          {/* Scroll indicators for mobile */}
          {isMobile && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component List - Mobile Optimized */}
          <div className={`lg:col-span-1 ${isMobile && selectedComponent ? 'hidden' : 'block'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Test Components</CardTitle>
                <CardDescription>
                  {isMobile ? 'Tap to test' : 'Click to test individual components'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
                {filteredComponents.map((component) => {
                  const Icon = categoryIcons[component.category];
                  const StatusIcon = statusIcons[component.status];
                  
                  return (
                    <motion.div
                      key={component.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 min-h-[80px] ${
                          selectedComponent?.id === component.id 
                            ? 'ring-2 ring-blue-500 shadow-lg' 
                            : 'hover:shadow-md active:scale-[0.98]'
                        }`}
                        onClick={() => {
                          setSelectedComponent(component);
                          if (isMobile) {
                            setMobileModalOpen(true);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-blue-600" />
                              <h3 className="font-semibold text-sm">{component.name}</h3>
                            </div>
                            <Badge className={statusColors[component.status]}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {component.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{component.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Component Preview - Mobile Optimized */}
          <div className={`lg:col-span-2 ${isMobile && !selectedComponent ? 'hidden' : 'block'}`}>
            <Card className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[800px]'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    <span className="truncate">
                      {isMobile ? 'Testing' : 'Component Testing Area'}
                    </span>
                  </div>
                  {isMobile && selectedComponent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedComponent(null);
                        setMobileModalOpen(false);
                      }}
                      className="ml-2"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="truncate">
                  {selectedComponent 
                    ? `${selectedComponent.name}` 
                    : 'Select a component from the list to test'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)] overflow-hidden">
                {selectedComponent ? (
                  renderTestComponent(selectedComponent)
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <TestTube className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Test</h3>
                    <p className="text-center">
                      Select a component from the list to see it in action.<br />
                      All components are isolated for individual testing.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testing Instructions - Mobile Responsive */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              {isMobile ? 'Test Guide' : 'Testing Instructions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">✅ Ready Components</h4>
                <p className="text-sm text-gray-600">
                  Fully implemented and tested. Ready for integration testing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-700">🧪 Testing Components</h4>
                <p className="text-sm text-gray-600">
                  Implemented but need API keys or additional configuration.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-700">📱 Mobile Testing</h4>
                <p className="text-sm text-gray-600">
                  Use browser dev tools to test responsive behavior.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-purple-700">🔧 Configuration</h4>
                <p className="text-sm text-gray-600">
                  Some features require OpenAI API keys in environment variables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPlaygroundTest;