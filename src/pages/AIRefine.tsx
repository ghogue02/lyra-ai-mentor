
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TestTube, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';

// Import the 5 selected components
import { AIContentGenerator } from '@/components/testing/AIContentGenerator';
import { AIImpactStoryCreator } from '@/components/testing/AIImpactStoryCreator';
import { 
  MultipleChoiceScenarios, 
  SequenceSorter,
  NonprofitAIBingo
} from '@/components/testing/PlaceholderComponents';

const AIRefine = () => {
  const elementsToRefine = [
    { 
      id: 10, 
      component: SequenceSorter, 
      title: "Sequence Sorter", 
      aiPowered: false,
      icon: getSupabaseIconUrl('workflow-process.png')
    },
    { 
      id: 2, 
      component: AIContentGenerator, 
      title: "AI Content Generator", 
      aiPowered: true,
      icon: getSupabaseIconUrl('data-analytics.png')
    },
    { 
      id: 8, 
      component: MultipleChoiceScenarios, 
      title: "Multiple Choice Scenarios", 
      aiPowered: false,
      icon: getSupabaseIconUrl('learning-target.png')
    },
    { 
      id: 17, 
      component: NonprofitAIBingo, 
      title: "Nonprofit AI Bingo", 
      aiPowered: false,
      icon: getSupabaseIconUrl('achievement-trophy.png')
    },
    { 
      id: 4, 
      component: AIImpactStoryCreator, 
      title: "AI Impact Story Creator", 
      aiPowered: true,
      icon: getSupabaseIconUrl('communication.png')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/ai-testing">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to AI Testing
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  Interactive Elements Showcase
                </h1>
                <p className="text-gray-600 text-sm">
                  Explore and test interactive learning components
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-purple-100 text-purple-700">
                {elementsToRefine.filter(el => el.aiPowered).length} AI-Powered
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                {elementsToRefine.length} Elements
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Interactive Elements Collection</h2>
            <p className="text-gray-600 mb-4">
              This showcase contains {elementsToRefine.length} interactive learning components that demonstrate various engagement techniques and educational approaches for nonprofit AI training.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>AI-Powered Components</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Interactive Learning Elements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elements Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {elementsToRefine.map((element) => {
            const ElementComponent = element.component;
            
            return (
              <Card key={element.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={element.icon} 
                        alt={`${element.title} icon`}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // Fallback to a default icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <CardTitle className="text-lg font-semibold">
                        {element.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
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
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                    <ElementComponent />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Explore More</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/ai-testing">
                <TestTube className="w-4 h-4 mr-2" />
                Return to Full Testing Lab
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/dashboard">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <ArrowLeft className="w-4 h-4 mr-2" />
              More Components Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            Interactive Elements Showcase • {elementsToRefine.length} Components • {elementsToRefine.filter(el => el.aiPowered).length} AI-Powered
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Educational components for nonprofit AI training and engagement
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRefine;
