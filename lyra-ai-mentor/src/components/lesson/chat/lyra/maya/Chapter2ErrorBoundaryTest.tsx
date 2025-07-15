import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chapter2ErrorBoundary } from './Chapter2ErrorBoundary';
import { PACEErrorWrapper } from './PACEErrorWrapper';
import { AlertTriangle, TestTube, Zap } from 'lucide-react';

// Test component that throws errors on demand
const ErrorGeneratorComponent: React.FC<{ 
  errorType: 'render' | 'ai' | 'network' | 'pace' | 'none';
  step?: 'Purpose' | 'Audience' | 'Consideration' | 'Email';
}> = ({ errorType, step }) => {
  if (errorType === 'render') {
    throw new Error('Test render error for Chapter 2 component');
  }
  
  if (errorType === 'ai') {
    throw new Error('AI service unavailable - test error');
  }
  
  if (errorType === 'network') {
    throw new Error('Network connection failed - test error');
  }
  
  if (errorType === 'pace') {
    throw new Error(`PACE ${step || 'flow'} validation failed - test error`);
  }
  
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-medium">✅ Component Working Normally</h3>
      <p className="text-green-700 text-sm mt-1">
        No errors detected. Error boundaries are protecting this component.
      </p>
    </div>
  );
};

// Test component for Chapter 2 error boundary functionality
export const Chapter2ErrorBoundaryTest: React.FC = () => {
  const [testType, setTestType] = useState<'render' | 'ai' | 'network' | 'pace' | 'none'>('none');
  const [paceStep, setPaceStep] = useState<'Purpose' | 'Audience' | 'Consideration' | 'Email'>('Purpose');
  const [key, setKey] = useState(0);

  const triggerError = (type: typeof testType) => {
    setTestType(type);
    setKey(prev => prev + 1); // Force re-render to trigger error
  };

  const resetTest = () => {
    setTestType('none');
    setKey(prev => prev + 1);
  };

  if (process.env.NODE_ENV === 'production') {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error Boundary Test (Development Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Error boundary testing is only available in development mode.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-blue-600" />
            Chapter 2 Error Boundary Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              onClick={() => triggerError('render')}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Test Render Error
            </Button>
            <Button
              onClick={() => triggerError('ai')}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Test AI Error
            </Button>
            <Button
              onClick={() => triggerError('network')}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Test Network Error
            </Button>
            <Button
              onClick={() => triggerError('pace')}
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Test PACE Error
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">PACE Step:</label>
            <select 
              value={paceStep} 
              onChange={(e) => setPaceStep(e.target.value as any)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="Purpose">Purpose</option>
              <option value="Audience">Audience</option>
              <option value="Consideration">Consideration</option>
              <option value="Email">Email</option>
            </select>
          </div>
          
          <Button onClick={resetTest} className="w-full bg-green-600 hover:bg-green-700">
            <Zap className="w-4 h-4 mr-2" />
            Reset Test Environment
          </Button>
        </CardContent>
      </Card>

      {/* Chapter 2 Error Boundary Test */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter 2 Main Error Boundary</CardTitle>
        </CardHeader>
        <CardContent>
          <Chapter2ErrorBoundary key={`chapter2-${key}`}>
            <ErrorGeneratorComponent errorType={testType} step={paceStep} />
          </Chapter2ErrorBoundary>
        </CardContent>
      </Card>

      {/* PACE Error Wrapper Test */}
      <Card>
        <CardHeader>
          <CardTitle>PACE Flow Error Wrapper</CardTitle>
        </CardHeader>
        <CardContent>
          <PACEErrorWrapper 
            key={`pace-${key}`}
            paceStep={paceStep}
            stageTitle={`${paceStep} Testing Stage`}
            onStageError={(error) => console.log('PACE Error:', error)}
          >
            <ErrorGeneratorComponent errorType={testType} step={paceStep} />
          </PACEErrorWrapper>
        </CardContent>
      </Card>

      {/* Error Log Display */}
      <Card>
        <CardHeader>
          <CardTitle>Error Logs (Development)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h4 className="font-medium text-sm">Chapter 2 Errors:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(
                  JSON.parse(localStorage.getItem('chapter2-errors') || '[]'),
                  null,
                  2
                )}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-sm">PACE Flow Errors:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(
                  JSON.parse(localStorage.getItem('pace-flow-errors') || '[]'),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chapter2ErrorBoundaryTest;