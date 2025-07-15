
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Clock, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  mostActiveLesson: string;
  totalChatTime: string;
}

export const ChatAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChatStats();
    }
  }, [user]);

  const fetchChatStats = async () => {
    if (!user) return;

    try {
      // Get conversation stats
      const { data: conversations, error: convError } = await supabase
        .from('chat_conversations')
        .select('lesson_id, chapter_id, message_count, started_at, last_message_at')
        .eq('user_id', user.id);

      if (convError) throw convError;

      // Get total message count
      const { count: totalMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (msgError) throw msgError;

      if (conversations && conversations.length > 0) {
        const totalConversations = conversations.length;
        const averageMessagesPerConversation = Math.round(
          conversations.reduce((sum, conv) => sum + conv.message_count, 0) / totalConversations
        );

        // Find most active lesson
        const lessonActivity = conversations.reduce((acc: Record<string, number>, conv) => {
          const key = `Chapter ${conv.chapter_id}, Lesson ${conv.lesson_id}`;
          acc[key] = (acc[key] || 0) + conv.message_count;
          return acc;
        }, {});

        const mostActiveLesson = Object.entries(lessonActivity)
          .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

        // Calculate approximate total chat time (rough estimate)
        const totalMinutes = conversations.reduce((sum, conv) => {
          const start = new Date(conv.started_at);
          const end = new Date(conv.last_message_at);
          const diffMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));
          return sum + diffMinutes;
        }, 0);

        const totalChatTime = totalMinutes > 60 
          ? `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`
          : `${totalMinutes}m`;

        setStats({
          totalConversations,
          totalMessages: totalMessages || 0,
          averageMessagesPerConversation,
          mostActiveLesson,
          totalChatTime
        });
      } else {
        setStats({
          totalConversations: 0,
          totalMessages: 0,
          averageMessagesPerConversation: 0,
          mostActiveLesson: 'None',
          totalChatTime: '0m'
        });
      }
    } catch (error) {
      console.error('Error fetching chat stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Chat Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Chat Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Conversations</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalConversations}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium">Messages</span>
            </div>
            <div className="text-2xl font-bold text-cyan-600">{stats.totalMessages}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Avg per Chat</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.averageMessagesPerConversation}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Total Time</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.totalChatTime}</div>
          </div>
        </div>
        
        {stats.mostActiveLesson !== 'None' && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Most Active:</p>
            <Badge variant="outline" className="text-xs">
              {stats.mostActiveLesson}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
