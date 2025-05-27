
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface IconRequest {
  iconName: string;
  description: string;
  style?: string;
  size?: number;
}

interface GenerationResult {
  iconName: string;
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}

export const IconGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  const iconRequests: IconRequest[] = [
    {
      iconName: 'navbar-logo',
      description: 'Modern logo for navigation bar with brain and lightbulb elements representing AI learning',
      style: 'clean, professional branding style'
    },
    {
      iconName: 'loading-lyra',
      description: 'Friendly AI assistant character in a loading/thinking pose with subtle animation elements',
      style: 'warm, approachable character design'
    },
    {
      iconName: 'lyra-thinking',
      description: 'AI assistant character with thought bubbles or gears showing processing/thinking state',
      style: 'friendly character with subtle thinking indicators'
    },
    {
      iconName: 'lyra-celebrating',
      description: 'AI assistant character in celebration pose with confetti or success elements',
      style: 'joyful, encouraging character design'
    },
    {
      iconName: 'user-role-fundraising',
      description: 'Professional avatar representing fundraising and development roles with heart and dollar symbols',
      style: 'warm, trustworthy professional avatar'
    },
    {
      iconName: 'user-role-programs',
      description: 'Professional avatar representing program management with community and service symbols',
      style: 'caring, organized professional avatar'
    },
    {
      iconName: 'user-role-operations',
      description: 'Professional avatar representing operations and administration with gear and organization symbols',
      style: 'efficient, reliable professional avatar'
    },
    {
      iconName: 'user-role-marketing',
      description: 'Professional avatar representing marketing and communications with megaphone and creative symbols',
      style: 'creative, communicative professional avatar'
    },
    {
      iconName: 'user-role-it',
      description: 'Professional avatar representing IT and technology roles with computer and code symbols',
      style: 'tech-savvy, innovative professional avatar'
    },
    {
      iconName: 'empty-state-welcome',
      description: 'Friendly illustration for empty dashboard states showing a welcoming workspace',
      style: 'inviting, optimistic illustration'
    },
    {
      iconName: 'error-state-friendly',
      description: 'Gentle, non-threatening error illustration with a helpful character or symbol',
      style: 'reassuring, supportive design'
    },
    {
      iconName: 'success-completion',
      description: 'Celebration illustration for course completion with trophy, stars, and achievement elements',
      style: 'triumphant, rewarding celebration design'
    },
    {
      iconName: 'badge-first-chapter',
      description: 'Achievement badge for completing the first chapter with beginner-friendly design',
      style: 'encouraging milestone badge'
    },
    {
      iconName: 'badge-course-complete',
      description: 'Master achievement badge for completing the entire course with premium design elements',
      style: 'prestigious, accomplished achievement badge'
    }
  ];

  const handleGenerateIcons = async () => {
    setIsGenerating(true);
    setResults([]);
    setCurrentStep('Starting icon generation...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-icons', {
        body: { icons: iconRequests }
      });

      if (error) {
        throw error;
      }

      setResults(data.results);
      setCurrentStep(`Generation complete! ${data.summary.successful}/${data.summary.total} icons generated successfully.`);
      
    } catch (error) {
      console.error('Error generating icons:', error);
      setCurrentStep(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Phase 2 Icon Generator
        </CardTitle>
        <CardDescription>
          Generate all the missing icons needed for the enhanced icon system implementation.
          This will create {iconRequests.length} new icons for navigation, user roles, Lyra expressions, and UI enhancements.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Icons to Generate:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {iconRequests.map((icon, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{icon.iconName}</span>
                  <Badge variant="outline" className="text-xs">
                    {icon.style?.split(',')[0] || 'standard'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Generation Status:</h4>
            <div className="space-y-2">
              {currentStep && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span className="text-sm">{currentStep}</span>
                </div>
              )}

              {results.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span>{result.iconName}</span>
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleGenerateIcons}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Icons...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                Generate All Icons
              </>
            )}
          </Button>

          {results.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              {results.filter(r => r.success).length} / {results.length} successful
            </Badge>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Icon generation complete! The new icons are now available in Supabase Storage 
              and ready to be used in the Phase 2 implementation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
