import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalChatContextType {
  isGlobalChatExpanded: boolean;
  setIsGlobalChatExpanded: (expanded: boolean) => void;
  conversationId: string;
  generateNewConversation: () => void;
}

const GlobalChatContext = createContext<GlobalChatContextType | undefined>(undefined);

interface GlobalChatProviderProps {
  children: ReactNode;
}

export const GlobalChatProvider: React.FC<GlobalChatProviderProps> = ({ children }) => {
  const [isGlobalChatExpanded, setIsGlobalChatExpanded] = useState(false);
  const [conversationId, setConversationId] = useState(() => 
    `global-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  const generateNewConversation = () => {
    setConversationId(`global-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  };

  return (
    <GlobalChatContext.Provider value={{
      isGlobalChatExpanded,
      setIsGlobalChatExpanded,
      conversationId,
      generateNewConversation
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