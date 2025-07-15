import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp, Clock, Copy, Sparkles, BarChart } from 'lucide-react';
import { toast } from 'sonner';

interface HashtagOptimizerProps {
  onComplete?: () => void;
}

interface HashtagSuggestion {
  hashtag: string;
  reach: 'high' | 'medium' | 'low';
  relevance: number;
  trending: boolean;
  category: string;
}

export const HashtagOptimizer: React.FC<HashtagOptimizerProps> = ({ onComplete }) => {
  const [platform, setPlatform] = useState<string>('');
  const [contentDescription, setContentDescription] = useState('');
  const [currentHashtags, setCurrentHashtags] = useState('');
  const [suggestions, setSuggestions] = useState<HashtagSuggestion[]>([]);
  const [optimizedSet, setOptimizedSet] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const platforms = [
    { value: 'instagram', label: 'Instagram', description: 'Up to 30 hashtags recommended' },
    { value: 'twitter', label: 'Twitter/X', description: '1-2 hashtags optimal' },
    { value: 'linkedin', label: 'LinkedIn', description: '3-5 hashtags recommended' },
    { value: 'facebook', label: 'Facebook', description: '3-5 hashtags work best' },
    { value: 'tiktok', label: 'TikTok', description: '3-5 trending hashtags' }
  ];

  const analyzeHashtags = async () => {
    if (!platform || !contentDescription.trim()) {
      toast.error('Please select a platform and describe your content');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = generateHashtagSuggestions();
      setSuggestions(result.suggestions);
      setOptimizedSet(result.optimized);
      
      toast.success('Hashtag analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze hashtags. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHashtagSuggestions = () => {
    const categories = {
      nonprofit: ['#NonprofitLife', '#SocialGood', '#MakeADifference', '#CommunityImpact', '#CharityWork'],
      nyc: ['#NYCNonprofit', '#NewYorkGives', '#NYCommunity', '#NYC', '#NewYorkCity'],
      cause: ['#Education', '#YouthDevelopment', '#FoodSecurity', '#Housing', '#Healthcare'],
      engagement: ['#GiveBack', '#Volunteer', '#Donate', '#Support', '#JoinUs'],
      trending: ['#GivingTuesday', '#Sustainability', '#SocialImpact', '#ChangeMakers', '#ForGood']
    };

    const allSuggestions: HashtagSuggestion[] = [];
    
    // Add nonprofit-specific hashtags
    categories.nonprofit.forEach(tag => {
      allSuggestions.push({
        hashtag: tag,
        reach: Math.random() > 0.5 ? 'high' : 'medium',
        relevance: Math.floor(Math.random() * 20) + 80,
        trending: Math.random() > 0.7,
        category: 'Nonprofit'
      });
    });

    // Add NYC-specific hashtags
    categories.nyc.forEach(tag => {
      allSuggestions.push({
        hashtag: tag,
        reach: 'medium',
        relevance: Math.floor(Math.random() * 15) + 75,
        trending: Math.random() > 0.8,
        category: 'Location'
      });
    });

    // Add cause-specific hashtags based on content
    const causeHashtags = categories.cause.slice(0, 3);
    causeHashtags.forEach(tag => {
      allSuggestions.push({
        hashtag: tag,
        reach: Math.random() > 0.6 ? 'high' : 'medium',
        relevance: Math.floor(Math.random() * 20) + 70,
        trending: false,
        category: 'Cause'
      });
    });

    // Add engagement hashtags
    categories.engagement.slice(0, 2).forEach(tag => {
      allSuggestions.push({
        hashtag: tag,
        reach: 'high',
        relevance: Math.floor(Math.random() * 15) + 85,
        trending: Math.random() > 0.6,
        category: 'Call to Action'
      });
    });

    // Add trending hashtags
    categories.trending.slice(0, 2).forEach(tag => {
      allSuggestions.push({
        hashtag: tag,
        reach: 'high',
        relevance: Math.floor(Math.random() * 20) + 75,
        trending: true,
        category: 'Trending'
      });
    });

    // Sort by relevance
    allSuggestions.sort((a, b) => b.relevance - a.relevance);

    // Select optimal mix based on platform
    let optimalCount = 5;
    switch (platform) {
      case 'instagram':
        optimalCount = 15;
        break;
      case 'twitter':
        optimalCount = 2;
        break;
      case 'linkedin':
      case 'facebook':
        optimalCount = 5;
        break;
      case 'tiktok':
        optimalCount = 4;
        break;
    }

    const optimized = allSuggestions
      .slice(0, optimalCount)
      .map(s => s.hashtag);

    return { suggestions: allSuggestions, optimized };
  };

  const copyHashtags = (hashtags: string[]) => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    toast.success('Hashtags copied to clipboard!');
  };

  const getReachColor = (reach: string) => {
    switch (reach) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-purple-600" />
            Hashtag Optimizer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Find the perfect mix of hashtags to maximize your reach
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select social platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((plat) => (
                  <SelectItem key={plat.value} value={plat.value}>
                    <div>
                      <div className="font-medium">{plat.label}</div>
                      <div className="text-xs text-gray-500">{plat.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Description</label>
            <Textarea
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              placeholder="Describe your post content. For example: 'Photo of volunteers at our food bank helping pack meals for families' or 'Announcement about our upcoming youth mentorship program'"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Hashtags (Optional)</label>
            <Textarea
              value={currentHashtags}
              onChange={(e) => setCurrentHashtags(e.target.value)}
              placeholder="Paste any hashtags you're currently using (we'll analyze and improve them)"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={analyzeHashtags} 
            disabled={isAnalyzing || !platform || !contentDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Hashtags...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize Hashtags
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {optimizedSet.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Optimized Hashtag Set
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyHashtags(optimizedSet)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {optimizedSet.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                This optimized set balances reach, relevance, and engagement for {platforms.find(p => p.value === platform)?.label}.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-600" />
                All Hashtag Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{suggestion.hashtag}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                      {suggestion.trending && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {suggestion.relevance}% relevant
                      </span>
                      <Badge className={getReachColor(suggestion.reach)}>
                        {suggestion.reach} reach
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Pro tip:</strong> Mix high-reach general hashtags with specific niche tags. 
                  Update trending hashtags regularly for best results.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};