import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, BookOpen, Star, Camera, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StoryFramework {
  id: string;
  name: string;
  structure: string[];
  description: string;
  example: string;
}

interface SofiaStoryBreakthroughProps {
  onComplete?: () => void;
}

export const SofiaStoryBreakthrough: React.FC<SofiaStoryBreakthroughProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'framework' | 'build' | 'enhance' | 'success'>('context');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [storyDraft, setStoryDraft] = useState('');
  const [enhancedStory, setEnhancedStory] = useState('');

  const storyFrameworks: StoryFramework[] = [
    {
      id: 'hero-journey',
      name: 'Hero\'s Journey',
      structure: ['Challenge', 'Intervention', 'Transformation', 'New Reality'],
      description: 'Follow one person\'s complete transformation through your program',
      example: 'Luna faced eviction with three children... Through our housing program... Today she\'s a homeowner and volunteers as a peer counselor...'
    },
    {
      id: 'before-after',
      name: 'Before & After',
      structure: ['Life Before', 'The Turning Point', 'Life After', 'Ripple Effect'],
      description: 'Show dramatic contrast between life situations',
      example: 'Before: Marcus couldn\'t read past 3rd grade level at age 16... After: He graduated high school and is now studying education...'
    },
    {
      id: 'community-impact',
      name: 'Community Impact',
      structure: ['Problem in Community', 'Your Solution', 'Collective Change', 'Future Vision'],
      description: 'Demonstrate how individual help creates community transformation',
      example: 'Our neighborhood had the highest dropout rate... Our mentorship program... Now local businesses actively recruit our graduates...'
    },
    {
      id: 'breakthrough-moment',
      name: 'Breakthrough Moment',
      structure: ['Struggle Period', 'Critical Moment', 'Breakthrough', 'New Possibilities'],
      description: 'Focus on the pivotal moment when everything changed',
      example: 'For months, Sarah attended job training but kept failing interviews... Then one day, she realized...'
    }
  ];

  const selectedFrameworkData = storyFrameworks.find(f => f.id === selectedFramework);

  const enhanceStory = async () => {
    if (!storyDraft || !selectedFrameworkData) return;
    
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement
    const enhancement = `${storyDraft}

AI STORYTELLING ENHANCEMENT:

🎭 EMOTIONAL ARC DEEPENED:
Your story now follows a clear emotional journey that readers can follow and feel invested in.

📊 IMPACT AMPLIFIED:
Added specific details and outcomes that demonstrate the true scope of transformation.

🎯 AUDIENCE CONNECTION:
Language optimized to resonate with donors, volunteers, and community stakeholders.

✨ NARRATIVE POLISH:
Professional storytelling techniques applied while maintaining authentic voice and genuine emotion.

This story demonstrates not just what you do, but the profound human impact of your mission. It will move hearts and inspire action.`;

    setEnhancedStory(enhancement);
    
    toast({
      title: "✨ Story Enhancement Complete!",
      description: "Your breakthrough story is now ready to captivate any audience",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'sofia-story-breakthrough',
        lesson_id: 13,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-amber-100 rounded-full">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold">Sofia's Story Breakthrough</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>Sofia has her mission and her voice, but the board wants "compelling stories that demonstrate impact." The foundation's annual gala is in 3 weeks, and she needs one breakthrough story that captures everything.</p>
                <p className="font-semibold text-amber-700">This story could unlock major funding—or leave donors unmoved.</p>
                <p>Let's help Sofia craft a narrative that showcases the true transformation happening through her work.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll create:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-600" />
                  <span>Compelling narrative with clear structure</span>
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>Vivid scenes that help audience visualize impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Breakthrough moment that demonstrates transformation</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('framework')}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Create Sofia's Breakthrough Story
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'framework':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Choose Your Story Framework</h2>
              <p className="text-gray-600">Which structure best fits your breakthrough story?</p>
            </div>
            
            <div className="grid gap-4">
              {storyFrameworks.map((framework) => (
                <Card 
                  key={framework.id}
                  className={`cursor-pointer transition-all ${
                    selectedFramework === framework.id ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedFramework(framework.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-amber-700">{framework.name}</h3>
                        {selectedFramework === framework.id && <span className="text-amber-600">✓ Selected</span>}
                      </div>
                      
                      <p className="text-gray-600 text-sm">{framework.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {framework.structure.map((step, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                            {idx + 1}. {step}
                          </span>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded text-sm italic">
                        Example: {framework.example}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentPhase('build')}
                disabled={!selectedFramework}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                Build Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Write Your Breakthrough Story</h2>
              <p className="text-gray-600">Using the {selectedFrameworkData?.name} framework</p>
            </div>
            
            {selectedFrameworkData && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-amber-700 mb-3">Your Story Structure:</h3>
                  <div className="space-y-2">
                    {selectedFrameworkData.structure.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Write your breakthrough story following the framework above:
              </label>
              <Textarea
                value={storyDraft}
                onChange={(e) => setStoryDraft(e.target.value)}
                placeholder="Tell the story of transformation that demonstrates your program's true impact..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-gray-500">
                Tip: Include specific details, emotions, and concrete outcomes that bring the story to life.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('framework')}
                className="flex-1"
              >
                Change Framework
              </Button>
              <Button 
                onClick={enhanceStory}
                disabled={!storyDraft}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Story
              </Button>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Sofia's Breakthrough Story</h2>
              <p className="text-gray-600">AI-enhanced for maximum impact</p>
            </div>
            
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedStory}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Story Impact</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Clear emotional arc</li>
                    <li>• Concrete transformation</li>
                    <li>• Audience connection</li>
                    <li>• Call to action ready</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">Usage Ideas</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Annual gala presentation</li>
                    <li>• Grant applications</li>
                    <li>• Newsletter features</li>
                    <li>• Board meetings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('build')}
                className="flex-1"
              >
                Edit Story
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Story
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Breakthrough Story Complete!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">Sofia now has a compelling narrative that showcases real transformation!</p>
                <p>This story will captivate audiences, move donors to action, and demonstrate the profound impact of her organization's work.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-amber-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Sofia's Story Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Structured narrative that captivates</li>
                <li>✅ Emotional connection with audiences</li>
                <li>✅ Clear demonstration of impact</li>
                <li>✅ Versatile for multiple communications</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: Sofia learns to scale this storytelling approach across all communications...
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};