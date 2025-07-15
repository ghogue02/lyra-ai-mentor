import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shuffle, Heart, Lightbulb, Copy, RefreshCw, Sparkles } from 'lucide-react';

interface StoryPrompt {
  id: string;
  category: 'personal' | 'community' | 'growth' | 'relationships' | 'challenges' | 'celebration';
  prompt: string;
  subPrompts: string[];
  emotionalTone: string;
  difficulty: 'easy' | 'medium' | 'challenging';
}

const SofiaStoryStarter: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<StoryPrompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>([]);
  const [promptHistory, setPromptHistory] = useState<StoryPrompt[]>([]);

  const storyPrompts: StoryPrompt[] = [
    {
      id: '1',
      category: 'personal',
      prompt: 'A moment when you surprised yourself with your own strength',
      subPrompts: [
        'What was the situation that demanded this strength?',
        'How did you feel before you realized you could handle it?',
        'What did this teach you about yourself?'
      ],
      emotionalTone: 'Empowering',
      difficulty: 'easy'
    },
    {
      id: '2',
      category: 'community',
      prompt: 'The day you realized you belonged somewhere',
      subPrompts: [
        'What made this place or group feel like home?',
        'Who were the people who welcomed you?',
        'How did it change your sense of self?'
      ],
      emotionalTone: 'Heartwarming',
      difficulty: 'easy'
    },
    {
      id: '3',
      category: 'growth',
      prompt: 'A mistake that became your greatest teacher',
      subPrompts: [
        'What did you think would happen vs. what actually happened?',
        'How did you process the disappointment or embarrassment?',
        'What wisdom do you carry from this experience now?'
      ],
      emotionalTone: 'Reflective',
      difficulty: 'medium'
    },
    {
      id: '4',
      category: 'relationships',
      prompt: 'Someone who saw potential in you before you saw it yourself',
      subPrompts: [
        'How did they show their belief in you?',
        'What resistance did you feel to their encouragement?',
        'How did their faith change your trajectory?'
      ],
      emotionalTone: 'Grateful',
      difficulty: 'easy'
    },
    {
      id: '5',
      category: 'challenges',
      prompt: 'The hardest conversation you\'ve ever had to have',
      subPrompts: [
        'What made this conversation necessary despite being difficult?',
        'How did you prepare yourself emotionally?',
        'What did you learn about courage from this experience?'
      ],
      emotionalTone: 'Courageous',
      difficulty: 'challenging'
    },
    {
      id: '6',
      category: 'celebration',
      prompt: 'A small victory that felt enormous to you',
      subPrompts: [
        'Why was this particular achievement so meaningful?',
        'Who did you want to share the news with first?',
        'How do you still carry the joy from this moment?'
      ],
      emotionalTone: 'Joyful',
      difficulty: 'easy'
    },
    {
      id: '7',
      category: 'personal',
      prompt: 'The moment you started listening to your own voice instead of others',
      subPrompts: [
        'What external voices had been guiding you before?',
        'What finally made you trust your own instincts?',
        'How did this shift change your decisions?'
      ],
      emotionalTone: 'Empowering',
      difficulty: 'medium'
    },
    {
      id: '8',
      category: 'community',
      prompt: 'A time when you stood up for someone else',
      subPrompts: [
        'What was at stake if you stayed silent?',
        'How did you find the courage to speak up?',
        'What was the impact of your actions?'
      ],
      emotionalTone: 'Brave',
      difficulty: 'medium'
    },
    {
      id: '9',
      category: 'growth',
      prompt: 'Something you used to be ashamed of that you now embrace',
      subPrompts: [
        'What messages did you receive about this part of yourself?',
        'What helped you shift from shame to acceptance?',
        'How has embracing this changed your life?'
      ],
      emotionalTone: 'Healing',
      difficulty: 'challenging'
    },
    {
      id: '10',
      category: 'relationships',
      prompt: 'The goodbye that changed everything',
      subPrompts: [
        'What made this goodbye different from others?',
        'How did you carry this person or experience with you?',
        'What new chapter did this ending make possible?'
      ],
      emotionalTone: 'Bittersweet',
      difficulty: 'challenging'
    },
    {
      id: '11',
      category: 'challenges',
      prompt: 'When you had to choose between comfort and growth',
      subPrompts: [
        'What was comfortable but limiting about your situation?',
        'What made the growth option scary but appealing?',
        'How did you make the final decision?'
      ],
      emotionalTone: 'Determined',
      difficulty: 'medium'
    },
    {
      id: '12',
      category: 'celebration',
      prompt: 'A moment when you felt truly proud of who you are',
      subPrompts: [
        'What actions or qualities were you recognizing in yourself?',
        'How long had you been working toward this moment?',
        'Who would you want to tell about this feeling?'
      ],
      emotionalTone: 'Proud',
      difficulty: 'easy'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Stories', count: storyPrompts.length },
    { id: 'personal', label: 'Personal Growth', count: storyPrompts.filter(p => p.category === 'personal').length },
    { id: 'community', label: 'Community & Belonging', count: storyPrompts.filter(p => p.category === 'community').length },
    { id: 'growth', label: 'Learning & Growth', count: storyPrompts.filter(p => p.category === 'growth').length },
    { id: 'relationships', label: 'Relationships', count: storyPrompts.filter(p => p.category === 'relationships').length },
    { id: 'challenges', label: 'Challenges & Courage', count: storyPrompts.filter(p => p.category === 'challenges').length },
    { id: 'celebration', label: 'Joy & Celebration', count: storyPrompts.filter(p => p.category === 'celebration').length }
  ];

  const getRandomPrompt = () => {
    const availablePrompts = selectedCategory === 'all' 
      ? storyPrompts 
      : storyPrompts.filter(p => p.category === selectedCategory);
    
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    setCurrentPrompt(randomPrompt);
    
    // Add to history if not already there
    if (!promptHistory.find(p => p.id === randomPrompt.id)) {
      setPromptHistory(prev => [randomPrompt, ...prev.slice(0, 4)]);
    }
  };

  const toggleFavorite = (promptId: string) => {
    setFavoritePrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const copyPrompt = (prompt: StoryPrompt) => {
    const fullPrompt = `${prompt.prompt}\n\nReflection questions:\n${prompt.subPrompts.map(q => `• ${q}`).join('\n')}`;
    navigator.clipboard.writeText(fullPrompt);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'text-purple-600',
      community: 'text-blue-600',
      growth: 'text-green-600',
      relationships: 'text-pink-600',
      challenges: 'text-orange-600',
      celebration: 'text-yellow-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Story Starter</CardTitle>
              <CardDescription>
                Quick story prompt generator to spark authentic narratives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filters */}
          <div className="space-y-3">
            <h3 className="font-semibold">Choose Story Type:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="capitalize"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Prompt Generator */}
          <div className="text-center space-y-4">
            <Button
              onClick={getRandomPrompt}
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 px-8 py-6 text-lg"
            >
              <Shuffle className="w-6 h-6 mr-3" />
              Generate Story Prompt
            </Button>
            <p className="text-sm text-gray-600">
              Get a personalized story prompt to spark your authentic narrative
            </p>
          </div>

          {/* Current Prompt Display */}
          {currentPrompt && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl text-yellow-800">Your Story Prompt</CardTitle>
                    <Badge className={getDifficultyColor(currentPrompt.difficulty)}>
                      {currentPrompt.difficulty}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(currentPrompt.category)}>
                      {currentPrompt.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(currentPrompt.id)}
                      className={favoritePrompts.includes(currentPrompt.id) ? 'text-red-600' : 'text-gray-400'}
                    >
                      <Heart className={`w-4 h-4 ${favoritePrompts.includes(currentPrompt.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPrompt(currentPrompt)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-yellow-600">
                  Emotional tone: {currentPrompt.emotionalTone}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3 text-lg">
                    {currentPrompt.prompt}
                  </h3>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Reflection Questions:
                  </h4>
                  <ul className="space-y-2">
                    {currentPrompt.subPrompts.map((subPrompt, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{subPrompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Start Writing
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Get Another Prompt
                  </Button>
                  <Button size="sm" variant="outline">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Story Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prompt History */}
          {promptHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Prompts</CardTitle>
                <CardDescription>Your story prompt history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promptHistory.map((prompt, index) => (
                    <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{prompt.prompt}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(prompt.category)}`}>
                            {prompt.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(prompt.difficulty)}`}>
                            {prompt.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentPrompt(prompt)}
                        >
                          <BookOpen className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(prompt.id)}
                          className={favoritePrompts.includes(prompt.id) ? 'text-red-600' : 'text-gray-400'}
                        >
                          <Heart className={`w-3 h-3 ${favoritePrompts.includes(prompt.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Favorite Prompts */}
          {favoritePrompts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600 fill-current" />
                  Favorite Prompts
                </CardTitle>
                <CardDescription>Your saved story prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {storyPrompts.filter(p => favoritePrompts.includes(p.id)).map((prompt) => (
                    <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{prompt.prompt}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(prompt.category)}`}>
                            {prompt.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(prompt.difficulty)}`}>
                            {prompt.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentPrompt(prompt)}
                        >
                          <BookOpen className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyPrompt(prompt)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sofia's Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Sofia's Story Starting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">Getting Started:</h4>
                  <ul className="space-y-1">
                    <li>• Don't overthink - trust your first instinct</li>
                    <li>• Start with how the moment felt, not what happened</li>
                    <li>• Write like you're talking to a close friend</li>
                    <li>• Focus on one specific moment, not a whole timeline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Making It Authentic:</h4>
                  <ul className="space-y-1">
                    <li>• Include details only you would remember</li>
                    <li>• Share what you wish you could tell your past self</li>
                    <li>• Be honest about the messy, imperfect parts</li>
                    <li>• Ask yourself: "What would I want others to know?"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaStoryStarter;