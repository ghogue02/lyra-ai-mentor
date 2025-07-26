import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UnderstandingAIModels } from './interactive/UnderstandingAIModels';
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
          
          <Button 
            onClick={() => navigate('/chapter/1')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          >
            Continue Your Journey
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-purple-50/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/chapter/1')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapter 1
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Lesson 3
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm font-medium">Understanding AI Models</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Progress: {Math.min(completionProgress, 100)}%
            </div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(completionProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <UnderstandingAIModels />

        {/* Completion Section */}
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Ready to Complete This Lesson?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You've explored different AI models and learned how to make cost-effective choices 
                for your nonprofit work. Test the model comparison tool above to solidify your understanding.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">What You've Learned:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• Model strengths and weaknesses</div>
                  <div>• Cost optimization strategies</div>
                  <div>• Use case matching</div>
                  <div>• Smart model selection</div>
                </div>
              </div>
              
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                Complete Lesson & Continue Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};