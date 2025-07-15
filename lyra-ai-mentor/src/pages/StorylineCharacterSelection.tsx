/**
 * STORYLINE CHARACTER SELECTION PAGE
 * Choose between different character storylines to experience variety
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Target, Users, Mail, BarChart3 } from 'lucide-react';
import { StorylineLessonPlayer } from '@/components/storyline/StorylineLessonPlayer';
import { 
  MAYA_EMAIL_STORYLINE_LESSON, 
  DAVID_DATA_STORYLINE_LESSON,
  StorylineLesson 
} from '@/config/storyLineLearningSystem';
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

export const StorylineCharacterSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<StorylineLesson | null>(null);
  const [lessonResults, setLessonResults] = useState<LessonResults | null>(null);

  const availableLessons = [
    MAYA_EMAIL_STORYLINE_LESSON,
    DAVID_DATA_STORYLINE_LESSON
  ];

  const handleStartLesson = (lesson: StorylineLesson) => {
    setSelectedLesson(lesson);
    toast({
      title: `Starting ${lesson.character}'s Story! 🎬`,
      description: `Beginning ${lesson.title} - ${lesson.estimatedDuration} minute experience`,
      variant: "default"
    });
  };

  const handleLessonComplete = (results: LessonResults) => {
    setLessonResults(results);
    setSelectedLesson(null);
    
    toast({
      title: "Story Complete! 🎉",
      description: `You scored ${results.score.toFixed(1)}/10 and completed the storyline in ${results.timeSpent.toFixed(1)} minutes`,
      variant: "default"
    });
  };

  const getCharacterIcon = (character: string) => {
    switch (character) {
      case 'Maya': return <Mail className="h-6 w-6 text-purple-600" />;
      case 'David': return <BarChart3 className="h-6 w-6 text-blue-600" />;
      default: return <BookOpen className="h-6 w-6 text-gray-600" />;
    }
  };

  const getCharacterColor = (character: string) => {
    switch (character) {
      case 'Maya': return 'purple';
      case 'David': return 'blue';
      default: return 'gray';
    }
  };

  const renderCharacterSelection = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
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
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Learning Adventure</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Experience different AI skills through character-driven storylines. Each character teaches different aspects of AI prompting and management.
        </p>
        <Badge variant="secondary" className="px-4 py-2">
          Complete Storylines • 15-18 minutes each • Branching narratives
        </Badge>
      </div>

      {/* Character Lessons Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {availableLessons.map((lesson) => {
          const color = getCharacterColor(lesson.character);
          return (
            <Card key={lesson.id} className={`border-2 border-${color}-200 hover:border-${color}-300 transition-colors`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getCharacterIcon(lesson.character)}
                    <div>
                      <CardTitle className={`text-xl text-${color}-800`}>{lesson.title}</CardTitle>
                      <p className={`text-${color}-600 mt-1`}>with {lesson.character}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{lesson.estimatedDuration} min</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Story Setup */}
                <div className={`bg-${color}-50 p-4 rounded-lg`}>
                  <h4 className={`font-medium text-${color}-900 mb-2`}>📖 The Challenge:</h4>
                  <p className={`text-${color}-800 text-sm`}>{lesson.narrative.conflict.primaryChallenge}</p>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🎯 AI Skills You'll Master:</h4>
                  <div className="grid gap-2">
                    {lesson.takeawaySkills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm flex items-start gap-2">
                        <span className={`text-${color}-600 font-bold`}>•</span>
                        {skill}
                      </div>
                    ))}
                    {lesson.takeawaySkills.length > 3 && (
                      <div className="text-xs text-gray-500 pl-4">
                        +{lesson.takeawaySkills.length - 3} more skills
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Flow Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🚀 Your Journey:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {lesson.practiceFlow.slice(0, 4).map((stage, index) => (
                      <div key={stage.id} className="bg-white p-2 rounded border">
                        <div className="font-medium text-gray-800">{index + 1}. {stage.title.split(' ')[0]}</div>
                        <div className="text-gray-600">{stage.type.replace('-', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Character-Specific Context */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🏢 Scenario Context:</h4>
                  <p className="text-sm text-gray-700">{lesson.narrative.setup.context}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-500">Stakeholders:</span>
                    {lesson.narrative.setup.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Unique Features */}
                <div className={`bg-gray-50 p-3 rounded-lg border-l-4 border-${color}-400`}>
                  <h4 className="font-medium text-gray-900 mb-2">✨ Unique Features:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {lesson.character === 'Maya' && (
                      <>
                        <li>• Multi-stakeholder communication challenge</li>
                        <li>• Tone and relationship calibration</li>
                        <li>• Audience-specific messaging practice</li>
                      </>
                    )}
                    {lesson.character === 'David' && (
                      <>
                        <li>• Data detective mystery storyline</li>
                        <li>• AI-powered data cleaning & analysis</li>
                        <li>• Board presentation narrative building</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Start Button */}
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => handleStartLesson(lesson)}
                    className={`w-full bg-${color}-600 hover:bg-${color}-700`}
                    size="lg"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start {lesson.character}'s Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">🔄 Character Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-indigo-200">
                  <th className="text-left p-3 font-medium text-indigo-900">Aspect</th>
                  <th className="text-left p-3 font-medium text-purple-900">Maya (Communication)</th>
                  <th className="text-left p-3 font-medium text-blue-900">David (Data Analysis)</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-indigo-100">
                  <td className="p-3 font-medium text-gray-700">Primary AI Skill</td>
                  <td className="p-3 text-purple-800">Content generation & tone adaptation</td>
                  <td className="p-3 text-blue-800">Data cleaning & insight extraction</td>
                </tr>
                <tr className="border-b border-indigo-100">
                  <td className="p-3 font-medium text-gray-700">Challenge Type</td>
                  <td className="p-3 text-purple-800">Multi-stakeholder communication</td>
                  <td className="p-3 text-blue-800">Data detective mystery</td>
                </tr>
                <tr className="border-b border-indigo-100">
                  <td className="p-3 font-medium text-gray-700">Branching Focus</td>
                  <td className="p-3 text-purple-800">Stakeholder prioritization & approach</td>
                  <td className="p-3 text-blue-800">Data story framing & narrative choice</td>
                </tr>
                <tr className="border-b border-indigo-100">
                  <td className="p-3 font-medium text-gray-700">Real-World Output</td>
                  <td className="p-3 text-purple-800">Stakeholder-specific emails</td>
                  <td className="p-3 text-blue-800">Board presentation with recommendations</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Best For Learning</td>
                  <td className="p-3 text-purple-800">AI communication & relationship management</td>
                  <td className="p-3 text-blue-800">AI data analysis & strategic storytelling</td>
                </tr>
              </tbody>
            </table>
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
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

            <div className="text-center">
              <Button onClick={() => setLessonResults(null)} variant="outline">
                Try Another Character Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (selectedLesson) {
    return (
      <StorylineLessonPlayer
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
      />
    );
  }

  return renderCharacterSelection();
};

export default StorylineCharacterSelection;