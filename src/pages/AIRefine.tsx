
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, TestTube, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      status: "needs-work",
      aiPowered: false,
      notes: "Need to add AI-powered sequence generation and validation"
    },
    { 
      id: 2, 
      component: AIContentGenerator, 
      title: "AI Content Generator", 
      status: "in-progress",
      aiPowered: true,
      notes: "Working well, consider adding more content types"
    },
    { 
      id: 8, 
      component: MultipleChoiceScenarios, 
      title: "Multiple Choice Scenarios", 
      status: "needs-work",
      aiPowered: false,
      notes: "Static scenarios - need AI generation for dynamic content"
    },
    { 
      id: 17, 
      component: NonprofitAIBingo, 
      title: "Nonprofit AI Bingo", 
      status: "needs-work",
      aiPowered: false,
      notes: "Basic bingo - needs AI-powered term generation and explanations"
    },
    { 
      id: 4, 
      component: AIImpactStoryCreator, 
      title: "AI Impact Story Creator", 
      status: "ready",
      aiPowered: true,
      notes: "Good functionality, minor UI improvements possible"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'needs-work': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return CheckCircle;
      case 'in-progress': return TestTube;
      case 'needs-work': return Settings;
      default: return Settings;
    }
  };

  const statusCounts = {
    ready: elementsToRefine.filter(el => el.status === 'ready').length,
    inProgress: elementsToRefine.filter(el => el.status === 'in-progress').length,
    needsWork: elementsToRefine.filter(el => el.status === 'needs-work').length
  };

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
                  AI Element Refinement Lab
                </h1>
                <p className="text-gray-600 text-sm">
                  Development workspace for improving interactive elements
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-100 text-red-700">
                {statusCounts.needsWork} Need Work
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-700">
                {statusCounts.inProgress} In Progress
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                {statusCounts.ready} Ready
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
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Refinement Progress</h2>
            <p className="text-gray-600 mb-4">
              This workspace contains 5 interactive elements selected for refinement and improvement before integration into main lessons.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Needs Work: Major improvements needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>In Progress: Good foundation, refinements needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Ready: Polished and lesson-ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elements Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {elementsToRefine.map((element) => {
            const ElementComponent = element.component;
            const StatusIcon = getStatusIcon(element.status);
            
            return (
              <Card key={element.id} className={`shadow-lg hover:shadow-xl transition-shadow border-l-4 ${
                element.status === 'ready' ? 'border-l-green-500' :
                element.status === 'in-progress' ? 'border-l-yellow-500' : 'border-l-red-500'
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {element.title}
                    </CardTitle>
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
                  
                  <div className="flex items-center gap-2 mt-2">
                    <StatusIcon className="w-4 h-4" />
                    <Badge className={`${getStatusColor(element.status)} text-xs font-medium`}>
                      {element.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <CardDescription className="text-sm mt-2">
                    <strong>Development Notes:</strong> {element.notes}
                  </CardDescription>
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

        {/* Development Actions */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Development Actions</h3>
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
              <Settings className="w-4 h-4 mr-2" />
              Export Ready Elements
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            AI Refinement Lab • {elementsToRefine.length} Elements • {elementsToRefine.filter(el => el.aiPowered).length} AI-Powered
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Development workspace for element improvement and testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRefine;
