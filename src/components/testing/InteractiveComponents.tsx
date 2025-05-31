
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { 
  Loader2, Target, Trophy, Lightbulb, Users, MapPin, Clock, 
  DollarSign, TrendingUp, CheckCircle, RotateCcw, ArrowRight,
  Star, Calendar, FileText, Shuffle
} from 'lucide-react';

// Multiple Choice Scenarios Component
export const MultipleChoiceScenarios = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState<{[key: number]: boolean}>({});

  const scenarios = [
    {
      scenario: "Maria's Food Pantry receives 200 volunteer applications weekly. They need to match volunteers with appropriate roles based on skills, availability, and location. What's the best AI solution?",
      options: [
        "Manual spreadsheet matching",
        "AI-powered volunteer matching system",
        "First-come, first-served assignment",
        "Random assignment system"
      ],
      correct: 1,
      explanation: "AI can analyze multiple factors (skills, availability, location, preferences) simultaneously to create optimal matches, saving hours of manual work."
    },
    {
      scenario: "Carmen's organization rescues food from 50+ restaurants daily. They need to predict which restaurants will have surplus food to optimize pickup routes. What approach works best?",
      options: [
        "Call every restaurant daily",
        "Use historical data patterns only",
        "AI predictive analytics combining weather, events, and historical data",
        "Random route planning"
      ],
      correct: 2,
      explanation: "AI can analyze multiple variables (weather, local events, historical patterns, day of week) to predict surplus with high accuracy."
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentScenario]: scenarios[currentScenario].options[optionIndex] }));
    setShowResults(prev => ({ ...prev, [currentScenario]: true }));
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    }
  };

  const reset = () => {
    setCurrentScenario(0);
    setAnswers({});
    setShowResults({});
  };

  const current = scenarios[currentScenario];
  const hasAnswered = showResults[currentScenario];
  const isCorrect = answers[currentScenario] === current.options[current.correct];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">NYC Nonprofit AI Scenarios</h3>
        <p className="text-sm text-gray-600">Choose the best AI solution for each situation</p>
        <Badge variant="outline">{currentScenario + 1} of {scenarios.length}</Badge>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <p className="text-sm mb-4">{current.scenario}</p>
          
          <div className="space-y-2">
            {current.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                variant="outline"
                className={`w-full text-left justify-start text-xs h-auto py-2 px-3 ${
                  hasAnswered 
                    ? index === current.correct 
                      ? 'bg-green-100 border-green-300' 
                      : answers[currentScenario] === option 
                        ? 'bg-red-100 border-red-300' 
                        : ''
                    : 'hover:bg-gray-50'
                }`}
                disabled={hasAnswered}
              >
                {option}
              </Button>
            ))}
          </div>

          {hasAnswered && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Target className="w-4 h-4 text-orange-600" />
                )}
                <span className="text-sm font-medium">
                  {isCorrect ? 'Correct!' : 'Good try!'}
                </span>
              </div>
              <p className="text-sm text-blue-700">{current.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        {currentScenario < scenarios.length - 1 && (
          <Button onClick={nextScenario} size="sm" disabled={!hasAnswered}>
            Next Scenario
          </Button>
        )}
      </div>
    </div>
  );
};

// Story Fill-in-the-Blanks Component
export const StoryFillInBlanks = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [completed, setCompleted] = useState(false);

  const stories = [
    {
      title: "Maria's Volunteer Success",
      text: "Maria used AI to _____ volunteer skills with program needs. This reduced her weekly coordination time from _____ hours to just 2 hours, allowing her to focus on _____ relationships with volunteers.",
      blanks: ["match", "15", "building"],
      options: {
        0: ["match", "sort", "list", "count"],
        1: ["5", "10", "15", "20"],
        2: ["managing", "building", "tracking", "scheduling"]
      }
    },
    {
      title: "Carmen's Food Rescue",
      text: "Carmen's AI system predicts food surplus by analyzing _____, local events, and historical patterns. This increased rescue efficiency by _____% and reduced food waste in her neighborhood by _____ tons monthly.",
      blanks: ["weather", "40", "12"],
      options: {
        0: ["weather", "traffic", "population", "economy"],
        1: ["20", "30", "40", "50"],
        2: ["8", "10", "12", "15"]
      }
    }
  ];

  const handleAnswer = (blankIndex: number, answer: string) => {
    const key = `${currentStory}-${blankIndex}`;
    setAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const checkCompletion = () => {
    const story = stories[currentStory];
    const allFilled = story.blanks.every((_, index) => {
      const key = `${currentStory}-${index}`;
      return answers[key];
    });
    if (allFilled) setCompleted(true);
  };

  React.useEffect(checkCompletion, [answers, currentStory]);

  const renderStoryWithBlanks = () => {
    const story = stories[currentStory];
    const parts = story.text.split('_____');
    const result = [];

    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>);
      
      if (index < parts.length - 1) {
        const key = `${currentStory}-${index}`;
        const selectedAnswer = answers[key];
        const isCorrect = selectedAnswer === story.blanks[index];
        
        result.push(
          <span key={`blank-${index}`} className="inline-block mx-1">
            {selectedAnswer ? (
              <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                {selectedAnswer}
              </Badge>
            ) : (
              <select 
                onChange={(e) => handleAnswer(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Select...</option>
                {story.options[index].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </span>
        );
      }
    });

    return result;
  };

  const nextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setCompleted(false);
    }
  };

  const reset = () => {
    setCurrentStory(0);
    setAnswers({});
    setCompleted(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Complete the Success Stories</h3>
        <p className="text-sm text-gray-600">Fill in the blanks to complete the AI impact stories</p>
        <Badge variant="outline">{currentStory + 1} of {stories.length}</Badge>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">{stories[currentStory].title}</h4>
          <div className="text-sm leading-relaxed">
            {renderStoryWithBlanks()}
          </div>
        </CardContent>
      </Card>

      {completed && (
        <div className="p-3 bg-green-50 rounded border border-green-200 text-center">
          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-800">Story completed!</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        {currentStory < stories.length - 1 && (
          <Button onClick={nextStory} size="sm" disabled={!completed}>
            Next Story
          </Button>
        )}
      </div>
    </div>
  );
};

// Sequence Sorter Component
export const SequenceSorter = () => {
  const [steps, setSteps] = useState([
    "Assess current workflows",
    "Identify AI use cases", 
    "Choose appropriate tools",
    "Train staff",
    "Implement gradually",
    "Monitor and adjust"
  ]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const correctOrder = [
    "Assess current workflows",
    "Identify AI use cases", 
    "Choose appropriate tools",
    "Train staff",
    "Implement gradually",
    "Monitor and adjust"
  ];

  const shuffleSteps = () => {
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setSteps(shuffled);
    setIsCorrect(false);
    setAttempts(0);
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedStep);
    setSteps(newSteps);
  };

  const checkOrder = () => {
    const correct = steps.every((step, index) => step === correctOrder[index]);
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);
  };

  React.useEffect(() => {
    shuffleSteps();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Implementation Sequence</h3>
        <p className="text-sm text-gray-600">Arrange the steps in the correct order</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {index + 1}
            </Badge>
            <Card className="flex-1 border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{step}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStep(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStep(index, Math.min(steps.length - 1, index + 1))}
                      disabled={index === steps.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={checkOrder} size="sm">
          Check Order
        </Button>
        <Button onClick={shuffleSteps} variant="outline" size="sm">
          <Shuffle className="w-3 h-3 mr-1" />
          Shuffle
        </Button>
      </div>

      {attempts > 0 && (
        <div className={`p-3 rounded border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Target className="w-4 h-4 text-orange-600" />
            )}
            <span className="text-sm font-medium">
              {isCorrect ? 'Perfect! You understand the AI implementation process.' : `Try again! Attempt ${attempts}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// AI Tool Recommendation Engine Component
export const AIToolRecommendationEngine = () => {
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [recommendations, setRecommendations] = useState<string>('');
  const { callAI, loading } = useAITestingAssistant();

  const questions = [
    {
      id: 'orgType',
      question: 'What type of nonprofit are you?',
      options: ['Food pantry/rescue', 'Education/youth', 'Health/social services', 'Arts/culture', 'Environment', 'Other']
    },
    {
      id: 'size',
      question: 'How many staff members do you have?',
      options: ['1-5 staff', '6-15 staff', '16-50 staff', '50+ staff']
    },
    {
      id: 'challenge',
      question: 'What\'s your biggest operational challenge?',
      options: ['Volunteer coordination', 'Donor management', 'Program delivery', 'Administrative tasks', 'Data analysis']
    },
    {
      id: 'budget',
      question: 'What\'s your tech budget range?',
      options: ['$0-500/month', '$500-2000/month', '$2000-5000/month', '$5000+/month']
    }
  ];

  const handleResponse = (questionId: string, answer: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const getRecommendations = async () => {
    const context = Object.entries(responses).map(([key, value]) => `${key}: ${value}`).join(', ');
    try {
      const result = await callAI(
        'tool_recommendation',
        'Based on my nonprofit profile, what AI tools would you recommend?',
        `Organization details: ${context}`
      );
      setRecommendations(result);
    } catch (error) {
      setRecommendations('Sorry, there was an error getting recommendations. Please try again!');
    }
  };

  const allAnswered = questions.every(q => responses[q.id]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Tool Recommendations</h3>
        <p className="text-sm text-gray-600">Answer questions to get personalized AI tool suggestions</p>
      </div>

      <div className="space-y-4">
        {questions.map(question => (
          <Card key={question.id} className="border border-gray-200">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">{question.question}</h4>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map(option => (
                  <Button
                    key={option}
                    onClick={() => handleResponse(question.id, option)}
                    variant={responses[question.id] === option ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-auto py-2"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={getRecommendations} 
        disabled={!allAnswered || loading}
        className="w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lightbulb className="w-4 h-4 mr-2" />}
        Get AI Recommendations
      </Button>

      {recommendations && (
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">Personalized Recommendations</Badge>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Time Savings Calculator Component
export const TimeSavingsCalculator = () => {
  const [tasks, setTasks] = useState<{[key: string]: number}>({});
  const [results, setResults] = useState<string>('');
  const { callAI, loading } = useAITestingAssistant();

  const taskTypes = [
    { id: 'emails', name: 'Email responses', unit: 'emails/week' },
    { id: 'scheduling', name: 'Volunteer scheduling', unit: 'hours/week' },
    { id: 'data', name: 'Data entry', unit: 'hours/week' },
    { id: 'reports', name: 'Report generation', unit: 'reports/month' },
    { id: 'social', name: 'Social media posts', unit: 'posts/week' }
  ];

  const handleTaskUpdate = (taskId: string, value: number) => {
    setTasks(prev => ({ ...prev, [taskId]: value }));
  };

  const calculateSavings = async () => {
    const taskData = taskTypes.map(task => 
      `${task.name}: ${tasks[task.id] || 0} ${task.unit}`
    ).join(', ');

    try {
      const result = await callAI(
        'time_savings',
        'Calculate realistic time savings from AI automation for these nonprofit tasks.',
        `Current task volume: ${taskData}`
      );
      setResults(result);
    } catch (error) {
      setResults('Sorry, there was an error calculating savings. Please try again!');
    }
  };

  const hasData = Object.values(tasks).some(value => value > 0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Time Savings Calculator</h3>
        <p className="text-sm text-gray-600">Enter your current task volume to see potential time savings</p>
      </div>

      <div className="space-y-3">
        {taskTypes.map(task => (
          <Card key={task.id} className="border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{task.name}</span>
                  <p className="text-xs text-gray-500">{task.unit}</p>
                </div>
                <input
                  type="number"
                  min="0"
                  value={tasks[task.id] || ''}
                  onChange={(e) => handleTaskUpdate(task.id, parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border border-gray-300 rounded text-sm text-center"
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={calculateSavings} 
        disabled={!hasData || loading}
        className="w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
        Calculate Time Savings
      </Button>

      {results && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Badge className="bg-green-100 text-green-700">Potential Savings</Badge>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {results}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
