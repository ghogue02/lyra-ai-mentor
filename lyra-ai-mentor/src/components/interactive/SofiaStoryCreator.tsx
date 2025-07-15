import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, RefreshCw, Copy, Download, Eye, Wand2 } from 'lucide-react';

interface StoryElements {
  protagonist: string;
  setting: string;
  conflict: string;
  theme: string;
  tone: string;
}

interface StorySection {
  title: string;
  content: string;
  wordCount: number;
}

const SofiaStoryCreator: React.FC = () => {
  const [storyElements, setStoryElements] = useState<Partial<StoryElements>>({});
  const [prompt, setPrompt] = useState('');
  const [generatedStory, setGeneratedStory] = useState<StorySection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyLength, setStoryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [genre, setGenre] = useState('');

  const genres = [
    'Personal Memoir', 'Inspirational', 'Educational', 'Community Impact',
    'Professional Journey', 'Overcoming Challenges', 'Cultural Heritage',
    'Innovation Story', 'Leadership Tale', 'Transformation Story'
  ];

  const toneOptions = [
    'Inspiring & Uplifting', 'Warm & Personal', 'Professional & Confident',
    'Authentic & Vulnerable', 'Energetic & Motivating', 'Reflective & Thoughtful'
  ];

  const storyPrompts = [
    'A moment when you realized your true calling',
    'How a small act of kindness changed everything',
    'The day you found your voice and used it',
    'Overcoming a fear that held you back',
    'A lesson learned from an unexpected teacher',
    'When failure led to your greatest success',
    'The story behind your biggest breakthrough',
    'How you turned a setback into a comeback'
  ];

  const generateStory = async () => {
    if (!prompt.trim() && Object.keys(storyElements).length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockStory: StorySection[] = [
      {
        title: 'Opening Hook',
        content: `The phone call came at 3:47 AM on a Tuesday. As Sofia reached for her phone in the darkness, she had no idea that this moment would completely reshape her understanding of authentic storytelling and the power of voice.

"Sofia, we need your help," whispered the voice on the other end. It was Maria, a young woman from the community center who had never spoken publicly before. "I have a story to tell, but I don't know how to find the words."`,
        wordCount: 78
      },
      {
        title: 'The Challenge',
        content: `For months, Sofia had been working with community members to help them discover their authentic voices. She believed deeply that everyone had a story worth telling - but Maria's situation was different. Maria had witnessed something important, something that could help others, but trauma had stolen her words.

"I know what I want to say," Maria continued, "but every time I try to speak, I freeze. The words get trapped somewhere between my heart and my mouth."

Sofia recognized this feeling. She had been there herself, years ago, when her own voice felt lost in a sea of expectations and self-doubt.`,
        wordCount: 98
      },
      {
        title: 'The Discovery',
        content: `"Maria," Sofia said gently, "what if we don't start with words? What if we start with feeling?"

That morning, Sofia drove to Maria's apartment with her audio recorder and a simple plan. Instead of asking Maria to tell her story chronologically, she asked her to describe the emotions first. The colors. The sensations. The moments that made her heart race.

As Maria began to speak about the feeling of hope she wanted to share with other young mothers, something magical happened. Her voice found its rhythm. Her words found their power. And Sofia realized she was witnessing the birth of authentic storytelling.`,
        wordCount: 105
      },
      {
        title: 'The Transformation',
        content: `Three weeks later, Maria stood before a crowd of 200 people at the community center's annual gathering. Her voice was strong, clear, and undeniably her own. She told her story of resilience, of finding strength in vulnerability, of how one conversation with Sofia had helped her reclaim her voice.

But the real transformation wasn't just Maria's. Sofia realized that her role wasn't to give people their voices - it was to help them remember they had always had them. Every person she worked with taught her something new about the courage it takes to speak authentically.

As she watched Maria receive a standing ovation, Sofia felt a deep satisfaction. This was why she did this work. This was the power of authentic storytelling - not just to share experiences, but to transform both the storyteller and the listener.`,
        wordCount: 142
      }
    ];
    
    setGeneratedStory(mockStory);
    setIsGenerating(false);
  };

  const updateStoryElement = (key: keyof StoryElements, value: string) => {
    setStoryElements(prev => ({ ...prev, [key]: value }));
  };

  const getTotalWordCount = () => {
    return generatedStory.reduce((total, section) => total + section.wordCount, 0);
  };

  const exportStory = () => {
    const fullStory = generatedStory.map(section => 
      `${section.title.toUpperCase()}\n\n${section.content}`
    ).join('\n\n---\n\n');
    
    navigator.clipboard.writeText(fullStory);
  };

  const enhanceWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const enhanced = generatedStory.map(section => ({
      ...section,
      content: section.content + '\n\n[AI Enhanced: Added sensory details, emotional depth, and improved flow for maximum impact.]'
    }));
    
    setGeneratedStory(enhanced);
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Sofia's Story Creator</CardTitle>
              <CardDescription>
                AI-powered story generation and editing for authentic narratives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story Setup */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Story Elements</CardTitle>
                  <CardDescription>Define the core elements of your story</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Prompts */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story Inspiration:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {storyPrompts.slice(0, 4).map((storyPrompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3"
                          onClick={() => setPrompt(storyPrompt)}
                        >
                          <span className="text-xs">{storyPrompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Prompt */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Or write your own story idea:</label>
                    <Textarea
                      placeholder="Describe the story you want to tell..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Genre & Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Genre:</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                      >
                        <option value="">Select genre...</option>
                        {genres.map((g, index) => (
                          <option key={index} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Length:</label>
                      <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={storyLength}
                        onChange={(e) => setStoryLength(e.target.value as any)}
                      >
                        <option value="short">Short (300-500 words)</option>
                        <option value="medium">Medium (500-800 words)</option>
                        <option value="long">Long (800-1200 words)</option>
                      </select>
                    </div>
                  </div>

                  {/* Story Elements Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="Main character or protagonist..."
                      value={storyElements.protagonist || ''}
                      onChange={(e) => updateStoryElement('protagonist', e.target.value)}
                    />
                    <Input
                      placeholder="Setting (time, place, context)..."
                      value={storyElements.setting || ''}
                      onChange={(e) => updateStoryElement('setting', e.target.value)}
                    />
                    <Input
                      placeholder="Central conflict or challenge..."
                      value={storyElements.conflict || ''}
                      onChange={(e) => updateStoryElement('conflict', e.target.value)}
                    />
                    <Input
                      placeholder="Theme or message..."
                      value={storyElements.theme || ''}
                      onChange={(e) => updateStoryElement('theme', e.target.value)}
                    />
                  </div>

                  {/* Tone Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {toneOptions.map((tone, index) => (
                        <Button
                          key={index}
                          variant={storyElements.tone === tone ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => updateStoryElement('tone', tone)}
                        >
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateStory}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Creating Your Story...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Generated Story */}
            <div className="space-y-4">
              {generatedStory.length > 0 ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Your Generated Story</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {getTotalWordCount()} words
                        </Badge>
                        <Badge variant="outline">
                          {generatedStory.length} sections
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={exportStory}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={enhanceWithAI}>
                        <Wand2 className="w-4 h-4 mr-1" />
                        AI Enhance
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {generatedStory.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-yellow-800">{section.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {section.wordCount} words
                          </Badge>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed text-gray-800">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Story Analysis */}
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Story Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">8.7/10</div>
                            <div className="text-sm text-gray-600">Authenticity Score</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">Strong</div>
                            <div className="text-sm text-gray-600">Emotional Impact</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium text-green-800 mb-2">Sofia's Feedback:</h4>
                          <p className="text-sm text-green-700">
                            This story has excellent emotional resonance and authentic voice. 
                            The vulnerability and transformation arc will connect deeply with readers. 
                            Consider adding more sensory details to enhance immersion.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                    <p className="text-center">
                      Set up your story elements and click Generate<br />
                      to create your authentic narrative
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaStoryCreator;