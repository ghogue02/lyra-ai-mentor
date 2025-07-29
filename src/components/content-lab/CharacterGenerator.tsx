import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Users, Sparkles, MessageSquare, Target, BookOpen } from "lucide-react";
import { TemplateContentFormatter } from "@/components/ui/TemplateContentFormatter";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise: string;
  color: string;
}

interface GeneratedContent {
  character: Character;
  lessonTitle: string;
  introduction: string;
  challenge: string;
  solution: string;
  interactiveElements: string[];
  outcomes: string[];
}

const characters: Character[] = [
  {
    id: "sofia",
    name: "Sofia",
    role: "Communication Specialist",
    personality: "Empathetic, encouraging, storytelling-focused",
    expertise: "Voice, presentation, narrative techniques",
    color: "bg-purple-500"
  },
  {
    id: "david",
    name: "David",
    role: "Data Analyst",
    personality: "Methodical, curious, mystery-solving approach",
    expertise: "Analytics, problem-solving, pattern recognition",
    color: "bg-blue-500"
  },
  {
    id: "rachel",
    name: "Rachel",
    role: "Operations Manager",
    personality: "Systematic, efficient, optimization-focused",
    expertise: "Workflows, automation, process improvement",
    color: "bg-green-500"
  },
  {
    id: "alex",
    name: "Alex",
    role: "Team Leader",
    personality: "Collaborative, adaptive, people-focused",
    expertise: "Change management, team dynamics, leadership",
    color: "bg-orange-500"
  }
];

export const CharacterGenerator = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [lessonTopic, setLessonTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateContent = async () => {
    if (!selectedCharacter || !lessonTopic.trim()) {
      toast.error("Please select a character and provide a lesson topic");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 400);

      const character = characters.find(c => c.id === selectedCharacter)!;

      // Call the generate-character-content edge function
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: selectedCharacter,
          contentType: 'lesson',
          topic: lessonTopic,
          targetAudience: 'professional learners'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        console.error("Generation error:", error);
        toast.error("Failed to generate content. Please try again.");
        return;
      }

      if (!data.success) {
        toast.error(data.error || "Content generation failed");
        return;
      }

      // Parse AI-generated content
      const aiContent = data.content;
      
      // Structure the content for display
      const content: GeneratedContent = {
        character,
        lessonTitle: data.title || `${character.name}'s Guide to ${lessonTopic}`,
        introduction: extractSection(aiContent, 'introduction') || `Hi there! I'm ${character.name}, your ${character.role.toLowerCase()}. I've been working in ${character.expertise.toLowerCase()} for years, and I'm excited to share what I've learned about ${lessonTopic.toLowerCase()}. Let's dive in together!`,
        challenge: extractSection(aiContent, 'challenge') || `Many people struggle with ${lessonTopic.toLowerCase()} because they haven't found the right approach for their unique situation. I remember when I first encountered this challenge - it felt overwhelming, but I discovered a systematic way to break it down.`,
        solution: extractSection(aiContent, 'solution') || `Here's my proven framework for mastering ${lessonTopic.toLowerCase()}: First, we'll identify your specific goals. Then, I'll show you the exact tools and techniques I use daily. Finally, we'll practice together so you feel confident applying these skills.`,
        interactiveElements: extractList(aiContent, 'interactive') || [
          "Self-assessment quiz to identify current skill level",
          "Interactive tool demonstration with hands-on practice",
          "Real-world scenario simulation",
          "Progress tracking dashboard",
          "Peer collaboration exercise"
        ],
        outcomes: extractList(aiContent, 'outcomes') || [
          `Clear understanding of ${lessonTopic.toLowerCase()} fundamentals`,
          "Practical skills you can apply immediately",
          "Confidence in tackling similar challenges",
          "Personal action plan for continued growth",
          "Connection with like-minded learners"
        ]
      };

      setGeneratedContent(content);
      toast.success(`Content generated for ${character.name} using AI!`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions to extract structured data from AI content
  const extractSection = (content: string, sectionType: string): string => {
    const patterns = {
      introduction: /(?:introduction|hello|hi|welcome)[^.]*[.!?]/gi,
      challenge: /(?:challenge|problem|struggle|difficulty)[^.]*[.!?]/gi,
      solution: /(?:solution|framework|approach|method)[^.]*[.!?]/gi
    };
    
    const matches = content.match(patterns[sectionType as keyof typeof patterns]) || [];
    return matches.join(' ').trim();
  };

  const extractList = (content: string, listType: string): string[] => {
    const patterns = {
      interactive: /(?:interactive|activity|exercise|practice)[^.]*[.!?]/gi,
      outcomes: /(?:outcome|result|benefit|learn)[^.]*[.!?]/gi
    };
    
    const matches = content.match(patterns[listType as keyof typeof patterns]) || [];
    return matches.slice(0, 5).map(item => item.trim());
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Character</label>
            <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a character..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${character.color}`} />
                      <span>{character.name} - {character.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Lesson Topic</label>
            <Textarea
              placeholder="e.g., Effective Email Communication, Data Visualization, Process Optimization..."
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        {selectedCharacter && (
          <Card className="border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${characters.find(c => c.id === selectedCharacter)?.color} flex items-center justify-center text-white font-bold`}>
                  {characters.find(c => c.id === selectedCharacter)?.name[0]}
                </div>
                <div>
                  <div className="font-medium">{characters.find(c => c.id === selectedCharacter)?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {characters.find(c => c.id === selectedCharacter)?.personality}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={generateContent} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Generating character-specific content...
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>

      {generatedContent && (
        <div className="space-y-4">
          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {generatedContent.lessonTitle}
              </CardTitle>
              <CardDescription>
                Generated content for {generatedContent.character.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Introduction</span>
                  </div>
                  <TemplateContentFormatter 
                    content={generatedContent.introduction}
                    contentType="lesson"
                    variant="compact"
                    showMergeFieldTypes={false}
                    className="admin-formatted-content bg-muted/50"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Challenge</span>
                  </div>
                  <TemplateContentFormatter 
                    content={generatedContent.challenge}
                    contentType="lesson"
                    variant="compact"
                    showMergeFieldTypes={false}
                    className="admin-formatted-content bg-muted/50"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Solution</span>
                  </div>
                  <TemplateContentFormatter 
                    content={generatedContent.solution}
                    contentType="lesson"
                    variant="compact"
                    showMergeFieldTypes={false}
                    className="admin-formatted-content bg-muted/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium mb-2">Interactive Elements</div>
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {generatedContent.interactiveElements.map((element, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-1">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{element}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <div className="font-medium mb-2">Learning Outcomes</div>
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {generatedContent.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="secondary" className="mt-1">
                            ✓
                          </Badge>
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};