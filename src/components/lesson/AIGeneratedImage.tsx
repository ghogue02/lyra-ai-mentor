
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
          size: metadata.size || '1024x1024'
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
      <div className="my-8 space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RefreshCw className={`w-4 h-4 ${(loading || retrying) ? 'animate-spin' : ''}`} />
            <span className="text-sm text-gray-600">
              {retrying ? 'Regenerating image...' : 'Generating AI image...'}
            </span>
          </div>
        </div>
        <Skeleton className="w-full h-64 rounded-lg" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate image: {error}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-center mb-4">
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={title}
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '500px' }}
          onError={() => {
            console.error('Image failed to load:', imageUrl);
            setError('Image failed to load');
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 italic">AI-generated illustration</p>
      </div>
    </div>
  );
};
