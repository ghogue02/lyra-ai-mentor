/**
 * AUTOMATED PROTOTYPE RUNNER
 * UI component to trigger and monitor automated prototype creation
 */

import React, { useState } from 'react';
import { AutomatedPrototypeCreator, AutomatedPrototype } from '../../services/automatedPrototypeCreator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';

export const AutomatedPrototypeRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [prototypes, setPrototypes] = useState<AutomatedPrototype[]>([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const creator = AutomatedPrototypeCreator.getInstance();

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runAutomatedCreation = async () => {
    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setPrototypes([]);
    
    addLog('🚀 Starting automated prototype creation...');
    
    try {
      addLog('🐝 Initializing swarm coordination...');
      setProgress(10);
      
      // Create all prototypes
      addLog('🎭 Creating 5 strategic prototypes with live AI...');
      setProgress(20);
      
      const createdPrototypes = await creator.createAllPrototypes();
      
      setProgress(100);
      setPrototypes(createdPrototypes);
      addLog(`✅ Created ${createdPrototypes.length}/5 prototypes successfully!`);
      
      // Show results summary
      const recommended = createdPrototypes.filter(p => p.results?.recommendedForProduction);
      addLog(`🌟 ${recommended.length} prototypes recommended for production`);
      
    } catch (error) {
      addLog(`❌ Error during creation: ${error}`);
      console.error('Automated creation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'testing': return 'bg-blue-500';
      case 'creating': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 Automated Prototype Creation System
            <Badge variant="outline">Live AI Integration</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This system will automatically create 5 strategic lesson prototypes using live AI integration.
              Each prototype will be tested with real OpenAI API calls and scored for quality.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4 items-center">
            <Button 
              onClick={runAutomatedCreation}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? '🔄 Creating Prototypes...' : '🚀 Create All 5 Prototypes'}
            </Button>
            
            {isRunning && (
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
              </div>
            )}
          </div>

          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {prototypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Prototype Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prototypes.map((prototype) => (
                <Card key={prototype.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{prototype.name}</h3>
                      <Badge className={getStatusColor(prototype.status)}>
                        {prototype.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">Character: {prototype.character}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {prototype.results && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Quality:</span>
                            <span className={`ml-1 font-medium ${getQualityColor(prototype.results.overallQuality)}`}>
                              {prototype.results.overallQuality}/10
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Consistency:</span>
                            <span className={`ml-1 font-medium ${getQualityColor(prototype.results.characterConsistency)}`}>
                              {prototype.results.characterConsistency}/10
                            </span>
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="text-gray-500">Success Rate:</span>
                          <span className="ml-1 font-medium">{prototype.results.interactionSuccess}%</span>
                        </div>

                        {prototype.results.recommendedForProduction && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✅ Recommended for Production
                          </Badge>
                        )}

                        <div className="text-xs">
                          <p className="text-gray-500 mb-1">Feedback:</p>
                          <ul className="space-y-1">
                            {prototype.results.feedback.slice(0, 2).map((feedback, i) => (
                              <li key={i} className="text-gray-700">{feedback}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-xs">
                          <p className="text-gray-500">Interactions: {prototype.interactions.length}</p>
                          <div className="flex gap-1 mt-1">
                            {prototype.interactions.map((interaction, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded ${
                                  interaction.status === 'completed' ? 'bg-green-400' :
                                  interaction.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                                }`}
                                title={`${interaction.type} - ${interaction.status}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {prototype.status === 'creating' && (
                      <div className="text-center text-gray-500 text-sm">
                        🔄 Creating prototype...
                      </div>
                    )}

                    {prototype.status === 'testing' && (
                      <div className="text-center text-gray-500 text-sm">
                        🧠 Testing with live AI...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prototypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Summary & Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{prototypes.length}</div>
                <div className="text-sm text-gray-600">Total Prototypes</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {prototypes.filter(p => p.results?.recommendedForProduction).length}
                </div>
                <div className="text-sm text-gray-600">Recommended</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {prototypes.reduce((sum, p) => sum + p.interactions.length, 0)}
                </div>
                <div className="text-sm text-gray-600">AI Interactions</div>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertDescription>
                <strong>Next Steps:</strong> Review the recommended prototypes and approve them for production.
                The Component Generation Engine will then convert approved prototypes into full React components.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomatedPrototypeRunner;