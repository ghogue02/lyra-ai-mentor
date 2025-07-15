/**
 * STORYLINE LESSON PROTOTYPE PAGE
 * Complete storyline-driven lesson with DreamWorks narrative + AI prompting practice
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Target, Users, Wand2 } from 'lucide-react';
import { StorylineLessonPlayer } from '@/components/storyline/StorylineLessonPlayer';
import { MAYA_EMAIL_STORYLINE_LESSON } from '@/config/storyLineLearningSystem';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LessonResults {
  lessonId: string;
  completed: boolean;
  score: number;
  promptQuality: number;
  outputQuality: number;
  decisions: Record<string, string>;
  generatedContent: string[];
  timeSpent: number;
  retryCount: number;
}

export const StorylineLessonPrototype: React.FC = () => {
  const navigate = useNavigate();
  const [showLesson, setShowLesson] = useState(false);
  const [lessonResults, setLessonResults] = useState<LessonResults | null>(null);
  const lesson = MAYA_EMAIL_STORYLINE_LESSON;

  const handleStartLesson = () => {
    setShowLesson(true);
    toast({
      title: "Starting Storyline Lesson! 🎬",
      description: `Beginning ${lesson.title} - learn AI prompting through Maya's story`,
      variant: "default"
    });
  };

  const handleLessonComplete = (results: LessonResults) => {
    setLessonResults(results);
    setShowLesson(false);
    
    toast({
      title: "Lesson Complete! 🎉",
      description: `You scored ${results.score.toFixed(1)}/10 and completed Maya's story in ${results.timeSpent.toFixed(1)} minutes`,
      variant: "default"
    });
  };

  const renderOverview = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="absolute left-6 top-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Storyline Learning Prototype</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the new approach: Complete storylines with DreamWorks narrative + hands-on AI prompting practice
        </p>
        <Badge variant="secondary" className="px-4 py-2">
          New Approach: Maya's Multi-Stakeholder Email Challenge
        </Badge>
      </div>

      {/* Approach Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Complete Storylines</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Full narrative arcs with setup, conflict, and resolution using DreamWorks storytelling
            </p>
            <Badge variant="outline">15-minute sessions</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Wand2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-lg">AI Prompting Practice</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Learn through examples → templates → free-form prompting with real AI generation
            </p>
            <Badge variant="outline">Progressive Scaffolding</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Branching Decisions</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Make strategic choices that affect the story path and learning experience
            </p>
            <Badge variant="outline">Adaptive Storylines</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Featured Lesson */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-purple-800">{lesson.title}</CardTitle>
              <p className="text-purple-600 mt-1">with {lesson.character}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{lesson.estimatedDuration} minutes</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Story Setup */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📖 The Story:</h4>
            <p className="text-gray-700">{lesson.narrative.setup.context}</p>
            <p className="text-gray-700 mt-2">{lesson.narrative.setup.characterSituation}</p>
          </div>

          {/* Challenge */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">🎭 Maya's Challenge:</h4>
            <p className="text-purple-800">{lesson.narrative.conflict.primaryChallenge}</p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🎯 You'll Learn:</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {lesson.takeawaySkills.map((skill, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">👥 Stakeholders in the Story:</h4>
            <div className="flex flex-wrap gap-2">
              {lesson.narrative.setup.stakeholders.map((stakeholder, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {stakeholder}
                </Badge>
              ))}
            </div>
          </div>

          {/* Practice Flow Preview */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🚀 Your Journey:</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium text-blue-900">1. Strategic Choices</div>
                <div className="text-blue-700">Pick your approach</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-medium text-green-900">2. Template Building</div>
                <div className="text-green-700">Learn prompt structure</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-medium text-purple-900">3. AI Generation</div>
                <div className="text-purple-700">Practice with real AI</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="font-medium text-orange-900">4. Quality Review</div>
                <div className="text-orange-700">Evaluate & improve</div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleStartLesson}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Maya's Story
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Results */}
      {lessonResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Latest Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {lessonResults.score.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {lessonResults.promptQuality.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-600">Prompt Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {lessonResults.outputQuality.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-600">Output Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {lessonResults.timeSpent.toFixed(1)}m
                </div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
            </div>

            {lessonResults.generatedContent.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">📝 Your Generated Content:</h4>
                <div className="space-y-3">
                  {lessonResults.generatedContent.map((content, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                      <div className="font-medium text-gray-700 mb-1">Output #{index + 1}:</div>
                      <div className="text-gray-600 line-clamp-3">{content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Button onClick={handleStartLesson} variant="outline">
                Try Again with Different Choices
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">🔄 How This Addresses Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">❌ Previous Issues:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Too granular micro-skills</li>
                <li>• Slow AI calls for simple steps</li>
                <li>• Missing narrative context</li>
                <li>• No branching storylines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">✅ New Approach:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Complete 15-minute storylines</li>
                <li>• AI only for final evaluation</li>
                <li>• DreamWorks narrative integration</li>
                <li>• Branching decision points</li>
                <li>• Real AI prompting practice</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (showLesson) {
    return (
      <StorylineLessonPlayer
        lesson={lesson}
        onComplete={handleLessonComplete}
      />
    );
  }

  return renderOverview();
};

export default StorylineLessonPrototype;