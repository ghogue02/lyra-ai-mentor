import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UnderstandingAIModels } from './interactive/UnderstandingAIModels';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

export const LyraUnderstandingAIModelsLesson: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);

  const handleComplete = () => {
    setIsCompleted(true);
    
    toast({
      title: "Lesson Complete! 🎉",
      description: "You've learned about AI model selection and cost optimization.",
      variant: "default"
    });

    // Auto-navigate after celebration
    setTimeout(() => {
      navigate('/chapter/1');
    }, 3000);
  };

  useEffect(() => {
    // Simulate learning progress tracking
    const interval = setInterval(() => {
      setCompletionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-purple-900">
            Congratulations! 🎉
          </h1>
          
          <p className="text-lg text-purple-700">
            You've successfully learned about AI model selection, cost optimization, 
            and how to choose the right AI for different nonprofit tasks.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-purple-800">AI Model Comparison Mastered</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-purple-800">Cost Optimization Understood</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-purple-800">Smart Model Selection Skills</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/chapter/1')}
            className="nm-button-primary px-8 py-3"
          >
            Continue Your Journey
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-purple-50/30">
      {/* Hover Navigation */}
      <MicroLessonNavigator
        chapterNumber={1}
        chapterTitle="Introduction to AI for Nonprofits"
        lessonTitle="Understanding AI Models"
        characterName="Lyra"
      />
      
      <div className="container mx-auto px-4 py-6">

        {/* Main Content */}
        <UnderstandingAIModels />

        {/* Completion Section */}
        <div className="mt-12">
          <div className="nm-card nm-p-xl max-w-2xl mx-auto text-center space-y-4">
            <h3 className="nm-text-primary text-xl font-semibold">Ready to Complete This Lesson?</h3>
            
            <p className="nm-text-secondary">
              You've explored different AI models and learned how to make cost-effective choices 
              for your nonprofit work. Test the model comparison tool above to solidify your understanding.
            </p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium nm-text-primary">What You've Learned:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm nm-text-secondary">
                <div>• Model strengths and weaknesses</div>
                <div>• Cost optimization strategies</div>
                <div>• Use case matching</div>
                <div>• Smart model selection</div>
              </div>
            </div>
            
            <button
              onClick={handleComplete}
              className="nm-button-primary w-full nm-button-lg"
            >
              Complete Lesson & Continue Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};