import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  RefreshCw, 
  Copy, 
  Download,
  Sparkles,
  Play,
  FileText,
  Target,
  Users
} from 'lucide-react';

interface DataStoryElement {
  type: 'context' | 'insight' | 'implication' | 'action';
  title: string;
  content: string;
  dataPoint?: string;
  order: number;
}

interface DataStory {
  id: string;
  title: string;
  narrative: string;
  elements: DataStoryElement[];
  audience: string;
  purpose: string;
  keyMessage: string;
  generated: Date;
}

const DavidDataStoryBuilder: React.FC = () => {
  const [dataDescription, setDataDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState('');
  const [generatedStory, setGeneratedStory] = useState<DataStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedStories, setSavedStories] = useState<DataStory[]>([]);

  const storyTemplates = [
    {
      title: 'The Problem-Solution Arc',
      description: 'Start with a challenge, show the data insights, present the solution',
      structure: ['context', 'insight', 'implication', 'action']
    },
    {
      title: 'The Journey of Discovery',
      description: 'Take audience through your analytical journey and findings',
      structure: ['context', 'insight', 'insight', 'implication']
    },
    {
      title: 'The Transformation Story',
      description: 'Show before/after states and what the data reveals about change',
      structure: ['context', 'insight', 'implication', 'action']
    }
  ];

  const exampleDatasets = [
    {
      title: 'Nonprofit Impact Analysis',
      data: 'Program effectiveness data showing 40% increase in participant outcomes over 18 months',
      audience: 'Board of Directors',
      purpose: 'Secure funding for program expansion'
    },
    {
      title: 'Volunteer Engagement Study',
      data: 'Volunteer retention rates and satisfaction surveys revealing key factors for long-term commitment',
      audience: 'Program Managers',
      purpose: 'Improve volunteer experience and retention'
    },
    {
      title: 'Fundraising Campaign Analysis',
      data: 'Multi-channel campaign performance data showing unexpected donor behavior patterns',
      audience: 'Development Team',
      purpose: 'Optimize future fundraising strategies'
    }
  ];

  const generateStory = async () => {
    if (!dataDescription.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate story elements
    const elements: DataStoryElement[] = [
      {
        type: 'context',
        title: 'Setting the Stage',
        content: `In today's data-driven world, understanding our impact is crucial. ${audience} needs clear insights to make informed decisions about ${purpose.toLowerCase()}.`,
        order: 0
      },
      {
        type: 'insight',
        title: 'What the Data Reveals',
        content: `Our analysis of ${dataDescription.toLowerCase()} shows remarkable patterns. The data tells us a story of transformation and opportunity that wasn't visible before.`,
        dataPoint: '40% improvement in key metrics',
        order: 1
      },
      {
        type: 'insight',
        title: 'The Hidden Pattern',
        content: `Digging deeper, we discovered that success wasn't random. There's a clear correlation between engagement level and outcomes, with engaged participants showing 3x better results.`,
        dataPoint: '3x better outcomes for engaged participants',
        order: 2
      },
      {
        type: 'implication',
        title: 'What This Means',
        content: `These insights change everything. Instead of broad, general approaches, we can now focus our efforts on what actually works - creating engagement from day one.`,
        order: 3
      },
      {
        type: 'action',
        title: 'The Path Forward',
        content: `Armed with this knowledge, we recommend implementing engagement-focused onboarding, targeted support for at-risk participants, and resource reallocation to high-impact activities.`,
        order: 4
      }
    ];

    // Generate full narrative
    const narrative = `${elements[0].content}

${elements[1].content} ${elements[1].dataPoint ? `Specifically, we see ${elements[1].dataPoint}.` : ''}

${elements[2].content} ${elements[2].dataPoint ? `The numbers show ${elements[2].dataPoint}.` : ''}

${elements[3].content}

${elements[4].content}

This data-driven approach ensures we're not just hoping for better results - we're strategically building them based on what the evidence tells us works.`;

    const newStory: DataStory = {
      id: Date.now().toString(),
      title: `Data Story: ${dataDescription.split(' ').slice(0, 4).join(' ')}`,
      narrative,
      elements,
      audience,
      purpose,
      keyMessage: 'Data reveals actionable insights for strategic improvement',
      generated: new Date()
    };

    setGeneratedStory(newStory);
    setIsGenerating(false);
  };

  const saveStory = () => {
    if (generatedStory) {
      setSavedStories(prev => [generatedStory, ...prev.slice(0, 4)]);
    }
  };

  const loadExample = (example: typeof exampleDatasets[0]) => {
    setDataDescription(example.data);
    setAudience(example.audience);
    setPurpose(example.purpose);
    setGeneratedStory(null);
  };

  const exportStory = () => {
    if (!generatedStory) return;
    
    const storyText = `
DATA STORY: ${generatedStory.title}
Audience: ${generatedStory.audience}
Purpose: ${generatedStory.purpose}
Generated: ${generatedStory.generated.toLocaleString()}

KEY MESSAGE: ${generatedStory.keyMessage}

NARRATIVE:
${generatedStory.narrative}

STORY ELEMENTS:
${generatedStory.elements.map((element, i) => 
  `${i + 1}. ${element.title} (${element.type})
   ${element.content}
   ${element.dataPoint ? `Data Point: ${element.dataPoint}` : ''}`
).join('\n\n')}
    `;
    
    navigator.clipboard.writeText(storyText.trim());
  };

  const getElementColor = (type: string) => {
    switch (type) {
      case 'context': return 'bg-blue-100 text-blue-800';
      case 'insight': return 'bg-green-100 text-green-800';
      case 'implication': return 'bg-yellow-100 text-yellow-800';
      case 'action': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'context': return Users;
      case 'insight': return TrendingUp;
      case 'implication': return Target;
      case 'action': return Play;
      default: return FileText;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Data Story Builder</CardTitle>
              <CardDescription>
                Transform data insights into compelling narratives that drive action
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Story Foundation</CardTitle>
                  <CardDescription>Set the context for your data narrative</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Example Datasets */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Try example scenarios:</label>
                    <div className="space-y-2">
                      {exampleDatasets.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => loadExample(example)}
                        >
                          <div>
                            <div className="font-medium">{example.title}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {example.data.substring(0, 60)}...
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Data Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data & Key Findings:</label>
                    <Textarea
                      placeholder="Describe your data and main insights..."
                      value={dataDescription}
                      onChange={(e) => setDataDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Audience */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience:</label>
                    <Input
                      placeholder="Who are you presenting to? (e.g., Board of Directors, Program Staff)"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>

                  {/* Purpose */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story Purpose:</label>
                    <Input
                      placeholder="What action do you want them to take? (e.g., Approve budget, Change strategy)"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Story Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Story Structure Templates</CardTitle>
                  <CardDescription>Choose a narrative framework</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {storyTemplates.map((template, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex gap-1">
                          {template.structure.map((element, i) => (
                            <Badge key={i} className={getElementColor(element)} variant="secondary">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateStory}
                disabled={!dataDescription.trim() || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Building Your Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Data Story
                  </>
                )}
              </Button>
            </div>

            {/* Generated Story */}
            <div className="space-y-4">
              {generatedStory ? (
                <div className="space-y-4">
                  {/* Story Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{generatedStory.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={saveStory}>
                            <Download className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={exportStory}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Audience: {generatedStory.audience}</div>
                        <div>Purpose: {generatedStory.purpose}</div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Story Elements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Story Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedStory.elements.map((element, index) => {
                        const Icon = getElementIcon(element.type);
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-5 h-5 text-green-600" />
                              <h4 className="font-semibold">{element.title}</h4>
                              <Badge className={getElementColor(element.type)} variant="secondary">
                                {element.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{element.content}</p>
                            {element.dataPoint && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">
                                    Key Data: {element.dataPoint}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Full Narrative */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Complete Narrative</CardTitle>
                      <CardDescription className="text-green-600">
                        Your story ready for presentation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {generatedStory.narrative.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="text-sm text-green-700 mb-3">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                    <p className="text-center">
                      Provide your data insights to build<br />
                      a compelling narrative that drives action
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Saved Stories */}
          {savedStories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Data Stories</CardTitle>
                <CardDescription>Your narrative library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedStories.map((story) => (
                    <Card key={story.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{story.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {story.elements.length} parts
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          For: {story.audience}
                        </p>
                        <p className="text-xs text-gray-500">
                          {story.generated.toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Storytelling Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">David's Storytelling Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">Compelling Data Stories:</h4>
                  <ul className="space-y-1">
                    <li>• Start with context your audience cares about</li>
                    <li>• Use specific numbers, not vague statements</li>
                    <li>• Connect insights to real-world implications</li>
                    <li>• End with clear, actionable next steps</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Presentation Success:</h4>
                  <ul className="space-y-1">
                    <li>• Know your audience's priorities and concerns</li>
                    <li>• Practice the narrative flow beforehand</li>
                    <li>• Use visuals to support, not replace, the story</li>
                    <li>• Be prepared to answer "what if" questions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidDataStoryBuilder;