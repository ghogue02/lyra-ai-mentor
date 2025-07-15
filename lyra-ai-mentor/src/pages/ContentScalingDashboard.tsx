import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  BarChart, 
  Settings, 
  Play,
  Pause,
  RefreshCw,
  Download,
  Eye,
  Zap
} from 'lucide-react';
import AlexChapter3InteractiveBuilder from '../components/generated/AlexChapter3InteractiveBuilder';

const ContentScalingDashboard: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('alex');
  const [selectedChapter, setSelectedChapter] = useState('3');
  const [selectedTemplate, setSelectedTemplate] = useState('interactive-builder');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for dashboard
  const characters = [
    { id: 'maya', name: 'Maya Rodriguez', profession: 'Marketing Coordinator', color: 'bg-blue-500' },
    { id: 'alex', name: 'Alex Chen', profession: 'Executive Director', color: 'bg-green-500' },
    { id: 'david', name: 'David Park', profession: 'Program Manager', color: 'bg-purple-500' },
    { id: 'rachel', name: 'Rachel Martinez', profession: 'Operations Director', color: 'bg-orange-500' },
    { id: 'sofia', name: 'Sofia Thompson', profession: 'Communications Manager', color: 'bg-pink-500' }
  ];

  const templates = [
    { id: 'interactive-builder', name: 'Interactive Skill Builder', description: '4-stage interactive learning' },
    { id: 'character-journey', name: 'Character Journey Arc', description: 'Transformation story content' }
  ];

  const generationStats = {
    totalGenerated: 12,
    approved: 10,
    pending: 2,
    avgQuality: 0.92,
    totalTimeSaved: '156 hours'
  };

  const recentGenerations = [
    { id: '1', character: 'Alex Chen', chapter: 3, template: 'Interactive Builder', quality: 0.94, status: 'approved', createdAt: '2 hours ago' },
    { id: '2', character: 'Maya Rodriguez', chapter: 2, template: 'Character Journey', quality: 0.89, status: 'pending', createdAt: '1 day ago' },
    { id: '3', character: 'David Park', chapter: 4, template: 'Interactive Builder', quality: 0.91, status: 'approved', createdAt: '2 days ago' }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Scaling Dashboard</h1>
          <p className="text-gray-600">Manage and generate scalable content across all chapters</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Generated</p>
                  <p className="text-2xl font-bold">{generationStats.totalGenerated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{generationStats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{generationStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Quality</p>
                  <p className="text-2xl font-bold">{(generationStats.avgQuality * 100).toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold">{generationStats.totalTimeSaved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="library">Content Library</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Content Generation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Character</label>
                    <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select character" />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map(char => (
                          <SelectItem key={char.id} value={char.id}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${char.color}`} />
                              <span>{char.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Chapter</label>
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6].map(chapter => (
                          <SelectItem key={chapter} value={chapter.toString()}>
                            Chapter {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Template</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={generateContent}
                    disabled={isGenerating}
                    className="flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Generate Content</span>
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </Button>
                </div>
                
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating content...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Content Library</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGenerations.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{item.character} - Chapter {item.chapter}</p>
                          <p className="text-sm text-gray-600">{item.template}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={item.status === 'approved' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          Quality: {(item.quality * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.createdAt}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generation Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span>Average Quality</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span>Time Efficiency</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Character Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {characters.map(char => (
                      <div key={char.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${char.color}`} />
                          <span className="text-sm">{char.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${char.color}`} 
                              style={{ width: `${Math.random() * 40 + 60}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.floor(Math.random() * 40 + 60)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  Preview of {selectedCharacter} Chapter {selectedChapter} - {selectedTemplate}
                </p>
              </CardHeader>
              <CardContent>
                {selectedCharacter === 'alex' && selectedChapter === '3' && selectedTemplate === 'interactive-builder' ? (
                  <div className="border rounded-lg p-4 bg-white">
                    <AlexChapter3InteractiveBuilder />
                  </div>
                ) : (
                  <div className="border rounded-lg p-8 bg-gray-50 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Component preview for {selectedCharacter} Chapter {selectedChapter}
                      </p>
                      <Button 
                        onClick={() => {
                          // Generate component command
                          const command = `npm run generate-content ${selectedCharacter} ${selectedChapter} ${selectedTemplate}`;
                          navigator.clipboard.writeText(command);
                        }}
                        variant="outline"
                      >
                        Generate Component
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentScalingDashboard;