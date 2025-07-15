// Lesson 1: Leadership Communication Foundations
// David Chen's Leadership Communication Chapter

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Users, Target, BookOpen, MessageSquare, Lightbulb } from 'lucide-react';

interface Lesson1FoundationProps {
  onComplete?: () => void;
  userProgress?: {
    conceptsCompleted: string[];
    exercisesCompleted: string[];
    currentStep: number;
  };
}

const Lesson1Foundation: React.FC<Lesson1FoundationProps> = ({
  onComplete,
  userProgress = { conceptsCompleted: [], exercisesCompleted: [], currentStep: 0 }
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'concepts' | 'practice' | 'assessment'>('overview');
  const [completedItems, setCompletedItems] = useState<string[]>(userProgress.conceptsCompleted);
  const [currentScenario, setCurrentScenario] = useState<string>('');

  const concepts = [
    {
      id: 'leadership-voice',
      title: 'Developing Your Leadership Voice',
      description: 'Your leadership voice is the unique combination of your values, expertise, and communication style that inspires others to follow you.',
      davidInsight: "Think of your leadership voice like code architecture - it needs to be clear, consistent, and scalable. Your voice is your API to the world.",
      keyPoints: [
        'Authenticity builds trust and credibility',
        'Consistency creates predictability for your team',
        'Adaptability allows you to connect with different audiences',
        'Clarity prevents misunderstandings and confusion'
      ],
      examples: [
        'Steve Jobs: Visionary and demanding - "Think different"',
        'Satya Nadella: Empathetic and growth-focused - "Learn it all"',
        'Elon Musk: Innovative and ambitious - "The impossible is just an opinion"',
        'Sheryl Sandberg: Authentic and empowering - "Lean in"'
      ],
      exercise: 'Record yourself giving a 2-minute team update. Analyze your natural speaking patterns, tone, and energy. What does your voice communicate about your leadership?'
    },
    {
      id: 'audience-adaptation',
      title: 'Adapting to Your Audience',
      description: 'Effective leaders adjust their communication style, content, and delivery based on their audience\'s needs, expertise level, and context.',
      davidInsight: "It's like refactoring code for different environments. The core logic stays the same, but the interface changes based on who's using it.",
      keyPoints: [
        'Technical depth varies by audience expertise',
        'Emotional tone adapts to relationship and context',
        'Message structure changes based on decision-making needs',
        'Follow-up requirements differ by audience responsibility'
      ],
      examples: [
        'Engineering team: Technical deep-dive with implementation details',
        'Executive team: Business impact with strategic implications',
        'Cross-functional partners: Collaborative approach with shared outcomes',
        'Individual contributor: Personal development with growth opportunities'
      ],
      exercise: 'Take the same project update and adapt it for three different audiences: your engineering team, your manager, and a cross-functional partner. Notice how the content and tone change.'
    },
    {
      id: 'influential-messaging',
      title: 'Crafting Influential Messages',
      description: 'Learn to structure your communication for maximum impact using proven frameworks and persuasion techniques.',
      davidInsight: "Influential messaging is like good software design - it has clear structure, handles edge cases, and gets the job done efficiently.",
      keyPoints: [
        'Lead with the outcome or decision needed',
        'Use data and emotion in combination',
        'Structure arguments logically and memorably',
        'Address objections before they arise'
      ],
      examples: [
        'STAR method: Situation, Task, Action, Result',
        'Pyramid Principle: Conclusion first, then supporting arguments',
        'Before-After-Bridge: Current state, desired state, path forward',
        'Problem-Solution-Benefit: What\'s wrong, how to fix it, why it matters'
      ],
      exercise: 'Rewrite a recent email or presentation using the Pyramid Principle. Start with your conclusion, then provide supporting evidence. Notice how this changes the impact.'
    }
  ];

  const scenarios = [
    {
      id: 'new-leader',
      title: 'The New Leader Introduction',
      context: 'You\'ve just been promoted to lead a team of 15 engineers, some of whom were your peers last week.',
      challenge: 'Establish credibility and authority while maintaining relationships',
      davidApproach: 'Focus on shared goals, acknowledge the transition honestly, and demonstrate value through actions',
      davidInsight: "The key is to acknowledge the change honestly while focusing on the team's success. I learned that trying to pretend nothing changed actually made things worse.",
      practicePrompt: 'How would you introduce yourself to your new team? What would you say in your first team meeting?'
    },
    {
      id: 'skeptical-audience',
      title: 'The Skeptical Stakeholder',
      context: 'You need to present a technical initiative to business stakeholders who don\'t understand the technical details but control the budget.',
      challenge: 'Translate technical complexity into business value and risk',
      davidApproach: 'Use business metrics, analogies, and focus on outcomes rather than implementation details',
      davidInsight: "I learned to speak their language first - ROI, risk mitigation, competitive advantage. The technical details come only if they ask.",
      practicePrompt: 'How would you explain the need for technical debt reduction to a CFO who wants to cut costs?'
    },
    {
      id: 'resistance-to-change',
      title: 'The Change Resistance',
      context: 'Your team is resistant to a new development process that will improve efficiency but requires learning new tools.',
      challenge: 'Address emotional concerns while maintaining the business need for change',
      davidApproach: 'Acknowledge concerns, involve the team in solution design, and create quick wins',
      davidInsight: "Resistance is usually fear in disguise. Address the fear first, then the facts become easier to accept.",
      practicePrompt: 'How would you communicate a process change that your team has already expressed skepticism about?'
    }
  ];

  const handleItemComplete = (itemId: string) => {
    if (!completedItems.includes(itemId)) {
      setCompletedItems([...completedItems, itemId]);
    }
  };

  const progressPercentage = (completedItems.length / concepts.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leadership Communication Foundations</h1>
        </div>
        <p className="text-lg text-gray-600">Building Your Leadership Voice</p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>45 minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Beginner</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>Leadership Voice Development</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-500">{completedItems.length}/{concepts.length} concepts completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* David's Introduction */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">DC</span>
            </div>
            <div>
              <CardTitle className="text-blue-900">David Chen</CardTitle>
              <p className="text-blue-700">Senior Director of Engineering</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 italic">
            "Great leaders aren't born - they're made through great communication. Let me show you how to transform your technical expertise into leadership impact. 
            The best code in the world means nothing if you can't communicate its value, rally your team around it, and inspire others to build upon it."
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center space-x-2">
        {['overview', 'concepts', 'practice', 'assessment'].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? 'default' : 'outline'}
            onClick={() => setActiveSection(section as any)}
            className="capitalize"
          >
            {section}
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Understand the core principles of leadership communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Develop your authentic leadership voice and presence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Learn to adapt communication style to different audiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Master the art of influential messaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Build confidence in leadership communication</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'concepts' && (
        <div className="space-y-6">
          {concepts.map((concept) => (
            <Card key={concept.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {completedItems.includes(concept.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    {concept.title}
                  </CardTitle>
                  <Badge variant="outline">Core Concept</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{concept.description}</p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">David's Insight</span>
                  </div>
                  <p className="text-blue-800 italic">"{concept.davidInsight}"</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Points:</h4>
                  <ul className="space-y-1">
                    {concept.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {concept.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Practice Exercise:</h4>
                  <p className="text-gray-700">{concept.exercise}</p>
                </div>

                <Button 
                  onClick={() => handleItemComplete(concept.id)}
                  disabled={completedItems.includes(concept.id)}
                  className="w-full"
                >
                  {completedItems.includes(concept.id) ? 'Completed' : 'Mark as Complete'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'practice' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Scenarios</CardTitle>
              <p className="text-gray-600">Apply your leadership communication skills to real-world situations</p>
            </CardHeader>
          </Card>

          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle>{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Context:</h4>
                  <p className="text-gray-700">{scenario.context}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Challenge:</h4>
                  <p className="text-gray-700">{scenario.challenge}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">David's Approach</span>
                  </div>
                  <p className="text-blue-800 mb-2">{scenario.davidApproach}</p>
                  <p className="text-blue-800 italic">"{scenario.davidInsight}"</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Turn:</h4>
                  <p className="text-gray-700">{scenario.practicePrompt}</p>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => setCurrentScenario(scenario.id)}
                  className="w-full"
                >
                  Practice This Scenario
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'assessment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Assessment</CardTitle>
              <p className="text-gray-600">Test your understanding of leadership communication foundations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Question 1:</h4>
                  <p className="mb-3">What is the most important factor in developing your leadership voice?</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="q1" value="a" />
                      <span>Copying successful leaders' styles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="q1" value="b" />
                      <span>Being authentic while adapting to context</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="q1" value="c" />
                      <span>Always being the loudest voice in the room</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="q1" value="d" />
                      <span>Using complex vocabulary to sound intelligent</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Reflection Question:</h4>
                  <p className="mb-3">Describe a time when your communication style didn't match your audience. What would you do differently?</p>
                  <textarea 
                    className="w-full p-3 border rounded-lg h-24 resize-none"
                    placeholder="Share your reflection here..."
                  />
                </div>

                <Button className="w-full">Submit Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completion Actions */}
      {progressPercentage === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">Lesson Complete!</h3>
            <p className="text-green-800 mb-4">
              You've mastered the foundations of leadership communication. Ready to move on to team building?
            </p>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              Continue to Lesson 2: Team Building Through Communication
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lesson1Foundation;