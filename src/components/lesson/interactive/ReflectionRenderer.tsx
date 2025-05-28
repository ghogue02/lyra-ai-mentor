
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReflectionRendererProps {
  element: {
    id: number;
    title: string;
    content: string;
    configuration: any;
  };
  lessonId: number;
  onComplete: () => Promise<void>;
}

export const ReflectionRenderer: React.FC<ReflectionRendererProps> = ({
  element,
  lessonId,
  onComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reflectionText, setReflectionText] = useState('');
  const [isReflectionSaving, setIsReflectionSaving] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const config = element.configuration || {};
  const suggestions = config.suggestions || [];
  const imageFile = config.image_file;
  const layout = config.layout;

  // Function to get image URL from Supabase storage
  const getImageUrl = (filename: string) => {
    if (!filename) return null;
    const { data } = supabase.storage
      .from('lesson-images')
      .getPublicUrl(filename);
    console.log(`ReflectionRenderer: Getting image URL for ${filename}:`, data.publicUrl);
    return data.publicUrl;
  };

  const imageUrl = imageFile ? getImageUrl(imageFile) : null;

  useEffect(() => {
    if (user) {
      loadExistingReflection();
    }
  }, [user, element.id, lessonId]);

  const loadExistingReflection = async () => {
    if (!user) return;

    try {
      console.log(`ReflectionRenderer: Loading existing reflection for element ${element.id}`);
      
      const { data, error } = await supabase
        .from('user_interactions')
        .select('content')
        .eq('user_id', user.id)
        .eq('interactive_element_id', element.id)
        .eq('lesson_id', lessonId)
        .eq('interaction_type', 'reflection')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        console.log(`ReflectionRenderer: Found existing reflection for element ${element.id}`);
        setReflectionText(data.content);
        setReflectionSaved(true);
        await onComplete();
      }
    } catch (error: any) {
      console.error('Error loading existing reflection:', error);
    }
  };

  const handleReflectionSubmit = async () => {
    if (!user || !reflectionText.trim()) return;

    setIsReflectionSaving(true);
    try {
      console.log(`ReflectionRenderer: Saving reflection for element ${element.id}`);
      
      const { error: reflectionError } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          interactive_element_id: element.id,
          interaction_type: 'reflection',
          content: reflectionText.trim(),
          metadata: {
            question: element.content,
            element_title: element.title
          }
        });

      if (reflectionError) throw reflectionError;

      setReflectionSaved(true);
      await onComplete();
      
      console.log(`ReflectionRenderer: Reflection saved and element ${element.id} marked complete`);
      
      toast({
        title: "Reflection saved!",
        description: "Your thoughts have been saved to your learning journal."
      });
    } catch (error: any) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error saving reflection",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsReflectionSaving(false);
    }
  };

  const renderReflectionContent = () => (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">{element.content}</p>
      
      {suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Consider these examples:</p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            {suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="list-disc">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <Textarea
        placeholder="Share your thoughts..."
        value={reflectionText}
        onChange={(e) => setReflectionText(e.target.value)}
        className="min-h-[80px]"
        disabled={reflectionSaved}
      />
      
      {reflectionSaved ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckSquare className="w-4 h-4" />
          <span className="text-sm">Reflection saved to your learning journal</span>
        </div>
      ) : (
        <Button
          onClick={handleReflectionSubmit}
          disabled={!reflectionText.trim() || isReflectionSaving}
          size="sm"
        >
          {isReflectionSaving ? 'Saving...' : 'Save Reflection'}
        </Button>
      )}
      
      {config.follow_up && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-700">{config.follow_up}</p>
        </div>
      )}
    </div>
  );

  // Handle image layout - right side with smaller image
  if (layout === 'image_right_text_left' && imageUrl) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {renderReflectionContent()}
        </div>
        <div className="lg:w-1/3 flex justify-center lg:justify-end">
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg p-4">
            <img 
              src={imageUrl} 
              alt={element.title}
              className="w-full max-w-xs h-auto object-contain rounded-lg shadow-sm"
              onLoad={() => console.log(`ReflectionRenderer: Reflection image loaded successfully for ${element.title}`)}
              onError={(e) => console.error(`ReflectionRenderer: Reflection image failed to load for ${element.title}:`, e)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle image layout - top placement (existing)
  if (layout === 'image_top_text_bottom' && imageUrl) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg p-6">
          <img 
            src={imageUrl} 
            alt={element.title}
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-sm"
            onLoad={() => console.log(`ReflectionRenderer: Reflection image loaded successfully for ${element.title}`)}
            onError={(e) => console.error(`ReflectionRenderer: Reflection image failed to load for ${element.title}:`, e)}
          />
        </div>
        {renderReflectionContent()}
      </div>
    );
  }

  return renderReflectionContent();
};
