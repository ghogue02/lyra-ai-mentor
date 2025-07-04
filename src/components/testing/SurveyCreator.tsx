import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, Clock, Copy, Plus, X, CheckSquare, Circle, MessageSquare, Star, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface SurveyCreatorProps {
  onComplete?: () => void;
}

interface Question {
  id: number;
  type: 'multiple_choice' | 'rating' | 'open_ended' | 'yes_no' | 'ranking';
  text: string;
  options?: string[];
  required: boolean;
}

interface Survey {
  title: string;
  description: string;
  purpose: string;
  estimatedTime: string;
  questions: Question[];
  introText: string;
  thankYouText: string;
}

export const SurveyCreator: React.FC<SurveyCreatorProps> = ({ onComplete }) => {
  const [surveyType, setSurveyType] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [surveyGoal, setSurveyGoal] = useState<string>('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const surveyTypes = [
    { value: 'participant_feedback', label: 'Participant Feedback', description: 'Program satisfaction & outcomes' },
    { value: 'donor_satisfaction', label: 'Donor Satisfaction', description: 'Donor experience & engagement' },
    { value: 'volunteer_experience', label: 'Volunteer Experience', description: 'Volunteer satisfaction & retention' },
    { value: 'community_needs', label: 'Community Needs Assessment', description: 'Identify service gaps' },
    { value: 'event_feedback', label: 'Event Feedback', description: 'Post-event evaluation' },
    { value: 'staff_satisfaction', label: 'Staff Satisfaction', description: 'Internal culture & morale' },
    { value: 'impact_measurement', label: 'Impact Measurement', description: 'Outcome tracking' }
  ];

  const audiences = [
    { value: 'program_participants', label: 'Program Participants' },
    { value: 'donors', label: 'Donors & Supporters' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'community_members', label: 'Community Members' },
    { value: 'event_attendees', label: 'Event Attendees' },
    { value: 'staff', label: 'Staff Members' },
    { value: 'partners', label: 'Partner Organizations' }
  ];

  const goals = [
    { value: 'improve_programs', label: 'Improve Programs', description: 'Enhance service quality' },
    { value: 'measure_satisfaction', label: 'Measure Satisfaction', description: 'Gauge happiness levels' },
    { value: 'identify_needs', label: 'Identify Needs', description: 'Discover unmet needs' },
    { value: 'track_outcomes', label: 'Track Outcomes', description: 'Measure impact' },
    { value: 'gather_testimonials', label: 'Gather Testimonials', description: 'Collect success stories' },
    { value: 'improve_engagement', label: 'Improve Engagement', description: 'Boost participation' }
  ];

  const createSurvey = async () => {
    if (!surveyType || !targetAudience || !surveyGoal || !surveyTitle.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsCreating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateSurvey();
      setSurvey(result);
      
      toast.success('Survey created successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create survey. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const generateSurvey = (): Survey => {
    const templates: Record<string, () => Survey> = {
      participant_feedback: () => ({
        title: surveyTitle,
        description: 'Help us improve our programs by sharing your experience',
        purpose: 'This survey helps us understand what\'s working well and where we can improve to better serve you.',
        estimatedTime: '5-7 minutes',
        introText: `Thank you for participating in our programs! Your feedback is invaluable in helping us improve our services and better support our community. This survey will take approximately 5-7 minutes to complete, and all responses are confidential.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            text: 'Overall, how satisfied were you with the program?',
            required: true
          },
          {
            id: 2,
            type: 'multiple_choice',
            text: 'How did you first hear about this program?',
            options: ['Friend/Family', 'Social Media', 'Website', 'Community Partner', 'Staff Member', 'Other'],
            required: true
          },
          {
            id: 3,
            type: 'yes_no',
            text: 'Did the program meet your expectations?',
            required: true
          },
          {
            id: 4,
            type: 'open_ended',
            text: 'What aspects of the program were most valuable to you?',
            required: false
          },
          {
            id: 5,
            type: 'multiple_choice',
            text: 'How likely are you to recommend this program to others?',
            options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
            required: true
          },
          {
            id: 6,
            type: 'ranking',
            text: 'Please rank these program elements by importance to you:',
            options: ['Schedule flexibility', 'Staff support', 'Program content', 'Location', 'Cost/Free'],
            required: false
          },
          {
            id: 7,
            type: 'open_ended',
            text: 'What improvements would you suggest for future programs?',
            required: false
          },
          {
            id: 8,
            type: 'yes_no',
            text: 'Would you participate in similar programs in the future?',
            required: true
          },
          {
            id: 9,
            type: 'multiple_choice',
            text: 'Which additional services would be most helpful to you?',
            options: ['Job training', 'Mental health support', 'Financial literacy', 'Childcare', 'Transportation', 'Other'],
            required: false
          },
          {
            id: 10,
            type: 'open_ended',
            text: 'Please share any additional comments or suggestions:',
            required: false
          }
        ],
        thankYouText: 'Thank you for taking the time to complete this survey! Your feedback helps us create better programs that truly meet community needs. We appreciate your participation and look forward to serving you again.'
      }),

      donor_satisfaction: () => ({
        title: surveyTitle,
        description: 'Share your experience as a valued supporter',
        purpose: 'Your feedback helps us improve our donor communications and stewardship.',
        estimatedTime: '5 minutes',
        introText: `As a valued supporter of our mission, your experience matters deeply to us. This brief survey will help us better understand how to communicate our impact and recognize your generosity. Your responses are confidential and will take about 5 minutes.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            text: 'How satisfied are you with your overall donor experience?',
            required: true
          },
          {
            id: 2,
            type: 'multiple_choice',
            text: 'How long have you been supporting our organization?',
            options: ['Less than 1 year', '1-2 years', '3-5 years', '5-10 years', 'More than 10 years'],
            required: true
          },
          {
            id: 3,
            type: 'multiple_choice',
            text: 'What motivated you to first donate to our organization?',
            options: ['Mission alignment', 'Personal connection', 'Community impact', 'Friend recommendation', 'Event attendance', 'Other'],
            required: true
          },
          {
            id: 4,
            type: 'yes_no',
            text: 'Do you feel well-informed about how your donations are used?',
            required: true
          },
          {
            id: 5,
            type: 'rating',
            text: 'How would you rate our communication frequency?',
            required: true
          },
          {
            id: 6,
            type: 'multiple_choice',
            text: 'Which type of communication do you find most valuable?',
            options: ['Impact stories', 'Financial reports', 'Event invitations', 'Volunteer opportunities', 'Program updates', 'Personal thank yous'],
            required: false
          },
          {
            id: 7,
            type: 'open_ended',
            text: 'What would make you more likely to increase your support?',
            required: false
          },
          {
            id: 8,
            type: 'yes_no',
            text: 'Would you consider making a monthly recurring gift?',
            required: false
          },
          {
            id: 9,
            type: 'multiple_choice',
            text: 'How likely are you to continue supporting us next year?',
            options: ['Definitely will', 'Probably will', 'Unsure', 'Probably won\'t', 'Definitely won\'t'],
            required: true
          },
          {
            id: 10,
            type: 'open_ended',
            text: 'How can we improve your experience as a donor?',
            required: false
          }
        ],
        thankYouText: 'Thank you for your generous support and for taking time to share your feedback. Your insights will help us build stronger relationships with our donor community and ensure your giving experience is as meaningful as your impact.'
      }),

      volunteer_experience: () => ({
        title: surveyTitle,
        description: 'Help us improve the volunteer experience',
        purpose: 'Your feedback ensures we create meaningful volunteer opportunities.',
        estimatedTime: '6-8 minutes',
        introText: `Thank you for volunteering with us! Your time and talents make a real difference in our community. This survey helps us understand your volunteer experience and how we can better support you. It takes about 6-8 minutes to complete.`,
        questions: [
          {
            id: 1,
            type: 'rating',
            text: 'How would you rate your overall volunteer experience?',
            required: true
          },
          {
            id: 2,
            type: 'multiple_choice',
            text: 'How often do you volunteer with us?',
            options: ['Weekly', 'Bi-weekly', 'Monthly', 'Occasionally', 'Special events only'],
            required: true
          },
          {
            id: 3,
            type: 'yes_no',
            text: 'Did you receive adequate training for your volunteer role?',
            required: true
          },
          {
            id: 4,
            type: 'multiple_choice',
            text: 'What motivates you to volunteer with us?',
            options: ['Making a difference', 'Meeting people', 'Learning new skills', 'Giving back', 'Personal growth', 'Professional development'],
            required: true
          },
          {
            id: 5,
            type: 'rating',
            text: 'How supported do you feel by staff members?',
            required: true
          },
          {
            id: 6,
            type: 'open_ended',
            text: 'What do you enjoy most about volunteering here?',
            required: false
          },
          {
            id: 7,
            type: 'multiple_choice',
            text: 'What would make your volunteer experience better?',
            options: ['More training', 'Flexible scheduling', 'Different tasks', 'Recognition', 'Social events', 'Clear communication'],
            required: false
          },
          {
            id: 8,
            type: 'yes_no',
            text: 'Would you recommend volunteering here to friends?',
            required: true
          },
          {
            id: 9,
            type: 'ranking',
            text: 'Rank these volunteer benefits by importance:',
            options: ['Making impact', 'Building skills', 'Meeting people', 'Recognition', 'Flexibility'],
            required: false
          },
          {
            id: 10,
            type: 'open_ended',
            text: 'Any suggestions for improving our volunteer program?',
            required: false
          }
        ],
        thankYouText: 'Thank you for your dedication and for sharing your thoughts! Your feedback helps us create better volunteer experiences. We\'re grateful for your time, energy, and commitment to our mission.'
      })
    };

    const template = templates[surveyType] || templates.participant_feedback;
    return template();
  };

  const copySurvey = () => {
    if (!survey) return;
    
    let surveyText = `${survey.title}\n\n`;
    surveyText += `${survey.description}\n\n`;
    surveyText += `${survey.introText}\n\n`;
    surveyText += `Questions:\n\n`;
    
    survey.questions.forEach((q, index) => {
      surveyText += `${index + 1}. ${q.text}${q.required ? ' *' : ''}\n`;
      if (q.options) {
        q.options.forEach(opt => {
          surveyText += `   □ ${opt}\n`;
        });
      }
      surveyText += '\n';
    });
    
    surveyText += `\n${survey.thankYouText}`;
    
    navigator.clipboard.writeText(surveyText);
    toast.success('Survey copied to clipboard!');
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <Circle className="h-4 w-4" />;
      case 'rating': return <Star className="h-4 w-4" />;
      case 'open_ended': return <MessageSquare className="h-4 w-4" />;
      case 'yes_no': return <CheckSquare className="h-4 w-4" />;
      case 'ranking': return <Hash className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Multiple Choice';
      case 'rating': return 'Rating Scale';
      case 'open_ended': return 'Open Text';
      case 'yes_no': return 'Yes/No';
      case 'ranking': return 'Ranking';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-purple-600" />
            Survey Creator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Design effective surveys to gather meaningful feedback
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Survey Title</label>
            <Input
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="e.g., '2024 Program Participant Feedback Survey'"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Survey Type</label>
              <Select value={surveyType} onValueChange={setSurveyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {surveyTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Who will take it?" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Goal</label>
              <Select value={surveyGoal} onValueChange={setSurveyGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="What to achieve?" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      <div>
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-xs text-gray-500">{goal.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={createSurvey} 
            disabled={isCreating || !surveyType || !targetAudience || !surveyGoal || !surveyTitle.trim()}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Survey...
              </>
            ) : (
              <>
                <FileQuestion className="h-4 w-4 mr-2" />
                Generate Survey
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {survey && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {survey.estimatedTime}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={copySurvey}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Introduction:</strong> {survey.introText}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Survey Questions ({survey.questions.length})</h4>
                {survey.questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <span className="text-gray-500">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium">
                            {question.text}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {getQuestionIcon(question.type)}
                        <span className="ml-1">{getQuestionTypeLabel(question.type)}</span>
                      </Badge>
                    </div>
                    
                    {question.options && (
                      <div className="ml-8 mt-2 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <Circle className="h-3 w-3" />
                            {option}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'rating' && (
                      <div className="ml-8 mt-2 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <Star key={rating} className="h-4 w-4 text-gray-400" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(1 = Poor, 5 = Excellent)</span>
                      </div>
                    )}

                    {question.type === 'open_ended' && (
                      <div className="ml-8 mt-2">
                        <div className="h-16 bg-white border border-gray-200 rounded p-2 text-sm text-gray-400">
                          Text response area...
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Thank You Message:</strong> {survey.thankYouText}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Implementation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-sm">Use survey tools like Google Forms, SurveyMonkey, or Typeform for easy distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-sm">Send reminders 3 and 7 days after initial distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-sm">Aim for at least 30% response rate for statistical validity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-sm">Share results summary with respondents to close the feedback loop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span className="text-sm">Consider offering incentives (raffle, small gift) to boost response rates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};