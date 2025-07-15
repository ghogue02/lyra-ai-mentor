import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, LineChart, PieChart, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DavidDataStoryFinderProps {
  onComplete?: () => void;
}

export const DavidDataStoryFinder: React.FC<DavidDataStoryFinderProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'template' | 'build' | 'success'>('context');
  const [storyTemplate, setStoryTemplate] = useState('');
  const [dataStory, setDataStory] = useState('');

  const templates = [
    {
      name: 'The Transformation Journey',
      pattern: '[Baseline Data] → [Intervention] → [Outcome Data] → [Impact Story]',
      example: '30% employment rate → Skills training program → 85% employment rate → Maria now leads job placement for others'
    },
    {
      name: 'The Comparison Revelation', 
      pattern: '[Our Results] vs [Industry Standard] → [What This Means] → [Why It Matters]',
      example: '95% retention vs 60% industry average → Higher satisfaction → Sustainable community impact'
    },
    {
      name: 'The Hidden Pattern',
      pattern: '[Unexpected Finding] → [Investigation] → [Root Cause] → [Strategic Insight]',
      example: 'Weekend participants 40% more successful → Family support present → New program design'
    }
  ];

  const enhanceStory = () => {
    if (!dataStory) return;
    
    const enhanced = `${dataStory}

DATA STORYTELLING ENHANCEMENT:
• Emotional connection: Human faces behind the numbers
• Context provided: Industry benchmarks and historical comparison
• Visual narrative: Clear progression from problem to solution
• Call to action: Specific next steps for stakeholders

This data story demonstrates measurable impact while maintaining human connection, making complex information accessible and actionable for any audience.`;

    toast({
      title: "✨ Data Story Enhanced!",
      description: "Your story now balances data credibility with human connection",
    });
    
    setCurrentPhase('success');
  };

  const handleComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'david-data-story-finder',
        lesson_id: 16,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => onComplete?.(), 3000);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {currentPhase === 'context' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-green-100 rounded-full">
                <LineChart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">David's Data Storytelling Challenge</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                David's insights are powerful, but the board's eyes still glaze over during presentations. 
                Numbers need narratives. Data needs drama. Time to weave compelling stories from statistics.
              </p>
            </div>
            
            <Button onClick={() => setCurrentPhase('template')} className="w-full bg-green-600 hover:bg-green-700">
              Master Data Storytelling <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentPhase === 'template' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Choose Your Data Story Template</h2>
            
            {templates.map((template, idx) => (
              <Card key={idx} className={`cursor-pointer ${storyTemplate === template.name ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => setStoryTemplate(template.name)}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-green-700">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{template.pattern}</p>
                  <p className="text-xs italic mt-2 bg-gray-50 p-2 rounded">{template.example}</p>
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={() => setCurrentPhase('build')} disabled={!storyTemplate} 
                    className="w-full bg-green-600 hover:bg-green-700">
              Build Story <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentPhase === 'build' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center">Craft Your Data Story</h2>
            <Textarea value={dataStory} onChange={(e) => setDataStory(e.target.value)}
                     placeholder="Write your data story using the selected template..."
                     className="min-h-[200px]" />
            
            <Button onClick={enhanceStory} disabled={!dataStory} className="w-full bg-green-600 hover:bg-green-700">
              <Sparkles className="w-4 h-4 mr-2" /> Enhance Story
            </Button>
          </div>
        )}

        {currentPhase === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Zap className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700">Data Story Mastery Achieved!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              David now weaves compelling narratives from complex data, making every presentation engaging and actionable.
            </p>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Continue David's Journey
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};