
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useChatEngagement = (elementId: number, lessonId: number, onChatEngagementChange?: (engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => void) => {
  const { user } = useAuth();
  const [chatEngagement, setChatEngagement] = useState<{
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }>({
    hasReachedMinimum: false,
    exchangeCount: 0
  });

  useEffect(() => {
    if (user) {
      loadChatEngagement();
    }
  }, [user, elementId, lessonId]);

  const loadChatEngagement = async () => {
    if (!user) return;

    try {
      console.log(`useChatEngagement: Loading chat engagement for element ${elementId}, lesson ${lessonId}`);
      
      const { data: conversationData, error: convError } = await supabase
        .from('chat_conversations')
        .select('id, message_count')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (convError) throw convError;

      let totalExchanges = 0;
      if (conversationData && conversationData.length > 0) {
        totalExchanges = Math.floor(conversationData.reduce((sum, conv) => sum + conv.message_count, 0) / 2);
      }

      console.log(`useChatEngagement: Found ${totalExchanges} chat exchanges for element ${elementId}`);

      const hasReachedMinimum = totalExchanges >= 3;
      
      const newEngagement = {
        exchangeCount: totalExchanges,
        hasReachedMinimum
      };

      console.log(`useChatEngagement: Setting engagement for element ${elementId}:`, newEngagement);
      
      setChatEngagement(newEngagement);
      onChatEngagementChange?.(newEngagement);

      return newEngagement;
    } catch (error: any) {
      console.error('Error loading chat engagement:', error);
      return chatEngagement;
    }
  };

  const handleChatEngagementChange = (engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => {
    console.log(`useChatEngagement: Chat engagement changed for element ${elementId}:`, engagement);
    setChatEngagement(engagement);
    onChatEngagementChange?.(engagement);
  };

  return {
    chatEngagement,
    setChatEngagement,
    handleChatEngagementChange,
    loadChatEngagement
  };
};
