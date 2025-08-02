import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GlobalChatContextType {
  isGlobalChatExpanded: boolean;
  setIsGlobalChatExpanded: (expanded: boolean) => void;
  conversationId: string;
  generateNewConversation: () => void;
  lastContextKey: string | null;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

interface GlobalChatProviderProps {
  children: ReactNode;
}

export const GlobalChatProvider: React.FC<GlobalChatProviderProps> = ({ children }) => {
  const location = useLocation();
  const [isGlobalChatExpanded, setIsGlobalChatExpanded] = useState(false);
  const [conversationId, setConversationId] = useState(() => 
    `global-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [lastContextKey, setLastContextKey] = useState<string | null>(null);

  // Generate a context key that represents the current learning context
  const generateContextKey = (pathname: string): string => {
    // Extract meaningful context from the current route
    if (pathname.match(/^\/chapter\/(\d+)\/interactive\/(.+)$/)) {
      const match = pathname.match(/^\/chapter\/(\d+)\/interactive\/(.+)$/);
      return `chapter-${match?.[1]}-lesson-${match?.[2]}`;
    }
    if (pathname.match(/^\/chapter\/(\d+)$/)) {
      const match = pathname.match(/^\/chapter\/(\d+)$/);
      return `chapter-${match?.[1]}-hub`;
    }
    if (pathname === '/' || pathname === '/dashboard') {
      return 'dashboard';
    }
    if (pathname === '/profile') {
      return 'profile';
    }
    return 'general';
  };

  const generateNewConversation = () => {
    setConversationId(`global-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  };

  // Auto-generate new conversation when context changes significantly
  useEffect(() => {
    const currentContextKey = generateContextKey(location.pathname);
    
    // If this is a significant context change, reset the conversation
    if (lastContextKey && lastContextKey !== currentContextKey) {
      // Only reset if moving between different chapters or major sections
      const isSignificantChange = 
        lastContextKey.includes('chapter-') !== currentContextKey.includes('chapter-') ||
        (lastContextKey.includes('chapter-') && currentContextKey.includes('chapter-') && 
         lastContextKey.split('-')[1] !== currentContextKey.split('-')[1]) ||
        (lastContextKey.includes('lesson-') && currentContextKey.includes('lesson-') &&
         lastContextKey !== currentContextKey);
         
      if (isSignificantChange) {
        generateNewConversation();
      }
    }
    
    setLastContextKey(currentContextKey);
  }, [location.pathname, lastContextKey]);

  return (
    <GlobalChatContext.Provider value={{
      isGlobalChatExpanded,
      setIsGlobalChatExpanded,
      conversationId,
      generateNewConversation,
      lastContextKey
    }}>
      {children}
    </GlobalChatContext.Provider>
  );
};

export const useGlobalChat = () => {
  const context = useContext(GlobalChatContext);
  if (context === undefined) {
    throw new Error('useGlobalChat must be used within a GlobalChatProvider');
  }
  return context;
};