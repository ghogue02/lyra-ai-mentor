import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Copy, FileText, Share2, Mail, Download, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ContentCalendarBuilderProps {
  onComplete?: () => void;
}

interface ContentItem {
  date: string;
  dayOfWeek: string;
  channel: string;
  type: string;
  topic: string;
  description: string;
  hashtags?: string[];
  status: 'planned' | 'in_progress' | 'complete';
}

interface ContentCalendar {
  month: string;
  year: number;
  theme: string;
  goals: string[];
  content: ContentItem[];
}

export const ContentCalendarBuilder: React.FC<ContentCalendarBuilderProps> = ({ onComplete }) => {
  const [timeframe, setTimeframe] = useState<string>('');
  const [organizationType, setOrganizationType] = useState<string>('');
  const [contentGoals, setContentGoals] = useState<string>('');
  const [calendar, setCalendar] = useState<ContentCalendar | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const timeframes = [
    { value: '1_week', label: '1 Week', description: 'Quick sprint planning' },
    { value: '2_weeks', label: '2 Weeks', description: 'Short campaign' },
    { value: '1_month', label: '1 Month', description: 'Standard planning' },
    { value: '3_months', label: '3 Months', description: 'Quarterly planning' }
  ];

  const organizationTypes = [
    { value: 'education', label: 'Education', description: 'Schools, tutoring, literacy' },
    { value: 'health', label: 'Health & Wellness', description: 'Healthcare, mental health' },
    { value: 'youth', label: 'Youth Development', description: 'After-school, mentorship' },
    { value: 'food', label: 'Food Security', description: 'Food banks, nutrition' },
    { value: 'housing', label: 'Housing & Shelter', description: 'Homeless services' },
    { value: 'arts', label: 'Arts & Culture', description: 'Museums, cultural programs' },
    { value: 'environment', label: 'Environment', description: 'Conservation, sustainability' },
    { value: 'general', label: 'General Nonprofit', description: 'Mixed services' }
  ];

  const goals = [
    { value: 'awareness', label: 'Build Awareness', description: 'Increase visibility' },
    { value: 'engagement', label: 'Boost Engagement', description: 'Grow community interaction' },
    { value: 'fundraising', label: 'Drive Donations', description: 'Increase giving' },
    { value: 'volunteers', label: 'Recruit Volunteers', description: 'Grow volunteer base' },
    { value: 'education', label: 'Educate Audience', description: 'Share knowledge' },
    { value: 'mixed', label: 'Mixed Goals', description: 'Combination of above' }
  ];

  const generateCalendar = async () => {
    if (!timeframe || !organizationType || !contentGoals) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = createContentCalendar();
      setCalendar(result);
      
      toast.success('Content calendar created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate calendar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createContentCalendar = (): ContentCalendar => {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Determine calendar period
    let daysToGenerate = 7;
    switch (timeframe) {
      case '2_weeks': daysToGenerate = 14; break;
      case '1_month': daysToGenerate = 30; break;
      case '3_months': daysToGenerate = 90; break;
    }

    // Content templates by organization type
    const contentTemplates: Record<string, any> = {
      education: {
        themes: ['Back to School', 'Literacy Month', 'STEM Education', 'Student Success'],
        topics: ['Student spotlight', 'Teacher appreciation', 'Program updates', 'Learning tips', 'Success metrics']
      },
      health: {
        themes: ['Wellness Awareness', 'Mental Health Month', 'Healthy Communities', 'Prevention Focus'],
        topics: ['Health tips', 'Patient stories', 'Medical breakthroughs', 'Community health', 'Wellness programs']
      },
      youth: {
        themes: ['Youth Empowerment', 'Summer Programs', 'College Prep', 'Leadership Development'],
        topics: ['Youth achievements', 'Mentor spotlight', 'Program enrollment', 'Skills workshops', 'Parent resources']
      },
      food: {
        themes: ['Hunger Awareness', 'Nutrition Education', 'Food Drive Season', 'Community Gardens'],
        topics: ['Meal distributions', 'Volunteer needs', 'Nutrition tips', 'Partner restaurants', 'Impact numbers']
      },
      general: {
        themes: ['Community Impact', 'Volunteer Appreciation', 'Year-End Giving', 'Spring Renewal'],
        topics: ['Impact stories', 'Volunteer spotlight', 'Event announcements', 'Program updates', 'Donor appreciation']
      }
    };

    const template = contentTemplates[organizationType] || contentTemplates.general;
    const theme = template.themes[Math.floor(Math.random() * template.themes.length)];

    // Define content mix based on goals
    const contentMix = {
      awareness: ['story', 'educational', 'infographic', 'video', 'blog'],
      engagement: ['question', 'poll', 'user_content', 'behind_scenes', 'live'],
      fundraising: ['appeal', 'impact_story', 'donation_spotlight', 'matching_gift', 'campaign_update'],
      volunteers: ['volunteer_spotlight', 'opportunity', 'training', 'appreciation', 'recruitment'],
      education: ['how_to', 'facts', 'resources', 'webinar', 'guide'],
      mixed: ['story', 'appeal', 'educational', 'volunteer_spotlight', 'event']
    };

    const selectedMix = contentMix[contentGoals] || contentMix.mixed;
    
    // Generate content items
    const content: ContentItem[] = [];
    
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dayOfWeek = dayNames[date.getDay()];
      
      // Skip some weekend days for realistic planning
      if ((dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') && Math.random() > 0.3) {
        continue;
      }
      
      // Determine channels based on day and strategy
      const channels = [];
      
      // Social media posts (more frequent)
      if (i % 2 === 0 || dayOfWeek === 'Tuesday' || dayOfWeek === 'Thursday') {
        channels.push('social');
      }
      
      // Email campaigns (weekly)
      if (dayOfWeek === 'Tuesday' && i % 7 === 0) {
        channels.push('email');
      }
      
      // Blog posts (bi-weekly)
      if (dayOfWeek === 'Wednesday' && i % 14 < 2) {
        channels.push('blog');
      }
      
      // Generate content for each channel
      channels.forEach(channel => {
        const contentType = selectedMix[Math.floor(Math.random() * selectedMix.length)];
        const topicIndex = Math.floor(Math.random() * template.topics.length);
        const topic = template.topics[topicIndex];
        
        let description = '';
        let hashtags: string[] = [];
        
        switch (contentType) {
          case 'story':
          case 'impact_story':
            description = `Share ${topic} success story featuring a program participant. Include photos and quotes to make it personal and relatable.`;
            hashtags = ['#ImpactStory', '#CommunityImpact', '#NonprofitLife', '#NYC'];
            break;
            
          case 'educational':
          case 'how_to':
            description = `Create educational content about ${topic}. Use infographics or carousel posts to break down complex information.`;
            hashtags = ['#NonprofitTips', '#Education', '#LearnWithUs', '#NYC'];
            break;
            
          case 'appeal':
          case 'donation_spotlight':
            description = `Fundraising post highlighting ${topic} and how donations make a difference. Include specific impact metrics.`;
            hashtags = ['#GiveBack', '#Donate', '#FundraisingFriday', '#NYCGives'];
            break;
            
          case 'volunteer_spotlight':
          case 'appreciation':
            description = `Feature volunteer working on ${topic}. Share their story and impact on the community.`;
            hashtags = ['#VolunteerSpotlight', '#Gratitude', '#CommunityHeroes', '#NYC'];
            break;
            
          case 'event':
            description = `Announce upcoming event related to ${topic}. Include date, time, location, and registration link.`;
            hashtags = ['#NonprofitEvent', '#SaveTheDate', '#NYCEvents', '#JoinUs'];
            break;
            
          default:
            description = `Content about ${topic} aligned with ${theme} theme. Engage audience with compelling visuals and clear call-to-action.`;
            hashtags = ['#Nonprofit', '#Community', '#SocialGood', '#NYC'];
        }
        
        content.push({
          date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          dayOfWeek,
          channel: channel === 'social' ? 'Social Media' : channel === 'email' ? 'Email' : 'Blog',
          type: contentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          topic: topic.charAt(0).toUpperCase() + topic.slice(1),
          description,
          hashtags: channel === 'social' ? hashtags : undefined,
          status: 'planned'
        });
      });
    }
    
    // Define goals based on selected goal type
    const calendarGoals = [];
    switch (contentGoals) {
      case 'awareness':
        calendarGoals.push('Increase social media reach by 25%');
        calendarGoals.push('Publish 4 educational blog posts');
        calendarGoals.push('Feature 8 impact stories');
        break;
      case 'engagement':
        calendarGoals.push('Boost engagement rate to 5%+');
        calendarGoals.push('Host 2 live Q&A sessions');
        calendarGoals.push('Increase email open rate by 10%');
        break;
      case 'fundraising':
        calendarGoals.push('Raise $10,000 through digital campaigns');
        calendarGoals.push('Acquire 50 new monthly donors');
        calendarGoals.push('Launch matching gift campaign');
        break;
      default:
        calendarGoals.push('Grow social media following by 15%');
        calendarGoals.push('Maintain consistent posting schedule');
        calendarGoals.push('Increase website traffic by 20%');
    }
    
    return {
      month: monthNames[now.getMonth()],
      year: now.getFullYear(),
      theme,
      goals: calendarGoals,
      content: content.sort((a, b) => {
        const dateA = new Date(`${a.date}, ${now.getFullYear()}`);
        const dateB = new Date(`${b.date}, ${now.getFullYear()}`);
        return dateA.getTime() - dateB.getTime();
      })
    };
  };

  const exportCalendar = () => {
    if (!calendar) return;
    
    let csv = 'Date,Day,Channel,Type,Topic,Description,Hashtags,Status\n';
    
    calendar.content.forEach(item => {
      csv += `"${item.date}","${item.dayOfWeek}","${item.channel}","${item.type}","${item.topic}","${item.description}","${item.hashtags?.join(' ') || ''}","${item.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-calendar-${calendar.month}-${calendar.year}.csv`;
    a.click();
    
    toast.success('Calendar exported as CSV!');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Social Media': return <Share2 className="h-4 w-4" />;
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Blog': return <FileText className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Social Media': return 'bg-blue-100 text-blue-700';
      case 'Email': return 'bg-green-100 text-green-700';
      case 'Blog': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Content Calendar Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create a strategic content calendar across all your channels
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      <div>
                        <div className="font-medium">{tf.label}</div>
                        <div className="text-xs text-gray-500">{tf.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization Type</label>
              <Select value={organizationType} onValueChange={setOrganizationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Your focus area" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Primary Goal</label>
              <Select value={contentGoals} onValueChange={setContentGoals}>
                <SelectTrigger>
                  <SelectValue placeholder="Content goal" />
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
            onClick={generateCalendar} 
            disabled={isGenerating || !timeframe || !organizationType || !contentGoals}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Building Your Calendar...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Content Calendar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {calendar && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {calendar.month} {calendar.year} Content Calendar
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    Theme: {calendar.theme}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={exportCalendar}>
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-indigo-600" />
                  Monthly Goals
                </h4>
                <ul className="space-y-2">
                  {calendar.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium mb-3">Content Schedule</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {calendar.content.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">
                            {item.date} ({item.dayOfWeek})
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getChannelColor(item.channel)}>
                              {getChannelIcon(item.channel)}
                              <span className="ml-1">{item.channel}</span>
                            </Badge>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{item.topic}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        
                        {item.hashtags && (
                          <div className="flex flex-wrap gap-1">
                            {item.hashtags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-800">
                  <strong>Implementation tips:</strong> Use a scheduling tool like Hootsuite or Buffer to queue posts. 
                  Batch content creation for efficiency. Track performance weekly and adjust strategy as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};