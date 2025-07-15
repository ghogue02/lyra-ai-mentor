/**
 * COMPONENT GENERATION RUNNER
 * UI to trigger and monitor component generation from approved prototypes
 */

import React, { useState } from 'react';
import { ComponentGenerationEngine, ComponentConfig } from '../../services/componentGenerationEngine';
import { ComponentPreviewRenderer } from './ComponentPreviewRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const ComponentGenerationRunner: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(null);
  const [previewComponent, setPreviewComponent] = useState<ComponentConfig | null>(null);

  const engine = ComponentGenerationEngine.getInstance();

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runComponentGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    setLogs([]);
    setComponents([]);
    
    addLog('🏗️ Starting Component Generation Engine...');
    
    try {
      addLog('📦 Loading approved prototypes...');
      setProgress(20);
      
      addLog('🔧 Generating React components...');
      setProgress(40);
      
      const generatedComponents = await engine.generateProductionComponents();
      
      setProgress(80);
      addLog(`✅ Generated ${generatedComponents.length} production components`);
      
      setComponents(generatedComponents);
      setProgress(100);
      addLog('🎉 Component generation complete!');
      
    } catch (error) {
      addLog(`❌ Generation failed: ${error}`);
      console.error('Component generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadComponent = (component: ComponentConfig) => {
    const content = `${component.imports.join('\n')}\n\n${component.interfaces.join('\n')}\n\n${component.componentCode}`;
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllComponents = () => {
    components.forEach(component => {
      setTimeout(() => downloadComponent(component), 100);
    });
  };

  const generateRouting = () => {
    const routingCode = components.map(component => {
      const componentName = component.name;
      return `const ${componentName} = React.lazy(() => import("${component.filepath}"));`;
    }).join('\n');
    
    const routes = components.map(component => 
      `<Route path="${component.routePath}" element={<Suspense fallback={<div>Loading...</div>}><${component.name} /></Suspense>} />`
    ).join('\n              ');

    const fullRoutingCode = `// Generated Routes for Lesson Components
${routingCode}

// Add to your App.tsx routes:
${routes}`;

    const blob = new Blob([fullRoutingCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-routes.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏗️ Component Generation Engine
            <Badge variant="outline">Production Ready</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Convert your approved prototypes into production React components with full integration support.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4 items-center">
            <Button 
              onClick={runComponentGeneration}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? '🔄 Generating Components...' : '🏗️ Generate Production Components'}
            </Button>
            
            {components.length > 0 && (
              <>
                <Button onClick={downloadAllComponents} variant="outline">
                  📥 Download All Components
                </Button>
                <Button onClick={generateRouting} variant="outline">
                  🛣️ Generate Routing
                </Button>
              </>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">{progress}% Complete</p>
            </div>
          )}

          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {components.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Generated Components</TabsTrigger>
            <TabsTrigger value="preview">Code Preview</TabsTrigger>
            <TabsTrigger value="deployment">Deployment Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{component.character}</h3>
                      <Badge className="bg-green-100 text-green-800">Generated</Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{component.name}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div><strong>File:</strong> {component.filepath}</div>
                      <div><strong>Route:</strong> {component.routePath}</div>
                      <div><strong>Imports:</strong> {component.imports.length} modules</div>
                      <div><strong>Interfaces:</strong> {component.interfaces.length} types</div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setPreviewComponent(component)}
                        className="flex-1"
                      >
                        🎭 Live Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedComponent(component)}
                        className="flex-1"
                      >
                        📄 Code
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => downloadComponent(component)}
                        className="flex-1"
                      >
                        📥 Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Generation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{components.length}</div>
                    <div className="text-sm text-gray-600">Components Generated</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {components.reduce((sum, c) => sum + c.imports.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Imports</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {components.reduce((sum, c) => sum + c.interfaces.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">TypeScript Interfaces</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Integration Ready</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedComponent.name}</CardTitle>
                  <p className="text-gray-600">Character: {selectedComponent.character}</p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="component" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="component">Component Code</TabsTrigger>
                      <TabsTrigger value="interfaces">TypeScript Interfaces</TabsTrigger>
                      <TabsTrigger value="imports">Imports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="component">
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {selectedComponent.componentCode}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="interfaces">
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {selectedComponent.interfaces.join('\n\n')}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="imports">
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {selectedComponent.imports.join('\n')}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertDescription>
                  Select a component from the overview tab to preview its code.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Deployment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Your components are ready for production deployment!</strong> Follow these steps to integrate them into your application.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">📁 Step 1: File Placement</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {components.map((component, index) => (
                        <li key={index}>• Place <code>{component.name}.tsx</code> at <code>{component.filepath}</code></li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">🛣️ Step 2: Add Routes</h3>
                    <p className="text-sm text-gray-700 mb-2">Add these route definitions to your App.tsx:</p>
                    <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                      {components.map(component => (
                        <div key={component.id} className="mb-1">
                          {`<Route path="${component.routePath}" element={<${component.name} />} />`}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">🔗 Step 3: Navigation Integration</h3>
                    <p className="text-sm text-gray-700">Add navigation links to your chapter hubs or dashboard:</p>
                    <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                      {components.map(component => (
                        <div key={component.id} className="mb-1">
                          {`<Link to="${component.routePath}">${component.name}</Link>`}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">✅ Step 4: Verify Integration</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• All components include MyToolkit integration</li>
                      <li>• Progress tracking is automatically enabled</li>
                      <li>• Character story context is preserved</li>
                      <li>• Responsive design for all screen sizes</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    🎉 <strong>Congratulations!</strong> Your scalable lesson generation pipeline is now complete. 
                    You've transformed weeks of manual work into an automated system that generates production-ready lessons in minutes!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Component Preview Modal */}
      {previewComponent && (
        <ComponentPreviewRenderer
          component={previewComponent}
          onClose={() => setPreviewComponent(null)}
        />
      )}
    </div>
  );
};

export default ComponentGenerationRunner;