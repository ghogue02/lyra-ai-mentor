import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface PromptComparisonProps {
  purpose: string;
  audience: string;
  selectedConsiderations: string[];
  onCompletion: () => void;
}

const PromptComparison: React.FC<PromptComparisonProps> = ({
  purpose,
  audience,
  selectedConsiderations,
  onCompletion
}) => {
  const [basicEmail, setBasicEmail] = useState('');
  const [comprehensiveEmail, setComprehensiveEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const generateBothEmails = async () => {
    setIsGenerating(true);
    
    try {
      // Generate basic email
      const basicResponse = await supabase.functions.invoke('maya-prompt-builder', {
        body: {
          purpose,
          audience,
          selectedConsiderations,
          promptType: 'basic'
        }
      });

      // Generate comprehensive email  
      const comprehensiveResponse = await supabase.functions.invoke('maya-prompt-builder', {
        body: {
          purpose,
          audience,
          selectedConsiderations,
          promptType: 'comprehensive'
        }
      });

      if (basicResponse.data) {
        setBasicEmail(basicResponse.data.email);
      }
      
      if (comprehensiveResponse.data) {
        setComprehensiveEmail(comprehensiveResponse.data.email);
      }
      
      setShowComparison(true);
    } catch (error) {
      console.error('Error generating emails:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateBothEmails();
  }, []);

  const analysisPoints = [
    {
      aspect: 'Personal Connection',
      basic: 'Generic, impersonal tone',
      comprehensive: 'Includes Maya\'s voice and personal stakes',
      icon: '💝'
    },
    {
      aspect: 'Specific Details',
      basic: 'Vague mentions of "program success"',
      comprehensive: 'Jordan\'s story, 127 participants, concrete outcomes',
      icon: '📊'
    },
    {
      aspect: 'Audience Awareness',
      basic: 'One-size-fits-all approach',
      comprehensive: 'Tailored to specific board motivations',
      icon: '🎯'
    },
    {
      aspect: 'Call to Action',
      basic: 'Weak or missing next steps',
      comprehensive: 'Clear, compelling call to action',
      icon: '🚀'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Maya's Moment of Truth */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl">Maya's Moment of Truth</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            "I couldn't believe it. The same information, but the difference was night and day. 
            Elena's PACE method didn't just change my email—it changed how I think about every communication."
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>3x more board responses • 2 follow-up meetings scheduled • Funding approved</span>
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {isGenerating && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span>Generating both versions for comparison...</span>
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Comparison */}
      {showComparison && (
        <div className="grid grid-cols-2 gap-6">
          {/* Basic Version */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Maya's First Attempt
                </CardTitle>
                <Badge variant="destructive">Basic Prompt</Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-mono text-red-800">
                    "Write a board email about summer program"
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">{basicEmail}</pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comprehensive Version */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Elena's PACE Method
                </CardTitle>
                <Badge className="bg-green-100 text-green-800">Comprehensive Prompt</Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-mono text-green-800">
                    "Context + Audience + Purpose + Specific Details..."
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">{comprehensiveEmail}</pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Analysis */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              What Made the Difference?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisPoints.map((point, index) => (
                <motion.div
                  key={point.aspect}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-3 gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{point.icon}</span>
                    <span className="font-medium">{point.aspect}</span>
                  </div>
                  <div className="text-sm text-red-600">
                    ❌ {point.basic}
                  </div>
                  <div className="text-sm text-green-600">
                    ✅ {point.comprehensive}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maya's Transformation */}
      {showComparison && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>Maya's Transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              "Three months later, my emails get 3x more responses. Board members schedule follow-up meetings. 
              Donors want to get involved. Elena's PACE framework didn't just change my writing—it changed my entire approach to connection."
            </p>
            <Button 
              onClick={onCompletion}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Complete Maya's Journey
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptComparison;