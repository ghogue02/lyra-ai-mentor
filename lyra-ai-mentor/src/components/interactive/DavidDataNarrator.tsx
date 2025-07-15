import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download,
  BookOpen,
  BarChart3,
  TrendingUp,
  Users,
  Headphones,
  Waveform
} from 'lucide-react';

interface NarrationScript {
  id: string;
  title: string;
  sections: NarrationSection[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  generated: Date;
}

interface NarrationSection {
  type: 'intro' | 'data' | 'insight' | 'conclusion';
  title: string;
  script: string;
  voiceNotes: string[];
  estimatedTime: number;
  paceGuidance: 'slow' | 'normal' | 'fast';
}

interface VoiceSettings {
  pitch: 'low' | 'normal' | 'high';
  pace: 'slow' | 'normal' | 'fast';
  emphasis: 'subtle' | 'moderate' | 'strong';
  tone: 'professional' | 'conversational' | 'authoritative';
}

const DavidDataNarrator: React.FC = () => {
  const [dataContext, setDataContext] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [audience, setAudience] = useState('');
  const [generatedScript, setGeneratedScript] = useState<NarrationScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    pitch: 'normal',
    pace: 'normal',
    emphasis: 'moderate',
    tone: 'professional'
  });

  const narrationTypes = [
    {
      id: 'explainer',
      title: 'Data Explainer',
      description: 'Educational walkthrough of data insights',
      duration: '3-5 min',
      sections: ['intro', 'data', 'insight', 'conclusion']
    },
    {
      id: 'story',
      title: 'Data Story',
      description: 'Narrative-driven data presentation',
      duration: '5-8 min',
      sections: ['intro', 'data', 'insight', 'insight', 'conclusion']
    },
    {
      id: 'briefing',
      title: 'Executive Briefing',
      description: 'Concise data summary for leadership',
      duration: '2-3 min',
      sections: ['intro', 'data', 'conclusion']
    },
    {
      id: 'podcast',
      title: 'Podcast Segment',
      description: 'Conversational data discussion',
      duration: '8-12 min',
      sections: ['intro', 'data', 'insight', 'data', 'conclusion']
    }
  ];

  const exampleDatasets = [
    {
      title: 'Nonprofit Impact Results',
      context: 'Our literacy program served 500 children this year with 85% improvement in reading scores',
      message: 'Small class sizes and dedicated volunteers make a transformative difference',
      audience: 'Donors and community supporters'
    },
    {
      title: 'Volunteer Engagement Study',
      context: 'Analysis of 200 volunteers shows 70% retention rate with specific engagement factors',
      message: 'Personal connection and meaningful roles drive volunteer commitment',
      audience: 'Program coordinators and volunteer managers'
    },
    {
      title: 'Fundraising Campaign Analysis',
      context: 'Multi-channel campaign raised $75,000 with surprising results from social media',
      message: 'Digital engagement is becoming our most effective donor acquisition channel',
      audience: 'Development team and board members'
    }
  ];

  const generateNarrationScript = async () => {
    if (!dataContext.trim() || !keyMessage.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI script generation
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const sections: NarrationSection[] = [
      {
        type: 'intro',
        title: 'Setting the Context',
        script: `Welcome to today's data story. I'm going to share some fascinating insights about ${dataContext.toLowerCase()}. 

What makes this particularly interesting is how the numbers reveal something unexpected about ${audience.toLowerCase()}. 

By the end of this brief exploration, you'll understand ${keyMessage.toLowerCase()} and why it matters for our work moving forward.`,
        voiceNotes: [
          'Start with warm, welcoming tone',
          'Emphasize "fascinating insights"',
          'Pause after "unexpected"'
        ],
        estimatedTime: 45,
        paceGuidance: 'normal'
      },
      {
        type: 'data',
        title: 'The Numbers Story',
        script: `Let me walk you through the key data points. 

First, the headline number: ${dataContext.includes('500') ? '500 children participated' : 'we saw significant improvements across all metrics'}. But that's just the beginning.

When we dig deeper, we find that ${dataContext.includes('85%') ? '85% showed meaningful improvement' : 'the results exceeded our expectations by 40%'}. 

This isn't just a statistic - it represents real transformation in people's lives.`,
        voiceNotes: [
          'Slow down for numbers',
          'Emphasize "headline number"',
          'Build excitement with "But that\'s just the beginning"',
          'Soften tone for "real transformation"'
        ],
        estimatedTime: 75,
        paceGuidance: 'slow'
      },
      {
        type: 'insight',
        title: 'What This Reveals',
        script: `Here's what's remarkable about these findings: ${keyMessage.toLowerCase()}.

This insight changes how we think about our approach. It tells us that our assumptions about ${audience.includes('donor') ? 'donor engagement' : 'program effectiveness'} were only partially correct.

The data shows us a path forward that's both surprising and encouraging. It suggests that small, focused changes can yield significant results.`,
        voiceNotes: [
          'Build up to "remarkable"',
          'Pause after "changes how we think"',
          'Emphasize "surprising and encouraging"'
        ],
        estimatedTime: 60,
        paceGuidance: 'normal'
      },
      {
        type: 'conclusion',
        title: 'Moving Forward',
        script: `So where does this leave us? 

The evidence is clear: ${keyMessage.toLowerCase()}. This isn't just data - it's a roadmap for more effective action.

As we move forward, these insights will guide our decisions and help us serve our community even better. The numbers don't lie, and they're pointing us toward a promising future.

Thank you for joining me in exploring this data story. The real story, of course, is just beginning.`,
        voiceNotes: [
          'Rhetorical question with slight pause',
          'Confident tone for "evidence is clear"',
          'Inspirational tone for "promising future"',
          'End on hopeful, forward-looking note'
        ],
        estimatedTime: 50,
        paceGuidance: 'normal'
      }
    ];

    const totalDuration = sections.reduce((sum, section) => sum + section.estimatedTime, 0);

    const newScript: NarrationScript = {
      id: Date.now().toString(),
      title: `Data Narration: ${dataContext.split(' ').slice(0, 4).join(' ')}`,
      sections,
      totalDuration,
      difficulty: totalDuration > 240 ? 'advanced' : totalDuration > 180 ? 'intermediate' : 'beginner',
      generated: new Date()
    };

    setGeneratedScript(newScript);
    setIsGenerating(false);
  };

  const playSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setIsPlaying(true);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const loadExample = (example: typeof exampleDatasets[0]) => {
    setDataContext(example.context);
    setKeyMessage(example.message);
    setAudience(example.audience);
    setGeneratedScript(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'slow': return 'text-blue-600';
      case 'fast': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'intro': return Users;
      case 'data': return BarChart3;
      case 'insight': return TrendingUp;
      case 'conclusion': return BookOpen;
      default: return BookOpen;
    }
  };

  const exportScript = () => {
    if (!generatedScript) return;
    
    const scriptText = `
NARRATION SCRIPT: ${generatedScript.title}
Duration: ${formatTime(generatedScript.totalDuration)}
Difficulty: ${generatedScript.difficulty}
Generated: ${generatedScript.generated.toLocaleString()}

${generatedScript.sections.map((section, i) => 
  `SECTION ${i + 1}: ${section.title.toUpperCase()} (${formatTime(section.estimatedTime)})
Pace: ${section.paceGuidance}

SCRIPT:
${section.script}

VOICE NOTES:
${section.voiceNotes.map(note => `• ${note}`).join('\n')}
`
).join('\n\n')}
    `;
    
    navigator.clipboard.writeText(scriptText.trim());
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Headphones className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Data Narrator</CardTitle>
              <CardDescription>
                Create voice-guided data storytelling with AI-powered narration scripts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Script Generation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Narration Setup</CardTitle>
                  <CardDescription>Define your data story for voice narration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Example Templates */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Try example data stories:</label>
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
                              {example.context.substring(0, 50)}...
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Data Context */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Context:</label>
                    <Textarea
                      placeholder="Describe your data and key findings..."
                      value={dataContext}
                      onChange={(e) => setDataContext(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Key Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Message:</label>
                    <Input
                      placeholder="What's the main insight you want to convey?"
                      value={keyMessage}
                      onChange={(e) => setKeyMessage(e.target.value)}
                    />
                  </div>

                  {/* Audience */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience:</label>
                    <Input
                      placeholder="Who will be listening to this narration?"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Voice Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Voice Settings</CardTitle>
                  <CardDescription>Customize your narration style</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tone:</label>
                      <div className="grid grid-cols-2 gap-1">
                        {(['professional', 'conversational'] as const).map((tone) => (
                          <Button
                            key={tone}
                            variant={voiceSettings.tone === tone ? "default" : "outline"}
                            size="sm"
                            onClick={() => setVoiceSettings(prev => ({ ...prev, tone }))}
                            className="text-xs"
                          >
                            {tone}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pace:</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['slow', 'normal', 'fast'] as const).map((pace) => (
                          <Button
                            key={pace}
                            variant={voiceSettings.pace === pace ? "default" : "outline"}
                            size="sm"
                            onClick={() => setVoiceSettings(prev => ({ ...prev, pace }))}
                            className="text-xs"
                          >
                            {pace}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateNarrationScript}
                disabled={!dataContext.trim() || !keyMessage.trim() || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Generate Narration Script
                  </>
                )}
              </Button>
            </div>

            {/* Generated Script */}
            <div className="space-y-4">
              {generatedScript ? (
                <div className="space-y-4">
                  {/* Script Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{generatedScript.title}</CardTitle>
                          <CardDescription>
                            Duration: {formatTime(generatedScript.totalDuration)} • 
                            Difficulty: {generatedScript.difficulty}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={exportScript}>
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Script Sections */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Narration Script</CardTitle>
                      <CardDescription>Practice sections with voice guidance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedScript.sections.map((section, index) => {
                        const Icon = getSectionIcon(section.type);
                        const isCurrentSection = currentSection === index;
                        
                        return (
                          <div key={index} className={`border rounded-lg p-4 ${
                            isCurrentSection ? 'border-green-300 bg-green-50' : ''
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold">{section.title}</h4>
                                <Badge variant="outline">{formatTime(section.estimatedTime)}</Badge>
                                <Badge className={getPaceColor(section.paceGuidance)} variant="outline">
                                  {section.paceGuidance} pace
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => playSection(index)}
                                disabled={isPlaying && isCurrentSection}
                              >
                                {isPlaying && isCurrentSection ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-white rounded border p-3">
                                <p className="text-sm leading-relaxed">{section.script}</p>
                              </div>

                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Voice Notes:</h5>
                                <ul className="space-y-1">
                                  {section.voiceNotes.map((note, noteIndex) => (
                                    <li key={noteIndex} className="flex items-start gap-2">
                                      <Mic className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs text-gray-600">{note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Practice Controls */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Practice Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-blue-700">
                          Section {currentSection + 1} of {generatedScript.sections.length}
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            {voiceSettings.tone} • {voiceSettings.pace}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                          disabled={currentSection === 0}
                        >
                          Previous Section
                        </Button>
                        <Button
                          onClick={() => setIsRecording(!isRecording)}
                          className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {isRecording ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 mr-2" />
                              Practice Recording
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentSection(Math.min(generatedScript.sections.length - 1, currentSection + 1))}
                          disabled={currentSection === generatedScript.sections.length - 1}
                        >
                          Next Section
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Headphones className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Narrate</h3>
                    <p className="text-center">
                      Provide your data context to generate<br />
                      a professional narration script
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Narration Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Narration Types</CardTitle>
              <CardDescription>Choose your storytelling format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {narrationTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{type.title}</h4>
                      <Badge variant="outline">{type.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {type.sections.map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Narration Tips */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">David's Narration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h4 className="font-semibold mb-2">Voice Techniques:</h4>
                  <ul className="space-y-1">
                    <li>• Slow down for important numbers</li>
                    <li>• Use pauses to emphasize key insights</li>
                    <li>• Vary your pitch to maintain interest</li>
                    <li>• End with energy and forward momentum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Storytelling:</h4>
                  <ul className="space-y-1">
                    <li>• Connect numbers to human impact</li>
                    <li>• Build narrative tension with reveals</li>
                    <li>• Use concrete examples and comparisons</li>
                    <li>• Practice until it sounds conversational</li>
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

export default DavidDataNarrator;