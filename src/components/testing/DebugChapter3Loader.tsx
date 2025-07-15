import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
}

export const DebugChapter3Loader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [elements, setElements] = useState<InteractiveElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Intercept console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, `[LOG] ${message}`]);
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, `[ERROR] ${message}`]);
      originalError.apply(console, args);
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const loadChapter3Lesson5 = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);
    setElements([]);
    
    try {
      console.log('=== Starting Chapter 3, Lesson 5 Load Test ===');
      
      // Get all lessons in Chapter 3
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, slug')
        .eq('chapter_id', 3)
        .order('order_index');
      
      if (lessonsError) throw lessonsError;
      
      console.log('Chapter 3 lessons:', lessons);
      
      // Find lesson 5 (typically "Transforming Stories of Struggle")
      const lesson5 = lessons?.find(l => l.title.includes('Transforming Stories'));
      
      if (!lesson5) {
        throw new Error('Could not find Lesson 5 in Chapter 3');
      }
      
      console.log('Found Lesson 5:', lesson5);
      
      // Load interactive elements for this lesson
      const { data: interactiveElements, error: elementsError } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lesson5.id)
        .eq('is_active', true)
        .order('order_index');
      
      if (elementsError) throw elementsError;
      
      console.log(`Found ${interactiveElements?.length || 0} interactive elements in Lesson 5`);
      
      if (interactiveElements) {
        interactiveElements.forEach((element, index) => {
          console.log(`Element ${index + 1}:`, {
            id: element.id,
            type: element.type,
            title: element.title,
            order_index: element.order_index
          });
        });
        
        setElements(interactiveElements);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading Chapter 3, Lesson 5:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Debug Chapter 3, Lesson 5 Component Loading</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button 
            onClick={loadChapter3Lesson5} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load Chapter 3, Lesson 5'
            )}
          </Button>
          <Button 
            onClick={clearLogs}
            variant="outline"
          >
            Clear Logs
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Console Log Output */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Console Output:</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click "Load Chapter 3, Lesson 5" to start.</p>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1 ${log.startsWith('[ERROR]') ? 'text-red-400' : 'text-gray-300'}`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Render Interactive Elements */}
        {elements.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Rendering {elements.length} Interactive Elements:</h3>
            <div className="space-y-6">
              {elements.map((element) => (
                <div key={element.id} className="border-2 border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Rendering element {element.id} ({element.type}): {element.title}
                  </p>
                  <InteractiveElementRenderer
                    element={element}
                    lessonId={5}
                    lessonContext={{
                      chapterTitle: "Sofia's Story Transformation",
                      lessonTitle: "Transforming Stories of Struggle"
                    }}
                    onElementComplete={(id) => console.log(`Element ${id} completed`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};