
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface AIGeneratedImageProps {
  prompt: string;
  title: string;
  metadata?: {
    size?: string;
  };
}

export const AIGeneratedImage: React.FC<AIGeneratedImageProps> = ({
  prompt,
  title,
  metadata = {}
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating image for:', title);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-lesson-image', {
        body: {
          prompt,
          size: metadata.size || '512x512' // Default to smaller size
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
        console.log('Image generated successfully:', data.imageUrl);
      } else {
        throw new Error('No image URL received');
      }

    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    generateImage();
  };

  if (loading || retrying) {
    return (
      <div className="my-6 flex items-center gap-4">
        <div className="flex-shrink-0">
          <Skeleton className="w-48 h-32 rounded-lg" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className={`w-4 h-4 ${(loading || retrying) ? 'animate-spin' : ''}`} />
            <span className="text-sm text-gray-600">
              {retrying ? 'Regenerating illustration...' : 'Generating illustration...'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6">
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate illustration: {error}
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">Image unavailable</span>
          </div>
          <div className="flex-1">
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm"
              className="mb-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 flex items-start gap-4">
      <div className="flex-shrink-0">
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={title}
          className="w-48 h-32 object-cover rounded-lg shadow-sm border border-gray-200"
          onError={() => {
            console.error('Image failed to load:', imageUrl);
            setError('Image failed to load');
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 italic">AI-generated illustration</p>
      </div>
    </div>
  );
};
