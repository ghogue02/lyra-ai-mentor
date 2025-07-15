import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, Lightbulb, AlertTriangle, CheckCircle2, 
  Sparkles, BarChart3, Heart, Zap, Target,
  Info, RefreshCw, Code2
} from 'lucide-react';
import { AIComponentErrorBoundary } from '@/components/ai-playground/AIComponentErrorBoundary';
import { ExampleSelector } from '@/components/ai-playground/ExampleSelector';
import { AIExample, getCharacterExamples } from '@/services/aiExamplesService';
import { AIServiceError } from '@/services/aiErrorHandler';
import { toast } from 'sonner';

// Mock component that can throw errors for demonstration
const ErrorProneComponent: React.FC<{ shouldError: boolean; errorType: string }> = ({ shouldError, errorType }) => {
  if (shouldError) {
    switch (errorType) {
      case 'network':
        throw new Error('Network request failed');
      case 'rate':
        throw new Error('Rate limit exceeded');
      case 'api':
        throw new AIServiceError('API_ERROR', 'API Error', 'The AI service is unavailable', { statusCode: 503 });
      default:
        throw new Error('Unknown error occurred');
    }
  }
  
  return (
    <div className="p-6 bg-green-50 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <h3 className="font-semibold text-green-900">Component Working Perfectly!</h3>
      </div>
      <p className="text-green-700">
        This component is functioning normally. Try triggering different error types to see how they're handled.
      </p>
    </div>
  );
};

export function AIErrorHandlingDemo() {
  const [shouldError, setShouldError] = useState(false);
  const [errorType, setErrorType] = useState('network');
  const [selectedExample, setSelectedExample] = useState<AIExample | null>(null);
  const [characterForExample, setCharacterForExample] = useState<'maya' | 'sofia' | 'david' | 'rachel' | 'alex'>('maya');

  const handleExampleSelect = (example: AIExample) => {
    setSelectedExample(example);
    toast.success(`Example loaded: ${example.title}`);
  };

  const triggerError = (type: string) => {
    setErrorType(type);
    setShouldError(true);
  };

  const resetComponent = () => {
    setShouldError(false);
  };

  const characterInfo = {
    maya: { name: 'Maya', color: 'purple', icon: Heart },
    sofia: { name: 'Sofia', color: 'pink', icon: Sparkles },
    david: { name: 'David', color: 'blue', icon: BarChart3 },
    rachel: { name: 'Rachel', color: 'green', icon: Zap },
    alex: { name: 'Alex', color: 'orange', icon: Target }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Error Handling & Examples Demo
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive error handling and pre-filled examples for all AI components
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="error-handling" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="error-handling">
              <Shield className="w-4 h-4 mr-2" />
              Error Handling
            </TabsTrigger>
            <TabsTrigger value="examples">
              <Lightbulb className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="implementation">
              <Code2 className="w-4 h-4 mr-2" />
              Implementation
            </TabsTrigger>
          </TabsList>

          {/* Error Handling Tab */}
          <TabsContent value="error-handling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Boundary Demonstration</CardTitle>
                <CardDescription>
                  See how different error types are handled gracefully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Error Trigger Buttons */}
                <div>
                  <h3 className="font-semibold mb-3">Trigger Different Error Types:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => triggerError('network')}
                      className="justify-start"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Network Error
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => triggerError('rate')}
                      className="justify-start"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Rate Limit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => triggerError('api')}
                      className="justify-start"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      API Error
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => triggerError('unknown')}
                      className="justify-start"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Unknown Error
                    </Button>
                  </div>
                </div>

                {/* Component with Error Boundary */}
                <div>
                  <h3 className="font-semibold mb-3">Component with Error Boundary:</h3>
                  <AIComponentErrorBoundary 
                    componentName="DemoComponent" 
                    onReset={resetComponent}
                  >
                    <ErrorProneComponent 
                      shouldError={shouldError} 
                      errorType={errorType} 
                    />
                  </AIComponentErrorBoundary>
                </div>

                {/* Error Types Info */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error Handling Features</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Friendly error messages tailored to each error type</li>
                      <li>• Retry functionality with exponential backoff</li>
                      <li>• Graceful fallback UI when components fail</li>
                      <li>• Error logging for debugging (dev mode)</li>
                      <li>• Integration with error reporting services (production)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pre-filled Examples Library</CardTitle>
                <CardDescription>
                  Each character has 5 curated examples to help users get started quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Character Selector */}
                <div>
                  <h3 className="font-semibold mb-3">Select a Character:</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(characterInfo).map(([key, info]) => (
                      <Button
                        key={key}
                        variant={characterForExample === key ? 'default' : 'outline'}
                        onClick={() => setCharacterForExample(key as any)}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <info.icon className={`w-6 h-6 mb-2 text-${info.color}-600`} />
                        <span>{info.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Example Selector Component */}
                <div>
                  <h3 className="font-semibold mb-3">Try the Example Selector:</h3>
                  <div className="flex items-center gap-4">
                    <ExampleSelector
                      character={characterForExample}
                      onSelectExample={handleExampleSelect}
                      buttonText="Browse Examples"
                      buttonVariant="default"
                    />
                    <span className="text-sm text-gray-600">
                      Click to see available examples for {characterInfo[characterForExample].name}
                    </span>
                  </div>
                </div>

                {/* Selected Example Display */}
                {selectedExample && (
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedExample.title}</CardTitle>
                      <CardDescription>{selectedExample.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(selectedExample.data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {/* Examples Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-purple-600" />
                        Maya's Examples
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• Annual Fundraising Campaign</li>
                        <li>• Volunteer Recruitment Drive</li>
                        <li>• Donor Thank You Letter</li>
                        <li>• Gala Event Invitation</li>
                        <li>• Monthly Impact Newsletter</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-200 bg-pink-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-pink-600" />
                        Sofia's Examples
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• Program Impact Story</li>
                        <li>• Donor Spotlight Story</li>
                        <li>• Volunteer Hero Story</li>
                        <li>• Mission Moment Story</li>
                        <li>• Vision for the Future</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Guide</CardTitle>
                <CardDescription>
                  How to integrate error handling and examples in your AI components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">1. Wrap Components with Error Boundary:</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { AIComponentErrorBoundary } from '@/components/ai-playground/AIComponentErrorBoundary';

export function YourAIComponent() {
  return (
    <AIComponentErrorBoundary componentName="YourComponent">
      {/* Your component content */}
    </AIComponentErrorBoundary>
  );
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">2. Use Retry Logic for AI Calls:</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { retryWithBackoff, handleAIError } from '@/services/aiErrorHandler';

try {
  const result = await retryWithBackoff(async () => {
    return await aiService.generateContent(params);
  });
} catch (error) {
  const aiError = handleAIError(error);
  toast.error(aiError.userMessage);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">3. Add Example Selector:</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { ExampleSelector } from '@/components/ai-playground/ExampleSelector';

<ExampleSelector
  character="maya"
  onSelectExample={(example) => {
    // Load example data into your component
    setFormData(example.data);
  }}
/>`}
                  </pre>
                </div>

                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Benefits</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Better user experience with graceful error handling</li>
                      <li>• Faster onboarding with pre-filled examples</li>
                      <li>• Reduced support requests from confused users</li>
                      <li>• Improved reliability with automatic retries</li>
                      <li>• Clear guidance when things go wrong</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}