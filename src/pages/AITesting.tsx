import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import implemented interactive components
import { SubwayPatternMatcher } from '@/components/testing/SubwayPatternMatcher';
import { DonorBehaviorPredictor } from '@/components/testing/DonorBehaviorPredictor';
import { EmailResponseClassifier } from '@/components/testing/EmailResponseClassifier';
import { RestaurantSurplusPredictor } from '@/components/testing/RestaurantSurplusPredictor';
import { VolunteerSkillsMatcher } from '@/components/testing/VolunteerSkillsMatcher';

// Import placeholder components
import { 
  AIDefinitionBuilder, 
  AIMythsSwiper, 
  MultipleChoiceScenarios, 
  StoryFillInBlanks, 
  SequenceSorter,
  GrantWritingAssistant,
  DonorSegmentationSimulator,
  VolunteerCoordinationGame,
  FoodRescueRouteOptimizer,
  MentorMatchingSimulator,
  AIBeforeAfterSlider,
  NonprofitAIBingo,
  TimeSavingsCalculator,
  AIMythBusterSpinner,
  SuccessStoryBuilder,
  AIEthicsDecisionTree,
  ROIImpactVisualizer,
  AIToolRecommendationEngine,
  NonprofitAIReadinessQuiz,
  CommunityImpactMultiplier
} from '@/components/testing/PlaceholderComponents';

const AITesting = () => {
  const elementCategories = [
    {
      title: "Pattern Recognition Games",
      icon: Target,
      color: "bg-blue-100 text-blue-700",
      elements: [
        { id: 1, component: SubwayPatternMatcher, title: "Subway Pattern Matcher" },
        { id: 2, component: DonorBehaviorPredictor, title: "Donor Behavior Predictor" },
        { id: 3, component: EmailResponseClassifier, title: "Email Response Classifier" },
        { id: 4, component: RestaurantSurplusPredictor, title: "Restaurant Surplus Predictor" },
        { id: 5, component: VolunteerSkillsMatcher, title: "Volunteer Skills Matcher" }
      ]
    },
    {
      title: "Knowledge Checks",
      icon: Trophy,
      color: "bg-green-100 text-green-700",
      elements: [
        { id: 6, component: AIDefinitionBuilder, title: "AI Definition Builder" },
        { id: 7, component: AIMythsSwiper, title: "AI Myths Swiper" },
        { id: 8, component: MultipleChoiceScenarios, title: "Multiple Choice Scenarios" },
        { id: 9, component: StoryFillInBlanks, title: "Story Fill-in-the-Blanks" },
        { id: 10, component: SequenceSorter, title: "Sequence Sorter" }
      ]
    },
    {
      title: "Scenario-Based Interactions",
      icon: Zap,
      color: "bg-purple-100 text-purple-700",
      elements: [
        { id: 11, component: GrantWritingAssistant, title: "Grant Writing Assistant" },
        { id: 12, component: DonorSegmentationSimulator, title: "Donor Segmentation Simulator" },
        { id: 13, component: VolunteerCoordinationGame, title: "Volunteer Coordination Game" },
        { id: 14, component: FoodRescueRouteOptimizer, title: "Food Rescue Route Optimizer" },
        { id: 15, component: MentorMatchingSimulator, title: "Mentor Matching Simulator" }
      ]
    },
    {
      title: "Creative Engagements",
      icon: Target,
      color: "bg-orange-100 text-orange-700",
      elements: [
        { id: 16, component: AIBeforeAfterSlider, title: "AI Before/After Slider" },
        { id: 17, component: NonprofitAIBingo, title: "Nonprofit AI Bingo" },
        { id: 18, component: TimeSavingsCalculator, title: "Time Savings Calculator" },
        { id: 19, component: AIMythBusterSpinner, title: "AI Myth Buster Spinner" },
        { id: 20, component: SuccessStoryBuilder, title: "Success Story Builder" }
      ]
    },
    {
      title: "Advanced Interactions",
      icon: Trophy,
      color: "bg-red-100 text-red-700",
      elements: [
        { id: 21, component: AIEthicsDecisionTree, title: "AI Ethics Decision Tree" },
        { id: 22, component: ROIImpactVisualizer, title: "ROI Impact Visualizer" },
        { id: 23, component: AIToolRecommendationEngine, title: "AI Tool Recommendation Engine" },
        { id: 24, component: NonprofitAIReadinessQuiz, title: "Nonprofit AI Readiness Quiz" },
        { id: 25, component: CommunityImpactMultiplier, title: "Community Impact Multiplier" }
      ]
    }
  ];

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
                <p className="text-gray-600 text-sm">25 Duolingo-style elements for Chapter 1</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              25 Elements
            </Badge>
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
              </div>

              {/* Elements Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.elements.map((element) => {
                  const ElementComponent = element.component;
                  return (
                    <Card key={element.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {element.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            #{element.id}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          Interactive element based on Chapter 1 content
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
            Testing Lab • 25 Interactive Elements • Chapter 1: AI Fundamentals for Nonprofits
          </p>
        </div>
      </div>
    </div>
  );
};

export default AITesting;
