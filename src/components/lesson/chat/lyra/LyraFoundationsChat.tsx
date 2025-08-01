import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Lightbulb,
  Coffee,
  BookOpen,
  Handshake
} from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useLyraChat } from '@/hooks/useLyraChat';
import { ChatMessage } from '../shared/ChatMessage';
import { cn } from '@/lib/utils';

interface LyraFoundationsChatProps {
  className?: string;
  onEngagementChange?: (hasEngaged: boolean) => void;
  embedded?: boolean;
}

// Lyra's personality-driven conversation starters
const conversationStarters = [
  {
    id: 'intro',
    icon: Heart,
    title: "Tell me about yourself",
    prompt: "I'd love to learn about you and your role in the nonprofit world! What drew you to mission-driven work?",
    category: "Personal Connection",
    color: "from-pink-500 to-rose-400"
  },
  {
    id: 'mission',
    icon: Target,
    title: "Your organization's mission",
    prompt: "What's the mission that drives your organization? I'm excited to understand how AI might amplify your impact!",
    category: "Mission Alignment",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 'challenges',
    icon: Lightbulb,
    title: "Daily work challenges",
    prompt: "What are some of the biggest challenges you face in your nonprofit work day-to-day? Let's explore how AI might help!",
    category: "Problem Solving",
    color: "from-amber-500 to-orange-400"
  },
  {
    id: 'communication',
    icon: Users,
    title: "Communication hurdles",
    prompt: "Communication is so important in nonprofit work! What communication challenges do you encounter with donors, volunteers, or beneficiaries?",
    category: "Communication",
    color: "from-green-500 to-emerald-400"
  },
  {
    id: 'ai-experience',
    icon: Sparkles,
    title: "AI experience & concerns",
    prompt: "Have you used any AI tools before? I'd love to hear about your experiences and any concerns you might have!",
    category: "AI Readiness",
    color: "from-purple-500 to-indigo-400"
  },
  {
    id: 'collaboration',
    icon: Handshake,
    title: "Team collaboration",
    prompt: "How does your team currently collaborate on projects? I'm curious about your workflow and where AI might fit in naturally!",
    category: "Workflow",
    color: "from-teal-500 to-cyan-400"
  }
];

// Lyra's encouraging responses based on conversation topics
const lyraResponses = {
  intro: [
    "Thank you for sharing! Your passion for nonprofit work really shines through. This journey we're starting together will help you channel that passion through AI tools.",
    "It's wonderful to meet you! I can already see how dedicated you are to making a difference. Let's explore how AI can be your ally in that mission.",
    "I love hearing about people's paths to nonprofit work - there's always such heart behind it. I'm here to help you leverage technology without losing that human touch."
  ],
  mission: [
    "What an inspiring mission! I can see so many ways AI could help amplify this work. Shall we talk about specific areas where you'd like to see more impact?",
    "That's exactly the kind of mission that gets me excited about AI's potential! The combination of your purpose and smart technology could be incredibly powerful.",
    "Your mission resonates deeply with me. AI isn't about replacing the human element - it's about giving you more time and tools to focus on what matters most to your community."
  ],
  challenges: [
    "Those challenges are so common in nonprofit work, and you're definitely not alone in facing them! The good news is that AI can often help streamline these exact pain points.",
    "I hear you on these challenges - they're exactly why I'm passionate about helping nonprofits discover AI solutions. Let's brainstorm some approaches together!",
    "Thank you for being so open about these challenges. That's the first step toward finding solutions, and I'm excited to explore AI tools that could make your work easier."
  ],
  communication: [
    "Communication is the heartbeat of nonprofit work, isn't it? I'm excited to show you how AI can help you craft more compelling, personalized messages without losing your authentic voice.",
    "These communication challenges are so universal in the nonprofit sector! AI can be like having a writing partner who understands your mission and helps you express it more effectively.",
    "You've touched on something crucial - effective communication can make or break nonprofit success. Let's explore how AI can help you connect more powerfully with your audiences."
  ],
  'ai-experience': [
    "Thank you for sharing your AI experience honestly! Whether you're new to AI or have some concerns, this is exactly the right place to start. We'll go step by step together.",
    "I appreciate your openness about AI! My goal is to help you feel confident and excited about these tools, not overwhelmed. We'll focus on practical, mission-aligned applications.",
    "Your perspective on AI is valuable, and any concerns you have are completely valid. I'm here to help you navigate this technology in a way that feels authentic to your nonprofit values."
  ],
  collaboration: [
    "Your team collaboration sounds like it has great potential for AI enhancement! I love thinking about how technology can strengthen existing workflows rather than disrupting them.",
    "Team dynamics are so important, and AI can actually improve collaboration when implemented thoughtfully. Shall we explore some specific tools that could help your team work even better together?",
    "It sounds like you have a solid foundation for teamwork - that's perfect for integrating AI tools! The best AI implementations build on existing strengths rather than starting from scratch."
  ]
};

export const LyraFoundationsChat: React.FC<LyraFoundationsChatProps> = ({
  className,
  onEngagementChange,
  embedded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);
  const [hasEngaged, setHasEngaged] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const {
    messages,
    sendMessage,
    clearChat
  } = useLyraChat({
    chapterTitle: "Chapter 1: AI Foundations",
    lessonTitle: "Meet Lyra & AI Foundations",
    content: "Introductory chat with Lyra about AI in nonprofit work"
  });

  useEffect(() => {
    if (messages.length > 0 && !hasEngaged) {
      setHasEngaged(true);
      onEngagementChange?.(true);
    }
  }, [messages.length, hasEngaged, onEngagementChange]);

  const handleStarterClick = async (starter: typeof conversationStarters[0]) => {
    setSelectedStarter(starter.id);
    setIsTyping(true);
    
    // Send the user's implied question
    await sendMessage(starter.prompt);
    
    // Simulate Lyra typing a personalized response
    setTimeout(async () => {
      const responses = lyraResponses[starter.id as keyof typeof lyraResponses] || lyraResponses.intro;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // This would typically call your AI Edge Function
      // For now, using the predefined responses
      await sendMessage(`${randomResponse}\n\nWhat would you like to explore next? I'm here to help you understand how AI can support your specific nonprofit goals!`);
      setIsTyping(false);
    }, 2000);
  };

  const handleCustomMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    setInputValue('');
    setIsTyping(true);
    
    await sendMessage(userMessage);
    
    // Simulate Lyra's encouraging response
    setTimeout(async () => {
      const encouragingResponses = [
        "That's a great question! I love how you're thinking about this. Here's what I'd suggest...",
        "I can hear the passion in your question! This is exactly the kind of thinking that leads to AI success in nonprofits...",
        "What an insightful question! You're asking exactly the right things. Let me share some thoughts...",
        "I'm excited by your curiosity! This shows you're ready to embrace AI as a tool for good. Here's my perspective..."
      ];
      
      const response = encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
      await sendMessage(response);
      setIsTyping(false);
    }, 1500);
  };

  if (!isExpanded && embedded) {
    return (
      <motion.div
        className={cn("relative group", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="premium-card interactive-hover brand-shadow-md cursor-pointer"
              onClick={() => setIsExpanded(true)}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <LyraAvatar size="md" withWave={true} />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 brand-gradient-text">
                  Chat with Lyra
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Let's have a friendly conversation about you, your nonprofit work, and how AI can help amplify your mission!
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    Personal & Mission-Focused
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Interactive
                  </Badge>
                </div>
              </div>
              <Button className="premium-button-primary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chat Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <LyraAvatar size="lg" withWave={true} className="mx-auto" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold brand-gradient-text mb-2">
            Let's Get to Know Each Other!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm excited to learn about you and your nonprofit work! Choose a conversation starter below, 
            or just start typing. This is a safe space to share your experiences, challenges, and dreams 
            for how AI might help your mission.
          </p>
        </div>
      </div>

      {/* Conversation Starters */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">
            What would you like to talk about?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversationStarters.map((starter, index) => (
              <motion.div
                key={starter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className="premium-card interactive-hover cursor-pointer group h-full"
                  onClick={() => handleStarterClick(starter)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${starter.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <starter.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs mb-2">
                          {starter.category}
                        </Badge>
                        <h4 className="font-semibold text-sm mb-2">
                          {starter.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {starter.prompt}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    characterName: message.isUser ? undefined : "Lyra"
                  }}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <LyraAvatar size="sm" withWave={false} />
                  <div className="bg-gradient-to-r from-brand-cyan/10 to-brand-purple/10 p-3 rounded-lg rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-brand-cyan rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-brand-cyan rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-brand-cyan rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">Lyra is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Input */}
      <Card className="premium-card">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Share your thoughts, ask questions, or tell me about your nonprofit work..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomMessage();
                }
              }}
              disabled={isTyping}
            />
            <Button
              onClick={handleCustomMessage}
              disabled={!inputValue.trim() || isTyping}
              className="premium-button-primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>Press Enter to send • This is a safe, supportive space</span>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs"
              >
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Encouragement Footer */}
      <motion.div
        className="text-center p-4 bg-gradient-to-r from-brand-cyan/5 to-brand-purple/5 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coffee className="w-4 h-4 text-brand-cyan" />
          <span className="text-sm font-medium">Lyra's Promise</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          I'm here to listen, learn, and help you discover how AI can amplify your nonprofit's impact. 
          There are no wrong questions, and every conversation helps us both grow!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LyraFoundationsChat;