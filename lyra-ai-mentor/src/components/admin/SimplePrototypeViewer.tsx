/**
 * SIMPLE PROTOTYPE VIEWER
 * Clean, direct interface to view your actual prototype results
 */

import React, { useState, useEffect } from 'react';
import AutomatedPrototypeCreator, { AutomatedPrototype } from '../../services/automatedPrototypeCreator';
import { SimplePrototypePreview } from './SimplePrototypePreview';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';

export const SimplePrototypeViewer: React.FC = () => {
  const [prototypes, setPrototypes] = useState<AutomatedPrototype[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrototypes();
  }, []);

  const loadPrototypes = () => {
    setLoading(true);
    try {
      const creator = AutomatedPrototypeCreator.getInstance();
      const results = creator.getPrototypeResults();
      setPrototypes(results);
      console.log('📊 Loaded prototypes:', results);
    } catch (error) {
      console.error('❌ Failed to load prototypes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (results: any) => {
    if (!results) return 'bg-gray-500';
    if (results.recommendedForProduction) return 'bg-green-500';
    if (results.overallQuality >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <CardTitle className="flex items-center justify-between">
            🎭 Your Actual Prototype Results
            <div className="flex gap-2">
              <Button onClick={loadPrototypes} disabled={loading} variant="outline">
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </Button>
              {prototypes.length > 0 && (
                <Button onClick={() => setShowPreview(true)}>
                  👁️ Preview All Prototypes
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prototypes.length === 0 ? (
            <Alert>
              <AlertDescription>
                No prototypes found. Go to <strong>/admin/automated-prototypes</strong> and run the prototype creator first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{prototypes.length}</div>
                  <div className="text-sm text-gray-600">Total Prototypes</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {prototypes.filter(p => p.results?.recommendedForProduction).length}
                  </div>
                  <div className="text-sm text-gray-600">Production Ready</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {prototypes.reduce((sum, p) => sum + p.interactions.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Live AI Interactions</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {prototypes.map((prototype) => (
                  <Card key={prototype.id} className={`border-l-4 ${prototype.results?.recommendedForProduction ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{prototype.character}</h3>
                        <Badge className={getStatusColor(prototype.results)}>
                          {prototype.results?.recommendedForProduction ? 'APPROVED' : 'REVIEW'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{prototype.name}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Quality Score</span>
                          <div className={`text-xl font-bold ${getQualityColor(prototype.results?.overallQuality || 0)}`}>
                            {prototype.results?.overallQuality || 'N/A'}/10
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Interactions</span>
                          <div className="text-xl font-bold text-blue-600">
                            {prototype.interactions.length}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Character Consistency:</span>
                          <span className={`ml-2 font-medium ${getQualityColor(prototype.results?.characterConsistency || 0)}`}>
                            {prototype.results?.characterConsistency || 'N/A'}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Success Rate:</span>
                          <span className="ml-2 font-medium">{prototype.results?.interactionSuccess || 'N/A'}%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Interaction Types:</span>
                        <div className="flex flex-wrap gap-1">
                          {prototype.interactions.map((interaction, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {interaction.type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {prototype.results?.feedback && (
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Top Feedback:</span>
                          <p className="text-xs text-gray-700">
                            {prototype.results.feedback[0] || 'No feedback available'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <SimplePrototypePreview onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default SimplePrototypeViewer;