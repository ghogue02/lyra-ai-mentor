import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LyraChat } from './LyraChat';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { 
  MessageCircle, 
  Sparkles, 
  User, 
  Mail, 
  BarChart3, 
  Workflow, 
  Users,
  Mic,
  Volume2
} from 'lucide-react';

export const LyraChatDemo: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('maya');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { getStory, getAllStories } = useCharacterStory();
  
  const characters = getAllStories();
  const currentStory = getStory(selectedCharacter);

  const characterIcons: Record<string, React.ReactNode> = {
    maya: <Mail className="w-5 h-5" />,
    sofia: <MessageCircle className="w-5 h-5" />,
    david: <BarChart3 className="w-5 h-5" />,
    rachel: <Workflow className="w-5 h-5" />,
    alex: <Users className="w-5 h-5" />
  };

  const lessonContexts: Record<string, any> = {
    maya: {
      chapterTitle: "Chapter 3: Communication Mastery",
      lessonTitle: "AI-Powered Email Excellence",
      content: "Master professional email communication with AI assistance"
    },
    sofia: {
      chapterTitle: "Chapter 4: Storytelling Impact",
      lessonTitle: "Finding Your Authentic Voice",
      content: "Discover how to tell compelling stories that resonate"
    },
    david: {
      chapterTitle: "Chapter 5: Data Storytelling",
      lessonTitle: "Making Data Come Alive",
      content: "Transform complex data into clear, impactful narratives"
    },
    rachel: {
      chapterTitle: "Chapter 6: Automation Excellence",
      lessonTitle: "Building Smart Workflows",
      content: "Design and implement efficient automation systems"
    },
    alex: {
      chapterTitle: "Chapter 2: Change Leadership",
      lessonTitle: "Leading AI Transformation",
      content: "Guide your organization through successful AI adoption"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Lyra Chat Interface Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience Lyra's adaptive personality system that adjusts to different character contexts
            and provides personalized AI mentoring.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Adaptive Personality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Lyra adapts her communication style based on the character context,
                  providing specialized guidance for each learning journey.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mic className="w-5 h-5 text-cyan-600" />
                  Voice Interaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Speak naturally with voice input and hear Lyra's responses
                  with text-to-speech for a more engaging experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  Smart Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Context-aware quick actions help you get the most relevant
                  assistance based on your current learning focus.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Character Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Character Context</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <TabsList className="grid grid-cols-5 w-full">
                {characters.map((story) => (
                  <TabsTrigger
                    key={story.id}
                    value={story.id}
                    className="flex items-center gap-2"
                  >
                    {characterIcons[story.id]}
                    <span className="hidden sm:inline">{story.name.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {characters.map((story) => (
                <TabsContent key={story.id} value={story.id} className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 flex items-center justify-center">
                        {characterIcons[story.id]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{story.name}</h3>
                        <p className="text-gray-600">{story.role} at {story.organization}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {story.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 italic">"{story.quote}"</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-purple-700">Challenge</p>
                        <p className="text-sm text-gray-700 mt-1">{story.challenge}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-cyan-700">Impact</p>
                        <p className="text-sm text-gray-700 mt-1">{story.impact}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Try Lyra Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            onClick={() => setIsChatExpanded(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with Lyra as {currentStory?.name.split(' ')[0]}
          </Button>
          
          <p className="text-sm text-gray-600 mt-4">
            Lyra will adapt her personality and suggestions based on {currentStory?.name}'s journey
          </p>
        </motion.div>

        {/* Lyra Chat Component */}
        <LyraChat
          isExpanded={isChatExpanded}
          onToggleExpanded={() => setIsChatExpanded(!isChatExpanded)}
          lessonContext={lessonContexts[selectedCharacter]}
          characterContext={selectedCharacter}
        />
      </div>
    </div>
  );
};