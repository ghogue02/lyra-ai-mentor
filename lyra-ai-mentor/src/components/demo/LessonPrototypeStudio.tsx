/**
 * LESSON PROTOTYPE STUDIO
 * 
 * Rapid prototyping environment for testing lesson concepts with live AI.
 * This is where Greg brainstorms and iterates on ideas before production.
 * 
 * Features:
 * - Live AI connections (no mock data)
 * - Real-time iteration
 * - Component testing playground
 * - Swarm coordination for content generation
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Save, 
  Zap, 
  Brain, 
  Users, 
  MessageCircle, 
  Code, 
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MCPSwarmController } from '@/orchestration/MCPSwarmController';
import { RulesEngineManager } from '@/config/rulesEngine';
import { LiveAIService } from '@/services/liveAIService';

// Demo prototype types
interface DemoPrototype {
  id: string;
  name: string;
  concept: string;
  character: string;
  objectives: string[];
  interactions: InteractionTest[];
  status: 'draft' | 'testing' | 'approved' | 'failed';
  results: TestResult[];
  swarmData: any;
}

interface InteractionTest {
  id: string;
  type: 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
  prompt: string;
  aiResponse: string | null;
  userInput: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: Date;
}

interface TestResult {
  interactionId: string;
  success: boolean;
  qualityScore: number;
  feedback: string;
  metrics: any;
}

interface SwarmStatus {
  active: boolean;
  agents: number;
  currentTask: string | null;
  performance: any;
}

export const LessonPrototypeStudio: React.FC = () => {
  // State management
  const [currentDemo, setCurrentDemo] = useState<DemoPrototype | null>(null);
  const [demos, setDemos] = useState<DemoPrototype[]>([]);
  const [swarmStatus, setSwarmStatus] = useState<SwarmStatus>({ active: false, agents: 0, currentTask: null, performance: null });
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState('concept');

  // Form state for new demo creation
  const [newDemo, setNewDemo] = useState({
    name: '',
    concept: '',
    character: 'Maya',
    objectives: ['']
  });

  // Services
  const swarmController = useRef(MCPSwarmController.getInstance());
  const rulesEngine = useRef(RulesEngineManager.getInstance());
  const liveAIService = useRef(LiveAIService.getInstance());

  // Available characters and interaction types
  const characters = ['Maya', 'Sofia', 'David', 'Rachel', 'Alex'];
  const interactionTypes = [
    { id: 'email-composer', label: 'Email Composer', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'data-analyzer', label: 'Data Analyzer', icon: <Brain className="w-4 h-4" /> },
    { id: 'automation-builder', label: 'Automation Builder', icon: <Zap className="w-4 h-4" /> },
    { id: 'voice-interface', label: 'Voice Interface', icon: <Users className="w-4 h-4" /> },
    { id: 'conversation-handler', label: 'Conversation Handler', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  // Initialize swarm system
  useEffect(() => {
    initializeSwarmSystem();
  }, []);

  const initializeSwarmSystem = async () => {
    try {
      setIsInitializing(true);
      console.log('🚀 Initializing Demo Studio Swarm System...');
      
      // Initialize the swarm controller
      await swarmController.current.initializeSwarmSystem();
      
      // Get initial status
      const status = await swarmController.current.getSwarmStatus();
      setSwarmStatus({
        active: true,
        agents: status.workflow?.memory?.demosInProgress || 0,
        currentTask: null,
        performance: status.components
      });

      const apiStatus = liveAIService.current.getAPIStatus();
      console.log('✅ Demo Studio ready for prototyping');
      console.log('🔗 Live AI Status:', {
        OpenAI: apiStatus.openai.available ? `Available (${apiStatus.openai.model})` : 'Not configured',
        Endpoint: apiStatus.openai.endpoint
      });
      
      if (!apiStatus.openai.available) {
        console.warn('⚠️ OpenAI API key not configured. Add REACT_APP_OPENAI_API_KEY to .env for live AI responses.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize swarm system:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // Create new demo prototype
  const createNewDemo = async () => {
    if (!newDemo.name || !newDemo.concept) return;

    try {
      const demoId = await swarmController.current.startLessonDevelopment(
        newDemo.concept,
        newDemo.character,
        newDemo.objectives.filter(obj => obj.trim() !== '')
      );

      const demo: DemoPrototype = {
        id: demoId,
        name: newDemo.name,
        concept: newDemo.concept,
        character: newDemo.character,
        objectives: newDemo.objectives.filter(obj => obj.trim() !== ''),
        interactions: [],
        status: 'draft',
        results: [],
        swarmData: {}
      };

      setDemos(prev => [...prev, demo]);
      setCurrentDemo(demo);
      setActiveTab('interactions');

      // Reset form
      setNewDemo({
        name: '',
        concept: '',
        character: 'Maya',
        objectives: ['']
      });

      console.log('✅ New demo created:', demo.name);
    } catch (error) {
      console.error('❌ Failed to create demo:', error);
    }
  };

  // Add interaction to current demo
  const addInteraction = async (type: string, prompt: string) => {
    if (!currentDemo) return;

    const interaction: InteractionTest = {
      id: `interaction_${Date.now()}`,
      type: type as any,
      prompt,
      aiResponse: null,
      userInput: {},
      status: 'pending',
      timestamp: new Date()
    };

    setCurrentDemo(prev => prev ? {
      ...prev,
      interactions: [...prev.interactions, interaction]
    } : null);

    // Execute interaction with live AI
    await executeInteraction(interaction.id);
  };

  // Execute interaction with live AI through swarm
  const executeInteraction = async (interactionId: string) => {
    if (!currentDemo) return;

    const interaction = currentDemo.interactions.find(i => i.id === interactionId);
    if (!interaction) return;

    try {
      // Update status to running
      setCurrentDemo(prev => prev ? {
        ...prev,
        interactions: prev.interactions.map(i => 
          i.id === interactionId ? { ...i, status: 'running' } : i
        )
      } : null);

      // Execute through LIVE AI with swarm coordination
      console.log('🧠 Executing LIVE AI interaction through swarm:', interaction.type);
      
      // LIVE AI EXECUTION - Real API calls
      const liveAIResponse = await liveAIService.current.executeInteraction({
        id: interaction.id,
        type: interaction.type,
        prompt: interaction.prompt,
        character: currentDemo.character,
        timestamp: interaction.timestamp
      });

      // Update interaction with response
      setCurrentDemo(prev => prev ? {
        ...prev,
        interactions: prev.interactions.map(i => 
          i.id === interactionId ? { 
            ...i, 
            status: 'completed',
            aiResponse: liveAIResponse 
          } : i
        )
      } : null);

      console.log('✅ LIVE AI interaction completed:', interactionId);
    } catch (error) {
      console.error('❌ LIVE AI interaction failed:', error);
      
      // Update status to failed
      setCurrentDemo(prev => prev ? {
        ...prev,
        interactions: prev.interactions.map(i => 
          i.id === interactionId ? { ...i, status: 'failed' } : i
        )
      } : null);
    }
  };


  // Move demo to prototype phase
  const moveToPrototype = async () => {
    if (!currentDemo) return;

    try {
      await swarmController.current.moveToPrototype(currentDemo.id);
      
      setCurrentDemo(prev => prev ? {
        ...prev,
        status: 'testing'
      } : null);

      console.log('🚀 Demo moved to prototype phase');
    } catch (error) {
      console.error('❌ Failed to move to prototype:', error);
    }
  };

  // Approve demo for production
  const approveForProduction = async () => {
    if (!currentDemo) return;

    try {
      const lessonId = await swarmController.current.generateProductionLesson(currentDemo.id);
      
      setCurrentDemo(prev => prev ? {
        ...prev,
        status: 'approved'
      } : null);

      console.log('✅ Demo approved for production. Lesson ID:', lessonId);
    } catch (error) {
      console.error('❌ Failed to approve for production:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎭 Lesson Prototype Studio</h1>
          <p className="text-gray-600">🔴 LIVE AI Integration • Real-time Prototyping • Brainstorm → Test → Approve → Generate</p>
        </div>
        
        {/* Swarm Status */}
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Swarm System</span>
              <Badge variant={swarmStatus.active ? 'default' : 'secondary'}>
                {swarmStatus.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              {swarmStatus.agents} agents • {swarmStatus.currentTask || 'Ready for tasks'}
            </div>
            {isInitializing && (
              <div className="mt-2">
                <Progress value={50} className="h-1" />
                <div className="text-xs text-gray-500 mt-1">Initializing...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demo List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Prototypes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demos.map(demo => (
                <motion.div
                  key={demo.id}
                  onClick={() => setCurrentDemo(demo)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentDemo?.id === demo.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{demo.name}</span>
                    <Badge 
                      variant={
                        demo.status === 'approved' ? 'default' : 
                        demo.status === 'testing' ? 'secondary' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {demo.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    {demo.character} • {demo.interactions.length} interactions
                  </div>
                </motion.div>
              ))}
              
              {demos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No demos yet</p>
                  <p className="text-xs">Create your first prototype</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="concept">Concept</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
            </TabsList>

            {/* Concept Creation Tab */}
            <TabsContent value="concept" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Demo Name</label>
                    <Input
                      placeholder="e.g., Sofia Voice Discovery Workshop"
                      value={newDemo.name}
                      onChange={(e) => setNewDemo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Character</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={newDemo.character}
                      onChange={(e) => setNewDemo(prev => ({ ...prev, character: e.target.value }))}
                    >
                      {characters.map(char => (
                        <option key={char} value={char}>{char}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Concept Description</label>
                    <Textarea
                      placeholder="Describe the lesson concept, learning objectives, and key interactions you want to test..."
                      rows={4}
                      value={newDemo.concept}
                      onChange={(e) => setNewDemo(prev => ({ ...prev, concept: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Learning Objectives</label>
                    {newDemo.objectives.map((obj, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder={`Objective ${index + 1}`}
                          value={obj}
                          onChange={(e) => {
                            const newObjectives = [...newDemo.objectives];
                            newObjectives[index] = e.target.value;
                            setNewDemo(prev => ({ ...prev, objectives: newObjectives }));
                          }}
                        />
                        {index === newDemo.objectives.length - 1 && (
                          <Button
                            variant="outline"
                            onClick={() => setNewDemo(prev => ({ 
                              ...prev, 
                              objectives: [...prev.objectives, ''] 
                            }))}
                          >
                            +
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={createNewDemo}
                    disabled={!newDemo.name || !newDemo.concept || isInitializing}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Demo with Swarm
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interactions Testing Tab */}
            <TabsContent value="interactions" className="space-y-6">
              {currentDemo ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{currentDemo.name}</span>
                        <Badge>{currentDemo.character}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{currentDemo.concept}</p>
                      
                      {/* Add Interaction */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Test Interactions</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {interactionTypes.map(type => (
                            <Button
                              key={type.id}
                              variant="outline"
                              onClick={() => {
                                const prompt = window.prompt(`Enter prompt for ${type.label}:`);
                                if (prompt) addInteraction(type.id, prompt);
                              }}
                              className="justify-start"
                            >
                              {type.icon}
                              <span className="ml-2">{type.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interaction Results */}
                  <div className="space-y-4">
                    {currentDemo.interactions.map(interaction => (
                      <Card key={interaction.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{interaction.type}</Badge>
                              <span className="text-sm font-medium">
                                {interaction.status === 'running' && <RefreshCw className="w-4 h-4 animate-spin" />}
                                {interaction.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {interaction.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              </span>
                            </div>
                            {interaction.status === 'pending' && (
                              <Button size="sm" onClick={() => executeInteraction(interaction.id)}>
                                <Play className="w-4 h-4 mr-1" />
                                Test
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-medium text-gray-600">PROMPT:</span>
                              <p className="text-sm">{interaction.prompt}</p>
                            </div>
                            
                            {interaction.aiResponse && (
                              <div>
                                <span className="text-xs font-medium text-gray-600">AI RESPONSE:</span>
                                <div className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                                  <pre className="whitespace-pre-wrap font-sans">{interaction.aiResponse}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {currentDemo.interactions.length > 0 && (
                    <div className="flex gap-3">
                      <Button 
                        onClick={moveToPrototype}
                        disabled={currentDemo.status !== 'draft'}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Move to Prototype
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Select a demo or create a new one to start testing interactions</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Results and analytics will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Production Tab */}
            <TabsContent value="production" className="space-y-6">
              {currentDemo?.status === 'testing' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready for Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Demo "{currentDemo.name}" has been tested and is ready for production lesson generation.
                    </p>
                    <Button onClick={approveForProduction}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Generate Production Lesson
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      Complete testing phase to access production generation
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LessonPrototypeStudio;