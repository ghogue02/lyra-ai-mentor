
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

interface AIGeneratedImageProps {
  prompt: string;
  className?: string;
}

export const AIGeneratedImage: React.FC<AIGeneratedImageProps> = ({
  prompt,
  className = ""
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating inline image for prompt:', prompt);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-lesson-image', {
        body: {
          prompt,
          size: '512x512'
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        console.log('Inline image generated successfully');
      } else {
        throw new Error('No image URL received');
      }

    } catch (err) {
      console.error('Error generating inline image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, []);

  if (loading) {
    return (
      <div className={`inline-block ${className}`}>
        <Skeleton className="w-32 h-24 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`inline-block w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <RefreshCw 
          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
          onClick={generateImage}
        />
      </div>
    );
  }

  return (
    <img 
      src={imageUrl || '/placeholder.svg'} 
      alt=""
      className={`inline-block w-32 h-24 object-cover rounded-lg shadow-sm border border-gray-200 ${className}`}
      onError={() => {
        console.error('Inline image failed to load:', imageUrl);
        setError('Image failed to load');
      }}
    />
  );
};
