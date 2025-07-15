import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Heart, Lightbulb, Target, Zap, Sparkles, Film } from 'lucide-react';
import { toast } from 'sonner';

interface StorytellingAgentProps {
  onComplete?: () => void;
}

interface Character {
  name: string;
  role: string;
  organization: string;
  background: string;
  challenges: string[];
  goals: string[];
  personality: string[];
}

interface StoryArc {
  setup: {
    setting: string;
    character: string;
    initialSituation: string;
    hook: string;
  };
  conflict: {
    challenge: string;
    stakes: string;
    obstacles: string[];
    emotionalTension: string;
  };
  learning: {
    discovery: string;
    mentor: string;
    tools: string[];
    breakthroughs: string[];
  };
  resolution: {
    solution: string;
    implementation: string;
    results: string;
    celebration: string;
  };
  transformation: {
    characterGrowth: string;
    newCapabilities: string;
    futureVision: string;
    lessonsLearned: string[];
  };
}

interface NarrativeContent {
  characters: Character[];
  chapterArc: StoryArc;
  lessonArcs: {
    lessonId: number;
    title: string;
    arc: StoryArc;
    characterFocus: string;
    toneBalance: {
      professional: number;
      conversational: number;
      empowering: number;
      playful: number;
    };
  }[];
  interactiveIntegration: {
    elementType: string;
    storyContext: string;
    characterConnection: string;
    emotionalStakes: string;
  }[];
  contentBlocks: {
    blockId: number;
    currentContent: string;
    storyEnhancement: string;
    newLength: string;
    narrativeFunction: string;
  }[];
}

export const StorytellingAgent: React.FC<StorytellingAgentProps> = ({ onComplete }) => {
  const [contentType, setContentType] = useState<string>('');
  const [chapterNumber, setChapterNumber] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [narrativeContent, setNarrativeContent] = useState<NarrativeContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = [
    { value: 'chapter_redesign', label: 'Complete Chapter Redesign', description: 'Full DreamWorks storytelling makeover' },
    { value: 'lesson_enhancement', label: 'Individual Lesson Enhancement', description: 'Add narrative to specific lesson' },
    { value: 'character_development', label: 'Character Development', description: 'Create/enhance protagonist characters' },
    { value: 'interactive_integration', label: 'Interactive Story Integration', description: 'Connect components to narrative' },
    { value: 'content_expansion', label: 'Content Block Expansion', description: 'Expand thin content with story' }
  ];

  const audienceTypes = [
    { value: 'nonprofit_generalists', label: 'Nonprofit Generalists', description: 'Small org staff wearing many hats' },
    { value: 'program_directors', label: 'Program Directors', description: 'Managing programs and teams' },
    { value: 'development_staff', label: 'Development Staff', description: 'Fundraising and donor relations' },
    { value: 'executive_directors', label: 'Executive Directors', description: 'Organizational leadership' },
    { value: 'volunteers_board', label: 'Volunteers & Board', description: 'Part-time contributors' }
  ];

  const generateNarrativeContent = async () => {
    if (!contentType || !chapterNumber || !targetAudience) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate comprehensive storytelling framework
      const mockNarrative: NarrativeContent = {
        characters: [
          {
            name: "Maya Rodriguez",
            role: "Program Director",
            organization: "Hope Gardens Community Center",
            background: "Former teacher turned nonprofit leader, 3 years at Hope Gardens, manages after-school programs for 200+ kids",
            challenges: [
              "Drowning in emails - 50+ per day from parents, volunteers, funders",
              "Spending 3 hours daily on administrative tasks instead of program work",
              "Board meetings consume entire weekends with prep and follow-up",
              "Grant reporting feels overwhelming and never compelling enough"
            ],
            goals: [
              "Spend more time directly with kids and families",
              "Streamline communication to be more effective",
              "Feel confident presenting to the board and funders",
              "Create systems that work even when she's not there"
            ],
            personality: [
              "Passionate about kids but exhausted by admin",
              "Tech-curious but intimidated by new tools",
              "Natural storyteller when talking about program impact",
              "Perfectionist who worries about making mistakes"
            ]
          },
          {
            name: "James Chen",
            role: "Development Associate",
            organization: "Urban Wildlife Conservation",
            background: "Recent college grad, loves the mission but struggles with donor communications",
            challenges: [
              "Writing thank you letters that sound genuine, not templated",
              "Creating compelling grant proposals under tight deadlines",
              "Managing donor database while building relationships",
              "Feeling confident in donor meetings and calls"
            ],
            goals: [
              "Write donor communications that build real relationships",
              "Create grant proposals that win funding",
              "Feel prepared and professional in every donor interaction",
              "Build systems for consistent donor stewardship"
            ],
            personality: [
              "Enthusiastic but nervous about donor relations",
              "Detail-oriented but sometimes gets stuck in perfectionism",
              "Collaborative and eager to learn",
              "Worried about saying the wrong thing to major donors"
            ]
          }
        ],
        chapterArc: {
          setup: {
            setting: "Hope Gardens Community Center, 7:30 AM on a Monday morning",
            character: "Maya sitting at her desk, coffee growing cold, staring at 47 unread emails",
            initialSituation: "Maya loves her work with kids, but she's spending more time on email than in programs",
            hook: "What if Maya could cut her email time in half while improving every message she sends?"
          },
          conflict: {
            challenge: "Administrative overwhelm is stealing time from mission-critical work",
            stakes: "Kids get less attention, programs suffer, Maya burns out",
            obstacles: ["Fear of technology", "Perfectionism", "Time constraints", "Worried about losing personal touch"],
            emotionalTension: "Maya questions if she's the right person for this role"
          },
          learning: {
            discovery: "AI can handle routine tasks while preserving authenticity and personal connection",
            mentor: "Lyra shows practical, step-by-step approaches",
            tools: ["Email composer", "Document generator", "Meeting prep", "Research assistant"],
            breakthroughs: ["First AI-written email gets positive response", "Board presentation comes together in 30 minutes", "Grant report writes itself"]
          },
          resolution: {
            solution: "Maya builds AI-powered workflows for all her regular tasks",
            implementation: "Systems work seamlessly in her daily routine",
            results: "2+ hours daily back for programs, more confident communications, less stress",
            celebration: "Maya leads a professional development session for her team"
          },
          transformation: {
            characterGrowth: "From overwhelmed admin to empowered leader",
            newCapabilities: "Efficient systems, confident communication, strategic thinking",
            futureVision: "Maya sees herself as a technology champion who helps other nonprofits",
            lessonsLearned: ["Technology amplifies humanity, doesn't replace it", "Systems create freedom", "Small changes compound into transformation"]
          }
        },
        lessonArcs: [
          {
            lessonId: 5,
            title: "AI Email Assistant",
            arc: {
              setup: {
                setting: "Maya's inbox at 7:30 AM - 47 new emails",
                character: "Maya feeling overwhelmed before her day even starts",
                initialSituation: "Critical emails buried under routine ones, response time slipping",
                hook: "One parent email could change everything..."
              },
              conflict: {
                challenge: "Parent complaints about program changes, board member needs immediate response, volunteer coordinator quit via email",
                stakes: "Program reputation, board relationship, summer camp staffing crisis",
                obstacles: ["Emotional emails need careful responses", "Professional tone required", "Time pressure mounting"],
                emotionalTension: "Maya worries one wrong word could damage years of relationship building"
              },
              learning: {
                discovery: "AI can craft responses that are both professional and heartfelt",
                mentor: "Lyra guides Maya through tone adjustments and response strategies",
                tools: ["AI Email Composer", "Difficult Conversation Helper", "Tone Adjustment"],
                breakthroughs: ["Parent thanks Maya for 'thoughtful and clear' response", "Board member impressed by professional follow-up"]
              },
              resolution: {
                solution: "Maya develops email templates and AI workflows for common scenarios",
                implementation: "Response time drops from hours to minutes, quality improves",
                results: "Parents feel heard, board communication improves, stress decreases",
                celebration: "Maya's assistant asks to learn her 'new email system'"
              },
              transformation: {
                characterGrowth: "From email anxiety to communication confidence",
                newCapabilities: "Clear, empathetic, efficient email communication",
                futureVision: "Maya becomes the go-to person for difficult conversations",
                lessonsLearned: ["AI preserves authenticity while improving clarity", "Good systems scale good intentions"]
              }
            },
            characterFocus: "Maya Rodriguez",
            toneBalance: {
              professional: 40,
              conversational: 35,
              empowering: 20,
              playful: 5
            }
          }
        ],
        interactiveIntegration: [
          {
            elementType: "ai_email_composer",
            storyContext: "Help Maya respond to the parent concern about program changes",
            characterConnection: "Maya needs to be empathetic but clear about the policy",
            emotionalStakes: "This relationship affects the child's continued participation"
          }
        ],
        contentBlocks: [
          {
            blockId: 1,
            currentContent: "Everyone spends too much time writing emails and worrying if they sound professional.",
            storyEnhancement: "Maya Rodriguez stares at her computer screen, her Monday morning coffee growing cold beside a stack of permission slips. It's 7:30 AM, and she already has 47 unread emails. As Program Director at Hope Gardens Community Center, Maya knows that somewhere in this digital pile are messages that could make or break her week: a parent complaint about new pickup procedures, a board member asking for 'urgent' budget details, and probably another volunteer cancellation for the summer camp she's desperately trying to staff.\n\nThis wasn't what Maya imagined when she left teaching to 'make a bigger impact' in nonprofit work. She thought she'd spend her days with kids and families, not wrestling with email anxiety at dawn. But here's the thing Maya doesn't know yet: today is about to change everything.",
            newLength: "Two paragraphs (~200 words)",
            narrativeFunction: "Hook and character establishment"
          }
        ]
      };

      setNarrativeContent(mockNarrative);
      toast.success('Narrative framework generated! Ready to transform your content.');
      onComplete?.();

    } catch (error) {
      console.error('Error generating narrative:', error);
      toast.error('Failed to generate narrative framework');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Narrative Content Creator</h2>
        </div>
        <p className="text-gray-600">Transform educational content into compelling stories that drive nonprofit learning and change</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="What needs storytelling magic?" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chapter Number</label>
            <Input
              type="number"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              placeholder="e.g., 2"
              min="1"
              max="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Who's our protagonist?" />
              </SelectTrigger>
              <SelectContent>
                {audienceTypes.map(audience => (
                  <SelectItem key={audience.value} value={audience.value}>
                    <div>
                      <div className="font-medium">{audience.label}</div>
                      <div className="text-sm text-gray-500">{audience.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Current Content (Optional)</label>
          <Textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="Paste existing content that needs storytelling enhancement..."
            className="h-32"
          />
        </div>
      </div>

      <Button 
        onClick={generateNarrativeContent}
        disabled={isGenerating || !contentType || !chapterNumber || !targetAudience}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Weaving narrative magic...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Engaging Narrative Content
          </div>
        )}
      </Button>

      {narrativeContent && (
        <div className="space-y-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Narrative Framework Generated</h3>
          </div>

          {/* Characters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Protagonist Characters
              </CardTitle>
            </CardHeader>
            <CardContent>
              {narrativeContent.characters.map((character, index) => (
                <div key={index} className="border-b pb-4 mb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{character.role}</Badge>
                    <h4 className="font-semibold">{character.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{character.background}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Challenges:</strong>
                      <ul className="list-disc list-inside ml-2 text-gray-600">
                        {character.challenges.slice(0, 2).map((challenge, i) => (
                          <li key={i}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Goals:</strong>
                      <ul className="list-disc list-inside ml-2 text-gray-600">
                        {character.goals.slice(0, 2).map((goal, i) => (
                          <li key={i}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Story Arc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Chapter Story Arc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-semibold text-blue-700">Setup</h5>
                  <p className="text-sm text-gray-600">{narrativeContent.chapterArc.setup.initialSituation}</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h5 className="font-semibold text-red-700">Conflict</h5>
                  <p className="text-sm text-gray-600">{narrativeContent.chapterArc.conflict.challenge}</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-700">Learning</h5>
                  <p className="text-sm text-gray-600">{narrativeContent.chapterArc.learning.discovery}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-semibold text-green-700">Transformation</h5>
                  <p className="text-sm text-gray-600">{narrativeContent.chapterArc.transformation.characterGrowth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Enhancement Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Content Transformation Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Before (Thin Content)</h5>
                  <div className="bg-red-50 p-3 rounded text-sm italic">
                    {narrativeContent.contentBlocks[0].currentContent}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">After (Rich Narrative)</h5>
                  <div className="bg-green-50 p-3 rounded text-sm">
                    {narrativeContent.contentBlocks[0].storyEnhancement}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Length: {narrativeContent.contentBlocks[0].newLength}</span>
                  <span>Function: {narrativeContent.contentBlocks[0].narrativeFunction}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Interactive Story Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {narrativeContent.interactiveIntegration.map((integration, index) => (
                <div key={index} className="border-b pb-3 mb-3 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{integration.elementType}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{integration.storyContext}</p>
                  <p className="text-xs text-gray-500">Stakes: {integration.emotionalStakes}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Update Chapter 2 content with narrative enhancements</li>
              <li>• Integrate character storylines with interactive components</li>
              <li>• Apply consistent tone and pacing across all lessons</li>
              <li>• Create templates for future chapter development</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};