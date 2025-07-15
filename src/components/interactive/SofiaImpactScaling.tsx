import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Rocket, Calendar, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentChannel {
  id: string;
  name: string;
  frequency: string;
  purpose: string;
  storyType: string;
  example: string;
  selected: boolean;
}

interface SofiaImpactScalingProps {
  onComplete?: () => void;
}

export const SofiaImpactScaling: React.FC<SofiaImpactScalingProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'strategy' | 'channels' | 'calendar' | 'success'>('context');
  const [contentChannels, setContentChannels] = useState<ContentChannel[]>([
    {
      id: 'monthly-newsletter',
      name: 'Monthly Newsletter',
      frequency: 'Monthly',
      purpose: 'Donor retention & engagement',
      storyType: 'Program highlights & beneficiary spotlights',
      example: 'Feature one transformation story, program updates, upcoming events',
      selected: false
    },
    {
      id: 'social-media',
      name: 'Social Media',
      frequency: 'Weekly',
      purpose: 'Community awareness & volunteer recruitment',
      storyType: 'Behind-the-scenes moments & quick wins',
      example: 'Instagram stories of daily impact, LinkedIn thought leadership posts',
      selected: false
    },
    {
      id: 'grant-applications',
      name: 'Grant Applications',
      frequency: 'Quarterly',
      purpose: 'Funding acquisition',
      storyType: 'Comprehensive impact narratives',
      example: 'Detailed case studies with measurable outcomes and community context',
      selected: false
    },
    {
      id: 'board-reports',
      name: 'Board Reports',
      frequency: 'Quarterly',
      purpose: 'Governance & strategic alignment',
      storyType: 'Data-driven stories with strategic implications',
      example: 'Program effectiveness stories tied to organizational goals',
      selected: false
    },
    {
      id: 'annual-report',
      name: 'Annual Report',
      frequency: 'Yearly',
      purpose: 'Comprehensive impact demonstration',
      storyType: 'Year-long transformation journeys',
      example: 'Multi-story narrative arc showing cumulative community change',
      selected: false
    },
    {
      id: 'fundraising-events',
      name: 'Fundraising Events',
      frequency: 'As needed',
      purpose: 'Major gift cultivation',
      storyType: 'Live testimonials & interactive stories',
      example: 'Beneficiary speakers, video testimonials, impact galleries',
      selected: false
    }
  ]);

  const [contentCalendar, setContentCalendar] = useState('');
  const [strategicPlan, setStrategicPlan] = useState('');

  const selectedChannels = contentChannels.filter(c => c.selected);

  const handleChannelToggle = (channelId: string) => {
    setContentChannels(prev => prev.map(channel => ({
      ...channel,
      selected: channel.id === channelId ? !channel.selected : channel.selected
    })));
  };

  const generateContentCalendar = () => {
    if (selectedChannels.length === 0) return;
    
    setCurrentPhase('calendar');
    
    const calendar = `SOFIA'S STORYTELLING CALENDAR - Q1 2024

${selectedChannels.map(channel => `
📅 ${channel.name} (${channel.frequency})
Purpose: ${channel.purpose}
Story Focus: ${channel.storyType}
Example: ${channel.example}
`).join('')}

STRATEGIC STORYTELLING APPROACH:
🎯 Consistent Voice: Use your authentic ${localStorage.getItem('sofiaVoiceStyle') || 'Empathetic Advocate'} style across all channels
📊 Impact Metrics: Track story engagement, donor response, and volunteer applications
🔄 Story Recycling: Adapt breakthrough stories for multiple channels and audiences
✨ AI Enhancement: Use AI tools to maintain quality while scaling production

MONTHLY STORY PIPELINE:
Week 1: Research and identify new story opportunities
Week 2: Conduct interviews and gather story materials  
Week 3: Draft and enhance stories using AI tools
Week 4: Distribute across selected channels and measure impact

This systematic approach ensures Sofia never runs out of compelling content while maintaining story quality and authentic voice.`;

    setContentCalendar(calendar);
    
    toast({
      title: "📅 Content Calendar Generated!",
      description: `Strategic plan created for ${selectedChannels.length} communication channels`,
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'sofia-impact-scaling',
        lesson_id: 14,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-emerald-100 rounded-full">
                <Rocket className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold">Sofia's Impact Scaling Challenge</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>Sofia's breakthrough story was a huge success! The annual gala raised 40% more than last year. The board is thrilled, donors are engaged, and volunteers are signing up.</p>
                <p className="font-semibold text-emerald-700">But now everyone wants more stories, and Sofia can't spend all day writing.</p>
                <p>Time to scale Sofia's storytelling superpower across all communications while maintaining quality and authentic voice.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll create:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Strategic content calendar for consistent storytelling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Channel-specific story strategies for maximum impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Scalable system for ongoing story production</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('strategy')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Scale Sofia's Storytelling Impact
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Build Your Storytelling Strategy</h2>
              <p className="text-gray-600">How will you systematically share impact across all communications?</p>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Describe your overall storytelling goals and approach:
              </label>
              <Textarea
                value={strategicPlan}
                onChange={(e) => setStrategicPlan(e.target.value)}
                placeholder="What story themes will you focus on? How will you balance different types of impact? What outcomes do you want from your storytelling efforts?"
                className="min-h-[120px]"
              />
            </div>
            
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-emerald-700 mb-2">Storytelling Success Framework</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Story Types:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Transformation journeys</li>
                      <li>• Program impact highlights</li>
                      <li>• Community change stories</li>
                      <li>• Behind-the-scenes moments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Impact Goals:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Increase donor engagement</li>
                      <li>• Attract new volunteers</li>
                      <li>• Strengthen community support</li>
                      <li>• Secure major gifts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentPhase('channels')}
                disabled={!strategicPlan}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Select Channels
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'channels':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Choose Your Communication Channels</h2>
              <p className="text-gray-600">Select the channels where you'll implement systematic storytelling</p>
            </div>
            
            <div className="grid gap-4">
              {contentChannels.map((channel) => (
                <Card 
                  key={channel.id}
                  className={`cursor-pointer transition-all ${
                    channel.selected ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleChannelToggle(channel.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-emerald-700">{channel.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            {channel.frequency}
                          </span>
                          {channel.selected && <span className="text-emerald-600">✓</span>}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm"><strong>Purpose:</strong> {channel.purpose}</p>
                      <p className="text-gray-600 text-sm"><strong>Story Focus:</strong> {channel.storyType}</p>
                      <div className="bg-gray-50 p-2 rounded text-xs italic">
                        {channel.example}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">💡 Tip:</span> Start with 2-3 channels you can manage consistently. 
                You can always add more as your storytelling system matures.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('strategy')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={generateContentCalendar}
                disabled={selectedChannels.length === 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Generate Calendar
                <Calendar className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Sofia's Storytelling System</h2>
              <p className="text-gray-600">Your complete content calendar and production workflow</p>
            </div>
            
            <Card className="border-2 border-emerald-200 bg-emerald-50">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm">
                  {contentCalendar}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">Success Metrics</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Story engagement rates</li>
                    <li>• Donor response increases</li>
                    <li>• Volunteer applications</li>
                    <li>• Media coverage earned</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">AI Tools Integration</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Story enhancement workflows</li>
                    <li>• Voice consistency checks</li>
                    <li>• Multi-channel adaptation</li>
                    <li>• Performance optimization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Complete Storytelling Transformation
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Rocket className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Sofia's Storytelling Empire!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg font-semibold">From silent mission to storytelling powerhouse!</p>
                <p>Sofia now has a systematic approach to sharing impact across all communications. Her stories will consistently move hearts, open wallets, and inspire action.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Sofia's Complete Transformation:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Mission clarity that captures hearts</li>
                <li>✅ Authentic voice that feels natural</li>
                <li>✅ Breakthrough stories that captivate</li>
                <li>✅ Scalable system for ongoing impact</li>
              </ul>
            </div>
            
            <div className="p-4 bg-emerald-100 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-emerald-700">Sofia's impact stories will now reach thousands, inspiring a movement of supporters who understand exactly why this work matters.</p>
              <p className="text-sm text-gray-600 mt-2">Next: Data-driven David discovers his analytical storytelling power...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};