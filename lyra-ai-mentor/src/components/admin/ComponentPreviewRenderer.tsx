/**
 * COMPONENT PREVIEW RENDERER
 * Dynamically renders generated components for testing and preview
 */

import React, { useState, useEffect } from 'react';
import { ComponentConfig } from '../../services/componentGenerationEngine';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ComponentPreviewProps {
  component: ComponentConfig;
  onClose: () => void;
}

// Mock implementations of the lesson system components for preview
const MockLessonHeader: React.FC<any> = ({ title, character, chapter, lesson, objectives, progress }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            🎭 {title}
            <Badge variant="outline">Chapter {chapter}, Lesson {lesson}</Badge>
          </CardTitle>
          <p className="text-gray-600 mt-1">with {character}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <Progress value={progress} className="w-32" />
          <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div>
        <h4 className="font-medium mb-2">🎯 Learning Objectives:</h4>
        <ul className="space-y-1">
          {objectives.map((obj: string, i: number) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

const MockInteractionPanel: React.FC<any> = ({ interaction, onComplete, onSave }) => {
  const [userInput, setUserInput] = useState('');
  const [showAI, setShowAI] = useState(false);

  const handleSubmit = () => {
    setShowAI(true);
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  };

  const getInteractionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'email-composer': '📧',
      'data-analyzer': '📊',
      'automation-builder': '⚙️',
      'voice-interface': '🎤',
      'conversation-handler': '💬'
    };
    return icons[type] || '🤖';
  };

  return (
    <Card className="border-2 border-dashed border-blue-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getInteractionIcon(interaction.type)} {interaction.type.replace('-', ' ').toUpperCase()}
          <Badge variant="outline">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Scenario:</h4>
          <p className="text-gray-700">{interaction.content}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Your Response:</label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response here..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="flex-1"
            >
              Submit Response
            </Button>
            <Button 
              variant="outline"
              onClick={() => onSave?.(userInput)}
              disabled={!userInput.trim()}
            >
              💾 Save to Toolkit
            </Button>
          </div>
        </div>

        {showAI && interaction.aiResponse && (
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              🤖 AI Response from {interaction.character}:
            </h4>
            <div className="text-gray-700 whitespace-pre-wrap">
              {interaction.aiResponse.length > 300 
                ? interaction.aiResponse.substring(0, 300) + '...' 
                : interaction.aiResponse}
            </div>
            {interaction.aiResponse.length > 300 && (
              <Button variant="link" className="p-0 h-auto text-blue-600">
                Show full response
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockSaveToToolkit: React.FC<any> = ({ content, onSave }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm">💾 Save to MyToolkit</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-gray-600 mb-2">
        Save your progress and insights for later reference.
      </p>
      <Button 
        size="sm" 
        variant="outline" 
        className="w-full"
        onClick={() => onSave?.(content)}
      >
        Save Current Progress
      </Button>
    </CardContent>
  </Card>
);

export const ComponentPreviewRenderer: React.FC<ComponentPreviewProps> = ({ component, onClose }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // Parse the component data to extract lesson information
  const parseLessonData = () => {
    try {
      // First, try to extract from the component object itself (this is more reliable)
      console.log('🔍 Parsing component data:', component);
      
      // Check if we have raw prototype data in the component
      let objectives = ['Learn and practice new skills', 'Apply knowledge in real scenarios', 'Build confidence with AI tools'];
      let stages = [];

      // Try to extract objectives from component code
      const objectivesMatch = component.componentCode.match(/const objectives = (\[[\s\S]*?\]);/);
      if (objectivesMatch) {
        try {
          objectives = JSON.parse(objectivesMatch[1].replace(/`/g, '"'));
        } catch (e) {
          console.warn('Failed to parse objectives from component code');
        }
      }

      // Create introduction stage
      stages.push({
        id: 'introduction',
        title: `Welcome to ${component.name}`,
        character: component.character,
        content: `Welcome! I'm ${component.character}, and today we're going to work through some practical scenarios together.`,
        type: 'introduction'
      });

      // Try to extract interaction data from component code or use component character to determine types
      const characterInteractionMap: Record<string, Array<{type: string, title: string, content: string}>> = {
        'Maya': [
          {
            type: 'email-composer',
            title: 'Professional Email Challenge',
            content: 'Write a delicate email to a major donor who expressed concerns about our program effectiveness after reading negative media coverage'
          },
          {
            type: 'conversation-handler', 
            title: 'Difficult Conversation Navigation',
            content: 'Handle a tense board meeting where members are questioning leadership decisions and budget allocation'
          }
        ],
        'Sofia': [
          {
            type: 'voice-interface',
            title: 'Voice System Design Challenge',
            content: 'Design a voice-activated volunteer check-in system for a food bank that serves Spanish and English speaking communities'
          },
          {
            type: 'automation-builder',
            title: 'Accessibility Automation',
            content: 'Create an automated phone system that helps elderly clients navigate our transportation services'
          }
        ],
        'David': [
          {
            type: 'data-analyzer',
            title: 'Data Detective Challenge',
            content: 'Investigate why our youth mentoring program shows great attendance but poor long-term outcomes - what does the data reveal?'
          },
          {
            type: 'email-composer',
            title: 'Data Storytelling Challenge', 
            content: 'Present data findings about declining volunteer retention to the board in a way that motivates action rather than blame'
          }
        ],
        'Rachel': [
          {
            type: 'automation-builder',
            title: 'Workflow Automation Challenge',
            content: 'Design a complete new donor onboarding automation that personalizes the experience based on donation source and amount'
          },
          {
            type: 'automation-builder',
            title: 'System Integration Challenge',
            content: 'Create an automated volunteer scheduling system that handles availability, skills matching, and reminder communications'
          }
        ],
        'Alex': [
          {
            type: 'conversation-handler',
            title: 'Change Management Challenge',
            content: 'Handle a staff meeting where long-term employees express fear that AI tools will replace their jobs or devalue their experience'
          },
          {
            type: 'email-composer',
            title: 'Strategic Communication Challenge',
            content: 'Communicate a new AI tools policy to the board that addresses ethical concerns while showing potential impact'
          }
        ]
      };

      // Get character-specific interactions
      const characterInteractions = characterInteractionMap[component.character] || characterInteractionMap['Maya'];
      
      // Add interaction stages based on character
      characterInteractions.forEach((interaction, index) => {
        stages.push({
          id: `interaction_${index + 1}`,
          title: interaction.title,
          character: component.character,
          content: interaction.content,
          type: interaction.type,
          aiResponse: `Thank you for your thoughtful response! I can see you're really understanding how to apply ${component.character === 'Maya' ? 'tone mastery and relationship building' : component.character === 'Sofia' ? 'voice technology and accessibility' : component.character === 'David' ? 'data analysis and storytelling' : component.character === 'Rachel' ? 'automation and workflow optimization' : 'change management and leadership'} principles in real-world situations. This kind of practical application is exactly what will make you more effective in your nonprofit work.`
        });
      });

      console.log('✅ Parsed stages:', stages);
      return { objectives, stages };
    } catch (error) {
      console.error('Error parsing lesson data:', error);
      return {
        objectives: ['Learn and practice new skills'],
        stages: [{
          id: 'introduction',
          title: component.name,
          character: component.character,
          content: 'Welcome to this interactive lesson!',
          type: 'introduction'
        }]
      };
    }
  };

  const { objectives, stages } = parseLessonData();

  const handleStageComplete = (stageId: string) => {
    setCompletedStages(prev => new Set(prev).add(stageId));
    
    const newProgress = ((completedStages.size + 1) / stages.length) * 100;
    setProgress(newProgress);
    
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(currentStage + 1), 500);
    }
  };

  const handleSaveToToolkit = (content: any) => {
    setSavedItems(prev => [...prev, {
      id: Date.now(),
      content,
      timestamp: new Date(),
      stage: stages[currentStage]?.title
    }]);
    
    // Show success message (you could use a toast here)
    console.log('💾 Saved to toolkit:', content);
  };

  const currentStageData = stages[currentStage];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{component.name} - Live Preview</h2>
            <p className="text-gray-600">Character: {component.character}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            ✕ Close Preview
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="preview">🎭 Live Preview</TabsTrigger>
              <TabsTrigger value="data">📊 Component Data</TabsTrigger>
              <TabsTrigger value="toolkit">💾 Saved Items ({savedItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-6">
              {/* Lesson Header */}
              <MockLessonHeader
                title={component.name}
                character={component.character}
                chapter={2}
                lesson={1}
                objectives={objectives}
                progress={progress}
              />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {currentStageData && (
                    <>
                      <Card className="mb-4">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            🎭 {currentStageData.character}
                            <Badge variant="outline">
                              Stage {currentStage + 1} of {stages.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg mb-4">{currentStageData.content}</p>
                          
                          {currentStageData.type === 'introduction' ? (
                            <Button 
                              onClick={() => handleStageComplete(currentStageData.id)}
                              className="w-full"
                            >
                              Let's Begin! 🚀
                            </Button>
                          ) : (
                            <MockInteractionPanel
                              interaction={currentStageData}
                              onComplete={() => handleStageComplete(currentStageData.id)}
                              onSave={handleSaveToToolkit}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>📈 Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progress} className="mb-2" />
                      <p className="text-sm text-gray-600">
                        {completedStages.size} of {stages.length} completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🎯 Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-500">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <MockSaveToToolkit
                    content={{ stage: currentStageData, progress }}
                    onSave={handleSaveToToolkit}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>📋 Component Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {component.name}</div>
                    <div><strong>Character:</strong> {component.character}</div>
                    <div><strong>File Path:</strong> {component.filepath}</div>
                    <div><strong>Route:</strong> {component.routePath}</div>
                    <div><strong>Imports:</strong> {component.imports.length} modules</div>
                    <div><strong>Interfaces:</strong> {component.interfaces.length} types</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🎯 Lesson Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Stages:</strong> {stages.length}</div>
                    <div><strong>Objectives:</strong> {objectives.length}</div>
                    <div><strong>Character:</strong> {component.character}</div>
                    <div><strong>Interactive Elements:</strong> {stages.filter(s => s.type !== 'introduction').length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>📚 Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {objectives.map((obj, index) => (
                      <li key={index} className="text-sm">{index + 1}. {obj}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="toolkit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>💾 MyToolkit Saved Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No items saved yet. Complete some interactions to see saved content here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {savedItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{item.stage}</Badge>
                            <span className="text-xs text-gray-500">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {typeof item.content === 'string' 
                              ? item.content 
                              : JSON.stringify(item.content, null, 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ComponentPreviewRenderer;