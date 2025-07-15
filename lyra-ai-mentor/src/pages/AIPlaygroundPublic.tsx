import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Mail, 
  Mic, 
  BarChart, 
  Workflow, 
  Target,
  ChevronRight,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComponentInfo {
  name: string;
  description: string;
  character: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const AIPlaygroundPublic = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');
  const navigate = useNavigate();

  const characters = [
    { id: 'maya', name: 'Maya Rodriguez', color: 'bg-purple-500', icon: <Mail className="w-5 h-5" />, description: 'Email & Communication' },
    { id: 'sofia', name: 'Sofia Martinez', color: 'bg-yellow-500', icon: <Mic className="w-5 h-5" />, description: 'Voice & Storytelling' },
    { id: 'david', name: 'David Chen', color: 'bg-green-500', icon: <BarChart className="w-5 h-5" />, description: 'Data & Analytics' },
    { id: 'rachel', name: 'Rachel Thompson', color: 'bg-teal-500', icon: <Workflow className="w-5 h-5" />, description: 'Automation & Workflow' },
    { id: 'alex', name: 'Alex Rivera', color: 'bg-purple-600', icon: <Target className="w-5 h-5" />, description: 'Change & Strategy' }
  ];

  const components: ComponentInfo[] = [
    // Maya Components
    { name: 'Email Composer', description: 'AI-powered email generation with tone control', character: 'maya', icon: <Mail />, color: 'purple', features: ['CARE Framework', 'Tone Analysis', 'Template Library'] },
    { name: 'Communication Coach', description: 'Improve your communication skills', character: 'maya', icon: <Brain />, color: 'purple', features: ['Real-time Feedback', 'Style Suggestions', 'Confidence Building'] },
    { name: 'Subject Line Workshop', description: 'Craft compelling subject lines', character: 'maya', icon: <Sparkles />, color: 'purple', features: ['A/B Testing', 'Open Rate Prediction', 'Best Practices'] },
    { name: 'Template Library', description: 'Pre-built email templates', character: 'maya', icon: <Mail />, color: 'purple', features: ['Customizable', 'Industry-Specific', 'Multi-Purpose'] },
    { name: 'Tone Checker', description: 'Analyze and adjust email tone', character: 'maya', icon: <Zap />, color: 'purple', features: ['Sentiment Analysis', 'Audience Matching', 'Tone Adjustment'] },
    
    // Sofia Components
    { name: 'Voice Discovery', description: 'Find your authentic voice', character: 'sofia', icon: <Mic />, color: 'yellow', features: ['Voice Analysis', 'Style Guide', 'Practice Exercises'] },
    { name: 'Story Creator', description: 'AI-powered story generation', character: 'sofia', icon: <Sparkles />, color: 'yellow', features: ['Narrative Structure', 'Character Development', 'Plot Generation'] },
    { name: 'Authenticity Trainer', description: 'Build authentic communication', character: 'sofia', icon: <Brain />, color: 'yellow', features: ['Voice Coaching', 'Authenticity Metrics', 'Personal Branding'] },
    { name: 'Voice Recorder', description: 'Record and analyze your voice', character: 'sofia', icon: <Mic />, color: 'yellow', features: ['Voice Recording', 'Pitch Analysis', 'Tone Feedback'] },
    { name: 'Narrative Builder', description: 'Construct compelling narratives', character: 'sofia', icon: <Zap />, color: 'yellow', features: ['Story Arc', 'Emotional Journey', 'Impact Messaging'] },
    
    // David Components
    { name: 'Data Story Finder', description: 'Find stories in your data', character: 'david', icon: <BarChart />, color: 'green', features: ['Pattern Recognition', 'Insight Generation', 'Visualization'] },
    { name: 'Analytics Dashboard', description: 'Real-time data analytics', character: 'david', icon: <BarChart />, color: 'green', features: ['Live Updates', 'Custom Metrics', 'Predictive Analytics'] },
    { name: 'Insight Generator', description: 'AI-powered data insights', character: 'david', icon: <Brain />, color: 'green', features: ['Automated Analysis', 'Trend Detection', 'Recommendations'] },
    { name: 'Data Visualizer', description: 'Interactive data visualization', character: 'david', icon: <Sparkles />, color: 'green', features: ['Chart Types', 'Interactive Elements', 'Export Options'] },
    { name: 'Presentation Coach', description: 'Data presentation skills', character: 'david', icon: <Zap />, color: 'green', features: ['Slide Design', 'Narrative Flow', 'Visual Best Practices'] },
    
    // Rachel Components
    { name: 'Automation Vision', description: 'Identify automation opportunities', character: 'rachel', icon: <Workflow />, color: 'teal', features: ['Process Analysis', 'ROI Calculation', 'Implementation Plan'] },
    { name: 'Workflow Builder', description: 'Design automated workflows', character: 'rachel', icon: <Workflow />, color: 'teal', features: ['Drag & Drop', 'Logic Builder', 'Integration Hub'] },
    { name: 'Process Mapper', description: 'Visual process mapping', character: 'rachel', icon: <Sparkles />, color: 'teal', features: ['Flow Diagrams', 'Bottleneck Analysis', 'Optimization'] },
    { name: 'Efficiency Analyzer', description: 'Analyze process efficiency', character: 'rachel', icon: <Brain />, color: 'teal', features: ['Time Tracking', 'Resource Usage', 'Cost Analysis'] },
    { name: 'Task Automator', description: 'Automate repetitive tasks', character: 'rachel', icon: <Zap />, color: 'teal', features: ['Script Generation', 'Scheduling', 'Error Handling'] },
    
    // Alex Components
    { name: 'Change Strategy', description: 'Plan organizational change', character: 'alex', icon: <Target />, color: 'purple', features: ['Change Models', 'Stakeholder Analysis', 'Timeline Planning'] },
    { name: 'Leadership Development', description: 'Build leadership skills', character: 'alex', icon: <Brain />, color: 'purple', features: ['Skill Assessment', 'Learning Paths', 'Coaching Tools'] },
    { name: 'Impact Measurement', description: 'Measure change impact', character: 'alex', icon: <BarChart />, color: 'purple', features: ['KPI Tracking', 'Survey Tools', 'Report Generation'] },
    { name: 'Strategic Planning', description: 'AI-powered strategic plans', character: 'alex', icon: <Sparkles />, color: 'purple', features: ['SWOT Analysis', 'Goal Setting', 'Action Plans'] },
    { name: 'Decision Framework', description: 'Structured decision making', character: 'alex', icon: <Zap />, color: 'purple', features: ['Decision Trees', 'Risk Assessment', 'Outcome Modeling'] }
  ];

  const filteredComponents = selectedCharacter === 'all' 
    ? components 
    : components.filter(c => c.character === selectedCharacter);

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Learning Playground
          </h1>
          <p className="text-gray-600 text-lg">
            Explore 75+ AI-powered tools designed to transform your nonprofit work
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/test/ai-playground')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Try All Components
            </Button>
            <Button 
              onClick={() => navigate('/multimodal')}
              variant="outline"
            >
              <Mic className="mr-2 h-4 w-4" />
              Multimodal Features
            </Button>
            <Button 
              onClick={() => navigate('/ai-playground')}
              variant="outline"
            >
              <Brain className="mr-2 h-4 w-4" />
              Interactive Hub
            </Button>
          </div>
        </div>

        {/* Character Filter */}
        <div className="mb-6">
          <Tabs value={selectedCharacter} onValueChange={setSelectedCharacter}>
            <TabsList className="grid grid-cols-6 w-full max-w-3xl mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {characters.map(char => (
                <TabsTrigger key={char.id} value={char.id}>
                  <div className="flex items-center gap-2">
                    {char.icon}
                    <span className="hidden sm:inline">{char.name.split(' ')[0]}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Character Info Cards */}
        {selectedCharacter !== 'all' && (
          <div className="mb-8">
            {characters.filter(c => c.id === selectedCharacter).map(char => (
              <Card key={char.id} className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`${char.color} p-3 rounded-full text-white`}>
                      {char.icon}
                    </div>
                    <div>
                      <CardTitle>{char.name}</CardTitle>
                      <CardDescription>{char.description} Expert</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/test/ai-playground')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${getColorClasses(component.color)}`}>
                    {component.icon}
                  </div>
                  <Badge variant="secondary">
                    {characters.find(c => c.id === component.character)?.name.split(' ')[0]}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{component.name}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {component.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-3 h-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">75+</div>
              <p className="text-sm text-gray-600">AI Components</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-gray-600">Expert Characters</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">Real AI</div>
              <p className="text-sm text-gray-600">OpenAI Integration</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-sm text-gray-600">Production Ready</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPlaygroundPublic;