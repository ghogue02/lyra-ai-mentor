import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Clock, CheckCircle, Sparkles, Copy, Edit3, Save } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  icon: React.ElementType;
}

const templateCategories: TemplateCategory[] = [
  {
    id: 'email',
    name: 'Email Templates',
    description: 'Professional emails for every situation',
    examples: ['Donor Thank You', 'Volunteer Recruitment', 'Program Updates'],
    icon: FileText
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Engaging posts that tell your story',
    examples: ['Impact Stories', 'Event Announcements', 'Volunteer Spotlights'],
    icon: Sparkles
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Reports and proposals that win support',
    examples: ['Grant Proposals', 'Board Reports', 'Program Summaries'],
    icon: Edit3
  }
];

interface GeneratedTemplate {
  title: string;
  content: string;
  variables: string[];
  usage_tips: string;
}

export function MayaTemplateDesigner() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templatePurpose, setTemplatePurpose] = useState("");
  const [keyElements, setKeyElements] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null);
  const [customizedTemplate, setCustomizedTemplate] = useState("");

  const phases = [
    { title: "Maya's Template Revolution", description: "See the transformation" },
    { title: "Choose Template Type", description: "Select what you need" },
    { title: "AI Template Creation", description: "Watch the magic happen" },
    { title: "Customize & Save", description: "Make it yours" },
    { title: "Template Success!", description: "Ready for daily use" }
  ];

  const handleGenerateTemplate = () => {
    // Simulate AI template generation
    const template: GeneratedTemplate = {
      title: "Donor Thank You Email Template",
      content: `Subject: Your Impact at [PROGRAM_NAME] - Thank You!

Dear [DONOR_NAME],

I hope this message finds you well. I wanted to take a moment to personally thank you for your generous support of [AMOUNT] to the Sunshine Youth Center.

Your contribution directly impacts the lives of [NUMBER] youth in our community. Just this week, [SPECIFIC_IMPACT_STORY].

[PERSONAL_CONNECTION]: As someone who cares deeply about [DONOR_INTEREST], you'll be excited to know that your support has enabled us to [RELATED_ACHIEVEMENT].

We're grateful to have you as part of our community of changemakers. Your belief in our mission means everything to the young people we serve.

With heartfelt appreciation,

Maya Rodriguez
Program Director
Sunshine Youth Center

P.S. [INVITATION_TO_ENGAGE] - We'd love to show you the impact of your generosity firsthand!`,
      variables: [
        'DONOR_NAME',
        'AMOUNT',
        'PROGRAM_NAME',
        'NUMBER',
        'SPECIFIC_IMPACT_STORY',
        'PERSONAL_CONNECTION',
        'DONOR_INTEREST',
        'RELATED_ACHIEVEMENT',
        'INVITATION_TO_ENGAGE'
      ],
      usage_tips: 'Personalize the bracketed sections with specific donor information. The template maintains warmth while being efficient to customize.'
    };
    
    setGeneratedTemplate(template);
    setCustomizedTemplate(template.content);
    setCurrentPhase(2);
  };

  const handleSaveTemplate = () => {
    setCurrentPhase(4);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-700">Maya's Template Design Studio</CardTitle>
        <CardDescription className="text-lg mt-2">
          Create reusable templates that save hours every week
        </CardDescription>
        <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-green-50 rounded-lg">
          <Clock className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Before: 45 min per template → After: 5 minutes with AI
          </span>
          <Badge className="bg-green-600">89% time saved</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Progress value={(currentPhase + 1) / phases.length * 100} className="h-2" />
          <p className="text-center text-sm text-gray-600 mt-2">
            {phases[currentPhase].title}: {phases[currentPhase].description}
          </p>
        </div>

        {currentPhase === 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">The Template Transformation</h3>
              <p className="text-gray-700 mb-4">
                Maya discovered she was writing similar emails, documents, and social posts repeatedly. 
                Each donor thank you took 20 minutes, volunteer recruitment emails took 15 minutes, 
                and grant proposals started from scratch every time.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-red-700 text-sm">Before Templates:</p>
                  <ul className="text-xs text-red-600 mt-1">
                    <li>• 3+ hours weekly on repetitive writing</li>
                    <li>• Inconsistent messaging</li>
                    <li>• Mental fatigue from repetition</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-700 text-sm">After Templates:</p>
                  <ul className="text-xs text-green-600 mt-1">
                    <li>• 20 minutes weekly on customization</li>
                    <li>• Consistent, professional voice</li>
                    <li>• Energy saved for meaningful work</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-600">
                  "Creating templates was a game-changer. Now I spend minutes personalizing 
                  instead of hours writing from scratch. It's like having a professional writer on my team!"
                </p>
                <p className="text-sm mt-2 font-semibold text-purple-600">- Maya Rodriguez</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase(1)} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Create Your First Template <FileTemplate className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 1 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Choose Your Template Type</h3>
            
            <div className="grid gap-4">
              {templateCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedCategory === category.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <category.icon className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      <div className="flex gap-2 mt-2">
                        {category.examples.map((example, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedCategory && (
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What's the main purpose of this template?
                  </label>
                  <Input
                    placeholder="e.g., Thank donors for their support, Recruit new volunteers..."
                    value={templatePurpose}
                    onChange={(e) => setTemplatePurpose(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Key elements to include (comma-separated)
                  </label>
                  <Textarea
                    placeholder="e.g., Personal greeting, Impact story, Call to action, Contact information..."
                    value={keyElements}
                    onChange={(e) => setKeyElements(e.target.value)}
                    className="h-20"
                  />
                </div>

                <Button 
                  onClick={handleGenerateTemplate}
                  disabled={!templatePurpose || !keyElements}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Generate Template with AI <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {currentPhase === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Your AI-Generated Template</h3>
            
            {generatedTemplate && (
              <>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{generatedTemplate.title}</h4>
                  <p className="text-sm text-gray-600">{generatedTemplate.usage_tips}</p>
                </div>

                <Tabs defaultValue="template" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="template">Template</TabsTrigger>
                    <TabsTrigger value="variables">Variables Guide</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="template" className="space-y-4">
                    <Textarea
                      value={customizedTemplate}
                      onChange={(e) => setCustomizedTemplate(e.target.value)}
                      className="h-64 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigator.clipboard.writeText(customizedTemplate)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Template
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="variables" className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      Replace these variables with specific information when using the template:
                    </p>
                    {generatedTemplate.variables.map((variable, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Badge variant="secondary">[{variable}]</Badge>
                        <span className="text-sm text-gray-600">
                          Customize with specific details
                        </span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setCurrentPhase(3)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Save & Organize Template <Save className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => setCurrentPhase(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Create Another
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {currentPhase === 3 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Organize Your Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <Input 
                  defaultValue={generatedTemplate?.title}
                  placeholder="e.g., Donor Thank You - Major Gifts"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {['Donors', 'Email', 'Thank You', 'Fundraising', 'Quick Response'].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-purple-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Usage Notes</label>
                <Textarea 
                  placeholder="e.g., Use within 48 hours of donation. Personalize the impact story section."
                  className="h-20"
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveTemplate}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Save to My Template Library
            </Button>
          </div>
        )}

        {currentPhase === 4 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Template Created & Saved!</h3>
              
              <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">5 min</p>
                  <p className="text-sm text-gray-600">Creation Time</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-green-600">40 min</p>
                  <p className="text-sm text-gray-600">Saved Weekly</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-blue-600">∞</p>
                  <p className="text-sm text-gray-600">Times Reusable</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <p className="font-semibold text-gray-700 mb-2">Maya's Template Impact:</p>
                <p className="text-sm text-gray-600">
                  "I now have 15 templates that cover 80% of my communications. What used to take 
                  3 hours a week now takes 20 minutes. That's 2.5 hours back for what matters most - 
                  our youth!"
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Your template has been saved to your toolkit and is ready to use immediately.
              </p>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => setCurrentPhase(1)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Create Another Template
                </Button>
                <Button variant="outline" className="flex-1">
                  View Template Library
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}