import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, Copy, Share2, FileText, Mail, MessageSquare, Instagram } from 'lucide-react';
import { toast } from 'sonner';

interface ContentRepurposerProps {
  onComplete?: () => void;
}

interface RepurposedContent {
  platform: string;
  format: string;
  content: string;
  tips: string[];
  characterCount?: number;
  estimatedTime?: string;
}

export const ContentRepurposer: React.FC<ContentRepurposerProps> = ({ onComplete }) => {
  const [sourceType, setSourceType] = useState<string>('');
  const [originalContent, setOriginalContent] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([]);
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent[]>([]);
  const [isRepurposing, setIsRepurposing] = useState(false);

  const sourceTypes = [
    { value: 'blog_post', label: 'Blog Post', description: 'Long-form article', icon: <FileText className="h-4 w-4" /> },
    { value: 'newsletter', label: 'Email Newsletter', description: 'Email content', icon: <Mail className="h-4 w-4" /> },
    { value: 'social_post', label: 'Social Media Post', description: 'Short social content', icon: <Share2 className="h-4 w-4" /> },
    { value: 'video_script', label: 'Video Script', description: 'Video transcript', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'event_description', label: 'Event Description', description: 'Event details', icon: <FileText className="h-4 w-4" /> }
  ];

  const platforms = [
    { value: 'instagram_post', label: 'Instagram Post', limit: 2200 },
    { value: 'instagram_stories', label: 'Instagram Stories', limit: 0 },
    { value: 'facebook_post', label: 'Facebook Post', limit: 63206 },
    { value: 'twitter_thread', label: 'Twitter/X Thread', limit: 280 },
    { value: 'linkedin_post', label: 'LinkedIn Post', limit: 3000 },
    { value: 'email_teaser', label: 'Email Teaser', limit: 0 },
    { value: 'blog_snippet', label: 'Blog Snippet', limit: 0 },
    { value: 'tiktok_script', label: 'TikTok Script', limit: 0 }
  ];

  const repurposeContent = async () => {
    if (!sourceType || !originalContent.trim() || targetPlatforms.length === 0) {
      toast.error('Please complete all fields and select target platforms');
      return;
    }

    setIsRepurposing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const results = generateRepurposedContent();
      setRepurposedContent(results);
      
      toast.success(`Content repurposed for ${targetPlatforms.length} platforms!`);
      onComplete?.();
    } catch (error) {
      toast.error('Failed to repurpose content. Please try again.');
    } finally {
      setIsRepurposing(false);
    }
  };

  const generateRepurposedContent = (): RepurposedContent[] => {
    const results: RepurposedContent[] = [];
    
    // Extract key information from original content
    const keyPoints = extractKeyPoints(originalContent);
    const hasStats = /\d+/.test(originalContent);
    const hasStory = originalContent.toLowerCase().includes('story') || 
                     originalContent.includes('"') || 
                     originalContent.toLowerCase().includes('said');
    
    targetPlatforms.forEach(platform => {
      let content = '';
      let tips: string[] = [];
      let estimatedTime = '5 minutes';
      
      switch (platform) {
        case 'instagram_post':
          content = createInstagramPost(keyPoints, hasStory);
          tips = [
            'Add 3-5 relevant images or carousel slides',
            'Include a strong call-to-action',
            'Use 20-30 hashtags (mix of popular and niche)',
            'Post between 11 AM - 1 PM or 7 PM - 9 PM',
            'Tag relevant accounts and location'
          ];
          estimatedTime = '15 minutes';
          break;
          
        case 'instagram_stories':
          content = createInstagramStories(keyPoints);
          tips = [
            'Create 3-5 story frames',
            'Use interactive stickers (polls, questions)',
            'Add music or trending audio',
            'Include swipe-up link (if available)',
            'Post throughout the day for maximum reach'
          ];
          estimatedTime = '10 minutes';
          break;
          
        case 'facebook_post':
          content = createFacebookPost(keyPoints, hasStats);
          tips = [
            'Include a compelling image or video',
            'Ask a question to encourage comments',
            'Tag relevant pages and people',
            'Share in relevant groups',
            'Consider boosting high-performing posts'
          ];
          estimatedTime = '10 minutes';
          break;
          
        case 'twitter_thread':
          content = createTwitterThread(keyPoints);
          tips = [
            'Number your tweets (1/5, 2/5, etc.)',
            'Include visuals in key tweets',
            'Use 1-2 hashtags per tweet',
            'Thread during peak hours (9-10 AM, 7-9 PM)',
            'Retweet with comment later'
          ];
          estimatedTime = '15 minutes';
          break;
          
        case 'linkedin_post':
          content = createLinkedInPost(keyPoints, hasStats);
          tips = [
            'Start with a hook question or statistic',
            'Use professional tone',
            'Include 3-5 relevant hashtags',
            'Tag relevant professionals',
            'Post Tuesday-Thursday, 8-10 AM'
          ];
          estimatedTime = '10 minutes';
          break;
          
        case 'email_teaser':
          content = createEmailTeaser(keyPoints);
          tips = [
            'Keep subject line under 50 characters',
            'Include preview text',
            'Add clear CTA button',
            'Link to full content',
            'A/B test subject lines'
          ];
          estimatedTime = '10 minutes';
          break;
          
        case 'blog_snippet':
          content = createBlogSnippet(keyPoints);
          tips = [
            'Use as intro paragraph',
            'Include internal links',
            'Optimize for SEO keywords',
            'Add featured image',
            'Include author bio'
          ];
          estimatedTime = '5 minutes';
          break;
          
        case 'tiktok_script':
          content = createTikTokScript(keyPoints);
          tips = [
            'Keep under 60 seconds',
            'Hook viewers in first 3 seconds',
            'Use trending sounds',
            'Add captions for accessibility',
            'Post when audience is most active'
          ];
          estimatedTime = '20 minutes';
          break;
      }
      
      results.push({
        platform: platforms.find(p => p.value === platform)?.label || platform,
        format: platform,
        content,
        tips,
        characterCount: content.length,
        estimatedTime
      });
    });
    
    return results;
  };

  const extractKeyPoints = (content: string): string[] => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyPoints: string[] = [];
    
    // Extract main points (first sentence, sentences with numbers, calls to action)
    if (sentences.length > 0) keyPoints.push(sentences[0].trim());
    
    sentences.forEach(sentence => {
      if (/\d+/.test(sentence) && keyPoints.length < 5) {
        keyPoints.push(sentence.trim());
      }
    });
    
    // Look for action-oriented sentences
    const actionWords = ['help', 'support', 'join', 'donate', 'volunteer', 'learn', 'discover'];
    sentences.forEach(sentence => {
      if (actionWords.some(word => sentence.toLowerCase().includes(word)) && keyPoints.length < 5) {
        keyPoints.push(sentence.trim());
      }
    });
    
    // Ensure we have at least 3 key points
    while (keyPoints.length < 3 && sentences.length > keyPoints.length) {
      keyPoints.push(sentences[keyPoints.length].trim());
    }
    
    return keyPoints.slice(0, 5);
  };

  const createInstagramPost = (keyPoints: string[], hasStory: boolean): string => {
    let post = '';
    
    if (hasStory) {
      post = `✨ ${keyPoints[0]}\n\n`;
      post += `${keyPoints.slice(1, 3).join('\n\n')}\n\n`;
      post += `💙 Your support makes stories like this possible.\n\n`;
    } else {
      post = `📢 ${keyPoints[0]}\n\n`;
      keyPoints.slice(1, 3).forEach(point => {
        post += `▪️ ${point}\n`;
      });
      post += `\n🌟 Together, we're making a difference in NYC!\n\n`;
    }
    
    post += `Learn more → [Link in bio]\n\n`;
    post += `#NonprofitNYC #CommunityImpact #MakeADifference #SocialGood #NYCGives #ChangeMakers #NonprofitLife #GiveBack #CommunityLove #ImpactMatters`;
    
    return post;
  };

  const createInstagramStories = (keyPoints: string[]): string => {
    let stories = 'STORY SEQUENCE (3-5 frames):\n\n';
    
    stories += `Frame 1:\n`;
    stories += `[Eye-catching visual]\n`;
    stories += `"${keyPoints[0]}"\n`;
    stories += `[Swipe up arrow]\n\n`;
    
    stories += `Frame 2:\n`;
    stories += `[Impact photo/video]\n`;
    stories += `"${keyPoints[1] || 'See the impact'}"\n\n`;
    
    stories += `Frame 3:\n`;
    stories += `[Call-to-action slide]\n`;
    stories += `"How YOU can help:"\n`;
    stories += `• Donate\n`;
    stories += `• Volunteer\n`;
    stories += `• Share\n`;
    stories += `[Link sticker]\n\n`;
    
    if (keyPoints.length > 2) {
      stories += `Frame 4:\n`;
      stories += `[Thank you visual]\n`;
      stories += `"${keyPoints[2]}"\n`;
      stories += `[Question sticker: "What inspires you?"]\n`;
    }
    
    return stories;
  };

  const createFacebookPost = (keyPoints: string[], hasStats: boolean): string => {
    let post = `${keyPoints[0]}\n\n`;
    
    if (hasStats) {
      post += `📊 Here's what your support has accomplished:\n`;
      keyPoints.slice(1, 3).forEach(point => {
        post += `• ${point}\n`;
      });
      post += `\n`;
    } else {
      post += `${keyPoints[1] || 'Join us in making a difference.'}\n\n`;
    }
    
    post += `Every action counts, no matter how small. Whether you donate, volunteer, or simply share this post, you're helping build stronger NYC communities.\n\n`;
    
    post += `👉 How will you make a difference today?\n\n`;
    post += `Learn more: [Link]\n`;
    post += `📞 Contact us: (212) 555-0123\n`;
    post += `📧 Email: info@nonprofit.org`;
    
    return post;
  };

  const createTwitterThread = (keyPoints: string[]): string => {
    let thread = '🧵 THREAD (Auto-number when posting):\n\n';
    
    thread += `Tweet 1/5:\n`;
    thread += `${keyPoints[0]} 🌟\n\n`;
    
    thread += `Tweet 2/5:\n`;
    thread += `${keyPoints[1] || 'Here\'s why this matters to our NYC community...'}\n\n`;
    
    thread += `Tweet 3/5:\n`;
    thread += `The impact is real:\n`;
    thread += `✅ Families served\n`;
    thread += `✅ Lives changed\n`;
    thread += `✅ Communities strengthened\n\n`;
    
    thread += `Tweet 4/5:\n`;
    thread += `You can help! Here's how:\n`;
    thread += `💙 Donate: [link]\n`;
    thread += `🤝 Volunteer: [link]\n`;
    thread += `📢 Share this thread\n\n`;
    
    thread += `Tweet 5/5:\n`;
    thread += `Together, we're building a better NYC. Thank you for being part of this journey! 🙏\n`;
    thread += `#NonprofitNYC #MakeADifference`;
    
    return thread;
  };

  const createLinkedInPost = (keyPoints: string[], hasStats: boolean): string => {
    let post = `${keyPoints[0]}\n\n`;
    
    post += `As nonprofit professionals, we often witness the transformative power of community action. `;
    post += `${keyPoints[1] || 'Today, I want to share an important update about our work.'}\n\n`;
    
    if (hasStats) {
      post += `The numbers tell a powerful story:\n`;
      keyPoints.slice(2).forEach(point => {
        if (point) post += `• ${point}\n`;
      });
      post += `\n`;
    }
    
    post += `This work is only possible through strategic partnerships and dedicated supporters. `;
    post += `We're always looking for mission-aligned organizations and professionals who want to create lasting change.\n\n`;
    
    post += `How is your organization making a difference in the community? Let's connect and explore collaboration opportunities.\n\n`;
    
    post += `#NonprofitLeadership #SocialImpact #CommunityDevelopment #CSR #NYCNonprofit`;
    
    return post;
  };

  const createEmailTeaser = (keyPoints: string[]): string => {
    let email = `SUBJECT: ${keyPoints[0].substring(0, 50)}...\n\n`;
    email += `PREVIEW TEXT: Don't miss this important update about our community impact\n\n`;
    email += `---EMAIL BODY---\n\n`;
    
    email += `Dear [First Name],\n\n`;
    email += `${keyPoints[0]}\n\n`;
    email += `I wanted to personally share this update with you because your support makes it all possible.\n\n`;
    
    if (keyPoints[1]) {
      email += `${keyPoints[1]}\n\n`;
    }
    
    email += `[BUTTON: Read Full Story]\n\n`;
    email += `Thank you for being part of our community.\n\n`;
    email += `Warmly,\n`;
    email += `[Your Name]\n`;
    email += `[Organization Name]`;
    
    return email;
  };

  const createBlogSnippet = (keyPoints: string[]): string => {
    let snippet = `${keyPoints[0]} In this post, we'll explore how our community is coming together to create lasting change across New York City.\n\n`;
    
    snippet += `[FEATURED IMAGE]\n\n`;
    
    if (keyPoints[1]) {
      snippet += `${keyPoints[1]} `;
    }
    
    snippet += `Read on to discover how you can be part of this transformative work and the impact we're making together...\n\n`;
    
    snippet += `[Continue reading →]`;
    
    return snippet;
  };

  const createTikTokScript = (keyPoints: string[]): string => {
    let script = `⏱️ TIKTOK SCRIPT (30-60 seconds)\n\n`;
    
    script += `[HOOK - 0:00-0:03]\n`;
    script += `"${keyPoints[0].substring(0, 50)}..."\n`;
    script += `[Dramatic pause, eye contact with camera]\n\n`;
    
    script += `[PROBLEM - 0:03-0:10]\n`;
    script += `"Here in NYC, we're facing a challenge..."\n`;
    script += `[B-roll of community/issue]\n\n`;
    
    script += `[SOLUTION - 0:10-0:20]\n`;
    script += `"But here's what we're doing about it:"\n`;
    script += `[Show program in action]\n`;
    script += `"${keyPoints[1] || 'Creating real change, one person at a time'}"\n\n`;
    
    script += `[IMPACT - 0:20-0:25]\n`;
    script += `[Quick montage of success stories]\n`;
    script += `"The results? Incredible."\n\n`;
    
    script += `[CTA - 0:25-0:30]\n`;
    script += `"Want to help? Follow for more and link in bio!"\n`;
    script += `[Point to follow button]\n\n`;
    
    script += `MUSIC: Trending upbeat/emotional sound\n`;
    script += `TEXT OVERLAY: Key stats and CTA throughout`;
    
    return script;
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const togglePlatform = (platform: string) => {
    setTargetPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPlatformIcon = (format: string) => {
    if (format.includes('instagram')) return <Instagram className="h-4 w-4" />;
    if (format.includes('email')) return <Mail className="h-4 w-4" />;
    if (format.includes('blog')) return <FileText className="h-4 w-4" />;
    if (format.includes('tiktok')) return <MessageSquare className="h-4 w-4" />;
    return <Share2 className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Content Repurposer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform one piece of content into multiple formats
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Source Content Type</label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue placeholder="What type of content do you have?" />
              </SelectTrigger>
              <SelectContent>
                {sourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Original Content</label>
            <Textarea
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="Paste your original content here. This could be a blog post excerpt, newsletter section, or any content you want to repurpose across different platforms..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Platforms (Select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.value}
                  variant={targetPlatforms.includes(platform.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform(platform.value)}
                  className="justify-start"
                >
                  {platform.label}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={repurposeContent} 
            disabled={isRepurposing || !sourceType || !originalContent.trim() || targetPlatforms.length === 0}
            className="w-full"
          >
            {isRepurposing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Repurposing Content...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Repurpose Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {repurposedContent.length > 0 && (
        <div className="space-y-4">
          {repurposedContent.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getPlatformIcon(item.format)}
                    {item.platform}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      ~{item.estimatedTime}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => copyContent(item.content)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {item.content}
                  </pre>
                </div>
                
                {item.characterCount && item.characterCount > 0 && (
                  <p className="text-sm text-gray-600">
                    Character count: {item.characterCount}
                  </p>
                )}
                
                <div>
                  <h5 className="font-medium mb-2">Platform-Specific Tips:</h5>
                  <ul className="space-y-1">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Efficiency tip:</strong> Set aside 1-2 hours weekly for content repurposing. 
              Create templates for each platform to speed up the process. Track which formats perform best with your audience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};