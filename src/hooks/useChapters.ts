
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon?: string;
  order_index: number;
  is_published: boolean;
}

export const useChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching chapters:', error);
        setError(error.message);
      } else {
        setChapters(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  return { chapters, loading, error };
};
