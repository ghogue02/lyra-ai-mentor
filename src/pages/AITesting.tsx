
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import all implemented interactive components
import { SubwayPatternMatcher } from '@/components/testing/SubwayPatternMatcher';
import { DonorBehaviorPredictor } from '@/components/testing/DonorBehaviorPredictor';
import { EmailResponseClassifier } from '@/components/testing/EmailResponseClassifier';
import { RestaurantSurplusPredictor } from '@/components/testing/RestaurantSurplusPredictor';
import { VolunteerSkillsMatcher } from '@/components/testing/VolunteerSkillsMatcher';
import { AIDefinitionBuilder } from '@/components/testing/AIDefinitionBuilder';
import { AIMythsSwiper } from '@/components/testing/AIMythsSwiper';
import { GrantWritingAssistant } from '@/components/testing/GrantWritingAssistant';

// Import from PlaceholderComponents and InteractiveComponents
import { 
  MultipleChoiceScenarios, 
  StoryFillInBlanks, 
  SequenceSorter,
  AIToolRecommendationEngine,
  TimeSavingsCalculator,
  SuccessStoryBuilder,
  AIEthicsDecisionTree,
  NonprofitAIReadinessQuiz,
  AIMythBusterSpinner,
  ROIImpactVisualizer,
  CommunityImpactMultiplier,
  DonorSegmentationSimulator,
  VolunteerCoordinationGame,
  FoodRescueRouteOptimizer,
  MentorMatchingSimulator,
  AIBeforeAfterSlider,
  NonprofitAIBingo
} from '@/components/testing/PlaceholderComponents';

const AITesting = () => {
  const elementCategories = [
    {
      title: "Pattern Recognition Games",
      icon: Target,
      color: "bg-blue-100 text-blue-700",
      elements: [
        { id: 1, component: SubwayPatternMatcher, title: "Subway Pattern Matcher", implemented: true },
        { id: 2, component: DonorBehaviorPredictor, title: "Donor Behavior Predictor", implemented: true },
        { id: 3, component: EmailResponseClassifier, title: "Email Response Classifier", implemented: true },
        { id: 4, component: RestaurantSurplusPredictor, title: "Restaurant Surplus Predictor", implemented: true },
        { id: 5, component: VolunteerSkillsMatcher, title: "Volunteer Skills Matcher", implemented: true }
      ]
    },
    {
      title: "AI-Powered Knowledge Checks",
      icon: Trophy,
      color: "bg-green-100 text-green-700",
      elements: [
        { id: 6, component: AIDefinitionBuilder, title: "AI Definition Builder", implemented: true, aiPowered: true },
        { id: 7, component: AIMythsSwiper, title: "AI Myths Swiper", implemented: true },
        { id: 8, component: MultipleChoiceScenarios, title: "Multiple Choice Scenarios", implemented: true },
        { id: 9, component: StoryFillInBlanks, title: "Story Fill-in-the-Blanks", implemented: true },
        { id: 10, component: SequenceSorter, title: "Sequence Sorter", implemented: true }
      ]
    },
    {
      title: "AI-Powered Scenario Interactions",
      icon: Zap,
      color: "bg-purple-100 text-purple-700",
      elements: [
        { id: 11, component: GrantWritingAssistant, title: "Grant Writing Assistant", implemented: true, aiPowered: true },
        { id: 12, component: DonorSegmentationSimulator, title: "Donor Segmentation Simulator", implemented: false },
        { id: 13, component: VolunteerCoordinationGame, title: "Volunteer Coordination Game", implemented: false },
        { id: 14, component: FoodRescueRouteOptimizer, title: "Food Rescue Route Optimizer", implemented: false },
        { id: 15, component: MentorMatchingSimulator, title: "Mentor Matching Simulator", implemented: false }
      ]
    },
    {
      title: "AI-Powered Creative Tools",
      icon: Target,
      color: "bg-orange-100 text-orange-700",
      elements: [
        { id: 16, component: AIBeforeAfterSlider, title: "AI Before/After Slider", implemented: false },
        { id: 17, component: NonprofitAIBingo, title: "Nonprofit AI Bingo", implemented: false },
        { id: 18, component: TimeSavingsCalculator, title: "Time Savings Calculator", implemented: true, aiPowered: true },
        { id: 19, component: AIMythBusterSpinner, title: "AI Myth Buster Spinner", implemented: true, aiPowered: true },
        { id: 20, component: SuccessStoryBuilder, title: "Success Story Builder", implemented: true, aiPowered: true }
      ]
    },
    {
      title: "Advanced AI Analytics",
      icon: Trophy,
      color: "bg-red-100 text-red-700",
      elements: [
        { id: 21, component: AIEthicsDecisionTree, title: "AI Ethics Decision Tree", implemented: true, aiPowered: true },
        { id: 22, component: ROIImpactVisualizer, title: "ROI Impact Visualizer", implemented: true, aiPowered: true },
        { id: 23, component: AIToolRecommendationEngine, title: "AI Tool Recommendation Engine", implemented: true, aiPowered: true },
        { id: 24, component: NonprofitAIReadinessQuiz, title: "Nonprofit AI Readiness Quiz", implemented: true, aiPowered: true },
        { id: 25, component: CommunityImpactMultiplier, title: "Community Impact Multiplier", implemented: true, aiPowered: true }
      ]
    }
  ];

  const totalImplemented = elementCategories.flatMap(cat => cat.elements).filter(el => el.implemented).length;
  const totalAIPowered = elementCategories.flatMap(cat => cat.elements).filter(el => el.aiPowered).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  AI Interactive Testing Lab
                </h1>
                <p className="text-gray-600 text-sm">
                  {totalImplemented}/25 elements implemented • {totalAIPowered} AI-powered
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
                25 Elements
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                {totalAIPowered} AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {elementCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                <Badge variant="outline">{category.elements.length} elements</Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {category.elements.filter(el => el.implemented).length} ready
                </Badge>
              </div>

              {/* Elements Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.elements.map((element) => {
                  const ElementComponent = element.component;
                  return (
                    <Card key={element.id} className={`shadow-sm hover:shadow-md transition-shadow ${
                      element.implemented ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {element.title}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              #{element.id}
                            </Badge>
                            {element.aiPowered && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                AI
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {element.implemented ? 'Fully interactive element' : 'Interactive element based on Chapter 1 content'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ElementComponent />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            Testing Lab • {totalImplemented}/25 Interactive Elements • {totalAIPowered} AI-Powered • Chapter 1: AI Fundamentals for Nonprofits
          </p>
          <p className="text-gray-500 text-xs mt-1">
            OpenAI API required for AI-powered elements
          </p>
        </div>
      </div>
    </div>
  );
};

export default AITesting;
