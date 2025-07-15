
import { useState, useCallback } from 'react';

interface ChatEngagement {
  exchangeCount: number;
  hasReachedMinimum: boolean;
  shouldShowAiDemo: boolean;
}

export const useChatEngagement = (minimumExchanges: number = 3, initialCount: number = 0) => {
  const [engagement, setEngagement] = useState<ChatEngagement>({
    exchangeCount: initialCount,
    hasReachedMinimum: initialCount >= minimumExchanges,
    shouldShowAiDemo: initialCount >= 4
  });

  const incrementExchange = useCallback(() => {
    setEngagement(prev => {
      const newCount = prev.exchangeCount + 1;
      return {
        exchangeCount: newCount,
        hasReachedMinimum: newCount >= minimumExchanges,
        shouldShowAiDemo: newCount >= 4
      };
    });
  }, [minimumExchanges]);

  const resetEngagement = useCallback(() => {
    setEngagement({
      exchangeCount: 0,
      hasReachedMinimum: false,
      shouldShowAiDemo: false
    });
  }, []);

  const setEngagementCount = useCallback((count: number) => {
    setEngagement({
      exchangeCount: count,
      hasReachedMinimum: count >= minimumExchanges,
      shouldShowAiDemo: count >= 4
    });
  }, [minimumExchanges]);

  return {
    engagement,
    incrementExchange,
    resetEngagement,
    setEngagementCount
  };
};
