
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';

export const AIContentGenerator = () => {
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [mission, setMission] = useState('');
  const [contentType, setContentType] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { callAI, loading } = useAITestingAssistant();

  const organizationData = {
    'American Red Cross': 'The American Red Cross prevents and alleviates human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors. We provide relief to victims of disasters and help people prevent, prepare for, and respond to emergencies.',
    
    'Habitat for Humanity': 'Habitat for Humanity brings people together to build homes, communities and hope. We partner with families to help them build or improve a place they can call home. Habitat homeowners help build their own homes alongside volunteers and pay an affordable mortgage.',
    
    'United Way': 'United Way fights for the health, education, and financial stability of every person in every community. We focus on creating long-lasting changes by addressing the underlying causes of problems. Together, we can inspire hope and create opportunities for a better tomorrow.',
    
    'Doctors Without Borders': 'Doctors Without Borders provides medical humanitarian aid to people affected by conflict, epidemics, natural disasters, or exclusion from healthcare. Our teams are made up of medical professionals, logistical experts, and other specialists who provide assistance based solely on need.',
    
    'World Wildlife Fund': 'WWF works to sustain the natural world for the benefit of people and wildlife, collaborating with partners from local to global levels in nearly 100 countries. We seek to save a planet, a world of life, conserving the worlds biological diversity, ensuring sustainable use of renewable natural resources, and promoting the reduction of pollution and wasteful consumption.',
    
    'Feeding America': 'Feeding America is the largest hunger-relief organization in the United States. Through a network of more than 200 food banks, 21 statewide food bank associations, and over 60,000 partner agencies, food pantries and meal programs, we helped provide 6.6 billion meals to people experiencing hunger last year.',
    
    'Boys & Girls Clubs of America': 'Boys & Girls Clubs of America enables all young people, especially those who need us most, to reach their full potential as productive, caring, responsible citizens. We provide a safe place to learn and grow, ongoing relationships with caring adult professionals, life-enhancing programs and character development experiences.',
    
    'Goodwill Industries': 'Goodwill works to enhance the dignity and quality of life of individuals and families by strengthening communities, eliminating barriers to opportunity, and helping people in need reach their full potential through learning and the power of work.',
    
    'St. Jude Children\'s Research Hospital': 'St. Jude Children\'s Research Hospital leads the way the world understands, treats and defeats childhood cancer and other life-threatening diseases. Our mission is clear: Finding cures. Saving children. We freely share our discoveries, treatments and resources with doctors around the world.',
    
    'The Salvation Army': 'The Salvation Army exists to meet human needs wherever, whenever, and however we can. We serve in 400 communities across the country and provide food, shelter, disaster relief, rehabilitation, anti-human trafficking efforts, and Christmas assistance to those who need it most.',
    
    'American Cancer Society': 'The American Cancer Society is on a mission to free the world from cancer. We fund and conduct research, share expert information, support patients, and spread the word about prevention. All so you can live longer and better.',
    
    'Make-A-Wish Foundation': 'Make-A-Wish creates life-changing wishes for children with critical illnesses. We seek to bring every eligible child\'s wish to life because a wish is an integral part of a child\'s treatment journey. Research shows children who have wishes granted can build the physical and emotional strength they need to fight their illness.',
    
    'Big Brothers Big Sisters': 'Big Brothers Big Sisters operates under the belief that inherent in every child is the ability to succeed and thrive in life. As the largest donor and volunteer supported mentoring network in the country, we make meaningful, monitored matches between adult volunteers and children.',
    
    'UNICEF': 'UNICEF works in over 190 countries and territories to save children\'s lives, to defend their rights, and to help them fulfill their potential, from early childhood through adolescence. We are committed to ensuring equal rights for every child, everywhere.',
    
    'National Geographic Society': 'The National Geographic Society uses science, exploration, education and storytelling to illuminate and protect the wonder of our world. We fund hundreds of research and conservation projects around the world each year and inspire new generations through education initiatives and resources.'
  };

  const organizations = Object.keys(organizationData);

  const contentTypes = [
    'Fundraising Email',
    'Social Media Post',
    'Grant Proposal Snippet',
    'Newsletter Content',
    'Volunteer Recruitment'
  ];

  const handleOrganizationChange = (org: string) => {
    setSelectedOrganization(org);
    setMission(organizationData[org as keyof typeof organizationData] || '');
  };

  const generateContent = async () => {
    if (!selectedOrganization || !mission.trim() || !contentType) return;

    try {
      const prompt = `Organization: ${selectedOrganization}
Mission: ${mission}
Content Type: ${contentType}

Create compelling, professional content for this nonprofit. Make it engaging and action-oriented.`;

      const result = await callAI('grant_writing', prompt);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = selectedOrganization && mission.trim() && contentType;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Nonprofit Content Generator</h3>
        <p className="text-sm text-gray-600">Generate personalized content for real organizations</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Organization</label>
          <Select value={selectedOrganization} onValueChange={handleOrganizationChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select a real nonprofit organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Mission/Focus</label>
          <Textarea
            placeholder="Mission will auto-populate when you select an organization..."
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="text-sm resize-none bg-gray-50"
            rows={3}
            readOnly={!!selectedOrganization}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Content Type</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="What type of content do you need?" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateContent}
          disabled={!canGenerate || loading}
          className="w-full"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {generatedContent && (
        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                AI Generated Content
              </Badge>
              <Button
                onClick={copyContent}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {generatedContent}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
