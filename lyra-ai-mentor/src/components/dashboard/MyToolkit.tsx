import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Lock, 
  Unlock,
  Star,
  Trophy,
  Sparkles,
  Mail,
  FileText,
  BarChart3,
  Workflow,
  Users,
  Share2,
  BookOpen,
  Presentation,
  Grid3X3,
  List,
  CheckCircle2,
  TrendingUp,
  Zap,
  Target,
  Award,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { PaceEmailCard } from './PaceEmailCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToolkitService } from '@/services/toolkitService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Tool categories with icons and gradients
const toolCategories = [
  { 
    id: 'email', 
    name: 'Email Templates', 
    icon: Mail,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Professional email templates for every occasion'
  },
  { 
    id: 'grants', 
    name: 'Grant Proposals', 
    icon: FileText,
    gradient: 'from-purple-500 to-pink-500',
    description: 'Winning grant proposal templates and guides'
  },
  { 
    id: 'data', 
    name: 'Data Visualizations', 
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-500',
    description: 'Interactive charts and data presentation tools'
  },
  { 
    id: 'automation', 
    name: 'Automation Workflows', 
    icon: Workflow,
    gradient: 'from-orange-500 to-red-500',
    description: 'Time-saving automation templates'
  },
  { 
    id: 'change', 
    name: 'Change Management', 
    icon: Users,
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Tools for managing organizational change'
  },
  { 
    id: 'social', 
    name: 'Social Media Content', 
    icon: Share2,
    gradient: 'from-pink-500 to-rose-500',
    description: 'Engaging social media templates'
  },
  { 
    id: 'training', 
    name: 'Training Materials', 
    icon: BookOpen,
    gradient: 'from-teal-500 to-cyan-500',
    description: 'Educational resources and training templates'
  },
  { 
    id: 'reports', 
    name: 'Reports & Presentations', 
    icon: Presentation,
    gradient: 'from-amber-500 to-orange-500',
    description: 'Professional report and presentation templates'
  }
];

// Tool interface
interface Tool {
  id: number;
  name: string;
  category: string;
  unlocked?: boolean;
  downloads?: number;
  rating?: number;
  new?: boolean;
  file_type?: string;
  description?: string;
  metadata?: string;
  created_at?: string;
  download_count?: number;
  average_rating?: number;
  user_unlock?: {
    unlocked_at: string;
    download_count: number;
  };
}

// Sample tools data (in production, this would come from your database)
const sampleTools: Tool[] = [
  // Email Templates
  { id: 1, name: 'Welcome Email Series', category: 'email', unlocked: true, downloads: 1234, rating: 4.8, new: false },
  { id: 2, name: 'Customer Feedback Request', category: 'email', unlocked: true, downloads: 987, rating: 4.6, new: false },
  { id: 3, name: 'Product Launch Announcement', category: 'email', unlocked: false, downloads: 0, rating: 0, new: true },
  { id: 4, name: 'Newsletter Template Pack', category: 'email', unlocked: false, downloads: 0, rating: 0, new: true },
  // PACE Email Examples
  { 
    id: 22, 
    name: 'PACE Email: Team Update', 
    category: 'email', 
    file_type: 'pace_email',
    description: 'AI-powered email for team communication',
    metadata: JSON.stringify({
      pace_data: {
        purpose: 'inform_educate',
        audience: { 
          label: 'Team Members', 
          description: 'Your direct team',
          contextualDescription: 'Team members who need project updates'
        },
        prompt: 'Write an email to update the team on project progress',
        email_content: 'Subject: Weekly Project Update\n\nHi team,\n\nI wanted to share our progress this week...',
        why_this_works: 'Clear subject line, structured updates, and action items',
        framework: { name: 'SCRAP' },
        created_at: new Date().toISOString()
      }
    }),
    created_at: new Date().toISOString(),
    download_count: 15,
    average_rating: 4.9,
    user_unlock: {
      unlocked_at: new Date().toISOString(),
      download_count: 3
    }
  },
  { 
    id: 23, 
    name: 'PACE Email: Client Proposal', 
    category: 'email', 
    file_type: 'pace_email',
    description: 'Persuasive email for client engagement',
    metadata: JSON.stringify({
      pace_data: {
        purpose: 'persuade_convince',
        audience: { 
          label: 'Potential Client', 
          description: 'Business decision maker',
          contextualDescription: 'Executive evaluating service providers'
        },
        prompt: 'P - Purpose: I need to write an email to invite someone to support.\n\nA - Audience: My audience is a potential client - someone who is evaluating service providers and looking for solutions that align with their values. They care most about measurable impact, sustainable practices, and partnerships that make a difference.\n\nC - Content: Use the AIDA Framework (Attention → Interest → Desire → Action) to structure your email.\n\nE - Execute: Please keep it concise, personal, and action-oriented with a clear next step.',
        email_content: 'Subject: Transforming Your Business Operations with Purpose-Driven Solutions\n\nDear [Client Name],\n\nI noticed your recent expansion into sustainable practices, and I\'m inspired by your commitment to making a positive impact in your industry.\n\nOur organization has helped 50+ companies like yours integrate purpose-driven operations that not only reduce costs by 30% but also increase employee engagement and customer loyalty. For example, when we partnered with GreenTech Solutions, they saw a 45% increase in customer retention within six months.\n\nWhat sets us apart is our holistic approach - we don\'t just implement systems; we align them with your values and mission. Our team includes experts in sustainable operations, change management, and impact measurement.\n\nI\'d love to show you how we could help amplify your impact. Would you be available for a 30-minute call next week to explore how our services could support your expansion goals?\n\nBest regards,\n[Your Name]',
        why_this_works: 'Personalized opening, clear value proposition, specific benefits',
        framework: { name: 'AIDA' },
        created_at: new Date().toISOString()
      }
    }),
    created_at: new Date().toISOString(),
    download_count: 28,
    average_rating: 4.7,
    user_unlock: {
      unlocked_at: new Date(Date.now() - 86400000).toISOString(),
      download_count: 5
    }
  },
  { 
    id: 24, 
    name: 'PACE Email: Stakeholder Support', 
    category: 'email', 
    file_type: 'pace_email',
    description: 'Request support from key stakeholders',
    unlocked: false,
    metadata: JSON.stringify({
      pace_data: {
        purpose: 'request_support',
        audience: { 
          label: 'Senior Leadership', 
          description: 'C-suite executives',
          contextualDescription: 'Leaders who can approve resources'
        },
        prompt: 'P - Purpose: I need to write an email to ask for help you need.\n\nA - Audience: My audience is senior leadership - c-suite executives who hold the power to approve resources and make strategic decisions. They care most about ROI, organizational impact, and strategic alignment.\n\nC - Content: Use the STAR Framework (Situation → Task → Action → Result) to structure your email.\n\nE - Execute: Please keep it concise, personal, and action-oriented with a clear next step.',
        email_content: 'Subject: Budget Request: Digital Transformation Initiative - $50K Investment for 300% ROI\n\nDear Leadership Team,\n\nSituation: Our current manual processes are costing us 20 hours per week in staff time and causing delays in service delivery to 200+ families.\n\nTask: We need to implement a digital transformation initiative that will automate key workflows and improve our impact measurement capabilities.\n\nAction: I\'ve researched and vetted three solutions, with TechForGood emerging as the best fit for our needs. Their platform would:\n• Automate 80% of our manual data entry\n• Provide real-time impact dashboards for board reporting\n• Integrate seamlessly with our existing systems\n• Save 15 hours/week in staff time (redirected to direct service)\n\nResult: Based on similar implementations, we project:\n• 300% ROI within 18 months\n• 50% reduction in administrative costs\n• 40% increase in families served\n• Enhanced grant competitiveness with better data\n\nThe total investment needed is $50,000, which includes implementation, training, and first-year licensing.\n\nCould we schedule a 30-minute meeting this week to review the full proposal and ROI analysis? I\'m available Tuesday 2-4 PM or Thursday anytime.\n\nThank you for considering this investment in our mission.\n\nBest regards,\n[Your Name]',
        why_this_works: 'Clear ask upfront, data-driven justification, specific next steps',
        framework: { name: 'STAR' },
        created_at: new Date().toISOString()
      }
    }),
    created_at: new Date().toISOString(),
    download_count: 0,
    average_rating: 0,
    new: true
  },
  
  // Grant Proposals
  { id: 5, name: 'Federal Grant Template', category: 'grants', unlocked: true, downloads: 456, rating: 4.9, new: false },
  { id: 6, name: 'Foundation Grant Proposal', category: 'grants', unlocked: false, downloads: 0, rating: 0, new: true },
  { id: 7, name: 'Research Grant Blueprint', category: 'grants', unlocked: false, downloads: 0, rating: 0, new: false },
  
  // Data Visualizations
  { id: 8, name: 'Interactive Dashboard Template', category: 'data', unlocked: true, downloads: 789, rating: 4.7, new: false },
  { id: 9, name: 'KPI Tracking Charts', category: 'data', unlocked: true, downloads: 654, rating: 4.5, new: false },
  { id: 10, name: 'Annual Report Visuals', category: 'data', unlocked: false, downloads: 0, rating: 0, new: true },
  
  // Automation Workflows
  { id: 11, name: 'Email Automation Sequence', category: 'automation', unlocked: true, downloads: 543, rating: 4.8, new: false },
  { id: 12, name: 'Social Media Scheduler', category: 'automation', unlocked: false, downloads: 0, rating: 0, new: true },
  { id: 13, name: 'Lead Nurturing Workflow', category: 'automation', unlocked: false, downloads: 0, rating: 0, new: false },
  
  // Change Management
  { id: 14, name: 'Change Impact Assessment', category: 'change', unlocked: true, downloads: 321, rating: 4.6, new: false },
  { id: 15, name: 'Stakeholder Communication Plan', category: 'change', unlocked: false, downloads: 0, rating: 0, new: true },
  
  // Social Media
  { id: 16, name: 'Instagram Story Templates', category: 'social', unlocked: true, downloads: 1567, rating: 4.9, new: false },
  { id: 17, name: 'LinkedIn Post Calendar', category: 'social', unlocked: false, downloads: 0, rating: 0, new: true },
  
  // Training Materials
  { id: 18, name: 'Onboarding Checklist', category: 'training', unlocked: true, downloads: 876, rating: 4.7, new: false },
  { id: 19, name: 'Interactive Training Modules', category: 'training', unlocked: false, downloads: 0, rating: 0, new: true },
  
  // Reports & Presentations
  { id: 20, name: 'Executive Summary Template', category: 'reports', unlocked: true, downloads: 432, rating: 4.8, new: false },
  { id: 21, name: 'Pitch Deck Pro', category: 'reports', unlocked: false, downloads: 0, rating: 0, new: true }
];

// Achievement data
// Achievement definitions will be calculated dynamically

export const MyToolkit = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tools, setTools] = useState<Tool[]>([]);
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch toolkit data from database
  useEffect(() => {
    const fetchToolkitData = async () => {
      if (!user) {
        // If no user, show sample data
        setTools(sampleTools);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesData = await ToolkitService.getCategories();
        setCategories(categoriesData);
        
        // Fetch user's toolkit items
        const itemsData = await ToolkitService.getToolkitItems(user.id);
        
        // Combine real data with sample data for categories that don't have items yet
        const realToolsMap = new Map();
        
        // Process real items
        itemsData.forEach((item: any) => {
          const category = categoriesData.find((cat: any) => cat.id === item.category_id);
          if (category) {
            realToolsMap.set(item.id, {
              id: item.id,
              name: item.name,
              category: category.category_key,
              description: item.description || '',
              unlocked: !!item.user_unlock,
              downloads: item.user_unlock?.download_count || 0,
              premium: item.is_premium,
              new: item.is_new,
              file_type: item.file_type,
              metadata: item.metadata,
              created_at: item.created_at,
              download_count: item.download_count,
              average_rating: item.average_rating,
              user_unlock: item.user_unlock
            });
          }
        });
        
        // If we have real data, use it; otherwise fall back to sample data
        if (realToolsMap.size > 0) {
          setTools(Array.from(realToolsMap.values()));
        } else {
          // No real data yet, show sample data
          setTools(sampleTools);
        }
        
      } catch (error) {
        console.error('Error fetching toolkit data:', error);
        toast.error('Failed to load toolkit data');
        // Fall back to sample data on error
        setTools(sampleTools);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolkitData();
  }, [user]);

  // Calculate statistics
  const totalTools = tools.length;
  const unlockedTools = tools.filter(t => t.unlocked).length;
  const progressPercentage = totalTools > 0 ? (unlockedTools / totalTools) * 100 : 0;
  
  // Calculate category diversity
  const unlockedCategories = new Set(tools.filter(t => t.unlocked).map(t => t.category)).size;
  const totalCategories = new Set(tools.map(t => t.category)).size;
  
  // Calculate tools per category for Master Collector achievement
  const categoryStats = toolCategories.map(cat => {
    const categoryTools = tools.filter(t => t.category === cat.id);
    const unlockedInCategory = categoryTools.filter(t => t.unlocked).length;
    return {
      category: cat.id,
      total: categoryTools.length,
      unlocked: unlockedInCategory,
      isComplete: categoryTools.length > 0 && unlockedInCategory === categoryTools.length
    };
  });
  
  const hasCompletedCategory = categoryStats.some(stat => stat.isComplete);
  
  // Dynamic achievements based on actual data
  const achievements = [
    { 
      id: 1, 
      name: 'First Tool Unlocked', 
      description: 'Downloaded your first tool', 
      icon: Star, 
      unlocked: unlockedTools >= 1, 
      color: 'text-yellow-500' 
    },
    { 
      id: 2, 
      name: 'Category Explorer', 
      description: 'Unlock tools from 3 different categories', 
      icon: Grid3X3, 
      unlocked: unlockedCategories >= 3, 
      color: 'text-blue-500',
      progress: unlockedCategories,
      total: 3
    },
    { 
      id: 3, 
      name: 'Power User', 
      description: 'Unlock 10 tools', 
      icon: Zap, 
      unlocked: unlockedTools >= 10, 
      color: 'text-purple-500', 
      progress: unlockedTools, 
      total: 10 
    },
    { 
      id: 4, 
      name: 'Master Collector', 
      description: 'Unlock all tools in a category', 
      icon: Trophy, 
      unlocked: hasCompletedCategory, 
      color: 'text-gold-500' 
    },
    { 
      id: 5, 
      name: 'Toolkit Legend', 
      description: 'Unlock 50% of all tools', 
      icon: Award, 
      unlocked: progressPercentage >= 50, 
      color: 'text-emerald-500', 
      progress: unlockedTools, 
      total: Math.ceil(totalTools * 0.5) 
    }
  ];

  // Filter tools based on category and search
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group tools by category for display
  const groupedTools = toolCategories.map(category => ({
    ...category,
    tools: filteredTools.filter(tool => tool.category === category.id)
  }));

  const handleUnlock = (toolId: number) => {
    // Simulate unlocking animation
    const tool = tools.find(t => t.id === toolId);
    if (!tool || tool.unlocked) return;

    // Update tool status
    setTools(prev => prev.map(t => 
      t.id === toolId ? { ...t, unlocked: true, downloads: 1 } : t
    ));

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Check for achievements after unlocking
    const updatedTools = tools.map(t => 
      t.id === toolId ? { ...t, unlocked: true } : t
    );
    const newUnlockedCount = updatedTools.filter(t => t.unlocked).length;
    const newUnlockedCategories = new Set(updatedTools.filter(t => t.unlocked).map(t => t.category)).size;
    
    // Check each achievement
    achievements.forEach((achievement, index) => {
      const wasUnlocked = achievement.unlocked;
      let isNowUnlocked = false;
      
      switch (achievement.id) {
        case 1: // First Tool
          isNowUnlocked = newUnlockedCount >= 1;
          break;
        case 2: // Category Explorer
          isNowUnlocked = newUnlockedCategories >= 3;
          break;
        case 3: // Power User
          isNowUnlocked = newUnlockedCount >= 10;
          break;
        case 4: // Master Collector
          const categoryOfTool = updatedTools.find(t => t.id === toolId)?.category;
          if (categoryOfTool) {
            const categoryTools = updatedTools.filter(t => t.category === categoryOfTool);
            const unlockedInCategory = categoryTools.filter(t => t.unlocked).length;
            isNowUnlocked = categoryTools.length > 0 && unlockedInCategory === categoryTools.length;
          }
          break;
        case 5: // Toolkit Legend
          const percentage = (newUnlockedCount / updatedTools.length) * 100;
          isNowUnlocked = percentage >= 50;
          break;
      }
      
      // Trigger achievement if it was just unlocked
      if (!wasUnlocked && isNowUnlocked) {
        triggerAchievement(achievement);
      }
    });
  };

  const triggerAchievement = (achievement: any) => {
    setShowAchievement(achievement);
    setTimeout(() => setShowAchievement(null), 5000);
  };

  const handleDownload = (tool: any) => {
    if (!tool.unlocked) return;
    
    // Simulate download
    console.log(`Downloading ${tool.name}...`);
    
    // Update download count
    setTools(prev => prev.map(t => 
      t.id === tool.id ? { ...t, downloads: t.downloads + 1 } : t
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-600">Loading your toolkit...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-4 z-50"
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("p-3 bg-white/20 rounded-full", showAchievement.color)}>
                  <showAchievement.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                  <p className="text-white/90">{showAchievement.name}</p>
                  <p className="text-sm text-white/70">{showAchievement.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100/50 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Toolkit</h2>
            <p className="text-gray-600">Collect and download powerful tools to enhance your AI journey</p>
          </div>
          
          {/* Progress Overview */}
          <div className="w-full lg:w-auto">
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Collection Progress</span>
                  <span className="text-2xl font-bold">{unlockedTools}/{totalTools}</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-white/30" />
                <p className="text-xs mt-2 text-white/80">
                  {progressPercentage.toFixed(0)}% Complete • {totalTools - unlockedTools} tools to unlock
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {toolCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            Your Achievements
          </CardTitle>
          <CardDescription>Unlock achievements by collecting and using tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all",
                  achievement.unlocked 
                    ? "bg-white border-amber-300 shadow-md" 
                    : "bg-gray-50 border-gray-200 opacity-60"
                )}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={cn(
                    "p-3 rounded-full",
                    achievement.unlocked ? "bg-amber-100" : "bg-gray-100"
                  )}>
                    <achievement.icon className={cn(
                      "w-6 h-6",
                      achievement.unlocked ? achievement.color : "text-gray-400"
                    )} />
                  </div>
                  <h4 className="font-semibold text-sm">{achievement.name}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <div className="w-full">
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs mt-1 text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </p>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid/List */}
      <div className="space-y-8">
        {groupedTools.map((category) => {
          if (category.tools.length === 0) return null;
          
          return (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-r text-white",
                  category.gradient
                )}>
                  <category.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.tools.map((tool) => (
                    tool.file_type === 'pace_email' ? (
                      <PaceEmailCard
                        key={tool.id}
                        item={tool}
                        isGridView={true}
                      />
                    ) : (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        onUnlock={handleUnlock}
                        onDownload={handleDownload}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {category.tools.map((tool) => (
                    tool.file_type === 'pace_email' ? (
                      <PaceEmailCard
                        key={tool.id}
                        item={tool}
                        isGridView={false}
                      />
                    ) : (
                      <ToolListItem
                        key={tool.id}
                        tool={tool}
                        onUnlock={handleUnlock}
                        onDownload={handleDownload}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tools found</h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter criteria to find the tools you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
    </TooltipProvider>
  );
};

// Tool Card Component
const ToolCard = ({ tool, onUnlock, onDownload }: any) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card className={cn(
        "h-full transition-all duration-300",
        tool.unlocked 
          ? "bg-white hover:shadow-xl" 
          : "bg-gray-50 border-gray-200"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              {tool.new && (
                <Badge variant="secondary" className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New
                </Badge>
              )}
            </div>
            {tool.unlocked ? (
              <Unlock className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tool.unlocked && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                {tool.rating}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {tool.downloads}
              </span>
            </div>
          )}
          
          <Button
            className={cn(
              "w-full",
              tool.unlocked 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            )}
            onClick={() => tool.unlocked ? onDownload(tool) : onUnlock(tool.id)}
          >
            {tool.unlocked ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Tool List Item Component
const ToolListItem = ({ tool, onUnlock, onDownload }: any) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all",
        tool.unlocked 
          ? "bg-white hover:shadow-md" 
          : "bg-gray-50 border-gray-200"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          tool.unlocked ? "bg-purple-100" : "bg-gray-100"
        )}>
          {tool.unlocked ? (
            <Unlock className="w-5 h-5 text-purple-600" />
          ) : (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            {tool.name}
            {tool.new && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
          </h4>
          {tool.unlocked && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                {tool.rating}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {tool.downloads} downloads
              </span>
            </div>
          )}
        </div>
      </div>
      
      <Button
        className={cn(
          tool.unlocked 
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        )}
        onClick={() => tool.unlocked ? onDownload(tool) : onUnlock(tool.id)}
      >
        {tool.unlocked ? (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Unlock
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default MyToolkit;