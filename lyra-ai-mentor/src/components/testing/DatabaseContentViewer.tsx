import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseContentViewerProps {
  onComplete?: () => void;
}

export const DatabaseContentViewer: React.FC<DatabaseContentViewerProps> = ({ onComplete }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [interactiveElements, setInteractiveElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mayaJamesSearch, setMayaJamesSearch] = useState<any>({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all chapters
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('*')
        .order('order_index');
      
      setChapters(chaptersData || []);

      // Fetch all lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('chapter_id, order_index');
      
      setLessons(lessonsData || []);

      // Search for Maya/James content
      await searchForMayaJames();
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchForMayaJames = async () => {
    try {
      // Search in content blocks
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('lesson_id, title, content')
        .or('content.ilike.%maya%,content.ilike.%james%');

      // Search in interactive elements
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('lesson_id, type, title, content')
        .or('content.ilike.%maya%,content.ilike.%james%,title.ilike.%maya%,title.ilike.%james%');

      setMayaJamesSearch({
        contentBlocks: contentBlocks || [],
        elements: elements || []
      });
    } catch (error) {
      console.error('Error searching for Maya/James:', error);
    }
  };

  const fetchChapterElements = async (chapterId: number) => {
    setLoading(true);
    try {
      const chapterLessons = lessons.filter(l => l.chapter_id === chapterId);
      const lessonIds = chapterLessons.map(l => l.id);
      
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('*')
        .in('lesson_id', lessonIds)
        .order('lesson_id, order_index');
      
      setInteractiveElements(elements || []);
      setSelectedChapter(chapterId);
    } catch (error) {
      console.error('Error fetching elements:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchForAgents = async () => {
    setLoading(true);
    try {
      const { data: agentElements } = await supabase
        .from('interactive_elements')
        .select(`
          id,
          lesson_id,
          type,
          title,
          content,
          order_index,
          lessons!inner(
            title as lesson_title,
            chapter_id,
            chapters!inner(
              title as chapter_title
            )
          )
        `)
        .or('type.ilike.%agent%,type.ilike.%auditor%,type.ilike.%builder%,type.ilike.%coordinator%')
        .order('lesson_id');

      console.log('Found agent elements:', agentElements);
      return agentElements;
    } catch (error) {
      console.error('Error searching for agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getLessonCount = (chapterId: number) => {
    return lessons.filter(l => l.chapter_id === chapterId).length;
  };

  const getMayaJamesIndicator = (lessonId: number) => {
    const hasContent = mayaJamesSearch.contentBlocks?.some((cb: any) => cb.lesson_id === lessonId);
    const hasElement = mayaJamesSearch.elements?.some((el: any) => el.lesson_id === lessonId);
    
    if (hasContent || hasElement) {
      return <span className="text-green-600 text-xs ml-2">✓ Maya/James</span>;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Content Viewer</h2>
      
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          
          <button
            onClick={searchForAgents}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Search for Agent Elements
          </button>
        </div>

        {/* Chapters Overview */}
        <div>
          <h3 className="font-semibold mb-3">Chapters Overview</h3>
          <div className="space-y-2">
            {chapters.map(chapter => (
              <div 
                key={chapter.id} 
                className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => fetchChapterElements(chapter.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Chapter {chapter.id}: {chapter.title}</h4>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getLessonCount(chapter.id)} lessons | Published: {chapter.is_published ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Elements →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons for Selected Chapter */}
        {selectedChapter && (
          <div>
            <h3 className="font-semibold mb-3">
              Chapter {selectedChapter} Lessons & Interactive Elements
            </h3>
            <div className="space-y-4">
              {lessons
                .filter(l => l.chapter_id === selectedChapter)
                .map(lesson => {
                  const lessonElements = interactiveElements.filter(e => e.lesson_id === lesson.id);
                  
                  return (
                    <div key={lesson.id} className="border rounded p-4 bg-gray-50">
                      <h4 className="font-medium">
                        Lesson {lesson.id}: {lesson.title}
                        {getMayaJamesIndicator(lesson.id)}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{lesson.subtitle}</p>
                      
                      {lessonElements.length > 0 ? (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium mb-2">Interactive Elements:</h5>
                          <div className="space-y-1">
                            {lessonElements.map(element => (
                              <div key={element.id} className="text-sm bg-white p-2 rounded border">
                                <span className="font-medium">{element.type}</span>: {element.title}
                                {element.type.includes('agent') && 
                                  <span className="text-purple-600 ml-2">🤖 Agent</span>
                                }
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No interactive elements</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Maya/James Content Summary */}
        <div className="bg-blue-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">Maya/James Content Summary</h3>
          <div className="text-sm space-y-1">
            <p>Content blocks with Maya/James: {mayaJamesSearch.contentBlocks?.length || 0}</p>
            <p>Interactive elements with Maya/James: {mayaJamesSearch.elements?.length || 0}</p>
            {mayaJamesSearch.elements?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Elements:</p>
                {mayaJamesSearch.elements.slice(0, 5).map((el: any, idx: number) => (
                  <div key={idx} className="text-xs text-gray-600">
                    • Lesson {el.lesson_id}: {el.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};