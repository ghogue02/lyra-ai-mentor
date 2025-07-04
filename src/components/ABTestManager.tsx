import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FlaskConical, Plus, Trash2, Play, Pause, 
  BarChart3, Target, Users, TrendingUp 
} from 'lucide-react';
import { analyticsService, ABTestVariant, ABTestResult } from '@/analytics/InteractiveElementAnalytics';
import { format } from 'date-fns';

interface ABTestManagerProps {
  elementId: number;
  elementType: string;
  elementTitle: string;
}

interface VariantConfig {
  name: string;
  weight: number;
  configuration: Record<string, any>;
}

export const ABTestManager: React.FC<ABTestManagerProps> = ({
  elementId,
  elementType,
  elementTitle
}) => {
  const [variants, setVariants] = useState<ABTestVariant[]>([]);
  const [results, setResults] = useState<ABTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // New test form state
  const [newVariants, setNewVariants] = useState<VariantConfig[]>([
    { name: 'Control', weight: 0.5, configuration: {} },
    { name: 'Variant A', weight: 0.5, configuration: {} }
  ]);

  useEffect(() => {
    loadABTests();
  }, [elementId]);

  const loadABTests = async () => {
    setLoading(true);
    try {
      // Load existing variants
      const variantsData = await analyticsService.getABTestVariants(elementId);
      setVariants(variantsData);
      
      // Load results if test exists
      if (variantsData.length > 0) {
        const resultsData = await analyticsService.getABTestResults(elementId);
        setResults(resultsData);
      }
    } catch (error) {
      console.error('Error loading A/B tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    try {
      const totalWeight = newVariants.reduce((sum, v) => sum + v.weight, 0);
      if (Math.abs(totalWeight - 1) > 0.01) {
        alert('Variant weights must sum to 1.0');
        return;
      }

      const createdVariants = await analyticsService.createABTest(
        elementId,
        newVariants.map(v => ({
          elementId,
          variantName: v.name,
          configuration: v.configuration,
          weight: v.weight
        }))
      );

      setVariants(createdVariants);
      setCreating(false);
    } catch (error) {
      console.error('Error creating A/B test:', error);
    }
  };

  const handleAddVariant = () => {
    const newWeight = 1 / (newVariants.length + 1);
    const updatedVariants = newVariants.map(v => ({
      ...v,
      weight: v.weight * (newVariants.length / (newVariants.length + 1))
    }));
    
    setNewVariants([
      ...updatedVariants,
      { 
        name: `Variant ${String.fromCharCode(65 + newVariants.length - 1)}`, 
        weight: newWeight, 
        configuration: {} 
      }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (newVariants.length <= 2) return;
    
    const removed = newVariants[index];
    const remaining = newVariants.filter((_, i) => i !== index);
    const redistributedWeight = removed.weight / remaining.length;
    
    setNewVariants(remaining.map(v => ({
      ...v,
      weight: v.weight + redistributedWeight
    })));
  };

  const handleVariantConfigChange = (index: number, key: string, value: any) => {
    const updated = [...newVariants];
    updated[index].configuration[key] = value;
    setNewVariants(updated);
  };

  const getSignificanceLevel = (significance: number): { label: string; color: string } => {
    if (significance >= 0.95) return { label: 'Significant', color: 'text-green-600' };
    if (significance >= 0.90) return { label: 'Marginal', color: 'text-yellow-600' };
    return { label: 'Not Significant', color: 'text-gray-500' };
  };

  const renderVariantConfigurator = () => {
    // Configuration options based on element type
    const configOptions = {
      multiple_choice_scenarios: [
        { key: 'questionStyle', label: 'Question Style', type: 'select', options: ['Direct', 'Scenario-based', 'Conversational'] },
        { key: 'feedbackTiming', label: 'Feedback Timing', type: 'select', options: ['Immediate', 'After submission', 'End of quiz'] },
        { key: 'hintAvailability', label: 'Hints Available', type: 'boolean' }
      ],
      ai_content_generator: [
        { key: 'promptStyle', label: 'Prompt Style', type: 'select', options: ['Guided', 'Open-ended', 'Template-based'] },
        { key: 'examplesShown', label: 'Number of Examples', type: 'number', min: 0, max: 5 },
        { key: 'aiAssistanceLevel', label: 'AI Assistance Level', type: 'select', options: ['Minimal', 'Moderate', 'Extensive'] }
      ],
      sequence_sorter: [
        { key: 'dragDropEnabled', label: 'Drag & Drop', type: 'boolean' },
        { key: 'showNumbers', label: 'Show Numbers', type: 'boolean' },
        { key: 'allowPartialCredit', label: 'Partial Credit', type: 'boolean' }
      ]
    };

    const options = configOptions[elementType as keyof typeof configOptions] || [];

    return (
      <div className="space-y-4">
        {newVariants.map((variant, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Input
                  value={variant.name}
                  onChange={(e) => {
                    const updated = [...newVariants];
                    updated[index].name = e.target.value;
                    setNewVariants(updated);
                  }}
                  className="max-w-[200px]"
                />
                {newVariants.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVariant(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Traffic Weight: {Math.round(variant.weight * 100)}%</Label>
                <Slider
                  value={[variant.weight * 100]}
                  onValueChange={(value) => {
                    const updated = [...newVariants];
                    updated[index].weight = value[0] / 100;
                    setNewVariants(updated);
                  }}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              {options.map(option => (
                <div key={option.key}>
                  <Label>{option.label}</Label>
                  {option.type === 'select' && (
                    <select
                      className="w-full mt-1 p-2 border rounded"
                      value={variant.configuration[option.key] || option.options![0]}
                      onChange={(e) => handleVariantConfigChange(index, option.key, e.target.value)}
                    >
                      {option.options!.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {option.type === 'boolean' && (
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={variant.configuration[option.key] || false}
                      onChange={(e) => handleVariantConfigChange(index, option.key, e.target.checked)}
                    />
                  )}
                  {option.type === 'number' && (
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded"
                      min={option.min}
                      max={option.max}
                      value={variant.configuration[option.key] || option.min}
                      onChange={(e) => handleVariantConfigChange(index, option.key, parseInt(e.target.value))}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          A/B Testing - {elementTitle}
        </CardTitle>
        <CardDescription>
          Create and manage A/B tests to optimize element performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {variants.length === 0 && !creating ? (
          <div className="text-center py-8">
            <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No A/B test running for this element</p>
            <Button onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create A/B Test
            </Button>
          </div>
        ) : creating ? (
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                Configure variants for your A/B test. Each variant will be shown to a percentage of users.
              </AlertDescription>
            </Alert>
            
            {renderVariantConfigurator()}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleAddVariant}>
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="results">
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="space-y-4">
              {results.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Test is running. Results will appear as users interact with the variants.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {results.map(result => {
                    const variant = variants.find(v => v.variantId === result.variantId);
                    const significance = getSignificanceLevel(result.statisticalSignificance);
                    
                    return (
                      <Card key={result.variantId}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{variant?.variantName}</CardTitle>
                            <Badge className={significance.color}>
                              {significance.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-sm text-gray-500">Sample Size</p>
                              <p className="text-xl font-bold">{result.sampleSize}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Completion Rate</p>
                              <p className="text-xl font-bold">{Math.round(result.completionRate * 100)}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Avg Time</p>
                              <p className="text-xl font-bold">{Math.round(result.averageTimeSpent)}s</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Engagement</p>
                              <p className="text-xl font-bold">{Math.round(result.engagementScore * 100)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="variants" className="space-y-4">
              {variants.map(variant => (
                <Card key={variant.variantId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{variant.variantName}</CardTitle>
                      <Badge variant={variant.isActive ? "default" : "secondary"}>
                        {variant.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Traffic Weight:</span> {Math.round(variant.weight * 100)}%
                      </p>
                      <div>
                        <p className="font-medium text-sm mb-1">Configuration:</p>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(variant.configuration, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded">
                        <p className="font-medium text-green-800">
                          Best Performing Variant: {
                            variants.find(v => v.variantId === 
                              results.sort((a, b) => b.completionRate - a.completionRate)[0].variantId
                            )?.variantName
                          }
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          {Math.round(
                            ((results.sort((a, b) => b.completionRate - a.completionRate)[0].completionRate - 
                              results.sort((a, b) => a.completionRate - b.completionRate)[0].completionRate) / 
                              results.sort((a, b) => a.completionRate - b.completionRate)[0].completionRate) * 100
                          )}% improvement over worst variant
                        </p>
                      </div>
                      
                      <Alert>
                        <TrendingUp className="w-4 h-4" />
                        <AlertDescription>
                          Based on current results, implementing the best variant could improve overall 
                          completion rates by approximately {
                            Math.round(
                              ((results.sort((a, b) => b.completionRate - a.completionRate)[0].completionRate - 
                                results[0].completionRate) / results[0].completionRate) * 100
                            )
                          }%.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};