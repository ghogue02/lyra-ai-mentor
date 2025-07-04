import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Clock, Copy, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingPrepAssistantProps {
  onComplete?: () => void;
}

export const MeetingPrepAssistant: React.FC<MeetingPrepAssistantProps> = ({ onComplete }) => {
  const [meetingType, setMeetingType] = useState<string>('');
  const [meetingContext, setMeetingContext] = useState('');
  const [prepMaterials, setPrepMaterials] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [anticipatedQuestions, setAnticipatedQuestions] = useState<string[]>([]);
  const [supportingData, setSupportingData] = useState<string[]>([]);

  const meetingTypes = [
    { value: 'board_chair_update', label: 'Board Chair Update', description: 'One-on-one with board leadership' },
    { value: 'donor_stewardship', label: 'Donor Meeting', description: 'Relationship building with major donors' },
    { value: 'funder_presentation', label: 'Funder Presentation', description: 'Grant proposal or report presentation' },
    { value: 'staff_one_on_one', label: 'Staff One-on-One', description: 'Individual performance or development meeting' },
    { value: 'community_presentation', label: 'Community Presentation', description: 'Public speaking or community engagement' },
    { value: 'partnership_meeting', label: 'Partnership Meeting', description: 'Collaboration or partnership development' }
  ];

  const generatePrep = async () => {
    if (!meetingType || !meetingContext.trim()) {
      toast.error('Please select meeting type and provide context');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const prep = createMeetingPrep();
      setKeyPoints(prep.keyPoints);
      setAnticipatedQuestions(prep.questions);
      setSupportingData(prep.supportingData);
      
      toast.success('Meeting prep materials generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate prep materials. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createMeetingPrep = () => {
    const selectedType = meetingTypes.find(t => t.value === meetingType);
    
    let keyPoints: string[] = [];
    let questions: string[] = [];
    let supportingData: string[] = [];

    switch (meetingType) {
      case 'board_chair_update':
        keyPoints = [
          'Recent program achievements and impact metrics',
          'Current financial status and budget performance',
          'Staffing updates and organizational capacity',
          'Upcoming opportunities and challenges',
          'Board engagement and governance items'
        ];
        questions = [
          'What are the board\'s priorities for the next quarter?',
          'Are there any concerns about our current strategic direction?',
          'How can I better support the board\'s work?',
          'What information would be most helpful for upcoming board meetings?',
          'Are there any governance issues we should address?'
        ];
        supportingData = [
          'Quarterly financial statements',
          'Program outcome data and success stories',
          'Staff performance metrics',
          'Board meeting attendance and engagement stats',
          'Strategic plan progress report'
        ];
        break;

      case 'donor_stewardship':
        keyPoints = [
          'Specific impact of their previous giving',
          'Current program updates relevant to their interests',
          'Future opportunities for deeper engagement',
          'Recognition of their contribution to the mission',
          'Personalized appreciation and connection'
        ];
        questions = [
          'What motivated your initial support of our organization?',
          'Which of our programs resonates most with you?',
          'How would you like to stay connected with our work?',
          'Are there other community leaders you think we should know?',
          'What questions do you have about our current initiatives?'
        ];
        supportingData = [
          'Donor\'s giving history and preferences',
          'Program outcomes directly linked to their support',
          'Photos and stories from beneficiaries',
          'Financial transparency reports',
          'Future funding opportunities aligned with their interests'
        ];
        break;

      case 'funder_presentation':
        keyPoints = [
          'Clear articulation of community need',
          'Evidence-based program model and approach',
          'Measurable outcomes and evaluation plan',
          'Organizational capacity and track record',
          'Specific funding request and budget justification'
        ];
        questions = [
          'How do you measure long-term impact?',
          'What challenges have you faced in similar programs?',
          'How will you sustain this work beyond the grant period?',
          'What makes your approach different from other organizations?',
          'How do you plan to evaluate and improve the program?'
        ];
        supportingData = [
          'Community needs assessment data',
          'Evidence base for proposed interventions',
          'Organizational financial health indicators',
          'Letters of support from community partners',
          'Detailed budget and cost-effectiveness analysis'
        ];
        break;

      case 'staff_one_on_one':
        keyPoints = [
          'Acknowledge recent contributions and achievements',
          'Discuss current projects and priorities',
          'Address any challenges or support needed',
          'Explore professional development opportunities',
          'Set clear expectations and goals'
        ];
        questions = [
          'How are you feeling about your current workload?',
          'What projects are you most excited about?',
          'Where do you feel you need additional support?',
          'What professional development interests you?',
          'How can I be a better supervisor for you?'
        ];
        supportingData = [
          'Recent performance examples and feedback',
          'Current project status and deadlines',
          'Professional development budget and options',
          'Team feedback and collaboration notes',
          'Career progression pathways'
        ];
        break;

      default:
        keyPoints = [
          'Meeting objectives and desired outcomes',
          'Key information to communicate',
          'Questions to ask and information to gather',
          'Follow-up actions needed',
          'Relationship building opportunities'
        ];
        questions = [
          'What are the main concerns or interests of attendees?',
          'What decisions need to be made in this meeting?',
          'What information do participants need from us?',
          'How can we make this meeting valuable for everyone?',
          'What are the next steps after this conversation?'
        ];
        supportingData = [
          'Relevant background information',
          'Recent updates and progress reports',
          'Data and metrics to share',
          'Upcoming opportunities or challenges',
          'Contact information and resources'
        ];
    }

    return { keyPoints, questions, supportingData };
  };

  const copyAllPrep = () => {
    const allContent = `# Meeting Preparation: ${meetingTypes.find(t => t.value === meetingType)?.label}

## Context
${meetingContext}

## Key Points to Cover
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## Anticipated Questions
${anticipatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Supporting Data to Have Ready
${supportingData.map((data, i) => `${i + 1}. ${data}`).join('\n')}

---
Meeting prep generated with AI assistance`;

    navigator.clipboard.writeText(allContent);
    toast.success('Complete prep materials copied to clipboard!');
  };

  const hasResults = keyPoints.length > 0 || anticipatedQuestions.length > 0 || supportingData.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Meeting Prep Assistant
          </CardTitle>
          <p className="text-sm text-gray-600">
            Prepare talking points, anticipate questions, and organize supporting materials
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Type</label>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger>
                <SelectValue placeholder="What type of meeting?" />
              </SelectTrigger>
              <SelectContent>
                {meetingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meeting Context</label>
            <Textarea
              value={meetingContext}
              onChange={(e) => setMeetingContext(e.target.value)}
              placeholder="Describe the meeting purpose, attendees, and any specific topics to discuss. For example: 'Quarterly check-in with board chair to discuss program expansion plans and upcoming strategic planning retreat'"
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Context (Optional)</label>
            <Textarea
              value={prepMaterials}
              onChange={(e) => setPrepMaterials(e.target.value)}
              placeholder="Any specific materials, recent events, or concerns to address..."
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generatePrep} 
            disabled={isGenerating || !meetingType || !meetingContext.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Preparing Materials...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Generate Meeting Prep
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {hasResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Meeting Preparation Materials</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAllPrep}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {meetingTypes.find(t => t.value === meetingType)?.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {keyPoints.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Key Points to Cover
                </h4>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="mt-0.5 text-xs">{index + 1}</Badge>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {anticipatedQuestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Anticipated Questions</h4>
                <ul className="space-y-2">
                  {anticipatedQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 font-medium">Q:</span>
                      <span className="flex-1 italic">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {supportingData.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Supporting Data to Have Ready</h4>
                <ul className="space-y-2">
                  {supportingData.map((data, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">=Ê</span>
                      <span className="flex-1">{data}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> Review these materials 30 minutes before your meeting and practice key talking points out loud.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};