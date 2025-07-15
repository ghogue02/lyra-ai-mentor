import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'; // List ALL icons used
import { useToast } from '@/hooks/use-toast';
import { EnsureToolkitData } from '@/hooks/useEnsureToolkitData';
import { ToolkitService } from '@/services/toolkitService';
import type { Database } from '@/integrations/supabase/types';

// Define types for your lesson data
interface LessonData {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

interface LessonComponentProps {
  chapterNumber: number;
  lessonNumber: number;
  characterName: string;
}

/**
 * Template for creating new lesson components with proper validation and error handling
 * 
 * Usage:
 * 1. Copy this file to your lesson directory
 * 2. Rename component and update imports
 * 3. Implement lesson-specific logic in marked sections
 * 4. Add required database categories to CHAPTER_REQUIREMENTS
 * 5. Write tests following TDD/BDD patterns
 */
export function LessonComponentTemplate({ 
  chapterNumber, 
  lessonNumber, 
  characterName 
}: LessonComponentProps) {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const toolkitService = new ToolkitService(); // Instantiate service

  // Load lesson data with error handling
  useEffect(() => {
    async function loadLessonData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Implement lesson-specific data loading
        // const data = await loadLessonContent(chapterNumber, lessonNumber);
        // setLessonData(data);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load lesson';
        setError(errorMessage);
        console.error('[LessonError]', {
          chapter: chapterNumber,
          lesson: lessonNumber,
          error: err
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadLessonData();
  }, [chapterNumber, lessonNumber]);

  // Save to toolkit with validation
  const handleSaveToToolkit = async () => {
    try {
      setIsLoading(true);
      
      // Validate data exists
      if (!lessonData) {
        throw new Error('No lesson data to save');
      }

      // TODO: Map lesson data to toolkit format
      const toolkitItem = {
        name: lessonData.title,
        category_key: 'training', // TODO: Update based on lesson type
        description: `Chapter ${chapterNumber} - Lesson ${lessonNumber}`,
        file_type: 'lesson_content',
        is_new: true,
        metadata: JSON.stringify({
          chapter: chapterNumber,
          lesson: lessonNumber,
          character: characterName,
          ...lessonData.metadata
        })
      };

      // Save with error handling
      const result = await toolkitService.saveItem(toolkitItem);
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Saved to MyToolkit!",
        description: "You can access this lesson content anytime.",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="link" 
            onClick={() => window.location.reload()}
            className="ml-2"
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Main render with data validation wrapper
  return (
    <EnsureToolkitData
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading lesson data...</span>
        </div>
      }
      errorFallback={(error) => (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Database initialization failed: {error}
          </AlertDescription>
        </Alert>
      )}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            Chapter {chapterNumber} - Lesson {lessonNumber}
          </CardTitle>
          <CardDescription>
            Learning with {characterName}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {/* Main lesson content */}
          {!isLoading && lessonData && (
            <>
              <div className="prose max-w-none">
                {/* TODO: Implement your lesson UI here */}
                <h3>{lessonData.title}</h3>
                <p>{lessonData.content}</p>
              </div>
              
              {/* Save to toolkit button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveToToolkit}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Save to MyToolkit
                </Button>
              </div>
            </>
          )}
          
          {/* Empty state */}
          {!isLoading && !lessonData && (
            <div className="text-center py-12 text-muted-foreground">
              No lesson content available
            </div>
          )}
        </CardContent>
      </Card>
    </EnsureToolkitData>
  );
}

// Export lesson metadata for testing and validation
export const LESSON_METADATA = {
  requiredCategories: ['training'],
  requiredAchievements: ['first_unlock'],
  testIds: {
    saveButton: 'save-to-toolkit',
    contentArea: 'lesson-content',
    loadingState: 'lesson-loading'
  }
};