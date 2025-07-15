import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseDebuggerProps {
  onComplete?: () => void;
}

export const DatabaseDebugger: React.FC<DatabaseDebuggerProps> = ({ onComplete }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all chapters (including unpublished)
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('*')
        .order('id');

      // Fetch all lessons for chapters 3-6
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .in('chapter_id', [3, 4, 5, 6])
        .order('chapter_id, id');

      setChapters(chaptersData || []);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupDuplicates = async () => {
    setLoading(true);
    setCleanupResult('Starting cleanup...');
    
    try {
      // Step 1: Delete interactive elements for chapters 3-6
      const { error: ieError } = await supabase
        .from('interactive_elements')
        .delete()
        .in('lesson_id', lessons.map(l => l.id));

      if (ieError) throw ieError;
      setCleanupResult('✅ Deleted interactive elements');

      // Step 2: Delete content blocks for chapters 3-6
      const { error: cbError } = await supabase
        .from('content_blocks')
        .delete()
        .in('lesson_id', lessons.map(l => l.id));

      if (cbError) throw cbError;
      setCleanupResult('✅ Deleted content blocks');

      // Step 3: Delete lessons for chapters 3-6
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .in('chapter_id', [3, 4, 5, 6]);

      if (lessonsError) throw lessonsError;
      setCleanupResult('✅ Deleted lessons');

      // Step 4: Delete all chapters 3-6
      const { error: chaptersError } = await supabase
        .from('chapters')
        .delete()
        .gte('id', 3);

      if (chaptersError) throw chaptersError;
      setCleanupResult('✅ Deleted duplicate chapters');

      // Refresh data
      await fetchData();
      setCleanupResult('✅ Cleanup complete! Duplicates removed.');
      
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Cleanup error:', error);
      setCleanupResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const duplicateChapters = chapters.filter((c, index, arr) => 
    arr.findIndex(other => other.id === c.id) !== index
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Debugger</h2>
      
      <div className="space-y-6">
        <div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Chapter Summary */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Chapter Summary</h3>
          <p>Total chapters in database: <strong>{chapters.length}</strong></p>
          <p>Duplicate chapters detected: <strong>{duplicateChapters.length}</strong></p>
          {duplicateChapters.length > 0 && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
              <p className="text-red-700">⚠️ Duplicates found for IDs: {duplicateChapters.map(c => c.id).join(', ')}</p>
            </div>
          )}
        </div>

        {/* All Chapters */}
        <div>
          <h3 className="font-semibold mb-2">All Chapters in Database</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2">ID</th>
                  <th className="border border-gray-300 px-3 py-2">Title</th>
                  <th className="border border-gray-300 px-3 py-2">Description</th>
                  <th className="border border-gray-300 px-3 py-2">Published</th>
                  <th className="border border-gray-300 px-3 py-2">Order</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map(chapter => (
                  <tr key={`${chapter.id}-${chapter.title}`} className={
                    duplicateChapters.some(d => d.id === chapter.id) ? 'bg-red-50' : ''
                  }>
                    <td className="border border-gray-300 px-3 py-2">{chapter.id}</td>
                    <td className="border border-gray-300 px-3 py-2">{chapter.title}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{chapter.description?.substring(0, 100)}...</td>
                    <td className="border border-gray-300 px-3 py-2">{chapter.is_published ? '✅' : '❌'}</td>
                    <td className="border border-gray-300 px-3 py-2">{chapter.order_index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lessons for chapters 3-6 */}
        <div>
          <h3 className="font-semibold mb-2">Lessons for Chapters 3-6</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2">Lesson ID</th>
                  <th className="border border-gray-300 px-3 py-2">Chapter ID</th>
                  <th className="border border-gray-300 px-3 py-2">Title</th>
                  <th className="border border-gray-300 px-3 py-2">Published</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map(lesson => (
                  <tr key={lesson.id}>
                    <td className="border border-gray-300 px-3 py-2">{lesson.id}</td>
                    <td className="border border-gray-300 px-3 py-2">{lesson.chapter_id}</td>
                    <td className="border border-gray-300 px-3 py-2">{lesson.title}</td>
                    <td className="border border-gray-300 px-3 py-2">{lesson.is_published ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cleanup Section */}
        {duplicateChapters.length > 0 && (
          <div className="bg-yellow-50 p-4 border border-yellow-300 rounded">
            <h3 className="font-semibold mb-2 text-yellow-800">Cleanup Required</h3>
            <p className="text-yellow-700 mb-3">
              Duplicate chapters detected. Click below to clean up chapters 3-6 completely.
            </p>
            <button
              onClick={cleanupDuplicates}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Cleaning up...' : 'Clean Up Duplicates'}
            </button>
            {cleanupResult && (
              <div className="mt-3 p-2 bg-white border rounded">
                <p className="text-sm">{cleanupResult}</p>
              </div>
            )}
          </div>
        )}

        {chapters.length <= 2 && (
          <div className="bg-green-50 p-4 border border-green-300 rounded">
            <h3 className="font-semibold mb-2 text-green-800">✅ Database Clean</h3>
            <p className="text-green-700">
              Only {chapters.length} chapters found. Ready to build chapters 3-6 using Chapter Builder Agent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};