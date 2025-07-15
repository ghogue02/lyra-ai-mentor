import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart,
  ArrowRight,
  Lightbulb,
  Target,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useResponsive, useSwipeGestures } from '@/hooks/useResponsive';
import { MobilePlaygroundWrapper } from '../../MobilePlaygroundWrapper';
import { cn } from '@/lib/utils';

interface DataSet {
  id: string;
  title: string;
  context: string;
  challenge: string;
  data: any[];
  chartType: 'line' | 'bar' | 'pie';
  insights: string[];
  storyPrompts: string[];
}

const dataSets: DataSet[] = [
  {
    id: 'donation-trends',
    title: 'Donation Trends Analysis',
    context: 'Your nonprofit saw a significant shift in donation patterns this year.',
    challenge: 'Transform these numbers into a compelling story for the board meeting.',
    data: [
      { month: 'Jan', donations: 45000, donors: 320 },
      { month: 'Feb', donations: 42000, donors: 310 },
      { month: 'Mar', donations: 38000, donors: 280 },
      { month: 'Apr', donations: 52000, donors: 380 },
      { month: 'May', donations: 68000, donors: 450 },
      { month: 'Jun', donations: 75000, donors: 520 }
    ],
    chartType: 'line',
    insights: [
      '67% increase in donations from March to June',
      'Average donation size increased by 23%',
      'Donor retention improved after new engagement campaign'
    ],
    storyPrompts: [
      'What caused the turning point in April?',
      'How did donor behavior change?',
      'What does this mean for our mission?'
    ]
  },
  {
    id: 'program-impact',
    title: 'Program Impact Metrics',
    context: 'Your education program reached more students than ever before.',
    challenge: 'Show the human impact behind these impressive numbers.',
    data: [
      { category: 'Students', value: 1250, previous: 800 },
      { category: 'Graduation', value: 92, previous: 78 },
      { category: 'College', value: 85, previous: 62 },
      { category: 'Satisfaction', value: 96, previous: 88 }
    ],
    chartType: 'bar',
    insights: [
      '56% more students served this year',
      '14-point increase in graduation rates',
      'Life-changing outcomes for 1,250 families'
    ],
    storyPrompts: [
      'Highlight individual student success stories',
      'Connect metrics to mission statement',
      'Show long-term community impact'
    ]
  },
  {
    id: 'resource-allocation',
    title: 'Resource Allocation Overview',
    context: 'How your organization invests donor dollars to create impact.',
    challenge: 'Demonstrate efficiency and impact to potential major donors.',
    data: [
      { name: 'Programs', value: 75, color: '#10b981' },
      { name: 'Admin', value: 15, color: '#3b82f6' },
      { name: 'Fundraising', value: 10, color: '#8b5cf6' }
    ],
    chartType: 'pie',
    insights: [
      '75 cents of every dollar goes directly to programs',
      'Administrative efficiency improved by 12%',
      'Best-in-class overhead ratio for sector'
    ],
    storyPrompts: [
      'Compare to sector benchmarks',
      'Show ROI of program investments',
      'Highlight efficiency improvements'
    ]
  }
];

interface StoryTemplate {
  id: string;
  name: string;
  structure: string[];
  example: string;
}

const storyTemplates: StoryTemplate[] = [
  {
    id: 'hero-journey',
    name: 'The Hero\'s Journey',
    structure: ['Challenge', 'Turning Point', 'Transformation', 'New Reality'],
    example: 'Our students faced unprecedented challenges... Then something remarkable happened...'
  },
  {
    id: 'before-after',
    name: 'Before & After',
    structure: ['Previous State', 'Intervention', 'Current State', 'Future Vision'],
    example: 'A year ago, only 62% of students enrolled in college. Today, that number is 85%...'
  },
  {
    id: 'problem-solution',
    name: 'Problem-Solution-Impact',
    structure: ['Problem', 'Our Solution', 'Measurable Impact', 'What\'s Next'],
    example: 'Families struggled with access to education. We created a new approach...'
  }
];

const MobileDavidDataStoryteller: React.FC<{ 
  onComplete?: (score: number) => void;
  onBack?: () => void;
}> = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'explore' | 'insights' | 'story' | 'complete'>('intro');
  const [selectedDataSet, setSelectedDataSet] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [storyDraft, setStoryDraft] = useState<string[]>(['', '', '', '']);
  const [animateChart, setAnimateChart] = useState(false);
  const [score, setScore] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  
  const { isMobile, isLandscape } = useResponsive();
  const dataSet = dataSets[selectedDataSet];

  // Enable swipe gestures for insights
  useSwipeGestures({
    onSwipeLeft: () => {
      if (phase === 'explore' && currentInsight < dataSet.insights.length - 1) {
        setCurrentInsight(prev => prev + 1);
      }
    },
    onSwipeRight: () => {
      if (phase === 'explore' && currentInsight > 0) {
        setCurrentInsight(prev => prev - 1);
      }
    }
  });

  useEffect(() => {
    if (phase === 'explore') {
      setAnimateChart(true);
    }
  }, [phase]);

  const generateStoryFromData = () => {
    const template = storyTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const stories = {
      'hero-journey': [
        `In March, our donations hit a concerning low of $38,000, threatening our ability to serve our community.`,
        `Everything changed when we launched our "Stories of Impact" campaign in April, connecting donors directly with beneficiaries.`,
        `By June, donations soared to $75,000—nearly double our March numbers—with 520 active donors.`,
        `This transformation proves that when donors see real impact, they don't just give—they become partners in our mission.`
      ],
      'before-after': [
        `Six months ago, we were averaging $42,000 in monthly donations with declining donor engagement.`,
        `We implemented personalized donor communications and transparent impact reporting.`,
        `Today, we're celebrating $75,000 in monthly support with a 67% increase in active donors.`,
        `By year's end, we project serving 40% more families while maintaining our efficiency standards.`
      ],
      'problem-solution': [
        `Donor fatigue and economic uncertainty caused a 15% drop in Q1 donations.`,
        `We pivoted to storytelling-first communications, showing exactly how each dollar creates change.`,
        `The result: Record-breaking support that will fund 3 new program sites and serve 500 additional families.`,
        `Our next goal: Sustain this momentum to reach 10,000 families by 2025.`
      ]
    };

    setStoryDraft(stories[selectedTemplate as keyof typeof stories] || ['', '', '', '']);
  };

  const calculateScore = () => {
    let points = 0;
    
    if (storyDraft.every(section => section.length > 0)) points += 40;
    if (storyDraft.some(section => /\d+/.test(section))) points += 20;
    const emotionalWords = ['transform', 'impact', 'change', 'remarkable', 'celebrate'];
    if (storyDraft.some(section => emotionalWords.some(word => section.toLowerCase().includes(word)))) points += 20;
    if (storyDraft[3].toLowerCase().includes('goal') || storyDraft[3].toLowerCase().includes('future')) points += 20;
    
    setScore(points);
  };

  const renderChart = () => {
    const chartHeight = isMobile && isLandscape ? 200 : 250;
    
    if (dataSet.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={dataSet.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="donations" 
              stroke="#10b981" 
              strokeWidth={3}
              animationDuration={animateChart ? 2000 : 0}
            />
            {!isMobile && (
              <Line 
                type="monotone" 
                dataKey="donors" 
                stroke="#3b82f6" 
                strokeWidth={2}
                animationDuration={animateChart ? 2500 : 0}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (dataSet.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={dataSet.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" fontSize={12} angle={isMobile ? -45 : 0} textAnchor={isMobile ? "end" : "middle"} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="previous" fill="#94a3b8" animationDuration={animateChart ? 1000 : 0} />
            <Bar dataKey="value" fill="#10b981" animationDuration={animateChart ? 1500 : 0} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={dataSet.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={isMobile ? false : (entry) => `${entry.name}: ${entry.value}%`}
              outerRadius={isMobile ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
              animationDuration={animateChart ? 1500 : 0}
            >
              {dataSet.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  const handleComplete = () => {
    calculateScore();
    setPhase('complete');
    if (onComplete) {
      onComplete(score);
    }
  };

  const content = (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Data Storytelling</h1>
                <p className="text-gray-600">Turn overwhelming metrics into compelling narratives</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      'Find the human story hidden in your data',
                      'Create visualizations that inspire action',
                      'Connect numbers to mission impact'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-green-200 bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  People remember stories, not statistics. Make data unforgettable.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => setPhase('explore')} 
                size="lg" 
                className="w-full"
              >
                Start Data Exploration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{dataSet.title}</h2>
                <p className="text-sm text-gray-600">{dataSet.context}</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Your Challenge:</strong> {dataSet.challenge}
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="pt-4">
                  {renderChart()}
                </CardContent>
              </Card>

              {isMobile ? (
                // Mobile swipeable insights
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Key Insights</h3>
                    <span className="text-xs text-gray-600">
                      {currentInsight + 1} / {dataSet.insights.length}
                    </span>
                  </div>
                  
                  <div className="overflow-hidden">
                    <motion.div
                      className="flex"
                      animate={{ x: `-${currentInsight * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {dataSet.insights.map((insight, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-1">
                          <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="pt-4 text-center">
                              <Eye className="w-5 h-5 text-primary mx-auto mb-2" />
                              <p className="text-sm font-medium">{insight}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mt-3">
                    {dataSet.insights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentInsight(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentInsight ? 'bg-primary w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Desktop grid view
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dataSet.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-4">
                          <Eye className="w-4 h-4 text-primary mb-2" />
                          <p className="text-sm font-medium">{insight}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => setPhase('insights')}
                  className="flex-1"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Find the Story
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedDataSet((prev) => (prev + 1) % dataSets.length);
                    setCurrentInsight(0);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Story Framework</h2>
                <p className="text-sm text-gray-600">Choose a narrative structure</p>
              </div>

              <div className="space-y-3">
                {storyTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <Card className={cn(
                      "cursor-pointer transition-all",
                      selectedTemplate === template.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:shadow-md'
                    )}>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.structure.map((step, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {index + 1}. {step}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 italic">"{template.example}"</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Story Prompts:
                  </h4>
                  <ul className="space-y-1">
                    {dataSet.storyPrompts.map((prompt, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        • {prompt}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button 
                onClick={() => {
                  generateStoryFromData();
                  setPhase('story');
                }}
                disabled={!selectedTemplate}
                size="lg"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story Framework
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Your Data Story</h2>
                <p className="text-sm text-gray-600">AI-generated narrative</p>
              </div>

              {isMobile ? (
                // Mobile tabs view
                <Tabs defaultValue="story" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="story" className="space-y-3">
                    {storyTemplates.find(t => t.id === selectedTemplate)?.structure.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge variant="outline" className="text-xs mb-2">
                          {section}
                        </Badge>
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-3">
                            <p className="text-sm">{storyDraft[index]}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-3">
                    <Card>
                      <CardContent className="pt-4">
                        {renderChart()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                // Desktop side-by-side view
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Your Data Visualization:</h4>
                    <Card>
                      <CardContent className="pt-4">
                        {renderChart()}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Your Story:</h4>
                    {storyTemplates.find(t => t.id === selectedTemplate)?.structure.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Badge variant="outline" className="text-xs mb-1">
                          {section}
                        </Badge>
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-3">
                            <p className="text-sm">{storyDraft[index]}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  You've transformed raw data into a compelling narrative!
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleComplete}
                size="lg"
                className="w-full"
              >
                Complete Challenge
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 text-center space-y-6"
          >
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Data Story Master!</h2>
              <p>You've learned to make numbers speak to the heart</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Your Storytelling Score:</h3>
                  <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="w-full max-w-xs mx-auto h-3" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Data Insight</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Find patterns
                    </p>
                  </div>
                  <div>
                    <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Human Impact</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Connect to people
                    </p>
                  </div>
                  <div>
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Story Power</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Inspire action
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <MobilePlaygroundWrapper
      title="David's Data Storyteller"
      onBack={onBack}
    >
      {content}
    </MobilePlaygroundWrapper>
  );
};

export default MobileDavidDataStoryteller;