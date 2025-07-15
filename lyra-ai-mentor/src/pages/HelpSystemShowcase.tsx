import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip, createHelpContent } from '@/components/ui/HelpTooltip';
import { ContextualHelp, ProgressAwareHelp } from '@/components/ui/ContextualHelp';
import { TutorialOverlay, useTutorial, createAIToolTutorial } from '@/components/ui/TutorialOverlay';
import { HelpProvider, useSmartHelp } from '@/contexts/HelpContext';
import { characterHelpContent, aiHelpContent } from '@/utils/helpContent';
import { Info, Lightbulb, PlayCircle, RefreshCw } from 'lucide-react';

// Demo component that uses the help system
const DemoAITool: React.FC = () => {
  const { shouldShowTutorial, startTutorial, dismissTutorial } = useSmartHelp('demo-ai-tool');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = ['Enter prompt', 'Select options', 'Generate', 'Review'];

  // Start tutorial if it's the user's first time
  React.useEffect(() => {
    if (shouldShowTutorial) {
      const tutorialSteps = createAIToolTutorial('Demo AI Tool');
      startTutorial(tutorialSteps);
      dismissTutorial();
    }
  }, [shouldShowTutorial, startTutorial, dismissTutorial]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader data-tutorial="tool-header">
        <HelpTooltip
          content={createHelpContent(
            'Demo AI Tool',
            'This tool demonstrates how our help system works with AI features.',
            {
              whatIs: 'A demonstration of integrated help features including tooltips, contextual help, and tutorials.',
              whyItMatters: 'Good help systems reduce user frustration and increase feature adoption.',
              howToUse: [
                'Hover over any (i) icon for quick tips',
                'Click (i) for detailed explanations',
                'Watch for contextual suggestions',
                'Complete the tutorial for full understanding'
              ]
            }
          )}
        >
          <CardTitle className="text-2xl">Demo AI Tool</CardTitle>
        </HelpTooltip>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress tracking */}
        <ProgressAwareHelp
          completedSteps={completedSteps}
          totalSteps={steps}
          currentStep={steps[completedSteps.length] || 'Complete'}
        />

        {/* Input area */}
        <div data-tutorial="input-area" className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Enter your prompt
            <HelpTooltip
              content={aiHelpContent.prompt}
              variant="inline"
              iconSize="sm"
            />
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (!completedSteps.includes('Enter prompt') && e.target.value) {
                setCompletedSteps([...completedSteps, 'Enter prompt']);
              }
            }}
            className="w-full h-24 p-3 border rounded-lg"
            placeholder="What would you like the AI to help with?"
          />
        </div>

        {/* Options */}
        <div data-tutorial="options" className="space-y-2">
          <label className="text-sm font-medium">Options</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!completedSteps.includes('Select options')) {
                  setCompletedSteps([...completedSteps, 'Select options']);
                }
              }}
            >
              Professional
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!completedSteps.includes('Select options')) {
                  setCompletedSteps([...completedSteps, 'Select options']);
                }
              }}
            >
              Creative
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!completedSteps.includes('Select options')) {
                  setCompletedSteps([...completedSteps, 'Select options']);
                }
              }}
            >
              Concise
            </Button>
          </div>
        </div>

        {/* Generate button */}
        <Button
          data-tutorial="generate-button"
          onClick={() => {
            setOutput('This is an AI-generated response based on your input!');
            if (!completedSteps.includes('Generate')) {
              setCompletedSteps([...completedSteps, 'Generate']);
            }
          }}
          className="w-full"
          disabled={!input}
        >
          Generate Response
        </Button>

        {/* Output area */}
        {output && (
          <div data-tutorial="output-area" className="space-y-2">
            <label className="text-sm font-medium">AI Response</label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p>{output}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!completedSteps.includes('Review')) {
                  setCompletedSteps([...completedSteps, 'Review']);
                }
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}

        {/* Help button for tutorial */}
        <div data-tutorial="help-button" className="flex justify-end">
          <HelpTooltip
            content={createHelpContent(
              'Need More Help?',
              'Click to restart the tutorial or access additional resources.'
            )}
            variant="button"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main showcase page
const HelpSystemShowcase: React.FC = () => {
  const [showContextualHelp, setShowContextualHelp] = useState(true);
  const { isActive, startTutorial, resetTutorial } = useTutorial('showcase-tutorial');

  const showcaseTutorialSteps = [
    {
      id: 'intro',
      target: '[data-showcase="title"]',
      title: 'Welcome to the Help System',
      content: 'This showcase demonstrates all the help features available in our AI tools.',
      position: 'bottom' as const
    },
    {
      id: 'tooltips',
      target: '[data-showcase="tooltip-demo"]',
      title: 'Help Tooltips',
      content: 'Hover over (i) icons for quick help. Click them for detailed explanations.',
      position: 'right' as const
    },
    {
      id: 'contextual',
      target: '[data-showcase="contextual-demo"]',
      title: 'Contextual Help',
      content: 'Smart suggestions appear based on your progress and usage patterns.',
      position: 'left' as const
    },
    {
      id: 'tutorial',
      target: '[data-showcase="tutorial-demo"]',
      title: 'Interactive Tutorials',
      content: 'Step-by-step guidance for first-time users of any feature.',
      position: 'top' as const
    }
  ];

  return (
    <HelpProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div data-showcase="title" className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Help System Showcase
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive help features for AI tools
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => startTutorial()}
                className="gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Start Showcase Tour
              </Button>
              <Button
                onClick={() => {
                  resetTutorial();
                  window.location.reload();
                }}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All Tutorials
              </Button>
            </div>
          </div>

          {/* Tooltip Examples */}
          <Card data-showcase="tooltip-demo">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Help Tooltip Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic tooltip */}
                <div className="space-y-2">
                  <HelpTooltip
                    content={{
                      title: 'Basic Help',
                      quickHelp: 'This is a simple help tooltip with just quick information.'
                    }}
                  >
                    <h3 className="font-medium">Basic Tooltip</h3>
                  </HelpTooltip>
                  <p className="text-sm text-gray-600">
                    Hover over the title to see quick help
                  </p>
                </div>

                {/* Detailed tooltip */}
                <div className="space-y-2">
                  <HelpTooltip
                    content={aiHelpContent.prompt}
                  >
                    <h3 className="font-medium">Detailed Tooltip</h3>
                  </HelpTooltip>
                  <p className="text-sm text-gray-600">
                    Click the (i) icon for comprehensive help
                  </p>
                </div>

                {/* Character-specific help */}
                <div className="space-y-2">
                  <HelpTooltip
                    content={characterHelpContent.maya.emailRecipe}
                  >
                    <h3 className="font-medium">Maya's Email Recipe</h3>
                  </HelpTooltip>
                  <p className="text-sm text-gray-600">
                    Character-specific tool guidance
                  </p>
                </div>

                {/* Inline help button */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Inline Help Button</h3>
                    <HelpTooltip
                      content={aiHelpContent.temperature}
                      variant="inline"
                      iconSize="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Minimal inline help icons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contextual Help Demo */}
          <Card data-showcase="contextual-demo">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Contextual Help Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showContextualHelp && (
                <ContextualHelp
                  toolId="showcase-demo"
                  toolCategory="email"
                  userProgress={{
                    completedTools: ['tool1', 'tool2'],
                    currentTool: 'showcase-demo'
                  }}
                  usageStats={{
                    count: 3,
                    lastUsed: new Date(Date.now() - 86400000) // Yesterday
                  }}
                  onDismiss={() => setShowContextualHelp(false)}
                />
              )}
              
              <Button
                onClick={() => setShowContextualHelp(true)}
                variant="outline"
                size="sm"
              >
                Show Contextual Help Again
              </Button>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Smart tips based on usage patterns</li>
                  <li>• Progress-aware suggestions</li>
                  <li>• Rotating helpful hints</li>
                  <li>• Usage statistics tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <div data-showcase="tutorial-demo">
            <h2 className="text-2xl font-bold mb-4">Try the Interactive Demo</h2>
            <DemoAITool />
          </div>
        </div>

        {/* Tutorial overlay */}
        <TutorialOverlay
          steps={showcaseTutorialSteps}
          isActive={isActive}
          onComplete={() => {}}
          persistKey="showcase-tutorial"
        />
      </div>
    </HelpProvider>
  );
};

export default HelpSystemShowcase;