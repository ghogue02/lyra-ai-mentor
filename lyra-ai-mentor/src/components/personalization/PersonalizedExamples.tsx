import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Lightbulb, 
  Star, 
  TrendingUp, 
  Users,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Copy,
  Share2,
  Download,
  Filter,
  Search,
  ChevronRight,
  MessageCircle,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Building,
  Globe,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AIService } from '@/services/aiService';

// Example and scenario types
interface PersonalizedExample {
  id: string;
  title: string;
  category: 'success-story' | 'best-practice' | 'case-study' | 'template' | 'strategy';
  scenario: string;
  context: {
    audience: string;
    purpose: string;
    goal: string;
    setting: string;
  };
  content: {
    before?: string;
    after: string;
    approach: string;
    results: string[];
    lessons: string[];
  };
  metrics: {
    engagement?: number;
    conversion?: number;
    satisfaction?: number;
    growth?: number;
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  resources: string[];
  industry: string;
  organizationSize: 'small' | 'medium' | 'large';
  aiGenerated?: boolean;
}

interface ExampleFilter {
  category: string;
  difficulty: string;
  industry: string;
  organizationSize: string;
  search: string;
}

interface PersonalizedExamplesProps {
  audience: string;
  purpose: string;
  goal: string;
  context: string;
  userProfile?: {
    experience: string;
    role: string;
    organizationType: string;
    interests: string[];
  };
  onExampleSelect?: (example: PersonalizedExample) => void;
}

// Comprehensive example library
const exampleLibrary: PersonalizedExample[] = [
  {
    id: 'major-donor-cultivation-success',
    title: 'Transforming a $500 Donor into a $50K Major Gift',
    category: 'success-story',
    scenario: 'Regional food bank cultivates longtime small donor into major gift',
    context: {
      audience: 'major-donors',
      purpose: 'fundraising',
      goal: 'acquire',
      setting: 'Regional nonprofit food bank serving 3-county area'
    },
    content: {
      before: 'Margaret was a faithful $50 monthly donor for 8 years, but had never been approached for a larger gift. She consistently opened emails and attended annual events but felt disconnected from the organization\'s leadership.',
      after: 'Through a systematic cultivation approach, Margaret made a $50,000 gift to fund a new mobile food pantry, citing her personal connection to the cause and trust in the organization.',
      approach: 'Personal relationship building through storytelling and involvement',
      results: [
        'Secured $50,000 major gift within 18 months',
        'Donor became volunteer board member',
        'Referred 3 additional major donors from her network',
        'Upgraded monthly gift to $200'
      ],
      lessons: [
        'Long-term donors often have greater capacity than their giving history suggests',
        'Personal connection is more powerful than sophisticated wealth screening',
        'Involving donors in mission delivery increases commitment',
        'Storytelling should connect donor values to organizational impact'
      ]
    },
    metrics: {
      engagement: 95,
      conversion: 100,
      satisfaction: 92,
      growth: 10000
    },
    tags: ['cultivation', 'major-gifts', 'donor-upgrade', 'relationship-building', 'food-security'],
    difficulty: 'intermediate',
    estimatedTime: '18-24 months',
    resources: [
      'Dedicated development officer time',
      'Board member volunteer',
      'Site visit opportunities',
      'Impact storytelling materials'
    ],
    industry: 'Human Services',
    organizationSize: 'medium'
  },
  {
    id: 'monthly-donor-retention-strategy',
    title: 'Reducing Monthly Donor Churn by 40% Through Personalization',
    category: 'case-study',
    scenario: 'Animal shelter implements personalized stewardship program',
    context: {
      audience: 'monthly-donors',
      purpose: 'fundraising',
      goal: 'retain',
      setting: 'Local animal shelter with 800 monthly donors'
    },
    content: {
      before: 'Monthly donor churn rate was 35% annually. Donors received generic newsletters and felt disconnected from impact. Limited information about individual donor preferences and interests.',
      after: 'Implemented personalized communication strategy based on donor preferences, animal interests, and giving history. Churn rate dropped to 21% with increased average gift size.',
      approach: 'Segmented personalization based on donor behavior and preferences',
      results: [
        'Reduced annual churn from 35% to 21%',
        'Increased average monthly gift by 18%',
        'Improved email open rates to 45%',
        'Generated 200+ new volunteer applications'
      ],
      lessons: [
        'Donor preferences drive engagement more than demographics',
        'Showing specific impact of monthly gifts builds loyalty',
        'Regular touchpoints matter more than frequency',
        'Personal stories outperform statistics for emotional connection'
      ]
    },
    metrics: {
      engagement: 78,
      conversion: 79,
      satisfaction: 88,
      growth: 18
    },
    tags: ['monthly-giving', 'retention', 'personalization', 'segmentation', 'animal-welfare'],
    difficulty: 'intermediate',
    estimatedTime: '6-12 months',
    resources: [
      'Email marketing platform with segmentation',
      'Donor preference survey tools',
      'Photography for impact stories',
      'Database management system'
    ],
    industry: 'Animal Welfare',
    organizationSize: 'medium'
  },
  {
    id: 'volunteer-engagement-program',
    title: 'Doubling Volunteer Retention Through Skills-Based Matching',
    category: 'best-practice',
    scenario: 'Youth development organization revolutionizes volunteer program',
    context: {
      audience: 'volunteers',
      purpose: 'programs',
      goal: 'engage',
      setting: 'Urban youth development nonprofit with 150 active volunteers'
    },
    content: {
      before: 'Volunteer turnover was 65% annually. Many volunteers felt underutilized or placed in roles that didn\'t match their skills. Limited orientation and ongoing support.',
      after: 'Developed comprehensive skills assessment and matching system with personalized volunteer pathways. Retention improved to 85% with higher satisfaction scores.',
      approach: 'Skills-based matching with personalized development pathways',
      results: [
        'Increased volunteer retention from 35% to 85%',
        'Improved volunteer satisfaction scores to 4.6/5',
        'Doubled program capacity without increasing staff',
        'Created pipeline of 25 volunteer leaders'
      ],
      lessons: [
        'Matching skills to roles dramatically improves satisfaction',
        'Regular check-ins prevent volunteer disengagement',
        'Growth opportunities increase long-term commitment',
        'Recognition programs should align with individual preferences'
      ]
    },
    metrics: {
      engagement: 92,
      conversion: 85,
      satisfaction: 92,
      growth: 142
    },
    tags: ['volunteer-management', 'skills-matching', 'retention', 'engagement', 'youth-development'],
    difficulty: 'intermediate',
    estimatedTime: '9-15 months',
    resources: [
      'Volunteer management software',
      'Skills assessment tools',
      'Training and orientation materials',
      'Recognition program budget'
    ],
    industry: 'Youth Development',
    organizationSize: 'medium'
  },
  {
    id: 'corporate-partnership-strategy',
    title: 'Landing First $100K Corporate Partnership',
    category: 'success-story',
    scenario: 'Environmental nonprofit secures major corporate sponsorship',
    context: {
      audience: 'corporate-partners',
      purpose: 'fundraising',
      goal: 'acquire',
      setting: 'Environmental conservation organization targeting tech companies'
    },
    content: {
      before: 'Organization relied primarily on individual donors and small grants. No experience with corporate partnerships or employee engagement programs.',
      after: 'Secured 3-year, $300K partnership with tech company including cash, in-kind services, and employee volunteer program affecting 500+ employees.',
      approach: 'Value-aligned partnership with mutual benefit focus',
      results: [
        'Secured $100K annual partnership for 3 years',
        'Gained access to $50K in pro-bono tech services',
        'Engaged 500+ corporate volunteers in conservation projects',
        'Generated media coverage worth $75K in PR value'
      ],
      lessons: [
        'Corporate partnerships require clear value proposition for both parties',
        'Employee engagement opportunities often more valuable than cash',
        'Measurable impact metrics essential for corporate reporting',
        'Long-term relationships start with small pilot projects'
      ]
    },
    metrics: {
      engagement: 88,
      conversion: 100,
      satisfaction: 94,
      growth: 300
    },
    tags: ['corporate-partnerships', 'employee-engagement', 'environmental', 'value-proposition'],
    difficulty: 'advanced',
    estimatedTime: '12-18 months',
    resources: [
      'Corporate partnership strategy',
      'Professional presentation materials',
      'Impact measurement tools',
      'Employee engagement program design'
    ],
    industry: 'Environmental',
    organizationSize: 'medium'
  },
  {
    id: 'lapsed-donor-reactivation',
    title: 'Winning Back 30% of Lapsed Donors with Personal Touch',
    category: 'case-study',
    scenario: 'Arts organization reactivates dormant donor base',
    context: {
      audience: 'lapsed-donors',
      purpose: 'fundraising',
      goal: 'retain',
      setting: 'Community theater with 400 lapsed donors from past 3 years'
    },
    content: {
      before: 'Lost connection with 400 former donors over past 3 years. Standard reactivation emails had 2% response rate. No systematic approach to understanding why donors lapsed.',
      after: 'Implemented personalized reactivation campaign acknowledging past support and sharing organizational changes. Reactivated 30% of lapsed donors.',
      approach: 'Acknowledgment + updates + gentle re-engagement',
      results: [
        'Reactivated 120 out of 400 lapsed donors (30%)',
        'Average reactivation gift of $150',
        'Generated $18K in renewed support',
        'Created database of lapse reasons for future prevention'
      ],
      lessons: [
        'Acknowledging the lapse builds trust and authenticity',
        'Showing organizational growth addresses lapse concerns',
        'Multiple touchpoints increase reactivation success',
        'Understanding lapse reasons prevents future churn'
      ]
    },
    metrics: {
      engagement: 45,
      conversion: 30,
      satisfaction: 76,
      growth: 150
    },
    tags: ['lapsed-donors', 'reactivation', 'acknowledgment', 'trust-building', 'arts'],
    difficulty: 'intermediate',
    estimatedTime: '4-8 months',
    resources: [
      'Segmented lapsed donor database',
      'Personalized outreach materials',
      'Staff time for personal touches',
      'Survey tools for feedback collection'
    ],
    industry: 'Arts & Culture',
    organizationSize: 'small'
  },
  {
    id: 'board-giving-campaign',
    title: '100% Board Giving Achievement Through Peer-to-Peer Approach',
    category: 'best-practice',
    scenario: 'Health nonprofit achieves universal board participation',
    context: {
      audience: 'board-members',
      purpose: 'fundraising',
      goal: 'engage',
      setting: 'Health advocacy organization with 12-member board'
    },
    content: {
      before: 'Only 60% of board members were making annual gifts, creating awkward dynamics and limiting external fundraising credibility.',
      after: 'Achieved 100% board giving participation with average gift increase of 40% through peer leadership and clear expectations.',
      approach: 'Board chair leadership with peer accountability and support',
      results: [
        'Increased board participation from 60% to 100%',
        'Raised average board gift by 40%',
        'Improved external fundraising success by 25%',
        'Strengthened board culture and commitment'
      ],
      lessons: [
        'Board chair leadership is essential for universal participation',
        'Clear expectations must be set during recruitment',
        'Peer accountability works better than staff pressure',
        'Flexible giving options accommodate different capacities'
      ]
    },
    metrics: {
      engagement: 100,
      conversion: 100,
      satisfaction: 89,
      growth: 40
    },
    tags: ['board-development', 'governance', 'leadership-giving', 'peer-accountability'],
    difficulty: 'advanced',
    estimatedTime: '6-12 months',
    resources: [
      'Board chair commitment',
      'Clear giving policy',
      'Individual solicitation training',
      'Multiple giving options'
    ],
    industry: 'Health',
    organizationSize: 'medium'
  }
];

// AI-generated examples based on context
const generateContextualExamples = async (
  audience: string,
  purpose: string,
  goal: string,
  context: string,
  aiService: any
): Promise<PersonalizedExample[]> => {
  try {
    const response = await aiService.generateResponse({
      prompt: `Generate 2 realistic nonprofit examples for this context:
      Audience: ${audience}
      Purpose: ${purpose}
      Goal: ${goal}
      Context: ${context}

      For each example, provide:
      1. Title (compelling and specific)
      2. Scenario (one sentence description)
      3. Before situation (what was the challenge)
      4. After situation (what was achieved)
      5. Approach (how they did it)
      6. 3 specific results
      7. 2 key lessons
      8. Industry type
      9. Organization size

      Format as JSON array with these fields: title, scenario, before, after, approach, results, lessons, industry, organizationSize`,
      context: "You are an expert in nonprofit fundraising and program management with deep knowledge of successful case studies.",
      temperature: 0.8
    });

    // Parse the AI response and convert to PersonalizedExample format
    try {
      const aiExamples = JSON.parse(response.content);
      return aiExamples.map((example: any, index: number) => ({
        id: `ai-generated-${Date.now()}-${index}`,
        title: example.title,
        category: 'case-study' as const,
        scenario: example.scenario,
        context: {
          audience,
          purpose,
          goal,
          setting: `${example.industry} organization`
        },
        content: {
          before: example.before,
          after: example.after,
          approach: example.approach,
          results: example.results,
          lessons: example.lessons
        },
        metrics: {
          engagement: Math.floor(Math.random() * 20) + 75,
          conversion: Math.floor(Math.random() * 30) + 60,
          satisfaction: Math.floor(Math.random() * 15) + 80,
          growth: Math.floor(Math.random() * 50) + 25
        },
        tags: [audience, purpose, goal, example.industry.toLowerCase()],
        difficulty: 'intermediate' as const,
        estimatedTime: '6-12 months',
        resources: ['Strategic planning', 'Stakeholder engagement', 'Implementation tools'],
        industry: example.industry,
        organizationSize: example.organizationSize,
        aiGenerated: true
      }));
    } catch (parseError) {
      console.warn('Failed to parse AI-generated examples, using fallback');
      return [];
    }
  } catch (error) {
    console.error('Error generating contextual examples:', error);
    return [];
  }
};

export const PersonalizedExamples: React.FC<PersonalizedExamplesProps> = ({
  audience,
  purpose,
  goal,
  context,
  userProfile,
  onExampleSelect
}) => {
  const [selectedExample, setSelectedExample] = useState<PersonalizedExample | null>(null);
  const [filteredExamples, setFilteredExamples] = useState<PersonalizedExample[]>([]);
  const [aiExamples, setAiExamples] = useState<PersonalizedExample[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [filters, setFilters] = useState<ExampleFilter>({
    category: 'all',
    difficulty: 'all',
    industry: 'all',
    organizationSize: 'all',
    search: ''
  });
  const [activeCategory, setActiveCategory] = useState('relevant');

  const aiService = AIService.getInstance();

  // Filter examples based on current context and filters
  const allExamples = useMemo(() => {
    return [...exampleLibrary, ...aiExamples];
  }, [aiExamples]);

  const contextualExamples = useMemo(() => {
    // Filter examples relevant to current context
    return allExamples.filter(example => 
      example.context.audience === audience || 
      example.context.purpose === purpose ||
      example.context.goal === goal ||
      example.tags.includes(audience) ||
      example.tags.includes(purpose) ||
      example.tags.includes(goal)
    );
  }, [allExamples, audience, purpose, goal]);

  const applyFilters = useMemo(() => {
    let examples = activeCategory === 'relevant' ? contextualExamples : allExamples;

    // Apply filters
    if (filters.category !== 'all') {
      examples = examples.filter(ex => ex.category === filters.category);
    }
    if (filters.difficulty !== 'all') {
      examples = examples.filter(ex => ex.difficulty === filters.difficulty);
    }
    if (filters.industry !== 'all') {
      examples = examples.filter(ex => ex.industry === filters.industry);
    }
    if (filters.organizationSize !== 'all') {
      examples = examples.filter(ex => ex.organizationSize === filters.organizationSize);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      examples = examples.filter(ex => 
        ex.title.toLowerCase().includes(searchLower) ||
        ex.scenario.toLowerCase().includes(searchLower) ||
        ex.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return examples;
  }, [allExamples, contextualExamples, activeCategory, filters]);

  // Generate AI examples when component mounts
  useEffect(() => {
    const generateAIExamples = async () => {
      setIsGeneratingAI(true);
      const generated = await generateContextualExamples(audience, purpose, goal, context, aiService);
      setAiExamples(generated);
      setIsGeneratingAI(false);
    };

    generateAIExamples();
  }, [audience, purpose, goal, context, aiService]);

  // Handle example selection
  const handleExampleSelect = (example: PersonalizedExample) => {
    setSelectedExample(example);
    if (onExampleSelect) {
      onExampleSelect(example);
    }
  };

  // Copy example content
  const copyExample = async (example: PersonalizedExample) => {
    const content = `${example.title}

Scenario: ${example.scenario}

Approach: ${example.content.approach}

Results:
${example.content.results.map(r => `• ${r}`).join('\n')}

Key Lessons:
${example.content.lessons.map(l => `• ${l}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(content);
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      categories: [...new Set(allExamples.map(ex => ex.category))],
      difficulties: [...new Set(allExamples.map(ex => ex.difficulty))],
      industries: [...new Set(allExamples.map(ex => ex.industry))],
      organizationSizes: [...new Set(allExamples.map(ex => ex.organizationSize))]
    };
  }, [allExamples]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Personalized Examples & Case Studies</h1>
            <p className="text-muted-foreground">
              Real-world examples for {audience} • {purpose} • {goal}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm">
          <Badge variant="outline">
            {contextualExamples.length} relevant examples
          </Badge>
          <Badge variant="outline">
            {allExamples.length} total examples
          </Badge>
          {isGeneratingAI && (
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Generating AI examples...</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Find Examples</CardTitle>
              <CardDescription>Filter and search for relevant case studies</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeCategory === 'relevant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('relevant')}
              >
                Relevant ({contextualExamples.length})
              </Button>
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
              >
                All ({allExamples.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search examples..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filterOptions.categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {filterOptions.difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={filters.industry}
                onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {filterOptions.industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="size">Organization Size</Label>
              <Select
                value={filters.organizationSize}
                onValueChange={(value) => setFilters(prev => ({ ...prev, organizationSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {filterOptions.organizationSizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {applyFilters.map((example) => {
          const isSelected = selectedExample?.id === example.id;
          
          return (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all h-full ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'hover:border-muted-foreground hover:shadow-md'
                }`}
                onClick={() => handleExampleSelect(example)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {example.category === 'success-story' && <Star className="w-4 h-4 text-yellow-500" />}
                        {example.category === 'best-practice' && <Award className="w-4 h-4 text-blue-500" />}
                        {example.category === 'case-study' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        <Badge variant="outline">{example.category.replace('-', ' ')}</Badge>
                        <Badge variant={example.difficulty === 'advanced' ? 'default' : 'secondary'}>
                          {example.difficulty}
                        </Badge>
                        {example.aiGenerated && (
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{example.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{example.scenario}</CardDescription>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary ml-2" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {example.industry}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {example.organizationSize}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {example.estimatedTime}
                      </div>
                    </div>

                    {/* Metrics */}
                    {example.metrics && (
                      <div className="grid grid-cols-2 gap-3">
                        {example.metrics.engagement && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{example.metrics.engagement}%</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                        )}
                        {example.metrics.conversion && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{example.metrics.conversion}%</div>
                            <div className="text-xs text-muted-foreground">Conversion</div>
                          </div>
                        )}
                        {example.metrics.growth && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">+{example.metrics.growth}%</div>
                            <div className="text-xs text-muted-foreground">Growth</div>
                          </div>
                        )}
                        {example.metrics.satisfaction && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{example.metrics.satisfaction}%</div>
                            <div className="text-xs text-muted-foreground">Satisfaction</div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Key Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {example.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {example.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{example.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Example Details */}
      {selectedExample && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedExample.title}</CardTitle>
                <CardDescription className="text-base">{selectedExample.scenario}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyExample(selectedExample)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="approach">Approach</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Context</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Setting:</strong> {selectedExample.context.setting}</div>
                      <div><strong>Audience:</strong> {selectedExample.context.audience}</div>
                      <div><strong>Purpose:</strong> {selectedExample.context.purpose}</div>
                      <div><strong>Goal:</strong> {selectedExample.context.goal}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Industry:</strong> {selectedExample.industry}</div>
                      <div><strong>Organization Size:</strong> {selectedExample.organizationSize}</div>
                      <div><strong>Difficulty:</strong> {selectedExample.difficulty}</div>
                      <div><strong>Timeline:</strong> {selectedExample.estimatedTime}</div>
                    </div>
                  </div>
                </div>

                {selectedExample.content.before && (
                  <div>
                    <h4 className="font-semibold mb-3">The Challenge</h4>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{selectedExample.content.before}</AlertDescription>
                    </Alert>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">The Success</h4>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{selectedExample.content.after}</AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              <TabsContent value="approach" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Strategy & Approach</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p>{selectedExample.content.approach}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Required Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedExample.resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Key Results Achieved</h4>
                  <div className="space-y-3">
                    {selectedExample.content.results.map((result, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-200">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedExample.metrics && (
                  <div>
                    <h4 className="font-semibold mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedExample.metrics.engagement && (
                        <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">{selectedExample.metrics.engagement}%</div>
                          <div className="text-sm text-blue-600">Engagement Rate</div>
                        </div>
                      )}
                      {selectedExample.metrics.conversion && (
                        <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                          <div className="text-2xl font-bold text-green-600">{selectedExample.metrics.conversion}%</div>
                          <div className="text-sm text-green-600">Conversion Rate</div>
                        </div>
                      )}
                      {selectedExample.metrics.satisfaction && (
                        <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                          <div className="text-2xl font-bold text-purple-600">{selectedExample.metrics.satisfaction}%</div>
                          <div className="text-sm text-purple-600">Satisfaction Score</div>
                        </div>
                      )}
                      {selectedExample.metrics.growth && (
                        <div className="text-center p-4 bg-orange-50 rounded border border-orange-200">
                          <div className="text-2xl font-bold text-orange-600">+{selectedExample.metrics.growth}%</div>
                          <div className="text-sm text-orange-600">Growth Rate</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="lessons" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Key Lessons Learned</h4>
                  <div className="space-y-3">
                    {selectedExample.content.lessons.map((lesson, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded border border-yellow-200">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <span className="text-sm">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Implementation Tip:</strong> These lessons can be adapted to your specific context. 
                    Consider how your organization's unique situation might require modifications to this approach.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {applyFilters.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Examples Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find relevant examples.
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                category: 'all',
                difficulty: 'all',
                industry: 'all',
                organizationSize: 'all',
                search: ''
              })}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedExamples;