import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ChevronRight, Users, BookOpen, Target, Lightbulb } from 'lucide-react';
import { StoryIntegration, StoryBadge } from '@/components/StoryIntegration';
import { CharacterHelp, CharacterTip } from '@/components/CharacterHelp';
import { SkillApplication, SkillProgress } from '@/components/SkillApplication';
import { useCharacterTheme } from '@/hooks/useCharacterTheme';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';

const StoryIntegrationDemo = () => {
  const [activeCharacter, setActiveCharacter] = useState('maya');
  const [currentStep, setCurrentStep] = useState(1);
  const { getAllStories } = useCharacterStory();
  const stories = getAllStories();
  
  // Apply character theme
  useCharacterTheme(activeCharacter);
  
  const characterScenarios = {
    maya: {
      skill: 'Professional Email Writing',
      scenario: 'Write a response to a concerned parent about their child\'s progress',
      outcome: 'Clear, empathetic email that addresses concerns and builds partnership',
      example: 'Reduced parent complaints by 75% and increased volunteer signups by 40%'
    },
    sofia: {
      skill: 'Impact Storytelling',
      scenario: 'Transform program data into a compelling donor narrative',
      outcome: 'Story that connects emotionally while demonstrating measurable impact',
      example: 'One story in her grant proposal secured $500K in funding'
    },
    david: {
      skill: 'Data Visualization',
      scenario: 'Present quarterly impact metrics to the board',
      outcome: 'Clear, engaging presentation that drives strategic decisions',
      example: 'Board increased program budget by 30% after seeing the impact clearly'
    },
    rachel: {
      skill: 'Workflow Automation',
      scenario: 'Automate volunteer onboarding process',
      outcome: 'Streamlined system that saves 5 hours per week',
      example: 'Onboarding time reduced from 2 weeks to 3 days'
    },
    alex: {
      skill: 'Change Leadership',
      scenario: 'Introduce AI tools to a skeptical team',
      outcome: 'Team embraces new tools and improves efficiency by 40%',
      example: 'Transformed the most resistant team member into the biggest AI champion'
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Story-Integrated Learning Experience
            </h1>
            <BookOpen className="w-8 h-8 text-cyan-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience how real nonprofit professionals transformed their work with AI. 
            Every feature is based on actual success stories and proven methods.
          </p>
        </div>
        
        {/* Character Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Learning Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stories.map(story => (
              <Button
                key={story.id}
                variant={activeCharacter === story.id ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  setActiveCharacter(story.id);
                  setCurrentStep(1);
                }}
                style={{
                  backgroundColor: activeCharacter === story.id ? story.color : 'transparent',
                  borderColor: story.color,
                  color: activeCharacter === story.id ? 'white' : story.color
                }}
              >
                <div className="text-2xl font-bold">
                  {story.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-sm">{story.name.split(' ')[0]}</div>
                <div className="text-xs opacity-80">{story.skills[0]}</div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="story">📖 Their Story</TabsTrigger>
            <TabsTrigger value="learn">🎯 Learn Method</TabsTrigger>
            <TabsTrigger value="practice">💪 Practice</TabsTrigger>
            <TabsTrigger value="apply">🚀 Apply</TabsTrigger>
          </TabsList>
          
          {/* Story Tab */}
          <TabsContent value="story" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StoryIntegration 
                characterId={activeCharacter} 
                variant="full"
                showQuote={true}
                showMetrics={true}
                showImpact={true}
              />
              
              <Card className="p-6 character-card">
                <h3 className="text-xl font-semibold mb-4">Why This Matters</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">The Challenge</h4>
                      <p className="text-sm text-gray-600">
                        {stories.find(s => s.id === activeCharacter)?.challenge}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-medium">The Solution</h4>
                      <p className="text-sm text-gray-600">
                        {stories.find(s => s.id === activeCharacter)?.transformation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-cyan-100 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">
                      Ready to achieve similar results? Let's learn {stories.find(s => s.id === activeCharacter)?.name.split(' ')[0]}'s method!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Learn Tab */}
          <TabsContent value="learn" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Learn {stories.find(s => s.id === activeCharacter)?.name.split(' ')[0]}'s Method
                  </h3>
                  <CharacterHelp characterId={activeCharacter} context="email" />
                </div>
                
                <SkillProgress 
                  characterId={activeCharacter}
                  completedSteps={currentStep}
                  totalSteps={3}
                  currentSkill={characterScenarios[activeCharacter as keyof typeof characterScenarios].skill}
                />
                
                <div className="mt-6 space-y-4">
                  {/* Step-by-step learning */}
                  <div className={`p-4 rounded-lg border ${currentStep >= 1 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                    <h4 className="font-medium mb-2">Step 1: Understand the Context</h4>
                    <p className="text-sm text-gray-700">Learn why this skill matters and when to use it</p>
                    {currentStep === 1 && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setCurrentStep(2)}
                      >
                        Complete Step <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${currentStep >= 2 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                    <h4 className="font-medium mb-2">Step 2: See It In Action</h4>
                    <p className="text-sm text-gray-700">Watch how the method works with real examples</p>
                    {currentStep === 2 && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setCurrentStep(3)}
                      >
                        Complete Step <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${currentStep >= 3 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                    <h4 className="font-medium mb-2">Step 3: Try It Yourself</h4>
                    <p className="text-sm text-gray-700">Practice with guided exercises</p>
                    {currentStep === 3 && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setCurrentStep(3)}
                      >
                        Ready to Practice <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <CharacterTip 
                  characterId={activeCharacter}
                  tip={`Remember: ${stories.find(s => s.id === activeCharacter)?.quote}`}
                  className="mt-6"
                />
              </Card>
            </div>
          </TabsContent>
          
          {/* Practice Tab */}
          <TabsContent value="practice" className="mt-6">
            <SkillApplication
              characterId={activeCharacter}
              skillName={characterScenarios[activeCharacter as keyof typeof characterScenarios].skill}
              practiceScenario={characterScenarios[activeCharacter as keyof typeof characterScenarios].scenario}
              expectedOutcome={characterScenarios[activeCharacter as keyof typeof characterScenarios].outcome}
              realWorldExample={characterScenarios[activeCharacter as keyof typeof characterScenarios].example}
            />
            
            <div className="mt-6 text-center">
              <Button size="lg" className="shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Practice Exercise
              </Button>
            </div>
          </TabsContent>
          
          {/* Apply Tab */}
          <TabsContent value="apply" className="mt-6">
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Work?</h3>
              <p className="text-lg text-gray-600 mb-6">
                You've learned {stories.find(s => s.id === activeCharacter)?.name.split(' ')[0]}'s proven method. 
                Now it's time to apply it to your own challenges.
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <StoryBadge characterId={activeCharacter} />
                
                <div className="bg-purple-100 p-6 rounded-lg max-w-md">
                  <p className="text-purple-900 font-medium mb-2">Your Next Step:</p>
                  <p className="text-sm text-purple-700">
                    Think of a specific {characterScenarios[activeCharacter as keyof typeof characterScenarios].skill.toLowerCase()} challenge 
                    you're facing right now. Apply what you've learned and see the transformation!
                  </p>
                </div>
                
                <Button size="lg" className="mt-4">
                  Access Full {stories.find(s => s.id === activeCharacter)?.name.split(' ')[0]}'s Toolkit
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Impact Summary */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gradient-to-r from-purple-100 to-cyan-100">
            <h3 className="text-xl font-semibold mb-4">Collective Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stories.map(story => (
                <div key={story.id} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: story.color }}>
                    {story.timeMetrics.after.match(/\d+/)?.[0] || '100'}%
                  </p>
                  <p className="text-xs text-gray-600">{story.name.split(' ')[0]}'s improvement</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-700 mt-4">
              Join thousands of nonprofit professionals transforming their work with AI
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoryIntegrationDemo;