
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
    console.log('useChatEngagement: Incrementing exchange count from', exchangeCount);
    setExchangeCount(prev => {
      const newCount = prev + 1;
      console.log('useChatEngagement: New exchange count:', newCount);
      return newCount;
    });
  }, [exchangeCount]);

  const resetEngagement = useCallback(() => {
    console.log('useChatEngagement: Resetting engagement to 0');
    setExchangeCount(0);
  }, []);

  const setEngagementCount = useCallback((count: number) => {
    console.log('useChatEngagement: Setting engagement count to:', count);
    setExchangeCount(count);
  }, []);

  const engagement: ChatEngagement = {
    exchangeCount,
    hasReachedMinimum: exchangeCount >= minimumExchanges,
    shouldShowEncouragement: exchangeCount > 0 && exchangeCount < minimumExchanges,
    shouldShowCompletion: exchangeCount >= minimumExchanges
  };

  console.log('useChatEngagement: Current engagement state:', engagement);

  return {
    engagement,
    incrementExchange,
    resetEngagement,
    setEngagementCount
  };
};
