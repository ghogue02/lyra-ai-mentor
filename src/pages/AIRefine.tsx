
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';
import { LyraAvatar } from '@/components/LyraAvatar';

// Import the 5 selected components
import { AIContentGenerator } from '@/components/testing/AIContentGenerator';
import { AIImpactStoryCreator } from '@/components/testing/AIImpactStoryCreator';
import { SequenceSorter } from '@/components/testing/SequenceSorter';
import { MultipleChoiceScenarios } from '@/components/testing/MultipleChoiceScenarios';
import { 
  NonprofitAIBingo
} from '@/components/testing/PlaceholderComponents';

const AIRefine = () => {
  const elementsToRefine = [
    { 
      id: 10, 
      component: SequenceSorter, 
      title: "Sequence Sorter", 
      aiPowered: false,
      icon: getSupabaseIconUrl('workflow-process.png'),
      avatarIcon: 'lyra-avatar.png'
    },
    { 
      id: 2, 
      component: AIContentGenerator, 
      title: "AI Content Generator", 
      aiPowered: true,
      icon: getSupabaseIconUrl('data-analytics.png'),
      avatarIcon: 'lyra-thinking.png'
    },
    { 
      id: 8, 
      component: MultipleChoiceScenarios, 
      title: "Multiple Choice Scenarios", 
      aiPowered: false,
      icon: getSupabaseIconUrl('learning-target.png'),
      avatarIcon: 'communication.png'
    },
    { 
      id: 17, 
      component: NonprofitAIBingo, 
      title: "Nonprofit AI Bingo", 
      aiPowered: false,
      icon: getSupabaseIconUrl('achievement-trophy.png'),
      avatarIcon: 'empty-state-welcome.png'
    },
    { 
      id: 4, 
      component: AIImpactStoryCreator, 
      title: "AI Impact Story Creator", 
      aiPowered: true,
      icon: getSupabaseIconUrl('communication.png'),
      avatarIcon: 'hero-main.png'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Elements Grid - Changed to single column */}
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {elementsToRefine.map((element) => {
            const ElementComponent = element.component;
            
            return (
              <Card key={element.id} className="shadow-lg hover:shadow-xl transition-shadow">
                {/* Lyra Avatar centered above the heading - doubled size */}
                <div className="flex justify-center pt-6 pb-2">
                  <img 
                    src={getSupabaseIconUrl(element.avatarIcon)} 
                    alt={`Lyra avatar for ${element.title}`}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      // Fallback to a default icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                <CardHeader className="pb-4 pt-2">
                  <div className="flex items-center justify-center gap-3">
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
                    <CardTitle className="text-lg font-semibold text-center">
                      {element.title}
                    </CardTitle>
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
      </div>
    </div>
  );
};

export default AIRefine;
