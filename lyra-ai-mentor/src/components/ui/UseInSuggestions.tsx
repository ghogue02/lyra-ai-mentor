import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { componentIntegrationService, SharedContent } from '@/services/componentIntegrationService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UseInSuggestionsProps {
  content: any;
  contentType: 'email' | 'story' | 'data' | 'workflow' | 'strategy';
  fromCharacter: string;
  componentType: string;
  className?: string;
}

interface Suggestion {
  component: string;
  benefit: string;
  route?: string;
  icon?: React.ReactNode;
}

export const UseInSuggestions: React.FC<UseInSuggestionsProps> = ({
  content,
  contentType,
  fromCharacter,
  componentType,
  className = ''
}) => {
  const navigate = useNavigate();
  
  // Get smart suggestions from the integration service
  const suggestions = componentIntegrationService.getSuggestions(componentType);
  
  const handleUseIn = (suggestion: any) => {
    // Share the content
    const sharedContent: SharedContent = {
      data: content,
      fromCharacter,
      toComponent: suggestion.toComponent,
      timestamp: new Date().toISOString(),
      type: contentType
    };
    
    componentIntegrationService.shareContent(sharedContent);
    
    // Show success message
    toast.success(`Content ready for ${suggestion.toComponent}`, {
      description: suggestion.benefit,
      action: suggestion.route ? {
        label: 'Go there',
        onClick: () => navigate(suggestion.route)
      } : undefined
    });
  };
  
  if (suggestions.length === 0) return null;
  
  return (
    <Card className={`p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Use This Content In...</h3>
        </div>
        
        <div className="grid gap-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-between hover:bg-white hover:border-blue-400"
              onClick={() => handleUseIn(suggestion)}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{suggestion.toComponent}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Button>
          ))}
        </div>
        
        <p className="text-xs text-gray-600 italic">
          {suggestions[0].benefit}
        </p>
      </div>
    </Card>
  );
};