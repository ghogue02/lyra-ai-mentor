
import { useState, useCallback } from 'react';

interface ChatEngagement {
  exchangeCount: number;
  hasReachedMinimum: boolean;
  shouldShowEncouragement: boolean;
  shouldShowCompletion: boolean;
}

export const useChatEngagement = (minimumExchanges: number = 3, initialCount: number = 0) => {
  const [exchangeCount, setExchangeCount] = useState(initialCount);

  const incrementExchange = useCallback(() => {
    setExchangeCount(prev => prev + 1);
  }, []);

  const resetEngagement = useCallback(() => {
    setExchangeCount(0);
  }, []);

  const setEngagementCount = useCallback((count: number) => {
    console.log('Setting engagement count to:', count);
    setExchangeCount(count);
  }, []);

  const engagement: ChatEngagement = {
    exchangeCount,
    hasReachedMinimum: exchangeCount >= minimumExchanges,
    shouldShowEncouragement: exchangeCount > 0 && exchangeCount < minimumExchanges,
    shouldShowCompletion: exchangeCount >= minimumExchanges
  };

  return {
    engagement,
    incrementExchange,
    resetEngagement,
    setEngagementCount
  };
};
