import React from 'react';

// This component is now simplified - we keep the blocking logic but remove the visual clutter
interface ContentBlockerProps {
  chatEngagement: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
  blockedItemsCount: number;
}

export const ContentBlocker: React.FC<ContentBlockerProps> = () => {
  // Return null - we're removing the visual blocking notification
  // The actual blocking logic remains in the parent component
  return null;
};
