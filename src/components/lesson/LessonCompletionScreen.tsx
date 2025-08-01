import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl, getSupabaseIconUrl } from '@/utils/supabaseIcons';
import { BrandedIcon } from '@/components/ui/BrandedIcon';

interface LessonCompletionScreenProps {
  title: string;
  description: string;
  characterType?: 'lyra' | 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  achievementType?: 'ethics' | 'data' | 'workflow' | 'communication' | 'achievement' | 'growth';
  backRoute: string;
  nextRoute?: string;
  nextButtonText?: string;
  showScorecard?: boolean;
  scorecardData?: Array<{
    label: string;
    value: string | number;
    type: 'success' | 'warning' | 'info';
  }>;
  customActions?: React.ReactNode;
}

export const LessonCompletionScreen: React.FC<LessonCompletionScreenProps> = ({
  title,
  description,
  characterType = 'lyra',
  achievementType = 'achievement',
  backRoute,
  nextRoute,
  nextButtonText = 'Continue Learning',
  showScorecard = false,
  scorecardData = [],
  customActions
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      key="completion"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-3">
            <div className="w-12 h-12">
              <OptimizedVideoAnimation
                src={getAnimationUrl(`${characterType}-celebration.mp4`)}
                fallbackIcon={
                  <BrandedIcon 
                    type={achievementType} 
                    variant="static" 
                    size="xl" 
                  />
                }
                className="w-full h-full"
                context="celebration"
                loop={false}
              />
            </div>
            <span className="text-xl font-bold">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              {description}
            </p>
            
            {showScorecard && scorecardData.length > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-brand-cyan/10 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">Your Progress Summary:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scorecardData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        item.type === 'success' ? 'border-green-500 bg-green-50' :
                        item.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-lg font-bold text-gray-900">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate(backRoute)}
                variant="outline"
                size="lg"
              >
                Back to Chapter
              </Button>
              
              {nextRoute && (
                <Button 
                  onClick={() => navigate(nextRoute)}
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {nextButtonText}
                </Button>
              )}
              
              {customActions}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};