import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Play, RotateCcw, Star, TrendingUp, Target, Heart, Brain } from 'lucide-react';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: 'tone' | 'structure' | 'empathy' | 'confidence';
  content: {
    scenario: string;
    challenge: string;
    tips: string[];
    practice: string;
    solution: string;
  };
}

const MayaConfidenceBuilder: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    // Load completed lessons from localStorage
    const saved = localStorage.getItem('maya-confidence-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSolution, setShowSolution] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const microLessons: MicroLesson[] = [
    {
      id: '1',
      title: 'Responding to Angry Emails',
      description: 'Turn heated exchanges into productive conversations',
      duration: '3 min',
      difficulty: 'intermediate',
      category: 'empathy',
      content: {
        scenario: 'A parent sends an angry email about a policy change, using harsh language and making unreasonable demands.',
        challenge: 'How do you respond professionally while addressing their concerns?',
        tips: [
          'Start by acknowledging their emotions without agreeing with inappropriate language',
          'Separate the emotion from the issue - address what they\'re really concerned about',
          'Use "I understand you\'re frustrated" to validate without taking blame',
          'Offer specific next steps and solutions rather than just explanations'
        ],
        practice: 'Write a response that transforms the anger into collaboration while maintaining professional boundaries.',
        solution: 'Dear [Parent], I can see you\'re really concerned about this change and how it affects your family. Let me address your specific worries and share what options we have to make this work better for everyone...'
      }
    },
    {
      id: '2',
      title: 'Setting Boundaries Kindly',
      description: 'Say no while maintaining positive relationships',
      duration: '2 min',
      difficulty: 'basic',
      category: 'confidence',
      content: {
        scenario: 'Someone asks you to make an exception to an important policy that you cannot change.',
        challenge: 'How do you say no while keeping the relationship positive?',
        tips: [
          'Lead with what you CAN do, not what you can\'t',
          'Explain the why behind the policy to show it\'s not arbitrary',
          'Offer alternative solutions that meet their underlying need',
          'Use confident, clear language - avoid maybe, probably, or I think'
        ],
        practice: 'Practice declining a request while offering helpful alternatives.',
        solution: 'I understand why you\'d want that flexibility. While I can\'t change this specific policy, here are three other ways we can address what you need...'
      }
    },
    {
      id: '3',
      title: 'Asking for Support Confidently',
      description: 'Make requests without undermining your authority',
      duration: '2 min',
      difficulty: 'basic',
      category: 'confidence',
      content: {
        scenario: 'You need help from a colleague or supervisor but don\'t want to seem incompetent.',
        challenge: 'How do you ask for support while maintaining professional credibility?',
        tips: [
          'Frame requests as collaboration, not desperation',
          'Be specific about what you need and why',
          'Show what you\'ve already tried or considered',
          'Position it as benefiting the shared goal, not just you'
        ],
        practice: 'Write a request for help that demonstrates competence and clear thinking.',
        solution: 'I\'ve been working on the budget analysis and want to make sure I\'m accounting for all variables. Could we spend 15 minutes reviewing my approach to ensure I haven\'t missed anything important?'
      }
    },
    {
      id: '4',
      title: 'Delivering Difficult News',
      description: 'Share disappointing information with care and clarity',
      duration: '4 min',
      difficulty: 'advanced',
      category: 'empathy',
      content: {
        scenario: 'You need to tell someone that their application was rejected or their request was denied.',
        challenge: 'How do you deliver bad news while maintaining dignity and hope?',
        tips: [
          'Start with something positive about them or their effort',
          'Be direct about the decision - don\'t bury the news',
          'Give a brief, honest reason without excessive detail',
          'End with future possibilities or alternative pathways'
        ],
        practice: 'Practice delivering disappointing news in a way that preserves the person\'s dignity.',
        solution: 'Thank you for your thoughtful application. While we won\'t be able to offer you the position this time, your experience in community outreach really impressed our team. I\'d love to keep your information for future opportunities...'
      }
    },
    {
      id: '5',
      title: 'Following Up Without Nagging',
      description: 'Get responses without seeming pushy or impatient',
      duration: '2 min',
      difficulty: 'basic',
      category: 'structure',
      content: {
        scenario: 'You sent an important email but haven\'t received a response, and you need an answer.',
        challenge: 'How do you follow up professionally without appearing impatient?',
        tips: [
          'Reference the specific date and subject of your original message',
          'Acknowledge they might be busy - give them an out',
          'Provide context for why you need the information',
          'Offer a specific deadline or next steps'
        ],
        practice: 'Write a follow-up that gets attention without creating pressure.',
        solution: 'I know you\'re incredibly busy, so I wanted to follow up on my email from Tuesday about the grant deadline. Since we need to submit by Friday, could you let me know your thoughts by Thursday afternoon?'
      }
    },
    {
      id: '6',
      title: 'Explaining Complex Information Simply',
      description: 'Make complicated topics accessible and engaging',
      duration: '3 min',
      difficulty: 'intermediate',
      category: 'structure',
      content: {
        scenario: 'You need to explain a complex policy, process, or situation to someone without expertise.',
        challenge: 'How do you simplify without talking down to them?',
        tips: [
          'Start with the big picture, then add details',
          'Use analogies or examples they can relate to',
          'Break complex ideas into 2-3 simple steps',
          'Check for understanding without being condescending'
        ],
        practice: 'Take a complex topic and explain it in terms anyone could understand.',
        solution: 'Think of our new enrollment process like online shopping - you browse programs, add what you want to your cart, checkout with your information, and get a confirmation. Let me walk you through each step...'
      }
    }
  ];

  const startLesson = (lesson: MicroLesson) => {
    // Reset all state for fresh lesson start
    setSelectedLesson(lesson);
    setShowSolution(false);
    setCurrentTip(0);
    
    // Track lesson start
    console.log('Starting lesson:', lesson.id, lesson.title);
  };

  const completeLesson = () => {
    if (!selectedLesson) {
      console.warn('No lesson selected');
      return;
    }
    
    // Ensure solution was viewed before marking complete
    if (!showSolution) {
      console.warn('Cannot complete lesson without viewing solution');
      return;
    }
    
    if (!completedLessons.includes(selectedLesson.id)) {
      setCompletedLessons([...completedLessons, selectedLesson.id]);
      
      // Store progress in localStorage for persistence
      const updatedCompleted = [...completedLessons, selectedLesson.id];
      localStorage.setItem('maya-confidence-completed', JSON.stringify(updatedCompleted));
    }
  };

  const nextTip = () => {
    if (!selectedLesson) {
      console.warn('No lesson selected');
      return;
    }
    
    if (currentTip < selectedLesson.content.tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      // Automatically enable solution viewing when all tips are seen
      console.log('All tips viewed, solution now available');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tone': return Heart;
      case 'structure': return Target;
      case 'empathy': return TrendingUp;
      case 'confidence': return Star;
      default: return Brain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tone': return 'text-red-600';
      case 'structure': return 'text-blue-600';
      case 'empathy': return 'text-green-600';
      case 'confidence': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const completionRate = (completedLessons.length / microLessons.length) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Confidence Builder</CardTitle>
              <CardDescription>
                Micro-lessons to master challenging communication situations
              </CardDescription>
            </div>
          </div>
          {/* Progress Overview */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedLessons.length}/{microLessons.length} lessons completed</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedLesson ? (
            /* Lesson Selection */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Challenge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {microLessons.map((lesson) => {
                  const Icon = getCategoryIcon(lesson.category);
                  const isCompleted = completedLessons.includes(lesson.id);
                  
                  return (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer hover:shadow-lg transition-all ${
                        isCompleted ? 'border-green-300 bg-green-50' : 'hover:border-purple-300'
                      }`}
                      onClick={() => startLesson(lesson)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className={`w-5 h-5 ${getCategoryColor(lesson.category)}`} />
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {lesson.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(lesson.difficulty)} variant="secondary">
                              {lesson.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {lesson.duration}
                            </Badge>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            {isCompleted ? 'Review' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Lesson */
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedLesson.title}</h3>
                  <p className="text-gray-600">{selectedLesson.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
                    {selectedLesson.difficulty}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLesson(null)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                </div>
              </div>

              {/* Scenario */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">{selectedLesson.content.scenario}</p>
                </CardContent>
              </Card>

              {/* Challenge */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Your Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 font-medium">{selectedLesson.content.challenge}</p>
                </CardContent>
              </Card>

              {/* Tips - Progressive Reveal */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maya's Tips</CardTitle>
                  <div className="text-sm text-gray-600">
                    Tip {currentTip + 1} of {selectedLesson.content.tips.length}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 font-medium">
                      {selectedLesson.content.tips[currentTip]}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      disabled={currentTip === 0}
                      onClick={() => {
                        setCurrentTip(currentTip - 1);
                        // Reset solution visibility when going back
                        if (showSolution) {
                          setShowSolution(false);
                        }
                      }}
                    >
                      Previous Tip
                    </Button>
                    {currentTip < selectedLesson.content.tips.length - 1 ? (
                      <Button onClick={nextTip}>
                        Next Tip
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setShowSolution(true);
                          // Track that user viewed the solution
                          console.log('Solution viewed for lesson:', selectedLesson.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        See Solution
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Practice Exercise */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">Practice Exercise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">{selectedLesson.content.practice}</p>
                </CardContent>
              </Card>

              {/* Solution */}
              {showSolution && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Maya's Solution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <p className="text-gray-800 font-mono text-sm">
                        {selectedLesson.content.solution}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Button
                        onClick={completeLesson}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaConfidenceBuilder;