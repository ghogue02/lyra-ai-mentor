import React, { useState } from 'react';
import { InteractiveElementAuditor } from './InteractiveElementAuditor';
import { InteractiveElementBuilder } from './InteractiveElementBuilder';

interface ElementWorkflowCoordinatorProps {
  onComplete?: () => void;
}

export const ElementWorkflowCoordinator: React.FC<ElementWorkflowCoordinatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'audit' | 'build' | 'complete'>('audit');
  const [auditResults, setAuditResults] = useState<any>(null);

  const handleAuditComplete = (results?: any) => {
    setAuditResults(results);
    setCurrentStep('build');
  };

  const handleBuildComplete = () => {
    setCurrentStep('complete');
    if (onComplete) onComplete();
  };

  const resetWorkflow = () => {
    setCurrentStep('audit');
    setAuditResults(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Interactive Element Workflow Coordinator</h2>
      
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === 'audit' ? 'text-blue-600' : currentStep === 'build' ? 'text-gray-400' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'audit' ? 'bg-blue-100' : currentStep === 'build' ? 'bg-gray-100' : 'bg-green-100'}`}>
              {currentStep === 'complete' ? '✓' : '1'}
            </div>
            <span className="font-medium">Audit Elements</span>
          </div>
          
          <div className={`w-12 h-0.5 ${currentStep === 'build' || currentStep === 'complete' ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${currentStep === 'build' ? 'text-blue-600' : currentStep === 'audit' ? 'text-gray-400' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'build' ? 'bg-blue-100' : currentStep === 'audit' ? 'bg-gray-100' : 'bg-green-100'}`}>
              {currentStep === 'complete' ? '✓' : '2'}
            </div>
            <span className="font-medium">Build Enhancements</span>
          </div>
          
          <div className={`w-12 h-0.5 ${currentStep === 'complete' ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
              {currentStep === 'complete' ? '✓' : '3'}
            </div>
            <span className="font-medium">Complete</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 'audit' && (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Step 1: Element Audit</h3>
              <p className="text-sm text-gray-700">
                The Interactive Element Auditor will analyze all elements across chapters 1-6, 
                evaluating story integration, learning alignment, AI connectivity, and engagement potential.
              </p>
            </div>
            <InteractiveElementAuditor onComplete={handleAuditComplete} />
          </div>
        )}

        {currentStep === 'build' && (
          <div>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Step 2: Element Enhancement</h3>
              <p className="text-sm text-gray-700">
                The Interactive Element Builder will implement audit recommendations, 
                converting static elements to AI-powered experiences with OpenAI integration.
              </p>
            </div>
            <InteractiveElementBuilder 
              auditData={auditResults} 
              onComplete={handleBuildComplete} 
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Workflow Complete!</h3>
              <p className="text-green-700 mb-4">
                All interactive elements have been audited and enhanced. Your learning platform now features:
              </p>
              <ul className="text-sm text-green-700 space-y-1 mb-4">
                <li>• AI-powered interactive components with OpenAI integration</li>
                <li>• Character-driven storylines with better narrative flow</li>
                <li>• Nonprofit-specific scenarios and learning objectives</li>
                <li>• Enhanced engagement and practical applicability</li>
                <li>• Seamless LLM connectivity for dynamic responses</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded border">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Test the enhanced elements with real users</li>
                <li>• Monitor engagement metrics and learning outcomes</li>
                <li>• Use the Content Audit Agent to maintain quality</li>
                <li>• Run periodic element audits to ensure continued effectiveness</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetWorkflow}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Run Another Audit
              </button>
              
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t">
        <h4 className="font-medium mb-3">Agent Integration Ecosystem</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">Content Quality</h5>
            <p className="text-gray-600">Content Audit Agent → Storytelling Agent</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">Element Enhancement</h5>
            <p className="text-gray-600">Element Auditor → Element Builder</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">Chapter Development</h5>
            <p className="text-gray-600">Chapter Builder → Database Debugger</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">System Monitoring</h5>
            <p className="text-gray-600">Database Debugger → All Agents</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">AI Integration</h5>
            <p className="text-gray-600">OpenAI + Supabase Edge Functions</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h5 className="font-medium">Workflow Coordination</h5>
            <p className="text-gray-600">This Agent → All Other Agents</p>
          </div>
        </div>
      </div>
    </div>
  );
};