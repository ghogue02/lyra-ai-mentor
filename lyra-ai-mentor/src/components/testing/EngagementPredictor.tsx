import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, BarChart3, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface EngagementPredictorProps {
  onComplete?: () => void;
}

interface EngagementMetrics {
  overallScore: number;
  estimatedReach: string;
  engagementRate: string;
  bestPostTime: string;
  improvements: string[];
  breakdown: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
}

export const EngagementPredictor: React.FC<EngagementPredictorProps> = ({ onComplete }) => {
  const [platform, setPlatform] = useState<string>('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' }
  ];

  const postTypes = [
    { value: 'photo', label: 'Photo', description: 'Single image post' },
    { value: 'video', label: 'Video', description: 'Video content' },
    { value: 'carousel', label: 'Carousel', description: 'Multiple images' },
    { value: 'text', label: 'Text Only', description: 'Text-based post' },
    { value: 'link', label: 'Link Share', description: 'Sharing external content' },
    { value: 'story', label: 'Story/Reel', description: 'Temporary content' }
  ];

  const audiences = [
    { value: 'donors', label: 'Donors & Supporters', description: 'Current and potential donors' },
    { value: 'volunteers', label: 'Volunteers', description: 'Active and prospective volunteers' },
    { value: 'beneficiaries', label: 'Program Participants', description: 'People you serve' },
    { value: 'community', label: 'General Community', description: 'Local community members' },
    { value: 'partners', label: 'Partners & Corporates', description: 'Business and org partners' }
  ];

  const predictEngagement = async () => {
    if (!platform || !postContent.trim() || !postType || !targetAudience) {
      toast.error('Please complete all fields');
      return;
    }

    setIsPredicting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generatePrediction();
      setMetrics(result);
      
      toast.success('Engagement prediction complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to predict engagement. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const generatePrediction = (): EngagementMetrics => {
    // Base scores by platform
    const platformScores: Record<string, number> = {
      instagram: 85,
      facebook: 75,
      linkedin: 70,
      twitter: 65
    };

    // Adjust for post type
    const typeMultipliers: Record<string, number> = {
      video: 1.3,
      carousel: 1.2,
      photo: 1.1,
      story: 1.15,
      text: 0.9,
      link: 0.85
    };

    // Audience engagement rates
    const audienceEngagement: Record<string, number> = {
      volunteers: 1.2,
      donors: 1.15,
      beneficiaries: 1.1,
      community: 1.0,
      partners: 0.95
    };

    // Calculate base score
    let score = platformScores[platform] || 70;
    score *= typeMultipliers[postType] || 1.0;
    score *= audienceEngagement[targetAudience] || 1.0;

    // Analyze content for engagement factors
    const contentLower = postContent.toLowerCase();
    const improvements: string[] = [];

    // Check for engagement boosters
    if (contentLower.includes('?')) {
      score += 5;
    } else {
      improvements.push('Add a question to encourage responses');
    }

    if (contentLower.includes('story') || contentLower.includes('meet')) {
      score += 8;
    } else {
      improvements.push('Include a personal story or introduce someone');
    }

    if (contentLower.includes('thank') || contentLower.includes('grateful')) {
      score += 6;
    }

    if (contentLower.includes('help') || contentLower.includes('support') || contentLower.includes('join')) {
      score += 4;
    } else {
      improvements.push('Include a clear call-to-action');
    }

    // Check content length
    const wordCount = postContent.split(' ').length;
    if (platform === 'twitter' && wordCount > 40) {
      score -= 10;
      improvements.push('Shorten content for Twitter (280 character limit)');
    } else if (platform === 'instagram' && wordCount < 20) {
      score -= 5;
      improvements.push('Add more context to your Instagram caption');
    }

    // Add hashtag recommendation
    if (!contentLower.includes('#')) {
      improvements.push('Add relevant hashtags to increase discoverability');
      score -= 5;
    }

    // Ensure score is within bounds
    score = Math.min(Math.max(score, 0), 100);

    // Calculate metrics based on score
    const baseReach = Math.floor(500 + (score * 20));
    const engagementRate = (score / 10).toFixed(1);

    // Best posting times by platform and audience
    const bestTimes: Record<string, string> = {
      'facebook-donors': 'Thursday 7-9 PM',
      'facebook-volunteers': 'Tuesday 12-1 PM',
      'instagram-community': 'Wednesday 5-7 PM',
      'instagram-donors': 'Thursday 6-8 PM',
      'linkedin-partners': 'Tuesday 10-11 AM',
      'linkedin-donors': 'Wednesday 8-9 AM',
      'twitter-community': 'Monday 12-2 PM',
      'twitter-volunteers': 'Friday 5-6 PM'
    };

    const bestTime = bestTimes[`${platform}-${targetAudience}`] || 'Tuesday-Thursday 12-1 PM or 5-7 PM';

    return {
      overallScore: Math.round(score),
      estimatedReach: `${baseReach.toLocaleString()}-${(baseReach * 1.5).toLocaleString()} people`,
      engagementRate: `${engagementRate}%`,
      bestPostTime: bestTime,
      improvements: improvements.length > 0 ? improvements : ['Your post is well-optimized!'],
      breakdown: {
        likes: Math.round(baseReach * (score / 1000) * 0.6),
        comments: Math.round(baseReach * (score / 1000) * 0.15),
        shares: Math.round(baseReach * (score / 1000) * 0.2),
        saves: Math.round(baseReach * (score / 1000) * 0.05)
      }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Engagement Predictor
          </CardTitle>
          <p className="text-sm text-gray-600">
            Predict how your content will perform before you post
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((plat) => (
                    <SelectItem key={plat.value} value={plat.value}>
                      <span className="flex items-center gap-2">
                        <span>{plat.icon}</span>
                        {plat.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Post Type</label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  {postTypes.map((type) => (
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Who is this post for?" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience.value} value={audience.value}>
                    <div>
                      <div className="font-medium">{audience.label}</div>
                      <div className="text-xs text-gray-500">{audience.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Post Content</label>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Paste or write your post content here. Include any text, hashtags, and emojis you plan to use."
              rows={5}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={predictEngagement} 
            disabled={isPredicting || !platform || !postContent.trim() || !postType || !targetAudience}
            className="w-full"
          >
            {isPredicting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Engagement Potential...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Predict Engagement
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {metrics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Engagement Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}/100
                </div>
                <Badge variant="secondary" className="mt-2">
                  {getScoreLabel(metrics.overallScore)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm text-gray-600">Estimated Reach</p>
                  <p className="font-semibold">{metrics.estimatedReach}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="font-semibold">{metrics.engagementRate}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm text-gray-600">Best Time</p>
                  <p className="font-semibold text-sm">{metrics.bestPostTime}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm text-gray-600">Audience</p>
                  <p className="font-semibold text-sm">{audiences.find(a => a.value === targetAudience)?.label}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Predicted Engagement Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Likes
                    </span>
                    <span className="font-medium">{metrics.breakdown.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      Comments
                    </span>
                    <span className="font-medium">{metrics.breakdown.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      Shares
                    </span>
                    <span className="font-medium">{metrics.breakdown.shares.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {metrics.improvements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Suggestions to Improve Engagement</h4>
                  <ul className="space-y-2">
                    {metrics.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Remember:</strong> These predictions are based on typical engagement patterns. 
                  Actual results may vary based on current events, trending topics, and your specific audience.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};