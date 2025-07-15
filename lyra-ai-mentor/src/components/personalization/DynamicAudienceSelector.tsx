import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Building, 
  UserCheck, 
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Info,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Audience types with rich descriptions
interface AudienceProfile {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  motivations: string[];
  communicationPreferences: string[];
  bestApproaches: string[];
  pitfalls: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  segmentSize: 'small' | 'medium' | 'large';
  engagementLevel: 'low' | 'medium' | 'high';
  conversionRate: number;
  examples: string[];
}

interface AudienceSegment {
  id: string;
  profileId: string;
  name: string;
  criteria: Record<string, any>;
  size: number;
  engagement: number;
  recentActivity: string;
  personalizedFields: string[];
}

interface DynamicAudienceSelectorProps {
  onAudienceSelect: (audience: AudienceProfile, segments: AudienceSegment[]) => void;
  contentPurpose?: 'fundraising' | 'programs' | 'operations' | 'marketing' | 'engagement' | 'stewardship';
  initialAudience?: string;
  showSegmentation?: boolean;
}

// Comprehensive audience profiles
const audienceProfiles: AudienceProfile[] = [
  {
    id: 'major-donors',
    name: 'Major Donors',
    description: 'High-value supporters who contribute significantly to your mission',
    characteristics: [
      'Give $1,000+ annually',
      'Seek personal connection',
      'Want to see direct impact',
      'Prefer detailed communications',
      'Appreciate recognition'
    ],
    motivations: [
      'Making transformational change',
      'Personal fulfillment',
      'Tax benefits',
      'Social recognition',
      'Legacy building'
    ],
    communicationPreferences: [
      'Personal calls and meetings',
      'Detailed impact reports',
      'Exclusive events',
      'Handwritten notes',
      'Customized proposals'
    ],
    bestApproaches: [
      'Emphasize transformational impact',
      'Provide specific examples',
      'Offer naming opportunities',
      'Share success stories',
      'Request face-to-face meetings'
    ],
    pitfalls: [
      'Generic mass communications',
      'Ignoring their preferences',
      'Over-solicitation',
      'Lack of stewardship',
      'Unclear impact reporting'
    ],
    icon: Heart,
    color: 'text-red-600',
    segmentSize: 'small',
    engagementLevel: 'high',
    conversionRate: 85,
    examples: [
      'Business owners who care about community',
      'Retired professionals with philanthropic interests',
      'Family foundations',
      'Board members and their networks'
    ]
  },
  {
    id: 'monthly-donors',
    name: 'Monthly Donors',
    description: 'Loyal supporters who provide consistent, recurring contributions',
    characteristics: [
      'Give $25-$100 monthly',
      'Highly loyal',
      'Prefer convenience',
      'Respond to progress updates',
      'Value consistency'
    ],
    motivations: [
      'Steady impact',
      'Convenient giving',
      'Community connection',
      'Habit formation',
      'Predictable support'
    ],
    communicationPreferences: [
      'Monthly newsletters',
      'Email updates',
      'Social media content',
      'SMS reminders',
      'Annual reports'
    ],
    bestApproaches: [
      'Show cumulative impact',
      'Emphasize reliability',
      'Create sense of partnership',
      'Provide regular updates',
      'Celebrate milestones'
    ],
    pitfalls: [
      'Taking loyalty for granted',
      'Infrequent communication',
      'Ignoring preferences',
      'Soliciting for additional gifts too often'
    ],
    icon: Users,
    color: 'text-blue-600',
    segmentSize: 'medium',
    engagementLevel: 'medium',
    conversionRate: 65,
    examples: [
      'Working professionals',
      'Parents who care about causes',
      'Retirees on fixed incomes',
      'Previous volunteers'
    ]
  },
  {
    id: 'lapsed-donors',
    name: 'Lapsed Donors',
    description: 'Former supporters who haven\'t given in 12+ months',
    characteristics: [
      'Previously engaged',
      'Lost connection',
      'May have competing priorities',
      'Require re-engagement',
      'Need renewed motivation'
    ],
    motivations: [
      'Renewed purpose',
      'Updated information',
      'Changed circumstances',
      'Different approach needed',
      'Rediscovered passion'
    ],
    communicationPreferences: [
      'Gentle re-engagement emails',
      'Impact stories',
      'Survey invitations',
      'Event invitations',
      'Volunteer opportunities'
    ],
    bestApproaches: [
      'Acknowledge their past support',
      'Show how things have changed',
      'Offer different ways to engage',
      'Start with low-commitment asks',
      'Provide valuable content'
    ],
    pitfalls: [
      'Being too aggressive',
      'Ignoring why they lapsed',
      'Same old messaging',
      'Immediate donation requests'
    ],
    icon: UserCheck,
    color: 'text-orange-600',
    segmentSize: 'large',
    engagementLevel: 'low',
    conversionRate: 25,
    examples: [
      'Former monthly donors',
      'Event attendees who stopped giving',
      'Volunteers who moved away',
      'Donors affected by life changes'
    ]
  },
  {
    id: 'corporate-partners',
    name: 'Corporate Partners',
    description: 'Businesses that support through sponsorships, grants, or partnerships',
    characteristics: [
      'Seek brand alignment',
      'Want employee engagement',
      'Focus on measurable outcomes',
      'Prefer professional communication',
      'Value partnership benefits'
    ],
    motivations: [
      'Corporate social responsibility',
      'Employee engagement',
      'Brand reputation',
      'Tax benefits',
      'Community investment'
    ],
    communicationPreferences: [
      'Professional presentations',
      'Detailed proposals',
      'ROI documentation',
      'Co-branded materials',
      'Executive briefings'
    ],
    bestApproaches: [
      'Align with business goals',
      'Provide clear ROI',
      'Offer partnership opportunities',
      'Create employee engagement',
      'Provide brand visibility'
    ],
    pitfalls: [
      'Treating like individual donors',
      'Ignoring business needs',
      'Lack of professionalism',
      'No follow-up on commitments'
    ],
    icon: Building,
    color: 'text-green-600',
    segmentSize: 'small',
    engagementLevel: 'medium',
    conversionRate: 45,
    examples: [
      'Local businesses',
      'National corporations',
      'Professional services firms',
      'Employee giving programs'
    ]
  },
  {
    id: 'volunteers',
    name: 'Active Volunteers',
    description: 'Dedicated individuals who give their time and often become donors',
    characteristics: [
      'Highly engaged',
      'Understand the mission deeply',
      'Appreciate recognition',
      'Prefer hands-on involvement',
      'Often become advocates'
    ],
    motivations: [
      'Personal fulfillment',
      'Skill development',
      'Community connection',
      'Making a difference',
      'Social interaction'
    ],
    communicationPreferences: [
      'Face-to-face meetings',
      'Volunteer newsletters',
      'Text messages',
      'Social media groups',
      'Appreciation events'
    ],
    bestApproaches: [
      'Recognize their contributions',
      'Provide growth opportunities',
      'Connect to mission impact',
      'Offer leadership roles',
      'Share success stories'
    ],
    pitfalls: [
      'Taking them for granted',
      'Over-scheduling',
      'Lack of appreciation',
      'Poor communication'
    ],
    icon: Target,
    color: 'text-purple-600',
    segmentSize: 'medium',
    engagementLevel: 'high',
    conversionRate: 70,
    examples: [
      'Regular program volunteers',
      'Event volunteers',
      'Board members',
      'Skill-based volunteers'
    ]
  },
  {
    id: 'prospective-donors',
    name: 'Prospective Donors',
    description: 'Individuals who have shown interest but haven\'t yet made a gift',
    characteristics: [
      'Engaged with content',
      'Attended events',
      'Expressed interest',
      'Need cultivation',
      'Potential for growth'
    ],
    motivations: [
      'Learning about the cause',
      'Finding the right fit',
      'Building trust',
      'Seeing impact',
      'Personal connection'
    ],
    communicationPreferences: [
      'Educational content',
      'Event invitations',
      'Impact stories',
      'Newsletters',
      'Social media'
    ],
    bestApproaches: [
      'Provide educational content',
      'Invite to events',
      'Share impact stories',
      'Build relationships',
      'Offer volunteer opportunities'
    ],
    pitfalls: [
      'Rushing to ask',
      'Generic messaging',
      'Overwhelming information',
      'Ignoring preferences'
    ],
    icon: Users,
    color: 'text-cyan-600',
    segmentSize: 'large',
    engagementLevel: 'medium',
    conversionRate: 35,
    examples: [
      'Newsletter subscribers',
      'Event attendees',
      'Social media followers',
      'Website visitors'
    ]
  }
];

// Sample audience segments
const generateAudienceSegments = (profileId: string): AudienceSegment[] => {
  const baseSegments: Record<string, AudienceSegment[]> = {
    'major-donors': [
      {
        id: 'major-donors-local',
        profileId: 'major-donors',
        name: 'Local Major Donors',
        criteria: { location: 'within 50 miles', giftAmount: '$1000+' },
        size: 45,
        engagement: 85,
        recentActivity: 'Attended gala last month',
        personalizedFields: ['firstName', 'location', 'lastGiftAmount', 'personalImpact']
      },
      {
        id: 'major-donors-foundation',
        profileId: 'major-donors',
        name: 'Foundation Donors',
        criteria: { donorType: 'foundation', giftAmount: '$5000+' },
        size: 12,
        engagement: 92,
        recentActivity: 'Submitted grant application',
        personalizedFields: ['organizationName', 'programFocus', 'grantAmount', 'reportingSchedule']
      }
    ],
    'monthly-donors': [
      {
        id: 'monthly-donors-loyal',
        profileId: 'monthly-donors',
        name: 'Loyal Monthly Donors',
        criteria: { tenure: '2+ years', giftAmount: '$25-$100' },
        size: 234,
        engagement: 75,
        recentActivity: 'Opened last 3 newsletters',
        personalizedFields: ['firstName', 'tenureMonths', 'monthlyAmount', 'cumulativeImpact']
      },
      {
        id: 'monthly-donors-new',
        profileId: 'monthly-donors',
        name: 'New Monthly Donors',
        criteria: { tenure: '< 6 months', giftAmount: '$15-$50' },
        size: 89,
        engagement: 65,
        recentActivity: 'Signed up for monthly giving',
        personalizedFields: ['firstName', 'firstGiftDate', 'monthlyAmount', 'welcomeMessage']
      }
    ],
    'lapsed-donors': [
      {
        id: 'lapsed-donors-recent',
        profileId: 'lapsed-donors',
        name: 'Recently Lapsed',
        criteria: { lastGift: '12-18 months ago', previousAmount: '$50+' },
        size: 156,
        engagement: 35,
        recentActivity: 'Clicked email link 2 weeks ago',
        personalizedFields: ['firstName', 'lastGiftAmount', 'lastGiftDate', 'missedYou']
      },
      {
        id: 'lapsed-donors-longtime',
        profileId: 'lapsed-donors',
        name: 'Long-time Lapsed',
        criteria: { lastGift: '2+ years ago', previousTenure: '5+ years' },
        size: 78,
        engagement: 15,
        recentActivity: 'No recent activity',
        personalizedFields: ['firstName', 'supportYears', 'lastGiftAmount', 'welcomeBack']
      }
    ]
  };

  return baseSegments[profileId] || [];
};

export const DynamicAudienceSelector: React.FC<DynamicAudienceSelectorProps> = ({
  onAudienceSelect,
  contentPurpose = 'fundraising',
  initialAudience,
  showSegmentation = true
}) => {
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile | null>(
    initialAudience ? audienceProfiles.find(p => p.id === initialAudience) || null : null
  );
  const [selectedSegments, setSelectedSegments] = useState<AudienceSegment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByEngagement, setFilterByEngagement] = useState<string>('all');
  const [filterBySize, setFilterBySize] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter audiences based on content purpose
  const relevantAudiences = useMemo(() => {
    const purposeRelevance: Record<string, string[]> = {
      fundraising: ['major-donors', 'monthly-donors', 'lapsed-donors', 'corporate-partners', 'prospective-donors'],
      programs: ['volunteers', 'prospective-donors', 'monthly-donors'],
      operations: ['volunteers', 'major-donors', 'corporate-partners'],
      marketing: ['prospective-donors', 'monthly-donors', 'volunteers'],
      engagement: ['volunteers', 'monthly-donors', 'lapsed-donors'],
      stewardship: ['major-donors', 'monthly-donors', 'volunteers']
    };

    return audienceProfiles.filter(profile => 
      purposeRelevance[contentPurpose]?.includes(profile.id)
    );
  }, [contentPurpose]);

  // Apply filters
  const filteredAudiences = useMemo(() => {
    let filtered = relevantAudiences;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(audience => 
        audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audience.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Engagement filter
    if (filterByEngagement !== 'all') {
      filtered = filtered.filter(audience => audience.engagementLevel === filterByEngagement);
    }

    // Size filter
    if (filterBySize !== 'all') {
      filtered = filtered.filter(audience => audience.segmentSize === filterBySize);
    }

    return filtered;
  }, [relevantAudiences, searchQuery, filterByEngagement, filterBySize]);

  // Handle audience selection
  const handleAudienceSelect = (audience: AudienceProfile) => {
    setSelectedAudience(audience);
    const segments = generateAudienceSegments(audience.id);
    setSelectedSegments(segments);
    onAudienceSelect(audience, segments);
  };

  // Handle segment selection
  const handleSegmentToggle = (segment: AudienceSegment) => {
    const newSegments = selectedSegments.includes(segment)
      ? selectedSegments.filter(s => s.id !== segment.id)
      : [...selectedSegments, segment];
    
    setSelectedSegments(newSegments);
    if (selectedAudience) {
      onAudienceSelect(selectedAudience, newSegments);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Discover Maya's Community</h1>
            <p className="text-muted-foreground">Explore the people Maya works with in her {contentPurpose} efforts</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Explore Maya's Network</CardTitle>
              <CardDescription>Discover the relationships Maya has built in her community work</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Audiences</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <Label htmlFor="engagement-filter">Engagement Level</Label>
                  <Select value={filterByEngagement} onValueChange={setFilterByEngagement}>
                    <SelectTrigger>
                      <SelectValue placeholder="All engagement levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="high">High Engagement</SelectItem>
                      <SelectItem value="medium">Medium Engagement</SelectItem>
                      <SelectItem value="low">Low Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size-filter">Segment Size</Label>
                  <Select value={filterBySize} onValueChange={setFilterBySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Audience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAudiences.map((audience) => {
          const Icon = audience.icon;
          const isSelected = selectedAudience?.id === audience.id;
          
          return (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'hover:border-muted-foreground hover:shadow-md'
                }`}
                onClick={() => handleAudienceSelect(audience)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${audience.color} bg-background`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{audience.name}</CardTitle>
                        <CardDescription>{audience.description}</CardDescription>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{audience.segmentSize} segment</Badge>
                      <Badge variant="outline">{audience.engagementLevel} engagement</Badge>
                      <Badge variant="outline">{audience.conversionRate}% conversion</Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Key Characteristics:</p>
                      <div className="flex flex-wrap gap-1">
                        {audience.characteristics.slice(0, 3).map((char, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                        {audience.characteristics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{audience.characteristics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Best Approaches:</p>
                      <div className="space-y-1">
                        {audience.bestApproaches.slice(0, 2).map((approach, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {approach}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Audience Details */}
      {selectedAudience && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audience Deep Dive: {selectedAudience.name}</CardTitle>
            <CardDescription>Detailed insights and communication strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                {showSegmentation && <TabsTrigger value="segments">Segments</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Characteristics</h4>
                    <div className="space-y-2">
                      {selectedAudience.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Motivations</h4>
                    <div className="space-y-2">
                      {selectedAudience.motivations.map((motivation, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4 text-red-500" />
                          {motivation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Examples</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAudience.examples.map((example, index) => (
                      <Alert key={index}>
                        <Info className="h-4 w-4" />
                        <AlertDescription>{example}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Communication Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAudience.communicationPreferences.map((pref, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm">{pref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategies" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Best Approaches</h4>
                    <div className="space-y-2">
                      {selectedAudience.bestApproaches.map((approach, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {approach}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Pitfalls to Avoid</h4>
                    <div className="space-y-2">
                      {selectedAudience.pitfalls.map((pitfall, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          {pitfall}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {showSegmentation && (
                <TabsContent value="segments" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Available Segments</h4>
                    <div className="space-y-3">
                      {generateAudienceSegments(selectedAudience.id).map((segment) => (
                        <motion.div
                          key={segment.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedSegments.includes(segment)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          onClick={() => handleSegmentToggle(segment)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{segment.name}</h5>
                              {selectedSegments.includes(segment) && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{segment.size} contacts</span>
                              <span>•</span>
                              <span>{segment.engagement}% engaged</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {segment.recentActivity}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {segment.personalizedFields.map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {selectedAudience && (
        <div className="flex justify-center">
          <Button
            onClick={() => onAudienceSelect(selectedAudience, selectedSegments)}
            className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Use This Audience
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicAudienceSelector;