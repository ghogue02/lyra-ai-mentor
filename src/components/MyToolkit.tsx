import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, Download, Star, Lock, Unlock, Grid3X3, Zap, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ToolkitService, ToolkitCategory, ToolkitItem, ToolkitAchievement } from '@/services/toolkitService';
import { useEnsureToolkitData } from '@/hooks/useEnsureToolkitData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ToolkitStats {
  totalTools: number;
  unlockedTools: number;
  totalDownloads: number;
  categoriesExplored: number;
  averageRating: number;
}

const CategoryCard: React.FC<{ 
  category: ToolkitCategory; 
  itemCount: number; 
  unlockedCount: number; 
  onClick: () => void; 
}> = ({ category, itemCount, unlockedCount, onClick }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/20"
    onClick={onClick}
  >
    <CardHeader className="pb-3">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-2xl mb-2`}>
        {category.icon === 'Mail' && '📧'}
        {category.icon === 'FileText' && '📄'}
        {category.icon === 'BarChart3' && '📊'}
        {category.icon === 'Workflow' && '⚙️'}
        {category.icon === 'Users' && '👥'}
        {category.icon === 'Share2' && '🔗'}
        {category.icon === 'BookOpen' && '📚'}
        {category.icon === 'Presentation' && '📽️'}
      </div>
      <CardTitle className="text-lg">{category.name}</CardTitle>
      <p className="text-sm text-muted-foreground">{category.description}</p>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{itemCount} tools</Badge>
          <Badge variant="outline">{unlockedCount} unlocked</Badge>
        </div>
        <div className="w-16">
          <Progress value={itemCount > 0 ? (unlockedCount / itemCount) * 100 : 0} className="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ToolkitItemCard: React.FC<{ 
  item: ToolkitItem; 
  onUnlock: (itemId: string) => void; 
  onDownload: (itemId: string) => void; 
}> = ({ item, onUnlock, onDownload }) => {
  const isUnlocked = !!item.user_unlock;
  const downloadCount = item.user_unlock?.download_count || 0;

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      isUnlocked ? "border-green-200 bg-green-50/50" : "border-gray-200"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              {item.is_new && <Badge variant="secondary">New</Badge>}
              {item.is_featured && <Badge variant="default">Featured</Badge>}
              {item.is_premium && <Badge variant="destructive">Premium</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="text-right">
            {isUnlocked ? (
              <Unlock className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {item.download_count}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {item.average_rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <Button 
                size="sm" 
                onClick={() => onDownload(item.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download {downloadCount > 0 && `(${downloadCount})`}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onUnlock(item.id)}
              >
                <Unlock className="w-4 h-4 mr-1" />
                Unlock
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementCard: React.FC<{ achievement: ToolkitAchievement }> = ({ achievement }) => {
  const isUnlocked = achievement.user_progress?.is_unlocked || false;
  const progress = achievement.user_progress?.current_value || 0;
  const target = achievement.user_progress?.target_value || achievement.criteria_value || 1;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isUnlocked ? "border-yellow-200 bg-yellow-50/50" : "border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">
            {achievement.icon === 'Star' && '⭐'}
            {achievement.icon === 'Grid3X3' && '🔍'}
            {achievement.icon === 'Zap' && '⚡'}
          </div>
          <div className="flex-1">
            <h4 className={cn(
              "font-semibold mb-1",
              isUnlocked ? "text-yellow-800" : "text-gray-700"
            )}>
              {achievement.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
            {!isUnlocked && (
              <div className="space-y-1">
                <Progress value={(progress / target) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progress} / {target}
                </p>
              </div>
            )}
            {isUnlocked && achievement.user_progress?.unlocked_at && (
              <p className="text-xs text-muted-foreground">
                Unlocked {new Date(achievement.user_progress.unlocked_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <Badge variant={isUnlocked ? "default" : "secondary"}>
            {achievement.achievement_tier}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export const MyToolkit: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoading: isEnsuring, error: ensureError } = useEnsureToolkitData();
  
  const [categories, setCategories] = useState<ToolkitCategory[]>([]);
  const [items, setItems] = useState<ToolkitItem[]>([]);
  const [achievements, setAchievements] = useState<ToolkitAchievement[]>([]);
  const [stats, setStats] = useState<ToolkitStats>({
    totalTools: 0,
    unlockedTools: 0,
    totalDownloads: 0,
    categoriesExplored: 0,
    averageRating: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isEnsuring && !ensureError) {
      loadData();
    }
  }, [isEnsuring, ensureError, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesData = await ToolkitService.getCategories();
      setCategories(categoriesData);

      // Load items
      const itemsData = await ToolkitService.getToolkitItems(user?.id);
      setItems(itemsData);

      // Load achievements if user is logged in
      if (user) {
        const achievementsData = await ToolkitService.getUserAchievements(user.id);
        setAchievements(achievementsData);

        // Load stats
        const statsData = await ToolkitService.getUserToolkitStats(user.id);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading toolkit data:', error);
      toast({
        title: "Error",
        description: "Failed to load toolkit data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to unlock toolkit items.",
        variant: "default"
      });
      return;
    }

    try {
      await ToolkitService.unlockToolkitItem(user.id, itemId);
      toast({
        title: "Success",
        description: "Tool unlocked successfully!",
        variant: "default"
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error unlocking item:', error);
      toast({
        title: "Error",
        description: "Failed to unlock tool. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (itemId: string) => {
    if (!user) return;

    try {
      // In a real app, this would trigger the actual download
      toast({
        title: "Download started",
        description: "Your download will begin shortly.",
        variant: "default"
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error downloading item:', error);
      toast({
        title: "Error",
        description: "Failed to download tool. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category?.category_key === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = (categoryKey: string) => {
    const categoryItems = items.filter(item => item.category?.category_key === categoryKey);
    const unlockedItems = categoryItems.filter(item => item.user_unlock);
    return {
      total: categoryItems.length,
      unlocked: unlockedItems.length
    };
  };

  if (isEnsuring) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Setting up your toolkit...</p>
        </div>
      </div>
    );
  }

  if (ensureError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load toolkit: {ensureError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🛠️</div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tools</p>
                  <p className="text-2xl font-bold">{stats.totalTools}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🔓</div>
                <div>
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                  <p className="text-2xl font-bold">{stats.unlockedTools}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">📥</div>
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">📂</div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{stats.categoriesExplored}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">⭐</div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tools">All Tools</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => {
              const stats = getCategoryStats(category.category_key);
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  itemCount={stats.total}
                  unlockedCount={stats.unlocked}
                  onClick={() => setSelectedCategory(category.category_key)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <ToolkitItemCard
                key={item.id}
                item={item}
                onUnlock={handleUnlock}
                onDownload={handleDownload}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No achievements available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};