/**
 * SIMPLE PROTOTYPE PREVIEW
 * Direct preview of actual prototype data without overcomplicated generation
 */

import React, { useState, useEffect } from 'react';
import AutomatedPrototypeCreator, { AutomatedPrototype } from '../../services/automatedPrototypeCreator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';

interface SimplePrototypePreviewProps {
  onClose: () => void;
}

export const SimplePrototypePreview: React.FC<SimplePrototypePreviewProps> = ({ onClose }) => {
  const [prototypes, setPrototypes] = useState<AutomatedPrototype[]>([]);
  const [selectedPrototype, setSelectedPrototype] = useState<AutomatedPrototype | null>(null);
  const [currentInteraction, setCurrentInteraction] = useState(0);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const creator = AutomatedPrototypeCreator.getInstance();
    const results = creator.getPrototypeResults();
    setPrototypes(results);
    if (results.length > 0) {
      setSelectedPrototype(results[0]);
    }
  }, []);

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

  const currentInteractionData = selectedPrototype?.interactions[currentInteraction];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🎭 Real Prototype Preview</h2>
            <p className="text-gray-600">Your actual generated prototypes with live AI responses</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            ✕ Close
          </Button>
        </div>

        <div className="p-6">
          {prototypes.length === 0 ? (
            <Alert>
              <AlertDescription>
                No prototypes found. Run the automated prototype creator first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Prototype List */}
              <div className="space-y-2">
                <h3 className="font-semibold">Available Prototypes:</h3>
                {prototypes.map((prototype) => (
                  <Button
                    key={prototype.id}
                    variant={selectedPrototype?.id === prototype.id ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-3"
                    onClick={() => {
                      setSelectedPrototype(prototype);
                      setCurrentInteraction(0);
                    }}
                  >
                    <div>
                      <div className="font-medium">{prototype.character}</div>
                      <div className="text-xs text-gray-600">{prototype.interactions.length} interactions</div>
                      <div className="text-xs">
                        Quality: {prototype.results?.overallQuality || 'N/A'}/10
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Main Preview */}
              <div className="lg:col-span-3">
                {selectedPrototype && (
                  <div className="space-y-4">
                    {/* Prototype Header */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          🎭 {selectedPrototype.character}: {selectedPrototype.name}
                          <Badge variant="outline">
                            {selectedPrototype.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Quality:</strong> {selectedPrototype.results?.overallQuality}/10
                          </div>
                          <div>
                            <strong>Consistency:</strong> {selectedPrototype.results?.characterConsistency}/10
                          </div>
                          <div>
                            <strong>Interactions:</strong> {selectedPrototype.interactions.length}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Learning Objectives:</h4>
                          <ul className="text-sm space-y-1">
                            {selectedPrototype.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interaction Navigation */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Interactions ({selectedPrototype.interactions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4">
                          {selectedPrototype.interactions.map((interaction, index) => (
                            <Button
                              key={index}
                              variant={currentInteraction === index ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentInteraction(index)}
                              className="flex items-center gap-1"
                            >
                              {getInteractionIcon(interaction.type)}
                              {index + 1}
                            </Button>
                          ))}
                        </div>

                        {currentInteractionData && (
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {getInteractionIcon(currentInteractionData.type)} {currentInteractionData.type}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800">
                                  Quality: {currentInteractionData.qualityScore}/10
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-2">Scenario:</h4>
                              <p className="text-gray-700">{currentInteractionData.prompt}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                🤖 Actual AI Response from {selectedPrototype.character}:
                              </h4>
                              <div className="text-gray-700 whitespace-pre-wrap text-sm">
                                {currentInteractionData.aiResponse || 'No AI response recorded'}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Test Your Response:</h4>
                              <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type how you would handle this scenario..."
                                className="w-full p-3 border rounded-lg resize-none"
                                rows={4}
                              />
                              <Button 
                                className="mt-2"
                                disabled={!userInput.trim()}
                              >
                                Compare with AI Response
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Results Summary */}
                    {selectedPrototype.results && (
                      <Card>
                        <CardHeader>
                          <CardTitle>📊 Quality Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Scores:</h4>
                              <div className="space-y-1 text-sm">
                                <div>Overall Quality: {selectedPrototype.results.overallQuality}/10</div>
                                <div>Character Consistency: {selectedPrototype.results.characterConsistency}/10</div>
                                <div>Learning Value: {selectedPrototype.results.learningValue}/10</div>
                                <div>Success Rate: {selectedPrototype.results.interactionSuccess}%</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Feedback:</h4>
                              <ul className="space-y-1 text-sm">
                                {selectedPrototype.results.feedback.map((feedback, i) => (
                                  <li key={i}>{feedback}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {selectedPrototype.results.recommendedForProduction && (
                            <Alert className="mt-4">
                              <AlertDescription>
                                ✅ <strong>This prototype is recommended for production!</strong> 
                                It has high quality scores and strong character consistency.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplePrototypePreview;