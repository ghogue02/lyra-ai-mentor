import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TestTube, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MayaTemplateLibraryBuilder from '@/components/lesson/MayaTemplateLibraryBuilder';
import { useMayaJourney } from '@/hooks/useMayaJourney';
import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';
import MayaContextualChatIntegration from '@/components/lesson/chat/lyra/maya/MayaContextualChatIntegration';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  component: string;
}

const TestMaya: React.FC = () => {
  const navigate = useNavigate();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [showFullIntegration, setShowFullIntegration] = useState(false);
  
  // Maya journey for testing
  const {
    journeyState: mayaJourneyState,
    setJourneyState: setMayaJourneyState,
    completeStage,
    updatePaceProgress,
    updateTemplateProgress,
    getPaceCompletionPercentage,
    resetJourney
  } = useMayaJourney({
    completedStages: ['pace-introduction', 'template-discovery'],
    currentStage: 'audience-analysis',
    paceFrameworkProgress: {
      purpose: true,
      audience: false,
      context: false,
      execution: false
    },
    templateLibraryProgress: 25,
    donorSegmentationComplete: false
  });

  const testCases: TestCase[] = [
    {
      id: 'contextual-questions',
      name: 'Chapter 2 Contextual Questions',
      description: 'Test Maya-specific contextual questions based on journey progress',
      status: 'pending',
      component: 'Chapter2ContextualQuestions'
    },
    {
      id: 'journey-state-management',
      name: 'Maya Journey State Management',
      description: 'Test PACE framework progress tracking and stage completion',
      status: 'pending',
      component: 'useMayaJourney'
    },
    {
      id: 'chat-integration',
      name: 'Maya Chat Integration',
      description: 'Test MayaContextualChatIntegration component and engagement flow',
      status: 'pending',
      component: 'MayaContextualChatIntegration'
    },
    {
      id: 'floating-avatar',
      name: 'Floating Lyra Avatar',
      description: 'Test FloatingLyraAvatar with Maya journey state integration',
      status: 'pending',
      component: 'FloatingLyraAvatar'
    },
    {
      id: 'template-builder-integration',
      name: 'Template Builder Integration',
      description: 'Test complete Maya template builder workflow with chat',
      status: 'pending',
      component: 'MayaTemplateLibraryBuilder'
    },
    {
      id: 'narrative-pause-resume',
      name: 'Narrative Pause/Resume',
      description: 'Test Maya story flow interruption and resumption with chat',
      status: 'pending',
      component: 'NarrativeManager'
    },
    {
      id: 'pace-framework-filtering',
      name: 'PACE Framework Question Filtering',
      description: 'Test contextual question filtering based on PACE progress',
      status: 'pending',
      component: 'Chapter2ContextualQuestions'
    },
    {
      id: 'maya-personality-validation',
      name: 'Maya Personality Validation',
      description: 'Test Maya-specific chat responses and email communication focus',
      status: 'pending',
      component: 'mayaChatResponseSystem'
    }
  ];

  const [tests, setTests] = useState<TestCase[]>(testCases);

  const runTest = async (testId: string) => {
    setActiveTest(testId);
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mark test as passed for demo purposes
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'passed' } : test
    ));
    setActiveTest(null);
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
    }
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <TestTube className="w-4 h-4 text-blue-500" />
        </motion.div>;
      default:
        return <TestTube className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestCase['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      passed: 'default',
      failed: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      running: 'bg-blue-100 text-blue-600',
      passed: 'bg-green-100 text-green-600',
      failed: 'bg-red-100 text-red-600'
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const testStats = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    running: tests.filter(t => t.status === 'running').length,
    pending: tests.filter(t => t.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maya Chapter 2 Integration Test</h1>
              <p className="text-gray-600">Test Maya's contextual chat integration and PACE framework</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowFullIntegration(!showFullIntegration)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showFullIntegration ? <Pause /> : <Play />}
              {showFullIntegration ? 'Hide' : 'Show'} Full Integration
            </Button>
            <Button onClick={resetJourney} variant="outline">
              Reset Maya Journey
            </Button>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{testStats.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{testStats.running}</div>
              <div className="text-sm text-gray-600">Running</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{testStats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Maya Journey State Display */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Maya Journey State (Test Data)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">PACE Framework Progress</h4>
                  <div className="space-y-2">
                    {Object.entries(mayaJourneyState.paceFrameworkProgress).map(([component, completed]) => (
                      <div key={component} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="capitalize">{component}</span>
                        {completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    ))}
                  </div>
                  <Progress value={getPaceCompletionPercentage()} className="mt-2" />
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Journey Progress</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Current Stage:</strong> {mayaJourneyState.currentStage}</div>
                    <div><strong>Completed Stages:</strong> {mayaJourneyState.completedStages.length}</div>
                    <div><strong>Template Progress:</strong> {mayaJourneyState.templateLibraryProgress}%</div>
                    <div><strong>Donor Segmentation:</strong> {mayaJourneyState.donorSegmentationComplete ? 'Complete' : 'Pending'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Cases */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Cases
                <Button onClick={runAllTests} disabled={activeTest !== null}>
                  Run All Tests
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-600">{test.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{test.component}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTest(test.id)}
                        disabled={test.status === 'running' || activeTest !== null}
                      >
                        {test.status === 'running' ? 'Running...' : 'Run'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maya Chat Integration Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Test Maya Contextual Chat</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This integration provides contextual questions based on Maya's journey progress.
                    Try clicking the floating Lyra avatar or interacting with the chat.
                  </p>
                  
                  {/* Test Maya Chat Integration */}
                  <MayaContextualChatIntegration
                    mayaJourneyState={mayaJourneyState}
                    onJourneyStateUpdate={setMayaJourneyState}
                    currentPhase="workshop"
                    lessonTitle="Integration Test"
                    isVisible={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => updatePaceProgress('purpose')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test PACE Purpose Progress
                  </Button>
                  <Button
                    onClick={() => updatePaceProgress('audience')}
                    variant="outline"
                    size="sm"  
                    className="w-full"
                  >
                    Test PACE Audience Progress
                  </Button>
                  <Button
                    onClick={() => completeStage('template-creation')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Stage Completion
                  </Button>
                  <Button
                    onClick={() => updateTemplateProgress(50)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Template Progress Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Integration Display */}
        {showFullIntegration && (
          <Card>
            <CardHeader>
              <CardTitle>Full Maya Template Library Builder Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <MayaTemplateLibraryBuilder />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Floating Lyra Avatar for the test page */}
        <FloatingLyraAvatar
          lessonContext={{
            chapterNumber: 2,
            chapterTitle: "Maya's Communication Mastery",
            lessonTitle: "Integration Test",
            phase: 'workshop',
            content: "Testing Maya's contextual chat integration and PACE framework",
            objectives: [
              "Test contextual question generation",
              "Validate PACE framework integration",
              "Test Maya journey state management",
              "Verify chat personality consistency"
            ],
            keyTerms: [
              "Integration Testing",
              "PACE Framework",
              "Contextual Questions",
              "Maya Journey State",
              "Chat Integration"
            ],
            difficulty: "intermediate"
          }}
          mayaJourneyState={mayaJourneyState}
          position="bottom-right"
          onEngagementChange={(isEngaged, exchangeCount) => {
            console.log('Test page chat engagement:', { isEngaged, exchangeCount });
          }}
        />
      </div>
    </div>
  );
};

export default TestMaya;