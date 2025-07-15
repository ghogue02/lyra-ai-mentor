import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Users,
  TrendingUp,
  Sparkles,
  Map,
  Heart,
  Target,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { LearningPath } from '@/components/learning/LearningPath';
import { enhancedAIService } from '@/services/enhancedAIService';

interface ChangeElement {
  type: 'readiness' | 'approach' | 'outcome';
  label: string;
  emoji: string;
  description: string;
  indicator?: string;
}

const readinessOptions: ChangeElement[] = [
  { type: 'readiness', label: 'Ready & Eager', emoji: '🚀', description: 'Team excited for change', indicator: 'High energy, asking questions' },
  { type: 'readiness', label: 'Cautiously Optimistic', emoji: '🤔', description: 'Open but uncertain', indicator: 'Need more information' },
  { type: 'readiness', label: 'Resistant & Worried', emoji: '😟', description: 'Concerns about change', indicator: 'Expressing fears, avoiding' },
];

const approachOptions: ChangeElement[] = [
  { type: 'approach', label: 'Small Steps First', emoji: '👣', description: 'Gradual implementation', indicator: 'Build confidence slowly' },
  { type: 'approach', label: 'Pilot Program', emoji: '🧪', description: 'Test with volunteers', indicator: 'Prove value before scaling' },
  { type: 'approach', label: 'Full Team Launch', emoji: '🚢', description: 'Everyone together', indicator: 'Clear vision, strong buy-in' },
];

const outcomeOptions: ChangeElement[] = [
  { type: 'outcome', label: 'Increased Impact', emoji: '📈', description: 'Better results for mission' },
  { type: 'outcome', label: 'Team Empowerment', emoji: '💪', description: 'Stronger, more capable team' },
  { type: 'outcome', label: 'Sustainable Growth', emoji: '🌱', description: 'Long-term organizational health' },
];

export const AlexChangeLearningPath: React.FC = () => {
  const [selectedElements, setSelectedElements] = useState<{
    readiness?: ChangeElement;
    approach?: ChangeElement;
    outcome?: ChangeElement;
  }>({});
  const [changeRoadmap, setChangeRoadmap] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const objectives = [
    {
      id: '1',
      title: 'Assess Change Readiness',
      description: 'Understand where your team stands and what they need'
    },
    {
      id: '2',
      title: 'Choose Your Approach',
      description: 'Select the right strategy for your unique situation'
    },
    {
      id: '3',
      title: 'Create Change Roadmap',
      description: 'Build a clear plan that brings everyone along'
    }
  ];

  const steps = [
    {
      id: 'learn',
      title: 'Understand Change Leadership',
      duration: '30 seconds',
      type: 'learn' as const,
      content: null,
      completed: false
    },
    {
      id: 'practice',
      title: 'Assess Your Situation',
      duration: '2 minutes',
      type: 'practice' as const,
      content: null,
      completed: false
    },
    {
      id: 'apply',
      title: 'Build Your Roadmap',
      duration: '2.5 minutes',
      type: 'apply' as const,
      content: null,
      completed: false
    }
  ];

  const tips = [
    { id: '1', tip: 'People support what they help create - involve your team early!', emoji: '🤝' },
    { id: '2', tip: 'Celebrate small wins along the way to build momentum', emoji: '🎉' },
    { id: '3', tip: 'Address fears directly - unspoken worries grow in the dark', emoji: '💡' },
    { id: '4', tip: 'Connect every change to your mission - purpose drives adoption', emoji: '❤️' },
    { id: '5', tip: 'Use AI to draft communications that inspire and reassure', emoji: '🤖' }
  ];

  const handleSelectElement = (element: ChangeElement) => {
    setSelectedElements(prev => ({
      ...prev,
      [element.type]: element
    }));
  };

  const generateChangeRoadmap = async () => {
    if (!selectedElements.readiness || !selectedElements.approach || !selectedElements.outcome) {
      toast.error('Please complete all assessment elements first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const roadmap = `🗺️ Your Change Leadership Roadmap

Current State: ${selectedElements.readiness.emoji} ${selectedElements.readiness.label}
Strategy: ${selectedElements.approach.emoji} ${selectedElements.approach.label}
Vision: ${selectedElements.outcome.emoji} ${selectedElements.outcome.label}

📍 Week 1-2: Foundation Building
${selectedElements.readiness.label === 'Ready & Eager' 
  ? '• Channel enthusiasm into concrete planning\n• Identify change champions in each department'
  : selectedElements.readiness.label === 'Cautiously Optimistic'
  ? '• Host listening sessions to understand concerns\n• Share success stories from similar organizations'
  : '• One-on-one conversations with worried team members\n• Address specific fears with facts and support'}

📍 Week 3-4: ${selectedElements.approach.label} Implementation
${selectedElements.approach.label === 'Small Steps First'
  ? '• Start with one simple process improvement\n• Document and share early wins\n• Gradually expand based on comfort'
  : selectedElements.approach.label === 'Pilot Program'
  ? '• Recruit 3-5 enthusiastic volunteers\n• Run 30-day pilot with clear metrics\n• Gather feedback and refine approach'
  : '• All-hands meeting to launch together\n• Daily check-ins during first week\n• Rapid response team for issues'}

📍 Week 5-6: Momentum Building
• Celebrate progress publicly
• Share stories of ${selectedElements.outcome.label.toLowerCase()}
• Adjust approach based on feedback
• Recognize change champions

📍 Week 7-8: Embedding Success
• Document new processes clearly
• Create peer support systems
• Plan for continuous improvement
• Set 90-day review milestone

🎯 Success Metrics:
• Team confidence: Weekly pulse surveys
• Process adoption: Usage statistics
• Mission impact: ${selectedElements.outcome.label} indicators

💡 Communication Plan:
• Weekly updates focusing on progress
• Open office hours for questions
• Success story sharing at team meetings

Remember: Change is a journey, not a destination. Your ${selectedElements.readiness.description.toLowerCase()} team can achieve ${selectedElements.outcome.label.toLowerCase()} with the right support!`;

      setChangeRoadmap(roadmap);
      toast.success('Change roadmap created!');
    } catch (error) {
      toast.error('Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyRoadmap = () => {
    navigator.clipboard.writeText(changeRoadmap);
    toast.success('Roadmap copied to clipboard!');
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'learn':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-600" />
                The Change Leadership Formula
              </h3>
              <p className="text-gray-700 mb-4">
                Successful change happens when you balance three key elements:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Readiness Assessment</p>
                    <p className="text-sm text-gray-600">Where is your team emotionally?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Strategic Approach</p>
                    <p className="text-sm text-gray-600">How will you introduce change?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Desired Outcome</p>
                    <p className="text-sm text-gray-600">What success looks like</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Change Leadership Secret:</p>
                    <p className="text-sm text-purple-700 mt-1">
                      "People don't resist change - they resist being changed."
                      Make them partners, not passengers!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">70%</p>
                  <p className="text-xs text-gray-600">Success with buy-in</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-bold">3x</p>
                  <p className="text-xs text-gray-600">Faster adoption</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-gray-600">Better outcomes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Assess Your Change Situation</h3>
              <p className="text-gray-600 mt-1">Be honest - this creates your custom roadmap</p>
            </div>

            {/* Readiness Assessment */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">1</span>
                </div>
                How ready is your team?
              </h4>
              <div className="grid gap-2">
                {readinessOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.readiness?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.indicator}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Approach Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-700">2</span>
                </div>
                What approach fits best?
              </h4>
              <div className="grid gap-2">
                {approachOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.approach?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.indicator}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Outcome Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-700">3</span>
                </div>
                What's your primary goal?
              </h4>
              <div className="grid gap-2">
                {outcomeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.outcome?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Assessment Summary */}
            {Object.keys(selectedElements).length > 0 && (
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Your Change Profile:</h4>
                  <div className="space-y-1 text-sm">
                    {selectedElements.readiness && (
                      <p>✓ Team: {selectedElements.readiness.label} {selectedElements.readiness.emoji}</p>
                    )}
                    {selectedElements.approach && (
                      <p>✓ Strategy: {selectedElements.approach.label} {selectedElements.approach.emoji}</p>
                    )}
                    {selectedElements.outcome && (
                      <p>✓ Goal: {selectedElements.outcome.label} {selectedElements.outcome.emoji}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-6">
            {!changeRoadmap ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Create Your Change Roadmap!</h3>
                <p className="text-gray-600">
                  Let's build a custom plan for your unique situation
                </p>
                
                {/* Show assessment summary */}
                <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 max-w-md mx-auto">
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span>Team Status:</span>
                        <span className="font-medium">
                          {selectedElements.readiness?.label} {selectedElements.readiness?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Approach:</span>
                        <span className="font-medium">
                          {selectedElements.approach?.label} {selectedElements.approach?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Target:</span>
                        <span className="font-medium">
                          {selectedElements.outcome?.label} {selectedElements.outcome?.emoji}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={generateChangeRoadmap}
                  disabled={isGenerating || !selectedElements.readiness || !selectedElements.approach || !selectedElements.outcome}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Creating roadmap...
                    </>
                  ) : (
                    <>
                      <Map className="w-5 h-5 mr-2" />
                      Generate Change Roadmap
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 Coming next:</strong> A week-by-week roadmap customized for your team's 
                    readiness level and chosen approach!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Change Roadmap</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to lead
                  </Badge>
                </div>

                {/* Roadmap Display */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {changeRoadmap}
                    </pre>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={copyRoadmap} className="flex-1">
                    <Map className="w-4 h-4 mr-2" />
                    Save Roadmap
                  </Button>
                  <Button 
                    onClick={() => {
                      setChangeRoadmap('');
                      setSelectedElements({});
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Try Different Scenario
                  </Button>
                </div>

                {/* Leadership Impact */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium text-orange-900 mb-2">
                      🌟 Your Leadership Impact
                    </h4>
                    <p className="text-sm text-orange-800">
                      By following this roadmap, you'll:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-orange-800">
                      <li>• Build trust through transparency</li>
                      <li>• Create sustainable change</li>
                      <li>• Empower your team to thrive</li>
                      <li>• Achieve your mission more effectively</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 mb-3">Ready to start?</p>
                  <p className="text-sm text-gray-500">
                    Share this roadmap with a trusted colleague for feedback, then take your first step tomorrow!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LearningPath
      title="Lead Change in 5 Minutes"
      skill="Change Leadership Mastery"
      estimatedMinutes={5}
      objectives={objectives}
      steps={steps}
      tips={tips}
      onComplete={(data) => {
        console.log('Learning path completed:', data);
        toast.success('You\'re ready to lead transformational change!');
      }}
    >
      {renderStepContent(steps.find(s => !s.completed)?.id || 'learn')}
    </LearningPath>
  );
};