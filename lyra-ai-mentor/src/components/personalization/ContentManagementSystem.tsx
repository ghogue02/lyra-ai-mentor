import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw,
  BarChart3,
  TrendingUp,
  Filter,
  Sort,
  Save,
  Star,
  Tag,
  Clock,
  Users,
  Target,
  Settings,
  Zap,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Archive,
  Eye,
  FileText,
  Folder,
  FolderOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AIService } from '@/services/aiService';

// Content management types
interface ContentVariant {
  id: string;
  name: string;
  type: 'template' | 'example' | 'strategy' | 'snippet';
  category: string;
  content: string;
  metadata: {
    audience: string;
    purpose: string;
    goal: string;
    context: string;
    tone: string;
    length: string;
    difficulty: string;
    estimatedTime: string;
  };
  personalizationFields: PersonalizationField[];
  performance: {
    usage: number;
    rating: number;
    engagement: number;
    conversion: number;
    lastUsed: Date;
  };
  tags: string[];
  version: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  aiGenerated: boolean;
  parentId?: string;
}

interface PersonalizationField {
  id: string;
  name: string;
  placeholder: string;
  description: string;
  required: boolean;
  type: 'text' | 'number' | 'date' | 'email' | 'select';
  options?: string[];
  defaultValue?: string;
  validationRule?: string;
}

interface ContentFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  children: ContentFolder[];
  contentCount: number;
  lastModified: Date;
  color: string;
}

interface PerformanceAnalytics {
  totalVariants: number;
  averageRating: number;
  totalUsage: number;
  topPerformers: ContentVariant[];
  usageTrends: { date: string; usage: number; engagement: number }[];
  categoryBreakdown: { category: string; count: number; performance: number }[];
}

interface ContentManagementSystemProps {
  onContentSelect?: (variant: ContentVariant) => void;
  userRole?: 'admin' | 'editor' | 'viewer';
  organizationId?: string;
}

// Mock data for demonstration
const mockContentVariants: ContentVariant[] = [
  {
    id: 'variant-1',
    name: 'Major Donor Thank You Email',
    type: 'template',
    category: 'stewardship',
    content: `Dear {{firstName}},

Thank you for your generous gift of {{giftAmount}} to {{organizationName}}. Your support makes a meaningful difference in our work.

Because of donors like you, we've been able to {{recentAccomplishment}}. Your specific contribution helped {{personalImpact}}.

I would love to share more about how your gift is creating change. Would you be available for a brief call in the coming weeks?

With gratitude,
{{senderName}}`,
    metadata: {
      audience: 'major-donors',
      purpose: 'stewardship',
      goal: 'thank',
      context: 'post-gift',
      tone: 'grateful',
      length: 'medium',
      difficulty: 'easy',
      estimatedTime: '10 minutes'
    },
    personalizationFields: [
      {
        id: 'firstName',
        name: 'First Name',
        placeholder: '{{firstName}}',
        description: 'Donor\'s first name',
        required: true,
        type: 'text'
      },
      {
        id: 'giftAmount',
        name: 'Gift Amount',
        placeholder: '{{giftAmount}}',
        description: 'Recent gift amount',
        required: true,
        type: 'text'
      },
      {
        id: 'organizationName',
        name: 'Organization Name',
        placeholder: '{{organizationName}}',
        description: 'Your organization name',
        required: true,
        type: 'text'
      }
    ],
    performance: {
      usage: 156,
      rating: 4.7,
      engagement: 85,
      conversion: 12,
      lastUsed: new Date('2024-01-15')
    },
    tags: ['email', 'stewardship', 'major-donors', 'gratitude'],
    version: 2,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'Sarah Johnson',
    aiGenerated: false
  },
  {
    id: 'variant-2',
    name: 'Monthly Donor Impact Newsletter',
    type: 'template',
    category: 'engagement',
    content: `Hello {{firstName}},

Your monthly gift of {{monthlyAmount}} continues to create positive change every day. This month, supporters like you helped us {{monthlyImpact}}.

IMPACT SPOTLIGHT:
{{spotlightStory}}

COMING UP:
{{upcomingEvents}}

Thank you for being a steady force for good in our community.

The {{organizationName}} Team`,
    metadata: {
      audience: 'monthly-donors',
      purpose: 'engagement',
      goal: 'retain',
      context: 'routine',
      tone: 'warm',
      length: 'short',
      difficulty: 'easy',
      estimatedTime: '15 minutes'
    },
    personalizationFields: [
      {
        id: 'firstName',
        name: 'First Name',
        placeholder: '{{firstName}}',
        description: 'Donor\'s first name',
        required: true,
        type: 'text'
      },
      {
        id: 'monthlyAmount',
        name: 'Monthly Amount',
        placeholder: '{{monthlyAmount}}',
        description: 'Monthly gift amount',
        required: true,
        type: 'text'
      }
    ],
    performance: {
      usage: 89,
      rating: 4.3,
      engagement: 72,
      conversion: 8,
      lastUsed: new Date('2024-01-14')
    },
    tags: ['newsletter', 'monthly-donors', 'engagement', 'impact'],
    version: 1,
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    createdBy: 'Mike Chen',
    aiGenerated: true
  }
];

const mockFolders: ContentFolder[] = [
  {
    id: 'folder-1',
    name: 'Email Templates',
    description: 'All email communication templates',
    children: [],
    contentCount: 24,
    lastModified: new Date('2024-01-15'),
    color: 'blue'
  },
  {
    id: 'folder-2',
    name: 'Fundraising',
    description: 'Fundraising-related content',
    children: [],
    contentCount: 18,
    lastModified: new Date('2024-01-12'),
    color: 'green'
  },
  {
    id: 'folder-3',
    name: 'Stewardship',
    description: 'Donor stewardship materials',
    children: [],
    contentCount: 12,
    lastModified: new Date('2024-01-10'),
    color: 'purple'
  }
];

export const ContentManagementSystem: React.FC<ContentManagementSystemProps> = ({
  onContentSelect,
  userRole = 'editor',
  organizationId
}) => {
  const [contentVariants, setContentVariants] = useState<ContentVariant[]>(mockContentVariants);
  const [folders, setFolders] = useState<ContentFolder[]>(mockFolders);
  const [selectedVariant, setSelectedVariant] = useState<ContentVariant | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    difficulty: 'all',
    rating: 'all'
  });
  const [sortBy, setSortBy] = useState('usage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Partial<ContentVariant>>({});
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const aiService = AIService.getInstance();

  // Filter and sort content variants
  const filteredVariants = useMemo(() => {
    let filtered = contentVariants.filter(variant => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!variant.name.toLowerCase().includes(query) && 
            !variant.content.toLowerCase().includes(query) &&
            !variant.tags.some(tag => tag.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Type filter
      if (filterOptions.type !== 'all' && variant.type !== filterOptions.type) {
        return false;
      }

      // Category filter
      if (filterOptions.category !== 'all' && variant.category !== filterOptions.category) {
        return false;
      }

      // Status filter
      if (filterOptions.status !== 'all' && variant.status !== filterOptions.status) {
        return false;
      }

      // Difficulty filter
      if (filterOptions.difficulty !== 'all' && variant.metadata.difficulty !== filterOptions.difficulty) {
        return false;
      }

      // Rating filter
      if (filterOptions.rating !== 'all') {
        const minRating = parseInt(filterOptions.rating);
        if (variant.performance.rating < minRating) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'usage':
          comparison = a.performance.usage - b.performance.usage;
          break;
        case 'rating':
          comparison = a.performance.rating - b.performance.rating;
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [contentVariants, searchQuery, filterOptions, sortBy, sortOrder]);

  // Calculate analytics
  useEffect(() => {
    const calculateAnalytics = () => {
      const totalVariants = contentVariants.length;
      const averageRating = contentVariants.reduce((sum, v) => sum + v.performance.rating, 0) / totalVariants;
      const totalUsage = contentVariants.reduce((sum, v) => sum + v.performance.usage, 0);
      
      const topPerformers = [...contentVariants]
        .sort((a, b) => (b.performance.rating * b.performance.usage) - (a.performance.rating * a.performance.usage))
        .slice(0, 5);

      // Mock trends data
      const usageTrends = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usage: Math.floor(Math.random() * 50) + 20,
        engagement: Math.floor(Math.random() * 30) + 60
      }));

      const categoryBreakdown = [...new Set(contentVariants.map(v => v.category))].map(category => {
        const categoryVariants = contentVariants.filter(v => v.category === category);
        return {
          category,
          count: categoryVariants.length,
          performance: categoryVariants.reduce((sum, v) => sum + v.performance.rating, 0) / categoryVariants.length
        };
      });

      setAnalytics({
        totalVariants,
        averageRating,
        totalUsage,
        topPerformers,
        usageTrends,
        categoryBreakdown
      });
    };

    calculateAnalytics();
  }, [contentVariants]);

  // Handle variant selection
  const handleVariantSelect = (variant: ContentVariant) => {
    setSelectedVariant(variant);
    if (onContentSelect) {
      onContentSelect(variant);
    }
  };

  // Handle variant creation/editing
  const handleSaveVariant = () => {
    if (isEditMode && selectedVariant) {
      // Update existing variant
      setContentVariants(prev => prev.map(v => 
        v.id === selectedVariant.id 
          ? { ...v, ...editingVariant, updatedAt: new Date() }
          : v
      ));
    } else {
      // Create new variant
      const newVariant: ContentVariant = {
        id: `variant-${Date.now()}`,
        name: editingVariant.name || 'New Variant',
        type: editingVariant.type || 'template',
        category: editingVariant.category || 'general',
        content: editingVariant.content || '',
        metadata: editingVariant.metadata || {
          audience: 'all',
          purpose: 'general',
          goal: 'engage',
          context: 'general',
          tone: 'professional',
          length: 'medium',
          difficulty: 'intermediate',
          estimatedTime: '15 minutes'
        },
        personalizationFields: editingVariant.personalizationFields || [],
        performance: {
          usage: 0,
          rating: 0,
          engagement: 0,
          conversion: 0,
          lastUsed: new Date()
        },
        tags: editingVariant.tags || [],
        version: 1,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Current User',
        aiGenerated: false
      };
      
      setContentVariants(prev => [...prev, newVariant]);
    }

    setIsEditMode(false);
    setEditingVariant({});
    setIsCreateDialogOpen(false);
  };

  // Generate AI variant
  const generateAIVariant = async (prompt: string) => {
    setIsGeneratingAI(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Generate a nonprofit communication template based on this request: ${prompt}

        Include:
        1. Template name
        2. Content with personalization placeholders like {{firstName}}, {{organizationName}}, etc.
        3. Suggested personalization fields
        4. Appropriate metadata (audience, purpose, goal, etc.)

        Format as JSON with these fields: name, content, personalizationFields, metadata, tags`,
        context: "You are an expert in nonprofit communications and personalization.",
        temperature: 0.7
      });

      // Parse and create new variant
      try {
        const aiData = JSON.parse(response.content);
        const newVariant: ContentVariant = {
          id: `ai-variant-${Date.now()}`,
          name: aiData.name || 'AI Generated Template',
          type: 'template',
          category: aiData.metadata?.purpose || 'general',
          content: aiData.content || '',
          metadata: {
            audience: aiData.metadata?.audience || 'all',
            purpose: aiData.metadata?.purpose || 'general',
            goal: aiData.metadata?.goal || 'engage',
            context: aiData.metadata?.context || 'general',
            tone: aiData.metadata?.tone || 'professional',
            length: aiData.metadata?.length || 'medium',
            difficulty: 'intermediate',
            estimatedTime: '15 minutes'
          },
          personalizationFields: aiData.personalizationFields || [],
          performance: {
            usage: 0,
            rating: 0,
            engagement: 0,
            conversion: 0,
            lastUsed: new Date()
          },
          tags: aiData.tags || [],
          version: 1,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'AI Assistant',
          aiGenerated: true
        };

        setContentVariants(prev => [...prev, newVariant]);
        setSelectedVariant(newVariant);
      } catch (parseError) {
        console.warn('Failed to parse AI response, creating basic template');
      }
    } catch (error) {
      console.error('Error generating AI variant:', error);
    }
    setIsGeneratingAI(false);
  };

  // Handle variant deletion
  const handleDeleteVariant = (variantId: string) => {
    setContentVariants(prev => prev.filter(v => v.id !== variantId));
    if (selectedVariant?.id === variantId) {
      setSelectedVariant(null);
    }
  };

  // Handle variant duplication
  const handleDuplicateVariant = (variant: ContentVariant) => {
    const duplicated: ContentVariant = {
      ...variant,
      id: `variant-${Date.now()}`,
      name: `${variant.name} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      performance: {
        usage: 0,
        rating: 0,
        engagement: 0,
        conversion: 0,
        lastUsed: new Date()
      }
    };
    
    setContentVariants(prev => [...prev, duplicated]);
  };

  // Export variants
  const exportVariants = () => {
    const exportData = {
      variants: filteredVariants,
      exportDate: new Date().toISOString(),
      organization: organizationId
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-variants-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Database className="w-6 h-6" />
            Content Management System
          </h1>
          <p className="text-muted-foreground">
            Manage, organize, and optimize your content templates and variations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole !== 'viewer' && (
            <>
              <Button variant="outline" onClick={exportVariants}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Content Variant</DialogTitle>
                    <DialogDescription>
                      Create a new template, example, or content snippet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={editingVariant.name || ''}
                          onChange={(e) => setEditingVariant(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Content variant name"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={editingVariant.type || 'template'}
                          onValueChange={(value) => setEditingVariant(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="template">Template</SelectItem>
                            <SelectItem value="example">Example</SelectItem>
                            <SelectItem value="strategy">Strategy</SelectItem>
                            <SelectItem value="snippet">Snippet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={editingVariant.content || ''}
                        onChange={(e) => setEditingVariant(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter your content here... Use {{fieldName}} for personalization"
                        className="min-h-32"
                      />
                    </div>

                    <div>
                      <Label>AI Generation Prompt</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Describe what you want to create..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              generateAIVariant(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          disabled={isGeneratingAI}
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            if (input.value) {
                              generateAIVariant(input.value);
                              input.value = '';
                            }
                          }}
                        >
                          {isGeneratingAI ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveVariant}>
                        Create Variant
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </motion.div>

      {/* Analytics Dashboard */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analytics.totalVariants}</div>
                <div className="text-sm text-muted-foreground">Total Variants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analytics.averageRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analytics.totalUsage}</div>
                <div className="text-sm text-muted-foreground">Total Usage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analytics.topPerformers.length}</div>
                <div className="text-sm text-muted-foreground">Top Performers</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-semibold mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analytics.categoryBreakdown.map((cat, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{cat.category}</span>
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Rating: {cat.performance.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Folders and Filters */}
        <div className="space-y-4">
          {/* Folders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFolder('all')}
                  className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                    selectedFolder === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  All Content
                  <Badge variant="outline" className="ml-auto">
                    {contentVariants.length}
                  </Badge>
                </button>
                
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                      selectedFolder === folder.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    {folder.name}
                    <Badge variant="outline" className="ml-auto">
                      {folder.contentCount}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={filterOptions.type}
                  onValueChange={(value) => setFilterOptions(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="template">Templates</SelectItem>
                    <SelectItem value="example">Examples</SelectItem>
                    <SelectItem value="strategy">Strategies</SelectItem>
                    <SelectItem value="snippet">Snippets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={filterOptions.status}
                  onValueChange={(value) => setFilterOptions(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Minimum Rating</Label>
                <Select
                  value={filterOptions.rating}
                  onValueChange={(value) => setFilterOptions(prev => ({ ...prev, rating: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sort By</Label>
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="usage">Usage</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="updated">Updated</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    <Sort className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Content Variants ({filteredVariants.length})
            </h2>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View: Grid
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredVariants.map((variant) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedVariant?.id === variant.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'hover:border-muted-foreground hover:shadow-sm'
                  }`}
                  onClick={() => handleVariantSelect(variant)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {variant.type === 'template' && <FileText className="w-4 h-4" />}
                          {variant.type === 'example' && <Star className="w-4 h-4" />}
                          {variant.type === 'strategy' && <Target className="w-4 h-4" />}
                          {variant.type === 'snippet' && <Tag className="w-4 h-4" />}
                          
                          <Badge variant="outline">{variant.type}</Badge>
                          <Badge variant={variant.status === 'active' ? 'default' : 'secondary'}>
                            {variant.status}
                          </Badge>
                          {variant.aiGenerated && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        
                        <CardTitle className="text-lg">{variant.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {variant.content.substring(0, 150)}...
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {userRole !== 'viewer' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateVariant(variant);
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingVariant(variant);
                                setIsEditMode(true);
                                setIsCreateDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVariant(variant.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {variant.metadata.audience}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {variant.metadata.purpose}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {variant.metadata.estimatedTime}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{variant.performance.usage}</div>
                          <div className="text-xs text-muted-foreground">Usage</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{variant.performance.rating}</div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{variant.performance.engagement}%</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1">
                          {variant.tags.slice(0, 4).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {variant.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{variant.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredVariants.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create new content.
                </p>
                {userRole !== 'viewer' && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Selected Content Details */}
      {selectedVariant && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedVariant.name}</CardTitle>
                <CardDescription>
                  {selectedVariant.type} • {selectedVariant.category} • v{selectedVariant.version}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {userRole !== 'viewer' && (
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="p-4 bg-muted/50 rounded border">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {selectedVariant.content}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="fields" className="space-y-4">
                <div className="grid gap-4">
                  {selectedVariant.personalizationFields.map((field) => (
                    <div key={field.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{field.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{field.type}</Badge>
                          {field.required && <Badge variant="default">Required</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {field.description}
                      </p>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {field.placeholder}
                      </code>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{selectedVariant.performance.usage}</div>
                    <div className="text-sm text-blue-600">Times Used</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{selectedVariant.performance.rating}</div>
                    <div className="text-sm text-green-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{selectedVariant.performance.engagement}%</div>
                    <div className="text-sm text-purple-600">Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">{selectedVariant.performance.conversion}%</div>
                    <div className="text-sm text-orange-600">Conversion</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Usage History</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Last used: {selectedVariant.performance.lastUsed.toLocaleDateString()}
                    </div>
                    <Progress value={(selectedVariant.performance.usage / 200) * 100} className="h-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Audience</Label>
                      <div className="text-sm">{selectedVariant.metadata.audience}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Purpose</Label>
                      <div className="text-sm">{selectedVariant.metadata.purpose}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Goal</Label>
                      <div className="text-sm">{selectedVariant.metadata.goal}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Context</Label>
                      <div className="text-sm">{selectedVariant.metadata.context}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Tone</Label>
                      <div className="text-sm">{selectedVariant.metadata.tone}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Length</Label>
                      <div className="text-sm">{selectedVariant.metadata.length}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Difficulty</Label>
                      <div className="text-sm">{selectedVariant.metadata.difficulty}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Time</Label>
                      <div className="text-sm">{selectedVariant.metadata.estimatedTime}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="text-sm">{selectedVariant.createdAt.toLocaleDateString()} by {selectedVariant.createdBy}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <div className="text-sm">{selectedVariant.updatedAt.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVariant.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManagementSystem;