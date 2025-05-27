
import { usePersistentChat } from './usePersistentChat';
import { useParams } from 'react-router-dom';

interface LessonContext {
  chapterTitle?: string;
  lessonTitle?: string;
  content?: string;
}

export const useLyraChat = (lessonContext?: LessonContext) => {
  const { chapterId, lessonId } = useParams();
  
  const chapterIdNum = chapterId ? parseInt(chapterId) : 1;
  const lessonIdNum = lessonId ? parseInt(lessonId) : 1;

  return usePersistentChat(lessonIdNum, chapterIdNum, lessonContext);
};
</tml>

Let me create a ChatHistory component for viewing past conversations:

<lov-write file_path="src/components/ChatHistory.tsx">
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, MessageCircle, Calendar, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LyraAvatar } from './LyraAvatar';
import { cn } from '@/lib/utils';

interface ChatConversation {
  id: string;
  lesson_id: number;
  chapter_id: number;
  title: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
}

interface ChatMessage {
  id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
}

export const ChatHistory: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('message_order', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
      setMessages([]);
    } else {
      setSelectedConversation(conversationId);
      fetchMessages(conversationId);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat History
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No chat conversations yet</p>
            <p className="text-sm">Start chatting with Lyra in any lesson!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Collapsible key={conversation.id}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className="flex items-start gap-3 text-left">
                      <LyraAvatar size="sm" withWave={false} />
                      <div>
                        <h4 className="font-medium text-sm">{conversation.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(conversation.last_message_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {conversation.message_count} messages
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          Chapter {conversation.chapter_id} • Lesson {conversation.lesson_id}
                        </Badge>
                      </div>
                    </div>
                    {selectedConversation === conversation.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {selectedConversation === conversation.id && (
                    <div className="mt-3 ml-4 border-l-2 border-gray-100 pl-4">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        </div>
                      ) : (
                        <ScrollArea className="h-64 pr-4">
                          <div className="space-y-3">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex",
                                  message.is_user_message ? "justify-end" : "justify-start"
                                )}
                              >
                                <div className={cn(
                                  "flex items-start gap-2 max-w-[85%]",
                                  message.is_user_message && "flex-row-reverse"
                                )}>
                                  {!message.is_user_message && (
                                    <LyraAvatar size="xs" withWave={false} className="mt-1" />
                                  )}
                                  <div
                                    className={cn(
                                      "p-2 rounded-lg text-xs leading-relaxed",
                                      message.is_user_message
                                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-br-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                                    )}
                                  >
                                    {message.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
