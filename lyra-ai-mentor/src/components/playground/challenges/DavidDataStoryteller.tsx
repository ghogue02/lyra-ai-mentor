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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      { category: 'Students Served', value: 1250, previous: 800 },
      { category: 'Graduation Rate', value: 92, previous: 78 },
      { category: 'College Enrollment', value: 85, previous: 62 },
      { category: 'Parent Satisfaction', value: 96, previous: 88 }
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
      { name: 'Direct Programs', value: 75, color: '#10b981' },
      { name: 'Administration', value: 15, color: '#3b82f6' },
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

const DavidDataStoryteller: React.FC<{ onComplete?: (score: number) => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'explore' | 'insights' | 'story' | 'complete'>('intro');
  const [selectedDataSet, setSelectedDataSet] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [storyDraft, setStoryDraft] = useState<string[]>(['', '', '', '']);
  const [animateChart, setAnimateChart] = useState(false);
  const [score, setScore] = useState(0);

  const dataSet = dataSets[selectedDataSet];

  useEffect(() => {
    if (phase === 'explore') {
      setAnimateChart(true);
    }
  }, [phase]);

  const generateStoryFromData = () => {
    const template = storyTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Simulate AI-generated story based on template and data
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
    
    // Check if all story sections are filled
    if (storyDraft.every(section => section.length > 0)) points += 40;
    
    // Check if numbers are included
    if (storyDraft.some(section => /\d+/.test(section))) points += 20;
    
    // Check if emotional language is used
    const emotionalWords = ['transform', 'impact', 'change', 'remarkable', 'celebrate'];
    if (storyDraft.some(section => emotionalWords.some(word => section.toLowerCase().includes(word)))) points += 20;
    
    // Check if future vision is included
    if (storyDraft[3].toLowerCase().includes('goal') || storyDraft[3].toLowerCase().includes('future')) points += 20;
    
    setScore(points);
  };

  const renderChart = () => {
    if (dataSet.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataSet.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="donations" 
              stroke="#10b981" 
              strokeWidth={3}
              animationDuration={animateChart ? 2000 : 0}
            />
            <Line 
              type="monotone" 
              dataKey="donors" 
              stroke="#3b82f6" 
              strokeWidth={2}
              animationDuration={animateChart ? 2500 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (dataSet.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataSet.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="previous" fill="#94a3b8" animationDuration={animateChart ? 1000 : 0} />
            <Bar dataKey="value" fill="#10b981" animationDuration={animateChart ? 1500 : 0} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataSet.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}%`}
              outerRadius={100}
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">David's Data Storytelling Challenge</CardTitle>
                    <CardDescription>Turn overwhelming metrics into compelling narratives</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Master the Art of Data Storytelling:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Find the human story hidden in your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Create visualizations that inspire action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Connect numbers to mission impact</span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>Key Insight:</strong> People remember stories, not statistics. Your job is to make data unforgettable.
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
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Exploration</CardTitle>
                <CardDescription>{dataSet.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Context:</strong> {dataSet.context}
                    <p className="mt-1"><strong>Your Challenge:</strong> {dataSet.challenge}</p>
                  </AlertDescription>
                </Alert>

                <div className="bg-muted/20 p-4 rounded-lg">
                  {renderChart()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dataSet.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-primary mb-1" />
                      <p className="text-sm font-medium">{insight}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setPhase('insights')}
                    className="flex-1"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Find the Story
                  </Button>
                  <Button 
                    onClick={() => setSelectedDataSet((prev) => (prev + 1) % dataSets.length)}
                    variant="outline"
                  >
                    Try Different Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Story Framework Selection</CardTitle>
                <CardDescription>Choose a narrative structure for your data story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {storyTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-semibold mb-1">{template.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {template.structure.map((step, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {index + 1}. {step}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{template.example}"</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Story Prompts for Your Data:
                  </h4>
                  <ul className="space-y-1">
                    {dataSet.storyPrompts.map((prompt, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {prompt}
                      </li>
                    ))}
                  </ul>
                </div>

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
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Data Story</CardTitle>
                <CardDescription>
                  AI-generated narrative based on your data and chosen framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Your Data Visualization:</h4>
                    <div className="bg-muted/20 p-4 rounded-lg h-64">
                      {renderChart()}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Your Story:</h4>
                    {storyTemplates.find(t => t.id === selectedTemplate)?.structure.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="space-y-2"
                      >
                        <Badge variant="outline" className="text-xs">
                          {section}
                        </Badge>
                        <p className="text-sm p-3 bg-primary/5 rounded-lg border border-primary/20">
                          {storyDraft[index]}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>Success!</strong> You've transformed raw data into a compelling narrative that connects numbers to human impact.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="w-full"
                >
                  Complete Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Data Story Master!</h2>
              <p className="text-lg">You've learned to make numbers speak to the heart</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Your Storytelling Score:</h3>
                  <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="w-full max-w-xs mx-auto h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="space-y-2">
                    <Eye className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Data Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      Find meaningful patterns in complex data
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Heart className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Human Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Link numbers to real people and impact
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Narrative Power</h4>
                    <p className="text-sm text-muted-foreground">
                      Craft stories that inspire action
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
};

export default DavidDataStoryteller;