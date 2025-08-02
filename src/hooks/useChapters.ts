
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

import { Chapter } from '@/types/lesson';

export const useChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      console.log('🔍 useChapters: Fetching chapters from database...');
      
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      console.log('📊 useChapters: Database response:', { data, error });

      if (error) {
        console.error('❌ useChapters: Error fetching chapters:', error);
        setError(error.message);
      } else {
        console.log('✅ useChapters: Successfully fetched chapters:', data);
        console.log('📝 useChapters: Chapter details:');
        (data || []).forEach(chapter => {
          console.log(`  📖 Chapter ${chapter.id}: "${chapter.title}" (published: ${chapter.is_published})`);
        });
        setChapters(data || []);
      }
    } catch (err) {
      console.error('💥 useChapters: Unexpected error:', err);
      setError('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  return { chapters, loading, error };
};
