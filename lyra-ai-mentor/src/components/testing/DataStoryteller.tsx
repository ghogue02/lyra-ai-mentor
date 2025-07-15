import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Copy, Heart, TrendingUp, Users, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';

interface DataStorytellerProps {
  onComplete?: () => void;
}

interface DataStory {
  headline: string;
  hook: string;
  context: string;
  dataPoints: {
    statistic: string;
    meaning: string;
    visual: string;
  }[];
  humanElement: string;
  callToAction: string;
  socialMediaVersion: string;
  emailVersion: string;
  presentationTips: string[];
}

export const DataStoryteller: React.FC<DataStorytellerProps> = ({ onComplete }) => {
  const [storyType, setStoryType] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [rawData, setRawData] = useState('');
  const [emotionalTone, setEmotionalTone] = useState<string>('');
  const [story, setStory] = useState<DataStory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const storyTypes = [
    { value: 'impact', label: 'Impact Story', description: 'Show program outcomes' },
    { value: 'donor_report', label: 'Donor Report', description: 'Thank and inform supporters' },
    { value: 'grant_narrative', label: 'Grant Narrative', description: 'Compelling case for funding' },
    { value: 'annual_review', label: 'Annual Review', description: 'Year in review story' },
    { value: 'campaign_case', label: 'Campaign Case', description: 'Fundraising appeal' },
    { value: 'board_presentation', label: 'Board Presentation', description: 'Strategic insights' }
  ];

  const audiences = [
    { value: 'donors', label: 'Donors & Supporters' },
    { value: 'board', label: 'Board Members' },
    { value: 'community', label: 'General Community' },
    { value: 'grantors', label: 'Foundations & Grantors' },
    { value: 'media', label: 'Media & Press' },
    { value: 'staff', label: 'Internal Team' }
  ];

  const tones = [
    { value: 'inspiring', label: 'Inspiring & Uplifting' },
    { value: 'urgent', label: 'Urgent & Compelling' },
    { value: 'grateful', label: 'Grateful & Appreciative' },
    { value: 'informative', label: 'Informative & Educational' },
    { value: 'celebratory', label: 'Celebratory & Joyful' }
  ];

  const createStory = async () => {
    if (!storyType || !audience || !rawData.trim() || !emotionalTone) {
      toast.error('Please complete all fields');
      return;
    }

    setIsCreating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateDataStory();
      setStory(result);
      
      toast.success('Data story created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const generateDataStory = (): DataStory => {
    const templates: Record<string, () => DataStory> = {
      impact_story: () => ({
        headline: 'From Crisis to Classroom: How 847 NYC Youth Found Their Future',
        hook: 'When Maria first walked into our after-school program, she was failing three classes and had given up on her dream of college. Six months later, she\'s on the honor roll with a scholarship in hand.',
        context: 'In neighborhoods across NYC where youth face daily challenges of poverty, violence, and limited opportunities, education becomes more than learning—it becomes lifeline. This year, our youth programs didn\'t just teach; they transformed lives.',
        dataPoints: [
          {
            statistic: '847 youth served',
            meaning: 'That\'s 847 futures changed, 847 families with renewed hope, and 847 young people who now believe in themselves.',
            visual: 'Infographic showing youth across all 5 NYC boroughs'
          },
          {
            statistic: '89% improved grades',
            meaning: 'Nearly 9 out of 10 students raised their grades by at least one letter. For many, it meant the difference between dropping out and dreaming big.',
            visual: 'Before/after report card visualization'
          },
          {
            statistic: '$312 cost per student',
            meaning: 'For less than the cost of a new laptop, we provided a full year of tutoring, mentorship, meals, and hope.',
            visual: 'Cost breakdown showing value delivered'
          },
          {
            statistic: '94% daily attendance',
            meaning: 'In a world of distractions and challenges, these young people chose to show up, work hard, and invest in their futures.',
            visual: 'Calendar heat map showing consistent attendance'
          }
        ],
        humanElement: 'Maria\'s story isn\'t unique—it\'s replicated 847 times over. Like James from the Bronx who discovered a love for coding and is now headed to tech school. Or Sofia from Queens, the first in her family to apply to college. Behind every number is a name, a dream, and a future that\'s now possible because someone believed in them.',
        callToAction: 'Every child deserves the chance Maria got. With your support, we can reach 1,000 youth next year. Will you help write the next chapter of their stories?',
        socialMediaVersion: '847 NYC youth transformed their futures this year! 📚✨ 89% improved their grades, and students like Maria went from failing to honor roll. For just $312 per student, we\'re changing lives. Help us reach 1,000 youth next year: [link] #EducationMatters #NYCYouth #TransformingFutures',
        emailVersion: 'Subject: Maria was failing 3 classes. Now she\'s headed to college.\n\nDear [Name],\n\nI want to share something that made me tear up last week. Maria, one of our students, just got accepted to college with a scholarship. Six months ago, she was failing three classes and ready to give up.\n\nMaria is one of 847 youth whose lives were transformed this year. The data tells an incredible story:\n• 89% improved their grades\n• 94% attended daily despite challenges\n• 100% now believe in their future\n\nFor just $312 per student, we provide a full year of support. Will you help us reach 1,000 youth next year?\n\n[Donate Button]\n\nWith gratitude,\n[Your name]',
        presentationTips: [
          'Start with Maria\'s photo and story to create emotional connection',
          'Use animated charts to reveal statistics dramatically',
          'Include video testimonials from students if possible',
          'End with specific ask and show exactly what donations achieve',
          'Have tissues ready—this story moves people'
        ]
      }),

      donor_report: () => ({
        headline: 'Your Impact by the Numbers: A Year of Transformation',
        hook: 'Last January, you made a decision to invest in our community. Today, we want to show you exactly how your generosity created ripples of change across New York City.',
        context: 'In a year marked by continued challenges for NYC families, your support became a beacon of hope. From emergency assistance to long-term programs, every dollar you contributed was carefully stewarded to maximize impact.',
        dataPoints: [
          {
            statistic: '$3.2M raised',
            meaning: 'Thanks to 3,421 donors like you, we exceeded our goal by 18%, allowing us to serve more families than ever before.',
            visual: 'Thermometer chart showing goal exceeded'
          },
          {
            statistic: '12,847 lives touched',
            meaning: 'That\'s equivalent to filling Madison Square Garden\'s lower bowl—each person receiving direct services that changed their trajectory.',
            visual: 'Dot visualization where each dot represents a person'
          },
          {
            statistic: '78¢ of every $1',
            meaning: 'Your donations went directly to programs, exceeding nonprofit standards and ensuring maximum impact for those we serve.',
            visual: 'Dollar bill graphic showing allocation'
          },
          {
            statistic: '4.2x social return',
            meaning: 'Independent analysis shows every dollar you invested generated $4.20 in social value—through jobs created, crises averted, and futures secured.',
            visual: 'ROI multiplier visualization'
          }
        ],
        humanElement: 'Behind these numbers are faces like the Rodriguez family, who kept their home thanks to emergency assistance, or 67-year-old Mr. Chen, who learned computer skills and found employment. Your name might not be on our building, but your impact is written in every success story.',
        callToAction: 'As we look to next year, we\'re counting on partners like you to help us dream even bigger. Will you continue this journey with us?',
        socialMediaVersion: 'THANK YOU to our 3,421 donors! 🙏 Together we raised $3.2M and touched 12,847 lives across NYC. Every $1 you gave created $4.20 in social value. See your impact: [link] #DonorLove #ImpactReport #NYCNonprofit',
        emailVersion: 'Subject: You helped 12,847 New Yorkers this year\n\nDear [Name],\n\nI\'m writing with one simple message: THANK YOU.\n\nYour support this year helped us achieve something remarkable:\n• 12,847 individuals served (22% more than last year)\n• $3.2M raised from donors like you\n• 78% of funds directly to programs\n• $4.20 in social value for every $1 donated\n\nBut beyond the numbers, you gave hope. You kept families housed. You helped people find jobs. You made dreams possible.\n\n[See Full Impact Report]\n\nAs we plan for next year, we hope you\'ll continue this journey with us.\n\nWith deep gratitude,\n[Your name]',
        presentationTips: [
          'Create personalized slides showing each donor\'s specific impact',
          'Use animation to build numbers dramatically',
          'Include brief video messages from beneficiaries',
          'Provide handouts with full statistics',
          'End with preview of next year\'s vision'
        ]
      }),

      campaign_case: () => ({
        headline: 'The Moment is Now: Building Tomorrow\'s Hope Today',
        hook: 'Right now, 1 in 4 children in our community goes to bed hungry. But together, we can rewrite this story—one meal, one family, one future at a time.',
        context: 'As NYC emerges from unprecedented challenges, the gaps in our social safety net have never been more visible. Families who never needed help before are lining up at food pantries. Children are falling behind in school. The need is urgent, but so is our resolve.',
        dataPoints: [
          {
            statistic: '156,789 meals needed',
            meaning: 'That\'s how many times this year a child or senior in our community will face an empty plate without our help.',
            visual: 'Plate visualization filling as donations increase'
          },
          {
            statistic: '$2.50 = 1 meal',
            meaning: 'For less than the price of a coffee, you can ensure a child doesn\'t go to bed hungry tonight.',
            visual: 'Coffee cup transforming into a nutritious meal'
          },
          {
            statistic: '73% increase in need',
            meaning: 'Compared to pre-2020, demand for food assistance has skyrocketed, while traditional funding sources have plateaued.',
            visual: 'Gap analysis showing growing need vs. flat funding'
          },
          {
            statistic: '30 days to goal',
            meaning: 'Our campaign runs through December 31st. Every day counts, and every gift matters.',
            visual: 'Campaign countdown calendar'
          }
        ],
        humanElement: 'Yesterday, 8-year-old Jasmine asked her teacher why her backpack was so heavy on Fridays. "It\'s food for the weekend," her teacher explained. Jasmine started crying—not from sadness, but relief. She knew her little brother would eat. This is why we do what we do.',
        callToAction: 'We have 30 days to raise $400,000 and ensure no child in our community faces hunger. Your gift today—whether $25 or $2,500—brings us closer to that goal. Will you help?',
        socialMediaVersion: '1 in 4 children in our community faces hunger. 😔 But for just $2.50, you can provide a meal. Our goal: $400K in 30 days to serve 156,789 meals. Every gift counts: [link] #EndHunger #NYCares #30DayChallenge',
        emailVersion: 'Subject: Jasmine\'s backpack was heavy with weekend food\n\nDear [Name],\n\n8-year-old Jasmine cried when she learned why her Friday backpack was so heavy—it held food for her family\'s weekend.\n\nRight now:\n• 1 in 4 local children face hunger\n• Need has increased 73% since 2020\n• $2.50 provides one nutritious meal\n\nWe have 30 days to raise $400,000 and provide 156,789 meals.\n\nWill you help? Your gift of:\n• $25 feeds a child for 10 days\n• $100 feeds a family for a week  \n• $500 stocks our pantry for a day\n\n[Donate Now]\n\nEvery meal matters,\n[Your name]',
        presentationTips: [
          'Open with Jasmine\'s story for immediate emotional impact',
          'Use real-time campaign thermometer',
          'Show meal counter increasing with each pledge',
          'Have donation forms ready for immediate giving',
          'Create urgency with countdown timer'
        ]
      }),

      grant_narrative: () => ({
        headline: 'Scaling Proven Solutions: A Data-Driven Approach to Youth Development',
        hook: 'In three years, we\'ve transformed a single classroom program into a borough-wide movement, improving outcomes for 847 youth while reducing per-participant costs by 34%.',
        context: 'NYC\'s youth face systemic barriers to academic success, with students in low-income neighborhoods averaging two grade levels behind their peers. Traditional interventions have shown limited success, but our innovative model combines evidence-based tutoring with holistic support services to create breakthrough results.',
        dataPoints: [
          {
            statistic: '89% grade improvement',
            meaning: 'Our participants average 1.3 grade levels of improvement in one academic year, compared to 0.4 for traditional tutoring programs.',
            visual: 'Comparative bar chart vs. other interventions'
          },
          {
            statistic: '94% daily attendance',
            meaning: 'Despite transportation and family challenges, our students maintain attendance rates 18% higher than school-day averages.',
            visual: 'Attendance tracking dashboard'
          },
          {
            statistic: '$312 per outcome',
            meaning: 'Cost per student achieving grade-level proficiency, compared to $1,847 for comparable programs nationally.',
            visual: 'Cost-effectiveness analysis chart'
          },
          {
            statistic: '3.8x ROI',
            meaning: 'Every dollar invested yields $3.80 in social returns through improved graduation rates, reduced remediation, and increased lifetime earnings.',
            visual: 'Social return on investment model'
          }
        ],
        humanElement: 'These metrics matter because they represent young people like Carlos, who entered our program reading at a 3rd-grade level in 7th grade. Through intensive support and refusing to give up on him, Carlos is now a sophomore in high school, reading at grade level and planning for college—the first in his family.',
        callToAction: 'With proven results and a scalable model, we\'re ready to expand to serve 2,000 youth annually. Your investment of $500,000 over two years will transform educational outcomes for an entire generation of NYC students.',
        socialMediaVersion: 'Our youth program data is in: 89% improved grades, 94% attendance, and 3.8x social ROI! We\'re ready to scale from 847 to 2,000 students. #EducationEquity #DataDriven #YouthDevelopment #NYCEducation',
        emailVersion: 'Subject: 89% of our students improved their grades—here\'s how we\'ll scale\n\nDear [Foundation Name],\n\nThree years ago, we started with one classroom and a belief that NYC youth deserved better. Today, our data tells a powerful story:\n\n• 847 students served\n• 89% improved their grades\n• 94% daily attendance rate\n• $312 cost per successful outcome\n• 3.8x social return on investment\n\nWe\'ve proven our model works. Now we\'re ready to scale.\n\nYour investment of $500,000 will:\n• Expand to 3 new neighborhoods\n• Serve 2,000 students annually\n• Create systemic change in educational equity\n\n[View Full Proposal]\n\nTogether, we can transform education outcomes for an entire generation.\n\nSincerely,\n[Your name]',
        presentationTips: [
          'Lead with proven results and third-party validation',
          'Use clear data visualizations with sources cited',
          'Include evaluation methodology details',
          'Show specific use of requested funds',
          'Prepare for deep-dive questions on metrics'
        ]
      })
    };

    const template = templates[storyType] || templates.impact_story;
    return template();
  };

  const copyStory = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Story copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Data Storyteller
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform numbers into narratives that inspire action
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Story Type</label>
              <Select value={storyType} onValueChange={setStoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="What kind of story?" />
                </SelectTrigger>
                <SelectContent>
                  {storyTypes.map((type) => (
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
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Who will read this?" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((aud) => (
                    <SelectItem key={aud.value} value={aud.value}>
                      {aud.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Data</label>
            <Textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Enter your key data points and statistics. For example: 'Served 1,234 people, 89% satisfaction rate, $2.50 per meal, 45% increase from last year, 67 volunteers...'"
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emotional Tone</label>
            <Select value={emotionalTone} onValueChange={setEmotionalTone}>
              <SelectTrigger>
                <SelectValue placeholder="Choose the feeling" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={createStory} 
            disabled={isCreating || !storyType || !audience || !rawData.trim() || !emotionalTone}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Crafting Your Story...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Create Data Story
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {story && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{story.headline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">{story.hook}</p>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{story.context}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Key Data Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {story.dataPoints.map((point, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xl font-bold text-blue-600 mb-2">{point.statistic}</h4>
                  <p className="text-gray-700 mb-2">{point.meaning}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Visual: {point.visual}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                The Human Element
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{story.humanElement}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Call to Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-gray-800">{story.callToAction}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Social Media Version</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyStory(story.socialMediaVersion)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{story.socialMediaVersion}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Email Version</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyStory(story.emailVersion)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap font-sans">
                  {story.emailVersion}
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Presentation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {story.presentationTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};