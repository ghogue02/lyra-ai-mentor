import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AgendaItem {
  id: string;
  topic: string;
  timeAllocation: string;
  objective: string;
  talkingPoints: string[];
  userNotes: string;
  aiEnhanced: string;
}

interface MayaBoardMeetingPrepProps {
  onComplete?: () => void;
}

export const MayaBoardMeetingPrep: React.FC<MayaBoardMeetingPrepProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'structure' | 'details' | 'enhance' | 'success'>('context');
  const [meetingType, setMeetingType] = useState<'emergency' | 'regular' | ''>('');
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: 'opening',
      topic: 'Opening & Urgent Updates',
      timeAllocation: '5 minutes',
      objective: 'Set tone and share critical information',
      talkingPoints: [
        'Thank board for emergency session',
        'Acknowledge funding challenge',
        'Preview solutions we\'ll discuss'
      ],
      userNotes: '',
      aiEnhanced: ''
    },
    {
      id: 'crisis',
      topic: 'Funding Crisis Overview',
      timeAllocation: '10 minutes',
      objective: 'Present clear picture of situation',
      talkingPoints: [
        'Current budget shortfall: $50,000',
        'Impact if unresolved: program cuts',
        'Timeline: 60 days to secure funding'
      ],
      userNotes: '',
      aiEnhanced: ''
    },
    {
      id: 'solutions',
      topic: 'Proposed Solutions',
      timeAllocation: '20 minutes',
      objective: 'Present actionable options for board decision',
      talkingPoints: [
        'Morrison Foundation grant opportunity',
        'Emergency fundraising campaign',
        'Corporate sponsorship outreach'
      ],
      userNotes: '',
      aiEnhanced: ''
    },
    {
      id: 'action',
      topic: 'Board Action Items',
      timeAllocation: '10 minutes',
      objective: 'Secure commitments and next steps',
      talkingPoints: [
        'Board member connections to leverage',
        'Approval for grant application',
        'Emergency fundraising committee formation'
      ],
      userNotes: '',
      aiEnhanced: ''
    }
  ]);

  const handleNotesChange = (itemId: string, notes: string) => {
    setAgendaItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, userNotes: notes } : item
    ));
  };

  const enhanceWithAI = async () => {
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement
    const enhanced = agendaItems.map(item => {
      const enhancement = `${item.userNotes || item.talkingPoints.join('. ')}

Key Message: Frame this as an opportunity for board leadership, not just a crisis. 

Supporting Data: Similar organizations faced 40% budget cuts without action. Those who mobilized their boards saw 85% funding recovery within 90 days.

Engagement Tip: Pause for questions. Use names when addressing board members. Have specific asks ready.`;
      
      return { ...item, aiEnhanced: enhancement };
    });
    
    setAgendaItems(enhanced);
    toast({
      title: "✨ AI Enhancement Complete!",
      description: "Your agenda has been enhanced with engagement strategies",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'maya-board-meeting-prep',
        lesson_id: 7,
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
              <div className="inline-flex p-4 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Maya's Meeting Crisis</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>Emergency board meeting in 2 hours. The funding crisis can't wait. Maya needs to lead with confidence, present solutions, and rally the board to action.</p>
                <p className="font-semibold text-blue-700">Last month's meeting was a disaster—no structure, no decisions, just 2 hours of complaints.</p>
                <p>This time, Maya will use AI to create an agenda that drives decisions and inspires action.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">What type of meeting are you preparing?</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={`cursor-pointer transition-all ${meetingType === 'emergency' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setMeetingType('emergency')}
                >
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="font-semibold">Emergency Meeting</p>
                    <p className="text-sm text-gray-600">Crisis response, urgent decisions</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all ${meetingType === 'regular' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setMeetingType('regular')}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold">Regular Meeting</p>
                    <p className="text-sm text-gray-600">Updates, planning, routine business</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('structure')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!meetingType}
            >
              Create Meeting Structure
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'structure':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Build Your Meeting Agenda</h2>
              <p className="text-gray-600">45-minute emergency session with clear objectives</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Time Management Strategy</span>
              </div>
              <p className="text-sm text-gray-700">
                Each agenda item has specific time allocation. Stick to it for maximum impact.
              </p>
            </div>
            
            {agendaItems.map((item, index) => (
              <Card key={item.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-700">{item.topic}</h3>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">{item.timeAllocation}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium mb-1">Objective:</p>
                    <p className="text-sm text-gray-700">{item.objective}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Talking Points:</p>
                    <ul className="space-y-1">
                      {item.talkingPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Textarea
                    value={item.userNotes}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                    placeholder="Add your specific details, data, or personal notes..."
                    className="min-h-[80px]"
                  />
                </CardContent>
              </Card>
            ))}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={enhanceWithAI}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Agenda
              </Button>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Your AI-Enhanced Meeting Plan</h2>
              <p className="text-gray-600">Complete with engagement strategies and data points</p>
            </div>
            
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {agendaItems.map((item) => (
                    <div key={item.id} className="space-y-3 pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-blue-700">{item.topic}</h3>
                        <span className="text-sm font-medium">{item.timeAllocation}</span>
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-line">
                        {item.aiEnhanced}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Meeting Success Tips</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Start with energy and gratitude</li>
                    <li>• Use board members' names</li>
                    <li>• Pause for engagement</li>
                    <li>• End with clear next steps</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Materials Checklist</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Printed agendas</li>
                    <li>• Financial summary</li>
                    <li>• Grant opportunity brief</li>
                    <li>• Action item tracker</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Meeting Prep Complete!
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Meeting Prep Complete!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">Maya transformed from meeting-dreader to meeting leader in 10 minutes!</p>
                <p>Armed with a strategic agenda and engagement plan, she's ready to turn crisis into opportunity.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Your Meeting Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Create focused agendas that drive decisions</li>
                <li>✅ Manage time like a pro facilitator</li>
                <li>✅ Turn problems into opportunities</li>
                <li>✅ Lead with confidence and clarity</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: Maya conquers information overload with AI research tools...
            </p>
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