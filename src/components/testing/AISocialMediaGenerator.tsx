import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Share2, Clock, Copy, Heart, MessageCircle, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface AISocialMediaGeneratorProps {
  onComplete?: () => void;
}

interface GeneratedPost {
  platform: string;
  content: string;
  hashtags: string[];
  characterCount: number;
  estimatedEngagement: string;
}

export const AISocialMediaGenerator: React.FC<AISocialMediaGeneratorProps> = ({ onComplete }) => {
  const [platform, setPlatform] = useState<string>('');
  const [contentGoal, setContentGoal] = useState<string>('');
  const [keyMessage, setKeyMessage] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { value: 'facebook', label: 'Facebook', description: 'Community building and storytelling', limit: 63206 },
    { value: 'instagram', label: 'Instagram', description: 'Visual storytelling and impact', limit: 2200 },
    { value: 'twitter', label: 'Twitter/X', description: 'Quick updates and advocacy', limit: 280 },
    { value: 'linkedin', label: 'LinkedIn', description: 'Professional networking and thought leadership', limit: 3000 },
    { value: 'all', label: 'All Platforms', description: 'Generate for all major platforms', limit: 0 }
  ];

  const contentGoals = [
    { value: 'awareness', label: 'Raise Awareness', description: 'Educate about your cause' },
    { value: 'fundraising', label: 'Fundraising Appeal', description: 'Drive donations' },
    { value: 'volunteer', label: 'Volunteer Recruitment', description: 'Attract volunteers' },
    { value: 'impact', label: 'Share Impact', description: 'Showcase success stories' },
    { value: 'event', label: 'Event Promotion', description: 'Promote upcoming events' },
    { value: 'gratitude', label: 'Thank Supporters', description: 'Express appreciation' }
  ];

  const generatePosts = async () => {
    if (!platform || !contentGoal || !keyMessage.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const posts = createSocialMediaPosts();
      setGeneratedPosts(posts);
      
      toast.success('Social media posts generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createSocialMediaPosts = (): GeneratedPost[] => {
    const selectedGoal = contentGoals.find(g => g.value === contentGoal);
    const posts: GeneratedPost[] = [];
    
    const platformsToGenerate = platform === 'all' 
      ? ['facebook', 'instagram', 'twitter', 'linkedin'] 
      : [platform];

    platformsToGenerate.forEach(plat => {
      let content = '';
      let hashtags: string[] = [];
      
      switch (contentGoal) {
        case 'awareness':
          if (plat === 'twitter') {
            content = `🌟 Did you know? ${keyMessage}\n\nEvery action counts in creating change. Join us in making a difference in NYC communities.\n\n#NonprofitNYC #CommunityImpact #SocialGood`;
            hashtags = ['#NonprofitNYC', '#CommunityImpact', '#SocialGood', '#NYCares'];
          } else if (plat === 'facebook') {
            content = `🌟 Did you know? ${keyMessage}\n\nHere in New York City, we see the impact of this issue every day. From Brooklyn to the Bronx, our neighbors need our support.\n\nTogether, we can create lasting change. Here's how you can help:\n✨ Share this post to spread awareness\n✨ Visit our website to learn more\n✨ Join us as a volunteer\n✨ Support our mission\n\nEvery action, no matter how small, makes a difference. What will you do today to help?`;
            hashtags = ['#NonprofitNYC', '#CommunityImpact', '#NYCNonprofit', '#MakeADifference', '#SocialGood'];
          } else if (plat === 'instagram') {
            content = `🌟 ${keyMessage}\n\nSwipe to see how we're making a difference in NYC communities every day. 💙\n\nYour support helps us continue this vital work. Together, we're stronger.\n\n📍 New York City\n🤝 Join our mission\n💪 Be the change\n\n#NonprofitLife #NYCNonprofit #CommunityLove #ImpactMatters #NewYorkGives #SocialImpact #Changemakers #NYCCommunity #DoGood #NonprofitNYC`;
            hashtags = ['#NonprofitLife', '#NYCNonprofit', '#CommunityLove', '#ImpactMatters', '#NewYorkGives'];
          } else if (plat === 'linkedin') {
            content = `🌟 Addressing Critical Community Needs in NYC\n\n${keyMessage}\n\nAs nonprofit professionals, we witness the transformative power of community action every day. Here in New York City, the challenges are significant, but so is our collective resolve.\n\nOur recent data shows:\n• 73% increase in community engagement\n• 2,500+ lives impacted this quarter\n• 15 new partnerships formed\n\nWe're looking for passionate professionals who want to make a tangible difference. Whether through board service, pro bono expertise, or strategic partnerships, there are many ways to contribute to meaningful change.\n\nHow is your organization addressing community needs? Let's connect and explore collaboration opportunities.\n\n#NonprofitLeadership #SocialImpact #NYCNonprofit #CorporateSocialResponsibility #CommunityEngagement`;
            hashtags = ['#NonprofitLeadership', '#SocialImpact', '#NYCNonprofit', '#CSR'];
          }
          break;

        case 'fundraising':
          if (plat === 'twitter') {
            content = `💙 ${keyMessage}\n\nYour donation directly impacts NYC families. Even $25 provides [specific impact].\n\nDonate today: [link]\n\n#GiveBack #NYCNonprofit`;
            hashtags = ['#GiveBack', '#NYCNonprofit', '#Donate', '#Fundraising'];
          } else if (plat === 'facebook') {
            content = `💙 ${keyMessage}\n\nRight now, families across New York City need our help. Your generosity makes their tomorrow brighter.\n\n🎯 $25 provides a week of meals\n🎯 $50 funds educational supplies\n🎯 $100 supports job training\n🎯 $250 helps a family with emergency assistance\n\nEvery dollar stays right here in NYC, supporting our neighbors in need. Will you join us?\n\n🔗 Donate: [link]\n💳 Text GIVE to 12345\n📧 Contact us for other ways to help\n\nThank you for believing in our mission. Together, we're building stronger communities.`;
            hashtags = ['#GiveBack', '#NYCGives', '#Fundraising', '#DonateNow', '#CommunitySupport'];
          } else if (plat === 'instagram') {
            content = `💙 Your Impact Story Starts Here\n\n${keyMessage}\n\nSlide to see exactly how your donation transforms lives in NYC. ➡️\n\n$25 = One week of nutritious meals\n$50 = School supplies for a child\n$100 = Job training certification\n\nLink in bio to give. Every dollar counts. 🙏\n\n#NYCGives #NonprofitFundraising #MakeAnImpact #DonateToday #CommunityFirst #GiveBack #CharityWork #NYCNonprofit #SupportLocal #TransformLives`;
            hashtags = ['#NYCGives', '#NonprofitFundraising', '#MakeAnImpact', '#DonateToday', '#CommunityFirst'];
          } else if (plat === 'linkedin') {
            content = `💙 Corporate Partners: Amplify Your Impact\n\n${keyMessage}\n\nAs we approach year-end giving season, I want to share how strategic corporate partnerships are transforming communities across NYC.\n\nOur Impact by the Numbers:\n• 5,000+ individuals served monthly\n• 92% program participant satisfaction\n• $4.50 social return for every $1 invested\n• 15 corporate partners engaged\n\nWe're seeking mission-aligned organizations interested in:\n✅ Employee giving campaigns\n✅ Matching gift programs\n✅ Board leadership opportunities\n✅ Skilled volunteerism\n✅ Cause marketing partnerships\n\nYour company's support directly funds programs that strengthen NYC communities. Let's discuss how we can create meaningful impact together.\n\n#CorporateGiving #SocialResponsibility #NonprofitPartnerships #PhilanthropyNYC`;
            hashtags = ['#CorporateGiving', '#SocialResponsibility', '#NonprofitPartnerships', '#PhilanthropyNYC'];
          }
          break;

        case 'volunteer':
          if (plat === 'twitter') {
            content = `🙋 ${keyMessage}\n\nJoin our volunteer team! Flexible opportunities available throughout NYC.\n\nSign up: [link]\n\n#VolunteerNYC #MakeADifference`;
            hashtags = ['#VolunteerNYC', '#MakeADifference', '#NYCVolunteers', '#GiveBack'];
          } else if (plat === 'facebook') {
            content = `🙋 Calling All NYC Change-Makers!\n\n${keyMessage}\n\nWe have volunteer opportunities that fit YOUR schedule:\n\n📚 Weekday tutoring (Manhattan)\n🥘 Weekend meal prep (Brooklyn)\n🎨 Monthly art workshops (Queens)\n💼 Remote admin support (anywhere!)\n🌱 Saturday community gardens (Bronx)\n\nNo experience necessary - just bring your passion for helping others!\n\n✅ Background check provided\n✅ Training included\n✅ Flexible commitment\n✅ Make real friends\n✅ Create lasting impact\n\nReady to make a difference? Sign up at [link] or comment below!`;
            hashtags = ['#VolunteerNYC', '#NYCVolunteers', '#CommunityService', '#MakeADifference', '#VolunteerOpportunities'];
          } else if (plat === 'instagram') {
            content = `🙋 Your Time. Their Future.\n\n${keyMessage}\n\nSwipe to see our amazing volunteers in action across all five boroughs! 💪\n\n📍 Multiple locations\n⏰ Flexible hours\n❤️ Meaningful impact\n👥 Great community\n\nLink in bio to join our volunteer family!\n\n#VolunteerNYC #NYCVolunteers #GiveBackNYC #CommunityService #MakeADifference #VolunteerWork #NYCNonprofit #ServeNYC #DoGoodNYC #VolunteerLife`;
            hashtags = ['#VolunteerNYC', '#NYCVolunteers', '#GiveBackNYC', '#CommunityService', '#MakeADifference'];
          } else if (plat === 'linkedin') {
            content = `🙋 Skills-Based Volunteering: Where Expertise Meets Impact\n\n${keyMessage}\n\nWe're seeking professionals who want to leverage their skills for social good. Current opportunities:\n\n🔹 Marketing Strategists: Help amplify our message\n🔹 Data Analysts: Measure and maximize our impact\n🔹 HR Professionals: Strengthen our talent pipeline\n🔹 Finance Experts: Ensure fiscal sustainability\n🔹 Tech Innovators: Modernize our operations\n\nWhy volunteer with us?\n• Apply your expertise to meaningful challenges\n• Expand your professional network\n• Develop new skills in the nonprofit sector\n• Earn recognition for community leadership\n• Make measurable social impact\n\nInterested in learning more? Let's connect to discuss how your skills can drive community change.\n\n#SkillsBasedVolunteering #ProBonoWork #NonprofitVolunteers #ProfessionalDevelopment #SocialImpact`;
            hashtags = ['#SkillsBasedVolunteering', '#ProBonoWork', '#NonprofitVolunteers', '#SocialImpact'];
          }
          break;

        case 'impact':
          if (plat === 'twitter') {
            content = `✨ ${keyMessage}\n\n"This program changed my life" - Maria, program participant\n\nRead more success stories: [link]\n\n#ImpactStory #NonprofitImpact`;
            hashtags = ['#ImpactStory', '#NonprofitImpact', '#SuccessStory', '#ChangingLives'];
          } else if (plat === 'facebook') {
            content = `✨ Impact Story: ${keyMessage}\n\nMeet Maria, a single mom from Queens who joined our program six months ago. Today, she's employed full-time and providing stability for her children.\n\n"I never thought I'd get here," Maria shares. "But with the support and training I received, I found confidence I didn't know I had."\n\nMaria is one of 847 individuals we've helped this year. Each story is unique, but they all share one thing: the transformative power of community support.\n\n📈 Our 2024 Impact:\n• 847 individuals served\n• 73% found employment\n• 91% reported increased confidence\n• 100% felt supported by our community\n\nYour support makes stories like Maria's possible. Thank you for believing in our neighbors' potential.`;
            hashtags = ['#ImpactStory', '#SuccessStory', '#CommunityImpact', '#TransformingLives', '#NonprofitSuccess'];
          } else if (plat === 'instagram') {
            content = `✨ Real People. Real Change. Real Impact.\n\n${keyMessage}\n\n"Six months ago, I was struggling. Today, I'm thriving." - Maria, Program Graduate\n\nSwipe to follow Maria's journey from uncertainty to empowerment. Her story is why we do what we do. 💪\n\n#ImpactStory #TransformationTuesday #NonprofitImpact #SuccessStory #CommunityPower #RealChange #NYCStrong #ChangingLives #EmpowermentStory #MakeADifference`;
            hashtags = ['#ImpactStory', '#TransformationTuesday', '#NonprofitImpact', '#SuccessStory', '#CommunityPower'];
          } else if (plat === 'linkedin') {
            content = `✨ Measuring What Matters: Impact Report\n\n${keyMessage}\n\nI'm proud to share a recent success story that exemplifies our organization's impact.\n\nMaria, a single mother from Queens, came to us facing significant employment barriers. Through our comprehensive workforce development program, she received:\n\n• Industry-specific training\n• Professional mentorship\n• Interview preparation\n• Ongoing support services\n\nToday, Maria is thriving in her new role at a Fortune 500 company, with benefits that provide stability for her family.\n\nMaria's story represents our broader impact:\n📊 847 individuals served this year\n📊 73% employment placement rate\n📊 $32,000 average starting salary\n📊 91% one-year retention rate\n\nThese outcomes demonstrate the power of comprehensive, wrap-around support services. When we invest in people, transformation happens.\n\n#NonprofitImpact #WorkforceDevelopment #SocialReturn #ImpactMeasurement #SuccessStories`;
            hashtags = ['#NonprofitImpact', '#WorkforceDevelopment', '#SocialReturn', '#ImpactMeasurement'];
          }
          break;

        case 'event':
          if (plat === 'twitter') {
            content = `📅 Save the Date! ${keyMessage}\n\n📍 Location: [Venue]\n📆 Date: [Date]\n🎟️ Register: [link]\n\n#NYCEvents #NonprofitEvent`;
            hashtags = ['#NYCEvents', '#NonprofitEvent', '#SaveTheDate', '#CommunityEvent'];
          } else if (plat === 'facebook') {
            content = `📅 You're Invited! ${keyMessage}\n\n📍 Where: [Venue Name, Full Address]\n📆 When: [Day, Date at Time]\n🎟️ Tickets: [Price or Free]\n\nJoin us for an unforgettable evening supporting our community!\n\n✨ What to Expect:\n• Inspiring speaker program\n• Delicious food & drinks\n• Silent auction with amazing items\n• Live entertainment\n• Networking with community leaders\n\n100% of proceeds benefit our programs serving NYC families.\n\n🎟️ Get your tickets: [link]\n👥 Sponsorship opportunities available\n
Can't attend? You can still support our mission: [donation link]\n\nTag friends who should join us!`;
            hashtags = ['#NYCEvents', '#CharityEvent', '#FundraisingGala', '#SaveTheDate', '#NonprofitEvent'];
          } else if (plat === 'instagram') {
            content = `📅 SAVE THE DATE: ${keyMessage}\n\n✨ An evening you won't forget\n📍 [Venue] in [Borough]\n📆 [Date] at [Time]\n🎟️ Link in bio for tickets\n\nJoin us for inspiration, celebration, and community! Swipe for event highlights ➡️\n\n#NYCEvents #CharityGala #NonprofitEvent #SaveTheDate #NYCNightOut #FundraisingEvent #CommunityGathering #SupportLocal #EventsNYC #MakeADifference`;
            hashtags = ['#NYCEvents', '#CharityGala', '#NonprofitEvent', '#SaveTheDate', '#NYCNightOut'];
          } else if (plat === 'linkedin') {
            content = `📅 Join Us: ${keyMessage}\n\n📍 Location: [Venue Name, Address]\n📆 Date: [Full Date and Time]\n🎟️ Registration: [Link]\n\nI'm excited to invite you to our signature annual event, bringing together NYC's philanthropic and business communities for an evening of purpose and connection.\n\nEvent Highlights:\n• Keynote by [Notable Speaker]\n• Panel: "The Future of NYC Nonprofits"\n• Recognition of community champions\n• Networking with 200+ sector leaders\n• Showcase of innovative programs\n\nThis event offers unique opportunities for:\n✅ Corporate visibility and branding\n✅ Mission-aligned networking\n✅ Learning from sector innovators\n✅ Supporting vital community programs\n\nSponsorship packages still available. Contact us to discuss partnership opportunities.\n\n#NonprofitEvents #NYCPhilanthropy #CorporatePartnership #NetworkingEvent #SocialImpact`;
            hashtags = ['#NonprofitEvents', '#NYCPhilanthropy', '#CorporatePartnership', '#NetworkingEvent'];
          }
          break;

        case 'gratitude':
          if (plat === 'twitter') {
            content = `🙏 ${keyMessage}\n\nTo our donors, volunteers, and supporters: YOU make our work possible. Thank you for believing in our mission.\n\n#ThankYou #Gratitude`;
            hashtags = ['#ThankYou', '#Gratitude', '#NonprofitLove', '#Appreciation'];
          } else if (plat === 'facebook') {
            content = `🙏 A Heartfelt Thank You\n\n${keyMessage}\n\nAs we reflect on this year, we're overwhelmed with gratitude for each of you who makes our work possible:\n\n💙 To our DONORS: Your generosity fuels hope\n💙 To our VOLUNTEERS: Your time creates change\n💙 To our PARTNERS: Your collaboration multiplies impact\n💙 To our STAFF: Your dedication inspires us daily\n💙 To our PARTICIPANTS: Your courage motivates us\n\nTogether, we've:\n✨ Served 5,000+ NYC families\n✨ Provided 50,000 meals\n✨ Created 300 job opportunities\n✨ Built countless connections\n\nBut beyond the numbers, you've given something priceless: hope. Thank you for being part of our community.\n\nWith gratitude from all of us ❤️`;
            hashtags = ['#Gratitude', '#ThankYou', '#NonprofitLove', '#CommunityAppreciation', '#Grateful'];
          } else if (plat === 'instagram') {
            content = `🙏 THANK YOU doesn't seem big enough...\n\n${keyMessage}\n\nSwipe to see the faces behind our mission - our incredible donors, volunteers, partners, and participants who make everything possible. ➡️\n\nYour support transforms lives every single day. We see you. We appreciate you. We couldn't do this without you. 💙\n\n#Gratitude #ThankYou #NonprofitLove #CommunityLove #Appreciation #GratefulHeart #ThankYouThursday #NYCNonprofit #HeartFull #AppreciationPost`;
            hashtags = ['#Gratitude', '#ThankYou', '#NonprofitLove', '#CommunityLove', '#ThankYouThursday'];
          } else if (plat === 'linkedin') {
            content = `🙏 Reflecting on Partnership and Impact\n\n${keyMessage}\n\nAs we close another impactful quarter, I want to express deep gratitude to the individuals and organizations that make our mission possible.\n\nTo Our Corporate Partners: Your strategic support has enabled us to scale programs and reach more New Yorkers in need.\n\nTo Our Board Members: Your governance, expertise, and advocacy strengthen our foundation.\n\nTo Our Donors: Your investments in our work create ripple effects throughout NYC communities.\n\nTo Our Volunteers: Your skilled contributions multiply our capacity for good.\n\nTo Our Team: Your unwavering commitment turns vision into reality every day.\n\nThis quarter's achievements:\n• 25% increase in program reach\n• 3 new strategic partnerships formed\n• 92% participant satisfaction rate\n• $1.2M in community investment\n\nThese results reflect what's possible when purpose-driven people unite around a common cause. Thank you for being part of this journey.\n\n#NonprofitLeadership #Gratitude #PartnershipsMatter #SocialImpact #ThankYou`;
            hashtags = ['#NonprofitLeadership', '#Gratitude', '#PartnershipsMatter', '#SocialImpact'];
          }
          break;

        default:
          content = `${keyMessage}\n\nJoin us in making a difference in NYC communities.`;
          hashtags = ['#NonprofitNYC', '#CommunityImpact', '#MakeADifference'];
      }

      const platformInfo = platforms.find(p => p.value === plat);
      posts.push({
        platform: plat,
        content: content.trim(),
        hashtags,
        characterCount: content.length,
        estimatedEngagement: plat === 'linkedin' ? 'High' : plat === 'instagram' ? 'Very High' : 'Medium'
      });
    });

    return posts;
  };

  const copyPost = (post: GeneratedPost) => {
    navigator.clipboard.writeText(post.content);
    toast.success(`${post.platform} post copied to clipboard!`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      default: return '📱';
    }
  };

  const getCharacterLimitStatus = (post: GeneratedPost) => {
    const platform = platforms.find(p => p.value === post.platform);
    if (!platform || platform.limit === 0) return null;
    
    const percentage = (post.characterCount / platform.limit) * 100;
    const remaining = platform.limit - post.characterCount;
    
    return {
      percentage,
      remaining,
      isOver: post.characterCount > platform.limit,
      color: percentage > 90 ? 'text-red-600' : percentage > 70 ? 'text-yellow-600' : 'text-green-600'
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            AI Social Media Generator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create engaging posts optimized for each social platform
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
              <label className="block text-sm font-medium mb-2">Content Goal</label>
              <Select value={contentGoal} onValueChange={setContentGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="What's your goal?" />
                </SelectTrigger>
                <SelectContent>
                  {contentGoals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      <div>
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-xs text-gray-500">{goal.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Message</label>
            <Textarea
              value={keyMessage}
              onChange={(e) => setKeyMessage(e.target.value)}
              placeholder="What's the main message you want to communicate? For example: 'Our after-school program needs volunteers to help NYC youth succeed' or 'Join us for our annual gala on March 15th'"
              rows={3}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generatePosts} 
            disabled={isGenerating || !platform || !contentGoal || !keyMessage.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating Posts...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Generate Social Media Posts
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          {generatedPosts.map((post, index) => {
            const limitStatus = getCharacterLimitStatus(post);
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                      {platforms.find(p => p.value === post.platform)?.label}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {limitStatus && (
                        <span className={`text-sm ${limitStatus.color}`}>
                          {limitStatus.isOver ? 'Over by' : 'Characters left:'} {Math.abs(limitStatus.remaining)}
                        </span>
                      )}
                      <Badge variant="secondary">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.estimatedEngagement} Engagement
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => copyPost(post)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                  </div>
                  
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-blue-600">
                          <Hash className="h-3 w-3 mr-1" />
                          {tag.replace('#', '')}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.characterCount} characters
                    </span>
                    {post.platform === 'instagram' && (
                      <span className="text-xs text-gray-500">Remember to add images!</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Pro tips:</strong> Post at optimal times (10am-12pm or 7-9pm EST), use platform-specific features (Stories, Reels, etc.), and always include a call-to-action.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};