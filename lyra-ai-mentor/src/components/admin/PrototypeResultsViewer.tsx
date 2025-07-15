/**
 * PROTOTYPE RESULTS VIEWER
 * Component to display and analyze prototype creation results
 */

import React, { useState, useEffect } from 'react';
import { PrototypeResultsExtractor, PrototypeAnalysis } from '../../services/prototypeResultsExtractor';
import AutomatedPrototypeCreator from '../../services/automatedPrototypeCreator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const PrototypeResultsViewer: React.FC = () => {
  const [analyses, setAnalyses] = useState<PrototypeAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [selectedPrototype, setSelectedPrototype] = useState<PrototypeAnalysis | null>(null);

  const extractor = new PrototypeResultsExtractor();

  const loadResults = async () => {
    setLoading(true);
    try {
      // Debug: Check what's in storage
      const stored = localStorage.getItem('automated_prototypes');
      console.log('🔍 Debug - localStorage content:', stored ? JSON.parse(stored) : 'No data');
      
      const results = await extractor.extractAllResults();
      const fullReport = await extractor.generateSummaryReport();
      
      setAnalyses(results);
      setReport(fullReport);
      
      console.log('📊 Prototype Results Loaded:', results);
      console.log('📊 Results count:', results.length);
    } catch (error) {
      console.error('❌ Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const debugPrototypes = () => {
    const creator = AutomatedPrototypeCreator.getInstance();
    const prototypes = creator.getPrototypeResults();
    
    console.log('🔍 Debug Info:');
    console.log('- Prototypes in memory:', prototypes.length);
    console.log('- Prototypes:', prototypes);
    console.log('- localStorage content:', localStorage.getItem('automated_prototypes'));
    
    if (prototypes.length === 0) {
      console.log('❌ No prototypes found. Try running the automated creator again.');
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-yellow-500';
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📊 Prototype Creation Results
            <div className="flex gap-2">
              <Button onClick={debugPrototypes} variant="outline" size="sm">
                🔍 Debug
              </Button>
              <Button onClick={loadResults} disabled={loading}>
                {loading ? '🔄 Loading...' : '🔄 Refresh Results'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <Alert>
              <AlertDescription>
                No prototype results found. Run the automated prototype creator first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analyses.length}</div>
                <div className="text-sm text-gray-600">Total Prototypes</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analyses.filter(a => a.productionReadiness).length}
                </div>
                <div className="text-sm text-gray-600">Production Ready</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analyses.reduce((sum, a) => sum + a.prototype.interactions.length, 0)}
                </div>
                <div className="text-sm text-gray-600">AI Interactions</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analyses.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Responses</TabsTrigger>
            <TabsTrigger value="report">Full Report</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyses.map((analysis, index) => (
                <Card key={index} className={`border-l-4 ${analysis.productionReadiness ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{analysis.prototype.character}</h3>
                      <Badge className={getStatusColor(analysis.recommendationLevel)}>
                        {analysis.recommendationLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{analysis.prototype.name}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Quality Score</span>
                        <div className={`text-xl font-bold ${getQualityColor(analysis.qualityAnalysis.averageScore)}`}>
                          {analysis.qualityAnalysis.averageScore}/10
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Consistency</span>
                        <div className={`text-xl font-bold ${getQualityColor(analysis.qualityAnalysis.characterConsistency)}`}>
                          {analysis.qualityAnalysis.characterConsistency}/10
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Best:</span>
                        <span className="ml-2 font-medium">{analysis.qualityAnalysis.bestInteraction}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Worst:</span>
                        <span className="ml-2 font-medium">{analysis.qualityAnalysis.worstInteraction}</span>
                      </div>
                    </div>

                    {analysis.productionReadiness ? (
                      <Badge className="bg-green-100 text-green-800 w-full justify-center">
                        ✅ Ready for Production
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="w-full justify-center">
                        ⚠️ Needs Improvement
                      </Badge>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedPrototype(analysis)}
                    >
                      View AI Responses
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedPrototype ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPrototype.prototype.name}</CardTitle>
                  <p className="text-gray-600">Character: {selectedPrototype.prototype.character}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedPrototype.prototype.interactions.map((interaction, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{interaction.type}</Badge>
                        <div className="flex gap-2">
                          <Badge className={getQualityColor(interaction.qualityScore || 0) === 'text-green-600' ? 'bg-green-100 text-green-800' : 
                                         getQualityColor(interaction.qualityScore || 0) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}>
                            Quality: {interaction.qualityScore}/10
                          </Badge>
                          <Badge variant="outline">
                            Consistency: {interaction.characterConsistency}/10
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Prompt:</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{interaction.prompt}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">AI Response:</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans">{interaction.aiResponse}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertDescription>
                  Select a prototype from the Overview tab to view detailed AI responses.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📋 Complete Analysis Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{report}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PrototypeResultsViewer;